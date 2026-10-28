// Persistent session store — the React Native counterpart of
// staffly-frontend/src/utils/Authstorage.js.
//
// Web storage is synchronous; AsyncStorage is not. Screens and the fetch layer
// still want a token the moment they need it, so this module keeps an
// in-memory copy that is always authoritative for the current run, and writes
// it through to disk for the next one:
//
//   read  -> getToken() / getUser()   synchronous, from memory
//   write -> setSession() / clearSession()   also awaited for durability
//
// "Remember me" maps onto web semantics as closely as a phone allows:
//   remember: true  -> persisted (survives killing the app)
//   remember: false -> memory only (gone when the process dies, like a
//                      browser tab closing)
//
// A Sanctum personal access token is a plain string, so the token is the
// single source of truth for "am I logged in".

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_TOKEN = '@bookly/session.access_token';
const KEY_USER = '@bookly/session.user';
const KEY_REMEMBER = '@bookly/session.remember';

const STORAGE_KEYS = [KEY_TOKEN, KEY_USER, KEY_REMEMBER];

let current = { token: null, user: null, remember: false };
let hydrated = false;
let hydrationPromise = null;
const listeners = new Set();

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function parseUser(raw) {
  if (!raw) {
    return null;
  }
  if (typeof raw === 'object') {
    return raw;
  }
  try {
    return JSON.parse(raw);
  } catch {
    // A half-written or corrupted entry must never take the app down.
    return null;
  }
}

function emit() {
  const snapshot = getSession();
  listeners.forEach(listener => {
    try {
      listener(snapshot);
    } catch {
      // A broken subscriber must not break the store.
    }
  });
}

/* ------------------------------------------------------------------ */
/* synchronous reads                                                   */
/* ------------------------------------------------------------------ */

/** Current session, or null when signed out. */
export function getSession() {
  return current.token
    ? { token: current.token, user: current.user, remember: current.remember }
    : null;
}

/** Bearer token for the API, or null. */
export function getToken() {
  return current.token;
}

/** Logged-in user object as returned by the backend, or null. */
export function getUser() {
  return current.user;
}

export function isRemembered() {
  return current.remember;
}

/** True once the saved session has been read from disk (or found empty). */
export function isHydrated() {
  return hydrated;
}

/**
 * Subscribe to session changes. Returns an unsubscribe function.
 * Useful for navigation guards later on.
 */
export function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/* ------------------------------------------------------------------ */
/* restore                                                             */
/* ------------------------------------------------------------------ */

/**
 * Load the persisted session into memory. Safe to call more than once: only
 * the first call touches storage, later callers share the same promise.
 * Call this once at startup and await it before deciding where to send the
 * user.
 */
export function hydrateSession() {
  if (hydrated) {
    return Promise.resolve(getSession());
  }
  if (hydrationPromise) {
    return hydrationPromise;
  }

  hydrationPromise = (async () => {
    try {
      // AsyncStorage v3 returns the key/value map directly (v2's multiGet
      // returned an array of tuples).
      const stored = await AsyncStorage.getMany(STORAGE_KEYS);
      const token = stored[KEY_TOKEN] || null;

      if (token) {
        current = {
          token,
          user: parseUser(stored[KEY_USER]),
          // Anything that reached storage was written while "remember" was on.
          remember: stored[KEY_REMEMBER] !== 'false',
        };
      }
    } catch {
      // Unreadable storage (first run, wiped keystore, corrupt value): fall
      // back to a signed-out session rather than crashing on launch.
      current = { token: null, user: null, remember: false };
    } finally {
      hydrated = true;
      hydrationPromise = null;
    }

    emit();
    return getSession();
  })();

  return hydrationPromise;
}

/* ------------------------------------------------------------------ */
/* writes                                                              */
/* ------------------------------------------------------------------ */

/**
 * Save a freshly issued token + user.
 *
 * @param {string} token   Sanctum plain-text token (data.access_token)
 * @param {object|string} user  data.user from the backend
 * @param {boolean} remember    persist across app restarts?
 */
export async function setSession(token, user, remember = true) {
  const normalizedUser = parseUser(user);
  const shouldPersist = Boolean(remember);

  // Update memory first so the very next API call is already authenticated,
  // even if the disk write below fails.
  current = { token, user: normalizedUser, remember: shouldPersist };
  hydrated = true;
  emit();

  try {
    if (shouldPersist) {
      await AsyncStorage.setMany({
        [KEY_TOKEN]: token,
        [KEY_USER]: JSON.stringify(normalizedUser),
        [KEY_REMEMBER]: 'true',
      });
    } else {
      // A previous "remember me" login may have left a token on disk; a
      // memory-only session must not resurrect it on next launch.
      await AsyncStorage.removeMany(STORAGE_KEYS);
    }
  } catch {
    // Persisting failed (disk full, revoked access): the current run keeps
    // working, the user simply has to log in again next time.
  }
}

/** Replace the cached user (e.g. after GET /user or a profile edit). */
export async function updateUser(user) {
  if (!current.token) {
    return;
  }

  current = { ...current, user: parseUser(user) };
  emit();

  if (current.remember) {
    try {
      await AsyncStorage.setItem(KEY_USER, JSON.stringify(current.user));
    } catch {
      // Non-fatal: the stale copy is refreshed on the next launch.
    }
  }
}

/** Sign out locally: wipe memory and any persisted copy. */
export async function clearSession() {
  current = { token: null, user: null, remember: false };
  hydrated = true;
  emit();

  try {
    await AsyncStorage.removeMany(STORAGE_KEYS);
  } catch {
    // Nothing else to do — memory is already clean.
  }
}

/* ------------------------------------------------------------------ */
/* roles                                                               */
/* ------------------------------------------------------------------ */

// Where each role's dashboard lives, mirroring the web app. Admin roles are
// listed so the shape matches, but the mobile app has no admin screen yet —
// getDashboardRoute() returns null for them and the login screen reports it.
export const ROLE_DASHBOARD = {
  extra: 'ExtraDashboard',
  client: 'ClientDashboard',
  sous_client: 'ClientDashboard',
  admin_staffly: null,
  sous_admin_staffly: null,
  staff_staffly: null,
  admin_bookly: null,
  sous_admin_bookly: null,
  staff_bookly: null,
};

/** Navigation route for a role, or null when the app has no screen for it. */
export function getDashboardRoute(role) {
  return role ? ROLE_DASHBOARD[role] || null : null;
}
