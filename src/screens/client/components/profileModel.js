// Pure helpers behind the client profile screen, kept apart from the JSX so
// the request/response mapping can be tested on its own.

export const EMPTY_FORM = {
  firstname: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  raison_sociale: '',
  siret: '',
  tva_number: '',
  billing_conditions: '',
  tenue_staff: '',
};

/** GET /client/profile (or /employee/profile) -> editable form model. */
export function toForm(data) {
  const info = data?.personal_info || {};
  const biz = data?.business_info || {};

  return {
    firstname: info.firstname || '',
    name: info.name || '',
    email: info.email || '',
    phone: info.phone || '',
    address: info.address || '',
    raison_sociale: biz.raison_sociale || '',
    siret: biz.siret || '',
    tva_number: biz.tva_number || '',
    billing_conditions: biz.billing_conditions || '',
    tenue_staff: biz.tenue_staff || '',
  };
}

/**
 * Form model -> PUT body.
 *
 * Two backend rules drive the shape:
 *   - `sometimes|string` rejects null, so text fields always send a string
 *     (empty is allowed);
 *   - `nullable|string` accepts null, so optional business fields send null
 *     instead of '' to clear them.
 *
 * Employees may only touch personal fields — the business ones are dropped
 * rather than sent and rejected.
 */
export function buildUpdateBody(form, isEmployee) {
  const body = {
    firstname: form.firstname.trim(),
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
  };

  if (isEmployee) {
    return body;
  }

  return {
    ...body,
    address: form.address.trim(),
    raison_sociale: form.raison_sociale.trim(),
    siret: form.siret.trim(),
    tva_number: form.tva_number.trim() || null,
    billing_conditions: form.billing_conditions.trim() || null,
    tenue_staff: form.tenue_staff.trim() || null,
  };
}

/** Password change body — validated by the same update endpoint. */
export function buildPasswordBody(current, next, confirm) {
  return {
    current_password: current,
    password: next,
    password_confirmation: confirm,
  };
}
