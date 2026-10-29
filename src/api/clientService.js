/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Service Layer : clientService
 * **Associated Route/Context**: `API Abstraction Layer`  
 * **Total Discovered Backend Calls**: 33
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`clientService.jsx:5`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L5) | Data Fetch / Revalidation (`getClientProfile`) | `getClientProfile` | `GET` | `/client/profile` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:8`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L8) | Data Fetch / Revalidation (`getEmployeeProfile`) | `getEmployeeProfile` | `GET` | `/employee/profile` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:11`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L11) | File Upload / Change Event (`updateClientProfile`) | `updateClientProfile` | `PUT` | `/client/profile/update` | `payload` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:21`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L21) | Data Fetch / Revalidation (`getFavoritesBySpace`) | `getFavoritesBySpace` | `GET` | `url` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`clientService.jsx:26`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L26) | User Action Handler (`addSpace`) | `addSpace` | `POST` | `/client/spaces/add` | `{ city` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:32`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L32) | Delete / Cancel Button (`deleteSpace`) | `deleteSpace` | `DELETE` | `/client/spaces/delete` | `{ city` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:38`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L38) | User Action Handler (`disableSpace`) | `disableSpace` | `POST` | `/client/spaces/disable` | `{ space_id: spaceId` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:45`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L45) | Data Fetch / Revalidation (`getExtrasForSpace`) | `getExtrasForSpace` | `GET` | `/client/spaces/' + spaceId + '/extras` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:49`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L49) | Toggle Switch / Status Change (`toggleFavoriteExtra`) | `toggleFavoriteExtra` | `POST` | `/client/favorites/toggle` | `{ space_id: spaceId` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:55`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L55) | User Action Handler (`updateFavoriteRang`) | `updateFavoriteRang` | `POST` | `/client/favorites/rang` | `{ space_id: spaceId` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:63`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L63) | Data Fetch / Revalidation (`getMissionFormOptions`) | `getMissionFormOptions` | `GET` | `/missions/form-options' + (siteId ? `?site_id=${siteId}` : ` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:66`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L66) | Data Fetch / Revalidation (`getMissionsForSpace`) | `getMissionsForSpace` | `GET` | `/missions/space/' + spaceId` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:69`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L69) | Data Fetch / Revalidation (`getMissionDetails`) | `getMissionDetails` | `GET` | `/missions/show/' + missionId` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:72`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L72) | Form Submit / Create Button (`insertMission`) | `insertMission` | `POST` | `/missions/insert` | `payload` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:78`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L78) | User Action Handler (`updateMission`) | `updateMission` | `PUT` | `/missions/update/' + missionId` | `payload` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:84`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L84) | Action Button / Moderation Action (`nominateExtras`) | `nominateExtras` | `POST` | `/missions/' + missionId + '/nominate` | `{ nominations` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:90`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L90) | User Action Handler (`finishMission`) | `finishMission` | `POST` | `/missions/' + missionId + '/finish` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:95`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L95) | User Action Handler (`finishMissionWithFeedback`) | `finishMissionWithFeedback` | `POST` | `/missions/' + id + '/finish` | `payload` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:98`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L98) | Delete / Cancel Button (`cancelMission`) | `cancelMission` | `POST` | `/missions/' + id + '/cancel` | `{ reason` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:104`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L104) | Delete / Cancel Button (`archiveMission`) | `archiveMission` | `POST` | `/missions/' + id + '/archive` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:107`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L107) | Delete / Cancel Button (`deleteMission`) | `deleteMission` | `DELETE` | `/missions/' + id` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:111`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L111) | Data Fetch / Revalidation (`getClientCalendarMissions`) | `getClientCalendarMissions` | `GET` | `/client/calendar/missions` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:115`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L115) | Data Fetch / Revalidation (`getClientInvoice`) | `getClientInvoice` | `GET` | `/invoice/mission/' + missionId` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:119`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L119) | Data Fetch / Revalidation (`getNotifications`) | `getNotifications` | `GET` | `/notifications` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:122`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L122) | Data Fetch / Revalidation (`getNotificationById`) | `getNotificationById` | `GET` | `/notifications/' + id` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:126`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L126) | Data Fetch / Revalidation (`getConversations`) | `getConversations` | `GET` | `/messages/conversations` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:129`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L129) | Data Fetch / Revalidation (`getDiscussion`) | `getDiscussion` | `GET` | `/messages/discussion/' + otherUserId` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:132`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L132) | User Action Handler (`sendMessage`) | `sendMessage` | `POST` | `/messages` | `payload` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:138`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L138) | File Upload / Change Event (`updateEmployeeProfile`) | `updateEmployeeProfile` | `PUT` | `/employee/profile/update` | `payload` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:154`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L154) | Data Fetch / Revalidation (`getCoOwners`) | `getCoOwners` | `GET` | `/client/co-owners` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:155`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L155) | User Action Handler (`addCoOwner`) | `addCoOwner` | `POST` | `/client/co-owners` | `payload` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`clientService.jsx:156`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L156) | Delete / Cancel Button (`removeCoOwner`) | `removeCoOwner` | `DELETE` | `/client/co-owners/${id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`clientService.jsx:145`](file:///C:/Users/Workspace/staffly-frontend/src/services/clientService.jsx#L145) | File Upload / Change Event (`updateProfilePhoto`) | `updateProfilePhoto` | `GET` | `(import.meta.env.VITE_API_URL \|\| 'http://localhost:8000/api` | `None` | Public (No auth) | Confirmed |
 * 
 * =====================================================================
 */
import { fetchClient } from './fetchClient';

// ─── PROFILE ─────────────────────────────────────────
export const getClientProfile = () =>
  fetchClient('/client/profile');

export const getEmployeeProfile = () =>
  fetchClient('/employee/profile');

export const updateClientProfile = payload =>
  fetchClient('/client/profile/update', {
    method: 'PUT',
    body: payload,
  });

export const updateEmployeeProfile = payload =>
  fetchClient('/employee/profile/update', {
    method: 'PUT',
    body: payload,
  });

export const updateProfilePhoto = formData =>
  fetchClient('/client/profile/photo', {
    method: 'POST',
    body: formData,
  });

export const deleteProfilePhoto = () =>
  fetchClient('/client/profile/photo', {
    method: 'DELETE',
  });

// ─── SPACES ──────────────────────────────────────────
export const addSpace = city =>
  fetchClient('/client/spaces/add', {
    method: 'POST',
    body: { city },
  });

export const deleteSpace = city =>
  fetchClient('/client/spaces/delete', {
    method: 'DELETE',
    body: { city },
  });

export const disableSpace = spaceId =>
  fetchClient('/client/spaces/disable', {
    method: 'POST',
    body: { space_id: spaceId },
  });

// ─── FAVORITES & EXTRAS ──────────────────────────────
export const getFavoritesBySpace = (spaceId, dateDebut = null, dateFin = null) => {
  let url = '/client/spaces/' + spaceId + '/favorites';
  if (dateDebut && dateFin) {
    url +=
      '?date_debut=' +
      encodeURIComponent(dateDebut) +
      '&date_fin=' +
      encodeURIComponent(dateFin);
  }
  return fetchClient(url);
};

export const getExtrasForSpace = spaceId =>
  fetchClient('/client/spaces/' + spaceId + '/extras');

export const toggleFavoriteExtra = (spaceId, extraId) =>
  fetchClient('/client/favorites/toggle', {
    method: 'POST',
    body: { space_id: spaceId, extra_id: extraId },
  });

export const updateFavoriteRang = (spaceId, extraId, rang) =>
  fetchClient('/client/favorites/rang', {
    method: 'POST',
    body: { space_id: spaceId, extra_id: extraId, rang },
  });

// ─── CO-OWNERS ───────────────────────────────────────
export const getCoOwners = () =>
  fetchClient('/client/co-owners');

export const addCoOwner = payload =>
  fetchClient('/client/co-owners', {
    method: 'POST',
    body: payload,
  });

export const removeCoOwner = id =>
  fetchClient(`/client/co-owners/${id}`, {
    method: 'DELETE',
  });

// ─── EMPLOYEES ───────────────────────────────────────
export const getSiteEmployees = siteId =>
  fetchClient(`/sites/${siteId}/employees`);

export const addEmployee = (siteId, payload) =>
  fetchClient(`/sites/${siteId}/employees`, {
    method: 'POST',
    body: payload,
  });

export const updateEmployee = (employeeId, payload) =>
  fetchClient(`/employees/${employeeId}`, {
    method: 'PUT',
    body: payload,
  });

export const toggleEmployeeStatus = (employeeId, status) =>
  fetchClient(`/employees/${employeeId}/status`, {
    method: 'PATCH',
    body: { status },
  });

export const deleteEmployee = employeeId =>
  fetchClient(`/employees/${employeeId}`, {
    method: 'DELETE',
  });

export const getEmployeeActivity = (siteId, params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '' && value !== 'ALL') {
      query.append(key, value);
    }
  });
  const queryString = query.toString();
  return fetchClient(
    `/client/sites/${siteId}/employee-activity${
      queryString ? `?${queryString}` : ''
    }`,
  );
};

// ─── RATES ───────────────────────────────────────────
export const getSiteRates = siteId =>
  fetchClient(`/sites/${siteId}/rates`);

export const updateSiteRate = (siteId, code, tauxHoraire) =>
  fetchClient(`/sites/${siteId}/rates/${code}`, {
    method: 'PUT',
    body: { taux_horaire: tauxHoraire },
  });

export const resetSiteRate = (siteId, code) =>
  fetchClient(`/sites/${siteId}/rates/${code}`, {
    method: 'DELETE',
  });

// ─── MISSIONS ────────────────────────────────────────
export const getMissionFormOptions = siteId =>
  fetchClient('/missions/form-options' + (siteId ? `?site_id=${siteId}` : ''));

export const getMissionsForSpace = spaceId =>
  fetchClient('/missions/space/' + spaceId);

export const getMissionDetails = missionId =>
  fetchClient('/missions/show/' + missionId);

export const getMissionFiles = missionId =>
  fetchClient(`/missions/${missionId}/files`);

export const uploadMissionFiles = (missionId, formData) =>
  fetchClient(`/missions/${missionId}/files`, {
    method: 'POST',
    body: formData,
  });

export const deleteMissionFile = (missionId, fileId) =>
  fetchClient(`/missions/${missionId}/files/${fileId}`, {
    method: 'DELETE',
  });

export const insertMission = payload =>
  fetchClient('/missions/insert', {
    method: 'POST',
    body: payload,
  });

export const updateMission = (missionId, payload) =>
  fetchClient('/missions/update/' + missionId, {
    method: 'PUT',
    body: payload,
  });

export const nominateExtras = (missionId, nominations) =>
  fetchClient('/missions/' + missionId + '/nominate', {
    method: 'POST',
    body: { nominations },
  });

export const finishMission = missionId =>
  fetchClient('/missions/' + missionId + '/finish', {
    method: 'POST',
  });

export const finishMissionWithFeedback = (id, payload) =>
  fetchClient('/missions/' + id + '/finish', {
    method: 'POST',
    body: payload,
  });

export const evaluateMission = (missionId, payload) =>
  fetchClient(`/missions/${missionId}/evaluation`, {
    method: 'POST',
    body: payload,
  });

export const cancelMission = (id, reason = '') =>
  fetchClient('/missions/' + id + '/cancel', {
    method: 'POST',
    body: { reason },
  });

export const archiveMission = id =>
  fetchClient('/missions/' + id + '/archive', {
    method: 'POST',
  });

export const deleteMission = id =>
  fetchClient('/missions/' + id, {
    method: 'DELETE',
  });

// ─── CALENDAR ────────────────────────────────────────
export const getClientCalendarMissions = () =>
  fetchClient('/client/calendar/missions');

// ─── INVOICES ────────────────────────────────────────
export const getClientInvoice = missionId =>
  fetchClient('/invoice/mission/' + missionId);

export const getInvoiceSummary = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, v);
  });
  const qs = query.toString();
  return fetchClient('/client/invoices/summary' + (qs ? `?${qs}` : ''));
};

export const getMonthlyInvoice = (year, month, params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, v);
  });
  const qs = query.toString();
  return fetchClient(
    `/client/invoices/monthly/${year}/${month}` + (qs ? `?${qs}` : ''),
  );
};

export const getClientBillingInvoices = () =>
  fetchClient('/client/billing/invoices');

// ─── NOTIFICATIONS ───────────────────────────────────
export const getNotifications = () =>
  fetchClient('/notifications');

export const getNotificationById = id =>
  fetchClient('/notifications/' + id);

export const getUnreadNotificationCount = (siteId = null) =>
  fetchClient(
    siteId
      ? `/notifications/unread-count?site_id=${siteId}`
      : '/notifications/unread-count',
  );

export const getUnreadCount = getUnreadNotificationCount;

export const markNotificationRead = id =>
  fetchClient(`/notifications/${id}/read`, {
    method: 'PATCH',
  });

export const markAllNotificationsRead = (siteId = null) =>
  fetchClient(
    siteId
      ? `/notifications/read-all?site_id=${siteId}`
      : '/notifications/read-all',
    {
      method: 'PATCH',
    },
  );

export const deleteNotification = id =>
  fetchClient(`/notifications/${id}`, {
    method: 'DELETE',
  });

export const getNotificationTargets = ids =>
  fetchClient('/notifications/targets', {
    method: 'POST',
    body: { ids },
  });

// ─── MESSAGES & DISCUSSIONS ──────────────────────────
export const getConversations = () =>
  fetchClient('/messages/conversations').catch(() =>
    fetchClient('/client/conversations').catch(() => fetchClient('/messages')),
  );

export const getDiscussion = otherUserId =>
  fetchClient('/messages/discussion/' + otherUserId).catch(() =>
    fetchClient(`/messages/thread/${otherUserId}`).catch(() =>
      fetchClient(`/client/messages/discussion/${otherUserId}`),
    ),
  );

export const getMessages = conversationOrUserId => {
  // Supports either otherUserId or conversationId
  return fetchClient('/messages/discussion/' + conversationOrUserId).catch(() =>
    fetchClient(`/client/conversations/${conversationOrUserId}/messages`),
  );
};

export const sendMessage = (payloadOrId, body) => {
  if (typeof payloadOrId === 'object') {
    return fetchClient('/messages', {
      method: 'POST',
      body: payloadOrId,
    });
  }
  return fetchClient(`/client/conversations/${payloadOrId}/messages`, {
    method: 'POST',
    body,
  });
};

export const createConversation = payload =>
  fetchClient('/client/conversations', {
    method: 'POST',
    body: payload,
  });

export const getContacts = (tab = 'staff', search = '') => {
  let url = `/messages/contacts?tab=${encodeURIComponent(tab)}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  return fetchClient(url);
};

export const getMessageContacts = (tab = 'staff', search = '') => getContacts(tab, search);
export const fetchContacts = (tab = 'staff', search = '') => getContacts(tab, search);
export const getContactsList = (tab = 'staff', search = '') => getContacts(tab, search);

export const sendReport = payload =>
  fetchClient('/messages/report', {
    method: 'POST',
    body: payload,
  });

export const getMyReports = () =>
  fetchClient('/messages/my-reports');

export const getReportThread = reportId =>
  fetchClient(`/messages/reports/${reportId}/thread`);

export const replyReport = (reportId, content) =>
  fetchClient(`/messages/reports/${reportId}/reply`, {
    method: 'POST',
    body: { content },
  });

export const closeReport = reportId =>
  fetchClient(`/messages/reports/${reportId}/close`, {
    method: 'PATCH',
  });

// ─── RETOUR PRESTATION ───────────────────────────────
export const getMissionRetour = missionId =>
  fetchClient(`/missions/${missionId}/retour`);

export const saveMissionRetour = (missionId, patch) =>
  fetchClient(`/missions/${missionId}/retour`, {
    method: 'PUT',
    body: patch,
  });

export const uploadRetourPhotos = (missionId, formData) =>
  fetchClient(`/missions/${missionId}/retour/photos`, {
    method: 'POST',
    body: formData,
  });

export const removeRetourPhoto = (missionId, photoId) =>
  fetchClient(`/missions/${missionId}/retour/photos/${photoId}`, {
    method: 'DELETE',
  });

export const sendMissionRetour = missionId =>
  fetchClient(`/missions/${missionId}/retour/send`, {
    method: 'POST',
  });

// ─── MODIFICATION CONVERSATIONS ──────────────────────
export const getModificationConversationsUnread = () =>
  fetchClient('/modification-conversations/unread');

export const getModificationConversation = missionId =>
  fetchClient(`/modification-conversations/${missionId}`);

export const sendModificationConversation = payload =>
  fetchClient('/modification-conversations', {
    method: 'POST',
    body: payload,
  });

export default {
  getClientProfile,
  getEmployeeProfile,
  updateClientProfile,
  updateEmployeeProfile,
  updateProfilePhoto,
  deleteProfilePhoto,
  addSpace,
  deleteSpace,
  disableSpace,
  getFavoritesBySpace,
  getExtrasForSpace,
  toggleFavoriteExtra,
  updateFavoriteRang,
  getCoOwners,
  addCoOwner,
  removeCoOwner,
  getSiteEmployees,
  addEmployee,
  updateEmployee,
  toggleEmployeeStatus,
  deleteEmployee,
  getEmployeeActivity,
  getSiteRates,
  updateSiteRate,
  resetSiteRate,
  getMissionFormOptions,
  getMissionsForSpace,
  getMissionDetails,
  getMissionFiles,
  uploadMissionFiles,
  deleteMissionFile,
  insertMission,
  updateMission,
  nominateExtras,
  finishMission,
  finishMissionWithFeedback,
  evaluateMission,
  cancelMission,
  archiveMission,
  deleteMission,
  getClientCalendarMissions,
  getClientInvoice,
  getInvoiceSummary,
  getMonthlyInvoice,
  getClientBillingInvoices,
  getNotifications,
  getNotificationById,
  getUnreadNotificationCount,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getNotificationTargets,
  getConversations,
  getDiscussion,
  getMessages,
  sendMessage,
  createConversation,
  getContacts,
  sendReport,
  getMyReports,
  getReportThread,
  replyReport,
  closeReport,
  getMissionRetour,
  saveMissionRetour,
  uploadRetourPhotos,
  removeRetourPhoto,
  sendMissionRetour,
  getModificationConversationsUnread,
  getModificationConversation,
  sendModificationConversation,
};
