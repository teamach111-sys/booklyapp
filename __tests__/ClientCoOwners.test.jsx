/**
 * Co-owners screen: it must list from the API, only allow removal for
 * non-primary rows, and post the payload the backend validates.
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

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Icon = () => React.createElement(View);

  return {
    __esModule: true,
    Check: Icon,
    Eye: Icon,
    EyeOff: Icon,
    Plus: Icon,
    Trash2: Icon,
    UserRound: Icon,
    X: Icon,
  };
});

global.IS_REACT_ACT_ENVIRONMENT = true;
jest.setTimeout(20000);

import { Alert } from 'react-native';
import { act, create } from 'react-test-renderer';
import ClientCoOwners from '../src/screens/client/components/ClientCoOwners';
import { ClientThemeProvider } from '../src/screens/client/theme/ClientThemeContext';

const LIST = {
  co_owners: [
    {
      id: 'primary',
      user_id: 5,
      firstname: 'Amina',
      name: 'Bensalem',
      email: 'amina@bookly.fr',
      is_primary: true,
      status: 'active',
    },
    {
      id: 31,
      user_id: 52,
      firstname: 'Karim',
      name: 'Haddad',
      email: 'karim@bookly.fr',
      is_primary: false,
      status: 'active',
    },
  ],
};

function json(body, status = 200) {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  };
}

function mockApi({ primary = true, list = LIST } = {}) {
  global.fetch = jest.fn(async (url, init = {}) => {
    const method = (init.method || 'GET').toUpperCase();

    if (url.endsWith('/api/client/co-owners') && method === 'GET') {
      return json(list);
    }
    if (url.endsWith('/api/client/profile')) {
      return json({ personal_info: { id: 5, is_primary_owner: primary } });
    }
    if (url.endsWith('/api/client/co-owners') && method === 'POST') {
      return json({ message: 'Co-propriétaire créé avec succès.' }, 201);
    }
    if (/\/api\/client\/co-owners\/\w+$/.test(url) && method === 'DELETE') {
      return json({ message: 'Co-propriétaire retiré.' });
    }

    throw new Error(`unexpected ${method} ${url}`);
  });
}

async function render(brand = 'bookly') {
  let tree;
  await act(async () => {
    tree = create(
      <ClientThemeProvider partner={brand}>
        <ClientCoOwners />
      </ClientThemeProvider>,
    );
  });
  // Let the parallel loads settle.
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
  return tree;
}

function text(tree) {
  return JSON.stringify(tree.toJSON());
}

function labelsStartingWith(tree, prefix) {
  const labels = tree.root
    .findAll(node => typeof node.props?.accessibilityLabel === 'string')
    .map(node => node.props.accessibilityLabel)
    .filter(label => label.startsWith(prefix));

  return [...new Set(labels)];
}

function pressableByLabel(tree, label) {
  const matches = tree.root.findAll(
    node =>
      node.props?.accessibilityLabel === label && typeof node.props?.onPress === 'function',
  );
  return matches[matches.length - 1];
}

beforeEach(() => {
  mockDisk.clear();
});

afterEach(() => {
  jest.clearAllMocks();
});

it('lists co-owners from the API with the right badges', async () => {
  mockApi();

  const tree = await render();

  expect(text(tree)).toContain('Amina Bensalem');
  expect(text(tree)).toContain('Karim Haddad');
  expect(text(tree)).toContain('TITULAIRE DU COMPTE');
  expect(text(tree)).toContain('ACCÈS COMPLET');
});

it('offers removal only for a removable co-owner', async () => {
  mockApi({ primary: true });

  const tree = await render();

  expect(labelsStartingWith(tree, 'Retirer ')).toEqual(['Retirer Karim Haddad']);
});

it('hides every removal control for a non-primary viewer', async () => {
  mockApi({ primary: false });

  const tree = await render();

  expect(labelsStartingWith(tree, 'Retirer ')).toEqual([]);
});

it('renders the same data under the staffly palette', async () => {
  mockApi();

  const tree = await render('staffly');

  expect(text(tree)).toContain('Karim Haddad');
});

it('creates a co-owner with the validated payload', async () => {
  mockApi();
  const tree = await render();

  await act(async () => {
    pressableByLabel(tree, 'Ajouter un co-propriétaire').props.onPress();
  });

  const setInput = (label, value) => {
    const input = tree.root.findAll(
      node => node.props?.accessibilityLabel === label && node.props?.onChangeText,
    )[0];
    input.props.onChangeText(value);
  };

  await act(async () => {
    setInput('Prénom', 'Karim');
    setInput('Nom', 'Haddad');
    setInput('Email', 'Karim@Bookly.FR');
    setInput('Téléphone (optionnel)', '06 11 22 33 44');
    setInput('Mot de passe', 'secret123');
    setInput('Confirmer le mot de passe', 'secret123');
  });

  await act(async () => {
    pressableByLabel(tree, 'Créer le co-propriétaire').props.onPress();
  });

  const post = global.fetch.mock.calls.find(
    ([url, init]) => url.endsWith('/client/co-owners') && init?.method === 'POST',
  );

  expect(post).toBeDefined();
  expect(JSON.parse(post[1].body)).toEqual({
    firstname: 'Karim',
    name: 'Haddad',
    email: 'karim@bookly.fr',
    phone: '06 11 22 33 44',
    password: 'secret123',
    password_confirmation: 'secret123',
  });
});

it('blocks creation locally when the form is incomplete', async () => {
  mockApi();
  const tree = await render();

  await act(async () => {
    pressableByLabel(tree, 'Ajouter un co-propriétaire').props.onPress();
  });

  await act(async () => {
    pressableByLabel(tree, 'Créer le co-propriétaire').props.onPress();
  });

  const posted = global.fetch.mock.calls.some(
    ([url, init]) => url.endsWith('/client/co-owners') && init?.method === 'POST',
  );

  expect(posted).toBe(false);
});

it('confirms before removing and then calls DELETE', async () => {
  mockApi();
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
    buttons?.[1]?.onPress?.();
  });

  const tree = await render();

  await act(async () => {
    pressableByLabel(tree, 'Retirer Karim Haddad').props.onPress();
  });
  await act(async () => {
    await Promise.resolve();
  });

  expect(alertSpy).toHaveBeenCalled();
  const del = global.fetch.mock.calls.find(
    ([, init]) => init?.method === 'DELETE',
  );

  expect(del).toBeDefined();
  expect(del[0]).toMatch(/\/api\/client\/co-owners\/31$/);

  alertSpy.mockRestore();
});
