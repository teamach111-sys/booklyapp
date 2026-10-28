// Runtime configuration for the React Native app.
//
// The web frontend (staffly-frontend) reads VITE_API_URL at build time through
// import.meta.env. Metro does not expose that, so the same two endpoints from
// .env / .env.production are mirrored here and picked with __DEV__.

import { Platform } from 'react-native';

const DEV_PORT = 8000;
const PROD_API_URL = 'https://booklyapp.fr/laravel_api/api';

// On a physical phone "localhost" is the phone itself, so the dev server can
// never be reached that way. Put your machine's LAN IP here (find it with
// `ipconfig`, e.g. 192.168.1.20) when testing on a real device, and leave it
// null for emulators/simulators.
const DEV_HOST_OVERRIDE = null;

function devApiUrl() {
  if (DEV_HOST_OVERRIDE) {
    return `http://${DEV_HOST_OVERRIDE}:${DEV_PORT}/api`;
  }
  // Android emulators reach the host machine through 10.0.2.2; the iOS
  // simulator shares the host network, so localhost works there.
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:${DEV_PORT}/api`;
}

export const API_BASE_URL = __DEV__ ? devApiUrl() : PROD_API_URL;

// Requests are aborted after this long. Mobile networks drop connections
// silently far more often than browsers do, so a hung fetch needs a deadline
// instead of spinning forever.
export const API_TIMEOUT_MS = 20000;
