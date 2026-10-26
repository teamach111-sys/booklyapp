import { useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ArrowLeft,
  ClipboardList,
  MessageSquare,
  Send,
  Smile,
  Star,
  UtensilsCrossed,
} from 'lucide-react-native';
import { colors } from '../../../styles';
import { retourPrestation as styles } from './styles';

export default function RetourPrestation({ mission, onBack, onSubmitted }) {
  const [restesAlimentaires, setRestesAlimentaires] = useState('');
  const [satisfactionNote, setSatisfactionNote] = useState(0);
  const [satisfactionCommentaire, setSatisfactionCommentaire] = useState('');
  const [compteRenduGeneral, setCompteRenduGeneral] = useState('');
  const [checklistProblemes, setChecklistProblemes] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSend() {
    if (satisfactionNote === 0) {
      Alert.alert(
        'Note requise',
        "La note de satisfaction (1 à 5 étoiles) est obligatoire avant l'envoi du retour.",
      );
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsSent(true);
      Alert.alert(
        'Retour envoyé',
        'Votre compte rendu de prestation a été transmis avec succès.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (onSubmitted) {
                onSubmitted({
                  missionId: mission?.id,
                  satisfactionNote,
                  satisfactionCommentaire,
                  restesAlimentaires,
                  compteRenduGeneral,
                  checklistProblemes,
                });
              } else if (onBack) {
                onBack();
              }
            },
          },
        ],
      );
    }, 400);
  }

  const missionTitle = mission?.prestation_nom || mission?.title || '';

  return (
    <View>
      {/* Header matching screenshot-2 */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            borderWidth: 1.5,
            borderColor: '#e0d0c8',
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 14,
            backgroundColor: 'transparent',
          }}
        >
          <ArrowLeft size={13} color="#888" />
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#888',
            }}
          >
            Retour
          </Text>
        </Pressable>

        <View style={{ flex: 1, minWidth: 150 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              color: colors.brown,
              fontFamily: 'serif',
            }}
          >
            Retour prestation — {missionTitle}
          </Text>
        </View>

        <View style={isSent ? styles.badgeEnvoye : styles.badgeAttendu}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: 'bold',
              color: isSent ? '#2e7d32' : '#f57f17',
            }}
          >
            {isSent ? 'Envoyé' : 'Attendu'}
          </Text>
        </View>
      </View>

      {/* 1. RESTES ALIMENTAIRES */}
      <View style={styles.card}>
        <View style={styles.cardTitle}>
          <UtensilsCrossed size={14} color={colors.brown} />
          <Text style={styles.cardTitleText}>Restes alimentaires</Text>
        </View>
        <Text style={styles.inputLabel}>Commentaire libre</Text>
        <TextInput
          editable={!isSent}
          multiline
          numberOfLines={4}
          onChangeText={setRestesAlimentaires}
          placeholder="Indiquer s'il y avait trop ou pas assez de nourriture, ce qu'il restait en fin de prestation, les quantités approximatives, les produits les plus consommés ainsi que toute information utile pour améliorer les prochaines prestations."
          placeholderTextColor="#bbb"
          style={styles.textArea}
          value={restesAlimentaires}
        />
      </View>

      {/* 2. SATISFACTION DU CLIENT */}
      <View style={styles.card}>
        <View style={styles.cardTitle}>
          <Smile size={14} color={colors.brown} />
          <Text style={styles.cardTitleText}>Satisfaction du client</Text>
          <View style={styles.badgeRequired}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#f57f17' }}>
              Obligatoire
            </Text>
          </View>
        </View>

        <Text style={styles.inputLabel}>Note de 1 à 5 étoiles</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map(star => {
            const filled = star <= satisfactionNote;
            return (
              <Pressable
                key={star}
                accessibilityLabel={`${star} étoile${star > 1 ? 's' : ''}`}
                accessibilityRole="button"
                disabled={isSent}
                onPress={() => setSatisfactionNote(star)}
                style={styles.starButton}
              >
                <Star
                  color={filled ? '#f59e0b' : '#e0d0c8'}
                  fill={filled ? '#f59e0b' : 'none'}
                  size={24}
                />
              </Pressable>
            );
          })}
        </View>

        {satisfactionNote === 0 && (
          <Text style={styles.starHelperText}>
            Le retour ne peut pas être envoyé tant que la note n'est pas renseignée.
          </Text>
        )}

        <Text style={styles.inputLabel}>Commentaire complémentaire</Text>
        <TextInput
          editable={!isSent}
          multiline
          numberOfLines={3}
          onChangeText={setSatisfactionCommentaire}
          placeholder="Précisions sur la satisfaction du client..."
          placeholderTextColor="#bbb"
          style={styles.textArea}
          value={satisfactionCommentaire}
        />
      </View>

      {/* 3. RETOUR GLOBAL */}
      <View style={styles.card}>
        <View style={styles.cardTitle}>
          <MessageSquare size={14} color={colors.brown} />
          <Text style={styles.cardTitleText}>Retour global</Text>
        </View>
        <Text style={styles.inputLabel}>Compte rendu général de la prestation</Text>
        <TextInput
          editable={!isSent}
          multiline
          numberOfLines={4}
          onChangeText={setCompteRenduGeneral}
          placeholder="Déroulé général, incidents éventuels, points d'amélioration, remarques sur l'équipe et l'organisation..."
          placeholderTextColor="#bbb"
          style={styles.textArea}
          value={compteRenduGeneral}
        />
      </View>

      {/* 4. CHECK-LIST DE FERMETURE */}
      <View style={styles.card}>
        <View style={styles.cardTitle}>
          <ClipboardList size={14} color={colors.brown} />
          <Text style={styles.cardTitleText}>Check-list de fermeture</Text>
        </View>
        <Text style={styles.checklistEmpty}>
          Aucune check-list définie pour ce poste.
        </Text>
        <Text style={styles.inputLabel}>
          Commentaire si une étape n'a pas pu être réalisée
        </Text>
        <TextInput
          editable={!isSent}
          multiline
          numberOfLines={3}
          onChangeText={setChecklistProblemes}
          placeholder="Ex. : réapprovisionnement micro-kitchens impossible, stock non livré."
          placeholderTextColor="#bbb"
          style={styles.textArea}
          value={checklistProblemes}
        />
      </View>

      {/* 5. Sticky Bottom Summary Bar */}
      <View style={styles.stickyBottom}>
        <Text style={styles.summaryText}>
          Satisfaction client :{' '}
          {satisfactionNote > 0 ? (
            <Text style={{ fontWeight: 'bold' }}>{satisfactionNote}/5</Text>
          ) : (
            '——'
          )}{' '}
          · Check-list : <Text style={{ fontWeight: 'bold' }}>0/0 étapes</Text>
        </Text>

        {!isSent ? (
          <Pressable
            accessibilityRole="button"
            disabled={submitting}
            onPress={handleSend}
            style={[
              styles.btnSend,
              satisfactionNote === 0 && styles.btnSendDisabled,
            ]}
          >
            <Send size={13} color={colors.white} />
            <Text style={styles.btnSendText}>
              {submitting ? 'Envoi...' : 'Envoyer le retour'}
            </Text>
          </Pressable>
        ) : (
          <View
            style={[
              styles.btnSend,
              { backgroundColor: '#2e7d32', opacity: 1 },
            ]}
          >
            <Text style={styles.btnSendText}>Retour déjà envoyé</Text>
          </View>
        )}
      </View>
    </View>
  );
}
