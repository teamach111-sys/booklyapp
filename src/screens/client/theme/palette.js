// Brand palettes for the client area.
//
// The client screens are shared between the two platforms a client can belong
// to: `bookly` (orange) and `staffly` (green). Per the design source
// (`:root:has(.staffly)`), only the brand accents change between them —
// the beige, cream, brown, border and neutral tones are identical, which is
// why they are declared once in `sharedTokens`.

const sharedTokens = {
  background: '#FDF5E4',
  white: '#FFFFFF',
  cream: '#FFF9EE',
  brown: '#4A3222',
  muted: '#6B584C',
  border: '#EBDCC0',
  palePink: '#F7E7DE',
  divider: '#ECDDD6',
  green: '#1A6C38',
  accentDeep: '#C25E2E',
  success: '#15803D',
  successLight: '#DCFCE7',
  successBorder: '#BBF7D0',
  successDot: '#22C55E',
};

export const clientPalettes = {
  bookly: {
    ...sharedTokens,
    brand: 'bookly',
    brandLabel: 'bookly',
    brandName: 'Bookly',
    orange: '#D47A31',
    orangeDark: '#B9622C',
    accent: '#C18855',
    gold: '#F4CC73',
  },
  staffly: {
    ...sharedTokens,
    brand: 'staffly',
    brandLabel: 'staffly',
    brandName: 'Staffly',
    orange: '#708868',
    orangeDark: '#5C7054',
    accent: '#7C9172',
    gold: '#F4CC73',
  },
};

export const defaultClientBrand = 'bookly';

export function resolveClientBrand(partner) {
  return partner === 'staffly' ? 'staffly' : defaultClientBrand;
}
