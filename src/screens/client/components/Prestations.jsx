import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleAlert,
  Clock,
  Coffee,
  Copy,
  Eye,
  FileText,
  MapPin,
  MessageSquare,
  Paperclip,
  Plus,
  Save,
  Send,
  Tag,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react-native';
import { prestationsStylesByBrand } from './styles';
import { useClientTheme } from '../theme/ClientThemeContext';

const statusTabs = [
  'Prestations ajoutées',
  'À venir',
  'En cours',
  'Passées',
  'Toutes',
];
const missionTypes = ['DTD', 'Événementiel'];
const eventTypes = [
  'EVENT - Event',
  'CKDEJ — Cocktail Déjeunatoire',
  'CKDIN — Cocktail Dînatoire',
  'AUTRE — Autre',
];
const qualifications = [
  'Barista',
  'Chef de cuisine',
  'Chef de partie',
  'Chef de rang',
  'Commis',
  'Équipier MK',
  'Maître d’hôtel',
  'Maître d’hôtel CKDIN',
  'Maître d’hôtel référent',
  'Maître d’hôtel responsable',
  'Mixologue',
  'Commis de salle',
  'Plongeur',
  'Serveur / Serveuse',
  'Barman / Barmaid',
  'Runner',
  'Sommelier',
];
const languages = [
  'Arabe',
  'Allemand',
  'Anglais',
  'Espagnol',
  'Français',
  'Italien',
  'Portugais',
  'Chinois',
];
const languageCodes = {
  Arabe: 'AR',
  Allemand: 'DE',
  Anglais: 'EN',
  Espagnol: 'ES',
  Français: 'FR',
  Italien: 'IT',
  Portugais: 'PT',
  Chinois: 'ZH',
};
const clothingItems = [
  'Chemise blanche',
  'Pantalon noir',
  'Chaussures de ville noires',
  'Tablier fourni',
  'Veste de cuisine blanche',
];
const clientName = 'Dashboard Client 02';
const posterName = 'Client 02';

function newJob() {
  return {
    qualification: '',
    quantity: '1',
    departure: '',
    arrival: '',
    breakEnabled: false,
    breakStart: '',
    breakEnd: '',
  };
}

function newEvent() {
  return { type: '', clientStart: '', clientEnd: '', jobs: [newJob()] };
}

const initialMission = {
  title: '',
  address: '',
  differentAddress: false,
  differentAddressText: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  missionType: '',
  clothing: [],
  clothingOther: '',
  comments: '',
  languages: ['Français'],
  events: [newEvent()],
  files: [],
  status: 'Brouillon',
  messages: [],
};

function cloneMission(source) {
  return {
    ...source,
    clothing: [...source.clothing],
    languages: [...source.languages],
    events: source.events.map(event => ({
      ...event,
      jobs: event.jobs.map(job => ({ ...job })),
    })),
    files: [...source.files],
    messages: [...source.messages],
  };
}

function demoDate(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

// Jeu de démonstration : permet de voir la liste, le détail, la duplication,
// la conversation et l'annulation sans avoir à saisir une prestation.
export const demoMissions = [
  {
    id: 'demo-1',
    title: 'Cocktail dînatoire — Domaine des Lys',
    address: '12 avenue des Vignes, 33000 Bordeaux',
    differentAddress: false,
    differentAddressText: '',
    startDate: demoDate(20),
    startTime: '11:30',
    endDate: demoDate(21),
    endTime: '01:00',
    missionType: 'Événementiel',
    clothing: ['Chemise blanche', 'Pantalon noir', 'Chaussures de ville noires'],
    clothingOther: 'Gilet noir fourni sur place.',
    comments: 'Prévoir deux vestiaires et un accès traiteur côté cour.',
    languages: ['Français', 'Anglais'],
    events: [
      {
        type: 'CKDEJ — Cocktail Déjeunatoire',
        clientStart: '11:30',
        clientEnd: '15:00',
        jobs: [
          {
            qualification: 'Chef de partie',
            quantity: '2',
            departure: '10:00',
            arrival: '15:30',
            breakEnabled: false,
            breakStart: '',
            breakEnd: '',
          },
          {
            qualification: 'Commis',
            quantity: '3',
            departure: '10:30',
            arrival: '16:00',
            breakEnabled: true,
            breakStart: '14:00',
            breakEnd: '14:30',
          },
        ],
      },
      {
        type: 'CKDIN — Cocktail Dînatoire',
        clientStart: '18:30',
        clientEnd: '01:00',
        jobs: [
          {
            qualification: 'Chef de cuisine',
            quantity: '1',
            departure: '16:00',
            arrival: '01:30',
            breakEnabled: false,
            breakStart: '',
            breakEnd: '',
          },
          {
            qualification: 'Maître d’hôtel',
            quantity: '2',
            departure: '17:30',
            arrival: '01:30',
            breakEnabled: true,
            breakStart: '23:00',
            breakEnd: '23:30',
          },
          {
            qualification: 'Plongeur',
            quantity: '1',
            departure: '18:00',
            arrival: '01:30',
            breakEnabled: false,
            breakStart: '',
            breakEnd: '',
          },
        ],
      },
    ],
    files: [
      { name: 'menu-cocktail.pdf', uri: 'demo://menu-cocktail.pdf' },
      { name: 'briefing-equipe.docx', uri: 'demo://briefing-equipe.docx' },
    ],
    status: 'En attente admin',
    messages: [
      {
        id: 'demo-1-m1',
        text: 'Bonjour, la tenue blanche est-elle exigée pour toute l’équipe ?',
      },
      {
        id: 'demo-1-m2',
        text: 'Oui, sauf en cuisine où le gilet est fourni sur place.',
      },
    ],
  },
  {
    id: 'demo-2',
    title: 'Service du soir — Le Comptoir des Halles',
    address: '5 place des Halles, 69002 Lyon',
    differentAddress: false,
    differentAddressText: '',
    startDate: demoDate(-1),
    startTime: '18:00',
    endDate: demoDate(1),
    endTime: '23:30',
    missionType: 'DTD',
    clothing: ['Chemise blanche', 'Pantalon noir'],
    clothingOther: '',
    comments: '',
    languages: ['Français'],
    events: [
      {
        type: 'EVENT - Event',
        clientStart: '',
        clientEnd: '',
        jobs: [
          {
            qualification: 'Chef de rang',
            quantity: '2',
            departure: '17:00',
            arrival: '00:00',
            breakEnabled: false,
            breakStart: '',
            breakEnd: '',
          },
          {
            qualification: 'Plongeur',
            quantity: '1',
            departure: '18:00',
            arrival: '00:30',
            breakEnabled: false,
            breakStart: '',
            breakEnd: '',
          },
        ],
      },
    ],
    files: [],
    status: 'Brouillon',
    messages: [],
  },
  {
    id: 'demo-3',
    title: 'Dîner de gala — Hôtel Bellevue',
    address: '8 quai des Chartrons, 33300 Bordeaux',
    differentAddress: true,
    differentAddressText: 'Accès livraison : 3 rue Notre-Dame',
    startDate: demoDate(-40),
    startTime: '19:00',
    endDate: demoDate(-40),
    endTime: '23:30',
    missionType: 'Événementiel',
    clothing: ['Chemise blanche', 'Pantalon noir', 'Chaussures de ville noires'],
    clothingOther: '',
    comments: 'Service à l’assiette, 180 couverts.',
    languages: ['Français', 'Anglais'],
    events: [
      {
        type: 'AUTRE — Autre',
        clientStart: '19:00',
        clientEnd: '23:30',
        jobs: [
          {
            qualification: 'Chef de rang',
            quantity: '4',
            departure: '17:30',
            arrival: '00:00',
            breakEnabled: true,
            breakStart: '21:30',
            breakEnd: '22:00',
          },
          {
            qualification: 'Sommelier',
            quantity: '1',
            departure: '18:00',
            arrival: '23:30',
            breakEnabled: false,
            breakStart: '',
            breakEnd: '',
          },
        ],
      },
    ],
    files: [{ name: 'plan-de-salle.png', uri: 'demo://plan-de-salle.png' }],
    status: 'Annulée',
    messages: [],
  },
];

function normalizedDate(value) {
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (isoMatch) {
    return value;
  }
  const frenchMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  return frenchMatch
    ? `${frenchMatch[3]}-${frenchMatch[2]}-${frenchMatch[1]}`
    : '';
}

function dateValue(value) {
  if (!value) {
    return 'À définir';
  }
  const normalized = normalizedDate(value);
  if (!normalized) {
    return value;
  }
  const parsed = new Date(`${normalized}T12:00:00`);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
}

function shortDate(value) {
  const normalized = normalizedDate(value);
  if (!normalized) {
    return value || '—';
  }
  const [year, month, day] = normalized.split('-');
  return `${day}/${month}/${year}`;
}

function withSeconds(value) {
  if (!value) {
    return '—';
  }
  return value.length === 5 ? `${value}:00` : value;
}

function durationLabel(start, end) {
  if (!start || !end) {
    return '';
  }
  const startParts = start.split(':').map(Number);
  const endParts = end.split(':').map(Number);
  if ([...startParts, ...endParts].some(Number.isNaN)) {
    return '';
  }
  let minutes =
    endParts[0] * 60 + endParts[1] - (startParts[0] * 60 + startParts[1]);
  if (minutes < 0) {
    minutes += 24 * 60;
  }
  return `${Math.round((minutes / 60) * 10) / 10}h`;
}

function missionBucket(mission) {
  if (!mission.startDate) {
    return 'À venir';
  }
  const startDate = normalizedDate(mission.startDate);
  if (!startDate) {
    return 'À venir';
  }
  const start = new Date(`${startDate}T${mission.startTime || '00:00'}`);
  const end = mission.endDate
    ? new Date(
        `${normalizedDate(mission.endDate) || startDate}T${
          mission.endTime || '23:59'
        }`,
      )
    : start;
  const now = new Date();
  if (end < now) {
    return 'Passées';
  }
  if (start <= now && end >= now) {
    return 'En cours';
  }
  return 'À venir';
}

function missionJobs(mission) {
  return mission.events.reduce((all, event) => [...all, ...event.jobs], []);
}

function missionStaff(mission) {
  return missionJobs(mission).reduce(
    (total, job) => total + (Number(job.quantity) || 0),
    0,
  );
}

function eventCode(mission) {
  const first = mission.events.find(event => event.type);
  return first ? first.type.trim().split(/\s+/)[0] : '';
}

function jobEntries(mission) {
  return mission.events.reduce(
    (all, event) =>
      all.concat(
        event.jobs.map(job => ({
          code: event.type ? event.type.trim().split(/\s+/)[0] : '',
          qualification: job.qualification,
          quantity: job.quantity,
          timeLabel: `${withSeconds(
            event.clientStart || mission.startTime,
          )} → ${withSeconds(event.clientEnd || mission.endTime)}`,
          pauseLabel: job.breakEnabled
            ? `Pause ${withSeconds(job.breakStart)}-${withSeconds(
                job.breakEnd,
              )}`
            : '',
        })),
      ),
    [],
  );
}

function initials(name) {
  return name
    .split(/\s+/)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

function SelectField({
  label,
  value,
  options,
  onSelect,
  placeholder,
  hideLabel,
  compact,
}) {
  const { partner, colors } = useClientTheme();
  const styles = prestationsStylesByBrand[partner];
  const [open, setOpen] = useState(false);

  return (
    <>
      <View style={hideLabel ? styles.selectWrap : styles.fieldGroup}>
        {hideLabel ? null : <Text style={styles.label}>{label}</Text>}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ expanded: open }}
          onPress={() => setOpen(true)}
          style={[styles.selectField, compact && styles.selectFieldCompact]}
        >
          <Text
            numberOfLines={1}
            style={[styles.selectText, !value && styles.selectPlaceholder]}
          >
            {value || placeholder || '-- Sélectionner --'}
          </Text>
          <ChevronDown size={compact ? 14 : 17} color="#888" />
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        onRequestClose={() => setOpen(false)}
        transparent
        visible={open}
      >
        <View style={styles.overlay}>
          <Pressable
            accessibilityLabel="Fermer les choix"
            onPress={() => setOpen(false)}
            style={styles.overlayScrim}
          />
          <View style={styles.pickerSheet}>
            <Text style={styles.pickerTitle}>{label}</Text>
            <ScrollView>
              {options.map(option => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected: value === option }}
                  onPress={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                  style={styles.pickerOption}
                >
                  <Text style={styles.pickerOptionText}>{option}</Text>
                  {value === option ? (
                    <Check size={17} color={colors.orangeDark} />
                  ) : null}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

function InfoRow({ label, value }) {
  const { partner } = useClientTheme();
  const styles = prestationsStylesByBrand[partner];

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  );
}

function ConvInfoRow({ icon, label, value, first }) {
  const { partner } = useClientTheme();
  const styles = prestationsStylesByBrand[partner];

  return (
    <View style={[styles.convInfoRow, first && styles.convInfoRowFirst]}>
      {icon}
      <Text style={styles.convInfoLabel}>{label}</Text>
      <Text style={styles.convInfoValue}>{value}</Text>
    </View>
  );
}

function BackButton({ onPress }) {
  const { partner } = useClientTheme();
  const styles = prestationsStylesByBrand[partner];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.backButton}
    >
      <ChevronLeft size={13} color="#888" />
      <Text style={styles.backButtonText}>Retour</Text>
    </Pressable>
  );
}

export default function Prestations({ missions, setMissions }) {
  const { partner, colors } = useClientTheme();
  const styles = prestationsStylesByBrand[partner];
  const [screen, setScreen] = useState('list');
  const [selectedId, setSelectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('Prestations ajoutées');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [mission, setMission] = useState(() => cloneMission(initialMission));
  const [duplicating, setDuplicating] = useState(false);
  const [messageDraft, setMessageDraft] = useState('');
  const [conversationOpen, setConversationOpen] = useState(false);
  const [conversationTab, setConversationTab] = useState('conversation');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [bannerVisible, setBannerVisible] = useState(() =>
    missions.some(item => item.status === 'En attente admin'),
  );

  const selectedMission = missions.find(item => item.id === selectedId);
  const pendingCount = missions.filter(
    item => item.status === 'En attente admin',
  ).length;

  function tabCount(tab) {
    if (tab === 'Prestations ajoutées') {
      return pendingCount;
    }
    if (tab === 'Toutes') {
      return missions.length;
    }
    return missions.filter(item => missionBucket(item) === tab).length;
  }

  const filteredMissions = missions.filter(item => {
    const query = search.trim().toLocaleLowerCase('fr-FR');
    const searchable = `${item.title} ${item.address}`.toLocaleLowerCase(
      'fr-FR',
    );
    const bucket = missionBucket(item);
    return (
      (!query || searchable.includes(query)) &&
      (statusFilter === 'Prestations ajoutées' ||
        statusFilter === 'Toutes' ||
        bucket === statusFilter) &&
      (!fromDate ||
        normalizedDate(item.startDate) >= normalizedDate(fromDate)) &&
      (!toDate || normalizedDate(item.startDate) <= normalizedDate(toDate))
    );
  });

  function patchMission(key, value) {
    setMission(current => ({ ...current, [key]: value }));
  }

  function patchEvent(eventIndex, key, value) {
    setMission(current => ({
      ...current,
      events: current.events.map((event, index) =>
        index === eventIndex ? { ...event, [key]: value } : event,
      ),
    }));
  }

  function patchJob(eventIndex, jobIndex, key, value) {
    setMission(current => ({
      ...current,
      events: current.events.map((event, index) =>
        index === eventIndex
          ? {
              ...event,
              jobs: event.jobs.map((job, position) =>
                position === jobIndex ? { ...job, [key]: value } : job,
              ),
            }
          : event,
      ),
    }));
  }

  function toggleArrayValue(key, value) {
    setMission(current => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter(item => item !== value)
        : [...current[key], value],
    }));
  }

  function startNewMission() {
    setMission(cloneMission(initialMission));
    setDuplicating(false);
    setBannerVisible(false);
    setScreen('form');
  }

  function startDuplicate(source) {
    setMission({
      ...cloneMission(source),
      title: `${source.title} (copie)`,
      id: undefined,
      status: 'Brouillon',
      messages: [],
    });
    setDuplicating(true);
    setBannerVisible(false);
    setScreen('form');
  }

  function addEvent() {
    setMission(current => ({
      ...current,
      events: [...current.events, newEvent()],
    }));
  }

  function removeEvent(eventIndex) {
    setMission(current => ({
      ...current,
      events: current.events.filter((_, index) => index !== eventIndex),
    }));
  }

  function addJob(eventIndex) {
    setMission(current => ({
      ...current,
      events: current.events.map((event, index) =>
        index === eventIndex
          ? {
              ...event,
              jobs: [
                ...event.jobs,
                {
                  ...(event.jobs[event.jobs.length - 1] || newJob()),
                  departure: '',
                  arrival: '',
                  breakStart: '',
                  breakEnd: '',
                },
              ],
            }
          : event,
      ),
    }));
  }

  function removeJob(eventIndex, jobIndex) {
    setMission(current => ({
      ...current,
      events: current.events.map((event, index) =>
        index === eventIndex
          ? {
              ...event,
              jobs: event.jobs.filter(
                (_, position) => position !== jobIndex,
              ),
            }
          : event,
      ),
    }));
  }

  async function addFiles() {
    try {
      const pickedFiles = await pick({
        type: [types.pdf, types.images],
        allowMultiSelection: true,
      });
      setMission(current => ({
        ...current,
        files: [
          ...current.files,
          ...pickedFiles.map(file => ({
            name: file.name || 'Fichier joint',
            uri: file.uri,
            type: file.type,
          })),
        ],
      }));
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }
      Alert.alert(
        'Impossible d’ouvrir les fichiers',
        isErrorWithCode(error)
          ? error.message
          : 'Une erreur inattendue est survenue. Réessayez.',
      );
    }
  }

  function saveMission(status) {
    if (!mission.title.trim()) {
      Alert.alert(
        'Nom de prestation requis',
        'Ajoutez un nom avant d’enregistrer cette prestation.',
      );
      return;
    }
    if (status === 'En attente admin') {
      const missing = [
        ['Adresse', mission.address],
        ['Date de début', mission.startDate],
        ['Heure de début', mission.startTime],
        ['Date de fin', mission.endDate],
        ['Heure de fin', mission.endTime],
        ['Type de mission', mission.missionType],
      ].find(([, value]) => !value.trim());
      if (missing) {
        Alert.alert(
          'Informations manquantes',
          `Renseignez le champ « ${missing[0]} » avant de soumettre.`,
        );
        return;
      }
      if (
        mission.events.some(event =>
          event.jobs.some(job => !job.qualification),
        )
      ) {
        Alert.alert(
          'Poste requis',
          'Sélectionnez une qualification pour chaque poste.',
        );
        return;
      }
    }

    const saved = {
      ...cloneMission(mission),
      id: mission.id || `${Date.now()}`,
      status,
    };
    setMissions(current => {
      const exists = current.some(item => item.id === saved.id);
      return exists
        ? current.map(item => (item.id === saved.id ? saved : item))
        : [saved, ...current];
    });
    setScreen('list');
    setSelectedId(null);
    setBannerVisible(status === 'En attente admin');
  }

  function confirmCancel() {
    if (!cancelTarget) {
      return;
    }
    setMissions(current =>
      current.map(item =>
        item.id === cancelTarget.id ? { ...item, status: 'Annulée' } : item,
      ),
    );
    setCancelTarget(null);
    setCancelReason('');
  }

  function sendMessage() {
    const value = messageDraft.trim();
    if (!value || !selectedMission) {
      return;
    }
    const message = {
      id: `${Date.now()}`,
      text: value,
      createdAt: new Date(),
    };
    setMissions(current =>
      current.map(item =>
        item.id === selectedMission.id
          ? { ...item, messages: [...item.messages, message] }
          : item,
      ),
    );
    setMessageDraft('');
  }

  function showDetails(item) {
    setSelectedId(item.id);
    setScreen('detail');
  }

  function openConversation(item) {
    setSelectedId(item.id);
    setConversationTab('conversation');
    setConversationOpen(true);
  }

  function openCancel(item) {
    setCancelTarget(item);
    setCancelReason('');
  }

  function renderList() {
    return (
      <View style={styles.section}>
        <View style={styles.listHeader}>
          <View style={styles.headerTitleBlock}>
            <Text style={styles.pageTitle}>Prestations — {clientName}</Text>
            <Text style={styles.pageSubtitle}>
              {missions.length} prestation(s)
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={startNewMission}
            style={styles.newButton}
          >
            <Plus size={14} color={colors.white} />
            <Text style={styles.newButtonText}>Nouvelle prestation</Text>
          </Pressable>
        </View>

        {bannerVisible ? (
          <View style={styles.banner}>
            <CircleAlert size={18} color="#F57F17" />
            <View style={styles.bannerBody}>
              <Text style={styles.bannerTitle}>
                {pendingCount} prestation{pendingCount > 1 ? 's' : ''} ajoutée
                {pendingCount > 1 ? 's' : ''} en attente de validation
              </Text>
              <Text style={styles.bannerSub}>
                En attente de validation par l’administration Bookly.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setStatusFilter('Prestations ajoutées');
                setBannerVisible(false);
              }}
              style={styles.bannerButton}
            >
              <Text style={styles.bannerButtonText}>Voir →</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.tabs}>
          {statusTabs.map(tab => {
            const selected = statusFilter === tab;
            const count = tabCount(tab);
            return (
              <Pressable
                key={tab}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setStatusFilter(tab)}
                style={[styles.tab, selected && styles.tabSelected]}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.tabText, selected && styles.tabTextSelected]}
                >
                  {tab}
                </Text>
                {count ? (
                  <Text
                    style={[
                      styles.tabBadge,
                      selected ? styles.tabBadgeSelected : styles.tabBadgeIdle,
                    ]}
                  >
                    {count}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.filtersBar}>
          <TextInput
            accessibilityLabel="Date de début du filtre"
            onChangeText={setFromDate}
            placeholder="Depuis"
            placeholderTextColor="#BBB"
            style={styles.filterInput}
            value={fromDate}
          />
          <TextInput
            accessibilityLabel="Date de fin du filtre"
            onChangeText={setToDate}
            placeholder="Jusqu'au"
            placeholderTextColor="#BBB"
            style={styles.filterInput}
            value={toDate}
          />
          <TextInput
            accessibilityLabel="Rechercher une prestation"
            onChangeText={setSearch}
            placeholder="Rechercher une prestation..."
            placeholderTextColor="#BBB"
            style={styles.filterSearch}
            value={search}
          />
        </View>

        {filteredMissions.length ? (
          <View style={styles.missionList}>
            {filteredMissions.map(item => (
              <View key={item.id} style={styles.missionCard}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => showDetails(item)}
                  style={styles.missionMain}
                >
                  <Text style={styles.missionTitle}>{item.title}</Text>
                  {item.status === 'En attente admin' ? (
                    <Text style={styles.missionStatus}>En attente admin</Text>
                  ) : null}
                  <View style={styles.missionMeta}>
                    <View style={styles.metaItem}>
                      <CalendarDays size={11} color="#888" />
                      <Text style={styles.metaText}>
                        {shortDate(item.startDate)}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Clock size={11} color="#888" />
                      <Text style={styles.metaText}>
                        {item.startTime || '--:--'} - {item.endTime || '--:--'}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Users size={11} color="#888" />
                      <Text style={styles.metaText}>
                        0 / {missionStaff(item)}
                      </Text>
                    </View>
                    {eventCode(item) ? (
                      <View style={styles.metaItem}>
                        <Tag size={11} color="#888" />
                        <Text style={styles.metaText}>{eventCode(item)}</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.missionPoster}>
                    <User size={10} color="#BBA695" />
                    <Text style={styles.missionPosterText}>
                      Posté par : {posterName}
                    </Text>
                  </View>
                </Pressable>

                <View style={styles.missionSide}>
                  <View>
                    <Text style={styles.missionPrice}>0.00 €</Text>
                    <Text style={styles.missionPriceCaption}>
                      HT / prestation
                    </Text>
                  </View>
                  <View style={styles.missionActions}>
                    <Pressable
                      accessibilityLabel="Message"
                      accessibilityRole="button"
                      onPress={() => openConversation(item)}
                      style={[styles.cardIconButton, styles.msgButton]}
                    >
                      <MessageSquare size={11} color="#1565C0" />
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => showDetails(item)}
                      style={[styles.cardIconButton, styles.viewButton]}
                    >
                      <Eye size={11} color={colors.orangeDark} />
                      <Text
                        style={[
                          styles.cardIconButtonText,
                          styles.viewButtonText,
                        ]}
                      >
                        Voir
                      </Text>
                    </Pressable>
                    <Pressable
                      accessibilityLabel="Dupliquer"
                      accessibilityRole="button"
                      onPress={() => startDuplicate(item)}
                      style={[styles.cardIconButton, styles.dupButton]}
                    >
                      <Copy size={11} color="#555" />
                    </Pressable>
                    <Pressable
                      accessibilityLabel="Annuler la mission"
                      accessibilityRole="button"
                      onPress={() => openCancel(item)}
                      style={[styles.cardIconButton, styles.cancelButton]}
                    >
                      <X size={11} color="#9B1C1C" />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <FileText size={22} color={colors.orange} />
            </View>
            <Text style={styles.emptyTitle}>
              Aucune prestation dans cet onglet
            </Text>
          </View>
        )}
      </View>
    );
  }

  function renderEventBlock(event, eventIndex) {
    return (
      <View key={eventIndex} style={styles.eventBlock}>
        <View style={styles.eventHead}>
          <View style={styles.eventNumber}>
            <Text style={styles.eventNumberText}>{eventIndex + 1}</Text>
          </View>
          <View style={styles.eventSelect}>
            <SelectField
              hideLabel
              compact
              label="Type d’événement"
              onSelect={value => patchEvent(eventIndex, 'type', value)}
              options={eventTypes}
              placeholder="-- Type d'événement --"
              value={event.type}
            />
          </View>
          {mission.events.length > 1 ? (
            <Pressable
              accessibilityLabel={`Supprimer le type d’événement ${
                eventIndex + 1
              }`}
              accessibilityRole="button"
              onPress={() => removeEvent(eventIndex)}
              style={styles.eventRemove}
            >
              <Trash2 size={15} color="#9B1C1C" />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.clientHoursRow}>
          <Clock size={12} color="#888" />
          <Text style={styles.clientHoursLabel}>
            Horaires client (facultatif)
          </Text>
          <TextInput
            accessibilityLabel="Heure de début client"
            onChangeText={value =>
              patchEvent(eventIndex, 'clientStart', value)
            }
            placeholder="De"
            placeholderTextColor="#BBB"
            style={styles.clientTimeInput}
            value={event.clientStart}
          />
          <Text style={styles.arrow}>→</Text>
          <TextInput
            accessibilityLabel="Heure de fin client"
            onChangeText={value => patchEvent(eventIndex, 'clientEnd', value)}
            placeholder="À"
            placeholderTextColor="#BBB"
            style={styles.clientTimeInput}
            value={event.clientEnd}
          />
        </View>

        <View style={styles.jobGridLabels}>
          <Text style={[styles.gridLabel, styles.colQualification]}>
            Intitulé de poste
          </Text>
          <Text style={[styles.gridLabel, styles.colNb]}>Nb</Text>
          <Text style={[styles.gridLabel, styles.colTime]}>Départ</Text>
          <Text style={[styles.gridLabel, styles.colTime]}>Arrivée</Text>
          <Text style={[styles.gridLabel, styles.colBreak]}>Coupure</Text>
          <View style={styles.colAction} />
        </View>

        {event.jobs.map((job, jobIndex) => (
          <View key={jobIndex}>
            <View style={styles.jobGrid}>
              <View style={styles.colQualification}>
                <SelectField
                  hideLabel
                  compact
                  label="Qualification"
                  onSelect={value =>
                    patchJob(eventIndex, jobIndex, 'qualification', value)
                  }
                  options={qualifications}
                  placeholder="-- Qualification --"
                  value={job.qualification}
                />
              </View>
              <TextInput
                accessibilityLabel="Nombre de personnes"
                keyboardType="number-pad"
                onChangeText={value =>
                  patchJob(eventIndex, jobIndex, 'quantity', value)
                }
                style={[styles.gridInput, styles.colNb]}
                value={job.quantity}
              />
              <TextInput
                accessibilityLabel="Heure de départ"
                onChangeText={value =>
                  patchJob(eventIndex, jobIndex, 'departure', value)
                }
                placeholder="Départ"
                placeholderTextColor="#BBB"
                style={[styles.gridInput, styles.colTime]}
                value={job.departure}
              />
              <TextInput
                accessibilityLabel="Heure d’arrivée"
                onChangeText={value =>
                  patchJob(eventIndex, jobIndex, 'arrival', value)
                }
                placeholder="Arrivée"
                placeholderTextColor="#BBB"
                style={[styles.gridInput, styles.colTime]}
                value={job.arrival}
              />
              <Pressable
                accessibilityLabel="Prévoir une coupure"
                accessibilityRole="checkbox"
                accessibilityState={{ checked: job.breakEnabled }}
                onPress={() =>
                  patchJob(
                    eventIndex,
                    jobIndex,
                    'breakEnabled',
                    !job.breakEnabled,
                  )
                }
                style={[styles.breakToggle, styles.colBreak]}
              >
                <View
                  style={[
                    styles.checkbox,
                    job.breakEnabled && styles.checkboxChecked,
                  ]}
                >
                  {job.breakEnabled ? (
                    <Check size={9} color={colors.white} />
                  ) : null}
                </View>
                <Coffee size={12} color="#888" />
              </Pressable>
              {event.jobs.length > 1 ? (
                <Pressable
                  accessibilityLabel={`Supprimer le poste ${jobIndex + 1}`}
                  accessibilityRole="button"
                  onPress={() => removeJob(eventIndex, jobIndex)}
                  style={styles.removeStaffButton}
                >
                  <Trash2 size={14} color="#9B1C1C" />
                </Pressable>
              ) : (
                <View style={styles.colAction} />
              )}
            </View>

            {job.breakEnabled ? (
              <View style={styles.breakRow}>
                <Text style={styles.breakLabel}>Pause :</Text>
                <TextInput
                  accessibilityLabel="Début de la pause"
                  onChangeText={value =>
                    patchJob(eventIndex, jobIndex, 'breakStart', value)
                  }
                  placeholder="De"
                  placeholderTextColor="#BBB"
                  style={styles.clientTimeInput}
                  value={job.breakStart}
                />
                <Text style={styles.arrow}>→</Text>
                <TextInput
                  accessibilityLabel="Fin de la pause"
                  onChangeText={value =>
                    patchJob(eventIndex, jobIndex, 'breakEnd', value)
                  }
                  placeholder="À"
                  placeholderTextColor="#BBB"
                  style={styles.clientTimeInput}
                  value={job.breakEnd}
                />
                <Text style={styles.breakNote}>
                  déduite des heures facturées
                </Text>
              </View>
            ) : null}
          </View>
        ))}

        <Pressable
          accessibilityRole="button"
          onPress={() => addJob(eventIndex)}
          style={styles.addStaffButton}
        >
          <Plus size={13} color={colors.orangeDark} />
          <Text style={styles.addStaffText}>Ajouter une qualification</Text>
        </Pressable>

        {duplicating ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => addJob(eventIndex)}
            style={styles.addStaffButton}
          >
            <Copy size={13} color={colors.orangeDark} />
            <Text style={styles.addStaffText}>
              Même intitulé · autre créneau
            </Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  function renderForm() {
    return (
      <View style={styles.section}>
        <View style={styles.formHeader}>
          <BackButton onPress={() => setScreen('list')} />
          <View style={styles.formTitleBlock}>
            <Text style={styles.formTitle}>
              {duplicating ? 'Dupliquer la prestation' : 'Nouvelle prestation'}
            </Text>
            <Text style={styles.formSub}>
              {clientName} · {clientName}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitlePlain}>Informations générales</Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nom de la prestation *</Text>
            <TextInput
              accessibilityLabel="Nom de la prestation"
              onChangeText={value => patchMission('title', value)}
              placeholder="Ex: Soirée gala annuelle"
              placeholderTextColor="#BBB"
              style={styles.input}
              value={mission.title}
            />
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.addressRow}>
              <Text style={[styles.label, styles.labelInline]}>
                Adresse de la prestation *
              </Text>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: mission.differentAddress }}
                onPress={() =>
                  patchMission('differentAddress', !mission.differentAddress)
                }
                style={styles.addressToggle}
              >
                <View
                  style={[
                    styles.checkbox,
                    mission.differentAddress && styles.checkboxChecked,
                  ]}
                >
                  {mission.differentAddress ? (
                    <Check size={9} color={colors.white} />
                  ) : null}
                </View>
                <Text style={styles.addressToggleText}>Adresse différente</Text>
              </Pressable>
            </View>
            <View style={styles.addressBox}>
              <MapPin size={14} color={colors.orangeDark} />
              <TextInput
                accessibilityLabel="Adresse de la prestation"
                onChangeText={value =>
                  patchMission(
                    mission.differentAddress
                      ? 'differentAddressText'
                      : 'address',
                    value,
                  )
                }
                placeholder={
                  mission.differentAddress
                    ? 'Adresse complète de la prestation'
                    : 'Adresse principale'
                }
                placeholderTextColor="#AAA"
                style={styles.addressBoxInput}
                value={
                  mission.differentAddress
                    ? mission.differentAddressText
                    : mission.address
                }
              />
            </View>
          </View>

          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Date & heure de début de l’évènement *
                </Text>
                <View style={styles.twoColumns}>
                  <TextInput
                    accessibilityLabel="Date de début"
                    onChangeText={value => patchMission('startDate', value)}
                    placeholder="JJ/MM/AAAA"
                    placeholderTextColor="#BBB"
                    style={[styles.input, styles.dateInputFlex]}
                    value={mission.startDate}
                  />
                  <TextInput
                    accessibilityLabel="Heure de début"
                    onChangeText={value => patchMission('startTime', value)}
                    placeholder="Heure"
                    placeholderTextColor="#BBB"
                    style={[styles.input, styles.timeInputFlex]}
                    value={mission.startTime}
                  />
                </View>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Date & heure de fin de l’évènement *
                </Text>
                <View style={styles.twoColumns}>
                  <TextInput
                    accessibilityLabel="Date de fin"
                    onChangeText={value => patchMission('endDate', value)}
                    placeholder="JJ/MM/AAAA"
                    placeholderTextColor="#BBB"
                    style={[styles.input, styles.dateInputFlex]}
                    value={mission.endDate}
                  />
                  <TextInput
                    accessibilityLabel="Heure de fin"
                    onChangeText={value => patchMission('endTime', value)}
                    placeholder="Heure"
                    placeholderTextColor="#BBB"
                    style={[styles.input, styles.timeInputFlex]}
                    value={mission.endTime}
                  />
                </View>
              </View>
            </View>
          </View>

          <SelectField
            label="Type de mission *"
            onSelect={value => patchMission('missionType', value)}
            options={missionTypes}
            placeholder="-- Sélectionner --"
            value={mission.missionType}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitlePlain}>
            Tenue exigée{' '}
            <Text style={styles.cardTitleMuted}>(optionnel)</Text>
          </Text>
          {clothingItems.map(item => {
            const checked = mission.clothing.includes(item);
            return (
              <Pressable
                key={item}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                onPress={() => toggleArrayValue('clothing', item)}
                style={styles.clothingRow}
              >
                <View
                  style={[
                    styles.clothingCheckbox,
                    checked && styles.clothingCheckboxChecked,
                  ]}
                >
                  {checked ? (
                    <Check size={12} color={colors.white} />
                  ) : null}
                </View>
                <Text style={styles.clothingRowText}>{item}</Text>
              </Pressable>
            );
          })}
          <Text style={styles.helper}>
            Pré-cochée d’après les habitudes de ce client. Décochez ou ajoutez
            une précision ci-dessous.
          </Text>
          <TextInput
            accessibilityLabel="Précision libre sur la tenue"
            onChangeText={value => patchMission('clothingOther', value)}
            placeholder="Précision libre sur la tenue"
            placeholderTextColor="#BBB"
            style={styles.input}
            value={mission.clothingOther}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitlePlain}>
            Commentaires{' '}
            <Text style={styles.cardTitleMuted}>(optionnel)</Text>
          </Text>
          <TextInput
            accessibilityLabel="Commentaires"
            multiline
            onChangeText={value => patchMission('comments', value)}
            placeholder="Instructions particulières, accès, contact sur place..."
            placeholderTextColor="#BBB"
            style={[styles.input, styles.multilineInput]}
            value={mission.comments}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitlePlain}>Langues requises *</Text>
          <View style={styles.langPillRow}>
            {languages.map(language => {
              const selected = mission.languages.includes(language);
              return (
                <Pressable
                  key={language}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => toggleArrayValue('languages', language)}
                  style={[
                    styles.langPillToggle,
                    selected ? styles.langPillSelected : styles.langPillIdle,
                  ]}
                >
                  <Text
                    style={[
                      styles.langPillText,
                      selected
                        ? styles.langPillTextSelected
                        : styles.langPillTextIdle,
                    ]}
                  >
                    {language}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitlePlain}>Types d’événement</Text>
          <Text style={styles.helperTop}>
            Une prestation peut comprendre plusieurs types d’événement (ex :
            PDJ + CKDIN + AW). Ajoutez un bloc par type.
          </Text>
          {mission.events.map((event, eventIndex) =>
            renderEventBlock(event, eventIndex),
          )}
          <Pressable
            accessibilityRole="button"
            onPress={addEvent}
            style={[styles.addStaffButton, styles.addStaffButtonFull]}
          >
            <Plus size={14} color={colors.orangeDark} />
            <Text style={styles.addStaffText}>
              Ajouter un type d’événement
            </Text>
          </Pressable>
        </View>

        {duplicating ? (
          <View style={styles.card}>
            <Text style={styles.cardTitlePlain}>
              Choix des extras{' '}
              <Text style={styles.cardTitleMuted}>(optionnel)</Text>
            </Text>
            {jobEntries(mission).map((entry, index) => (
              <View key={index} style={styles.extraBlock}>
                <View style={styles.extraHead}>
                  <Text style={styles.codeChip}>{entry.code}</Text>
                  <Text style={styles.jobNameChip}>
                    {entry.qualification || 'Poste à définir'}
                  </Text>
                  <Text style={styles.timeChip}>{entry.timeLabel}</Text>
                  <Text style={styles.assignText}>
                    0/{entry.quantity || 0} assigné(s)
                  </Text>
                </View>
                <Text style={styles.mutedText}>
                  Aucun favori ne correspond à ce poste.
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {duplicating ? (
          <View style={styles.card}>
            <Text style={styles.cardTitlePlain}>
              Vue d’ensemble des postes
            </Text>
            {jobEntries(mission).map((entry, index) => (
              <View key={index} style={styles.overviewRow}>
                <View style={styles.overviewBody}>
                  <View style={styles.overviewChips}>
                    <Text style={[styles.codeChip, styles.codeChipWhite]}>
                      {entry.code}
                    </Text>
                    <Text style={styles.jobNameChip}>
                      {entry.qualification || 'Poste à définir'}
                    </Text>
                    <Text style={styles.timeChip}>{entry.timeLabel}</Text>
                    {entry.pauseLabel ? (
                      <Text style={styles.pauseChip}>{entry.pauseLabel}</Text>
                    ) : null}
                    <Text style={styles.assignText}>
                      0/{entry.quantity || 0} assigné(s)
                    </Text>
                  </View>
                  <Text style={styles.overviewNote}>
                    <Text style={styles.mutedText}>Aucun extra choisi</Text>
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitlePlain}>
            Pièces jointes{' '}
            <Text style={styles.cardTitleMuted}>
              (optionnel — menus, photos, briefings...)
            </Text>
          </Text>
          {mission.files.map(file => (
            <View key={file.uri} style={styles.fileRow}>
              <FileText size={16} color={colors.orangeDark} />
              <Text numberOfLines={1} style={styles.fileName}>
                {file.name}
              </Text>
              <Pressable
                accessibilityLabel={`Supprimer ${file.name}`}
                accessibilityRole="button"
                onPress={() =>
                  patchMission(
                    'files',
                    mission.files.filter(item => item.uri !== file.uri),
                  )
                }
              >
                <Trash2 size={16} color="#888" />
              </Pressable>
            </View>
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={addFiles}
            style={styles.dashedButton}
          >
            <Paperclip size={15} color={colors.orangeDark} />
            <Text style={styles.dashedButtonText}>Ajouter des fichiers</Text>
          </Pressable>
          <Text style={styles.helperCenter}>
            PDF, Word, Images, Excel — 10 Mo max par fichier
          </Text>
        </View>

        <View style={styles.formActions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setScreen('list')}
            style={[styles.actionButton, styles.actionCancel]}
          >
            <Text style={styles.actionCancelText}>Annuler</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => saveMission('Brouillon')}
            style={[styles.actionButton, styles.actionDraft]}
          >
            <Save size={14} color={colors.orangeDark} />
            <Text style={styles.actionDraftText}>Sauvegarder brouillon</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => saveMission('En attente admin')}
            style={[styles.actionButton, styles.actionSubmit]}
          >
            <Send size={14} color={colors.white} />
            <Text style={styles.actionSubmitText}>Soumettre à l’admin</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  function renderDetail() {
    if (!selectedMission) {
      return (
        <View style={styles.section}>
          <Text style={styles.emptyTitle}>Prestation introuvable</Text>
          <BackButton onPress={() => setScreen('list')} />
        </View>
      );
    }

    const item = selectedMission;
    const code = eventCode(item);

    return (
      <View style={styles.section}>
        <View style={styles.detailTop}>
          <BackButton onPress={() => setScreen('list')} />
          <View style={styles.detailHead}>
            <Text style={styles.detailTitle}>{item.title}</Text>
            <View style={styles.badgeRow}>
              {item.status ? (
                <Text style={[styles.badge, styles.badgePending]}>
                  {item.status}
                </Text>
              ) : null}
              {item.missionType ? (
                <Text style={[styles.badge, styles.badgeType]}>
                  {item.missionType === 'Événementiel'
                    ? 'EVENT'
                    : item.missionType}
                </Text>
              ) : null}
              {code ? (
                <Text style={[styles.badge, styles.badgeCode]}>{code}</Text>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>Informations générales</Text>
          </View>
          <InfoRow label="Nom" value={item.title} />
          <InfoRow
            label="Adresse"
            value={
              item.differentAddress ? item.differentAddressText : item.address
            }
          />
          <InfoRow label="Site" value={clientName} />
          <InfoRow label="Ville" value={clientName} />
          <InfoRow
            label="Début"
            value={`${dateValue(item.startDate)} à ${
              item.startTime || '—'
            }`}
          />
          <InfoRow
            label="Fin"
            value={`${dateValue(item.endDate)} à ${item.endTime || '—'}`}
          />
          <InfoRow label="Type mission" value={item.missionType} />
          <InfoRow
            label="Types événement"
            value={item.events
              .map(event => event.type)
              .filter(Boolean)
              .join(', ')}
          />
          <InfoRow label="Posté par" value={posterName} />
          {item.comments ? (
            <View style={styles.commentBox}>
              <MessageSquare
                size={11}
                color={colors.orangeDark}
                style={styles.commentIcon}
              />
              <Text style={styles.commentText}>{item.comments}</Text>
            </View>
          ) : null}
        </View>

        {item.events.map((event, eventIndex) => {
          const clientStart = event.clientStart || item.startTime;
          const clientEnd = event.clientEnd || item.endTime;
          return (
            <View key={eventIndex} style={styles.card}>
              <View style={styles.cardHead}>
                <Text style={styles.cardTitle}>
                  {event.type || 'Postes à pourvoir'}
                </Text>
                <Text style={styles.countBadge}>
                  {event.jobs.length} poste{event.jobs.length > 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.clientHours}>
                <Clock size={11} color="#888" />
                <Text style={styles.clientHoursText}>
                  Horaires client : {clientStart || '—'} → {clientEnd || '—'}
                </Text>
              </View>
              {event.jobs.map((job, jobIndex) => {
                const from = job.departure || clientStart;
                const to = job.arrival || clientEnd;
                const duration = durationLabel(from, to);
                return (
                  <View key={jobIndex} style={styles.jobRow}>
                    <View style={styles.jobName}>
                      <Text style={styles.jobNameText}>
                        {job.qualification || 'Poste à définir'}
                      </Text>
                      <Text style={styles.jobCode}>
                        {(job.qualification || 'Poste').toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.jobQty}>
                      <Users size={11} color="#888" />
                      <Text style={styles.jobQtyText}>{job.quantity}</Text>
                    </View>
                    <View style={styles.jobTimes}>
                      <View style={styles.timeBadge}>
                        <Clock size={10} color="#1565C0" />
                        <Text style={styles.timeBadgeText}>
                          {from || '—'} → {to || '—'}
                          {duration ? ` · ${duration}` : ''}
                        </Text>
                      </View>
                      {job.breakEnabled ? (
                        <View style={styles.pauseBadge}>
                          <Text style={styles.pauseBadgeText}>
                            Pause {job.breakStart || '—'} →{' '}
                            {job.breakEnd || '—'}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>Langues requises</Text>
          </View>
          <View style={styles.langPillRow}>
            {item.languages.length ? (
              item.languages.map(language => (
                <Text key={language} style={styles.langPill}>
                  {languageCodes[language] || language}
                </Text>
              ))
            ) : (
              <Text style={styles.mutedText}>Aucune langue spécifiée.</Text>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>Pièces jointes</Text>
          </View>
          <Text style={styles.mutedText}>
            {item.files.map(file => file.name).join(', ') ||
              'Aucune pièce jointe.'}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>Tarification</Text>
          </View>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>{code || 'Prestation'}</Text>
              <Text style={styles.priceSub}>
                de {item.startTime || '—'} à {item.endTime || '—'}
              </Text>
            </View>
            <View style={styles.priceRight}>
              <Text style={styles.priceValue}>0.00 €</Text>
              <Text style={styles.priceCaption}>HT / prestation</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  function renderConversationModal() {
    if (!conversationOpen || !selectedMission) {
      return null;
    }
    const item = selectedMission;
    const from = item.startTime || '—';
    const to = item.endTime || '—';

    return (
      <Modal
        animationType="slide"
        onRequestClose={() => setConversationOpen(false)}
        transparent
        visible
      >
        <View style={styles.overlay}>
          <Pressable
            accessibilityLabel="Fermer la conversation"
            onPress={() => setConversationOpen(false)}
            style={styles.overlayScrim}
          />
          <View style={styles.convModal}>
            <View style={styles.convHeader}>
              <View style={styles.convAvatar}>
                <Text style={styles.convAvatarText}>
                  {initials(posterName)}
                </Text>
              </View>
              <Text numberOfLines={1} style={styles.convName}>
                {item.title}
              </Text>
              <Pressable
                accessibilityLabel="Fermer"
                accessibilityRole="button"
                onPress={() => setConversationOpen(false)}
                style={styles.convClose}
              >
                <X size={16} color="#888" />
              </Pressable>
            </View>

            <View style={styles.convTabs}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  selected: conversationTab === 'conversation',
                }}
                onPress={() => setConversationTab('conversation')}
                style={[
                  styles.convTab,
                  conversationTab === 'conversation' && styles.convTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.convTabText,
                    conversationTab === 'conversation' &&
                      styles.convTabTextActive,
                  ]}
                >
                  Conversation
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: conversationTab === 'prestation' }}
                onPress={() => setConversationTab('prestation')}
                style={[
                  styles.convTab,
                  conversationTab === 'prestation' && styles.convTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.convTabText,
                    conversationTab === 'prestation' &&
                      styles.convTabTextActive,
                  ]}
                >
                  Prestation
                </Text>
              </Pressable>
            </View>

            {conversationTab === 'conversation' ? (
              <>
                <ScrollView style={styles.convBody}>
                  {item.messages.length ? (
                    item.messages.map(message => (
                      <View key={message.id} style={styles.convMessageMine}>
                        <Text style={styles.convMessageTextMine}>
                          {message.text}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.convEmpty}>
                      <MessageSquare size={40} color="#DDD" />
                      <Text style={styles.convEmptyTitle}>Aucun message</Text>
                      <Text style={styles.convEmptySub}>
                        Écrivez votre message ci-dessous.
                      </Text>
                    </View>
                  )}
                </ScrollView>
                <View style={styles.convComposer}>
                  <TextInput
                    accessibilityLabel="Votre message"
                    multiline
                    onChangeText={setMessageDraft}
                    placeholder="Votre message..."
                    placeholderTextColor="#AAA"
                    style={styles.convComposerInput}
                    value={messageDraft}
                  />
                  <Pressable
                    accessibilityLabel="Envoyer le message"
                    accessibilityRole="button"
                    disabled={!messageDraft.trim()}
                    onPress={sendMessage}
                    style={[
                      styles.convSend,
                      !messageDraft.trim() && styles.convSendDisabled,
                    ]}
                  >
                    <Send
                      size={16}
                      color={messageDraft.trim() ? colors.white : '#BBB'}
                    />
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={styles.convBody}>
                <View style={styles.convInfoSection}>
                  <Text style={styles.convInfoTitle}>Prestation</Text>
                  <ConvInfoRow
                    first
                    icon={<FileText size={14} color={colors.orange} />}
                    label="Nom"
                    value={item.title}
                  />
                  <ConvInfoRow
                    icon={<CalendarDays size={14} color={colors.orange} />}
                    label="Date & heure"
                    value={`${shortDate(item.startDate)} · ${from} - ${to}`}
                  />
                  <ConvInfoRow
                    icon={<Users size={14} color={colors.orange} />}
                    label="Staff"
                    value={`0 / ${missionStaff(item)} staff`}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  function renderCancelModal() {
    if (!cancelTarget) {
      return null;
    }
    return (
      <Modal
        animationType="slide"
        onRequestClose={() => setCancelTarget(null)}
        transparent
        visible
      >
        <View style={styles.overlay}>
          <Pressable
            accessibilityLabel="Fermer"
            onPress={() => setCancelTarget(null)}
            style={styles.overlayScrim}
          />
          <View style={styles.cancelModal}>
            <Text style={styles.cancelTitle}>Annuler la mission</Text>
            <Text style={styles.cancelText}>
              <Text style={styles.cancelStrong}>{cancelTarget.title}</Text> —
              Les extras et admins seront notifiés.
            </Text>
            <Text style={styles.label}>Motif d’annulation *</Text>
            <TextInput
              accessibilityLabel="Motif d’annulation"
              multiline
              onChangeText={setCancelReason}
              placeholder="Ex: Événement reporté, contraintes budgétaires..."
              placeholderTextColor="#BBB"
              style={[styles.input, styles.multilineInput, styles.cancelInput]}
              value={cancelReason}
            />
            <View style={styles.cancelButtons}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setCancelTarget(null)}
                style={styles.cancelBack}
              >
                <Text style={styles.cancelBackText}>Retour</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={confirmCancel}
                style={styles.cancelConfirm}
              >
                <Text style={styles.cancelConfirmText}>Confirmer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <>
      {screen === 'form'
        ? renderForm()
        : screen === 'detail'
        ? renderDetail()
        : renderList()}
      {renderConversationModal()}
      {renderCancelModal()}
    </>
  );
}
