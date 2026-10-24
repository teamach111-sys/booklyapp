import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Heart,
  MapPin,
  Menu,
  MessageCircle,
  Plus,
  UserRound,
  Users,
  X,
} from 'lucide-react-native';
import {
  clientContentStyles as contentStyles,
  clientLayoutStyles as layoutStyles,
  clientNavigationStyles as navigationStyles,
  colors,
} from '../../styles';

const sections = [
  { key: 'profile', label: 'Profil', icon: UserRound },
  { key: 'coOwners', label: 'Co-propriétaires', icon: Users },
  { key: 'employees', label: 'Collaborateurs', icon: Users },
  { key: 'sites', label: 'Sites', icon: MapPin },
  { key: 'services', label: 'Prestations', icon: BriefcaseBusiness },
  { key: 'favorites', label: 'Mes favoris', icon: Heart },
  { key: 'calendar', label: 'Calendrier', icon: CalendarDays },
  { key: 'invoices', label: 'Factures', icon: FileText },
  { key: 'messages', label: 'Messages', icon: MessageCircle },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'history', label: 'Historique', icon: Clock3 },
];

const bottomSections = ['services', 'calendar', 'messages', 'profile'];

const profileFields = {
  personal: [
    ['firstName', 'Prénom'],
    ['lastName', 'Nom'],
    ['email', 'Email'],
    ['phone', 'Téléphone'],
  ],
  company: [
    ['company', 'Raison sociale'],
    ['siret', 'SIRET'],
    ['address', 'Adresse de siège'],
    ['vat', 'N° TVA'],
  ],
};

const emptyContent = {
  coOwners: {
    title: 'Aucun co-propriétaire',
    description: 'Ajoutez un compte avec un accès complet à votre entreprise.',
    action: 'Ajouter un co-propriétaire',
    placeholder: 'Adresse e-mail',
    icon: Users,
  },
  employees: {
    title: 'Aucun collaborateur pour ce site',
    description: 'Ajoutez jusqu’à 3 employés pour gérer ce site avec vous.',
    action: 'Ajouter un employé',
    placeholder: 'Nom du collaborateur',
    icon: Users,
  },
  sites: {
    title: 'Aucun site enregistré',
    description:
      'Ajoutez les établissements pour lesquels vous recherchez du personnel.',
    action: 'Ajouter un site',
    placeholder: 'Nom de l’établissement',
    icon: MapPin,
  },
  services: {
    title: 'Aucune prestation pour le moment',
    description:
      'Publiez votre premier besoin et trouvez rapidement un extra qualifié.',
    action: 'Créer une prestation',
    placeholder: 'Poste recherché',
    icon: BriefcaseBusiness,
  },
  favorites: {
    title: 'Votre liste est vide',
    description: 'Retrouvez ici les extras que vous ajoutez à vos favoris.',
    icon: Heart,
  },
  invoices: {
    title: 'Aucune facture disponible',
    description:
      'Vos factures apparaîtront ici après la réalisation de vos prestations.',
    icon: FileText,
  },
  messages: {
    title: 'Aucune conversation',
    description: 'Vos échanges avec les extras apparaîtront ici.',
    icon: MessageCircle,
  },
  notifications: {
    title: 'Tout est à jour',
    description: 'Vous n’avez aucune nouvelle notification.',
    icon: Bell,
  },
  history: {
    title: 'Aucune prestation passée',
    description:
      'Les missions terminées seront conservées dans votre historique.',
    icon: Clock3,
  },
};

function ActionButton({ title, onPress, secondary = false, icon }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={
        secondary ? contentStyles.secondaryButton : contentStyles.actionButton
      }
    >
      {icon || null}
      <Text
        style={
          secondary
            ? contentStyles.secondaryButtonText
            : contentStyles.actionButtonText
        }
      >
        {title}
      </Text>
    </Pressable>
  );
}

function SectionHeading({ title, aside }) {
  return (
    <View style={contentStyles.sectionHeading}>
      <Text style={contentStyles.sectionTitle}>{title}</Text>
      {aside ? <Text style={contentStyles.sectionAside}>{aside}</Text> : null}
    </View>
  );
}

function DataCard({ title, icon: Icon, children }) {
  return (
    <View style={contentStyles.card}>
      <View style={contentStyles.cardHeader}>
        <View style={contentStyles.cardIcon}>
          <Icon size={18} color={colors.orangeDark} />
        </View>
        <Text style={contentStyles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function EmptyState({ title, description, icon: Icon, action }) {
  return (
    <View style={contentStyles.emptyState}>
      <View style={contentStyles.emptyIcon}>
        <Icon size={23} color={colors.orangeDark} />
      </View>
      <Text style={contentStyles.emptyTitle}>{title}</Text>
      <Text style={contentStyles.emptyDescription}>{description}</Text>
      {action || null}
    </View>
  );
}

function ClientScreen() {
  const [activeSection, setActiveSection] = useState('profile');
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    siret: '',
    address: '',
    vat: '',
  });
  const [collections, setCollections] = useState({
    coOwners: [],
    employees: [],
    sites: [],
    services: [],
  });
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

  const currentSection =
    sections.find(section => section.key === activeSection) || sections[0];
  const sectionDetails = emptyContent[activeSection];
  const showCreateForm = creating && Boolean(sectionDetails?.action);

  function selectSection(key) {
    setActiveSection(key);
    setMenuOpen(false);
    setCreating(false);
    setDraft('');
  }

  function addCollectionItem() {
    const value = draft.trim();
    if (!value || !collections[activeSection]) {
      return;
    }
    setCollections(current => ({
      ...current,
      [activeSection]: [...current[activeSection], value],
    }));
    setDraft('');
    setCreating(false);
  }

  function renderProfileRows(fields) {
    return fields.map(([key, label], index) => (
      <View
        key={key}
        style={[
          contentStyles.row,
          index === fields.length - 1 && contentStyles.rowLast,
        ]}
      >
        <Text style={contentStyles.rowLabel}>{label}</Text>
        {editingProfile ? (
          <TextInput
            accessibilityLabel={label}
            onChangeText={value =>
              setProfile(current => ({ ...current, [key]: value }))
            }
            placeholder="À renseigner"
            placeholderTextColor={colors.muted}
            style={[contentStyles.field, contentStyles.profileField]}
            value={profile[key]}
          />
        ) : (
          <Text style={contentStyles.rowValue}>
            {profile[key] || 'À renseigner'}
          </Text>
        )}
      </View>
    ));
  }

  function renderProfile() {
    return (
      <>
        <DataCard title="Informations personnelles" icon={UserRound}>
          {renderProfileRows(profileFields.personal)}
        </DataCard>
        <DataCard title="Informations de l’entreprise" icon={Building2}>
          {renderProfileRows(profileFields.company)}
        </DataCard>
        <DataCard title="Préférences" icon={BriefcaseBusiness}>
          <View style={contentStyles.row}>
            <Text style={contentStyles.rowLabel}>Tenue exigée par défaut</Text>
            <Text style={contentStyles.rowValue}>À renseigner</Text>
          </View>
          <View style={[contentStyles.row, contentStyles.rowLast]}>
            <Text style={contentStyles.rowLabel}>
              Conditions de facturation
            </Text>
            <Text style={contentStyles.rowValue}>À renseigner</Text>
          </View>
        </DataCard>
        <ActionButton
          title={editingProfile ? 'Enregistrer les modifications' : 'Modifier'}
          onPress={() => setEditingProfile(current => !current)}
          icon={
            editingProfile ? <Check size={17} color={colors.white} /> : null
          }
        />
      </>
    );
  }

  function renderCollection() {
    const Icon = sectionDetails.icon;
    const entries = collections[activeSection] || [];
    const isServices = activeSection === 'services';

    return (
      <View style={contentStyles.section}>
        {isServices ? (
          <View style={contentStyles.card}>
            <View style={contentStyles.sectionHeading}>
              <Text style={contentStyles.cardTitle}>Mes prestations</Text>
              <View style={contentStyles.badge}>
                <Text style={contentStyles.badgeText}>
                  {entries.length} au total
                </Text>
              </View>
            </View>
          </View>
        ) : null}
        <View style={contentStyles.card}>
          {entries.length ? (
            entries.map((entry, index) => (
              <View
                key={`${entry}-${index}`}
                style={[
                  contentStyles.listItem,
                  index === entries.length - 1 && contentStyles.listItemLast,
                ]}
              >
                <View style={contentStyles.listItemIcon}>
                  <Icon size={18} color={colors.orangeDark} />
                </View>
                <View style={contentStyles.listItemCopy}>
                  <Text style={contentStyles.listItemTitle}>{entry}</Text>
                  <Text style={contentStyles.listItemDescription}>
                    {isServices ? 'Brouillon' : 'Ajouté à votre espace'}
                  </Text>
                </View>
                <ChevronRight size={17} color={colors.muted} />
              </View>
            ))
          ) : (
            <EmptyState
              title={sectionDetails.title}
              description={sectionDetails.description}
              icon={Icon}
            />
          )}
          {showCreateForm ? (
            <View style={contentStyles.form}>
              <TextInput
                accessibilityLabel={sectionDetails.placeholder}
                autoCapitalize="sentences"
                onChangeText={setDraft}
                onSubmitEditing={addCollectionItem}
                placeholder={sectionDetails.placeholder}
                placeholderTextColor={colors.muted}
                returnKeyType="done"
                style={contentStyles.field}
                value={draft}
              />
              <View style={contentStyles.formActions}>
                <ActionButton
                  title="Annuler"
                  secondary
                  onPress={() => {
                    setCreating(false);
                    setDraft('');
                  }}
                />
                <View style={contentStyles.formActionExpand}>
                  <ActionButton
                    title="Ajouter"
                    onPress={addCollectionItem}
                    icon={<Check size={16} color={colors.white} />}
                  />
                </View>
              </View>
            </View>
          ) : null}
          {!showCreateForm && sectionDetails.action ? (
            <ActionButton
              title={entries.length ? 'Ajouter' : sectionDetails.action}
              onPress={() => setCreating(true)}
              icon={<Plus size={17} color={colors.white} />}
            />
          ) : null}
        </View>
      </View>
    );
  }

  function renderCalendar() {
    const today = new Date();
    const weekStart = new Date(today);
    const dayOfWeek = (today.getDay() + 6) % 7;
    weekStart.setDate(today.getDate() - dayOfWeek);
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      return date;
    });

    return (
      <View style={contentStyles.section}>
        <SectionHeading title="Cette semaine" />
        <View style={contentStyles.calendarWeek}>
          {days.map(date => {
            const isSelected = date.toDateString() === selectedDate;
            return (
              <Pressable
                key={date.toDateString()}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setSelectedDate(date.toDateString())}
                style={[
                  contentStyles.calendarDay,
                  isSelected && contentStyles.calendarDaySelected,
                ]}
              >
                <Text
                  style={[
                    contentStyles.calendarDayLabel,
                    isSelected && contentStyles.calendarDayTextSelected,
                  ]}
                >
                  {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                </Text>
                <Text
                  style={[
                    contentStyles.calendarDayNumber,
                    isSelected && contentStyles.calendarDayTextSelected,
                  ]}
                >
                  {date.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View style={contentStyles.card}>
          <EmptyState
            title="Aucune prestation prévue"
            description="Vos prochaines missions apparaîtront dans ce calendrier."
            icon={CalendarDays}
          />
        </View>
      </View>
    );
  }

  function renderContent() {
    if (activeSection === 'profile') {
      return renderProfile();
    }
    if (activeSection === 'calendar') {
      return renderCalendar();
    }
    return renderCollection();
  }

  return (
    <SafeAreaView style={layoutStyles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={layoutStyles.screen}>
        <View style={layoutStyles.header}>
          <Pressable
            accessibilityLabel="Ouvrir le menu"
            accessibilityRole="button"
            onPress={() => setMenuOpen(true)}
            style={layoutStyles.headerAction}
          >
            <Menu size={21} color={colors.brown} />
          </Pressable>
          <Text style={layoutStyles.brand}>bookly</Text>
          <Pressable
            accessibilityLabel="Afficher les notifications"
            accessibilityRole="button"
            onPress={() => selectSection('notifications')}
            style={layoutStyles.headerAction}
          >
            <Bell size={19} color={colors.brown} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={layoutStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={layoutStyles.pageHeading}>
            <Text style={layoutStyles.pageEyebrow}>Espace client</Text>
            <Text style={layoutStyles.pageTitle}>{currentSection.label}</Text>
            <Text style={layoutStyles.pageDescription}>
              Gérez votre entreprise et vos prestations Bookly.
            </Text>
          </View>
          {renderContent()}
        </ScrollView>

        <View style={navigationStyles.bottomNavigation}>
          {bottomSections.map(key => {
            const section = sections.find(item => item.key === key);
            const Icon = section.icon;
            const active = activeSection === key;
            return (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => selectSection(key)}
                style={[
                  navigationStyles.bottomTab,
                  active && navigationStyles.bottomTabActive,
                ]}
              >
                <Icon
                  size={19}
                  color={active ? colors.orangeDark : colors.muted}
                />
                <Text
                  style={[
                    navigationStyles.bottomTabText,
                    active && navigationStyles.bottomTabTextActive,
                  ]}
                >
                  {section.label}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ouvrir le menu des rubriques"
            onPress={() => setMenuOpen(true)}
            style={navigationStyles.bottomTab}
          >
            <Menu size={19} color={colors.muted} />
            <Text style={navigationStyles.bottomTabText}>Menu</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        animationType="slide"
        onRequestClose={() => setMenuOpen(false)}
        transparent
        visible={menuOpen}
      >
        <View style={layoutStyles.drawerBackdrop}>
          <Pressable
            accessibilityLabel="Fermer le menu"
            onPress={() => setMenuOpen(false)}
            style={layoutStyles.drawerScrim}
          />
          <View style={layoutStyles.drawer}>
            <View style={layoutStyles.drawerHeader}>
              <View style={layoutStyles.drawerIdentity}>
                <View style={layoutStyles.drawerAvatar}>
                  <UserRound size={20} color={colors.orangeDark} />
                </View>
                <View>
                  <Text style={layoutStyles.drawerTitle}>Espace client</Text>
                  <Text style={layoutStyles.drawerSubtitle}>
                    Gérez votre activité
                  </Text>
                </View>
              </View>
              <Pressable
                accessibilityLabel="Fermer le menu"
                accessibilityRole="button"
                onPress={() => setMenuOpen(false)}
                style={layoutStyles.headerAction}
              >
                <X size={19} color={colors.brown} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={layoutStyles.drawerList}>
              {sections.map(section => {
                const Icon = section.icon;
                const active = activeSection === section.key;
                return (
                  <Pressable
                    key={section.key}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => selectSection(section.key)}
                    style={[
                      layoutStyles.drawerItem,
                      active && layoutStyles.drawerItemActive,
                    ]}
                  >
                    <Icon
                      size={18}
                      color={active ? colors.orangeDark : colors.muted}
                    />
                    <Text
                      style={[
                        layoutStyles.drawerItemText,
                        active && layoutStyles.drawerItemTextActive,
                      ]}
                    >
                      {section.label}
                    </Text>
                    {active ? (
                      <ChevronRight size={16} color={colors.orangeDark} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default ClientScreen;
