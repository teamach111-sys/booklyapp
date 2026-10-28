/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Service Layer : authService
 * **Associated Route/Context**: `API Abstraction Layer`  
 * **Total Discovered Backend Calls**: 6
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`authService.jsx:4`](file:///C:/Users/Workspace/staffly-frontend/src/services/authService.jsx#L4) | Auth Action Button (`login`) | `login` | `POST` | `/login` | `credentials` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`authService.jsx:8`](file:///C:/Users/Workspace/staffly-frontend/src/services/authService.jsx#L8) | Auth Action Button (`logout`) | `logout` | `POST` | `/logout` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`authService.jsx:11`](file:///C:/Users/Workspace/staffly-frontend/src/services/authService.jsx#L11) | Data Fetch / Revalidation (`getExtraProfile`) | `getExtraProfile` | `GET` | `/my-dashboard-data` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`authService.jsx:12`](file:///C:/Users/Workspace/staffly-frontend/src/services/authService.jsx#L12) | Data Fetch / Revalidation (`getClientProfile`) | `getClientProfile` | `GET` | `/client/profile` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`authService.jsx:13`](file:///C:/Users/Workspace/staffly-frontend/src/services/authService.jsx#L13) | Data Fetch / Revalidation (`getClientProfile`) | `getClientProfile` | `GET` | `/my-dashboard-data` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`authService.jsx:14`](file:///C:/Users/Workspace/staffly-frontend/src/services/authService.jsx#L14) | File Upload / Change Event (`updateClientProfile`) | `updateClientProfile` | `PUT` | `/client/profile/update` | `payload` | Bearer token (Authstorage / localStorage) | Confirmed |
 * 
 * =====================================================================
 */
// Auth endpoints, mirroring staffly-frontend/src/services/authService.jsx.
//
// The backend (staffly-backend/app/Http/Controllers/Api/Auth.php) issues a
// Sanctum personal access token on POST /login:
//
//   200 { access_token, token_type: 'Bearer', user }
//   401 { message: 'Invalid credentials' }
//   403 { message: 'Compte supprimé.' }
//   422 validation errors
//
// Every other endpoint just needs the Bearer header, which fetchClient adds.

import { fetchClient } from './fetchClient';

export const authService = {
  /** Exchange credentials for a Sanctum token. */
  login: ({ email, password }) =>
    fetchClient('/login', {
      method: 'POST',
      body: { email, password },
    }),

  /**
   * Revoke a token server-side.
   *
   * Takes the token explicitly because sign-out clears the local session
   * first, so by the time this runs fetchClient has no token to attach.
   */
  logout: token =>
    fetchClient('/logout', {
      method: 'POST',
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    }),

  /** The authenticated user (GET /user, inside the auth:sanctum group). */
  currentUser: () =>
    fetchClient('/user', {
      method: 'GET',
    }),

  /** Request password reset code via email. */
  forgotPassword: email =>
    fetchClient('/password/forgot', {
      method: 'POST',
      body: { email },
    }),

  /** Submit reset code and set new password. */
  resetPassword: ({ email, code, password, password_confirmation }) =>
    fetchClient('/password/reset', {
      method: 'POST',
      body: { email, code, password, password_confirmation },
    }),

  /** Get extra profile data for dashboard. */
  getExtraProfile: () =>
    fetchClient('/my-dashboard-data', {
      method: 'GET',
    }),

  /** Get client profile. */
  getClientProfile: () =>
    fetchClient('/client/profile', {
      method: 'GET',
    }),

  /** Register a new client establishment. */
  registerClient: payload =>
    fetchClient('/register/client', {
      method: 'POST',
      body: payload,
    }),

  /** Send email verification notification. */
  sendVerificationEmail: payload =>
    fetchClient('/envoyerVerficationEmail', {
      method: 'POST',
      body: payload,
    }),

  /** Register a new extra. */
  registerExtra: formData =>
    fetchClient('/extra/register', {
      method: 'POST',
      body: formData,
    }),

  /** Check if email is already taken. */
  checkEmail: email =>
    fetchClient('/check-email', {
      method: 'POST',
      body: { email },
    }),

  /** Get public qualifications catalog. */
  getPublicQualifications: () =>
    fetchClient('/qualifications/public', {
      method: 'GET',
    }),

  /** Update client profile. */
  updateClientProfile: payload =>
    fetchClient('/client/profile/update', {
      method: 'PUT',
      body: payload,
    }),
};

export default authService;
