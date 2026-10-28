/*
### Screen: Extras Portal : Mission
**Associated Route/Context**: `/extras (Tab/Modal: Mission)`  
**Total Discovered Backend Calls**: 7

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`Mission.jsx:114`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Mission.jsx#L114) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/missions/show/' + mission.id` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Mission.jsx:115`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Mission.jsx#L115) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/missions/' + mission.id + '/files` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Mission.jsx:793`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Mission.jsx#L793) | User Action Handler (`Mission`) | `Mission` | `GET` | `/extras/missions/matching` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Mission.jsx:794`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Mission.jsx#L794) | User Action Handler (`Mission`) | `Mission` | `GET` | `/extra/my-availabilities` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Mission.jsx:833`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Mission.jsx#L833) | Action Button / Moderation Action (`handleAccept`) | `handleAccept` | `POST` | `/extras/missions/respond/' + missionId` | `{` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Mission.jsx:849`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Mission.jsx#L849) | User Action Handler (`handleDecline`) | `handleDecline` | `POST` | `/extras/missions/respond/' + missionId` | `{ status:'refusee'` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`Mission.jsx:626`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/Mission.jsx#L626) | Document Download / Preview (`Block / Inline`) | `Block / Inline` | `GET` | `/api/files/extra-doc/... (`/files/mission/${f.id}`)` | `None (Blob / Stream)` | Bearer token (Authorization header) | Confirmed (Protected File Download) |


*/

