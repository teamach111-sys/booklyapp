/**
 * Request layer: how the Sanctum token reaches the API, and how failures are
 * surfaced to screens.
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

const USER = { id: 7, role: 'client', email: 'amina@bookly.fr' };

function loadModules() {
  jest.resetModules();
  mockDisk.clear();
  return {
    store: require('../src/utils/Authstorage'),
    client: require('../src/api/fetchClient'),
  };
}

function respond({ status = 200, body = {}, ok } = {}) {
  global.fetch.mockResolvedValueOnce({
    status,
    ok: ok ?? (status >= 200 && status < 300),
    json: async () => body,
  });
}

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('fetchClient', () => {
  it('sends the Bearer token once a session exists', async () => {
    const { store, client } = loadModules();
    await store.setSession('tok-abc', USER, true);
    respond({ body: { missions: [] } });

    await client.fetchClient('/missions');

    const [url, init] = global.fetch.mock.calls[0];
    expect(url).toContain('/api/missions');
    expect(init.headers.Authorization).toBe('Bearer tok-abc');
    expect(init.headers.Accept).toBe('application/json');
  });

  it('sends no Authorization header when signed out', async () => {
    const { client } = loadModules();
    respond({ body: {} });

    await client.fetchClient('/qualifications/public');

    const [, init] = global.fetch.mock.calls[0];
    expect(init.headers.Authorization).toBeUndefined();
  });

  it('serialises JSON bodies and sets Content-Type', async () => {
    const { client } = loadModules();
    respond({ body: { access_token: 'tok-new' } });

    await client.fetchClient('/login', {
      method: 'POST',
      body: { email: 'amina@bookly.fr', password: 'secret' },
    });

    const [, init] = global.fetch.mock.calls[0];
    expect(init.method).toBe('POST');
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(init.body)).toEqual({
      email: 'amina@bookly.fr',
      password: 'secret',
    });
  });

  it('clears the session and notifies on 401', async () => {
    const { store, client } = loadModules();
    await store.setSession('tok-dead', USER, true);

    const onUnauthorized = jest.fn();
    client.setUnauthorizedHandler(onUnauthorized);
    respond({ status: 401, body: { message: 'Unauthenticated.' } });

    await expect(client.fetchClient('/user')).rejects.toMatchObject({
      type: 'unauthorized',
      status: 401,
    });

    expect(store.getToken()).toBeNull();
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('reports throttling as rate_limit with the backend message', async () => {
    const { client } = loadModules();
    respond({ status: 429, body: { message: 'Trop de tentatives.' } });

    await expect(
      client.fetchClient('/login', { method: 'POST', body: {} }),
    ).rejects.toMatchObject({
      type: 'rate_limit',
      status: 429,
      message: 'Trop de tentatives.',
    });
  });

  it('reports an unreachable server as a network error', async () => {
    const { client } = loadModules();
    global.fetch.mockRejectedValueOnce(new TypeError('Network request failed'));

    await expect(client.fetchClient('/login')).rejects.toMatchObject({
      type: 'network',
      status: null,
    });
  });

  it('passes validation errors through for 422', async () => {
    const { client } = loadModules();
    respond({
      status: 422,
      body: {
        message: 'The email field is required.',
        errors: { email: ['The email field is required.'] },
      },
    });

    const error = await client
      .fetchClient('/login', { method: 'POST', body: {} })
      .catch(caught => caught);

    expect(error.type).toBe('server');
    expect(error.status).toBe(422);
    expect(error.data.errors.email[0]).toBe('The email field is required.');
  });

  it('returns null for 204 responses', async () => {
    const { client } = loadModules();
    global.fetch.mockResolvedValueOnce({
      status: 204,
      ok: true,
      json: async () => {
        throw new Error('no body');
      },
    });

    await expect(client.fetchClient('/logout', { method: 'POST' })).resolves.toBeNull();
  });

  it('leaves Content-Type to the runtime for FormData', async () => {
    if (typeof FormData === 'undefined') {
      return; // Not available in this environment.
    }

    const { client } = loadModules();
    const form = new FormData();
    form.append('file', 'contents');
    respond({ body: { uploaded: true } });

    await client.fetchClient('/upload', { method: 'POST', body: form });

    const [, init] = global.fetch.mock.calls[0];
    expect(init.body).toBe(form);
    expect(init.headers['Content-Type']).toBeUndefined();
  });
});
