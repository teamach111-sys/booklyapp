/**
 * Shared notification normalizer.
 *
 * The backend (`staffly-backend/app/Http/Controllers/Api/NotificationController.php`)
 * returns RAW database rows with this shape:
 *
 *   {
 *     id: 7029,
 *     cible_id: 33391,   // recipient = users.id
 *     site_id: null,     // client_spaces.id, NULL = global
 *     mission_id: null,  // missions.id, NULL = global
 *     titre: "Mission approuvée — …",   // ← FRENCH title column
 *     message: "Votre mission …",        // ← FRENCH body column
 *     lu: 0,             // read flag: 0 = unread, 1 = read
 *     created_at: "2026-10-28 15:09:42",
 *   }
 *
 * There is NO `title`, `description`, `isRead`, `category`, `tag` or `read_at`
 * column. Both React Native notification screens read those camelCase
 * aliases, so every row must go through `normalizeNotification()` first.
 *
 * The category is derived client-side from the French title, exactly like the
 * working web frontend (`staffly-frontend/src/pages/components/NotificationsPanel.jsx`).
 */

/**
 * Derive a category from the notification title (mirrors the web frontend).
 * @param {string} titre
 * @returns {'welcome'|'mission'|'invoice'|'report'|'message'|'document'|'account'|'availability'|'info'}
 */
export function getNotificationCategory(titre = '') {
  const t = String(titre).toLowerCase();
  if (t.includes('bienvenu')) return 'welcome';
  if (t.includes('mission') || t.includes('prestation')) return 'mission';
  if (t.includes('factur') || t.includes('paie')) return 'invoice';
  if (t.includes('signalement') || t.includes('rapport')) return 'report';
  if (t.includes('message')) return 'message';
  if (t.includes('document')) return 'document';
  if (t.includes('compte') || t.includes('activ')) return 'account';
  if (t.includes('disponib')) return 'availability';
  return 'info';
}

/**
 * Turn a raw backend notification row into the shape the RN screens expect.
 * @param {object} raw
 * @returns {object|null}
 */
export function normalizeNotification(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const data = raw.data && typeof raw.data === 'object' ? raw.data : {};

  // ── Read flag: the backend uses `lu` (0 = unread, 1 = read) ──
  const isRead =
    raw.isRead !== undefined
      ? Boolean(raw.isRead)
      : raw.lu !== undefined && raw.lu !== null
      ? raw.lu === 1 || raw.lu === true
      : raw.read_at !== undefined
      ? Boolean(raw.read_at)
      : raw.read !== undefined
      ? Boolean(raw.read)
      : false;

  // ── Title: backend column is `titre` (French) ──
  const title =
    raw.titre ||
    raw.title ||
    data.titre ||
    data.title ||
    data.subject ||
    'Notification';

  // ── Body: backend column is `message` ──
  const message =
    raw.message ||
    raw.description ||
    data.message ||
    data.description ||
    raw.content ||
    '';

  const category = (
    raw.category ||
    data.category ||
    getNotificationCategory(title)
  )
    .toString()
    .toLowerCase();

  const createdAt = raw.created_at || raw.createdAt || raw.date || new Date().toISOString();

  // ── Formatted dates used by the client screen ──
  const parsed = new Date(createdAt);
  const validDate = !Number.isNaN(parsed.getTime());
  const dateStr = validDate
    ? parsed.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    : raw.date || '';
  const fullDate = validDate ? parsed.toLocaleString('fr-FR') : raw.fullDate || '';

  return {
    ...raw,
    id: raw.id,
    // keep the backend field around
    titre: raw.titre,
    title,
    message,
    description: message,
    category,
    type: raw.type || data.type || category.toUpperCase(),
    tag: raw.tag || data.tag || category.toUpperCase(),
    read: isRead,
    isRead,
    lu: isRead ? 1 : 0,
    createdAt,
    date: dateStr,
    fullDate,
  };
}

/**
 * Extract the notification list from whatever the API returned.
 * The backend answers `{ unread_count, data: [...] }`.
 * @param {any} payload
 * @returns {object[]}
 */
export function extractNotificationList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}
