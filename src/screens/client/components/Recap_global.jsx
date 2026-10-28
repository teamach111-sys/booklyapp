/*
### Screen: Extras Portal : ExtraRecapGlobal
**Associated Route/Context**: `/extras (Tab/Modal: ExtraRecapGlobal)`  
**Total Discovered Backend Calls**: 2

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`ExtraRecapGlobal.jsx:36`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/ExtraRecapGlobal.jsx#L36) | User Action Handler (`handleConfirm`) | `handleConfirm` | `POST` | `/extra/invoices/generate` | `{` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`ExtraRecapGlobal.jsx:150`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/ExtraRecapGlobal.jsx#L150) | User Action Handler (`ExtraRecapGlobal`) | `ExtraRecapGlobal` | `GET` | `/extra/completed-missions` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |


*/

/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Client Portal : Recap_global
 * **Associated Route/Context**: `/client (Tab/Modal: Recap_global)`  
 * **Total Discovered Backend Calls**: 2
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: |
 * | [`Recap_global.jsx:53`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Recap_global.jsx#L53) | User Action Handler (`Recap_global`) | `Recap_global` | `GET` | `/missions/space/' + selectedSpace.id` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Recap_global.jsx:79`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Recap_global.jsx#L79) | User Action Handler (`openDetail`) | `openDetail` | `GET` | `/invoice/mission/' + m.id` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * 
 * =====================================================================
 */

import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { ArrowLeft, CheckCircle, Clock, Eye, FileText } from 'lucide-react-native';
import { useClientTheme } from '../theme/ClientThemeContext';
import { useClientSites } from '../state/SitesContext';
import clientService from '../../../api/clientService';

export default function Recap_global({ selectedSpace: propSpace }) {
  const { colors } = useClientTheme();
  const { activeSite } = useClientSites();
  const space = propSpace || activeSite;

  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState(null);
  const [invoiceDetail, setInvoiceDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadMissions = useCallback(async () => {
    if (!space?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await clientService.getMissionsForSpace(space.id);
      const list = Array.isArray(data) ? data : data?.missions || [];
      const finished = list.filter(
        m => m.etat_mission === 'Terminée' || m.status === 'Terminée',
      );
      setMissions(finished);
    } catch {
      setMissions([]);
    } finally {
      setLoading(false);
    }
  }, [space?.id]);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const openDetail = async m => {
    setSelectedMission(m);
    setDetailLoading(true);
    try {
      const data = await clientService.getClientInvoice(m.id);
      setInvoiceDetail(data);
    } catch (err) {
      Alert.alert(
        'Détails prestation',
        `Mission : ${m.prestation_nom || m.titre || '#' + m.id}\nStatut : ${m.etat_mission}`,
      );
      setSelectedMission(null);
    } finally {
      setDetailLoading(false);
    }
  };

  if (!space?.id) {
    return (
      <View style={{ padding: 40, alignItems: 'center' }}>
        <Text style={{ color: '#888', fontSize: 14 }}>
          Sélectionnez un site pour afficher le récapitulatif global.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ padding: 40, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={colors.orange} />
      </View>
    );
  }

  if (selectedMission && detailLoading) {
    return (
      <View style={{ padding: 40, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={colors.orange} />
      </View>
    );
  }

  if (selectedMission && invoiceDetail) {
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{ gap: 14 }}>
        <Pressable
          onPress={() => {
            setSelectedMission(null);
            setInvoiceDetail(null);
          }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}
        >
          <ArrowLeft size={18} color={colors.brown} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.brown }}>
            Retour au récapitulatif
          </Text>
        </Pressable>

        <View
          style={{
            backgroundColor: '#FFF',
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: '#F0E4DD',
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.brown }}>
            Détails facture — {selectedMission.prestation_nom || selectedMission.nom}
          </Text>
          <Text style={{ fontSize: 13, color: '#666' }}>
            Date : {selectedMission.date_debut || '—'}
          </Text>
          <Text style={{ fontSize: 13, color: '#666' }}>
            Adresse : {selectedMission.adresse_exacte || '—'}
          </Text>

          <View style={{ height: 1, backgroundColor: '#F0E4DD' }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.brown }}>
              Total à payer
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.orange }}>
              {invoiceDetail.total_to_pay || selectedMission.total_ttc || '0'} € TTC
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFF',
          padding: 14,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#F0E4DD',
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.brown }}>
          Récapitulatif global — {space.name || 'Site'}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.orangeDark }}>
          {missions.length} mission(s)
        </Text>
      </View>

      {missions.length === 0 ? (
        <View
          style={{
            backgroundColor: '#FFF',
            padding: 30,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#F0E4DD',
          }}
        >
          <FileText size={24} color={colors.orange} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.brown, marginTop: 8 }}>
            Aucune prestation terminée
          </Text>
          <Text style={{ fontSize: 12, color: '#888', marginTop: 4, textAlign: 'center' }}>
            Les prestations achevées pour cet établissement apparaîtront ici.
          </Text>
        </View>
      ) : (
        missions.map(m => (
          <Pressable
            key={m.id}
            onPress={() => openDetail(m)}
            style={{
              backgroundColor: '#FFF',
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: '#F0E4DD',
              gap: 8,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.brown }}>
                {m.prestation_nom || m.titre || `Mission #${m.id}`}
              </Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.orange }}>
                {m.total_ttc || m.tarif_total || '0'} €
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: '#777' }}>
                {m.date_debut || 'Date inconnue'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Eye size={14} color={colors.orangeDark} />
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.orangeDark }}>
                  Voir détails
                </Text>
              </View>
            </View>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}
