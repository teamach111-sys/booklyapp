import { useMemo, useState } from 'react';
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
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  Heart,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Plus,
  UserRound,
  Users,
  X,
} from 'lucide-react-native';
import { clientShellStylesByBrand } from './theme/clientStyles';
import { ClientThemeProvider, useClientTheme } from './theme/ClientThemeContext';
import Calendrier from './components/Calendrier';
import Profile from './components/Profile';
import Prestations, { demoMissions } from './components/Prestations';
import Messages from './components/Messages';
import ClientCoOwners from './components/ClientCoOwners';
import ClientEmployees from './components/ClientEmployees';
import Espaces from './components/Espaces';
import Fav_extra from './components/Fav_extra';
import Factures from './components/Factures';
import Notifications from './components/Notifications';
import ClientHistorique from './components/ClientHistorique';

const createSections = brandName => [
  { key: 'profile', label: 'Profil', icon: UserRound },
  {
    key: 'coOwners',
    label: 'Co-propriétaires',
    icon: Users,
    description:
      'Gérez les comptes ayant un accès complet à votre entreprise, comme vous.',
  },
  {
    key: 'employees',
    label: 'Collaborateurs',
    icon: Users,
    description:
      'Gérez les comptes employés rattachés à ce site. Maximum 3 par site.',
  },
  {
    key: 'sites',
    label: 'Sites',
    icon: MapPin,
    description:
      'Gérez les espaces et sites rattachés à votre entreprise.',
  },
  { key: 'services', label: 'Prestations', icon: BriefcaseBusiness },
  {
    key: 'favorites',
    label: 'Mes favoris',
    icon: Heart,
    description: 'Consultez les extras disponibles et gérez vos favoris.',
  },
  { key: 'calendar', label: 'Calendrier', icon: CalendarDays },
  {
    key: 'invoices',
    label: 'Factures',
    icon: FileText,
    description: `Consultez et téléchargez vos factures ${brandName}.`,
  },
  { key: 'messages', label: 'Messages', icon: MessageCircle },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Restez informé de vos missions, factures et actualités.',
  },
  {
    key: 'history',
    label: 'Historique',
    icon: Clock3,
    description: 'Consultez le journal des activités de votre compte.',
  },
];

const bottomSections = ['services', 'calendar', 'messages', 'profile'];

// Identity shown at the top of the drawer, matching the design sidebar.
const clientIdentity = {
  initials: 'C0',
  name: 'Client 02',
  company: 'Client Test 02',
  status: 'Actif',
};

// Sites offered by the drawer's active-site selector (design `space-section`).
const drawerSites = [
  { id: 'site-1', name: 'Dashboard Client 02', city: 'Ile de France' },
];

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
  const { partner } = useClientTheme();
  const contentStyles = clientShellStylesByBrand[partner].content;

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

function EmptyState({ title, description, icon: Icon, action }) {
  const { partner, colors } = useClientTheme();
  const contentStyles = clientShellStylesByBrand[partner].content;

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

function ClientDashboard({ navigation }) {
  const { partner, colors } = useClientTheme();
  const { layout: layoutStyles, navigation: navigationStyles, content: contentStyles } =
    clientShellStylesByBrand[partner];
  const sections = useMemo(() => createSections(colors.brandName), [colors.brandName]);

  const [activeSection, setActiveSection] = useState('profile');
  const [menuOpen, setMenuOpen] = useState(false);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [activeSiteId, setActiveSiteId] = useState(drawerSites[0].id);
  const [collections, setCollections] = useState({
    coOwners: [],
    employees: [],
    sites: [],
    services: [],
  });
  const [missions, setMissions] = useState(demoMissions);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState('');

  const currentSection =
    sections.find(section => section.key === activeSection) || sections[0];
  const activeSite =
    drawerSites.find(site => site.id === activeSiteId) || drawerSites[0];
  const sectionDetails = emptyContent[activeSection];
  const showCreateForm = creating && Boolean(sectionDetails?.action);

  function closeMenu() {
    setMenuOpen(false);
    setSpaceOpen(false);
  }

  function selectSection(key) {
    setActiveSection(key);
    setMenuOpen(false);
    setSpaceOpen(false);
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

  function renderContent() {
    if (activeSection === 'profile') {
      return <Profile />;
    }
    if (activeSection === 'calendar') {
      return <Calendrier />;
    }
    if (activeSection === 'services') {
      return <Prestations missions={missions} setMissions={setMissions} />;
    }
    if (activeSection === 'messages') {
      return <Messages />;
    }
    if (activeSection === 'coOwners') {
      return <ClientCoOwners />;
    }
    if (activeSection === 'employees') {
      return <ClientEmployees />;
    }
    if (activeSection === 'sites') {
      return <Espaces />;
    }
    if (activeSection === 'favorites') {
      return <Fav_extra />;
    }
    if (activeSection === 'invoices') {
      return <Factures />;
    }
    if (activeSection === 'notifications') {
      return <Notifications />;
    }
    if (activeSection === 'history') {
      return <ClientHistorique />;
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
          <Text style={layoutStyles.brand}>{colors.brandLabel}</Text>
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
              {currentSection.description ||
                `Gérez votre entreprise et vos prestations ${colors.brandName}.`}
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
        onRequestClose={closeMenu}
        transparent
        visible={menuOpen}
      >
        <Pressable
          accessibilityLabel="Fermer le menu"
          accessibilityRole="button"
          onPress={closeMenu}
          style={layoutStyles.drawerBackdrop}
        >
          <View pointerEvents="none" style={layoutStyles.drawerScrim} />
          <Pressable
            accessibilityRole="none"
            onPress={event => event.stopPropagation()}
            style={layoutStyles.drawer}
          >
            <View style={layoutStyles.drawerHeader}>
              <Pressable
                accessibilityLabel="Fermer le menu"
                accessibilityRole="button"
                onPress={closeMenu}
                style={layoutStyles.drawerClose}
              >
                <X size={18} color={colors.white} />
              </Pressable>
              <Text style={layoutStyles.drawerBrand}>{colors.brandLabel}</Text>
              <View style={layoutStyles.drawerAvatar}>
                <Text style={layoutStyles.drawerAvatarText}>
                  {clientIdentity.initials}
                </Text>
              </View>
              <Text style={layoutStyles.drawerName}>{clientIdentity.name}</Text>
              <Text style={layoutStyles.drawerRole}>
                {clientIdentity.company} · {colors.brand}
              </Text>
              <View style={layoutStyles.drawerStatus}>
                <View style={layoutStyles.drawerStatusDot} />
                <Text style={layoutStyles.drawerStatusText}>
                  {clientIdentity.status}
                </Text>
              </View>
            </View>
            <View style={layoutStyles.drawerSpace}>
              <Text style={layoutStyles.drawerSpaceLabel}>Site actif</Text>
              <Pressable
                accessibilityLabel="Changer de site"
                accessibilityRole="button"
                accessibilityState={{ expanded: spaceOpen }}
                onPress={() => setSpaceOpen(true)}
                style={layoutStyles.drawerSpaceTrigger}
              >
                <View style={layoutStyles.drawerSpaceDot} />
                <Text numberOfLines={1} style={layoutStyles.drawerSpaceName}>
                  {activeSite.name}
                </Text>
                <Text style={layoutStyles.drawerSpaceCity}>
                  {activeSite.city}
                </Text>
                <ChevronDown
                  size={14}
                  color="rgba(255,255,255,0.7)"
                  style={
                    spaceOpen ? layoutStyles.drawerSpaceChevronOpen : undefined
                  }
                />
              </Pressable>
              <Modal
                animationType="fade"
                onRequestClose={() => setSpaceOpen(false)}
                transparent
                visible={spaceOpen}
              >
                <Pressable
                  accessibilityLabel="Fermer la liste"
                  accessibilityRole="button"
                  onPress={() => setSpaceOpen(false)}
                  style={layoutStyles.spacePickerBackdrop}
                >
                  <Pressable
                    onPress={event => event.stopPropagation()}
                    style={layoutStyles.spacePickerSheet}
                  >
                    <Text style={layoutStyles.spacePickerTitle}>Site actif</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {drawerSites.map(site => {
                        const isActive = site.id === activeSite.id;
                        return (
                          <Pressable
                            key={site.id}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isActive }}
                            onPress={() => {
                              setActiveSiteId(site.id);
                              setSpaceOpen(false);
                            }}
                            style={layoutStyles.spacePickerOption}
                          >
                            <View style={layoutStyles.spacePickerOptionInfo}>
                              <Text
                                numberOfLines={1}
                                style={[
                                  layoutStyles.spacePickerOptionName,
                                  isActive &&
                                    layoutStyles.spacePickerOptionNameActive,
                                ]}
                              >
                                {site.name}
                              </Text>
                              <Text
                                style={layoutStyles.spacePickerOptionCity}
                              >
                                {site.city}
                              </Text>
                            </View>
                            {isActive ? (
                              <Check size={16} color={colors.orange} />
                            ) : null}
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </Pressable>
                </Pressable>
              </Modal>
            </View>
            <ScrollView
              contentContainerStyle={layoutStyles.drawerList}
              style={layoutStyles.drawerScroll}
            >
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
                      color={active ? colors.white : 'rgba(255,255,255,0.7)'}
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
                      <ChevronRight size={16} color={colors.white} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
            <View style={layoutStyles.drawerFooter}>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation?.navigate('Login')}
                style={layoutStyles.drawerLogout}
              >
                <LogOut size={18} color="rgba(255,255,255,0.75)" />
                <Text style={layoutStyles.drawerLogoutText}>Déconnexion</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

export default function ClientScreen({ route, navigation }) {
  return (
    <ClientThemeProvider partner={route?.params?.partner}>
      <ClientDashboard navigation={navigation} />
    </ClientThemeProvider>
  );
}
