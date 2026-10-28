// The client's sites, loaded once for the whole client area.
//
// The drawer's "Site actif" selector, the Collaborateurs screen and the Sites
// page all read from here, so switching site in one place switches it
// everywhere instead of each screen keeping its own copy. The list itself
// comes from GET /client/profile's `spaces`.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { fetchClient } from '../../../api/fetchClient';
import { describeApiError } from '../../../utils/apiError';
import {
  normalizeSites,
  pickActiveSiteId,
  selectableSites,
} from '../components/siteModel';

const SitesContext = createContext(null);

export function SitesProvider({ children }) {
  const [sites, setSites] = useState([]);
  const [activeSiteId, setActiveSiteId] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const profile = await fetchClient('/client/profile');
      const list = normalizeSites(profile?.spaces);
      setSites(list);
      // Several endpoints (missions, in particular) need the client id.
      setClientId(profile?.personal_info?.client_id ?? null);
      setActiveSiteId(current => pickActiveSiteId(list, current));
    } catch (requestError) {
      setError(describeApiError(requestError));
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(() => {
    const enabled = selectableSites(sites);
    const activeSite =
      enabled.find(site => String(site.id) === String(activeSiteId)) ||
      enabled[0] ||
      null;

    return {
      sites,
      // Enabled sites are the only ones that can be selected.
      selectableSites: enabled,
      activeSite,
      activeSiteId: activeSite ? activeSite.id : null,
      clientId,
      setActiveSiteId,
      loading,
      error,
      reload: load,
    };
  }, [sites, activeSiteId, clientId, loading, error, load]);

  return <SitesContext.Provider value={value}>{children}</SitesContext.Provider>;
}

export function useClientSites() {
  const context = useContext(SitesContext);
  if (!context) {
    throw new Error('useClientSites doit être utilisé dans <SitesProvider>.');
  }
  return context;
}

export default SitesContext;
