/**
 * Client profile screen: it must load from the right endpoint for both
 * account kinds and render under both brand palettes.
 */

const mockDisk = new Map();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: async key => mockDisk.get(key) ?? null,
    setItem: async (key, value) => {
      mockDisk.set(key, value);
    },
    removeItem: async key => {
      mockDisk.delete(key);
    },
    getMany: async keys =>
      keys.reduce((acc, key) => {
        acc[key] = mockDisk.get(key) ?? null;
        return acc;
      }, {}),
    setMany: async entries => {
      Object.entries(entries).forEach(([key, value]) => mockDisk.set(key, value));
    },
    removeMany: async keys => {
      keys.forEach(key => mockDisk.delete(key));
    },
    getAllKeys: async () => Array.from(mockDisk.keys()),
    clear: async () => mockDisk.clear(),
  },
}));

let mockUser = { role: 'client', platform_partner: 'bookly' };

jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

// The icon package is huge to transform; the screen only needs placeholders.
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Icon = () => React.createElement(View);

  return {
    __esModule: true,
    Building2: Icon,
    Check: Icon,
    Edit3: Icon,
    Eye: Icon,
    EyeOff: Icon,
    LayoutGrid: Icon,
    Lock: Icon,
    Mail: Icon,
    MapPin: Icon,
    Phone: Icon,
    Save: Icon,
    User: Icon,
  };
});

global.IS_REACT_ACT_ENVIRONMENT = true;
jest.setTimeout(20000);

import { act, create } from 'react-test-renderer';
import Profile from '../src/screens/client/components/Profile';
import { ClientThemeProvider } from '../src/screens/client/theme/ClientThemeContext';

const CLIENT_PROFILE = {
  personal_info: {
    id: 12,
    firstname: 'Amina',
    name: 'Bensalem',
    email: 'amina@bookly.fr',
    phone: '0611223344',
    address: '12 rue de Rivoli, Paris',
    platform_partner: 'staffly',
    role: 'client',
  },
  business_info: {
    raison_sociale: 'Bensalem Traiteur',
    siret: '12345678900011',
    tva_number: 'FR123',
    billing_conditions: '30 jours fin de mois',
    tenue_staff: 'Costume noir',
  },
};

function json(response, status = 200) {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => response,
  };
}

async function render(brand = 'bookly') {
  let tree;
  await act(async () => {
    tree = create(
      <ClientThemeProvider partner={brand}>
        <Profile />
      </ClientThemeProvider>,
    );
  });
  // Let the fetch promise chain settle (load -> setState).
  await act(async () => {
    await Promise.resolve();
  });
  return tree;
}

function text(tree) {
  return JSON.stringify(tree.toJSON());
}

beforeEach(() => {
  mockUser = { role: 'client', platform_partner: 'bookly' };
  mockDisk.clear();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

it('loads a client account from /client/profile', async () => {
  global.fetch.mockResolvedValueOnce(json(CLIENT_PROFILE));

  const tree = await render();

  const [url, init] = global.fetch.mock.calls[0];
  expect(url).toMatch(/\/api\/client\/profile$/);
  expect(init.method ?? 'GET').toBe('GET');

  expect(text(tree)).toContain('Amina Bensalem');
  expect(text(tree)).toContain('amina@bookly.fr');
  expect(text(tree)).toContain('Bensalem Traiteur');
  expect(text(tree)).toContain('12345678900011');
});

it('loads an employee account from /employee/profile', async () => {
  mockUser = { role: 'sous_client', platform_partner: 'staffly' };
  global.fetch.mockResolvedValueOnce(
    json({
      personal_info: {
        id: 40,
        firstname: 'Karim',
        name: 'Haddad',
        email: 'karim@bookly.fr',
        phone: '0699887766',
        is_employee: true,
        role: 'sous_client',
      },
      business_info: { raison_sociale: 'Bensalem Traiteur' },
    }),
  );

  const tree = await render('staffly');

  expect(global.fetch.mock.calls[0][0]).toMatch(/\/api\/employee\/profile$/);
  expect(text(tree)).toContain('Karim Haddad');
  // Employees cannot edit company data, so that block is not rendered.
  expect(text(tree)).not.toContain('Raison sociale');
  expect(text(tree)).toContain('Employé');
});

it('shows the API error and a retry action when loading fails', async () => {
  global.fetch.mockResolvedValueOnce(json({ error: 'Profil client non trouvé' }, 500));

  const tree = await render();

  expect(text(tree)).toContain('Réessayer');
});

it('falls back to the other endpoint when the role is stale', async () => {
  // Session says client, but the account is actually an employee.
  global.fetch
    .mockResolvedValueOnce(json({ error: 'Profil client non trouvé' }, 404))
    .mockResolvedValueOnce(
      json({
        personal_info: { firstname: 'Karim', name: 'Haddad', email: 'k@b.fr', is_employee: true },
        business_info: {},
      }),
    );

  const tree = await render();

  expect(global.fetch.mock.calls[0][0]).toMatch(/\/client\/profile$/);
  expect(global.fetch.mock.calls[1][0]).toMatch(/\/employee\/profile$/);
  expect(text(tree)).toContain('Karim Haddad');
});
