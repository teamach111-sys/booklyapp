/*
### Screen: Client Portal : Clientcustomrates
**Associated Route/Context**: `/client (Tab/Modal: Clientcustomrates)`  
**Total Discovered Backend Calls**: 3

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`Clientcustomrates.jsx:33`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Clientcustomrates.jsx#L33) | User Action Handler (`ClientCustomRates`) | `ClientCustomRates` | `GET` | `/sites/${siteId}/rates` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`Clientcustomrates.jsx:62`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Clientcustomrates.jsx#L62) | Form Submit / Create Button (`saveEdit`) | `saveEdit` | `PUT` | `/sites/${siteId}/rates/${code}` | `{ taux_horaire: semaine` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`Clientcustomrates.jsx:80`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Clientcustomrates.jsx#L80) | User Action Handler (`resetToGlobal`) | `resetToGlobal` | `DELETE` | `/sites/${siteId}/rates/${code}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |


*/

/*
### Screen: Admin Portal : ClientCustomRates
**Associated Route/Context**: `/admin (Tab/Modal: ClientCustomRates)`  
**Total Discovered Backend Calls**: 3

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`ClientCustomRates.jsx:23`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/ClientCustomRates.jsx#L23) | User Action Handler (`ClientCustomRates`) | `ClientCustomRates` | `GET` | `/sites/${siteId}/rates` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`ClientCustomRates.jsx:61`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/ClientCustomRates.jsx#L61) | Form Submit / Create Button (`saveEdit`) | `saveEdit` | `PUT` | `/sites/${siteId}/rates/${code}` | `{ taux_horaire: semaine` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`ClientCustomRates.jsx:79`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/ClientCustomRates.jsx#L79) | User Action Handler (`resetToGlobal`) | `resetToGlobal` | `DELETE` | `/sites/${siteId}/rates/${code}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |


*/

