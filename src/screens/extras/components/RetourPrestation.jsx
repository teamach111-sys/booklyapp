/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Extras Portal : RetourPrestation
 * **Associated Route/Context**: `/extras (Tab/Modal: RetourPrestation)`  
 * **Total Discovered Backend Calls**: 5
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: |
 * | [`RetourPrestation.jsx:57`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/RetourPrestation.jsx#L57) | User Action Handler (`RetourPrestation`) | `RetourPrestation` | `GET` | `/missions/${missionId}/retour` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`RetourPrestation.jsx:75`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/RetourPrestation.jsx#L75) | Form Submit / Create Button (`saveField`) | `saveField` | `PUT` | `/missions/${missionId}/retour` | `patch` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`RetourPrestation.jsx:121`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/RetourPrestation.jsx#L121) | File Upload / Change Event (`handleFileSelect`) | `handleFileSelect` | `POST` | `/missions/${missionId}/retour/photos` | `formData` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`RetourPrestation.jsx:142`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/RetourPrestation.jsx#L142) | Delete / Cancel Button (`removePhoto`) | `removePhoto` | `DELETE` | `/missions/${missionId}/retour/photos/${photoId}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`RetourPrestation.jsx:162`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/RetourPrestation.jsx#L162) | User Action Handler (`handleSend`) | `handleSend` | `POST` | `/missions/${missionId}/retour/send` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * 
 * =====================================================================
 */

import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';
import {
  ArrowLeft,
  Camera,
  Check,
  Send,
  Star,
  Trash2,
} from 'lucide-react-native';
import { colors } from '../../../styles';
import clientService from '../../../api/clientService';

export default function RetourPrestation({ missionId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [mission, setMission] = useState(null);
  const [retour, setRetour] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);

  const isSent = retour?.statut === 'envoye';

  const loadRetour = useCallback(async () => {
    if (!missionId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await clientService.getMissionRetour(missionId);
      setMission(data?.mission || null);
      setRetour(data?.retour || null);
      setPhotos(Array.isArray(data?.photos) ? data.photos : []);
      if (data?.retour?.satisfaction_note) {
        setRating(data.retour.satisfaction_note);
      }
      if (data?.retour?.commentaire) {
        setComment(data.retour.commentaire);
      }
    } catch (err) {
      Alert.alert('Erreur', err?.message || 'Impossible de charger le retour.');
    } finally {
      setLoading(false);
    }
  }, [missionId]);

  useEffect(() => {
    loadRetour();
  }, [loadRetour]);

  const saveField = async patch => {
    if (isSent) return;
    setRetour(prev => ({ ...prev, ...patch }));
    try {
      await clientService.saveMissionRetour(missionId, patch);
    } catch {
      // Non-blocking
    }
  };

  const handlePickPhoto = async () => {
    if (isSent || uploading) return;
    try {
      const [file] = await pick({ type: [types.images] });
      if (!file) return;

      setUploading(true);
      const formData = new FormData();
      formData.append('photos[]', {
        uri: file.uri,
        name: file.name || 'retour_photo.jpg',
        type: file.type || 'image/jpeg',
      });
      formData.append('categorie', 'general');

      const res = await clientService.uploadRetourPhotos(missionId, formData);
      setPhotos(prev => [...prev, ...(res?.photos || [])]);
      Alert.alert('Succès', 'Photo ajoutée au retour.');
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      Alert.alert('Erreur', err?.message || "Erreur lors de l'envoi de la photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async photoId => {
    try {
      await clientService.removeRetourPhoto(missionId, photoId);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (err) {
      Alert.alert('Erreur', err?.message || 'Impossible de supprimer la photo.');
    }
  };

  const handleSend = async () => {
    if (!rating) {
      Alert.alert('Note requise', 'Veuillez attribuer une note de satisfaction (1 à 5 étoiles).');
      return;
    }
    setSending(true);
    try {
      await saveField({ satisfaction_note: rating, commentaire: comment });
      await clientService.sendMissionRetour(missionId);
      Alert.alert('Succès', 'Retour de prestation validé et envoyé !', [
        { text: 'OK', onPress: () => (onBack ? onBack() : loadRetour()) },
      ]);
    } catch (err) {
      Alert.alert('Erreur', err?.message || "Erreur lors de l'envoi du retour.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={{ padding: 40, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={colors.orange} />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft size={18} color={colors.brown} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.brown }}>
            Retour
          </Text>
        </Pressable>
      ) : null}

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
          Retour de prestation — {mission?.prestation_nom || `Mission #${missionId}`}
        </Text>
        <Text style={{ fontSize: 13, color: '#666' }}>
          Date : {mission?.date_debut || '—'}
        </Text>

        {isSent ? (
          <View
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: '#EAF5EA',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Check size={16} color="#2E7D32" />
            <Text style={{ color: '#2E7D32', fontSize: 13, fontWeight: '600' }}>
              Ce retour a été envoyé et clôturé.
            </Text>
          </View>
        ) : null}

        {/* Rating */}
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.brown, marginBottom: 8 }}>
            Note de satisfaction *
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <Pressable
                key={star}
                disabled={isSent}
                onPress={() => {
                  setRating(star);
                  saveField({ satisfaction_note: star });
                }}
              >
                <Star
                  size={28}
                  color={star <= rating ? '#F59E0B' : '#DDD'}
                  fill={star <= rating ? '#F59E0B' : 'transparent'}
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Comment */}
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.brown, marginBottom: 6 }}>
            Commentaire / Remarques
          </Text>
          <TextInput
            editable={!isSent}
            multiline
            numberOfLines={4}
            placeholder="Détaillez le déroulement de la mission..."
            placeholderTextColor="#AAA"
            value={comment}
            onChangeText={setComment}
            onBlur={() => saveField({ commentaire: comment })}
            style={{
              backgroundColor: '#FAF6F4',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#F0E4DD',
              padding: 12,
              fontSize: 13,
              minHeight: 80,
              textAlignVertical: 'top',
              color: '#333',
            }}
          />
        </View>

        {/* Photos list */}
        <View style={{ marginTop: 8 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.brown }}>
              Photos ({photos.length})
            </Text>
            {!isSent ? (
              <Pressable
                disabled={uploading}
                onPress={handlePickPhoto}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                  backgroundColor: '#F5EDE8',
                }}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color={colors.orange} />
                ) : (
                  <>
                    <Camera size={15} color={colors.orangeDark} />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.orangeDark }}>
                      Ajouter une photo
                    </Text>
                  </>
                )}
              </Pressable>
            ) : null}
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {photos.map(p => (
              <View
                key={p.id}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  overflow: 'hidden',
                  backgroundColor: '#F5F5F5',
                  position: 'relative',
                }}
              >
                {p.url ? (
                  <Image
                    source={{ uri: p.url }}
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Camera size={24} color="#BBB" />
                  </View>
                )}
                {!isSent ? (
                  <Pressable
                    onPress={() => handleRemovePhoto(p.id)}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      borderRadius: 10,
                      padding: 4,
                    }}
                  >
                    <Trash2 size={12} color="#FFF" />
                  </Pressable>
                ) : null}
              </View>
            ))}
          </View>
        </View>

        {/* Send button */}
        {!isSent ? (
          <Pressable
            disabled={sending}
            onPress={handleSend}
            style={{
              marginTop: 14,
              backgroundColor: colors.orange,
              borderRadius: 10,
              paddingVertical: 12,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Send size={16} color="#FFF" />
                <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '700' }}>
                  Envoyer le retour
                </Text>
              </>
            )}
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}
