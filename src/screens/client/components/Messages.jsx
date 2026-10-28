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
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  FileText,
  Lock,
  MessageCircle,
  Plus,
  Search,
  Send,
  User,
  X,
} from 'lucide-react-native';
import { useClientTheme } from '../theme/ClientThemeContext';
import { useAuth } from '../../../context/AuthContext';
import BottomSheet from './BottomSheet';
import { messagesStylesByBrand } from './styles';
import clientService from '../../../api/clientService';

const REPORT_TYPES = ['general', 'technique', 'bug', 'signalement', 'client', 'extra'];

const ROLE_TABS = [
  { k: 'admins_staff', label: 'Admins & Staff' },
  { k: 'co_owners', label: 'Co-propriétaires' },
  { k: 'employees', label: 'Mes employés' },
];

export default function Messages() {
  const { partner, colors } = useClientTheme();
  const styles = messagesStylesByBrand[partner];
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('messages'); // 'messages' | 'reports'
  const [conversations, setConversations] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Active chat thread state
  const [activePartner, setActivePartner] = useState(null); // User object
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);

  // Active report thread state
  const [activeReport, setActiveReport] = useState(null);
  const [reportThread, setReportThread] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Modals
  const [modalVisible, setModalVisible] = useState(null); // 'conversation' | 'report'
  const [modalTab, setModalTab] = useState('staff');
  const [contactSearch, setContactSearch] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // Report form state
  const [reportType, setReportType] = useState('general');
  const [reportSubject, setReportSubject] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  const flatListRef = useRef(null);

  // ── Load conversations or reports ──
  const loadConversations = useCallback(async () => {
    try {
      const data = await clientService.getConversations();
      if (Array.isArray(data)) setConversations(data);
      else if (Array.isArray(data?.conversations)) setConversations(data.conversations);
      else if (Array.isArray(data?.data)) setConversations(data.data);
      else setConversations([]);
    } catch {
      setConversations([]);
    }
  }, []);

  const loadReports = useCallback(async () => {
    try {
      const data = await clientService.getMyReports();
      setReports(Array.isArray(data) ? data : data?.reports || []);
    } catch {
      setReports([]);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    if (activeTab === 'messages') {
      loadConversations().finally(() => setLoading(false));
    } else {
      loadReports().finally(() => setLoading(false));
    }
  }, [activeTab, loadConversations, loadReports]);

  // ── Load thread messages ──
  const loadDiscussion = useCallback(async partnerId => {
    setLoadingThread(true);
    try {
      const data = await clientService.getDiscussion(partnerId);
      const list = data?.messages || (Array.isArray(data) ? data : []);
      setMessages(list);
    } catch {
      setMessages([]);
    } finally {
      setLoadingThread(false);
    }
  }, []);

  const openConversation = convOrContact => {
    const partnerId = convOrContact.partner_id || convOrContact.other_user_id || convOrContact.user_id || convOrContact.contact_id || convOrContact.id || convOrContact.receiver_id || convOrContact.sender_id;
    const partnerObj = {
      id: partnerId,
      name:
        convOrContact.partner_name ||
        (convOrContact.partner_firstname || convOrContact.firstname || convOrContact.first_name
          ? `${convOrContact.partner_firstname || convOrContact.firstname || convOrContact.first_name} ${convOrContact.partner_lastname || convOrContact.lastname || convOrContact.last_name || convOrContact.name || ''}`.trim()
          : '') ||
        convOrContact.name ||
        convOrContact.other_user_name ||
        convOrContact.full_name ||
        (partnerId ? `Contact #${partnerId}` : 'Contact'),
      role: convOrContact.partner_role || convOrContact.role || convOrContact.user_role || '',
    };
    setActivePartner(partnerObj);
    if (partnerId) loadDiscussion(partnerId);
  };

  // ── Send message ──
  const handleSendMessage = async () => {
    const text = inputMessage.trim();
    if (!text || !activePartner || sendingMessage) return;

    setInputMessage('');
    setSendingMessage(true);
    try {
      const res = await clientService.sendMessage({
        receiver_id: activePartner.id,
        content: text,
      });

      const newMsg = {
        id: res?.id || Date.now().toString(),
        sender_id: user?.id,
        receiver_id: activePartner.id,
        content: text,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, newMsg]);
      loadConversations();
    } catch (err) {
      Alert.alert('Erreur', err?.message || 'Impossible d’envoyer le message.');
      setInputMessage(text);
    } finally {
      setSendingMessage(false);
    }
  };

  // ── Load contacts for new conversation modal ──
  useEffect(() => {
    if (modalVisible !== 'conversation') return;
    setLoadingContacts(true);
    clientService
      .getContacts(modalTab, contactSearch)
      .then(d => {
        if (Array.isArray(d)) setContacts(d);
        else if (Array.isArray(d?.contacts)) setContacts(d.contacts);
        else if (Array.isArray(d?.data)) setContacts(d.data);
        else if (Array.isArray(d?.users)) setContacts(d.users);
        else if (Array.isArray(d?.list)) setContacts(d.list);
        else if (Array.isArray(d?.result)) setContacts(d.result);
        else setContacts([]);
      })
      .catch(() => setContacts([]))
      .finally(() => setLoadingContacts(false));
  }, [modalVisible, modalTab, contactSearch]);

  // ── Send new report ──
  const handleSubmitReport = async () => {
    if (!reportSubject.trim() || !reportContent.trim()) {
      Alert.alert('Champs requis', 'Veuillez saisir un sujet et un contenu.');
      return;
    }
    setSubmittingReport(true);
    try {
      await clientService.sendReport({
        type: reportType,
        subject: reportSubject.trim(),
        content: reportContent.trim(),
      });
      Alert.alert('Succès', 'Votre report a été envoyé avec succès.');
      setModalVisible(null);
      setReportSubject('');
      setReportContent('');
      if (activeTab === 'reports') loadReports();
    } catch (err) {
      Alert.alert('Erreur', err?.message || 'Impossible d’envoyer le report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  // ── Open report thread ──
  const openReportThread = async report => {
    setActiveReport(report);
    setLoadingThread(true);
    try {
      const data = await clientService.getReportThread(report.id);
      // staffly-frontend returns { report, replies: [] }
      setReportThread(data?.replies || data?.thread || (Array.isArray(data) ? data : []));
    } catch {
      setReportThread([]);
    } finally {
      setLoadingThread(false);
    }
  };

  // ── Reply to report ──
  const handleReplyReport = async () => {
    if (!replyContent.trim() || !activeReport) return;
    setSendingReply(true);
    try {
      await clientService.replyReport(activeReport.id, replyContent.trim());
      setReplyContent('');
      // Reload thread
      const data = await clientService.getReportThread(activeReport.id);
      setReportThread(data?.replies || data?.thread || (Array.isArray(data) ? data : []));
    } catch {
      Alert.alert('Erreur', 'Impossible d\'envoyer la réponse.');
    } finally {
      setSendingReply(false);
    }
  };

  // ── Close report ──
  const handleCloseReport = async () => {
    if (!activeReport) return;
    Alert.alert(
      'Clôturer le report',
      'Voulez-vous vraiment clôturer ce report ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Clôturer',
          onPress: async () => {
            try {
              await clientService.closeReport(activeReport.id);
              setActiveReport(prev => prev ? { ...prev, status: 'closed' } : null);
              loadReports();
            } catch {
              Alert.alert('Erreur', 'Impossible de clôturer le report.');
            }
          },
        },
      ]
    );
  };

  // ── Active Chat View (Moved to Sheet) ──
  const renderConversationSheet = () => {
    if (!activePartner) return null;
    const initials = (activePartner.name?.split(' ').map(n => n[0]).join('') || 'U').toUpperCase().slice(0, 2);

    return (
      <BottomSheet
        visible={!!activePartner}
        onClose={() => {
          setActivePartner(null);
          loadConversations();
        }}
        maxHeight="90%"
        sheetStyle={styles.convSheet}
      >
        <View style={styles.convHeader}>
          <View style={styles.convAvatar}>
            <Text style={styles.convAvatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.convName} numberOfLines={1}>
              {activePartner.name}
            </Text>
            {activePartner.role ? (
              <Text style={{ fontSize: 11, color: '#AAA' }}>{activePartner.role}</Text>
            ) : null}
          </View>
          <Pressable onPress={() => setActivePartner(null)} style={styles.convClose}>
            <X size={16} color="#888" />
          </Pressable>
        </View>

        <ScrollView
          ref={flatListRef}
          style={styles.convScroll}
          contentContainerStyle={styles.convBody}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        >
          {loadingThread ? (
            <ActivityIndicator color={colors.orange} style={{ marginTop: 40 }} />
          ) : messages.length === 0 ? (
            <View style={styles.convEmpty}>
              <Text style={styles.convEmptyTitle}>Aucun message</Text>
              <Text style={styles.convEmptySub}>Démarrer la discussion avec ce contact.</Text>
            </View>
          ) : (
            <View style={styles.convList}>
              {messages.map((msg, i) => {
                const isMine = msg.sender_id === user?.id || msg.is_mine || msg.from_me;
                return (
                  <View key={msg.id || i} style={[styles.convMsgRow, isMine && styles.convMsgRowMine]}>
                    <View style={isMine ? styles.convMessageMine : styles.convMessageOther}>
                      <Text style={isMine ? styles.convMessageTextMine : styles.convMessageTextOther}>
                        {msg.content || msg.message}
                      </Text>
                      {msg.created_at ? (
                        <Text style={[styles.convMsgTime, { color: isMine ? '#FFE5D9' : '#BBB' }]}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <View style={styles.convComposer}>
            <TextInput
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Écrire un message..."
              placeholderTextColor="#AAA"
              multiline
              style={styles.convComposerInput}
            />
            <Pressable
              onPress={handleSendMessage}
              disabled={sendingMessage || !inputMessage.trim()}
              style={[styles.convSend, (sendingMessage || !inputMessage.trim()) && styles.convSendDisabled]}
            >
              {sendingMessage ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Send size={16} color="#FFF" />
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  };

  // ── Active Report View (Moved to Sheet) ──
  const renderReportSheet = () => {
    if (!activeReport) return null;
    const isClosed = activeReport.status === 'closed';

    return (
      <BottomSheet
        visible={!!activeReport}
        onClose={() => setActiveReport(null)}
        maxHeight="98%"
        sheetStyle={styles.convSheetTall}
      >
        <View style={styles.convHeader}>
          <Text style={styles.convName}>Détails du report</Text>
          <Pressable onPress={() => setActiveReport(null)} style={styles.convClose}>
            <X size={16} color="#888" />
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16, backgroundColor: '#FAF7F5' }}>
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.brown, marginBottom: 6 }}>
                  {activeReport.subject}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <View style={{ paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, backgroundColor: '#F5EDE8' }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.orangeDark, textTransform: 'capitalize' }}>
                      {activeReport.type}
                    </Text>
                  </View>
                  <View style={[styles.reportBadge, isClosed ? styles.reportBadgeClosed : styles.reportBadgeOpen, { paddingVertical: 3, paddingHorizontal: 10 }]}>
                    <Text style={[isClosed ? styles.reportBadgeTextClosed : styles.reportBadgeTextOpen, { fontSize: 11 }]}>
                      {isClosed ? 'Fermé' : 'Ouvert'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={{ padding: 16, backgroundColor: '#FAF6F4', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: colors.orange, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 }}>
              <Text style={{ fontSize: 15, color: '#333', lineHeight: 22 }}>
                {activeReport.content || activeReport.description}
              </Text>
              {activeReport.created_at && (
                <Text style={{ fontSize: 11, color: '#AAA', marginTop: 10, textAlign: 'right' }}>
                  Posté le {new Date(activeReport.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </View>

            {!isClosed && (
              <Pressable onPress={handleCloseReport} style={[styles.closeReportButton, { marginTop: 16, paddingVertical: 10, paddingHorizontal: 16 }]}>
                <Lock size={14} color="#D32F2F" />
                <Text style={[styles.closeReportText, { fontSize: 13 }]}>Clôturer ce report</Text>
              </Pressable>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#F0E4DD' }} />
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#BBB', textTransform: 'uppercase', letterSpacing: 1 }}>
              Historique des échanges
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#F0E4DD' }} />
          </View>
        </View>

        <ScrollView 
          ref={flatListRef}
          style={{ flex: 1, backgroundColor: '#FAF7F5' }} 
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          onContentSizeChange={() => {
            if (!isClosed) flatListRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {loadingThread ? (
            <ActivityIndicator color={colors.orange} style={{ padding: 40 }} />
          ) : reportThread.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <MessageCircle size={32} color="#EEE" />
              <Text style={{ fontSize: 13, color: '#BBB', marginTop: 12 }}>Aucune réponse pour le moment</Text>
            </View>
          ) : (
            <View style={styles.convList}>
              {reportThread.map((item, idx) => {
                const isMine = item.sender_id === user?.id || item.user_id === user?.id;
                return (
                  <View key={item.id || idx} style={[styles.convMsgRow, isMine && styles.convMsgRowMine]}>
                    <View style={isMine ? styles.convMessageMine : styles.convMessageOther}>
                      {!isMine && (
                        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.orangeDark, marginBottom: 4 }}>
                          {item.firstname ? `${item.firstname} ${item.name || ''}` : item.user?.firstname ? `${item.user.firstname} ${item.user.name || ''}` : 'Support'}
                        </Text>
                      )}
                      <Text style={isMine ? styles.convMessageTextMine : styles.convMessageTextOther}>
                        {item.content}
                      </Text>
                      {item.created_at && (
                        <Text style={[styles.convMsgTime, { color: isMine ? '#FFE5D9' : '#BBB', marginTop: 6 }]}>
                          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {!isClosed && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          >
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F0E4DD', backgroundColor: '#FFF' }}>
              <TextInput
                placeholder="Répondre au report..."
                placeholderTextColor="#AAA"
                multiline
                value={replyContent}
                onChangeText={setReplyContent}
                style={[styles.replyInput, { backgroundColor: '#F5EDE8', borderStyle: 'dashed', minHeight: 45, maxHeight: 100 }]}
              />
              <Pressable
                onPress={handleReplyReport}
                disabled={!replyContent.trim() || sendingReply}
                style={[styles.replyButton, { height: 44, borderRadius: 22, marginTop: 10 }]}
              >
                {sendingReply ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Send size={14} color="#FFF" />
                    <Text style={[styles.replyButtonText, { fontSize: 14 }]}>Envoyer la réponse</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        )}
      </BottomSheet>
    );
  };

  // Filtered lists
  const filteredConversations = conversations.filter(c => {
    const contact = c.contact || c.partner || c.user || c;
    const name = (
      c.partner_name ||
      (c.partner_firstname || contact.firstname || c.firstname
        ? `${c.partner_firstname || contact.firstname || c.firstname} ${c.partner_lastname || contact.name || contact.lastname || c.lastname || c.name || ''}`
        : '') ||
      contact.name ||
      c.other_user_name ||
      ''
    ).toLowerCase();
    if (!search.trim()) return !!(name || c.last_message || c.lastMessage);
    const lastMsg = (c.last_message || c.lastMessage || '').toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || lastMsg.includes(q);
  });

  const filteredReports = reports.filter(r => {
    if (!search.trim()) return true;
    const subj = (r.subject || '').toLowerCase();
    return subj.includes(search.toLowerCase());
  });

  return (
    <View style={styles.section}>
      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ width: '100%' }}
        contentContainerStyle={styles.tabs}
      >
        <Pressable
          onPress={() => setActiveTab('messages')}
          style={[styles.tab, activeTab === 'messages' && styles.tabSelected]}
        >
          <MessageCircle size={14} color={activeTab === 'messages' ? colors.orange : '#888'} />
          <Text style={[styles.tabText, activeTab === 'messages' && styles.tabTextSelected]}>
            Messages
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('reports')}
          style={[styles.tab, activeTab === 'reports' && styles.tabSelected]}
        >
          <FileText size={14} color={activeTab === 'reports' ? colors.orange : '#888'} />
          <Text style={[styles.tabText, activeTab === 'reports' && styles.tabTextSelected]}>
            Reports
          </Text>
        </Pressable>
      </ScrollView>

      {/* Header with Search and New Button */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={16} color="#BBB" />
          <TextInput
            placeholder="Rechercher..."
            placeholderTextColor="#BBB"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => setModalVisible(activeTab === 'messages' ? 'conversation' : 'report')}
        >
          <Plus size={20} color={colors.white} />
        </Pressable>
      </View>

      {/* Content list (using .map to avoid nested VirtualizedList error) */}
      <View style={styles.content}>
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={colors.orange} />
          </View>
        ) : activeTab === 'messages' ? (
          filteredConversations.length > 0 ? (
            <View>
              {filteredConversations.map((conv, idx) => {
                const c = conv.contact || conv.partner || conv.user || conv;
                const partnerName =
                  conv.partner_name ||
                  c.partner_name ||
                  c.name ||
                  (c.firstname || conv.firstname
                    ? `${c.firstname || conv.firstname} ${c.lastname || conv.lastname || conv.name || ''}`.trim()
                    : '') ||
                  (conv.partner_firstname
                    ? `${conv.partner_firstname} ${conv.partner_lastname || ''}`.trim()
                    : '') ||
                  conv.other_user_name ||
                  (conv.partner_id || c.id ? `Contact #${conv.partner_id || c.id}` : `Contact #${idx + 1}`);
                return (
                  <Pressable
                    key={String(conv.id || conv.partner_id || conv.conversation_id || idx)}
                    onPress={() => openConversation(conv.contact || conv.partner || conv)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 14,
                      backgroundColor: '#FFF',
                      borderRadius: 12,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: '#F0E4DD',
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: '#F5EDE8',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <User size={20} color={colors.brown} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: colors.brown }}>
                        {partnerName}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 13, color: '#777', marginTop: 2 }}
                      >
                        {conv.last_message || conv.lastMessage || 'Démarrer la discussion'}
                      </Text>
                    </View>
                    {(conv.unread_count || conv.unread) > 0 ? (
                      <View
                        style={{
                          backgroundColor: colors.orange,
                          borderRadius: 10,
                          paddingHorizontal: 7,
                          paddingVertical: 2,
                        }}
                      >
                        <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>
                          {conv.unread_count || conv.unread}
                        </Text>
                      </View>
                    ) : (
                      <ChevronRight size={16} color="#CCC" />
                    )}
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <MessageCircle size={24} color={colors.orange} />
              </View>
              <Text style={styles.emptyTitle}>Aucune conversation</Text>
              <Text style={styles.emptySub}>
                Cliquez sur + pour démarrer une nouvelle conversation avec un admin, co-propriétaire ou extra.
              </Text>
            </View>
          )
        ) : filteredReports.length > 0 ? (
          <View>
            {filteredReports.map((rep, idx) => (
              <Pressable
                key={String(rep.id || idx)}
                onPress={() => openReportThread(rep)}
                style={{
                  padding: 14,
                  backgroundColor: '#FFF',
                  borderRadius: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: '#F0E4DD',
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.brown }}>
                    {rep.subject}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: rep.status === 'closed' ? '#888' : '#2E7D32',
                    }}
                  >
                    {rep.status === 'closed' ? 'Fermé' : 'En cours'}
                  </Text>
                </View>
                <Text numberOfLines={2} style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                  {rep.content || rep.description}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <FileText size={24} color={colors.orange} />
            </View>
            <Text style={styles.emptyTitle}>Aucun report</Text>
            <Text style={styles.emptySub}>
              Cliquez sur + pour créer un nouveau signalement ou une demande technique.
            </Text>
          </View>
        )}
      </View>

      {/* Conversation & Report Sheets */}
      {renderConversationSheet()}
      {renderReportSheet()}

      {/* ── New Conversation BottomSheet ── */}
      <BottomSheet
        maxHeight="85%"
        onClose={() => setModalVisible(null)}
        showClose
        title="Nouvelle conversation"
        visible={modalVisible === 'conversation'}
      >
        <View style={styles.modalTabs}>
          {ROLE_TABS.map(tab => (
            <Pressable
              key={tab.k}
              onPress={() => {
                setModalTab(tab.k);
                setContactSearch('');
              }}
              style={[styles.modalTab, modalTab === tab.k && styles.modalTabActive]}
            >
              <Text
                style={[
                  styles.modalTabText,
                  modalTab === tab.k && styles.modalTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
          <View style={[styles.searchBar, { width: '100%' }]}>
            <Search size={14} color="#BBB" />
            <TextInput
              placeholder="Rechercher un contact..."
              placeholderTextColor="#BBB"
              value={contactSearch}
              onChangeText={setContactSearch}
              style={[styles.searchInput, { fontSize: 13 }]}
            />
          </View>
        </View>

        <View style={styles.modalBody}>
          {loadingContacts ? (
            <View style={{ padding: 30, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={colors.orange} />
            </View>
          ) : contacts.length > 0 ? (
            <FlatList
              data={contacts}
              keyExtractor={(item, idx) => String(item.id || idx)}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: contact }) => (
                <Pressable
                  style={styles.contactItem}
                  onPress={() => {
                    setModalVisible(null);
                    openConversation(contact);
                  }}
                >
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactAvatarText}>
                      {((contact.firstname?.[0] || contact.first_name?.[0] || contact.name?.[0] || '') + (contact.name?.[0] || contact.lastname?.[0] || contact.last_name?.[0] || '')).toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>
                      {contact.firstname || contact.first_name || ''} {contact.lastname || contact.last_name || contact.name || ''}
                    </Text>
                    <Text style={styles.contactRole}>{contact.role || contact.user_role || 'Utilisateur'}</Text>
                  </View>
                  <ChevronRight size={16} color="#CCC" />
                </Pressable>
              )}
            />
          ) : (
            <View style={styles.emptyContacts}>
              <Text style={styles.emptyContactsText}>Aucun contact disponible</Text>
            </View>
          )}
        </View>
      </BottomSheet>

      {/* ── New Report BottomSheet ── */}
      <BottomSheet
        maxHeight="85%"
        onClose={() => setModalVisible(null)}
        showClose
        title="Nouveau report"
        visible={modalVisible === 'report'}
      >
        <ScrollView
          style={styles.modalBodyNoPadding}
          contentContainerStyle={styles.modalScrollContentNoPadding}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          <View style={styles.formField}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeSelector}>
              {REPORT_TYPES.map(type => (
                <Pressable
                  key={type}
                  onPress={() => setReportType(type)}
                  style={[styles.typePill, reportType === type && styles.typePillActive]}
                >
                  <Text
                    style={[
                      styles.typePillText,
                      reportType === type && styles.typePillTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Sujet *</Text>
            <TextInput
              style={styles.input}
              placeholder="Décrivez brièvement le sujet"
              placeholderTextColor="#BBB"
              value={reportSubject}
              onChangeText={setReportSubject}
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Message *</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Détaillez votre demande ou signalement..."
              placeholderTextColor="#BBB"
              multiline
              numberOfLines={5}
              value={reportContent}
              onChangeText={setReportContent}
            />
          </View>

          <View style={styles.formActions}>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setModalVisible(null)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable
              style={styles.submitButton}
              disabled={submittingReport}
              onPress={handleSubmitReport}
            >
              {submittingReport ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>Envoyer</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </BottomSheet>
    </View>
  );
}
