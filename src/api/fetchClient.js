// Authenticated fetch wrapper — the React Native counterpart of
// staffly-frontend/src/api/fetchClient.js.
//
// Same contract as the web version (Bearer token, JSON in/out, typed errors),
// minus everything that only exists in a browser:
//   - no `mode: 'cors'` (React Native has no CORS)
//   - no `window.location` redirect; a 401 clears the session and notifies
//     the provider, which sends the user to the login screen
//   - no react-toastify; the caller decides how to surface `error.message`

import { API_BASE_URL, API_TIMEOUT_MS } from '../config/env';
import { clearSession, getToken } from '../utils/Authstorage';

/**
 * Error thrown by fetchClient. Carries the same `type` vocabulary as the web
 * client so screens ported from the web keep working:
 *   network | timeout | unauthorized | rate_limit | server |
 *   server_invalid_response
 */
export class ApiError extends Error {
  constructor({ type, status = null, message, data = null }) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.status = status;
    this.data = data;
  }
}

let unauthorizedHandler = null;

/**
 * Register a callback fired when the API answers 401 (token revoked or
 * expired). The AuthProvider uses it to drop the in-memory session.
 */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

function messageFrom(data, fallback) {
  return data?.message || data?.error || fallback;
}

/**
 * @param {string} endpoint  path after the API base, e.g. '/login'
 * @param {object} [options] method, body, headers, timeoutMs...
 * @returns {Promise<any>} parsed JSON body
 */
export const fetchClient = async (endpoint, options = {}) => {
  const {
    body,
    headers,
    timeoutMs = API_TIMEOUT_MS,
    ...rest
  } = options;

  const token = getToken();
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const requestHeaders = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    // Let the runtime set the multipart boundary itself.
    ...(body !== undefined && !isFormData
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...headers,
  };

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  let response;
  try {
    console.log(`[fetchClient] Requesting: ${API_BASE_URL}${endpoint}`);
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...rest,
      headers: requestHeaders,
      body:
        body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
      signal: controller ? controller.signal : undefined,
    });
  } catch (err) {
    console.error(`[fetchClient] Network Error for ${endpoint}:`, err);
    const timedOut = Boolean(controller?.signal?.aborted);
    throw new ApiError({
      type: timedOut ? 'timeout' : 'network',
      message: timedOut
        ? 'Le serveur met trop de temps à répondre. Vérifiez votre connexion.'
        : 'Impossible de contacter le serveur. Vérifiez votre connexion.',
    });
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  // 204 has no body at all, so calling json() would only throw.
  if (response.status === 204) {
    return null;
  }

  let data;
  let isJson = true;
  try {
    data = await response.json();
  } catch {
    // The server answered, just not with JSON — an HTML error page from a
    // 500/503, a proxy block page... a different problem from "unreachable".
    isJson = false;
    data = {
      message: `Le serveur a répondu de façon inattendue (code ${response.status}).`,
    };
  }

  if (response.status === 401) {
    // The token is gone or revoked server-side. Drop it before anything else
    // so no later request retries with a dead credential.
    await clearSession();
    if (unauthorizedHandler) {
      unauthorizedHandler();
    }
    throw new ApiError({
      type: 'unauthorized',
      status: 401,
      message: messageFrom(data, 'Votre session a expiré. Merci de vous reconnecter.'),
      data,
    });
  }

  if (response.status === 429) {
    throw new ApiError({
      type: 'rate_limit',
      status: 429,
      message: messageFrom(
        data,
        'Trop de tentatives. Merci de patienter quelques instants avant de réessayer.',
      ),
      data,
    });
  }

  if (!response.ok) {
    throw new ApiError({
      type: isJson ? 'server' : 'server_invalid_response',
      status: response.status,
      message: messageFrom(data, 'Une erreur est survenue. Merci de réessayer.'),
      data,
    });
  }

  return data;
};

export default fetchClient;
