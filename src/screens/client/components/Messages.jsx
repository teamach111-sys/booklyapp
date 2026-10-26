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
  FileText,
  MessageCircle,
  Plus,
  Search,
  X,
} from 'lucide-react-native';
import { useClientTheme } from '../theme/ClientThemeContext';
import { messagesStylesByBrand } from './styles';

const CONTACT_GROUPS = [
  {
    id: 'staff',
    label: 'Admins & Staff',
    contacts: [
      { id: '1', name: 'Admin Bookly', role: 'Admin Bookly', initials: 'AB' },
      { id: '2', name: 'Lesly Stadelmann', role: 'Admin Bookly', initials: 'LS' },
      { id: '3', name: 'Mohamed bookly', role: 'Admin Bookly', initials: 'MB' },
      { id: '4', name: 'Madeleine GARNIER', role: 'Admin Bookly', initials: 'MG' },
      { id: '5', name: 'Gauthier GERARDIN', role: 'Admin Bookly', initials: 'GG' },
      { id: '6', name: 'test tets', role: 'Sous-Admin', initials: 'TT' },
    ],
  },
  {
    id: 'coowners',
    label: 'Co-propriétaires',
    contacts: [],
  },
  {
    id: 'employees',
    label: 'Mes employés',
    contacts: [],
  },
];

const REPORT_TYPES = ['Bug', 'Technique', 'Signalement', 'General', 'Extra', 'Client'];

export default function Messages() {
  const { partner, colors } = useClientTheme();
  const styles = messagesStylesByBrand[partner];

  const [activeTab, setActiveTab] = useState('messages');
  const [modalVisible, setModalVisible] = useState(null); // 'conversation' or 'report'
  const [modalTab, setModalTab] = useState('staff');
  const [reportType, setReportType] = useState('Bug');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const renderEmptyState = () => {
    const isMessages = activeTab === 'messages';
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          {isMessages ? (
            <MessageCircle size={24} color={colors.orange} />
          ) : (
            <FileText size={24} color={colors.orange} />
          )}
        </View>
        <Text style={styles.emptyTitle}>
          {isMessages ? 'Aucune conversation' : 'Aucun report'}
        </Text>
        <Text style={styles.emptySub}>
          {isMessages
            ? 'Cliquez sur + pour démarrer une nouvelle conversation.'
            : 'Sélectionnez une conversation ou créez-en un nouveau.'}
        </Text>
      </View>
    );
  };

  const renderConversationModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible === 'conversation'}
      onRequestClose={() => setModalVisible(null)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={styles.modalScrim}
          onPress={() => setModalVisible(null)}
        />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nouvelle conversation</Text>
            <Pressable onPress={() => setModalVisible(null)} style={styles.modalClose}>
              <X size={20} color="#888" />
            </Pressable>
          </View>

          <View style={styles.modalTabs}>
            {CONTACT_GROUPS.map(group => (
              <Pressable
                key={group.id}
                onPress={() => setModalTab(group.id)}
                style={[styles.modalTab, modalTab === group.id && styles.modalTabActive]}
              >
                <Text
                  style={[
                    styles.modalTabText,
                    modalTab === group.id && styles.modalTabTextActive,
                  ]}
                >
                  {group.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {CONTACT_GROUPS.find(g => g.id === modalTab)?.contacts.length > 0 ? (
              CONTACT_GROUPS.find(g => g.id === modalTab).contacts.map(contact => (
                <Pressable
                  key={contact.id}
                  style={styles.contactItem}
                  onPress={() => {
                    Alert.alert('Conversation', `Démarrer avec ${contact.name}`);
                    setModalVisible(null);
                  }}
                >
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactAvatarText}>{contact.initials}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactRole}>{contact.role}</Text>
                  </View>
                </Pressable>
              ))
            ) : (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <Text style={{ color: '#AAA', fontSize: 13 }}>Aucun contact disponible</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderReportModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible === 'report'}
      onRequestClose={() => setModalVisible(null)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={styles.modalScrim}
          onPress={() => setModalVisible(null)}
        />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nouveau report</Text>
            <Pressable onPress={() => setModalVisible(null)} style={styles.modalClose}>
              <X size={20} color="#888" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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
                      {type}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Sujet *</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez le sujet"
                placeholderTextColor="#BBB"
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Message *</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Votre message..."
                placeholderTextColor="#BBB"
                multiline
                numberOfLines={6}
                value={message}
                onChangeText={setMessage}
              />
            </View>

            <View style={styles.formActions}>
              <Pressable style={styles.cancelButton} onPress={() => setModalVisible(null)}>
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={styles.submitButton}
                onPress={() => {
                  if (!subject || !message) {
                    Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
                    return;
                  }
                  Alert.alert('Succès', 'Votre report a été envoyé.');
                  setModalVisible(null);
                  setSubject('');
                  setMessage('');
                }}
              >
                <Text style={styles.submitButtonText}>Envoyer</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.section}>
      <View style={styles.tabs}>
        <Pressable
          onPress={() => setActiveTab('messages')}
          style={[styles.tab, activeTab === 'messages' && styles.tabSelected]}
        >
          <Text style={[styles.tabText, activeTab === 'messages' && styles.tabTextSelected]}>
            Messages
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('reports')}
          style={[styles.tab, activeTab === 'reports' && styles.tabSelected]}
        >
          <Text style={[styles.tabText, activeTab === 'reports' && styles.tabTextSelected]}>
            Reports
          </Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={16} color="#BBB" />
          <TextInput
            placeholder="Rechercher..."
            placeholderTextColor="#BBB"
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

      <View style={styles.content}>{renderEmptyState()}</View>

      {renderConversationModal()}
      {renderReportModal()}
    </View>
  );
}
