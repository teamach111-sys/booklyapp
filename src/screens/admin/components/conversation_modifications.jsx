/*
### Screen: Admin Portal : conversation_modifications
**Associated Route/Context**: `/admin (Tab/Modal: conversation_modifications)`  
**Total Discovered Backend Calls**: 4

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`conversation_modifications.jsx:104`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/conversation_modifications.jsx#L104) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/modification-conversations/${mission.id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`conversation_modifications.jsx:116`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/conversation_modifications.jsx#L116) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/modification-conversations/${mission.id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`conversation_modifications.jsx:135`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/conversation_modifications.jsx#L135) | User Action Handler (`check`) | `check` | `GET` | `/modification-conversations/${mission.id}/state` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`conversation_modifications.jsx:156`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/conversation_modifications.jsx#L156) | User Action Handler (`handleSend`) | `handleSend` | `POST` | `/modification-conversations` | `{` | Bearer token (Authstorage / localStorage) | Confirmed |


*/

