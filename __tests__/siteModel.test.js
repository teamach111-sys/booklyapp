import {
  DEFAULT_REGION,
  EMPTY_SITE_FORM,
  buildSiteCreateBody,
  buildSiteUpdateBody,
  normalizeSite,
  normalizeSites,
  pickActiveSiteId,
  selectableSites,
  siteToForm,
  validateSiteForm,
} from '../src/screens/client/components/siteModel';

describe('normalizeSite', () => {
  it('maps a profile space row', () => {
    const site = normalizeSite({
      id: 7,
      space_name: 'Rivoli',
      city: 'Rivoli',
      adresse: '12 rue de Rivoli',
      is_active: 1,
    });

    expect(site).toEqual({
      id: 7,
      name: 'Rivoli',
      city: 'Rivoli',
      region: '',
      address: '12 rue de Rivoli',
      isActive: true,
    });
  });

  it('treats 0 / "0" / false as disabled', () => {
    expect(normalizeSite({ id: 1, space_name: 'A', is_active: 0 }).isActive).toBe(false);
    expect(normalizeSite({ id: 1, space_name: 'A', is_active: '0' }).isActive).toBe(false);
    expect(normalizeSite({ id: 1, space_name: 'A', is_active: false }).isActive).toBe(false);
  });

  it('assumes active when the flag is absent', () => {
    expect(normalizeSite({ id: 1, space_name: 'A' }).isActive).toBe(true);
  });

  it('falls back to the city, then to the id', () => {
    expect(normalizeSite({ id: 3, city: 'Lyon' }).name).toBe('Lyon');
    expect(normalizeSite({ id: 3 }).name).toBe('Site 3');
    expect(normalizeSite({}).name).toBe('Site');
  });
});

describe('normalizeSites', () => {
  it('maps the array and tolerates junk', () => {
    expect(normalizeSites([{ id: 1, space_name: 'A' }])).toHaveLength(1);
    expect(normalizeSites(null)).toEqual([]);
    expect(normalizeSites('nope')).toEqual([]);
  });
});

describe('selectableSites', () => {
  it('keeps only enabled sites', () => {
    const sites = [
      { id: 1, isActive: true },
      { id: 2, isActive: false },
    ];

    expect(selectableSites(sites).map(site => site.id)).toEqual([1]);
    expect(selectableSites(null)).toEqual([]);
  });
});

describe('pickActiveSiteId', () => {
  const sites = [
    { id: 1, isActive: false },
    { id: 2, isActive: true },
    { id: 3, isActive: true },
  ];

  it('keeps the current selection while it is still enabled', () => {
    expect(pickActiveSiteId(sites, 3)).toBe(3);
    expect(pickActiveSiteId(sites, '3')).toBe(3);
  });

  it('moves off a disabled or deleted selection', () => {
    expect(pickActiveSiteId(sites, 1)).toBe(2);
    expect(pickActiveSiteId(sites, 99)).toBe(2);
  });

  it('falls back to the first site when none are enabled', () => {
    expect(pickActiveSiteId([{ id: 9, isActive: false }], null)).toBe(9);
  });

  it('returns null with no sites', () => {
    expect(pickActiveSiteId([], 1)).toBeNull();
    expect(pickActiveSiteId(null, 1)).toBeNull();
  });
});

describe('request bodies', () => {
  it('creates with the backend field names', () => {
    expect(
      buildSiteCreateBody({ name: ' Rivoli ', address: ' 12 rue ', region: ' Paris ' }),
    ).toEqual({
      space_name: 'Rivoli',
      adresse: '12 rue',
      space_city: 'Paris',
    });
  });

  it('defaults the region when creating', () => {
    expect(buildSiteCreateBody(EMPTY_SITE_FORM).space_city).toBe(DEFAULT_REGION);
  });

  it('sends nothing when the edit changed nothing', () => {
    const form = { name: 'Rivoli', address: '12 rue', region: DEFAULT_REGION };

    expect(buildSiteUpdateBody(form, form)).toEqual({});
  });

  it('sends only the edited field', () => {
    const initial = { name: 'Rivoli', address: '12 rue', region: DEFAULT_REGION };
    const form = { name: 'Rivoli 2', address: '12 rue', region: DEFAULT_REGION };

    expect(buildSiteUpdateBody(form, initial)).toEqual({ space_name: 'Rivoli 2' });
  });

  it('keeps the prefilled region out of the payload', () => {
    // The list never returns space_city, so the form shows the default; that
    // must not be pushed back as a change.
    const site = normalizeSite({ id: 7, space_name: 'Rivoli', adresse: '12 rue' });
    const initial = siteToForm(site);
    const form = { ...initial, address: '13 rue' };

    expect(buildSiteUpdateBody(form, initial)).toEqual({ adresse: '13 rue' });
  });
});

describe('validateSiteForm', () => {
  it('requires a name', () => {
    expect(validateSiteForm(EMPTY_SITE_FORM).name).toBeDefined();
    expect(validateSiteForm({ ...EMPTY_SITE_FORM, name: '  ' }).name).toBeDefined();
  });

  it('accepts a normal name', () => {
    expect(validateSiteForm({ ...EMPTY_SITE_FORM, name: 'Rivoli' })).toEqual({});
  });
});
