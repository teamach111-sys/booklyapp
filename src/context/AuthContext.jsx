// Single owner of the session for the whole app.
//
// Responsibilities:
//   - restore the saved session once at startup (hydrateSession)
//   - expose login / logout that persist through Authstorage
//   - react to a 401 from any request by dropping the session
//
// Navigation guards are intentionally not here yet; screens read `user`,
// `isAuthenticated` and `booting` from this context and decide themselves.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { authService } from '../api/authService';
import { setUnauthorizedHandler } from '../api/fetchClient';
import {
  clearSession,
  getSession,
  getToken,
  getUser,
  hydrateSession,
  setSession,
  subscribe,
  updateUser,
} from '../utils/Authstorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => getSession());
  // `booting` stays true until the first disk read settles, so the app can
  // hold a splash instead of flashing the login screen at a logged-in user.
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    // The store is the single source of truth: hydrating, logging in, logging
    // out from any screen, or a 401 wiping the token all land here, so React
    // state can never drift from what is actually persisted.
    const unsubscribe = subscribe(nextSession => setSessionState(nextSession));
    return unsubscribe;
  }, []);

  useEffect(() => {
    let active = true;

    hydrateSession()
      .then(restored => {
        if (active) {
          setSessionState(restored);
        }
      })
      .catch(() => {
        // hydrateSession already swallows storage errors; this is belt and
        // braces so a rejection can never leave the app stuck on the splash.
      })
      .finally(() => {
        if (active) {
          setBooting(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    // fetchClient already cleared storage by the time this fires; we only
    // need to mirror that in React state.
    setUnauthorizedHandler(() => {
      setSessionState(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  /**
   * Log in and persist the token before resolving, so the caller can navigate
   * knowing the session will survive a restart.
   */
  const signIn = useCallback(async ({ email, password, remember = true }) => {
    const data = await authService.login({
      email: email.trim().toLowerCase(),
      password,
    });

    // The store's subscription updates React state.
    await setSession(data.access_token, data.user, remember);
    return data.user;
  }, []);

  /**
   * Log out.
   *
   * The local session goes first so the caller can leave the screen right
   * away and the token is gone even with no network. Revoking it server-side
   * is then best effort and never blocks the UI — on a dead connection the
   * request would otherwise hold the button for the 20s timeout.
   *
   * `revoke: false` skips the request entirely (the token is already dead).
   */
  const signOut = useCallback(async ({ revoke = true } = {}) => {
    const token = getToken();

    await clearSession();

    if (revoke && token) {
      authService.logout(token).catch(() => {
        // Best effort only: a leaked-but-unrevoked token still expires with
        // the account, and the user is already signed out locally.
      });
    }
  }, []);

  /** Re-read the user from the backend (profile changes, role updates). */
  const refreshUser = useCallback(async () => {
    try {
      const fresh = await authService.currentUser();
      await updateUser(fresh);
      return fresh;
    } catch {
      return null;
    }
  }, []);

  const value = useMemo(
    () => ({
      booting,
      isAuthenticated: Boolean(session?.token),
      remember: session?.remember ?? false,
      session,
      token: session?.token ?? null,
      user: session?.user ?? getUser(),
      signIn,
      signOut,
      refreshUser,
    }),
    [booting, session, signIn, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans <AuthProvider>.');
  }
  return context;
}

export default AuthContext;
