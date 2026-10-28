/*
### Screen: Shared Billing : ExtraClientRates
**Associated Route/Context**: `Shared Component across Dashboards`  
**Total Discovered Backend Calls**: 5

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`ExtraClientRates.jsx:17`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/ExtraClientRates.jsx#L17) | User Action Handler (`ExtraClientRates`) | `ExtraClientRates` | `GET` | `/admin/extra/${extraId}/client-rates` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`ExtraClientRates.jsx:26`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/ExtraClientRates.jsx#L26) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/admin/clients` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
| [`ExtraClientRates.jsx:32`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/ExtraClientRates.jsx#L32) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/admin/extra/${extraId}/rates` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`ExtraClientRates.jsx:43`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/ExtraClientRates.jsx#L43) | User Action Handler (`handleAdd`) | `handleAdd` | `PUT` | `/admin/extra/${extraId}/client-rates/${form.client_id}` | `{` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`ExtraClientRates.jsx:60`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/ExtraClientRates.jsx#L60) | Delete / Cancel Button (`handleDelete`) | `handleDelete` | `DELETE` | `/admin/extra/${extraId}/client-rates/${rate.id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |


*/

/*
### Screen: Shared Billing : ClientBillingSettings
**Associated Route/Context**: `Shared Component across Dashboards`  
**Total Discovered Backend Calls**: 2

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`ClientBillingSettings.jsx:17`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/ClientBillingSettings.jsx#L17) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/admin/clients/${clientId}/billing` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
| [`ClientBillingSettings.jsx:44`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/billing/ClientBillingSettings.jsx#L44) | Form Submit / Create Button (`handleSave`) | `handleSave` | `PUT` | `/admin/clients/${clientId}/billing` | `{` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |


*/

/*
### Screen: Inscription Client / Établissement
**Associated Route/Context**: `/inscription/client`  
**Total Discovered Backend Calls**: 2

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`Clients.jsx:123`](file:///C:/Users/Workspace/staffly-frontend/src/pages/inscription/Clients.jsx#L123) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `/envoyerVerficationEmail` | `{` | Bearer token (localStorage) via clientAxios interceptor | Confirmed |
| [`Clients.jsx:103`](file:///C:/Users/Workspace/staffly-frontend/src/pages/inscription/Clients.jsx#L103) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `${import.meta.env.VITE_API_URL}/register/client` | `None` | Public (No auth) | Confirmed |


*/

/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Client Portal : Shell & Navigation
 * **Associated Route/Context**: `/client`  
 * **Total Discovered Backend Calls**: 3
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Client.jsx:166`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/Client.jsx#L166) | Background Polling Interval (`poll`) | `poll` | `GET` | `/notifications/unread-count?site_id=${selectedSpace.id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Client.jsx:181`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/Client.jsx#L181) | Background Polling Interval (`poll`) | `poll` | `GET` | `/messages/conversations` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Client.jsx:193`](file:///C:/Users/Workspace/staffly-frontend/src/pages/client/Client.jsx#L193) | Auth Action Button (`handleLogout`) | `handleLogout` | `POST` | `/logout` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * 
 * =====================================================================
 */
import { useEffect, useMemo, useState } from 'react';
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
import { SitesProvider, useClientSites } from './state/SitesContext';
import { useAuth } from '../../context/AuthContext';
import clientService from '../../api/clientService';
import authService from '../../api/authService';
import { getToken } from '../../utils/Authstorage';
import Calendrier from './components/Calendrier';
import Profile from './components/Profile';
import Prestations from './components/Prestations';
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

// Sites offered by the drawer's active-site selector come from
// SitesProvider (GET /client/profile -> spaces), not from demo data.

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
  const { user, signOut } = useAuth();
  const { selectableSites, activeSite, setActiveSiteId } = useClientSites();
  const { layout: layoutStyles, navigation: navigationStyles, content: contentStyles } =
    clientShellStylesByBrand[partner];
  const sections = useMemo(() => createSections(colors.brandName), [colors.brandName]);

  const [activeSection, setActiveSection] = useState('profile');
  const [menuOpen, setMenuOpen] = useState(false);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [collections, setCollections] = useState({
    coOwners: [],
    employees: [],
    sites: [],
    services: [],
  });
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState('');

  const clientIdentity = useMemo(() => {
    const fn = user?.firstname || '';
    const ln = user?.name || '';
    const fullName = `${fn} ${ln}`.trim() || user?.email || 'Client';
    const comp =
      user?.client?.raison_sociale ||
      user?.raison_sociale ||
      user?.company ||
      'Mon entreprise';
    const inits = `${fn[0] || ''}${ln[0] || ''}`.toUpperCase() || 'CL';
    return {
      initials: inits,
      name: fullName,
      company: comp,
      status: 'Actif',
    };
  }, [user]);

  // Poll unread notifications count
  useEffect(() => {
    let mounted = true;
    const pollNotifs = async () => {
      try {
        const res = await clientService.getUnreadNotificationCount(activeSite?.id);
        if (mounted && res?.count !== undefined) {
          setUnreadNotifs(res.count);
        }
      } catch {}
    };
    pollNotifs();
    const interval = setInterval(pollNotifs, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [activeSite?.id]);

  // Poll unread messages count
  useEffect(() => {
    let mounted = true;
    const pollMessages = async () => {
      try {
        const res = await clientService.getConversations();
        if (mounted && Array.isArray(res)) {
          setUnreadMessages(
            res.reduce((sum, c) => sum + (c.unread_count || 0), 0),
          );
        }
      } catch {}
    };
    pollMessages();
    const interval = setInterval(pollMessages, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const currentSection =
    sections.find(section => section.key === activeSection) || sections[0];
  const sectionDetails = emptyContent[activeSection];
  const showCreateForm = creating && Boolean(sectionDetails?.action);

  function closeMenu() {
    setMenuOpen(false);
    setSpaceOpen(false);
  }

  // Clear the session before leaving: the login screen sends an authenticated
  // user straight back to a dashboard, so navigating without signing out just
  // bounces here again.
  async function handleLogout() {
    try {
      const token = getToken();
      if (token) {
        await authService.logout(token).catch(() => {});
      }
    } finally {
      await signOut();
      navigation?.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  }

  function selectSection(key) {
    setActiveSection(key);
    if (key === 'notifications') setUnreadNotifs(0);
    if (key === 'messages') setUnreadMessages(0);
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
      return <Prestations activeSite={activeSite} />;
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
            style={[layoutStyles.headerAction, { position: 'relative' }]}
          >
            <Bell size={19} color={colors.brown} />
            {unreadNotifs > 0 ? (
              <View
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: colors.orangeDark,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
                }}
              >
                <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '700' }}>
                  {unreadNotifs > 99 ? '99+' : unreadNotifs}
                </Text>
              </View>
            ) : null}
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
            const badgeCount = key === 'messages' ? unreadMessages : 0;
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
                <View style={{ position: 'relative' }}>
                  <Icon
                    size={19}
                    color={active ? colors.orangeDark : colors.muted}
                  />
                  {badgeCount > 0 ? (
                    <View
                      style={{
                        position: 'absolute',
                        top: -4,
                        right: -8,
                        minWidth: 15,
                        height: 15,
                        borderRadius: 7.5,
                        backgroundColor: colors.orangeDark,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 2,
                      }}
                    >
                      <Text style={{ color: '#FFF', fontSize: 9, fontWeight: '700' }}>
                        {badgeCount > 99 ? '99+' : badgeCount}
                      </Text>
                    </View>
                  ) : null}
                </View>
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
                  {activeSite?.name || 'Aucun site'}
                </Text>
                <Text style={layoutStyles.drawerSpaceCity}>
                  {activeSite?.city || activeSite?.region || ''}
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
                      {selectableSites.length === 0 ? (
                        <Text style={layoutStyles.spacePickerOptionCity}>
                          Aucun site actif. Ajoutez-en un depuis « Sites ».
                        </Text>
                      ) : null}
                      {selectableSites.map(site => {
                        const isActive = String(site.id) === String(activeSite?.id);
                        return (
                          <Pressable
                            key={site.id}
                            accessibilityLabel={`Site actif ${site.name}`}
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
                                {site.city || site.region}
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
                onPress={handleLogout}
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
  // Deep links and restored sessions arrive without the route param, so fall
  // back to the platform stored on the account before defaulting to bookly.
  const { user } = useAuth();
  const partner = route?.params?.partner ?? user?.platform_partner;

  return (
    <ClientThemeProvider partner={partner}>
      <SitesProvider>
        <ClientDashboard navigation={navigation} />
      </SitesProvider>
    </ClientThemeProvider>
  );
}
