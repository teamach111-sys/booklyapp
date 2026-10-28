/*
### Screen: Admin Portal : AdminPublishMission
**Associated Route/Context**: `/admin (Tab/Modal: AdminPublishMission)`  
**Total Discovered Backend Calls**: 11

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`AdminPublishMission.jsx:187`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminPublishMission.jsx#L187) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/admin/clients` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`AdminPublishMission.jsx:187`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminPublishMission.jsx#L187) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/missions/form-options` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`AdminPublishMission.jsx:207`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminPublishMission.jsx#L207) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/missions/show/${duplicateFromId}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminPublishMission.jsx:260`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminPublishMission.jsx#L260) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/admin/clients/${clientUserId}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminPublishMission.jsx:287`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminPublishMission.jsx#L287) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/client/sites/${selectedSite}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminPublishMission.jsx:296`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminPublishMission.jsx#L296) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/missions/form-options?site_id=${selectedSite}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminPublishMission.jsx:312`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminPublishMission.jsx#L312) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/admin/extras/by-rank?rank=${rank}&qualification_code=${q}&site_id=${selectedSite}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminPublishMission.jsx:313`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminPublishMission.jsx#L313) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/admin/extras/by-rank?rank=${rank}&site_id=${selectedSite}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminPublishMission.jsx:506`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminPublishMission.jsx#L506) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `/admin/missions/publish-for-client` | `{` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`AdminPublishMission.jsx:536`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminPublishMission.jsx#L536) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `/missions/${res.mission_id}/nominate` | `{ nominations:nominationsPayload` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminPublishMission.jsx:465`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminPublishMission.jsx#L465) | Data Fetch / Revalidation (`uploadPendingFiles`) | `uploadPendingFiles` | `POST` | `${BASE_URL}/api/missions/${missionId}/files` | `None` | Bearer token (Authorization header) | Confirmed |


*/

