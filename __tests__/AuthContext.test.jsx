/**
 * The provider must mirror the store, because the home header decides between
 * "Connexion" and "Accéder à mon espace" from this context.
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

global.IS_REACT_ACT_ENVIRONMENT = true;

import { act, create } from 'react-test-renderer';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import * as store from '../src/utils/Authstorage';

let latest;
let root;

function Probe() {
  latest = useAuth();
  return null;
}

async function mount() {
  await act(async () => {
    root = create(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
  });
}

beforeEach(async () => {
  mockDisk.clear();
  await store.clearSession();
  latest = null;
  global.fetch = jest.fn();
});

afterEach(async () => {
  if (root) {
    await act(async () => {
      root.unmount();
    });
    root = null;
  }
  jest.clearAllMocks();
});

it('starts signed out after booting', async () => {
  await mount();

  expect(latest.booting).toBe(false);
  expect(latest.isAuthenticated).toBe(false);
  expect(latest.user).toBeNull();
});

it('reflects a login written straight to the store', async () => {
  await mount();

  await act(async () => {
    await store.setSession('tok-abc', { id: 1, role: 'client' }, true);
  });

  expect(latest.isAuthenticated).toBe(true);
  expect(latest.token).toBe('tok-abc');
  expect(latest.user.role).toBe('client');
});

it('drops back to signed out when a screen clears the session', async () => {
  await mount();

  await act(async () => {
    await store.setSession('tok-abc', { id: 1, role: 'extra' }, true);
  });
  expect(latest.isAuthenticated).toBe(true);

  // This is what Client.jsx / Extras.jsx do on their own logout button.
  await act(async () => {
    await store.clearSession();
  });

  expect(latest.isAuthenticated).toBe(false);
  expect(latest.session).toBeNull();
});

it('signs out locally first, then revokes the token in the background', async () => {
  global.fetch.mockResolvedValue({
    status: 200,
    ok: true,
    json: async () => ({ message: 'Déconnexion réussie.' }),
  });

  await mount();
  await act(async () => {
    await store.setSession('tok-abc', { id: 1, role: 'client' }, true);
  });
  expect(latest.isAuthenticated).toBe(true);

  await act(async () => {
    await latest.signOut();
  });

  // Local session is gone as soon as signOut resolves, so the screen can
  // navigate without waiting on the network.
  expect(latest.isAuthenticated).toBe(false);
  expect(store.getToken()).toBeNull();
  expect(mockDisk.size).toBe(0);

  // The revoke request still carried the token it captured beforehand.
  await act(async () => {
    await Promise.resolve();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  const [url, init] = global.fetch.mock.calls[0];
  expect(url).toMatch(/\/api\/logout$/);
  expect(init.method).toBe('POST');
  expect(init.headers.Authorization).toBe('Bearer tok-abc');
});

it('stays signed out even when the revoke request fails', async () => {
  global.fetch.mockRejectedValue(new TypeError('Network request failed'));

  await mount();
  await act(async () => {
    await store.setSession('tok-abc', { id: 1, role: 'client' }, true);
  });

  await act(async () => {
    await latest.signOut();
  });
  await act(async () => {
    await Promise.resolve();
  });

  expect(latest.isAuthenticated).toBe(false);
  expect(store.getToken()).toBeNull();
});

it('never calls the API when revoke is disabled', async () => {
  await mount();
  await act(async () => {
    await store.setSession('tok-abc', { id: 1, role: 'client' }, true);
  });

  await act(async () => {
    await latest.signOut({ revoke: false });
  });

  expect(global.fetch).not.toHaveBeenCalled();
  expect(store.getToken()).toBeNull();
});
