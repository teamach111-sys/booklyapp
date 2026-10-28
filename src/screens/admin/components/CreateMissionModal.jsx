/*
### Screen: Admin Portal : CreateMissionModal
**Associated Route/Context**: `/admin (Tab/Modal: CreateMissionModal)`  
**Total Discovered Backend Calls**: 6

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`CreateMissionModal.jsx:89`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/CreateMissionModal.jsx#L89) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/admin/clients/${client.id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`CreateMissionModal.jsx:98`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/CreateMissionModal.jsx#L98) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/missions/form-options` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`CreateMissionModal.jsx:156`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/CreateMissionModal.jsx#L156) | Form Submit / Create Button (`handleCreate`) | `handleCreate` | `POST` | `/missions/insert` | `payload` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`CreateMissionModal.jsx:174`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/CreateMissionModal.jsx#L174) | Data Fetch / Revalidation (`loadExtrasForStep2`) | `loadExtrasForStep2` | `GET` | `/client/spaces/${siteId}/favorites` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`CreateMissionModal.jsx:175`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/CreateMissionModal.jsx#L175) | Data Fetch / Revalidation (`loadExtrasForStep2`) | `loadExtrasForStep2` | `GET` | `/client/spaces/${siteId}/extras` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`CreateMissionModal.jsx:198`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/CreateMissionModal.jsx#L198) | Action Button / Moderation Action (`handleNominate`) | `handleNominate` | `POST` | `/missions/${createdMissionId}/nominate` | `{ extra_ids: nominated` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |


*/

