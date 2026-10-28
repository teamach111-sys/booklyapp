/*
### Screen: Admin Portal : Qualifications
**Associated Route/Context**: `/admin (Tab/Modal: Qualifications)`  
**Total Discovered Backend Calls**: 7

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`Qualifications.jsx:90`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/Qualifications.jsx#L90) | Form Submit / Create Button (`handleSave`) | `handleSave` | `PUT` | `/admin/qualifications/${qualification.code}` | `{` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`Qualifications.jsx:174`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/Qualifications.jsx#L174) | Data Fetch / Revalidation (`load`) | `load` | `GET` | `/admin/qualifications` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Qualifications.jsx:175`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/Qualifications.jsx#L175) | Data Fetch / Revalidation (`load`) | `load` | `GET` | `/missions/form-options` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Qualifications.jsx:228`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/Qualifications.jsx#L228) | Form Submit / Create Button (`saveEdit`) | `saveEdit` | `PUT` | `/admin/qualifications/${code}` | `payload` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`Qualifications.jsx:242`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/Qualifications.jsx#L242) | Delete / Cancel Button (`handleDelete`) | `handleDelete` | `DELETE` | `/admin/qualifications/${q.code}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`Qualifications.jsx:253`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/Qualifications.jsx#L253) | Delete / Cancel Button (`handleDelete`) | `handleDelete` | `DELETE` | `/admin/qualifications/${q.code}` | `{ force: true` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`Qualifications.jsx:281`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/Qualifications.jsx#L281) | User Action Handler (`handleAdd`) | `handleAdd` | `POST` | `/admin/qualifications` | `{ ...payload` | Bearer token (Authstorage / localStorage) | Confirmed |


*/

