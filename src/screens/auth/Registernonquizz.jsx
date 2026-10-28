/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Inscription Extra (Sans Quiz)
 * **Associated Route/Context**: `/inscription/extra-non-quizz`  
 * **Total Discovered Backend Calls**: 3
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Registernonquizz.jsx:217`](file:///C:/Users/Workspace/staffly-frontend/src/pages/inscription/Registernonquizz.jsx#L217) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `BASE_URL + '/qualifications/public` | `None` | Public (No auth) | Confirmed |
 * | [`Registernonquizz.jsx:260`](file:///C:/Users/Workspace/staffly-frontend/src/pages/inscription/Registernonquizz.jsx#L260) | User Action Handler (`handleNextFromStep0`) | `handleNextFromStep0` | `POST` | `BASE_URL + '/check-email` | `None` | Public (No auth) | Confirmed |
 * | [`Registernonquizz.jsx:318`](file:///C:/Users/Workspace/staffly-frontend/src/pages/inscription/Registernonquizz.jsx#L318) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `BASE_URL + '/extra/register` | `formData` | Public (No auth) | Confirmed |
 * 
 * =====================================================================
 */

import React from 'react';
import { View, Text } from 'react-native';

export default function Registernonquizz() {
  return (
    <View>
      <Text>Registernonquizz</Text>
    </View>
  );
}
