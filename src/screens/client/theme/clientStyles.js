import {
  createClientContentStyles,
  createClientLayoutStyles,
  createClientNavigationStyles,
} from '../../../styles';
import { clientPalettes } from './palette';

// The dashboard shell stylesheets live with the other shared styles; here they
// are materialised once per brand so a screen can pick the one matching the
// active palette.
const createClientShellStyles = colors => ({
  layout: createClientLayoutStyles(colors),
  navigation: createClientNavigationStyles(colors),
  content: createClientContentStyles(colors),
});

export const clientShellStylesByBrand = {
  bookly: createClientShellStyles(clientPalettes.bookly),
  staffly: createClientShellStyles(clientPalettes.staffly),
};

// Builds a `{ bookly, staffly }` bundle from a `colors => StyleSheet` factory so
// a component can resolve its stylesheet from the active brand.
export function createBrandStyles(factory) {
  return {
    bookly: factory(clientPalettes.bookly),
    staffly: factory(clientPalettes.staffly),
  };
}
