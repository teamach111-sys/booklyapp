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
 * | [`Messages.jsx:99`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L99) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/messages/contacts?tab=${tab}&search=${encodeURIComponent(search)}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Messages.jsx:170`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L170) | Form Submit / Create Button (`submit`) | `submit` | `POST` | `/messages/report` | `form` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Messages.jsx:231`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L231) | Initial Page / Component Mount Lifecycle (`useEffect`) | `useEffect hook` | `GET` | `/messages/discussion/${partner.id}` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Messages.jsx:243`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L243) | User Action Handler (`send`) | `send` | `POST` | `/messages` | `{receiver_id:partner.id, content:...}` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Messages.jsx:349`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L349) | User Action Handler (`ReportThread`) | `ReportThread` | `GET` | `/messages/reports/${report.id}/thread` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Messages.jsx:358`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L358) | User Action Handler (`reply`) | `reply` | `POST` | `/messages/reports/${report.id}/reply` | `{content:input.trim()}` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Messages.jsx:365`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L365) | User Action Handler (`close`) | `close` | `PATCH` | `/messages/reports/${report.id}/close` | `None` | Bearer token (Authstorage / localStorage) | Inferred / Dynamic |
 * | [`Messages.jsx:465`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L465) | User Action Handler (`Messages`) | `Messages` | `GET` | `/messages/conversations` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 * | [`Messages.jsx:473`](file:///C:/Users/Workspace/staffly-frontend/src/pages/components/Messages.jsx#L473) | User Action Handler (`Messages`) | `Messages` | `GET` | `/messages/my-reports` | `None` | Bearer token (Authstorage / localStorage) | Confirmed |
 *
 * =====================================================================
 */
import { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle,
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
import clientService from '../../../api/clientService';
import { useAuth } from '../../../context/AuthContext';

const REPORT_TYPES = ['general', 'technique', 'bug', 'signalement', 'client', 'extra'];

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export default function Messages() {
  const { user } = useAuth();
  const [tab, setTab] = useState('messages');
  const [query, setQuery] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [reportType, setReportType] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendingReport, setSendingReport] = useState(false);

  // Messages state
  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [discussion, setDiscussion] = useState([]);
  const [discussionLoading, setDiscussionLoading] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);

  // Reports state
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportThread, setReportThread] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const shellHeight = 560;

  // Load conversations
  const loadConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const data = await clientService.getConversations();
      const list = Array.isArray(data) ? data : (data?.conversations || []);
      setConversations(list);
    } catch {
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  // Load contacts (filtered by search)
  useEffect(() => {
    if (tab !== 'messages') return;
    let alive = true;
    const timeout = setTimeout(async () => {
      try {
        const data = await clientService.getContacts('staff', query);
        if (!alive) return;
        setContacts(Array.isArray(data) ? data : (data?.contacts || []));
      } catch {
        if (alive) setContacts([]);
      }
    }, 300);
    return () => { alive = false; clearTimeout(timeout); };
  }, [tab, query]);

  // Load reports
  const loadReports = useCallback(async () => {
    setLoadingReports(true);
    try {
      const data = await clientService.getMyReports();
      setReports(Array.isArray(data) ? data : (data?.reports || []));
    } catch {
      setReports([]);
    } finally {
      setLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'messages') loadConversations();
    else loadReports();
  }, [tab, loadConversations, loadReports]);

  // Load discussion when selecting a partner
  useEffect(() => {
    if (!selectedPartner) return;
    let alive = true;
    setDiscussionLoading(true);
    clientService.getDiscussion(selectedPartner.id)
      .then(data => {
        if (!alive) return;
        const msgs = Array.isArray(data) ? data : (data?.messages || []);
        setDiscussion(msgs);
      })
      .catch(() => { if (alive) setDiscussion([]); })
      .finally(() => { if (alive) setDiscussionLoading(false); });
    return () => { alive = false; };
  }, [selectedPartner]);

  // Load report thread when selecting a report
  useEffect(() => {
    if (!selectedReport) return;
    let alive = true;
    setThreadLoading(true);
    clientService.getReportThread(selectedReport.id)
      .then(data => {
        if (!alive) return;
        // Backend returns { report, replies: [...] }
        const thread = data?.replies || data?.thread || (Array.isArray(data) ? data : []);
        setReportThread(thread);
      })
      .catch(() => { if (alive) setReportThread([]); })
      .finally(() => { if (alive) setThreadLoading(false); });
    return () => { alive = false; };
  }, [selectedReport]);

  function selectTab(nextTab) {
    setTab(nextTab);
    setQuery('');
    setSelectedPartner(null);
    setSelectedReport(null);
  }

  function openReport() {
    setReportType('general');
    setSubject('');
    setMessage('');
    setReportOpen(true);
  }

  async function sendReport() {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Champs requis', 'Renseignez le sujet et le message du report.');
      return;
    }
    setSendingReport(true);
    try {
      await clientService.sendReport({
        type: reportType,
        subject: subject.trim(),
        content: message.trim(),
      });
      setReportOpen(false);
      Alert.alert('Report envoyé', 'Votre report a bien été transmis.');
      await loadReports();
    } catch (err) {
      Alert.alert('Erreur', err?.message || 'Impossible d\'envoyer le report.');
    } finally {
      setSendingReport(false);
    }
  }

  async function sendMessage() {
    if (!draftMessage.trim() || !selectedPartner) return;
    setSendingMessage(true);
    try {
      await clientService.sendMessage({
        receiver_id: selectedPartner.id,
        content: draftMessage.trim(),
      });
      setDraftMessage('');
      // Refresh discussion
      const data = await clientService.getDiscussion(selectedPartner.id);
      setDiscussion(Array.isArray(data) ? data : (data?.messages || []));
      await loadConversations();
    } catch (err) {
      Alert.alert('Erreur', err?.message || 'Impossible d\'envoyer le message.');
    } finally {
      setSendingMessage(false);
    }
  }

  async function replyToReport() {
    if (!replyText.trim() || !selectedReport) return;
    setReplying(true);
    try {
      await clientService.replyReport(selectedReport.id, replyText.trim());
      setReplyText('');
      // Refresh thread
      const data = await clientService.getReportThread(selectedReport.id);
      setReportThread(data?.replies || data?.thread || (Array.isArray(data) ? data : []));
    } catch (err) {
      Alert.alert('Erreur', err?.message || 'Impossible de répondre.');
    } finally {
      setReplying(false);
    }
  }

  async function closeReport() {
    if (!selectedReport) return;
    Alert.alert(
      'Fermer le signalement',
      'Voulez-vous vraiment fermer ce signalement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Fermer',
          onPress: async () => {
            try {
              await clientService.closeReport(selectedReport.id);
              setSelectedReport(null);
              await loadReports();
              Alert.alert('Succès', 'Signalement fermé.');
            } catch (err) {
              Alert.alert('Erreur', err?.message || 'Impossible de fermer.');
            }
          },
        },
      ],
    );
  }

  // Show search results when query is present, otherwise show conversations
  const messageList = query.trim() ? contacts : conversations;
  const filteredReports = query.trim()
    ? reports.filter(r =>
        (r.subject || '').toLowerCase().includes(query.toLowerCase()) ||
        (r.type || '').toLowerCase().includes(query.toLowerCase()))
    : reports;

  // ── Discussion view ──
  if (selectedPartner) {
    return (
      <View>
        <View style={[extras.pageHeading, styles.pageHeadingSpacing]}>
          <Text style={extras.pageEyebrow}>Espace extra</Text>
          <Text style={extras.pageTitle}>Messages</Text>
        </View>
        <View style={[styles.shell, { height: shellHeight }]}>
          <View style={styles.discussionHeader}>
            <Pressable
              accessibilityLabel="Retour"
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => setSelectedPartner(null)}
              style={styles.backBtn}
            >
              <ArrowLeft size={16} color="#888" />
            </Pressable>
            <View style={styles.discussionPartnerInfo}>
              <View style={styles.partnerAvatar}>
                <Text style={styles.partnerAvatarText}>
                  {(selectedPartner.name || selectedPartner.full_name || '?').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.partnerName}>
                  {selectedPartner.name || selectedPartner.full_name || 'Discussion'}
                </Text>
                {selectedPartner.role || selectedPartner.space_name ? (
                  <Text style={styles.partnerRole}>
                    {selectedPartner.role || selectedPartner.space_name}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          <ScrollView
            style={styles.discussionScroll}
            contentContainerStyle={{ padding: 14, gap: 10 }}
            keyboardShouldPersistTaps="handled"
          >
            {discussionLoading ? (
              <Text style={styles.loadingText}>Chargement…</Text>
            ) : discussion.length === 0 ? (
              <Text style={styles.loadingText}>Aucun message. Démarrez la conversation !</Text>
            ) : (
              discussion.map((msg, idx) => {
                const isMine = msg.is_mine || msg.sender_id !== selectedPartner.id;
                return (
                  <View
                    key={msg.id || idx}
                    style={[styles.bubbleRow, isMine && styles.bubbleRowMine]}
                  >
                    <View style={[styles.bubble, isMine && styles.bubbleMine]}>
                      <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>
                        {msg.content || msg.body || msg.message}
                      </Text>
                      <Text style={[styles.bubbleTime, isMine && styles.bubbleTimeMine]}>
                        {formatTime(msg.created_at || msg.sent_at)}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          <View style={styles.composeRow}>
            <TextInput
              onChangeText={setDraftMessage}
              placeholder="Votre message…"
              placeholderTextColor="#bbb"
              style={styles.composeInput}
              value={draftMessage}
            />
            <Pressable
              accessibilityRole="button"
              disabled={sendingMessage || !draftMessage.trim()}
              onPress={sendMessage}
              style={[styles.composeSend, (sendingMessage || !draftMessage.trim()) && { opacity: 0.5 }]}
            >
              <Send size={15} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // ── Report thread view ──
  if (selectedReport) {
    return (
      <View>
        <View style={[extras.pageHeading, styles.pageHeadingSpacing]}>
          <Text style={extras.pageEyebrow}>Espace extra</Text>
          <Text style={extras.pageTitle}>Signalement</Text>
        </View>
        <View style={[styles.shell, { height: shellHeight }]}>
          <View style={styles.discussionHeader}>
            <Pressable
              accessibilityLabel="Retour"
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => setSelectedReport(null)}
              style={styles.backBtn}
            >
              <ArrowLeft size={16} color="#888" />
            </Pressable>
            <View style={styles.discussionPartnerInfo}>
              <View>
                <Text style={styles.partnerName}>{selectedReport.subject}</Text>
                <View style={styles.reportMetaRow}>
                  <Text style={styles.partnerRole}>{selectedReport.type}</Text>
                  <View style={[
                    styles.reportStatusBadge,
                    selectedReport.status === 'closed' ? styles.reportStatusClosed : styles.reportStatusOpen,
                  ]}>
                    <Text style={[
                      styles.reportStatusText,
                      selectedReport.status === 'closed' ? styles.reportStatusTextClosed : styles.reportStatusTextOpen,
                    ]}>
                      {selectedReport.status === 'closed' ? 'Fermé' : 'Ouvert'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {selectedReport.status !== 'closed' ? (
              <Pressable
                accessibilityRole="button"
                onPress={closeReport}
                style={styles.closeReportBtn}
              >
                <CheckCircle size={13} color="#888" />
                <Text style={styles.closeReportText}>Fermer</Text>
              </Pressable>
            ) : null}
          </View>

          <ScrollView
            style={styles.discussionScroll}
            contentContainerStyle={{ padding: 14, gap: 10 }}
            keyboardShouldPersistTaps="handled"
          >
            {threadLoading ? (
              <Text style={styles.loadingText}>Chargement…</Text>
            ) : reportThread.length === 0 ? (
              <Text style={styles.loadingText}>Aucun message dans ce signalement.</Text>
            ) : (
              reportThread.map((msg, idx) => {
                // Backend returns sender_id, firstname, name, role on each reply.
                // Messages where the current user is the sender are "mine".
                const isMine = msg.sender_id === user?.id;
                return (
                  <View
                    key={msg.id || idx}
                    style={[styles.bubbleRow, isMine && styles.bubbleRowMine]}
                  >
                    <View style={[styles.bubble, isMine && styles.bubbleMine]}>
                      {!isMine ? (
                        <Text style={styles.bubbleSender}>
                          {msg.firstname ? `${msg.firstname} ${msg.name || ''}` : 'Support'}
                        </Text>
                      ) : null}
                      <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>
                        {msg.content || msg.body || msg.message}
                      </Text>
                      <Text style={[styles.bubbleTime, isMine && styles.bubbleTimeMine]}>
                        {formatTime(msg.created_at || msg.sent_at)}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {selectedReport.status !== 'closed' ? (
            <View style={styles.composeRow}>
              <TextInput
                onChangeText={setReplyText}
                placeholder="Votre réponse…"
                placeholderTextColor="#bbb"
                style={styles.composeInput}
                value={replyText}
              />
              <Pressable
                accessibilityRole="button"
                disabled={replying || !replyText.trim()}
                onPress={replyToReport}
                style={[styles.composeSend, (replying || !replyText.trim()) && { opacity: 0.5 }]}
              >
                <Send size={15} color={colors.white} />
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  // ── List view (conversations or reports) ──
  return (
    <View>
      {/* Page heading */}
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
              <MessageSquare size={12} color={tab === 'messages' ? colors.orange : '#888'} />
              <Text style={[styles.tabText, tab === 'messages' && styles.tabTextActive]}>
                Messages
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: tab === 'reports' }}
              onPress={() => selectTab('reports')}
              style={[styles.tab, tab === 'reports' && styles.tabActive]}
            >
              <FileText size={12} color={tab === 'reports' ? colors.orange : '#888'} />
              <Text style={[styles.tabText, tab === 'reports' && styles.tabTextActive]}>
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

        <ScrollView style={styles.list} contentContainerStyle={{ gap: 4 }}>
          {tab === 'messages' ? (
            loadingConversations && !query ? (
              <Text style={styles.loadingText}>Chargement…</Text>
            ) : messageList.length === 0 ? (
              <View style={styles.emptyList}>
                <MessageSquare size={28} color="#ccc" strokeWidth={1} style={styles.emptyIcon} />
                <Text style={styles.emptyText}>
                  {query ? 'Aucun contact trouvé' : 'Aucune conversation'}
                  {'\n'}
                  <Text style={styles.emptySubText}>
                    {query ? 'Essayez un autre terme' : 'Recherchez un contact pour démarrer'}
                  </Text>
                </Text>
              </View>
            ) : (
              messageList.map((item, idx) => (
                <Pressable
                  key={item.id || idx}
                  accessibilityRole="button"
                  onPress={() => setSelectedPartner({
                    id: item.id || item.user_id || item.partner_id,
                    name: item.name || item.full_name || item.partner_name,
                    role: item.role || item.space_name,
                  })}
                  style={styles.convItem}
                >
                  <View style={styles.convAvatar}>
                    <Text style={styles.convAvatarText}>
                      {(item.name || item.full_name || item.partner_name || '?').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.convInfo}>
                    <Text style={styles.convName} numberOfLines={1}>
                      {item.name || item.full_name || item.partner_name || 'Discussion'}
                    </Text>
                    {item.last_message || item.last_message_content ? (
                      <Text style={styles.convPreview} numberOfLines={1}>
                        {item.last_message || item.last_message_content}
                      </Text>
                    ) : null}
                  </View>
                  {item.unread_count > 0 ? (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>{item.unread_count}</Text>
                    </View>
                  ) : null}
                  {item.last_message_at || item.updated_at ? (
                    <Text style={styles.convTime}>
                      {formatTime(item.last_message_at || item.updated_at)}
                    </Text>
                  ) : null}
                </Pressable>
              ))
            )
          ) : (
            loadingReports ? (
              <Text style={styles.loadingText}>Chargement…</Text>
            ) : filteredReports.length === 0 ? (
              <View style={styles.emptyList}>
                <FileText size={28} color="#ccc" strokeWidth={1} style={styles.emptyIcon} />
                <Text style={styles.emptyText}>
                  {query ? 'Aucun signalement trouvé' : 'Aucun report'}
                  {'\n'}
                  <Text style={styles.emptySubText}>
                    {query ? 'Essayez un autre terme' : 'Cliquez sur + pour créer un report'}
                  </Text>
                </Text>
              </View>
            ) : (
              filteredReports.map((report, idx) => (
                <Pressable
                  key={report.id || idx}
                  accessibilityRole="button"
                  onPress={() => setSelectedReport(report)}
                  style={styles.convItem}
                >
                  <View style={[styles.convAvatar, styles.reportAvatar]}>
                    <FileText size={14} color={colors.orange} />
                  </View>
                  <View style={styles.convInfo}>
                    <Text style={styles.convName} numberOfLines={1}>
                      {report.subject}
                    </Text>
                    <View style={styles.reportMetaRow}>
                      <Text style={styles.reportTypeLabel}>{report.type}</Text>
                      <View style={[
                        styles.reportStatusBadge,
                        report.status === 'closed' ? styles.reportStatusClosed : styles.reportStatusOpen,
                      ]}>
                        <Text style={[
                          styles.reportStatusText,
                          report.status === 'closed' ? styles.reportStatusTextClosed : styles.reportStatusTextOpen,
                        ]}>
                          {report.status === 'closed' ? 'Fermé' : 'Ouvert'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.convTime}>{formatTime(report.created_at || report.updated_at)}</Text>
                </Pressable>
              ))
            )
          )}
        </ScrollView>
      </View>

      {/* ── Nouveau report bottom sheet ── */}
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
              nestedScrollEnabled
            >
              <View style={styles.formField}>
                <Text style={styles.label}>Type</Text>
                <View style={styles.typeSelector}>
                  {REPORT_TYPES.map(type => (
                    <Pressable
                      key={type}
                      accessibilityRole="button"
                      accessibilityState={{ selected: reportType === type }}
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
                  value={subject}
                  onChangeText={setSubject}
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
                  value={message}
                  onChangeText={setMessage}
                />
              </View>

              <View style={styles.formActions}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setReportOpen(false)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </Pressable>
                <Pressable
                  style={[styles.submitButton, sendingReport && { opacity: 0.6 }]}
                  disabled={sendingReport}
                  onPress={sendReport}
                >
                  {sendingReport ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text style={styles.submitButtonText}>Envoyer</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
