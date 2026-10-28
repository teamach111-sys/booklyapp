/*
### Screen: Shared Billing : AdminInvoices
**Associated Route/Context**: `Shared Component across Dashboards`  
**Total Discovered Backend Calls**: 8

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`AdminInvoices.jsx:120`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/AdminInvoices.jsx#L120) | User Action Handler (`run`) | `run` | `POST` | `/admin/billing/invoices/drafts` | `{ client_id: Number(gen.client_id)` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`AdminInvoices.jsx:194`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/AdminInvoices.jsx#L194) | User Action Handler (`AdminInvoices`) | `AdminInvoices` | `GET` | `/admin/billing/invoices` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`AdminInvoices.jsx:202`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/AdminInvoices.jsx#L202) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/admin/clients` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`AdminInvoices.jsx:256`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/AdminInvoices.jsx#L256) | Toggle Switch / Status Change (`changeStatus`) | `changeStatus` | `PATCH` | `/admin/billing/invoices/${inv.id}/status` | `{ status: next` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminInvoices.jsx:266`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/AdminInvoices.jsx#L266) | User Action Handler (`issueOne`) | `issueOne` | `POST` | `/admin/billing/invoices/${inv.id}/issue` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminInvoices.jsx:291`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/AdminInvoices.jsx#L291) | User Action Handler (`bulk`) | `bulk` | `POST` | `/admin/billing/invoices/${inv.id}/issue` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminInvoices.jsx:292`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/AdminInvoices.jsx#L292) | User Action Handler (`bulk`) | `bulk` | `PATCH` | `/admin/billing/invoices/${inv.id}/status` | `{ status: 'paid'` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`AdminInvoices.jsx:293`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/AdminInvoices.jsx#L293) | User Action Handler (`bulk`) | `bulk` | `DELETE` | `/admin/billing/invoices/${inv.id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |


*/

