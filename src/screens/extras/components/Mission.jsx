import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ArrowLeft,
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Globe,
  MapPin,
  MessageSquare,
  Paperclip,
  Search,
  Tag,
  Timer,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react-native';
import { colors } from '../../../styles';
import { extras } from '../styles';
import { mission as styles } from './styles';
import RetourPrestation from './RetourPrestation';

const TABS = [
  { key: 'proposees', label: 'Prestations proposées' },
  { key: 'a_venir', label: 'À venir' },
  { key: 'en_cours', label: 'En cours' },
  { key: 'terminees', label: 'Terminées' },
  { key: 'toutes', label: 'Toutes' },
];

const INITIAL_MISSIONS = [
  {
    id: 1,
    prestation_nom: 'azezaeazezae',
    title: 'azezaeazezae',
    statut: 'en_cours',
    statut_reponse: null, // null / 'disponible' -> displayed in 'proposees'
    type_id: 'DTD',
    prestation_type_detail: 'EVENT',
    date_debut: '2026-10-26T11:15:00',
    date_fin: '2026-10-26T15:00:00',
    date: '2026-10-26',
    total_hours: 3.8,
    adresse_exacte: '1 Rue du Test 02, Paris',
    space_name: 'Dashboard Client 02',
    city: 'Dashboard Client 02',
    client_name: 'Client 02',
    tenue_exigee: 'Chemise blanche | zaezae',
    commentaires: 'zaeae',
    languages: ['FR', 'AR', 'DE', 'EN', 'ES', 'IT', 'PT', 'ZH'],
    available_slots: [
      {
        qualification_code: 'barista',
        libelle: 'Barista',
        heure_debut: '11:15',
        heure_fin: '14:45',
        coupure_debut: '11:15',
        coupure_fin: '11:45',
        quantity: 1,
        taken: 0,
      },
    ],
    my_slots: [],
    attachments: [],
    timeLeftSeconds: 3 * 3600 + 2 * 60 + 21, // 03:02:21
    progressPercent: 18.9,
  },
];

function fmtDateFr(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return String(d);
  const days = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
  const months = [
    'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
    'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
  ];
  return `${days[dt.getDay()]} ${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
}

function fmtTime(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return String(d);
  return `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
}

function fmtTimer(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Mission() {
  const [activeTab, setActiveTab] = useState('proposees');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilterStart, setDateFilterStart] = useState('');
  const [dateFilterEnd, setDateFilterEnd] = useState('');
  const [missions, setMissions] = useState(INITIAL_MISSIONS);
  const [view, setView] = useState('list'); // 'list' | 'detail' | 'retour'
  const [selectedMission, setSelectedMission] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(3 * 3600 + 2 * 60 + 21);

  // Timer countdown for active mission
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const proposedCount = useMemo(() => {
    return missions.filter(m => !m.statut_reponse || m.statut_reponse === 'disponible').length;
  }, [missions]);

  const filteredMissions = useMemo(() => {
    return missions.filter(m => {
      const isProposed = !m.statut_reponse || m.statut_reponse === 'disponible';
      const isAccepted = m.statut_reponse === 'acceptee';
      const isDeclined = m.statut_reponse === 'refusee';

      // Tab filtering
      if (activeTab === 'proposees' && !isProposed) return false;
      if (activeTab === 'a_venir' && (!isAccepted || m.statut === 'terminee')) return false;
      if (activeTab === 'en_cours' && m.statut !== 'en_cours') return false;
      if (activeTab === 'terminees' && m.statut !== 'terminee') return false;

      // Search filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nom = (m.prestation_nom || '').toLowerCase();
        const client = (m.client_name || '').toLowerCase();
        const adresse = (m.adresse_exacte || '').toLowerCase();
        const space = (m.space_name || '').toLowerCase();
        if (!nom.includes(q) && !client.includes(q) && !adresse.includes(q) && !space.includes(q)) {
          return false;
        }
      }

      // Date filtering
      if (dateFilterStart && m.date < dateFilterStart) return false;
      if (dateFilterEnd && m.date > dateFilterEnd) return false;

      return true;
    });
  }, [missions, activeTab, searchQuery, dateFilterStart, dateFilterEnd]);

  function handleAcceptSlot(missionId, slot) {
    Alert.alert(
      'Accepter le créneau',
      `Confirmez-vous l'acceptation du créneau ${slot.libelle} (${slot.heure_debut} → ${slot.heure_fin}) ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            setMissions(prev =>
              prev.map(m => {
                if (m.id !== missionId) return m;
                return {
                  ...m,
                  statut_reponse: 'acceptee',
                  my_slots: [
                    {
                      qualification_code: slot.qualification_code,
                      libelle: slot.libelle,
                      heure_debut: slot.heure_debut,
                      heure_fin: slot.heure_fin,
                    },
                  ],
                  available_slots: (m.available_slots || []).map(s =>
                    s.qualification_code === slot.qualification_code ? { ...s, taken: s.taken + 1 } : s,
                  ),
                };
              }),
            );
            Alert.alert('Succès', 'Votre créneau a été accepté avec succès.');
          },
        },
      ],
    );
  }

  function handleRefuseMission(missionId) {
    Alert.alert(
      'Refuser la prestation',
      'Êtes-vous sûr(e) de vouloir refuser cette prestation ? Elle ne vous sera plus proposée.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Refuser',
          style: 'destructive',
          onPress: () => {
            setMissions(prev =>
              prev.map(m => (m.id === missionId ? { ...m, statut_reponse: 'refusee' } : m)),
            );
            if (view === 'detail') setView('list');
            Alert.alert('Prestation refusée', 'La prestation a été marquée comme refusée.');
          },
        },
      ],
    );
  }

  // Render Retour View
  if (view === 'retour') {
    return (
      <RetourPrestation
        mission={selectedMission}
        onBack={() => setView('detail')}
        onSubmitted={() => {
          setView('list');
        }}
      />
    );
  }

  // Render Detail View
  if (view === 'detail' && selectedMission) {
    const m = missions.find(item => item.id === selectedMission.id) || selectedMission;
    const isProposed = !m.statut_reponse || m.statut_reponse === 'disponible';
    const isEnCours = m.statut === 'en_cours';

    return (
      <View style={styles.detailContainer}>
        {/* Detail Header */}
        <View style={styles.detailHeader}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setView('list')}
            style={styles.btnBack}
          >
            <ArrowLeft size={13} color="#888" />
            <Text style={styles.btnBackText}>Retour</Text>
          </Pressable>

          <View style={styles.detailTitleWrap}>
            <Text style={styles.detailTitle}>{m.prestation_nom}</Text>
            <View style={styles.detailBadges}>
              {isProposed && (
                <View style={[styles.badge, styles.badgeDisponible]}>
                  <Text style={styles.badgeDisponibleText}>Disponible</Text>
                </View>
              )}
              {m.statut_reponse === 'acceptee' && (
                <View style={[styles.badge, styles.badgeAccepted]}>
                  <Text style={styles.badgeAcceptedText}>Acceptée</Text>
                </View>
              )}
              {m.statut_reponse === 'refusee' && (
                <View style={[styles.badge, styles.badgeDeclined]}>
                  <Text style={styles.badgeDeclinedText}>Refusée</Text>
                </View>
              )}
              {m.type_id ? (
                <View style={styles.badgeDtd}>
                  <Text style={styles.badgeDtdText}>{m.type_id}</Text>
                </View>
              ) : null}
              {m.prestation_type_detail ? (
                <View style={styles.badgeEvent}>
                  <Text style={styles.badgeEventText}>{m.prestation_type_detail}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* Mission en cours Banner */}
        {isEnCours && (
          <View style={styles.activeBanner}>
            <View style={styles.activeBannerTop}>
              <View style={styles.activeIndicator}>
                <View style={styles.pulseDot} />
                <Text style={styles.activeLabel}>Mission en cours</Text>
              </View>
              <View style={styles.activeTimerBlock}>
                <Text style={styles.activeTimerText}>{fmtTimer(timerSeconds)}</Text>
                <Text style={styles.activeTimerSub}>Temps restant</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${m.progressPercent || 18.9}%` },
                ]}
              />
            </View>
            <Text style={styles.activeTotalDuration}>
              Durée totale : {m.total_hours || 3.8}h
            </Text>
          </View>
        )}

        {/* Retour prestation à compléter Banner */}
        <View style={styles.retourBanner}>
          <View style={styles.retourBannerIcon}>
            <ClipboardCheck size={18} color={colors.orangeDark} />
          </View>
          <View style={styles.retourBannerContent}>
            <Text style={styles.retourBannerTitle}>Retour prestation à compléter</Text>
            <Text style={styles.retourBannerSub}>
              Consommations, restes, satisfaction client, check-list de fermeture et photos.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setView('retour')}
            style={styles.btnCompleteRetour}
          >
            <Text style={styles.btnCompleteRetourText}>Compléter le retour</Text>
          </Pressable>
        </View>

        {/* Card 1: DATES & HORAIRES */}
        <View style={styles.detailCard}>
          <View style={styles.secHeader}>
            <Calendar size={14} color={colors.brown} />
            <Text style={styles.secTitle}>Dates & Horaires</Text>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <Calendar size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Date & Heure de début</Text>
              <Text style={styles.fieldValue}>
                {fmtDateFr(m.date_debut)} · {fmtTime(m.date_debut)}
              </Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <Calendar size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Date & Heure de fin</Text>
              <Text style={styles.fieldValue}>
                {fmtDateFr(m.date_fin)} · {fmtTime(m.date_fin)}
              </Text>
            </View>
          </View>

          <View style={styles.durationBox}>
            <Timer size={14} color={colors.brown} />
            <View>
              <Text style={styles.durationLabel}>Durée totale de la prestation</Text>
              <Text style={styles.durationValue}>
                {m.total_hours || 3.8} heures
              </Text>
            </View>
          </View>
        </View>

        {/* Card 2: LIEU & ADRESSE */}
        <View style={styles.detailCard}>
          <View style={styles.secHeader}>
            <MapPin size={14} color={colors.brown} />
            <Text style={styles.secTitle}>Lieu & Adresse</Text>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <MapPin size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Adresse de la prestation</Text>
              <Text style={[styles.fieldValue, styles.fieldValueHighlight]}>
                {m.adresse_exacte}
              </Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <Building2 size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Site / Espace</Text>
              <Text style={styles.fieldValue}>{m.space_name}</Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <MapPin size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Ville</Text>
              <Text style={styles.fieldValue}>{m.city}</Text>
            </View>
          </View>
        </View>

        {/* Card 3: INFORMATIONS DE LA PRESTATION */}
        <View style={styles.detailCard}>
          <View style={styles.secHeader}>
            <Briefcase size={14} color={colors.brown} />
            <Text style={styles.secTitle}>Informations de la prestation</Text>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <Tag size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Nom</Text>
              <Text style={styles.fieldValue}>{m.prestation_nom}</Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <Tag size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Type de mission</Text>
              <Text style={styles.fieldValue}>{m.type_id}</Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <Tag size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Type de prestation</Text>
              <Text style={styles.fieldValue}>{m.prestation_type_detail}</Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <User size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Client</Text>
              <Text style={styles.fieldValue}>{m.client_name}</Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrap}>
              <Briefcase size={12} color="#bbb" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Tenue exigée</Text>
              <Text style={styles.fieldValue}>{m.tenue_exigee}</Text>
            </View>
          </View>

          {m.commentaires && (
            <View style={styles.fieldRow}>
              <View style={styles.fieldIconWrap}>
                <MessageSquare size={12} color="#bbb" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Message & Instructions</Text>
                <View style={styles.instructionsBox}>
                  <Text style={styles.instructionsText}>{m.commentaires}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Card 4: CHOISISSEZ VOTRE CRÉNEAU */}
        {isProposed && (
          <View style={[styles.detailCard, styles.cardAccentBlue]}>
            <View style={styles.secHeader}>
              <Clock size={14} color="#1565c0" />
              <Text style={styles.secTitle}>Choisissez votre créneau</Text>
              <View style={styles.secBadge}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.orangeDark }}>
                  {m.available_slots?.length || 1} disponible
                </Text>
              </View>
            </View>

            {(m.available_slots || []).map((slot, idx) => (
              <View key={idx} style={styles.slotItem}>
                <View style={styles.slotRow}>
                  <Award size={13} color={colors.orangeDark} />
                  <Text style={styles.slotLibelle}>{slot.libelle}</Text>
                  <View style={styles.slotHourPill}>
                    <Clock size={10} color="#1565c0" />
                    <Text style={styles.slotHourText}>
                      {slot.heure_debut} → {slot.heure_fin}
                    </Text>
                  </View>
                  <View style={styles.slotDurationPill}>
                    <Timer size={10} color={colors.brown} />
                    <Text style={styles.slotDurationText}>3.0h net</Text>
                  </View>
                  <Text style={styles.slotRemainingText}>
                    {slot.quantity - slot.taken} place restante
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => handleAcceptSlot(m.id, slot)}
                    style={styles.btnSlotAccept}
                  >
                    <CheckCircle2 size={12} color={colors.white} />
                    <Text style={styles.btnSlotAcceptText}>Accepter ce créneau</Text>
                  </Pressable>
                </View>

                {slot.coupure_debut && (
                  <View style={styles.slotPausePill}>
                    <Timer size={10} color="#f57f17" />
                    <Text style={styles.slotPauseText}>
                      Pause {slot.coupure_debut} → {slot.coupure_fin}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Card 5: LANGUES REQUISES */}
        {m.languages && m.languages.length > 0 && (
          <View style={styles.detailCard}>
            <View style={styles.secHeader}>
              <Globe size={14} color={colors.brown} />
              <Text style={styles.secTitle}>Langues requises</Text>
            </View>
            <View style={styles.languagesGrid}>
              {m.languages.map(lang => (
                <View key={lang} style={styles.langBadge}>
                  <Globe size={11} color="#1565c0" />
                  <Text style={styles.langBadgeText}>{lang}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Card 6: PIÈCES JOINTES */}
        <View style={styles.detailCard}>
          <View style={styles.secHeader}>
            <Paperclip size={14} color={colors.brown} />
            <Text style={styles.secTitle}>Pièces jointes</Text>
          </View>
          <Text style={styles.emptyAttachmentText}>
            Aucune pièce jointe pour cette prestation.
          </Text>
        </View>

        {/* Bottom Action: Refuser cette prestation */}
        {isProposed && (
          <Pressable
            accessibilityRole="button"
            onPress={() => handleRefuseMission(m.id)}
            style={styles.btnRefuseFull}
          >
            <XCircle size={16} color="#9b1c1c" />
            <Text style={styles.btnRefuseFullText}>Refuser cette prestation</Text>
          </Pressable>
        )}
      </View>
    );
  }

  // Render Main List View
  return (
    <View>
      {/* Existing Page Heading */}
      <View style={[extras.pageHeading, { marginBottom: 16 }]}>
        <Text style={extras.pageEyebrow}>Espace extra</Text>
        <Text style={extras.pageTitle}>Prestations</Text>
        <Text style={extras.pageDescription}>
          Consultez et suivez vos prestations proposées, à venir, en cours et
          terminées.
        </Text>
      </View>

      {/* 5 Segmented Tabs matching screenshot-1 */}
      <View style={styles.tabsWrap}>
        <ScrollView
          contentContainerStyle={styles.tabsContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
        >
          {TABS.map(tab => {
            const active = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tabItem,
                  tab.key === 'proposees' && styles.tabItemProposees,
                  active ? styles.tabItemActive : styles.tabItemInactive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    active && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
                {tab.key === 'proposees' && proposedCount > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{proposedCount}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter Bar with Date Inputs and Search Input */}
      <View style={styles.filterBar}>
        <View style={styles.filterDateBtn}>
          <Calendar size={13} color="#888" />
          <TextInput
            onChangeText={setDateFilterStart}
            placeholder="mm/dd/yyyy"
            placeholderTextColor="#bbb"
            style={styles.filterDateText}
            value={dateFilterStart}
          />
        </View>

        <View style={styles.filterDateBtn}>
          <Calendar size={13} color="#888" />
          <TextInput
            onChangeText={setDateFilterEnd}
            placeholder="mm/dd/yyyy"
            placeholderTextColor="#bbb"
            style={styles.filterDateText}
            value={dateFilterEnd}
          />
        </View>

        <View style={styles.filterSearchBox}>
          <Search size={13} color="#888" />
          <TextInput
            onChangeText={setSearchQuery}
            placeholder="Rechercher mission / client..."
            placeholderTextColor="#bbb"
            style={styles.filterSearchInput}
            value={searchQuery}
          />
          {searchQuery ? (
            <Pressable
              accessibilityLabel="Effacer la recherche"
              accessibilityRole="button"
              onPress={() => setSearchQuery('')}
            >
              <X size={14} color="#888" />
            </Pressable>
          ) : null}
        </View>

        {(dateFilterStart || dateFilterEnd || searchQuery) ? (
          <Pressable
            accessibilityLabel="Réinitialiser les filtres"
            accessibilityRole="button"
            onPress={() => {
              setDateFilterStart('');
              setDateFilterEnd('');
              setSearchQuery('');
            }}
            style={styles.filterClearBtn}
          >
            <X size={14} color={colors.brown} />
          </Pressable>
        ) : null}
      </View>

      {/* Mission Cards or Empty State */}
      {filteredMissions.length === 0 ? (
        /* Empty State matching screenshot-1 */
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconBox}>
            <Briefcase size={22} color={colors.orange} />
          </View>
          <Text style={styles.emptyTitle}>Aucune prestation disponible</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery || dateFilterStart || dateFilterEnd
              ? 'Modifiez ou réinitialisez les filtres.'
              : activeTab === 'proposees'
              ? 'Vous serez notifié(e) quand une prestation correspond à votre profil.'
              : 'Acceptez des missions depuis l’onglet Proposées.'}
          </Text>
        </View>
      ) : (
        /* List of Mission Cards */
        <View style={styles.listContainer}>
          {filteredMissions.map(m => {
            const isProposed = !m.statut_reponse || m.statut_reponse === 'disponible';
            const isAccepted = m.statut_reponse === 'acceptee';
            const isDeclined = m.statut_reponse === 'refusee';

            return (
              <View
                key={m.id}
                style={[
                  styles.card,
                  isProposed && styles.cardProposed,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.cardTitle}>{m.prestation_nom}</Text>
                      {isProposed && (
                        <View style={[styles.badge, styles.badgeDisponible]}>
                          <Text style={styles.badgeDisponibleText}>Disponible</Text>
                        </View>
                      )}
                      {isAccepted && (
                        <View style={[styles.badge, styles.badgeAccepted]}>
                          <Text style={styles.badgeAcceptedText}>Acceptée</Text>
                        </View>
                      )}
                      {isDeclined && (
                        <View style={[styles.badge, styles.badgeDeclined]}>
                          <Text style={styles.badgeDeclinedText}>Refusée</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.cardMetaRow}>
                      <View style={styles.cardMetaItem}>
                        <Calendar size={11} color="#888" />
                        <Text style={styles.cardMetaText}>{fmtDateFr(m.date_debut)}</Text>
                      </View>
                      <View style={styles.cardMetaItem}>
                        <Clock size={11} color="#888" />
                        <Text style={styles.cardMetaText}>
                          {fmtTime(m.date_debut)} — {fmtTime(m.date_fin)}
                        </Text>
                      </View>
                      <View style={styles.cardMetaItem}>
                        <MapPin size={11} color="#888" />
                        <Text style={styles.cardMetaText}>{m.adresse_exacte}</Text>
                      </View>
                      <View style={styles.cardMetaItem}>
                        <Briefcase size={11} color={colors.orange} />
                        <Text style={styles.cardMetaText}>{m.space_name}</Text>
                      </View>
                      <View style={styles.cardMetaItem}>
                        <Text style={styles.cardMetaText}>
                          {[m.type_id, m.prestation_type_detail].filter(Boolean).join(' · ')}
                        </Text>
                      </View>
                    </View>

                    {/* Assigned slot if working */}
                    {m.my_slots && m.my_slots.length > 0 && (
                      <View style={styles.cardSlotTag}>
                        <Clock size={10} color="#1565c0" />
                        <Text style={styles.cardSlotTagText}>
                          Votre horaire de travail :{' '}
                          {m.my_slots
                            .map(sl => `${sl.heure_debut} → ${sl.heure_fin}`)
                            .join('  ·  ')}
                        </Text>
                      </View>
                    )}

                    {/* Available slot chip if available */}
                    {isProposed && m.available_slots && m.available_slots.length > 0 && (
                      <View style={styles.cardAvailSlotTag}>
                        <Users size={10} color="#4338ca" />
                        <Text style={styles.cardAvailSlotTagText}>
                          {m.available_slots.length} créneau
                          {m.available_slots.length > 1 ? 'x' : ''} pour votre métier
                        </Text>
                      </View>
                    )}

                    <Text style={styles.cardDaysUntil}>Aujourd'hui</Text>
                  </View>
                </View>

                {/* Card Action Buttons */}
                <View style={styles.cardActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setSelectedMission(m);
                      setView('detail');
                    }}
                    style={styles.btnVoir}
                  >
                    <Text style={styles.btnVoirText}>Voir</Text>
                    <ChevronRight size={12} color={colors.white} />
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setSelectedMission(m);
                      setView('retour');
                    }}
                    style={styles.btnRetourAction}
                  >
                    <ClipboardCheck size={12} color={colors.white} />
                    <Text style={styles.btnRetourActionText}>Compléter le retour</Text>
                  </Pressable>

                  {isProposed && (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => handleRefuseMission(m.id)}
                      style={styles.btnRefuseCard}
                    >
                      <XCircle size={11} color="#9b1c1c" />
                      <Text style={styles.btnRefuseCardText}>Refuser</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
