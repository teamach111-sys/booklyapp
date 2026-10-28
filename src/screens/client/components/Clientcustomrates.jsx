/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Client Portal : Clientcustomrates
 * **Associated Route/Context**: `/client (Tab/Modal: Clientcustomrates)`  
 * **Total Discovered Backend Calls**: 3
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Clientcustomrates.jsx:33`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Clientcustomrates.jsx#L33) | User Action Handler (`ClientCustomRates`) | `ClientCustomRates` | `GET` | `/sites/${siteId}/rates` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Clientcustomrates.jsx:62`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Clientcustomrates.jsx#L62) | Form Submit / Create Button (`saveEdit`) | `saveEdit` | `PUT` | `/sites/${siteId}/rates/${code}` | `{ taux_horaire: semaine` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Clientcustomrates.jsx:80`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/components/Clientcustomrates.jsx#L80) | User Action Handler (`resetToGlobal`) | `resetToGlobal` | `DELETE` | `/sites/${siteId}/rates/${code}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * 
 * =====================================================================
 */

import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Check, Edit2, RotateCcw, Tag, X } from 'lucide-react-native';
import { useClientTheme } from '../theme/ClientThemeContext';
import { useClientSites } from '../state/SitesContext';
import clientService from '../../../api/clientService';

export default function Clientcustomrates({ siteId: propSiteId, siteName: propSiteName }) {
  const { colors } = useClientTheme();
  const { activeSite } = useClientSites();

  const siteId = propSiteId || activeSite?.id;
  const siteName = propSiteName || activeSite?.name || 'Site actif';

  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCode, setEditingCode] = useState(null);
  const [editSemaine, setEditSemaine] = useState('');
  const [editWeekend, setEditWeekend] = useState('');
  const [saving, setSaving] = useState(false);

  const loadRates = useCallback(async () => {
    if (!siteId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await clientService.getSiteRates(siteId);
      setRates(Array.isArray(data) ? data : []);
    } catch {
      setRates([]);
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    loadRates();
  }, [loadRates]);

  const startEdit = r => {
    setEditingCode(r.code);
    setEditSemaine(String(r.taux_effectif ?? ''));
    setEditWeekend(String(r.taux_effectif_weekend ?? r.taux_effectif ?? ''));
  };

  const cancelEdit = () => {
    setEditingCode(null);
    setEditSemaine('');
    setEditWeekend('');
  };

  const handleSave = async code => {
    const sem = parseFloat(String(editSemaine).replace(',', '.'));
    const wkd = parseFloat(String(editWeekend).replace(',', '.'));

    if (isNaN(sem) || sem < 0 || isNaN(wkd) || wkd < 0) {
      Alert.alert('Erreur', 'Veuillez saisir des montants valides.');
      return;
    }

    setSaving(true);
    try {
      await clientService.updateSiteRate(siteId, code, sem);
      cancelEdit();
      await loadRates();
      Alert.alert('Succès', 'Tarif personnalisé mis à jour.');
    } catch (err) {
      Alert.alert('Erreur', err?.message || 'Impossible de mettre à jour le tarif.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async code => {
    Alert.alert(
      'Réinitialiser le tarif',
      'Revenir au tarif global pour cette qualification ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Rétablir',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);
            try {
              await clientService.resetSiteRate(siteId, code);
              await loadRates();
              Alert.alert('Succès', 'Tarif global rétabli.');
            } catch (err) {
              Alert.alert('Erreur', err?.message || 'Impossible de réinitialiser le tarif.');
            } finally {
              setSaving(false);
            }
          },
        },
      ],
    );
  };

  if (!siteId) {
    return (
      <View style={{ padding: 40, alignItems: 'center' }}>
        <Text style={{ color: '#888', fontSize: 14 }}>
          Sélectionnez un site pour afficher et gérer ses tarifs.
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

  const customCount = rates.filter(r => r.is_custom).length;

  return (
    <View style={{ gap: 12 }}>
      {/* Header bar */}
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Tag size={18} color={colors.orangeDark} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.brown }}>
            Tarifs — {siteName}
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: colors.orangeDark, fontWeight: '600' }}>
          {customCount} sur-mesure
        </Text>
      </View>

      {/* Rates list */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
        {rates.map(r => {
          const isEditing = editingCode === r.code;
          return (
            <View
              key={r.code}
              style={{
                backgroundColor: r.is_custom ? '#FDF8F5' : '#FFF',
                padding: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: r.is_custom ? colors.orange : '#F0E4DD',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.brown }}>
                    {r.name || r.code}
                  </Text>
                  {r.is_custom ? (
                    <Text
                      style={{
                        fontSize: 11,
                        color: colors.orangeDark,
                        fontWeight: '600',
                        marginTop: 2,
                      }}
                    >
                      Tarif personnalisé
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                      Tarif catalogue
                    </Text>
                  )}
                </View>

                {!isEditing ? (
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <Pressable
                      onPress={() => startEdit(r)}
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        backgroundColor: '#F5EDE8',
                      }}
                    >
                      <Edit2 size={16} color={colors.orangeDark} />
                    </Pressable>
                    {r.is_custom ? (
                      <Pressable
                        onPress={() => handleReset(r.code)}
                        style={{
                          padding: 8,
                          borderRadius: 8,
                          backgroundColor: '#FFF0ED',
                        }}
                      >
                        <RotateCcw size={16} color="#D32F2F" />
                      </Pressable>
                    ) : null}
                  </View>
                ) : null}
              </View>

              {isEditing ? (
                <View style={{ marginTop: 12, gap: 10 }}>
                  <View>
                    <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                      Taux semaine (€/h)
                    </Text>
                    <TextInput
                      keyboardType="decimal-pad"
                      value={editSemaine}
                      onChangeText={setEditSemaine}
                      style={{
                        backgroundColor: '#FFF',
                        borderRadius: 8,
                        borderWidth: 1.5,
                        borderColor: colors.orange,
                        padding: 8,
                        fontSize: 14,
                        color: '#333',
                      }}
                    />
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                      Taux week-end (€/h)
                    </Text>
                    <TextInput
                      keyboardType="decimal-pad"
                      value={editWeekend}
                      onChangeText={setEditWeekend}
                      style={{
                        backgroundColor: '#FFF',
                        borderRadius: 8,
                        borderWidth: 1.5,
                        borderColor: colors.orange,
                        padding: 8,
                        fontSize: 14,
                        color: '#333',
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                    <Pressable
                      onPress={cancelEdit}
                      style={{
                        flex: 1,
                        padding: 10,
                        borderRadius: 8,
                        backgroundColor: '#F5EDE8',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontWeight: '600', color: '#666' }}>Annuler</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleSave(r.code)}
                      disabled={saving}
                      style={{
                        flex: 1.5,
                        padding: 10,
                        borderRadius: 8,
                        backgroundColor: colors.orange,
                        alignItems: 'center',
                      }}
                    >
                      {saving ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Text style={{ fontWeight: '700', color: '#FFF' }}>Enregistrer</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 16,
                    marginTop: 10,
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: '#F5EDE8',
                  }}
                >
                  <Text style={{ fontSize: 13, color: '#444' }}>
                    Semaine :{' '}
                    <Text style={{ fontWeight: '700', color: colors.brown }}>
                      {r.taux_effectif} €/h
                    </Text>
                  </Text>
                  <Text style={{ fontSize: 13, color: '#444' }}>
                    Week-end :{' '}
                    <Text style={{ fontWeight: '700', color: colors.brown }}>
                      {r.taux_effectif_weekend ?? r.taux_effectif} €/h
                    </Text>
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
