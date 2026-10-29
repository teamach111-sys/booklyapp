/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Extras Portal : RetourPrestation
 * **Associated Route/Context**: `/extras (Tab/Modal: RetourPrestation)`
 * **Total Discovered Backend Calls**: 5
 *
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`RetourPrestation.jsx:57`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/RetourPrestation.jsx#L57) | Initial Page / Component Mount Lifecycle (`useEffect`) | `load` | `GET` | `/missions/${missionId}/retour` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`RetourPrestation.jsx:75`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/RetourPrestation.jsx#L75) | Form Submit / Create Button (`saveField`) | `saveField` | `PUT` | `/missions/${missionId}/retour` | `patch` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`RetourPrestation.jsx:121`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/RetourPrestation.jsx#L121) | File Upload / Change Event (`handleFileSelect`) | `openFilePicker` | `POST` | `/missions/${missionId}/retour/photos` | `formData` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`RetourPrestation.jsx:142`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/RetourPrestation.jsx#L142) | Delete / Cancel Button (`removePhoto`) | `handleRemovePhoto` | `DELETE` | `/missions/${missionId}/retour/photos/${photoId}` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`RetourPrestation.jsx:162`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/components/RetourPrestation.jsx#L162) | User Action Handler (`handleSend`) | `handleSend` | `POST` | `/missions/${missionId}/retour/send` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
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
  ClipboardList,
  MessageSquare,
  Plus,
  Send,
  Smile,
  Star,
  Trash2,
  UtensilsCrossed,
  Wine,
  X,
} from 'lucide-react-native';
import { colors } from '../../../styles';
import { getToken } from '../../../utils/Authstorage';
import { toPhotoSrc } from '../../../utils/toPhotoSrc';
import clientService from '../../../api/clientService';
import { retourPrestation as styles } from './styles';
import {
  CHECKLISTS_BY_ROLE,
  DRINK_CHECKBOXES,
  PHOTO_CATEGORIES,
  ROLE_ALIASES,
} from '../../../utils/retourChecklists';

function Card({ children, accent = false }) {
  return (
    <View style={[styles.card, accent && styles.cardAccent]}>{children}</View>
  );
}

function Sec({ icon, title, badge }) {
  return (
    <View style={styles.cardTitle}>
      {icon}
      <Text style={styles.cardTitleText}>{title}</Text>
      {badge != null ? (
        <Text style={styles.badgeRequired}>{badge}</Text>
      ) : null}
    </View>
  );
}

function CheckBox({ checked, onPress }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      hitSlop={6}
      style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}
    >
      {checked ? <Check size={12} color={colors.white} strokeWidth={3} /> : null}
    </Pressable>
  );
}

// Le backend stocke { [key]: { checked: true, qty: 3 } } (ancien format:
// `true`). On garde la quantité en chaîne pendant la saisie pour que la
// validation voie immédiatement ce que l'utilisateur tape, sans attendre le
// blur du champ.
function normalizeBoissons(raw) {
  const out = {};
  Object.entries(raw || {}).forEach(([key, value]) => {
    if (value === true) {
      out[key] = { checked: true, qty: '' };
      return;
    }
    out[key] = {
      checked: !!value?.checked,
      qty: value?.qty != null ? String(value.qty) : '',
    };
  });
  return out;
}

const EMPTY_DRAFTS = {
  commentaire_softs: '',
  restes_alimentaires: '',
  satisfaction_commentaire: '',
  retours_globaux: '',
  checklist_commentaire: '',
};

function draftsFromRetour(retour) {
  const out = { ...EMPTY_DRAFTS };
  Object.keys(out).forEach(key => {
    out[key] = retour?.[key] || '';
  });
  return out;
}

export default function RetourPrestation({ missionId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mission, setMission] = useState(null);
  const [roleLabel, setRoleLabel] = useState(null);
  const [roleCode, setRoleCode] = useState(null);
  const [canEditBoissons, setCanEditBoissons] = useState(false);
  const [canEditPhotos, setCanEditPhotos] = useState(false);
  const [retour, setRetour] = useState(null);
  const [boissons, setBoissons] = useState({});
  const [drafts, setDrafts] = useState({ ...EMPTY_DRAFTS });
  const [photos, setPhotos] = useState([]);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCat, setShowCustomCat] = useState(false);

  const isSent = retour?.statut === 'envoye';
  const roleKey = ROLE_ALIASES[roleCode] || roleCode;
  const roleChecklist = CHECKLISTS_BY_ROLE[roleKey] || null;
  const checklistAnswers = (retour?.checklist_role_answers || {})[roleKey] || {};
  const checklistTotal = roleChecklist
    ? roleChecklist.sections.reduce((n, section) => n + section.items.length, 0)
    : 0;
  const checklistDone = roleChecklist
    ? roleChecklist.sections.reduce(
        (n, section, si) =>
          n +
          section.items.filter((_, ii) => checklistAnswers[`s${si}_i${ii}`])
            .length,
        0,
      )
    : 0;

  const loadRetour = useCallback(async () => {
    if (!missionId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await clientService.getMissionRetour(missionId);
      const loadedRetour = data?.retour || null;
      setMission(data?.mission || null);
      setRoleLabel(data?.my_role_label || null);
      setRoleCode(data?.my_qualification_code || null);
      setCanEditBoissons(!!data?.can_edit_boissons);
      setCanEditPhotos(!!data?.can_edit_photos);
      setRetour(loadedRetour);
      setBoissons(normalizeBoissons(loadedRetour?.boissons_cochees));
      setDrafts(draftsFromRetour(loadedRetour));
      setPhotos(Array.isArray(data?.photos) ? data.photos : []);
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
    setRetour(prev => ({ ...prev, ...patch }));
    try {
      await clientService.saveMissionRetour(missionId, patch);
    } catch (err) {
      Alert.alert(
        'Erreur',
        err?.message || "Erreur lors de l'enregistrement du retour.",
      );
    }
  };

  // Les réponses de la check-list sont rangées par poste (roleKey) ; la fusion
  // est faite côté serveur, chaque extra ne réécrit que sa propre entrée.
  const setChecklist = (itemKey, checked) => {
    if (!roleKey) return;
    const mine = { ...checklistAnswers, [itemKey]: checked };
    saveField({ checklist_role_answers: { [roleKey]: mine } });
  };

  // Boisson à cocher : { checked, qty }. Ancien format `true` toujours lisible.
  const boissonEntry = key => boissons[key] || { checked: false, qty: '' };

  const boissonPayloadEntry = (key, entry) => {
    const qty = entry.qty === '' ? null : parseInt(String(entry.qty), 10) || null;
    return {
      checked: !!entry.checked,
      qty: entry.checked ? qty : null,
    };
  };

  const setBoisson = (key, patch) => {
    const current = boissonEntry(key);
    const next = { ...current, ...patch };
    if (!next.checked) next.qty = '';
    setBoissons(prev => ({ ...prev, [key]: next }));
    saveField({
      boissons_cochees: {
        ...(retour?.boissons_cochees || {}),
        [key]: boissonPayloadEntry(key, next),
      },
    });
  };

  // La quantité est contrôlée localement : la saisie est donc prise en compte
  // immédiatement par la validation, même si le champ n'a pas encore perdu le
  // focus au moment où l'on appuie sur « Envoyer ».
  const setBoissonQty = (key, text) => {
    setBoissons(prev => ({
      ...prev,
      [key]: { ...(prev[key] || { checked: false, qty: '' }), qty: text },
    }));
  };

  const commitBoissonQty = (key, text) => {
    const current = boissonEntry(key);
    const next = { ...current, qty: text };
    setBoissons(prev => ({
      ...prev,
      [key]: { ...next, qty: text === '' ? '' : String(parseInt(text, 10) || '') },
    }));
    saveField({
      boissons_cochees: {
        ...(retour?.boissons_cochees || {}),
        [key]: boissonPayloadEntry(key, next),
      },
    });
  };

  const updateDraft = (field, value) => {
    setDrafts(prev => ({ ...prev, [field]: value }));
  };

  const commitDraft = field => {
    saveField({ [field]: drafts[field] });
  };

  const openFilePicker = async category => {
    if (uploading) return;
    setPendingCategory(category);
    setUploading(true);
    let selected = [];
    try {
      const res = await pick({ type: [types.images], allowMultiSelection: true });
      selected = (Array.isArray(res) ? res : [res]).filter(Boolean);
    } catch (err) {
      setUploading(false);
      setPendingCategory(null);
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      Alert.alert('Erreur', err?.message || 'Impossible de sélectionner les photos.');
      return;
    }

    if (!selected.length) {
      setUploading(false);
      setPendingCategory(null);
      return;
    }

    const oversized = selected.filter(f => f.size && f.size > 10 * 1024 * 1024);
    if (oversized.length) {
      Alert.alert(
        'Photos ignorées',
        `${oversized.length} photo(s) dépassent la limite de 10 Mo.`,
      );
    }
    const valid = selected.filter(f => !f.size || f.size <= 10 * 1024 * 1024);
    if (!valid.length) {
      setUploading(false);
      setPendingCategory(null);
      return;
    }

    try {
      const formData = new FormData();
      valid.forEach(f => {
        formData.append('photos[]', {
          uri: f.uri,
          name: f.name || 'retour_photo.jpg',
          type: f.type || 'image/jpeg',
        });
      });
      formData.append('categorie', category);

      const data = await clientService.uploadRetourPhotos(missionId, formData);
      const added = Array.isArray(data?.photos) ? data.photos : [];
      setPhotos(prev => [...prev, ...added]);
      Alert.alert('Succès', `${added.length} photo(s) ajoutée(s).`);
    } catch (err) {
      Alert.alert('Erreur', err?.message || "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
      setPendingCategory(null);
    }
  };

  const handleAddCustomCategory = () => {
    const name = customCategory.trim();
    if (!name) return;
    setShowCustomCat(false);
    setCustomCategory('');
    openFilePicker(name);
  };

  const handleRemovePhoto = async photoId => {
    try {
      await clientService.removeRetourPhoto(missionId, photoId);
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    } catch (err) {
      Alert.alert(
        'Erreur',
        err?.message || 'Impossible de supprimer la photo.',
      );
    }
  };

  const photosByCategory = photos.reduce((acc, photo) => {
    const cat = photo.categorie || 'Autre';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(photo);
    return acc;
  }, {});

  // Obligatoire : check-list complète (ou motif des étapes non réalisées) et,
  // pour les postes concernés, consommation de boissons (ou commentaire).
  const missing = [];
  if (
    roleChecklist &&
    checklistDone < checklistTotal &&
    !(retour?.checklist_commentaire || '').trim()
  ) {
    missing.push(
      "Check-list de fermeture : cochez toutes les étapes ou précisez celles qui n'ont pas pu être réalisées.",
    );
  }
  if (canEditBoissons) {
    const checked = DRINK_CHECKBOXES.filter(
      drink => boissonEntry(drink.key).checked,
    );
    const noQty = checked.filter(
      drink => !(Number(boissonEntry(drink.key).qty) > 0),
    );
    if (noQty.length) {
      missing.push(
        `Consommation de boissons : indiquez la quantité pour ${noQty
          .map(drink => drink.label)
          .join(', ')}.`,
      );
    } else if (
      !checked.length &&
      !(retour?.commentaire_softs || '').trim()
    ) {
      missing.push(
        'Consommation de boissons : cochez les boissons consommées ou précisez « aucune consommation ».',
      );
    }
  }
  const ready = missing.length === 0;

  const handleSend = async () => {
    if (missing.length) {
      Alert.alert('Retour incomplet', missing[0]);
      return;
    }
    setSending(true);
    try {
      await clientService.sendMissionRetour(missionId);
      Alert.alert(
        'Succès',
        isSent
          ? 'Retour de prestation mis à jour.'
          : 'Retour de prestation envoyé.',
      );
      await loadRetour();
    } catch (err) {
      Alert.alert(
        'Erreur',
        err?.message || "Erreur lors de l'envoi du retour.",
      );
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={[styles.backButton, { marginBottom: 20 }]}
          >
            <ArrowLeft size={13} color="#888" />
            <Text style={styles.backButtonText}>Retour</Text>
          </Pressable>
        ) : null}
        <View style={{ padding: 60, alignItems: 'center' }}>
          <ActivityIndicator size="small" color={colors.orange} />
        </View>
      </View>
    );
  }

  const authHeaders = getToken()
    ? { Authorization: `Bearer ${getToken()}` }
    : undefined;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 14, paddingBottom: 20 }}
    >
      {/* Header */}
      <View style={styles.header}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={styles.backButton}
          >
            <ArrowLeft size={13} color="#888" />
            <Text style={styles.backButtonText}>Retour</Text>
          </Pressable>
        ) : null}

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            Retour prestation —{' '}
            {mission?.prestation_nom || `Mission #${missionId}`}
          </Text>
          <Text style={styles.headerSubtitle}>
            {mission?.space_name || ''}
            {mission?.city ? ` · ${mission.city}` : ''}
            {roleLabel ? ` · vous êtes ${roleLabel}` : ''}
          </Text>
        </View>

        <Text style={isSent ? styles.badgeEnvoye : styles.badgeAttendu}>
          {isSent ? 'Envoyé' : 'Attendu'}
        </Text>
      </View>

      {isSent ? (
        <View style={styles.sentBanner}>
          <Check size={16} color="#15803d" />
          <Text style={styles.sentBannerText}>
            Ce retour a été envoyé
            {retour?.completed_at
              ? ` le ${new Date(retour.completed_at).toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}`
              : ''}
            . Vous pouvez encore le modifier : vos changements sont enregistrés
            automatiquement.
          </Text>
        </View>
      ) : null}

      {/* 6.1 Consommation de boissons — référent / responsable / plongeur uniquement */}
      {canEditBoissons ? (
        <Card>
          <Sec
            icon={<Wine size={14} color={colors.brown} />}
            title="Consommation de boissons"
            badge="Obligatoire"
          />
          <Text style={styles.sectionDescription}>
            Cochez chaque boisson consommée et indiquez la quantité. S'il n'y a
            eu aucune consommation, précisez-le dans « Boissons supplémentaires ».
          </Text>
          <View style={styles.drinkGrid}>
            {DRINK_CHECKBOXES.map(drink => {
              const entry = boissonEntry(drink.key);
              return (
                <View key={drink.key} style={styles.drinkItem}>
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: entry.checked }}
                    onPress={() =>
                      setBoisson(drink.key, { checked: !entry.checked })
                    }
                    style={styles.drinkLabelRow}
                  >
                    <CheckBox
                      checked={entry.checked}
                      onPress={() =>
                        setBoisson(drink.key, { checked: !entry.checked })
                      }
                    />
                    <Text style={styles.drinkLabel}>{drink.label}</Text>
                  </Pressable>
                  {entry.checked ? (
                    <TextInput
                      defaultValue={String(entry.qty ?? '')}
                      keyboardType="number-pad"
                      onBlur={event =>
                        setBoisson(drink.key, {
                          qty:
                            event.nativeEvent.text === ''
                              ? null
                              : parseInt(event.nativeEvent.text, 10) || null,
                        })
                      }
                      placeholder="Qté"
                      placeholderTextColor="#bbb"
                      style={[
                        styles.qtyInput,
                        !(Number(entry.qty) > 0) && styles.qtyInputMissing,
                      ]}
                    />
                  ) : null}
                </View>
              );
            })}
          </View>
          <View style={styles.boissonsComment}>
            <Text style={styles.inputLabel}>Boissons supplémentaires</Text>
            <TextInput
              defaultValue={retour?.commentaire_softs || ''}
              multiline
              onBlur={event =>
                saveField({ commentaire_softs: event.nativeEvent.text })
              }
              placeholder="S'il y a eu d'autres boissons non listées ci-dessus, indiquez-les avec les quantités."
              placeholderTextColor="#bbb"
              style={[styles.textArea, { minHeight: 60 }]}
            />
          </View>
        </Card>
      ) : null}

      {/* 6.2 Restes alimentaires */}
      <Card>
        <Sec
          icon={<UtensilsCrossed size={14} color={colors.brown} />}
          title="Restes alimentaires"
        />
        <Text style={styles.inputLabel}>Commentaire libre</Text>
        <TextInput
          defaultValue={retour?.restes_alimentaires || ''}
          multiline
          onBlur={event =>
            saveField({ restes_alimentaires: event.nativeEvent.text })
          }
          placeholder="Indiquer s'il y avait trop ou pas assez de nourriture, ce qu'il restait en fin de prestation, les quantités approximatives, les produits les plus consommés ainsi que toute information utile pour améliorer les prochaines prestations."
          placeholderTextColor="#bbb"
          style={styles.textArea}
        />
      </Card>

      {/* 6.3 Satisfaction du client */}
      <Card accent>
        <Sec
          icon={<Smile size={14} color={colors.brown} />}
          title="Satisfaction du client"
        />
        <View style={styles.satisfactionRow}>
          <View>
            <Text style={styles.inputLabel}>Note de 1 à 5 étoiles</Text>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <Pressable
                  key={star}
                  accessibilityRole="button"
                  accessibilityLabel={`${star} étoile${star > 1 ? 's' : ''}`}
                  onPress={() => saveField({ satisfaction_note: star })}
                  style={styles.starButton}
                >
                  <Star
                    size={22}
                    color={
                      star <= (retour?.satisfaction_note || 0)
                        ? '#f59e0b'
                        : '#d1d5db'
                    }
                    fill={
                      star <= (retour?.satisfaction_note || 0)
                        ? '#f59e0b'
                        : 'transparent'
                    }
                  />
                </Pressable>
              ))}
              {retour?.satisfaction_note ? (
                <Text style={styles.starValue}>
                  {retour.satisfaction_note}/5
                </Text>
              ) : null}
            </View>
          </View>
          <View style={styles.satisfactionComment}>
            <Text style={styles.inputLabel}>Commentaire complémentaire</Text>
            <TextInput
              defaultValue={retour?.satisfaction_commentaire || ''}
              multiline
              onBlur={event =>
                saveField({
                  satisfaction_commentaire: event.nativeEvent.text,
                })
              }
              placeholder="Précisions sur la satisfaction du client..."
              placeholderTextColor="#bbb"
              style={[styles.textArea, { minHeight: 60 }]}
            />
          </View>
        </View>
      </Card>

      {/* 6.4 Retour Global */}
      <Card>
        <Sec
          icon={<MessageSquare size={14} color={colors.brown} />}
          title="Retour Global"
        />
        <Text style={styles.inputLabel}>
          Compte rendu général de la prestation
        </Text>
        <TextInput
          defaultValue={retour?.retours_globaux || ''}
          multiline
          onBlur={event =>
            saveField({ retours_globaux: event.nativeEvent.text })
          }
          placeholder="Déroulé général, incidents éventuels, points d'amélioration, remarques sur l'équipe et l'organisation..."
          placeholderTextColor="#bbb"
          style={styles.textArea}
        />
      </Card>

      {/* 6.5 Check-list de fermeture — par poste */}
      <Card>
        <Sec
          icon={<ClipboardList size={14} color={colors.brown} />}
          title={`Check-list de fermeture${
            roleChecklist ? ` — ${roleChecklist.label}` : ''
          }`}
          badge={
            roleChecklist
              ? `Obligatoire · ${checklistDone}/${checklistTotal}`
              : undefined
          }
        />
        {!roleChecklist ? (
          <Text style={styles.emptyText}>
            Aucune check-list définie pour ce poste.
          </Text>
        ) : (
          roleChecklist.sections.map((section, si) => (
            <View
              key={si}
              style={[
                styles.checklistSection,
                si === roleChecklist.sections.length - 1 &&
                  styles.checklistSectionLast,
              ]}
            >
              <Text style={styles.subsectionTitle}>{section.title}</Text>
              {section.items.map((label, ii) => {
                const itemKey = `s${si}_i${ii}`;
                const checked = !!checklistAnswers[itemKey];
                return (
                  <Pressable
                    key={itemKey}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked }}
                    onPress={() => setChecklist(itemKey, !checked)}
                    style={[
                      styles.checklistItem,
                      ii === section.items.length - 1 &&
                        styles.checklistItemLast,
                    ]}
                  >
                    <CheckBox
                      checked={checked}
                      onPress={() => setChecklist(itemKey, !checked)}
                    />
                    <Text style={styles.checklistItemText}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))
        )}
        <View style={styles.checklistComment}>
          <Text style={styles.inputLabel}>
            Commentaire si une étape n'a pas pu être réalisée
          </Text>
          <TextInput
            defaultValue={retour?.checklist_commentaire || ''}
            multiline
            onBlur={event =>
              saveField({ checklist_commentaire: event.nativeEvent.text })
            }
            placeholder="Ex. : réapprovisionnement micro-kitchens impossible, stock non livré."
            placeholderTextColor="#bbb"
            style={[styles.textArea, { minHeight: 60 }]}
          />
        </View>
      </Card>

      {/* 6.6 Photos des espaces */}
      {canEditPhotos ? (
        <Card>
          <Sec
            icon={<Camera size={14} color={colors.brown} />}
            title="Photos des espaces utilisés"
            badge={photos.length || undefined}
          />
          <Text style={styles.sectionDescription}>
            Upload multiple. Photos prises après rangement et nettoyage.
          </Text>

          <View style={styles.photoCategoriesRow}>
            {PHOTO_CATEGORIES.map(category => (
              <Pressable
                key={category}
                accessibilityRole="button"
                disabled={uploading}
                onPress={() => openFilePicker(category)}
                style={[
                  styles.photoCategoryBtn,
                  uploading && { opacity: 0.6 },
                ]}
              >
                {uploading && pendingCategory === category ? (
                  <ActivityIndicator size="small" color={colors.brown} />
                ) : (
                  <Camera size={12} color={colors.brown} />
                )}
                <Text style={styles.photoCategoryText}>{category}</Text>
              </Pressable>
            ))}

            {!showCustomCat ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => setShowCustomCat(true)}
                style={[styles.photoCategoryBtn, styles.photoCategoryBtnAdd]}
              >
                <Plus size={12} color="#888" />
                <Text
                  style={[
                    styles.photoCategoryText,
                    styles.photoCategoryTextAdd,
                  ]}
                >
                  Ajouter
                </Text>
              </Pressable>
            ) : (
              <View style={styles.customCategoryRow}>
                <TextInput
                  value={customCategory}
                  onChangeText={setCustomCategory}
                  placeholder="Nom de la zone"
                  placeholderTextColor="#bbb"
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleAddCustomCategory}
                  style={styles.customCategoryInput}
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={handleAddCustomCategory}
                  style={styles.customCategoryConfirm}
                >
                  <Check size={13} color={colors.white} />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setShowCustomCat(false);
                    setCustomCategory('');
                  }}
                  style={styles.customCategoryCancel}
                >
                  <X size={13} color="#888" />
                </Pressable>
              </View>
            )}
          </View>

          {photos.length === 0 ? (
            <Text style={styles.emptyText}>Aucune photo ajoutée.</Text>
          ) : (
            Object.entries(photosByCategory).map(([category, pics]) => (
              <View key={category} style={styles.photoCategoryBlock}>
                <Text style={styles.photoCategoryTitle}>
                  {category} ({pics.length})
                </Text>
                <View style={styles.photoGrid}>
                  {pics.map(photo => {
                    const uri = toPhotoSrc(photo.file_url || photo.url);
                    return (
                      <View key={photo.id} style={styles.photoThumb}>
                        {uri ? (
                          <Image
                            source={{ uri, headers: authHeaders }}
                            style={styles.photoImage}
                          />
                        ) : (
                          <View style={styles.photoPlaceholder}>
                            <Camera size={24} color="#bbb" />
                          </View>
                        )}
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Supprimer la photo"
                          onPress={() => handleRemovePhoto(photo.id)}
                          style={styles.photoRemove}
                        >
                          <Trash2 size={11} color={colors.white} />
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))
          )}
        </Card>
      ) : null}

      {/* Envoi */}
      <View style={styles.footer}>
        <View style={styles.footerSummary}>
          <Text style={styles.footerSummary}>
            Satisfaction client :{' '}
            <Text style={styles.footerStrong}>
              {retour?.satisfaction_note
                ? `${retour.satisfaction_note}/5`
                : '—'}
            </Text>
            {' · '}Check-list :{' '}
            <Text style={styles.footerStrong}>
              {checklistDone}/{checklistTotal} étapes
            </Text>
            {canEditPhotos ? (
              <>
                {' · '}
                <Text style={styles.footerStrong}>{photos.length}</Text> photo
                {photos.length > 1 ? 's' : ''} jointe
                {photos.length > 1 ? 's' : ''}
              </>
            ) : null}
          </Text>
          {!ready ? (
            <Text style={styles.footerMissing}>{missing[0]}</Text>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={sending || !ready}
          onPress={handleSend}
          style={[
            styles.btnSend,
            (sending || !ready) && styles.btnSendDisabled,
          ]}
        >
          {sending ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Send size={14} color={colors.white} />
          )}
          <Text style={styles.btnSendText}>
            {sending
              ? 'Envoi...'
              : isSent
              ? 'Mettre à jour le retour'
              : 'Envoyer le retour'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
