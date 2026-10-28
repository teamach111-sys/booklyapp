path = 'C:/Users/Workspace/playground/reactnative/booklyapp/src/screens/auth/Clients.jsx'
with open(path, encoding='utf-8') as f:
    content = f.read()

bad = '''/*
### Screen: Admin Portal : AdminCalendrierClients
**Associated Route/Context**: `/admin (Tab/Modal: AdminCalendrierClients)`  
**Total Discovered Backend Calls**: 1

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`AdminCalendrierClients.jsx:162`](file:///C:/Users/Workspace/staffly-frontend/src/pages/admin/components/AdminCalendrierClients.jsx#L162) | User Action Handler (`AdminCalendrierMissions`) | `AdminCalendrierMissions` | `GET` | `/admin/calendar/missions` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |


*/

'''
if bad in content:
    content = content.replace(bad, '')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('fixed')
else:
    print('not found')
