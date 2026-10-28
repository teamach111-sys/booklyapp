/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Service Layer : extraService
 * **Associated Route/Context**: `Extras API Service Layer`
 * **Discovered Endpoints**:
 * - GET  /my-dashboard-data
 * - GET  /extra/form-options
 * - POST /extra/update
 * - DELETE /extra/documents/:key
 * - GET  /extra/my-availabilities
 * - POST /extra/availability
 * - DELETE /extra/availability/:id
 * - GET  /extras/missions/matching
 * - GET  /missions/show/:id
 * - GET  /missions/:id/files
 * - POST /extras/missions/respond/:id
 * - GET  /extra/invoices
 * - GET  /extra/invoices/:id
 * - GET  /extra/completed-missions
 * - POST /extra/invoices/generate
 * - GET  /missions/:id/retour
 * - PUT  /missions/:id/retour
 * - POST /missions/:id/retour/photos
 * - DELETE /missions/:id/retour/photos/:photoId
 * - POST /missions/:id/retour/send
 * =====================================================================
 */
import { fetchClient } from './fetchClient';

// ─── PROFILE & DASHBOARD ─────────────────────────────
export const getMyDashboardData = () => fetchClient('/my-dashboard-data');

export const getExtraFormOptions = () => fetchClient('/extra/form-options');

export const updateExtraProfile = (payload) => {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
  return fetchClient('/extra/update', {
    method: 'POST',
    body: payload,
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
};

export const deleteExtraDocument = (key) =>
  fetchClient(`/extra/documents/${key}`, { method: 'DELETE' });

export const deleteExtraPhoto = () =>
  fetchClient('/extra/update', {
    method: 'POST',
    body: { remove_photo: true },
  });

// ─── AVAILABILITY ─────────────────────────────────────
export const getMyAvailabilities = () => fetchClient('/extra/my-availabilities');

export const addAvailability = (availabilities) =>
  fetchClient('/extra/availability', {
    method: 'POST',
    body: { availabilities },
  });

export const deleteAvailability = (id) =>
  fetchClient(`/extra/availability/${id}`, { method: 'DELETE' });

// ─── MISSIONS & PRESTATIONS ───────────────────────────
export const getMatchingMissions = () => fetchClient('/extras/missions/matching');

export const getMissionShow = (id) => fetchClient(`/missions/show/${id}`);

export const getMissionFiles = (id) => fetchClient(`/missions/${id}/files`);

export const respondMission = (id, payload) =>
  fetchClient(`/extras/missions/respond/${id}`, {
    method: 'POST',
    body: typeof payload === 'string' ? { status: payload } : payload,
  });

// ─── FACTURATION & RECAP ──────────────────────────────
export const getExtraInvoices = () => fetchClient('/extra/invoices');

export const getExtraInvoiceDetails = (id) => fetchClient(`/extra/invoices/${id}`);

export const getCompletedMissions = () => fetchClient('/extra/completed-missions');

export const generateExtraInvoice = (payload) =>
  fetchClient('/extra/invoices/generate', {
    method: 'POST',
    body: payload,
  });

// ─── RETOUR PRESTATION ────────────────────────────────
export const getMissionRetour = (missionId) =>
  fetchClient(`/missions/${missionId}/retour`);

export const saveMissionRetour = (missionId, patch) =>
  fetchClient(`/missions/${missionId}/retour`, {
    method: 'PUT',
    body: patch,
  });

export const uploadMissionRetourPhotos = (missionId, formData) =>
  fetchClient(`/missions/${missionId}/retour/photos`, {
    method: 'POST',
    body: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteMissionRetourPhoto = (missionId, photoId) =>
  fetchClient(`/missions/${missionId}/retour/photos/${photoId}`, {
    method: 'DELETE',
  });

export const sendMissionRetour = (missionId) =>
  fetchClient(`/missions/${missionId}/retour/send`, {
    method: 'POST',
  });

export default {
  getMyDashboardData,
  getExtraFormOptions,
  updateExtraProfile,
  deleteExtraDocument,
  deleteExtraPhoto,
  getMyAvailabilities,
  addAvailability,
  deleteAvailability,
  getMatchingMissions,
  getMissionShow,
  getMissionFiles,
  respondMission,
  getExtraInvoices,
  getExtraInvoiceDetails,
  getCompletedMissions,
  generateExtraInvoice,
  getMissionRetour,
  saveMissionRetour,
  uploadMissionRetourPhotos,
  deleteMissionRetourPhoto,
  sendMissionRetour,
};
