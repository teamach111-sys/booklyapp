import { useState } from 'react';
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
const sections = [
  { key: 'profile', label: 'Profil', icon: UserRound },
  { key: 'prestations', label: 'Prestations', icon: BriefcaseBusiness, badge: 1 },
  { key: 'unavailability', label: 'Indisponibilités', icon: Ban },
  { key: 'calendar', label: 'Calendrier', icon: CalendarDays },
  { key: 'invoices', label: 'Mes factures', icon: Receipt },
  { key: 'messages', label: 'Messages', icon: MessageCircle },
  { key: 'notifications', label: 'Notifications', icon: Bell, badge: 7 },
];

const bottomSections = ['prestations', 'calendar', 'messages', 'profile'];

export default function ExtrasScreen({ navigation }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [menuOpen, setMenuOpen] = useState(false);

  function selectSection(key) {
    setActiveSection(key);
    setMenuOpen(false);
  }

  function renderContent() {
    switch (activeSection) {
      case 'profile':
        return <Profile />;
      case 'prestations':
        return <Mission />;
      case 'unavailability':
        return <Disponibilite />;
      case 'calendar':
        return <Calendrier />;
      case 'invoices':
        return <ExtraFactures />;
      case 'messages':
        return <Messages />;
      case 'notifications':
        return <Notifications />;
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
                onPress={() => navigation?.navigate('Login')}
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
