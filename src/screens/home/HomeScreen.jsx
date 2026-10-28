/**
 * =====================================================================
 * INVENTORY WIRING SPECIFICATION (staffly-frontend/inventory.md)
 * =====================================================================
 * ### Screen: Home Landing Page
 * **Associated Route/Context**: `/`  
 * **Total Discovered Backend Calls**: 1
 * 
 * | Line | Trigger / User Action | Handler Function | Method | Endpoint | Payload / Params | Auth Mode | Certainty |
 * | :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: |
 * | [`Home.jsx:158`](file:///C:/Users/Workspace/staffly-frontend/src/pages/Home.jsx#L158) | Form Submit / Create Button (`handleSubmit`) | `handleSubmit` | `POST` | `CONTACT_API_URL` | `None` | Public (No auth) | Inferred / Dynamic |
 * 
 * =====================================================================
 */
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  Text as NativeText,
  View,
} from 'react-native';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  Star,
  Store,
} from 'lucide-react-native';
import PrimaryButton from '../../components/PrimaryButton';
import AuthLayout from '../auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { getDashboardRoute } from '../../utils/Authstorage';
import {
  clickableStyles,
  contentStyles as styles,
  headerStyles,
  iconStyles,
  navigationStyles,
  typography,
} from '../../styles';

function Text({ style, ...props }) {
  return <NativeText {...props} style={[typography.body.regular, style]} />;
}

const roles = [
  ['Barista', '#B9622C'],
  ['Mixologue', '#4A3222'],
  ['Chef de rang', '#2D5A43'],
  ['Sommelier', '#7A3E65'],
  ['Chef de partie', '#D47A31'],
  ['Cuisinier', '#B9622C'],
  ['Commis', '#436436'],
  ['Serveur', '#4A3222'],
  ['Barman', '#D47A31'],
  ['Plongeur', '#405B6B'],
  ["Maître d'hôtel", '#823329'],
  ['Runner', '#59533B'],
];

const clientBenefits = [
  'Profils vérifiés par notre équipe',
  'Disponibilité en temps réel dans votre zone',
  'Gestion administrative et facturation simplifiée',
  'Suivi des prestations et évaluations croisées',
  'Historique complet des collaborations',
];

const extraBenefits = [
  'Prestations géolocalisées près de chez vous',
  'Disponible par défaut — marquez juste vos indisponibilités',
  'Paiement rapide et suivi de facturation intégré',
  'Accès prioritaire aux prestations urgentes',
];

const talents = [
  {
    initials: 'SL',
    name: 'Sophie Laurent',
    role: 'Barista & Service',
    rating: '4.9',
    missions: '87 prestations',
    experience: "3 ans d'expérience",
    featured: true,
  },
  {
    initials: 'KB',
    name: 'Karim Bensalem',
    role: 'Mixologue & Bar',
    rating: '5.0',
    missions: '114 prestations',
    experience: "5 ans d'expérience",
  },
];

const steps = [
  {
    title: 'Postez votre besoin',
    description:
      'Précisez la date, les horaires et le profil recherché en 2 minutes.',
  },
  {
    title: 'Match instantané',
    description: 'Des talents certifiés et disponibles répondent rapidement.',
  },
  {
    title: 'Prestation validée',
    description:
      'Assurance incluse et gestion administrative 100% automatisée.',
  },
];

const faqs = [
  {
    question: 'Comment trouver un extra qualifié ?',
    answer:
      'Inscrivez votre établissement gratuitement, déposez une demande en 2 minutes en renseignant le poste et les horaires. Bookly vous propose les profils validés disponibles dans votre secteur.',
  },
  {
    question: 'Les extras sont-ils couverts par une assurance ?',
    answer:
      'Oui, chaque mission Bookly inclut automatiquement une assurance responsabilité civile professionnelle (RC Pro) via notre partenaire AXA.',
  },
  {
    question: 'Comment fonctionne la facturation ?',
    answer:
      'Bookly centralise la contractualisation et la facturation. Vous recevez une seule facture récapitulative téléchargeable sur votre tableau de bord, conforme à toutes les obligations légales.',
  },
];

function SectionTitle({ children, right }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {right || null}
    </View>
  );
}

function BenefitList({ items }) {
  return (
    <View style={styles.benefits}>
      {items.map(item => (
        <View key={item} style={styles.benefitRow}>
          <CheckCircle2 size={14} color="#D47A31" strokeWidth={1.8} />
          <Text style={styles.benefitText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function TalentCard({ talent }) {
  return (
    <View style={styles.talentCard}>
      <View style={styles.talentTop}>
        <View style={styles.talentIdentity}>
          <View
            style={[
              styles.talentAvatar,
              talent.featured ? styles.featuredAvatar : styles.regularAvatar,
            ]}
          >
            <Text
              style={[
                styles.talentInitials,
                !talent.featured && styles.regularInitials,
              ]}
            >
              {talent.initials}
            </Text>
          </View>
          <View style={styles.talentNameBlock}>
            <View style={styles.talentNameRow}>
              <Text style={styles.talentName}>{talent.name}</Text>
              <BadgeCheck size={15} color="#D47A31" strokeWidth={2} />
            </View>
            <Text style={styles.talentRole}>{talent.role}</Text>
          </View>
        </View>
        <View style={styles.certifiedBadge}>
          <View style={iconStyles.certifiedDot} />
          <Text style={styles.certifiedText}>Certifié</Text>
        </View>
      </View>
      <View style={styles.talentStats}>
        <Text style={styles.talentRating}>{talent.rating}</Text>
        <Star size={13} color="#F4CC73" fill="#F4CC73" strokeWidth={1.5} />
        <Text style={styles.statDivider}>|</Text>
        <Text style={styles.talentStat}>{talent.missions}</Text>
        <Text style={styles.statDivider}>|</Text>
        <Text style={styles.talentStat}>{talent.experience}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { isAuthenticated, user } = useAuth();
  const dashboardRoute = isAuthenticated ? getDashboardRoute(user?.role) : null;

  const [openFaqs, setOpenFaqs] = useState([]);
  const [tickerWidth, setTickerWidth] = useState(0);
  const tickerOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!tickerWidth) {
      return undefined;
    }

    const ticker = Animated.loop(
      Animated.timing(tickerOffset, {
        toValue: -tickerWidth,
        duration: 24000,
        useNativeDriver: true,
      }),
    );
    ticker.start();

    return () => ticker.stop();
  }, [tickerOffset, tickerWidth]);

  const toggleFaq = index => {
    setOpenFaqs(current =>
      current.includes(index)
        ? current.filter(openIndex => openIndex !== index)
        : [...current, index],
    );
  };

  return (
    <AuthLayout
      contentStyle={styles.layoutContent}
      headerAction={
        dashboardRoute ? (
          <Pressable
            accessibilityLabel="Accéder à mon espace"
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate(dashboardRoute, {
                partner: user?.platform_partner,
              })
            }
            style={({ pressed }) => [
              headerStyles.dashboardButton,
              pressed && headerStyles.dashboardButtonPressed,
            ]}
          >
            <LayoutDashboard color="#FFFFFF" size={14} strokeWidth={2.5} />
            <Text numberOfLines={1} style={headerStyles.dashboardText}>
              Accéder à mon espace
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={headerStyles.loginButton}
          >
            <Text style={headerStyles.loginText}>Connexion</Text>
          </Pressable>
        )
      }
    >
      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.hero}>
            <View style={styles.heroBadge}>
              <View style={iconStyles.orangeDot} />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                style={styles.heroBadgeText}
              >
                PLATEFORME DE PLACEMENT D’EXTRAS AUTO-ENTREPRENEURS
              </Text>
            </View>
            <Text style={styles.heroTitle}>
              Le bon talent,{'\n'}au bon moment,{'\n'}
              <Text style={styles.heroAccent}>partout en France.</Text>
            </Text>
            <Text style={styles.heroDescription}>
              Bookly connecte en temps réel les entreprises avec des extras
              qualifiés et vérifiés. Déposez votre prestation et recevez des
              candidatures en quelques minutes.
            </Text>

            <View style={styles.heroActions}>
              <PrimaryButton
                icon={
                  <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.5} />
                }
                onPress={() => navigation.navigate('ClientRegister')}
                title="Trouver du personnel"
              />
              <Pressable
                onPress={() => navigation.navigate('ExtraRegister')}
                style={clickableStyles.bigSecondary}
              >
                <Text style={clickableStyles.bigSecondaryText}>
                  Devenir extra partenaire
                </Text>
              </Pressable>
            </View>

            <View style={styles.socialProof}>
              <View style={styles.avatarStack}>
                {[
                  ['SR', '#4A3222', '#FFFFFF'],
                  ['MA', '#6B4A35', '#FFFFFF'],
                  ['JD', '#B9622C', '#FFFFFF'],
                  ['KL', '#D47A31', '#FFFFFF'],
                  ['PB', '#F4CC73', '#4A3222'],
                ].map(([initials, backgroundColor, color], index) => (
                  <View
                    key={initials}
                    style={[
                      styles.smallAvatar,
                      { backgroundColor, zIndex: 5 - index },
                    ]}
                  >
                    <Text style={[styles.smallAvatarText, { color }]}>
                      {initials}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.ratingBlock}>
                <View style={styles.ratingStars}>
                  {[0, 1, 2, 3, 4].map(star => (
                    <Star
                      key={star}
                      size={15}
                      color="#F4CC73"
                      fill="#F4CC73"
                      strokeWidth={1.5}
                    />
                  ))}
                </View>
                <Text style={styles.ratingCaption}>
                  <Text style={styles.ratingCaptionStrong}>+1000 extras</Text>
                  {' inscrits · 4.9/5 de satisfaction'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.rolesSection}>
            <SectionTitle>Métiers à la demande</SectionTitle>
            <View style={styles.tickerWindow}>
              <Animated.View
                style={[
                  styles.tickerTrack,
                  { transform: [{ translateX: tickerOffset }] },
                ]}
              >
                {[0, 1].map(copy => (
                  <View
                    key={copy}
                    onLayout={
                      copy === 0
                        ? event => {
                            const width = event.nativeEvent.layout.width;
                            if (width !== tickerWidth) {
                              setTickerWidth(width);
                            }
                          }
                        : undefined
                    }
                    style={styles.roleGroup}
                  >
                    {roles.map(([role, color]) => (
                      <View key={role} style={styles.rolePill}>
                        <Text style={[styles.roleText, { color }]}>{role}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </Animated.View>
            </View>
          </View>

          <View style={styles.statsPanel}>
            {[
              ['8 560+', 'Missions'],
              ['1 000+', 'Extras vérifiés'],
              ['98%', 'Satisfaction'],
              ['24/7', 'Assistance'],
            ].map(([value, label]) => (
              <View key={label} style={styles.statItem}>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <SectionTitle>Bookly s'adapte à vos besoins</SectionTitle>

            <View style={styles.infoCard}>
              <View style={styles.categoryBadge}>
                <View style={iconStyles.orangeDot} />
                <Text style={styles.categoryBadgeText}>
                  ENTREPRISES &amp; CLIENTS
                </Text>
              </View>
              <View style={styles.cardHeading}>
                <View style={iconStyles.iconTile}>
                  <Store size={21} color="#B9622C" strokeWidth={1.8} />
                </View>
                <Text style={styles.cardTitle}>
                  Renforcez vos équipes à la demande
                </Text>
              </View>
              <Text style={styles.cardDescription}>
                Accédez à un vivier de profils vérifiés, disponibles en temps
                réel dans votre ville. Créez votre prestation en 2 minutes et
                recevez des candidatures qualifiées sans effort.
              </Text>
              <BenefitList items={clientBenefits} />
              <PrimaryButton
                icon={
                  <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.5} />
                }
                onPress={() => navigation.navigate('ClientRegister')}
                title="Créer un compte client"
              />
            </View>

            <View style={styles.infoCard}>
              <View style={styles.categoryBadge}>
                <View style={iconStyles.orangeDot} />
                <Text style={styles.categoryBadgeText}>
                  EXTRAS &amp; AUTO ENTREPRENEURS
                </Text>
              </View>
              <View style={styles.cardHeading}>
                <View style={[iconStyles.iconTile, iconStyles.extraIconTile]}>
                  <BriefcaseBusiness
                    size={20}
                    color="#B9622C"
                    strokeWidth={1.8}
                  />
                </View>
                <Text style={styles.cardTitle}>
                  Des prestations qui correspondent à votre profil
                </Text>
              </View>
              <Text style={styles.cardDescription}>
                Gérez vos indisponibilités, recevez des offres ciblées selon vos
                qualifications, construisez votre réputation et augmentez vos
                revenus en toute flexibilité.
              </Text>
              <BenefitList items={extraBenefits} />
              <Pressable
                onPress={() => navigation.navigate('ExtraRegister')}
                style={clickableStyles.bigSecondary}
              >
                <Text style={clickableStyles.bigSecondaryText}>
                  Devenir extra
                </Text>
                <ArrowRight size={16} color="#B9622C" strokeWidth={2} />
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <SectionTitle
              right={<Text style={styles.sectionAside}>Profils vérifiés</Text>}
            >
              Talents à la une
            </SectionTitle>
            <View style={styles.cardList}>
              {talents.map(talent => (
                <TalentCard key={talent.initials} talent={talent} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <SectionTitle
              right={
                <View style={styles.sectionAsideWithDot}>
                  <View style={iconStyles.availabilityDot} />
                  <Text style={styles.availabilityText}>
                    Simple &amp; Rapide
                  </Text>
                </View>
              }
            >
              Comment ça marche ?
            </SectionTitle>
            <View style={styles.cardList}>
              {steps.map((step, index) => (
                <View key={step.title} style={styles.stepCard}>
                  <View style={iconStyles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stepCopy}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDescription}>
                      {step.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.faqSection}>
            <SectionTitle>Questions fréquentes</SectionTitle>
            <View style={styles.cardList}>
              {faqs.map((faq, index) => {
                const isOpen = openFaqs.includes(index);
                return (
                  <Pressable
                    key={faq.question}
                    onPress={() => toggleFaq(index)}
                    style={styles.faqCard}
                  >
                    <View style={styles.faqQuestionRow}>
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                      <ChevronDown
                        size={20}
                        color="#B9622C"
                        strokeWidth={2}
                        style={isOpen ? iconStyles.faqChevronOpen : undefined}
                      />
                    </View>
                    {isOpen ? (
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={navigationStyles.bottomNavigation}>
          <Pressable
            onPress={() => navigation.navigate('ClientRegister')}
            style={navigationStyles.bottomTab}
          >
            <Store size={18} color="#6B584C" strokeWidth={1.8} />
            <Text style={navigationStyles.bottomTabText}>Espace client</Text>
          </Pressable>
          <View style={navigationStyles.tabDivider} />
          <Pressable
            onPress={() => navigation.navigate('ExtraRegister')}
            style={navigationStyles.bottomTab}
          >
            <BadgeCheck size={18} color="#6B584C" strokeWidth={1.8} />
            <Text style={navigationStyles.bottomTabText}>Devenir extra</Text>
          </Pressable>
        </View>
      </View>
    </AuthLayout>
  );
}
