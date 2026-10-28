/**
 * Collaborateurs screen: employees are per site, so the tests cover site
 * resolution, the create/edit payload split, and the ban/reactivate toggle.
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

let mockUser = { role: 'client' };

jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Icon = () => React.createElement(View);

  return {
    __esModule: true,
    Ban: Icon,
    Check: Icon,
    Edit3: Icon,
    Eye: Icon,
    EyeOff: Icon,
    Plus: Icon,
    RotateCcw: Icon,
    UserRound: Icon,
    X: Icon,
  };
});

global.IS_REACT_ACT_ENVIRONMENT = true;
jest.setTimeout(20000);

import { Alert } from 'react-native';
import { act, create } from 'react-test-renderer';
import ClientEmployees from '../src/screens/client/components/ClientEmployees';
import { ClientThemeProvider } from '../src/screens/client/theme/ClientThemeContext';
import { SitesProvider } from '../src/screens/client/state/SitesContext';

const SPACES = [
  { id: 7, space_name: 'Rivoli' },
  { id: 8, space_name: 'Oberkampf' },
];

const EMPLOYEES_BY_SITE = {
  7: {
    employees: [
      {
        employee_id: 31,
        status: 'active',
        user_id: 52,
        firstname: 'Karim',
        name: 'Haddad',
        email: 'karim@bookly.fr',
        phone: '0699887766',
        profile_photo_url: null,
      },
      {
        employee_id: 32,
        status: 'blocked',
        user_id: 53,
        firstname: 'Lina',
        name: 'Moreau',
        email: 'lina@bookly.fr',
        phone: null,
        profile_photo_url: null,
      },
    ],
    count: 2,
    max_per_site: 3,
    slots_left: 1,
  },
  8: {
    employees: [],
    count: 0,
    max_per_site: 3,
    slots_left: 3,
  },
};

function json(body, status = 200) {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  };
}

function mockApi() {
  global.fetch = jest.fn(async (url, init = {}) => {
    const method = (init.method || 'GET').toUpperCase();
    const siteMatch = url.match(/\/api\/sites\/(\d+)\/employees$/);
    const employeeMatch = url.match(/\/api\/employees\/(\d+)(\/status)?$/);

    if (url.endsWith('/api/client/profile') && method === 'GET') {
      return json({ personal_info: { id: 5 }, spaces: SPACES });
    }
    if (siteMatch && method === 'GET') {
      return json(EMPLOYEES_BY_SITE[siteMatch[1]] || EMPLOYEES_BY_SITE[7]);
    }
    if (siteMatch && method === 'POST') {
      return json({ message: 'Employé créé et rattaché au site.' }, 201);
    }
    if (employeeMatch && employeeMatch[2] && method === 'PATCH') {
      return json({ message: 'Employé banni.', status: 'blocked' });
    }
    if (employeeMatch && method === 'PUT') {
      return json({ message: 'Profil employé mis à jour.' });
    }

    throw new Error(`unexpected ${method} ${url}`);
  });
}

async function render(brand = 'bookly') {
  let tree;
  await act(async () => {
    tree = create(
      <ClientThemeProvider partner={brand}>
        <SitesProvider>
          <ClientEmployees />
        </SitesProvider>
      </ClientThemeProvider>,
    );
  });
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
  return tree;
}

function text(tree) {
  return JSON.stringify(tree.toJSON());
}

function pressableByLabel(tree, label) {
  const matches = tree.root.findAll(
    node =>
      node.props?.accessibilityLabel === label && typeof node.props?.onPress === 'function',
  );
  return matches[matches.length - 1];
}

function allLabels(tree) {
  return tree.root
    .findAll(node => typeof node.props?.accessibilityLabel === 'string')
    .map(node => node.props.accessibilityLabel);
}

beforeEach(() => {
  mockUser = { role: 'client' };
  mockDisk.clear();
});

afterEach(() => {
  jest.clearAllMocks();
});

it('loads the first site of the client and lists its employees', async () => {
  mockApi();

  const tree = await render();

  expect(global.fetch.mock.calls[0][0]).toMatch(/\/api\/client\/profile$/);
  expect(global.fetch.mock.calls[1][0]).toMatch(/\/api\/sites\/7\/employees$/);

  expect(text(tree)).toContain('Karim Haddad');
  expect(text(tree)).toContain('Lina Moreau');
  expect(text(tree)).toContain('ACTIF');
  expect(text(tree)).toContain('BANNI');
  expect(allLabels(tree)).toContain('2 sur 3 collaborateurs');
});

it('switches site from the chip row', async () => {
  mockApi();
  const tree = await render();

  await act(async () => {
    pressableByLabel(tree, 'Collaborateurs du site Oberkampf').props.onPress();
  });
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

  const called = global.fetch.mock.calls.some(([url]) =>
    /\/api\/sites\/8\/employees$/.test(url),
  );
  expect(called).toBe(true);
});

it('creates an employee under the active site with a password', async () => {
  mockApi();
  const tree = await render();

  await act(async () => {
    pressableByLabel(tree, 'Ajouter un collaborateur').props.onPress();
  });

  const setInput = (label, value) => {
    const input = tree.root.findAll(
      node => node.props?.accessibilityLabel === label && node.props?.onChangeText,
    )[0];
    input.props.onChangeText(value);
  };

  await act(async () => {
    setInput('Prénom', 'Nadia');
    setInput('Nom', 'Roux');
    setInput('Email', 'Nadia@Bookly.FR');
    setInput('Téléphone (optionnel)', '0611223344');
    setInput('Mot de passe', 'secret123');
    setInput('Confirmer le mot de passe', 'secret123');
  });

  await act(async () => {
    pressableByLabel(tree, 'Créer le collaborateur').props.onPress();
  });

  const post = global.fetch.mock.calls.find(
    ([url, init]) => /\/api\/sites\/7\/employees$/.test(url) && init?.method === 'POST',
  );

  expect(post).toBeDefined();
  expect(JSON.parse(post[1].body)).toEqual({
    firstname: 'Nadia',
    name: 'Roux',
    email: 'nadia@bookly.fr',
    phone: '0611223344',
    password: 'secret123',
    password_confirmation: 'secret123',
  });
});

it('edits without asking for a password', async () => {
  mockApi();
  const tree = await render();

  await act(async () => {
    pressableByLabel(tree, 'Modifier Karim Haddad').props.onPress();
  });

  // The password fields only exist when creating.
  const labels = allLabels(tree);
  expect(labels).not.toContain('Mot de passe');

  await act(async () => {
    pressableByLabel(tree, 'Enregistrer le collaborateur').props.onPress();
  });

  const put = global.fetch.mock.calls.find(([, init]) => init?.method === 'PUT');

  expect(put).toBeDefined();
  expect(put[0]).toMatch(/\/api\/employees\/31$/);
  const body = JSON.parse(put[1].body);
  expect(body.password).toBeUndefined();
  expect(body.firstname).toBe('Karim');
});

it('bans an active employee after confirmation', async () => {
  mockApi();
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
    buttons?.[1]?.onPress?.();
  });

  const tree = await render();

  await act(async () => {
    pressableByLabel(tree, 'Bannir Karim Haddad').props.onPress();
  });
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

  expect(alertSpy).toHaveBeenCalled();
  const patch = global.fetch.mock.calls.find(([, init]) => init?.method === 'PATCH');

  expect(patch).toBeDefined();
  expect(patch[0]).toMatch(/\/api\/employees\/31\/status$/);
  expect(JSON.parse(patch[1].body)).toEqual({ status: 'blocked' });

  alertSpy.mockRestore();
});

it('offers reactivation for a blocked employee', async () => {
  mockApi();
  const tree = await render();

  expect(allLabels(tree)).toContain('Réactiver Lina Moreau');
});

it('hides every management control from an employee account', async () => {
  mockUser = { role: 'sous_client' };
  mockApi();

  const tree = await render();

  const labels = allLabels(tree);
  expect(labels).not.toContain('Ajouter un collaborateur');
  expect(labels).not.toContain('Modifier Karim Haddad');
  expect(labels).not.toContain('Bannir Karim Haddad');

  // The list itself is still visible.
  expect(text(tree)).toContain('Karim Haddad');
});
