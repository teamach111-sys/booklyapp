// Pure helpers behind the co-owners screen.
//
// Backend contract (staffly-backend/app/Http/Controllers/Api/Client.php):
//   GET    /client/co-owners            -> { co_owners: [...] }  (self excluded)
//   POST   /client/co-owners            -> 201                   (create only)
//   DELETE /client/co-owners/{id}       -> 200
//
// There is deliberately no edit endpoint: a co-owner is a full-access account,
// so changing one means changing that user — not something this screen offers.

/** One co-owner row from the API -> what the list renders. */
export function normalizeCoOwner(raw) {
  const firstname = (raw?.firstname || '').trim();
  const name = (raw?.name || '').trim();
  const isPrimary = Boolean(raw?.is_primary);

  return {
    id: raw?.id,
    userId: raw?.user_id,
    firstname,
    name,
    fullName: `${firstname} ${name}`.trim() || 'Compte sans nom',
    email: raw?.email || '',
    photoUrl: raw?.profile_photo_url || null,
    isPrimary,
    // The primary owner cannot be removed, and its row cannot be edited here.
    canRemove: !isPrimary,
    statusLabel: isPrimary ? 'TITULAIRE DU COMPTE' : 'ACCÈS COMPLET',
    status: raw?.status || 'active',
    initials:
      `${firstname[0] || ''}${name[0] || ''}`.toUpperCase() || 'CO',
  };
}

export function normalizeCoOwners(response) {
  const list = response?.co_owners;
  if (!Array.isArray(list)) {
    return [];
  }
  return list.map(normalizeCoOwner);
}

/** POST body — the field names the validator expects. */
export function buildCoOwnerBody(form) {
  return {
    firstname: form.firstname.trim(),
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim(),
    password: form.password,
    password_confirmation: form.passwordConfirmation,
  };
}

/**
 * Client-side checks that mirror the backend rules, so obvious mistakes do not
 * cost a round trip. Returns { field: message } — empty when the form is fine.
 */
export function validateCoOwnerForm(form) {
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

  if (!form.password) {
    errors.password = 'Le mot de passe est requis.';
  } else if (form.password.length < 6) {
    errors.password = 'Le mot de passe doit faire au moins 6 caractères.';
  } else if (form.password !== form.passwordConfirmation) {
    errors.password_confirmation = 'Les mots de passe ne correspondent pas.';
  }

  return errors;
}

export const EMPTY_CO_OWNER_FORM = {
  firstname: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirmation: '',
};
