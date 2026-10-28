/*
### Screen: Admin Portal : AdminTeam
**Associated Route/Context**: `/admin (Tab/Modal: AdminTeam)`  
**Total Discovered Backend Calls**: 3

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`AdminTeam.jsx:67`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminTeam.jsx#L67) | Form Submit / Create Button (`handleSave`) | `handleSave` | `PUT` | `/admin/update/${member.id}` | `form` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminTeam.jsx:151`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminTeam.jsx#L151) | Toggle Switch / Status Change (`toggle`) | `toggle` | `PUT` | `/admin/update/${member.id}` | `{ status: newStatus` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminTeam.jsx:289`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminTeam.jsx#L289) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/admin/team` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |


*/

