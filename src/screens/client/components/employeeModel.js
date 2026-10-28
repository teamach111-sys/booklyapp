// Pure helpers behind the "Collaborateurs" screen.
//
// Employees live under a site, so every call is scoped by siteId
// (staffly-backend/app/Http/Controllers/Api/ClientEmployeeController.php):
//   GET    /sites/{siteId}/employees
//   POST   /sites/{siteId}/employees            create only — sends a password
//   PUT    /employees/{employeeId}              edit — no password
//   PATCH  /employees/{employeeId}/status       active | blocked
//
// Deleting is intentionally not offered: the web client leaves the DELETE call
// commented out, and it hard-deletes the underlying user account.

export const FALLBACK_MAX_PER_SITE = 3;

export const EMPTY_EMPLOYEE_FORM = {
  firstname: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirmation: '',
};

/** One row of GET /sites/{id}/employees -> what the list renders. */
export function normalizeEmployee(raw) {
  const firstname = (raw?.firstname || '').trim();
  const name = (raw?.name || '').trim();
  const isBlocked = raw?.status === 'blocked';

  return {
    id: raw?.employee_id,
    userId: raw?.user_id,
    firstname,
    name,
    fullName: `${firstname} ${name}`.trim() || 'Employé',
    email: raw?.email || '',
    phone: raw?.phone || '',
    photoUrl: raw?.profile_photo_url || null,
    status: isBlocked ? 'blocked' : 'active',
    isBlocked,
    statusLabel: isBlocked ? 'BANNI' : 'ACTIF',
    // What the status toggle should send next.
    nextStatus: isBlocked ? 'active' : 'blocked',
    initials: `${firstname[0] || ''}${name[0] || ''}`.toUpperCase() || 'EM',
  };
}

/** Full list response -> employees plus the per-site capacity numbers. */
export function parseEmployeeResponse(response) {
  const list = Array.isArray(response?.employees)
    ? response.employees.map(normalizeEmployee)
    : [];

  const max =
    Number(response?.max_per_site) > 0
      ? Number(response.max_per_site)
      : FALLBACK_MAX_PER_SITE;
  const count = Number.isFinite(Number(response?.count))
    ? Number(response.count)
    : list.length;
  const slotsLeft = Number.isFinite(Number(response?.slots_left))
    ? Number(response.slots_left)
    : Math.max(0, max - count);

  return { employees: list, max, count, slotsLeft };
}

/** POST body — create is the only call that carries a password. */
export function buildEmployeeCreateBody(form) {
  return {
    firstname: form.firstname.trim(),
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim(),
    password: form.password,
    password_confirmation: form.passwordConfirmation,
  };
}

/** PUT body — the edit endpoint does not accept password changes. */
export function buildEmployeeUpdateBody(form) {
  return {
    firstname: form.firstname.trim(),
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim(),
  };
}

/**
 * Client-side mirror of the backend rules. Returns { field: message }.
 * `requirePassword` is true only when creating.
 */
export function validateEmployeeForm(form, requirePassword) {
  const errors = {};

  if (!form.firstname.trim()) {
    errors.firstname = 'Le prénom est requis.';
  }
  if (!form.name.trim()) {
    errors.name = 'Le nom est requis.';
  }

  const email = form.email.trim();
  if (!email) {
    errors.email = "L'email est requis.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Cette adresse email est invalide.';
  }

  if (requirePassword) {
    if (!form.password) {
      errors.password = 'Le mot de passe est requis.';
    } else if (form.password.length < 6) {
      errors.password = 'Le mot de passe doit faire au moins 6 caractères.';
    } else if (form.password !== form.passwordConfirmation) {
      errors.password_confirmation = 'Les mots de passe ne correspondent pas.';
    }
  }

  return errors;
}

/** Form prefill when opening the edit sheet. */
export function employeeToForm(employee) {
  return {
    ...EMPTY_EMPLOYEE_FORM,
    firstname: employee?.firstname || '',
    name: employee?.name || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
  };
}

/**
 * Which site the screen should show: the one the shell handed us when it is a
 * real site of this client, otherwise the first one.
 */
export function resolveSite(spaces, preferredSiteId) {
  const list = Array.isArray(spaces) ? spaces.filter(space => space?.id != null) : [];
  if (list.length === 0) {
    return null;
  }

  const preferred = list.find(space => String(space.id) === String(preferredSiteId));
  return preferred || list[0];
}
