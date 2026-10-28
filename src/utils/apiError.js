// Shared mapping of API failures to something a screen can display.
//
// The backend answers with three shapes worth knowing about:
//   422 { errors: { field: ['message'] } }   Laravel validation
//   403/404 { error: '...' }                 domain refusals
//   anything else                            { message: '...' }
// plus the transport failures fetchClient raises (network, timeout, 429).

/** { field: 'first message' } out of a 422 payload, or {}. */
export function extractFieldErrors(error) {
  const errors = error?.data?.errors;
  if (!errors || typeof errors !== 'object') {
    return {};
  }

  const fields = {};
  Object.entries(errors).forEach(([field, messages]) => {
    const first = Array.isArray(messages) ? messages.find(Boolean) : messages;
    if (first) {
      fields[field] = String(first);
    }
  });

  return fields;
}

/** One human-readable sentence for any fetchClient error. */
export function describeApiError(error) {
  if (error?.status === 422) {
    const fields = extractFieldErrors(error);
    const first = Object.values(fields).find(Boolean);
    if (first) {
      return first;
    }
    // Not every 422 is a validation bag: the sites endpoints answer
    // { error: 'Vous avez déjà un site similaire…' } with no `errors` key.
    return (
      error?.data?.error ||
      error?.data?.message ||
      'Certaines informations sont invalides.'
    );
  }

  switch (error?.type) {
    case 'network':
      return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    case 'timeout':
      return 'Le serveur met trop de temps à répondre. Réessayez.';
    case 'rate_limit':
      return 'Trop de tentatives. Patientez quelques instants.';
    case 'unauthorized':
      return 'Votre session a expiré. Merci de vous reconnecter.';
    default:
      break;
  }

  if (error?.status === 403) {
    return error?.data?.error || error?.data?.message || 'Accès refusé.';
  }
  if (error?.status === 404) {
    return error?.data?.error || error?.data?.message || 'Élément introuvable.';
  }

  return error?.data?.error || error?.message || 'Une erreur est survenue.';
}

export default describeApiError;
