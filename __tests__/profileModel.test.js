import {
  buildPasswordBody,
  buildUpdateBody,
  toForm,
} from '../src/screens/client/components/profileModel';
import { profileStylesByBrand } from '../src/screens/client/components/styles';

const API_PAYLOAD = {
  personal_info: {
    id: 12,
    firstname: 'Amina',
    name: 'Bensalem',
    email: 'amina@bookly.fr',
    phone: '0611223344',
    address: '12 rue de Rivoli, Paris',
    platform_partner: 'staffly',
    profile_photo_url: 'assets/photos/1_12_ab.jpg',
    is_primary_owner: true,
    role: 'client',
  },
  business_info: {
    raison_sociale: 'Bensalem Traiteur',
    siret: '12345678900011',
    tva_number: 'FR123',
    billing_conditions: '30 jours fin de mois',
    tenue_staff: 'Costume noir',
  },
};

describe('toForm', () => {
  it('maps both blocks of the profile payload', () => {
    expect(toForm(API_PAYLOAD)).toEqual({
      firstname: 'Amina',
      name: 'Bensalem',
      email: 'amina@bookly.fr',
      phone: '0611223344',
      address: '12 rue de Rivoli, Paris',
      raison_sociale: 'Bensalem Traiteur',
      siret: '12345678900011',
      tva_number: 'FR123',
      billing_conditions: '30 jours fin de mois',
      tenue_staff: 'Costume noir',
    });
  });

  it('falls back to empty strings when fields are missing', () => {
    const form = toForm({ personal_info: { id: 1 }, business_info: {} });

    expect(form.firstname).toBe('');
    expect(form.raison_sociale).toBe('');
    expect(form.tenue_staff).toBe('');
  });

  it('tolerates a null profile', () => {
    expect(toForm(null).email).toBe('');
  });
});

describe('buildUpdateBody', () => {
  it('trims and keeps the business fields for a client account', () => {
    const body = buildUpdateBody(
      {
        firstname: '  Amina ',
        name: 'Bensalem  ',
        email: ' amina@bookly.fr ',
        phone: ' 0611223344 ',
        address: ' 12 rue de Rivoli ',
        raison_sociale: ' Bensalem Traiteur ',
        siret: ' 12345678900011 ',
        tva_number: ' FR123 ',
        billing_conditions: ' 30 jours ',
        tenue_staff: ' Costume noir ',
      },
      false,
    );

    expect(body).toEqual({
      firstname: 'Amina',
      name: 'Bensalem',
      email: 'amina@bookly.fr',
      phone: '0611223344',
      address: '12 rue de Rivoli',
      raison_sociale: 'Bensalem Traiteur',
      siret: '12345678900011',
      tva_number: 'FR123',
      billing_conditions: '30 jours',
      tenue_staff: 'Costume noir',
    });
  });

  it('sends null for cleared optional business fields', () => {
    const body = buildUpdateBody(
      {
        firstname: 'Amina',
        name: 'Bensalem',
        email: 'amina@bookly.fr',
        phone: '',
        address: '',
        raison_sociale: '',
        siret: '',
        tva_number: '',
        billing_conditions: '',
        tenue_staff: '',
      },
      false,
    );

    // nullable on the backend...
    expect(body.tva_number).toBeNull();
    expect(body.billing_conditions).toBeNull();
    expect(body.tenue_staff).toBeNull();
    // ...but these are `sometimes|string`, which rejects null.
    expect(body.phone).toBe('');
    expect(body.address).toBe('');
    expect(body.siret).toBe('');
  });

  it('drops the business fields entirely for an employee', () => {
    const body = buildUpdateBody(
      {
        firstname: 'Karim',
        name: 'Haddad',
        email: 'karim@bookly.fr',
        phone: '0699887766',
        address: '9 rue Oberkampf',
        raison_sociale: 'Should not be sent',
        siret: 'Should not be sent',
        tva_number: 'Should not be sent',
        billing_conditions: 'Should not be sent',
        tenue_staff: 'Should not be sent',
      },
      true,
    );

    expect(body).toEqual({
      firstname: 'Karim',
      name: 'Haddad',
      email: 'karim@bookly.fr',
      phone: '0699887766',
    });
    expect(Object.keys(body)).toHaveLength(4);
  });
});

describe('buildPasswordBody', () => {
  it('matches what the update endpoint validates', () => {
    expect(buildPasswordBody('old', 'newsecret', 'newsecret')).toEqual({
      current_password: 'old',
      password: 'newsecret',
      password_confirmation: 'newsecret',
    });
  });
});

describe('brand coverage', () => {
  it('has styles for both clients', () => {
    expect(Object.keys(profileStylesByBrand).sort()).toEqual(['bookly', 'staffly']);
  });

  it('gives both brands every state the screen uses', () => {
    const required = [
      'identityCard',
      'groupCard',
      'saveButton',
      'modifierButton',
      'tabs',
      'banner',
      'bannerError',
      'bannerSuccess',
      'loadingBlock',
      'retryButton',
      'buttonDisabled',
      'avatarImage',
    ];

    ['bookly', 'staffly'].forEach(brand => {
      required.forEach(key => {
        expect(profileStylesByBrand[brand][key]).toBeDefined();
      });
    });
  });
});
