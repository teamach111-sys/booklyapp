/**
 * Sites page + the shared site selection behind the drawer's "Site actif".
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
    Building2: Icon,
    CheckCircle2: Icon,
    Edit3: Icon,
    MapPin: Icon,
    Navigation: Icon,
    Plus: Icon,
    Power: Icon,
    Trash2: Icon,
    X: Icon,
  };
});

global.IS_REACT_ACT_ENVIRONMENT = true;
jest.setTimeout(20000);

import { Alert } from 'react-native';
import { act, create } from 'react-test-renderer';
import Espaces from '../src/screens/client/components/Espaces';
import { ClientThemeProvider } from '../src/screens/client/theme/ClientThemeContext';
import { SitesProvider, useClientSites } from '../src/screens/client/state/SitesContext';

const SPACES = [
  { id: 7, space_name: 'Rivoli', city: 'Rivoli', adresse: '12 rue de Rivoli', is_active: 1 },
  { id: 8, space_name: 'Oberkampf', city: 'Oberkampf', adresse: '9 rue Oberkampf', is_active: 1 },
  { id: 9, space_name: 'Lyon', city: 'Lyon', adresse: '', is_active: 0 },
];

let latestSites;

function Probe() {
  latestSites = useClientSites();
  return null;
}

function json(body, status = 200) {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  };
}

function mockApi({ spaces = SPACES } = {}) {
  global.fetch = jest.fn(async (url, init = {}) => {
    const method = (init.method || 'GET').toUpperCase();

    if (url.endsWith('/api/client/profile') && method === 'GET') {
      return json({ personal_info: { id: 5 }, spaces });
    }
    if (url.endsWith('/api/client/spaces') && method === 'POST') {
      return json({ message: 'Espace ajouté.' }, 201);
    }
    if (/\/api\/client\/spaces\/\d+\/toggle$/.test(url) && method === 'PATCH') {
      return json({ message: 'Espace désactivé.', is_active: 0 });
    }
    if (/\/api\/client\/spaces\/\d+$/.test(url) && method === 'PUT') {
      return json({ message: 'Espace mis à jour.' });
    }
    if (/\/api\/client\/spaces\/\d+$/.test(url) && method === 'DELETE') {
      return json({ message: 'Espace supprimé.' });
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
          <Probe />
          <Espaces />
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

function setInput(tree, label, value) {
  const input = tree.root.findAll(
    node => node.props?.accessibilityLabel === label && node.props?.onChangeText,
  )[0];
  input.props.onChangeText(value);
}

beforeEach(() => {
  mockDisk.clear();
  latestSites = null;
});

afterEach(() => {
  jest.clearAllMocks();
});

it('lists the client sites with their counters', async () => {
  mockApi();

  const tree = await render();

  expect(text(tree)).toContain('Rivoli');
  expect(text(tree)).toContain('Oberkampf');
  expect(text(tree)).toContain('Lyon');
  expect(text(tree)).toContain('Désactivé');
  expect(text(tree)).toContain('En cours');
});

it('selects the first enabled site as the active one', async () => {
  mockApi();

  await render();

  expect(latestSites.activeSiteId).toBe(7);
  expect(latestSites.activeSite.name).toBe('Rivoli');
});

it('only offers enabled sites as selectable', async () => {
  mockApi();

  await render();

  expect(latestSites.selectableSites.map(site => site.id)).toEqual([7, 8]);
});

it('switches the active site when a card is tapped', async () => {
  mockApi();
  const tree = await render();

  await act(async () => {
    pressableByLabel(tree, 'Sélectionner Oberkampf').props.onPress();
  });

  expect(latestSites.activeSiteId).toBe(8);
});

it('does not allow selecting a disabled site', async () => {
  mockApi();
  const tree = await render();

  const disabledCard = tree.root.findAll(
    node => node.props?.accessibilityLabel === 'Lyon est désactivé',
  )[0];

  expect(disabledCard.props.disabled).toBe(true);
});

it('creates a site and reloads the list', async () => {
  mockApi();
  const tree = await render();

  await act(async () => {
    pressableByLabel(tree, 'Ajouter un site').props.onPress();
  });

  await act(async () => {
    setInput(tree, 'Nom du site', '  Bastille ');
    setInput(tree, 'Adresse du site', ' 1 rue de la Roquette ');
    setInput(tree, 'Ville', 'Paris');
  });

  await act(async () => {
    pressableByLabel(tree, 'Créer le site').props.onPress();
  });
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

  const post = global.fetch.mock.calls.find(
    ([url, init]) => url.endsWith('/api/client/spaces') && init?.method === 'POST',
  );

  expect(post).toBeDefined();
  expect(JSON.parse(post[1].body)).toEqual({
    space_name: 'Bastille',
    adresse: '1 rue de la Roquette',
    space_city: 'Paris',
  });
});

it('sends only the renamed field when editing', async () => {
  mockApi();
  const tree = await render();

  await act(async () => {
    pressableByLabel(tree, 'Modifier Rivoli').props.onPress();
  });

  await act(async () => {
    setInput(tree, 'Nom du site', 'Rivoli 2');
  });

  await act(async () => {
    pressableByLabel(tree, 'Enregistrer le site').props.onPress();
  });
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

  const put = global.fetch.mock.calls.find(([, init]) => init?.method === 'PUT');

  expect(put).toBeDefined();
  expect(put[0]).toMatch(/\/api\/client\/spaces\/7$/);
  // The prefilled region must not ride along as a change.
  expect(JSON.parse(put[1].body)).toEqual({ space_name: 'Rivoli 2' });
});

it('toggles a site through the confirmation', async () => {
  mockApi();
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
    buttons?.[1]?.onPress?.();
  });

  const tree = await render();

  await act(async () => {
    pressableByLabel(tree, 'Désactiver Oberkampf').props.onPress();
  });
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

  const patch = global.fetch.mock.calls.find(([, init]) => init?.method === 'PATCH');

  expect(patch).toBeDefined();
  expect(patch[0]).toMatch(/\/api\/client\/spaces\/8\/toggle$/);

  alertSpy.mockRestore();
});

it('deletes a site through the confirmation', async () => {
  mockApi();
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
    buttons?.[1]?.onPress?.();
  });

  const tree = await render();

  await act(async () => {
    pressableByLabel(tree, 'Supprimer Lyon').props.onPress();
  });
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

  const del = global.fetch.mock.calls.find(([, init]) => init?.method === 'DELETE');

  expect(del).toBeDefined();
  expect(del[0]).toMatch(/\/api\/client\/spaces\/9$/);

  alertSpy.mockRestore();
});

it('surfaces a backend refusal (single site cannot be disabled)', async () => {
  global.fetch = jest.fn(async (url, init = {}) => {
    const method = (init.method || 'GET').toUpperCase();

    if (url.endsWith('/api/client/profile') && method === 'GET') {
      return json({ spaces: [SPACES[0]] });
    }
    if (method === 'PATCH') {
      return json({ error: 'Vous ne pouvez pas désactiver votre seul espace actif.' }, 422);
    }

    throw new Error(`unexpected ${method} ${url}`);
  });

  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
    buttons?.[1]?.onPress?.();
  });

  const tree = await render();

  await act(async () => {
    pressableByLabel(tree, 'Désactiver Rivoli').props.onPress();
  });
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

  // A 422 whose payload is { error } — not a validation bag — must still show
  // the backend's sentence.
  expect(text(tree)).toContain('Vous ne pouvez pas désactiver votre seul espace actif.');

  alertSpy.mockRestore();
});
