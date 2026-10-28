/*
### Screen: Extras Portal : Profile
**Associated Route/Context**: `/extras (Tab/Modal: Profile)`  
**Total Discovered Backend Calls**: 12

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`Profile.jsx:92`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L92) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/extra/form-options` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Profile.jsx:187`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L187) | Data Fetch / Revalidation (`refreshProfile`) | `refreshProfile` | `GET` | `/my-dashboard-data` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Profile.jsx:298`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L298) | Data Fetch / Revalidation (`handlePhotoUpload`) | `handlePhotoUpload` | `POST` | `/extra/update` | `formData` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Profile.jsx:313`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L313) | Delete / Cancel Button (`handlePhotoDelete`) | `handlePhotoDelete` | `POST` | `/extra/update` | `{ remove_photo: true` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Profile.jsx:415`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L415) | Form Submit / Create Button (`handleSave`) | `handleSave` | `POST` | `/extra/update` | `payload` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Profile.jsx:853`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L853) | File Upload / Change Event (`handleFileSelect`) | `handleFileSelect` | `POST` | `/extra/update` | `formData` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Profile.jsx:868`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L868) | Delete / Cancel Button (`handleDelete`) | `handleDelete` | `DELETE` | `/extra/documents/${key}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`Profile.jsx:997`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L997) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/extra/form-options` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Profile.jsx:1015`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L1015) | Form Submit / Create Button (`handleSave`) | `handleSave` | `POST` | `/extra/update` | `{ skills: localSkills.map(s => ({ code: s.code` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Profile.jsx:1101`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L1101) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/extra/form-options` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Profile.jsx:1118`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L1118) | Form Submit / Create Button (`handleSave`) | `handleSave` | `POST` | `/extra/update` | `{ qualifications: localQuals` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Profile.jsx:926`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Profile.jsx#L926) | Document Download / Preview (`handleDelete`) | `handleDelete` | `GET` | `/api/files/extra-doc/... (extraId, key)` | `None (Blob / Stream)` | Bearer token (Authorization header) | Confirmed (Protected File Download) |


*/

/*
### Screen: Client Portal : Profile
**Associated Route/Context**: `/client (Tab/Modal: Profile)`  
**Total Discovered Backend Calls**: 7

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`Profile.jsx:132`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Profile.jsx#L132) | Form Submit / Create Button (`handleSave`) | `handleSave` | `DELETE` | `/client/profile/photo` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Profile.jsx:146`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Profile.jsx#L146) | Form Submit / Create Button (`handleSave`) | `handleSave` | `PUT` | `/client/profile/update` | `{` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Profile.jsx:206`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Profile.jsx#L206) | Form Submit / Create Button (`handleSavePassword`) | `handleSavePassword` | `PUT` | `endpoint` | `{ current_password: pwForm.current_password` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`Profile.jsx:125`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Profile.jsx#L125) | Form Submit / Create Button (`handleSave`) | `handleSave` | `POST` | `${BASE_URL}/api/client/profile/photo` | `None` | Bearer token (Authorization header) | Confirmed |
| [`Profile.jsx:57`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Profile.jsx#L57) | User Action Handler (`Field`) | `Field` | `GET` | `/client/profile` | `None` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
| [`Profile.jsx:57`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Profile.jsx#L57) | User Action Handler (`Field`) | `Field` | `GET` | `/employee/profile` | `None` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
| [`Profile.jsx:138`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Profile.jsx#L138) | Form Submit / Create Button (`handleSave`) | `handleSave` | `PUT` | `/employee/profile/update` | `{           firstname: form.firstname,           name:      form.name,           email:     form.email,           phone:     form.phone \|\| null,         }` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |


*/

/*
### Screen: Admin Portal : Profile
**Associated Route/Context**: `/admin (Tab/Modal: Profile)`  
**Total Discovered Backend Calls**: 3

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`Profile.jsx:125`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/Profile.jsx#L125) | Form Submit / Create Button (`handleSave`) | `handleSave` | `PUT` | `/admin/update/${adminData.id}` | `{ firstname: form.firstname` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`Profile.jsx:150`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/Profile.jsx#L150) | Form Submit / Create Button (`handleSavePassword`) | `handleSavePassword` | `PUT` | `/admin/update/${adminData.id}` | `{ current_password: pwForm.current_password` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`Profile.jsx:113`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/Profile.jsx#L113) | Form Submit / Create Button (`handleSave`) | `handleSave` | `POST` | `${BASE_URL}/api/admin/profile/photo` | `None` | Bearer token (Authorization header) | Confirmed |


*/

