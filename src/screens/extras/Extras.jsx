/*
### Screen: Inscription Extra (Sans Quiz)
**Associated Route/Context**: `/inscription/extra-non-quizz`  
**Total Discovered Backend Calls**: 3

| Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| [`Registernonquizz.jsx:217`](file:///C:/Users/Workspace/staffly-frontend/src/pages/inscription/Registernonquizz.jsx#L217) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `BASE_URL + '/qualifications/public` | `None` | Public (No auth) | Confirmed |
| [`Registernonquizz.jsx:260`](file:///C:/Users/Workspace/staffly-frontend/src/pages/inscription/Registernonquizz.jsx#L260) | User Action Handler (`handleNextFromStep0`) | `handleNextFromStep0` | `POST` | `BASE_URL + '/check-email` | `None` | Public (No auth) | Confirmed |
| [`Registernonquizz.jsx:318`](file:///C:/Users/Workspace/staffly-frontend/src/pages/inscription/Registernonquizz.jsx#L318) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `BASE_URL + '/extra/register` | `formData` | Public (No auth) | Confirmed |


*/

/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Extras Portal : Shell & Navigation
 * **Associated Route/Context**: `/extras`  
 * **Total Discovered Backend Calls**: 4
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Extras.jsx:80`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/Extras.jsx#L80) | Background Polling Interval (`poll`) | `poll` | `GET` | `/notifications/unread-count` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Extras.jsx:95`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/Extras.jsx#L95) | Data Fetch / Revalidation (`fetchBadges`) | `fetchBadges` | `GET` | `/extras/missions/matching` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Extras.jsx:110`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/Extras.jsx#L110) | Background Polling Interval (`poll`) | `poll` | `GET` | `/messages/conversations` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Extras.jsx:134`](file:///C:/Users/Workspace/staffly-frontend/src/pages/extras/Extras.jsx#L134) | Auth Action Button (`handleLogout`) | `handleLogout` | `POST` | `/logout` | `None` | Bearer token (Authstorage / localStorage) | Confirmed (Resolved Service Call) |
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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Ban,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  LogOut,
  Menu,
  MessageCircle,
  Receipt,
  UserRound,
  X,
} from 'lucide-react-native';
import { colors } from '../../styles';
import { extras as styles } from './styles';
import { useAuth } from '../../context/AuthContext';
import { fetchClient } from '../../api/fetchClient';
import authService from '../../api/authService';
import { getToken } from '../../utils/Authstorage';
import Calendrier from './components/Calendrier';
import Disponibilite from './components/Disponibilite';
import ExtraFactures from './components/ExtraFactures';
import Mission from './components/Mission';
import Messages from './components/Messages';
import Notifications from './components/Notifications';
import Profile from './components/Profile';

// Nav matches the design sidebar (src/pages/extras/Extras.css). Pages are
// placeholders for now — each renders its own "Espace extra" heading until the
// design is implemented.


const bottomSections = ['prestations', 'calendar', 'messages', 'profile'];

export default function ExtrasScreen({ navigation }) {
  const { signOut, user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [menuOpen, setMenuOpen] = useState(false);

  const [notifUnread, setNotifUnread] = useState(0);
  const [msgUnread, setMsgUnread] = useState(0);
  const [missionBadge, setMissionBadge] = useState(0);
  const [extraData, setExtraData] = useState(null);
  const [notifTarget, setNotifTarget] = useState(null);

  // Poll notifications count
  useEffect(() => {
    let mounted = true;
    const pollNotifs = async () => {
      try {
        const d = await fetchClient('/notifications/unread-count');
        if (mounted && d?.count !== undefined) {
          setNotifUnread(d.count);
        }
      } catch {}
    };
    pollNotifs();
    const interval = setInterval(pollNotifs, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Poll matching missions for badge
  useEffect(() => {
    let mounted = true;
    const pollMissions = async () => {
      try {
        const missions = await fetchClient('/extras/missions/matching');
        if (mounted && Array.isArray(missions)) {
          setMissionBadge(missions.length);
        }
      } catch {}
    };
    pollMissions();
    const interval = setInterval(pollMissions, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Poll unread messages
  useEffect(() => {
    let mounted = true;
    const pollMessages = async () => {
      try {
        const d = await fetchClient('/messages/conversations');
        if (mounted && Array.isArray(d)) {
          setMsgUnread(d.reduce((sum, item) => sum + (item.unread_count || 0), 0));
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

  // Load extra profile
  useEffect(() => {
    authService
      .getExtraProfile()
      .then(d => setExtraData(d))
      .catch(() => {});
  }, []);

  const sections = useMemo(
    () => [
      { key: 'profile', label: 'Profil', icon: UserRound },
      {
        key: 'prestations',
        label: 'Prestations',
        icon: BriefcaseBusiness,
        badge: missionBadge > 0 ? missionBadge : undefined,
      },
      { key: 'unavailability', label: 'Indisponibilités', icon: Ban },
      { key: 'calendar', label: 'Calendrier', icon: CalendarDays },
      { key: 'invoices', label: 'Mes factures', icon: Receipt },
      {
        key: 'messages',
        label: 'Messages',
        icon: MessageCircle,
        badge: msgUnread > 0 ? msgUnread : undefined,
      },
      {
        key: 'notifications',
        label: 'Notifications',
        icon: Bell,
        badge: notifUnread > 0 ? notifUnread : undefined,
      },
    ],
    [missionBadge, msgUnread, notifUnread],
  );

  function selectSection(key) {
    setActiveSection(key);
    setMenuOpen(false);
  }

  // "Voir la prestation" / "Voir la conversation" from the notifications page.
  function openNotificationTarget(target) {
    if (!target) return;
    setNotifTarget(target);
    selectSection('prestations');
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

  function renderContent() {
    switch (activeSection) {
      case 'profile':
        return <Profile />;
      case 'prestations':
        return (
          <Mission
            notifTarget={notifTarget}
            onNotifTargetHandled={() => setNotifTarget(null)}
          />
        );
      case 'unavailability':
        return <Disponibilite />;
      case 'calendar':
        return <Calendrier />;
      case 'invoices':
        return <ExtraFactures />;
      case 'messages':
        return <Messages />;
      case 'notifications':
        return <Notifications onGo={openNotificationTarget} />;
      default:
        return <Profile />;
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Ouvrir le menu"
            accessibilityRole="button"
            onPress={() => setMenuOpen(true)}
            style={styles.headerAction}
          >
            <Menu size={21} color={colors.brown} />
          </Pressable>
          <Text style={styles.brand}>bookly</Text>
          <Pressable
            accessibilityLabel="Afficher les notifications"
            accessibilityRole="button"
            onPress={() => selectSection('notifications')}
            style={styles.headerAction}
          >
            <Bell size={19} color={colors.brown} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scrollArea}
        >
          {renderContent()}
        </ScrollView>

        <View style={styles.bottomNavigation}>
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
                  styles.bottomTab,
                  active && styles.bottomTabActive,
                ]}
              >
                <View style={styles.bottomTabIconWrap}>
                  <Icon
                    size={19}
                    color={active ? colors.orangeDark : colors.muted}
                  />
                  {section.badge ? (
                    <View style={styles.bottomTabBadge}>
                      <Text style={styles.bottomTabBadgeText}>{section.badge}</Text>
                    </View>
                  ) : null}
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.bottomTabText,
                    active && styles.bottomTabTextActive,
                  ]}
                >
                  {section.label}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            accessibilityLabel="Ouvrir le menu des rubriques"
            accessibilityRole="button"
            onPress={() => setMenuOpen(true)}
            style={styles.bottomTab}
          >
            <Menu size={19} color={colors.muted} />
            <Text numberOfLines={1} style={styles.bottomTabText}>
              Menu
            </Text>
          </Pressable>
        </View>
      </View>

      <Modal
        animationType="slide"
        onRequestClose={() => setMenuOpen(false)}
        transparent
        visible={menuOpen}
      >
        <Pressable
          accessibilityLabel="Fermer le menu"
          accessibilityRole="button"
          onPress={() => setMenuOpen(false)}
          style={styles.drawerBackdrop}
        >
          <View pointerEvents="none" style={styles.drawerScrim} />
          <Pressable
            accessibilityRole="none"
            onPress={event => event.stopPropagation()}
            style={styles.drawer}
          >
            <View style={styles.drawerHeader}>
              <Pressable
                accessibilityLabel="Fermer le menu"
                accessibilityRole="button"
                onPress={() => setMenuOpen(false)}
                style={styles.drawerClose}
              >
                <X size={18} color={colors.white} />
              </Pressable>
              <Text style={styles.drawerBrand}>bookly</Text>
              <View style={styles.drawerAvatar}>
                <Text style={styles.drawerAvatarText}>EX</Text>
              </View>
              <Text style={styles.drawerName}>Espace extra</Text>
              <Text style={styles.drawerRole}>Extra · Bookly</Text>
              <View style={styles.drawerStatus}>
                <View style={styles.drawerStatusDot} />
                <Text style={styles.drawerStatusText}>Actif</Text>
              </View>
            </View>

            <ScrollView
              contentContainerStyle={styles.drawerList}
              style={styles.drawerScroll}
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
                      styles.drawerItem,
                      active && styles.drawerItemActive,
                    ]}
                  >
                    <Icon
                      size={18}
                      color={active ? colors.white : 'rgba(255,255,255,0.7)'}
                    />
                    <Text
                      style={[
                        styles.drawerItemText,
                        active && styles.drawerItemTextActive,
                      ]}
                    >
                      {section.label}
                    </Text>
                    {section.badge ? (
                      <View style={styles.drawerBadge}>
                        <Text style={styles.drawerBadgeText}>
                          {section.badge}
                        </Text>
                      </View>
                    ) : active ? (
                      <ChevronRight size={16} color={colors.white} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.drawerFooter}>
              <Pressable
                accessibilityRole="button"
                onPress={handleLogout}
                style={styles.logoutButton}
              >
                <LogOut size={18} color="rgba(255,255,255,0.75)" />
                <Text style={styles.logoutText}>Déconnexion</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
