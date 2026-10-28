/*
### Screen: Admin Portal : AdminClients
**Associated Route/Context**: `/admin (Tab/Modal: AdminClients)`  
**Total Discovered Backend Calls**: 12

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`AdminClients.jsx:140`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminClients.jsx#L140) | User Action Handler (`handleSelect`) | `handleSelect` | `PUT` | `/admin/clients/${clientId}` | `{ status: newStatus` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminClients.jsx:213`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminClients.jsx#L213) | Data Fetch / Revalidation (`loadClient`) | `loadClient` | `GET` | `/admin/clients/${clientId}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminClients.jsx:246`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminClients.jsx#L246) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/admin/clients/${clientId}/co-owners` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminClients.jsx:267`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminClients.jsx#L267) | Delete / Cancel Button (`deleteSpace`) | `deleteSpace` | `DELETE` | `/admin/clients/${clientId}/spaces/${s.id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminClients.jsx:283`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminClients.jsx#L283) | Form Submit / Create Button (`handleSave`) | `handleSave` | `PUT` | `/admin/clients/${clientId}` | `{` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminClients.jsx:317`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminClients.jsx#L317) | User Action Handler (`handleSendMessage`) | `handleSendMessage` | `POST` | `/messages` | `{ receiver_id: client?.client?.user_id` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`AdminClients.jsx:332`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminClients.jsx#L332) | Form Submit / Create Button (`saveCoOwner`) | `saveCoOwner` | `PUT` | `/admin/co-owners/${userId}` | `coForm` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminClients.jsx:344`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminClients.jsx#L344) | Delete / Cancel Button (`deleteCoOwner`) | `deleteCoOwner` | `DELETE` | `/admin/co-owners/${co.user_id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminClients.jsx:620`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminClients.jsx#L620) | Delete / Cancel Button (`handleDeleteClient`) | `handleDeleteClient` | `DELETE` | `/admin/clients/${client.id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminClients.jsx:635`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminClients.jsx#L635) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/admin/clients` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`AdminClients.jsx:664`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminClients.jsx#L664) | User Action Handler (`handleClientPlatformChange`) | `handleClientPlatformChange` | `PATCH` | `/admin/clients/${clientId}/platform` | `{ platform_partner: newPlatform` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminClients.jsx:453`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminClients.jsx#L453) | Immediate execution | `Block / Inline` | `DELETE` | `/client/spaces/delete` | `s, idx` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |


*/

