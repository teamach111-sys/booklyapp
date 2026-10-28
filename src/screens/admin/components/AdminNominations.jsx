/*
### Screen: Admin Portal : AdminNominations
**Associated Route/Context**: `/admin (Tab/Modal: AdminNominations)`  
**Total Discovered Backend Calls**: 3

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`AdminNominations.jsx:33`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminNominations.jsx#L33) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `PATCH` | `/admin/missions/${nomination.mission_id}/nominations/${nomination.extra_id}/review` | `{ action: 'decline'` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminNominations.jsx:92`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminNominations.jsx#L92) | User Action Handler (`AdminNominations`) | `AdminNominations` | `GET` | `/admin/missions/nominations/pending` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`AdminNominations.jsx:108`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminNominations.jsx#L108) | Action Button / Moderation Action (`handleApprove`) | `handleApprove` | `PATCH` | `/admin/missions/${nomination.mission_id}/nominations/${nomination.extra_id}/review` | `{ action: 'approve'` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |


*/

