import { toPhotoSrc } from '../src/utils/toPhotoSrc';
import { API_BASE_URL } from '../src/config/env';

describe('toPhotoSrc', () => {
  it('routes stored photo paths through the API photo endpoint', () => {
    expect(toPhotoSrc('assets/photos/1_12_ab.jpg')).toBe(
      `${API_BASE_URL}/photos/1_12_ab.jpg`,
    );
  });

  it('accepts a leading slash', () => {
    expect(toPhotoSrc('/assets/photos/1_12_ab.jpg')).toBe(
      `${API_BASE_URL}/photos/1_12_ab.jpg`,
    );
  });

  it('passes absolute urls through untouched', () => {
    const url = 'https://example.test/photo.jpg';
    expect(toPhotoSrc(url)).toBe(url);
  });

  it('returns null when there is no photo', () => {
    expect(toPhotoSrc(null)).toBeNull();
    expect(toPhotoSrc('')).toBeNull();
  });
});
