import {
  EMPTY_CO_OWNER_FORM,
  buildCoOwnerBody,
  normalizeCoOwner,
  normalizeCoOwners,
  validateCoOwnerForm,
} from '../src/screens/client/components/coOwnerModel';

const PRIMARY = {
  id: 'primary',
  user_id: 5,
  name: 'Bensalem',
  firstname: 'Amina',
  email: 'amina@bookly.fr',
  profile_photo_url: 'assets/photos/1_5_ab.jpg',
  status: 'active',
  created_at: null,
  is_primary: true,
};

const CO_OWNER = {
  id: 31,
  user_id: 52,
  name: 'Haddad',
  firstname: 'Karim',
  email: 'karim@bookly.fr',
  profile_photo_url: null,
  status: 'active',
  created_at: '2026-10-27T10:00:00Z',
  is_primary: false,
};

describe('normalizeCoOwner', () => {
  it('marks the account holder and protects it from removal', () => {
    const co = normalizeCoOwner(PRIMARY);

    expect(co.isPrimary).toBe(true);
    expect(co.canRemove).toBe(false);
    expect(co.statusLabel).toBe('TITULAIRE DU COMPTE');
    expect(co.fullName).toBe('Amina Bensalem');
    expect(co.initials).toBe('AB');
    expect(co.photoUrl).toBe('assets/photos/1_5_ab.jpg');
  });

  it('marks a regular co-owner as removable with full access', () => {
    const co = normalizeCoOwner(CO_OWNER);

    expect(co.isPrimary).toBe(false);
    expect(co.canRemove).toBe(true);
    expect(co.statusLabel).toBe('ACCÈS COMPLET');
    expect(co.id).toBe(31);
    expect(co.email).toBe('karim@bookly.fr');
  });

  it('copes with missing names and emails', () => {
    const co = normalizeCoOwner({ id: 1 });

    expect(co.fullName).toBe('Compte sans nom');
    expect(co.initials).toBe('CO');
    expect(co.email).toBe('');
    expect(co.canRemove).toBe(true);
  });
});

describe('normalizeCoOwners', () => {
  it('maps the response envelope', () => {
    const list = normalizeCoOwners({ co_owners: [PRIMARY, CO_OWNER] });

    expect(list).toHaveLength(2);
    expect(list.map(co => co.isPrimary)).toEqual([true, false]);
  });

  it('tolerates a missing or malformed payload', () => {
    expect(normalizeCoOwners(null)).toEqual([]);
    expect(normalizeCoOwners({})).toEqual([]);
    expect(normalizeCoOwners({ co_owners: 'nope' })).toEqual([]);
  });
});

describe('buildCoOwnerBody', () => {
  it('sends the snake_case field names the validator expects', () => {
    const body = buildCoOwnerBody({
      firstname: ' Karim ',
      name: ' Haddad ',
      email: ' KARIM@Bookly.FR ',
      phone: ' 0611223344 ',
      password: 'secret123',
      passwordConfirmation: 'secret123',
    });

    expect(body).toEqual({
      firstname: 'Karim',
      name: 'Haddad',
      email: 'karim@bookly.fr',
      phone: '0611223344',
      password: 'secret123',
      password_confirmation: 'secret123',
    });
  });
});

describe('validateCoOwnerForm', () => {
  it('accepts a complete form', () => {
    expect(
      validateCoOwnerForm({
        firstname: 'Karim',
        name: 'Haddad',
        email: 'karim@bookly.fr',
        phone: '',
        password: 'secret123',
        passwordConfirmation: 'secret123',
      }),
    ).toEqual({});
  });

  it('requires names and an email', () => {
    const errors = validateCoOwnerForm(EMPTY_CO_OWNER_FORM);

    expect(errors.firstname).toBeDefined();
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it('rejects a malformed email', () => {
    const errors = validateCoOwnerForm({
      ...EMPTY_CO_OWNER_FORM,
      firstname: 'Karim',
      name: 'Haddad',
      email: 'karim.bookly.fr',
      password: 'secret123',
      passwordConfirmation: 'secret123',
    });

    expect(errors.email).toMatch(/invalide/);
  });

  it('enforces the 6 character minimum', () => {
    const errors = validateCoOwnerForm({
      ...EMPTY_CO_OWNER_FORM,
      firstname: 'Karim',
      name: 'Haddad',
      email: 'karim@bookly.fr',
      password: '12345',
      passwordConfirmation: '12345',
    });

    expect(errors.password).toMatch(/6 caractères/);
  });

  it('flags a mismatched confirmation', () => {
    const errors = validateCoOwnerForm({
      ...EMPTY_CO_OWNER_FORM,
      firstname: 'Karim',
      name: 'Haddad',
      email: 'karim@bookly.fr',
      password: 'secret123',
      passwordConfirmation: 'secret124',
    });

    expect(errors.password_confirmation).toMatch(/ne correspondent pas/);
  });
});
