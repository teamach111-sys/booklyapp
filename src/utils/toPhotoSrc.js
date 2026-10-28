// Turns the `profile_photo_url` values the API stores ('assets/photos/x.jpg')
// into something <Image> can load — same rules as the web's toPhotoSrc.

import { API_BASE_URL } from '../config/env';

const API_URL = API_BASE_URL.replace(/\/$/, '');
const BASE_ROOT = API_URL.replace(/\/api$/, '');

export function toPhotoSrc(photo) {
  if (!photo) {
    return null;
  }

  const value = String(photo);
  if (/^(https?:|blob:|data:)/.test(value)) {
    return value;
  }

  const clean = value.replace(/^\/+/, '');
  const match = clean.match(/^assets\/photos\/(.+)$/);
  if (match) {
    return `${API_URL}/photos/${match[1]}`;
  }

  return `${BASE_ROOT}/${clean}`;
}

export default toPhotoSrc;
