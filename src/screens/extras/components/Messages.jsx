/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Shared Portal Component : Messages
 * **Associated Route/Context**: `Shared Component across Dashboards`  
 * **Total Discovered Backend Calls**: 9
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Messages.jsx:99`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L99) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/messages/contacts?tab=${tab}&search=${encodeURIComponent(search` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Messages.jsx:170`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L170) | Form Submit / Create Button (`submit`) | `submit` | `POST` | `/messages/report` | `form` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Messages.jsx:231`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L231) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/messages/discussion/${partner.id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Messages.jsx:243`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L243) | User Action Handler (`send`) | `send` | `POST` | `/messages` | `{receiver_id:partner.id` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Messages.jsx:349`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L349) | User Action Handler (`ReportThread`) | `ReportThread` | `GET` | `/messages/reports/${report.id}/thread` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Messages.jsx:358`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L358) | User Action Handler (`reply`) | `reply` | `POST` | `/messages/reports/${report.id}/reply` | `{content:input.trim()` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Messages.jsx:365`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L365) | User Action Handler (`close`) | `close` | `PATCH` | `/messages/reports/${report.id}/close` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Messages.jsx:465`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L465) | User Action Handler (`Messages`) | `Messages` | `GET` | `/messages/conversations` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Messages.jsx:473`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L473) | User Action Handler (`Messages`) | `Messages` | `GET` | `/messages/my-reports` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * 
 * =====================================================================
 */
import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  FileText,
  MessageSquare,
  Plus,
  Search,
  Send,
  X,
} from 'lucide-react-native';
import { colors } from '../../../styles';
import { extras } from '../styles';
import { messages as styles } from './styles';

// Port of the web "extra messages" page
// (staffly-frontend/src/pages/extras/components/Messages.jsx). The web layout is
// a two-pane card that collapses to the conversation list under 768px, which is
// the layout used here. Reports are created from a "Nouveau report" form.
const REPORT_TYPES = ['Bug', 'Technique', 'Signalement', 'Général', 'Extra', 'Client'];

export default function Messages() {
  const { height } = useWindowDimensions();
  const [tab, setTab] = useState('messages');
  const [query, setQuery] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [reportType, setReportType] = useState('Général');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // The design fills the viewport below the app header (calc(100vh - 110px)).
  const shellHeight = Math.max(440, Math.min(height - 300, 620));

  function selectTab(nextTab) {
    setTab(nextTab);
    setQuery('');
  }

  function openReport() {
    setReportType('Général');
    setSubject('');
    setMessage('');
    setReportOpen(true);
  }

  function sendReport() {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Champs requis', 'Renseignez le sujet et le message du report.');
      return;
    }
    setReportOpen(false);
    Alert.alert('Report envoyé', 'Votre report a bien été transmis.');
  }

  return (
    <View>
      {/* Page heading, same block as the other extras pages */}
      <View style={[extras.pageHeading, styles.pageHeadingSpacing]}>
        <Text style={extras.pageEyebrow}>Espace extra</Text>
        <Text style={extras.pageTitle}>Messages</Text>
        <Text style={extras.pageDescription}>
          Échangez avec les clients et consultez vos signalements.
        </Text>
      </View>

      <View style={[styles.shell, { height: shellHeight }]}>
        <View style={styles.shellHeader}>
          <Text style={styles.shellTitle}>Messages</Text>

          <View style={styles.tabs}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: tab === 'messages' }}
              onPress={() => selectTab('messages')}
              style={[styles.tab, tab === 'messages' && styles.tabActive]}
            >
              <MessageSquare
                size={12}
                color={tab === 'messages' ? colors.orange : '#888'}
              />
              <Text
                style={[
                  styles.tabText,
                  tab === 'messages' && styles.tabTextActive,
                ]}
              >
                Messages
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: tab === 'reports' }}
              onPress={() => selectTab('reports')}
              style={[styles.tab, tab === 'reports' && styles.tabActive]}
            >
              <FileText
                size={12}
                color={tab === 'reports' ? colors.orange : '#888'}
              />
              <Text
                style={[
                  styles.tabText,
                  tab === 'reports' && styles.tabTextActive,
                ]}
              >
                Reports
              </Text>
            </Pressable>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Search size={13} color="#bbb" />
              <TextInput
                onChangeText={setQuery}
                placeholder={tab === 'messages' ? 'Rechercher...' : 'Filtrer...'}
                placeholderTextColor="#bbb"
                style={styles.searchInput}
                value={query}
              />
            </View>

            {tab === 'reports' ? (
              <Pressable
                accessibilityLabel="Nouveau report"
                accessibilityRole="button"
                onPress={openReport}
                style={styles.btnNewReport}
              >
                <Plus size={16} color={colors.white} />
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={styles.list}>
          {tab === 'messages' ? (
            <View style={styles.emptyList}>
              <MessageSquare
                size={28}
                color="#ccc"
                strokeWidth={1}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>
                Aucune conversation{'\n'}
                <Text style={styles.emptySubText}>
                  Cliquez sur + pour démarrer
                </Text>
              </Text>
            </View>
          ) : (
            <View style={styles.emptyList}>
              <FileText
                size={28}
                color="#ccc"
                strokeWidth={1}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>Aucun report</Text>
            </View>
          )}
        </View>
      </View>

      {/* Nouveau report */}
      <Modal
        animationType="fade"
        onRequestClose={() => setReportOpen(false)}
        transparent
        visible={reportOpen}
      >
        <Pressable
          accessibilityLabel="Fermer la fenêtre"
          accessibilityRole="button"
          onPress={() => setReportOpen(false)}
          style={styles.sheetBackdrop}
        >
          <Pressable
            accessibilityRole="none"
            onPress={event => event.stopPropagation()}
            style={styles.sheet}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Nouveau report</Text>
              <Pressable
                accessibilityLabel="Fermer"
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setReportOpen(false)}
                style={styles.sheetClose}
              >
                <X size={18} color="#999" />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={styles.sheetScroll}
              contentContainerStyle={{ paddingHorizontal: 4 }}
            >
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Type</Text>
                <View style={styles.chips}>
                  {REPORT_TYPES.map(type => {
                    const active = reportType === type;
                    return (
                      <Pressable
                        key={type}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        onPress={() => setReportType(type)}
                        style={[styles.chip, active && styles.chipActive]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            active && styles.chipTextActive,
                          ]}
                        >
                          {type}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Sujet *</Text>
                <TextInput
                  onChangeText={setSubject}
                  placeholder="Décrivez brièvement..."
                  placeholderTextColor="#bbb"
                  style={styles.input}
                  value={subject}
                />
              </View>

              <View style={styles.fieldLast}>
                <Text style={styles.fieldLabel}>Message *</Text>
                <TextInput
                  multiline
                  onChangeText={setMessage}
                  placeholder="Détaillez votre problème..."
                  placeholderTextColor="#bbb"
                  style={[styles.input, styles.textarea]}
                  value={message}
                />
              </View>

              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setReportOpen(false)}
                  style={styles.btnCancel}
                >
                  <Text style={styles.btnCancelText}>Annuler</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={sendReport}
                  style={styles.btnSend}
                >
                  <Send size={14} color={colors.white} />
                  <Text style={styles.btnSendText}>Envoyer</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
