/*
### Screen: Admin Portal : documents_modifications
**Associated Route/Context**: `/admin (Tab/Modal: documents_modifications)`  
**Total Discovered Backend Calls**: 4

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`documents_modifications.jsx:77`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/documents_modifications.jsx#L77) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/admin/extra/${extraId}/documents` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`documents_modifications.jsx:86`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/documents_modifications.jsx#L86) | Toggle Switch / Status Change (`updateStatus`) | `updateStatus` | `PUT` | `/admin/extra/${extraId}/document-update` | `{ type_document: doc.type_document` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`documents_modifications.jsx:94`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/documents_modifications.jsx#L94) | Toggle Switch / Status Change (`updateStatus`) | `updateStatus` | `PUT` | `/admin/extra-profile/update/${extraId}` | `{ status: 'active'` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`documents_modifications.jsx:33`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/documents_modifications.jsx#L33) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `${BASE_URL}/api/files/extra-doc/${extraId}/${doc.type_document}` | `None` | Bearer token (Authorization header) | Confirmed |


*/

