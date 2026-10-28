/**
 * Session store behaviour.
 *
 * Each test reloads the module with jest.resetModules() to simulate a fresh
 * app launch: module memory (the in-run token cache) is thrown away while the
 * mocked disk keeps its contents.
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

const USER = { id: 7, name: 'Amina', role: 'client', email: 'amina@bookly.fr' };

/** Fresh module instance + an empty "device". */
function freshInstall() {
  jest.resetModules();
  mockDisk.clear();
  return require('../src/utils/Authstorage');
}

/** Fresh module instance, disk contents kept — i.e. the app was killed. */
function relaunch() {
  jest.resetModules();
  return require('../src/utils/Authstorage');
}

describe('Authstorage', () => {
  it('starts signed out when nothing was ever saved', async () => {
    const store = freshInstall();

    expect(store.getToken()).toBeNull();
    expect(store.getSession()).toBeNull();
    await expect(store.hydrateSession()).resolves.toBeNull();
    expect(store.isHydrated()).toBe(true);
  });

  it('keeps the token in memory immediately after login', async () => {
    const store = freshInstall();

    await store.setSession('tok-123', USER, true);

    // Synchronous read straight away — this is what fetchClient relies on.
    expect(store.getToken()).toBe('tok-123');
    expect(store.getUser()).toEqual(USER);
    expect(store.isRemembered()).toBe(true);
  });

  it('restores a remembered session after the app is killed', async () => {
    const first = freshInstall();
    await first.setSession('tok-remember', USER, true);

    const store = relaunch();
    expect(store.getToken()).toBeNull(); // memory starts empty...

    const restored = await store.hydrateSession(); // ...until disk is read
    expect(restored).toEqual({ token: 'tok-remember', user: USER, remember: true });
    expect(store.getToken()).toBe('tok-remember');
    expect(store.getUser()).toEqual(USER);
  });

  it('does not persist a non-remembered session', async () => {
    const first = freshInstall();
    await first.setSession('tok-temporary', USER, false);

    const store = relaunch();
    await store.hydrateSession();

    expect(store.getToken()).toBeNull();
    expect(mockDisk.size).toBe(0);
  });

  it('a non-remembered login clears an earlier remembered one', async () => {
    const first = freshInstall();
    await first.setSession('tok-remember', USER, true);

    const second = relaunch();
    await second.hydrateSession();
    await second.setSession('tok-temporary', USER, false);

    const store = relaunch();
    await store.hydrateSession();
    expect(store.getToken()).toBeNull();
  });

  it('clearSession wipes memory and disk', async () => {
    const store = freshInstall();
    await store.setSession('tok-123', USER, true);

    await store.clearSession();
    expect(store.getSession()).toBeNull();

    const relaunched = relaunch();
    await relaunched.hydrateSession();
    expect(relaunched.getToken()).toBeNull();
    expect(mockDisk.size).toBe(0);
  });

  it('notifies subscribers on login and logout', async () => {
    const store = freshInstall();
    const seen = [];
    const unsubscribe = store.subscribe(session => seen.push(session));

    await store.setSession('tok-123', USER, true);
    await store.clearSession();
    unsubscribe();
    await store.setSession('tok-456', USER, true);

    expect(seen.map(session => session?.token ?? null)).toEqual(['tok-123', null]);
  });

  it('survives a corrupted user entry instead of crashing', async () => {
    mockDisk.set('@bookly/session.access_token', 'tok-123');
    mockDisk.set('@bookly/session.user', '{not json');

    const store = relaunch();
    const restored = await store.hydrateSession();

    expect(restored.token).toBe('tok-123');
    expect(restored.user).toBeNull();
  });

  it('maps roles to the screens that exist on mobile', () => {
    const store = freshInstall();

    expect(store.getDashboardRoute('client')).toBe('ClientDashboard');
    expect(store.getDashboardRoute('sous_client')).toBe('ClientDashboard');
    expect(store.getDashboardRoute('extra')).toBe('ExtraDashboard');
    // No admin screen in the app yet.
    expect(store.getDashboardRoute('admin_bookly')).toBeNull();
    expect(store.getDashboardRoute('unknown_role')).toBeNull();
  });
});
