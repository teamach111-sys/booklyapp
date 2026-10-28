// Pure helpers behind the sites (espaces) area.
//
// Sites come from GET /client/profile's `spaces` array, and are managed with
// (staffly-backend/app/Http/Controllers/Api/Client.php):
//   POST   /client/spaces                  { space_name, adresse?, space_city? }
//   PUT    /client/spaces/{id}             only the fields that changed
//   PATCH  /client/spaces/{id}/toggle      is_active 0 <-> 1
//   DELETE /client/spaces/{id}
//
// The list endpoint returns space_name / city / adresse / is_active but NOT
// space_city, which is the region used to match extras. That is why the update
// body only carries the fields the user actually edited: sending a default
// region back would silently overwrite the stored one.

export const DEFAULT_REGION = 'Ile de France';

export const EMPTY_SITE_FORM = {
  name: '',
  address: '',
  region: DEFAULT_REGION,
};

function isTruthyFlag(value) {
  if (value === true || value === 1) {
    return true;
  }
  if (value === false || value === 0 || value === '0' || value === null) {
    return false;
  }
  return Boolean(Number(value));
}

/** One element of `spaces` -> what the UI renders. */
export function normalizeSite(raw) {
  const name = (raw?.space_name || raw?.city || '').trim();

  return {
    id: raw?.id,
    name: name || (raw?.id != null ? `Site ${raw.id}` : 'Site'),
    city: (raw?.city || '').trim(),
    region: (raw?.space_city || '').trim(),
    address: (raw?.adresse || '').trim(),
    isActive: raw?.is_active === undefined ? true : isTruthyFlag(raw?.is_active),
  };
}

export function normalizeSites(spaces) {
  return Array.isArray(spaces) ? spaces.map(normalizeSite) : [];
}

/** Only enabled sites can be the "site actif". */
export function selectableSites(sites) {
  return Array.isArray(sites) ? sites.filter(site => site.isActive) : [];
}

/** Keeps the current selection when it still exists, else the first active. */
export function pickActiveSiteId(sites, currentId) {
  const list = Array.isArray(sites) ? sites : [];
  const existing = list.find(site => String(site.id) === String(currentId));
  if (existing && existing.isActive) {
    return existing.id;
  }

  const firstActive = list.find(site => site.isActive);
  if (firstActive) {
    return firstActive.id;
  }

  return list[0]?.id ?? null;
}

export function buildSiteCreateBody(form) {
  return {
    space_name: form.name.trim(),
    adresse: form.address.trim(),
    space_city: form.region.trim() || DEFAULT_REGION,
  };
}

/**
 * Only the edited fields, compared against the form as it was opened.
 *
 * The comparison has to use the prefilled form rather than the API row: the
 * list does not expose `space_city`, so `siteToForm` fills in the default
 * region. Diffing against the raw row would send that default back as a
 * "change" and overwrite a region the client had customised.
 *
 * The backend applies `filled()` checks, so an omitted key keeps its stored
 * value; a cleared address is simply not applied.
 */
export function buildSiteUpdateBody(form, initialForm) {
  const initial = initialForm || EMPTY_SITE_FORM;
  const body = {};

  const name = form.name.trim();
  if (name && name !== (initial.name || '').trim()) {
    body.space_name = name;
  }
  if (form.address.trim() !== (initial.address || '').trim()) {
    body.adresse = form.address.trim();
  }
  if (form.region.trim() !== (initial.region || '').trim()) {
    body.space_city = form.region.trim() || DEFAULT_REGION;
  }

  return body;
}

export function siteToForm(site) {
  return {
    name: site?.name || '',
    address: site?.address || '',
    region: site?.region || DEFAULT_REGION,
  };
}

export function validateSiteForm(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'Le nom du site est requis.';
  } else if (form.name.trim().length < 2) {
    errors.name = 'Le nom du site est trop court.';
  }

  return errors;
}
