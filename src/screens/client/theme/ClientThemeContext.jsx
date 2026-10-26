import { createContext, useContext, useMemo } from 'react';
import {
  clientPalettes,
  defaultClientBrand,
  resolveClientBrand,
} from './palette';

const ClientThemeContext = createContext({
  partner: defaultClientBrand,
  colors: clientPalettes[defaultClientBrand],
});

// Wrap the client dashboard so every screen below it renders with the palette
// matching the platform the client belongs to.
export function ClientThemeProvider({ partner = defaultClientBrand, children }) {
  const value = useMemo(() => {
    const resolved = resolveClientBrand(partner);
    return { partner: resolved, colors: clientPalettes[resolved] };
  }, [partner]);

  return (
    <ClientThemeContext.Provider value={value}>
      {children}
    </ClientThemeContext.Provider>
  );
}

export function useClientTheme() {
  return useContext(ClientThemeContext);
}

export function useClientColors() {
  return useContext(ClientThemeContext).colors;
}

export default ClientThemeContext;
