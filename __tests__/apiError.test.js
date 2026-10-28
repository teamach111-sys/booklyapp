import {
  describeApiError,
  extractFieldErrors,
} from '../src/utils/apiError';

describe('extractFieldErrors', () => {
  it('reduces a 422 payload to one message per field', () => {
    expect(
      extractFieldErrors({
        status: 422,
        data: {
          errors: {
            email: ['Cet email est déjà utilisé.', 'Second message ignoré.'],
            name: ['Le nom est requis.'],
          },
        },
      }),
    ).toEqual({
      email: 'Cet email est déjà utilisé.',
      name: 'Le nom est requis.',
    });
  });

  it('returns an empty object when there are no field errors', () => {
    expect(extractFieldErrors({ status: 422, data: { message: 'Nope' } })).toEqual({});
    expect(extractFieldErrors({})).toEqual({});
    expect(extractFieldErrors(null)).toEqual({});
  });
});

describe('describeApiError', () => {
  it('surfaces the first Laravel validation message', () => {
    expect(
      describeApiError({
        status: 422,
        data: { errors: { email: ['Cet email est déjà utilisé.'] } },
      }),
    ).toBe('Cet email est déjà utilisé.');
  });

  it('falls back to the payload message for a 422 without field errors', () => {
    expect(describeApiError({ status: 422, data: { message: 'Données invalides.' } })).toBe(
      'Données invalides.',
    );
  });

  it('explains a domain refusal', () => {
    expect(describeApiError({ status: 403, data: { error: 'Compte désactivé.' } })).toBe(
      'Compte désactivé.',
    );
    expect(describeApiError({ status: 404, data: { error: 'Client introuvable.' } })).toBe(
      'Client introuvable.',
    );
  });

  it('explains transport failures', () => {
    expect(describeApiError({ type: 'network' })).toMatch(/Impossible de contacter/);
    expect(describeApiError({ type: 'timeout' })).toMatch(/trop de temps/);
    expect(describeApiError({ type: 'rate_limit' })).toMatch(/Trop de tentatives/);
  });

  it('falls back to the error message', () => {
    expect(describeApiError({ status: 500, message: 'Erreur serveur.' })).toBe(
      'Erreur serveur.',
    );
  });
});
