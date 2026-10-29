// Source unique des libellés du retour de prestation (extra, client, admin).
// Check-lists par poste : fiches de prestation Staffly, édition 2026.
// Mirrors staffly-frontend/src/utils/retourChecklists.js.

export const DRINK_FIELDS = [
  { key: 'champagne', label: 'Champagne' },
  { key: 'vin_blanc', label: 'Vin blanc' },
  { key: 'vin_rouge', label: 'Vin rouge' },
  { key: 'vin_rose', label: 'Vin rosé' },
  { key: 'biere_blonde', label: 'Bière blonde' },
  { key: 'ipa', label: 'IPA' },
  { key: 'biere_brune', label: 'Bière brune' },
];

// Boissons à cocher, avec quantité obligatoire une fois cochées — stockées dans
// retour.boissons_cochees en JSON : { [key]: { checked: true, qty: 3 } }.
export const DRINK_CHECKBOXES = [
  { key: 'jus_orange', label: "Jus d'orange" },
  { key: 'jus_pomme', label: 'Jus de pomme' },
  { key: 'jus_pamplemousse', label: 'Jus de pamplemousse' },
  { key: 'coca_cola', label: 'Coca Cola' },
  { key: 'coca_cola_zero', label: 'Coca Cola Zéro' },
  { key: 'kefir', label: 'Kéfir' },
  { key: 'the_vert', label: 'Thé vert' },
  { key: 'pico_bello', label: 'Pico Bello' },
  { key: 'vin_rouge', label: 'Vin rouge' },
  { key: 'vin_blanc', label: 'Vin blanc' },
  { key: 'vin_rose', label: 'Vin rosé' },
  { key: 'ipa', label: 'IPA' },
  { key: 'triple_bertha_blanche', label: 'Triple Bertha Blanche' },
  { key: 'jungle_joy_blonde', label: 'Jungle Joy Blonde' },
  { key: 'lazy_panda', label: 'Lazy Panda' },
];

export const LEGACY_DRINK_CHECKBOXES = [
  { key: 'biere_sans_alcool', label: 'Bière sans alcool' },
  { key: 'vodka', label: 'Vodka' },
  { key: 'whisky', label: 'Whisky' },
  { key: 'gin', label: 'Gin' },
  { key: 'rhum', label: 'Rhum' },
  { key: 'tequila', label: 'Téquila' },
  { key: 'prosecco', label: 'Prosecco' },
  { key: 'aperol', label: 'Aperol' },
  { key: 'coca_cola', label: 'Coca Cola' },
  { key: 'coca_cola_zero', label: 'Coca Cola Zéro' },
  { key: 'schweppes', label: 'Schweppes' },
  { key: 'perrier', label: 'Perrier' },
  { key: 'jus_orange', label: "Jus d'orange" },
  { key: 'jus_pomme', label: 'Jus de pomme' },
];

// Check-list de fermeture — par poste, d'après les fiches de prestation
// Staffly (édition 2026). Une prestation peut compter plusieurs sections
// (avant/pendant/après, ou une structure plus simple selon le poste).
// Stockée dans retour.checklist_role_answers en JSON : { "s{section}_i{item}": true/false }.
export const CHECKLISTS_BY_ROLE = {
  MAITRE_HOTEL: {
    label: "Maître d'hôtel",
    sections: [
      {
        title: "Avant l'événement — Préparation & mise en place",
        items: [
          "Assister au briefing initial dispensé par le référent : affectation, zones, menu, timing et spécificités de l'événement.",
          'Prendre connaissance des pièces cocktail, de leur composition et des allergènes.',
          'Contrôler les quantités du stock boissons prévues pour la prestation, frigos compris.',
          "Vider les MK lorsque leur contenu n'est pas inclus dans la prestation événementielle.",
          'Contrôler la propreté et l\'état du matériel (verres, vaisselle, couteaux, platerie, ustensiles) et signaler au référent tout élément ébréché, usé ou sale.',
          "Préparer l'office : consommables, bacs de plonge, poubelles et zones de stockage.",
          'Dresser bar et buffets selon les standards Comet : rehausses, décoration, éléments scénographiques, signalétique et étiquetage des allergènes.',
          'Réaliser le dressage des pièces cocktail (nourriture) sur leurs supports : plateaux, ardoises, présentoirs, garnitures et finitions selon les fiches techniques.',
          'Réaliser la mise en glace des boissons et anticiper la rotation du froid.',
          "Sortir et dresser les pièces cocktail sur les buffets quelques minutes avant l'arrivée des invités afin de préserver le frais.",
        ],
      },
      {
        title: "Pendant l'événement — Service & qualité",
        items: [
          'Accueillir les convives et assurer passage plateau, buffet et service bar : sourire, posture et présentation irréprochable.',
          'Réassortir en continu pièces froides, chaudes, sucrées et boissons ; assurer la réchauffe au bon rythme.',
          'Maintenir les espaces clients parfaitement nets en roving clean : verres, serviettes, assiettes et planches.',
          'Surveiller la présentation visuelle des buffets et respecter les consignes de service.',
        ],
      },
      {
        title: "Après l'événement — Remise en état",
        items: [
          "Débarrasser l'ensemble du matériel de service et le rapatrier en office ; trier déchets et bouteilles selon la politique du site.",
          'Ranger les boissons non consommées et réapprovisionner les réfrigérateurs selon les normes du site (événement ou jour suivant).',
          'Nettoyer et désinfecter office, bar, postes de travail, cuisine et zones de stockage.',
          'Remettre en état buffets, MK, zones de présentation et décoration.',
          'Remettre le matériel en caisses et aux emplacements prévus (racks sécurisés).',
          'Participer au débrief rapide de fin de service mené par le référent.',
        ],
      },
    ],
  },
  MAITRE_HOTEL_REFERENT: {
    label: "Maître d'hôtel référent",
    sections: [
      {
        title: "Avant l'événement — Pilotage & checkpoint amont",
        items: [
          'Étudier la FDR : horaires, menus, fiches techniques et spécificités client.',
          'Se présenter au Responsable de Site interne ou à l\'EM référent et confirmer déroulé et timing.',
          'Briefer l\'équipe Staffly : rôles, zones, standards, sécurité et timing.',
          'Superviser la mise en place : buffets, office, signalétique, stocks, mise en froid et mise en glace.',
          'Vérifier la conformité : esthétique (rehausses, décoration), exactitude des labels et allergènes, quantités, selon les standards Comet.',
          'Réaliser le Checkpoint Amont en tour conjoint avec le Responsable de Site interne et faire valider buffets, stocks, signalétique, températures et timing.',
        ],
      },
      {
        title: "Pendant l'événement — Management & excellence",
        items: [
          'Tenir un poste au même titre que l\'équipe tout en assurant la fluidité générale du service.',
          "Ajuster la répartition de l'équipe en salle et gérer timing, demandes spécifiques, retards et aléas.",
          "Être l'interlocuteur opérationnel direct du Responsable de Site interne en l'absence de MH responsable.",
          'Garantir un réassort régulier et une propreté constante des espaces ouverts au public.',
          "Veiller au respect strict des règles d'hygiène HACCP et de sécurité alimentaire.",
          'Contrôler en continu la qualité : présentation des buffets, respect du frais, températures, posture et service.',
        ],
      },
      {
        title: "Fin d'événement — Clôture & feedback",
        items: [
          'Superviser débarrassage, tri et nettoyage complet des offices et de la cuisine.',
          "S'assurer du rangement et de la remise en état des MK ainsi que du réassort des boissons et des réfrigérateurs selon le site.",
          "Réaliser l'inventaire casse / perte et noter tout dysfonctionnement ou matériel manquant.",
          'Réaliser le Checkpoint Clôture & Feedback avec le référent du site Comet (EM référent ou SD) : heures réelles, consommations, remarques et photos de la remise en état des espaces back et front.',
          "Mener le débrief de fin de service avec l'équipe Staffly et remonter les informations utiles.",
        ],
      },
    ],
  },
  MAITRE_HOTEL_RESPONSABLE: {
    label: "Maître d'hôtel responsable",
    sections: [
      {
        title: 'Quand il intervient & horaires',
        items: [
          'Présent dès que plusieurs prestations se chevauchent ; son amplitude couvre du début du premier événement à la clôture du dernier, sans interruption.',
        ],
      },
      {
        title: 'Son rôle',
        items: [
          'Coordonner toutes les prestations du site et contrôler leur bon déroulé de la mise en place à la clôture.',
          "Appuyer immédiatement les référents en cas d'imprévu, retard ou surcharge.",
          "Être l'interlocuteur Comet sur la journée et présenter les référents au client lorsque Comet l'autorise.",
        ],
      },
    ],
  },
  CHEF_DE_RANG: {
    label: 'Chef de rang',
    sections: [
      {
        title: 'Avant le service',
        items: [
          "Dresser tables, couverts, verrerie, sel / poivre ; mettre en place le buffet, le pain et les bouteilles d'eau.",
          "Contrôler la propreté de la salle et le plan de salle avant l'arrivée des convives.",
        ],
      },
      {
        title: 'Pendant le service',
        items: [
          'Assurer le service au buffet et, selon le site, le service à la française.',
          'Réapprovisionner pain, buffets et eau en continu ; maintenir les espaces propres et exécuter les tâches confiées par le responsable restauration Comet.',
        ],
      },
      {
        title: 'Après le service',
        items: [
          'Débarrasser, redresser intégralement pour le service suivant, gérer les surplus et remettre la salle en état.',
        ],
      },
    ],
  },
  EQUIPIER_MK: {
    label: 'Agent MKR',
    sections: [
      {
        title: "Ce qu'il prend en charge",
        items: [
          'Réceptionner les livraisons et contrôler quantités et qualité.',
          'Surveiller les niveaux, appliquer la rotation FIFO et retirer les produits arrivés à DLC.',
          'Maintenir une présentation homogène et un étiquetage lisible ; alerter immédiatement en cas de rupture.',
          'Nettoyer, trier les déchets et remettre l\'espace en état.',
        ],
      },
    ],
  },
  COMMIS_SALLE: {
    label: 'Commis de salle',
    sections: [
      {
        title: 'En Micro Kitchen',
        items: [
          "Reprend l'intégralité du poste Agent MKR : réception des livraisons, contrôle des quantités et de la qualité.",
          'Surveille les niveaux, applique la rotation FIFO et retire les produits arrivés à DLC.',
          'Maintient une présentation homogène, un étiquetage lisible et alerte immédiatement en cas de rupture.',
          'Nettoie, trie les déchets et remet l\'espace en état.',
        ],
      },
      {
        title: 'En salle — service déjeuner',
        items: [
          'Dresser et redresser les tables : couverts, verrerie, eau, sel et poivre.',
          'Débarrasser en continu pendant le service et entre deux services.',
          'Réassortir et agrémenter les buffets ; réapprovisionner pain et boissons.',
          'Maintenir la salle nette et remettre les espaces en état après le service.',
        ],
      },
      {
        title: 'En cuisine',
        items: [
          'Dresser les plateaux avec le chef et le commis ; laver et préparer fruits et légumes.',
          "Suivre des cuissons simples et réaliser les tâches de base d'aide-commis.",
        ],
      },
    ],
  },
  MIXOLOGUE: {
    label: 'Mixologue',
    sections: [
      {
        title: 'Sur la prestation',
        items: [
          'Mettre en place le bar : verrerie, glace, fruits, garnitures et matériel.',
          'Réaliser cocktails avec et sans alcool, créations sur mesure, suivi des stocks et réassorts.',
          'Nettoyer, ranger et inventorier les bouteilles en fin de prestation.',
        ],
      },
      {
        title: 'Atelier de mixologie — en option',
        items: [
          'Animer un atelier en petit groupe ou format tournant ; démontrer les techniques et accompagner les participants.',
        ],
      },
    ],
  },
  BARISTA: {
    label: 'Barista',
    sections: [
      {
        title: 'Sur la prestation',
        items: [
          'Mettre en place le corner : machine, moulin, réglages, lait, sirops et verrerie.',
          'Extraire les espressos, ajuster la mouture et réaliser cappuccino, latte, flat white et alternatives selon l’offre.',
          'Nettoyer la machine, ranger et remettre le corner en état.',
        ],
      },
    ],
  },
};

// Codes de qualification qui partagent la check-list d'un autre code.
export const ROLE_ALIASES = {
  MK_POLYVALENT_DTD: 'COMMIS_SALLE',
  COMMIS_DE_SALLE: 'COMMIS_SALLE',
};

export const PHOTO_CATEGORIES = [
  'Salle',
  'Bar',
  'Plonge',
  'Micro-kitchen',
  'Frigo',
];
