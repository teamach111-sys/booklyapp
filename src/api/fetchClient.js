import { toast } from 'react-toastify';
import { getToken, clearSession } from '@/utils/Authstorage.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const fetchClient = async (endpoint, options = {}) => {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const config = {
    ...options,
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = isFormData ? options.body : JSON.stringify(options.body);
  }

  let response;
  try {
    response = await fetch(BASE_URL + endpoint, config);
  } catch {
    // fetch() itself threw — no response was ever received: no connection,
    // DNS failure, CORS rejection, or an untrusted certificate. The browser
    // deliberately never exposes which one (security), so this is as
    // precise as this case can get.
    throw {
      type: 'network',
      status: null,
      message: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
    };
  }

  let data;
  let isJson = true;
  try {
    data = await response.json();
  } catch {
    // Server responded, just not with JSON — HTML error page from a
    // 500/503, a host-level block page, etc. A different problem than
    // "unreachable," worth telling apart.
    isJson = false;
    data = { message: `Le serveur a répondu de façon inattendue (code ${response.status}).` };
  }

  if (response.status === 401) {
    clearSession();
    window.location.href = '/login';
    return;
  }

  if (response.status === 429) {
    const message = data.message || 'Trop de requêtes envoyées. Merci de patienter quelques instants.';

    toast.error(message);

    throw {
      type: 'rate_limit',
      status: 429,
      message,
    };
  }

  if (!response.ok) {
    throw {
      type: isJson ? 'server' : 'server_invalid_response',
      status: response.status,
      ...data,
    };
  }

  return data;
};