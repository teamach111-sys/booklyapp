const colors = {
  background: '#FDF5E4',
  white: '#FFFFFF',
  cream: '#FFF9EE',
  brown: '#4A3222',
  muted: '#6B584C',
  orange: '#D47A31',
  orangeDark: '#B9622C',
  border: '#EBDCC0',
  palePink: '#F7E7DE',
  gold: '#F4CC73',
  green: '#1A6C38',
  accent: '#C18855',
  success: '#15803D',
  successLight: '#DCFCE7',
  successBorder: '#BBF7D0',
  successDot: '#22C55E',
  divider: '#ECDDD6',
};

const fontFamilies = {
  regular: 'Inter-Regular',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  extraBold: 'Inter-ExtraBold',
  black: 'Inter-Black',
};

const typography = {
  h1: {
    fontFamily: fontFamilies.black,
    fontWeight: 'normal',
    fontSize: 39,
    lineHeight: 42,
    letterSpacing: -1.8,
  },
  h2: {
    fontFamily: fontFamilies.bold,
    fontWeight: 'normal',
    fontSize: 15,
    lineHeight: 25,
  },
  h3: {
    fontFamily: fontFamilies.bold,
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 26,
  },
  p: {
    regular: {
      fontFamily: fontFamilies.regular,
      fontSize: 11,
      fontWeight: 'normal',
      lineHeight: 18,
    },
    label: {
      fontFamily: fontFamilies.semiBold,
      fontSize: 12,
      fontWeight: 'normal',
    },
    labelBold: {
      fontFamily: fontFamilies.bold,
      fontSize: 12,
      fontWeight: 'normal',
    },
    formLabel: {
      fontFamily: fontFamilies.semiBold,
      fontSize: 13,
      fontWeight: 'normal',
    },
    field: {
      fontFamily: fontFamilies.regular,
      fontSize: 14,
      fontWeight: 'normal',
    },
    fieldLarge: {
      fontFamily: fontFamilies.regular,
      fontSize: 15,
      fontWeight: 'normal',
    },
    button: {
      fontFamily: fontFamilies.extraBold,
      fontSize: 14,
      fontWeight: 'normal',
      textAlign: 'center',
    },
    buttonSecondary: {
      fontFamily: fontFamilies.bold,
      fontSize: 12,
      fontWeight: 'normal',
    },
    brand: {
      fontFamily: fontFamilies.black,
      fontSize: 24,
      fontWeight: 'normal',
      letterSpacing: -0.8,
    },
    checkbox: {
      fontFamily: fontFamilies.bold,
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: 15,
    },
  },
};

const theme = {
  colors,
  fontFamilies,
  typography,
  layout: {
    homeContent: {
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 15,
      gap: 22,
    },
    authContent: {
      headerContentGap: 13,
      paddingBottom: 13,
    },
  },
  buttons: {
    disabled: {
      opacity: 0.55,
    },
    big: {
      minHeight: 48,
      borderRadius: 24,
      backgroundColor: colors.orange,
      text: typography.p.button,
    },
    small: {
      minHeight: 40,
      borderRadius: 24,
      backgroundColor: colors.white,
      borderColor: colors.border,
      text: typography.p.label,
    },
    bigSecondary: {
      minHeight: 48,
      borderRadius: 24,
      backgroundColor: colors.white,
      borderColor: colors.border,
      text: typography.p.buttonSecondary,
    },
  },
  elements: {
    header: {
      height: 52,
      brand: {
        color: colors.orange,
        ...typography.p.brand,
      },
      loginText: {
        color: colors.orangeDark,
        ...typography.p.labelBold,
      },
    },
    home: {
      heroTitle: {
        color: colors.brown,
        ...typography.h1,
      },
      heroAccent: {
        color: colors.accent,
        ...typography.h1,
      },
      sectionTitle: {
        color: colors.brown,
        ...typography.h2,
      },
      cardTitle: {
        color: colors.brown,
        ...typography.h2,
      },
      talentName: {
        color: colors.brown,
        ...typography.h3,
      },
      body: {
        color: colors.muted,
        ...typography.p.regular,
      },
    },
    login: {
      title: {
        color: colors.brown,
        ...typography.h2,
      },
      description: {
        color: colors.muted,
        ...typography.p.fieldLarge,
      },
      label: {
        color: colors.brown,
        ...typography.p.formLabel,
      },
      input: {
        color: colors.brown,
        backgroundColor: colors.cream,
        borderColor: colors.border,
        ...typography.p.field,
      },
      submitButton: {
        marginTop: 12,
      },
    },
    forgotPassword: {
      input: {
        marginBottom: 0,
      },
      submitButton: {
        marginTop: 12,
      },
      divider: {
        height: 1,
        marginTop: 24,
        marginBottom: 18,
        backgroundColor: colors.border,
      },
      returnButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 8,
      },
      returnText: {
        color: colors.orangeDark,
        ...typography.p.label,
      },
    },
    clientRegister: {
      title: {
        color: colors.brown,
        ...typography.h2,
      },
      form: {
        marginTop: 28,
        paddingBottom: 24,
      },
      sectionTitle: {
        marginTop: 8,
        marginBottom: 12,
        color: colors.muted,
        ...typography.p.formLabel,
      },
      field: {
        marginBottom: 4,
      },
      optional: {
        color: colors.muted,
        ...typography.p.regular,
      },
      helperText: {
        marginTop: 4,
        marginBottom: 12,
        color: colors.muted,
        ...typography.p.regular,
      },
      selectButton: {
        minHeight: 46,
        marginTop: 12,
        marginBottom: 14,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: colors.cream,
      },
      selectText: {
        color: colors.brown,
        ...typography.p.field,
      },
      optionList: {
        marginTop: -8,
        marginBottom: 14,
        padding: 4,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: colors.white,
      },
      option: {
        minHeight: 40,
        marginTop: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
      },
      selectedOption: {
        backgroundColor: colors.cream,
      },
      optionText: {
        color: colors.brown,
        ...typography.p.regular,
      },
      siteRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      siteInput: {
        flex: 1,
        marginBottom: 12,
      },
      removeSiteButton: {
        width: 38,
        height: 38,
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        backgroundColor: colors.white,
      },
      addSiteButton: {
        alignSelf: 'flex-start',
        marginTop: 12,
        marginBottom: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: colors.orange,
        borderStyle: 'dashed',
        borderRadius: 10,
      },
      addSiteText: {
        color: colors.orange,
        ...typography.p.label,
      },
      submitButton: {
        marginTop: 12,
      },
      footer: {
        marginTop: 18,
        alignItems: 'center',
      },
      footerText: {
        color: colors.muted,
        ...typography.p.regular,
      },
      footerLink: {
        marginTop: 12,
        color: colors.orangeDark,
        ...typography.p.labelBold,
      },
    },
    extraRegister: {
      form: {
        marginTop: 24,
        paddingBottom: 28,
      },
      description: {
        marginTop: 6,
        marginBottom: 18,
        color: colors.muted,
        ...typography.p.regular,
      },
      skillsLead: {
        marginTop: 0,
        marginBottom: 18,
        color: colors.muted,
        ...typography.p.regular,
      },
      questionnaireQualification: {
        marginBottom: 16,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderLeftWidth: 3,
        borderLeftColor: colors.orange,
        borderRadius: 8,
        backgroundColor: colors.cream,
        color: colors.orange,
        ...typography.p.labelBold,
      },
      questionCard: {
        marginBottom: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: colors.cream,
      },
      questionText: {
        marginBottom: 12,
        color: colors.brown,
        ...typography.p.labelBold,
      },
      questionAnswers: {
        gap: 8,
      },
      questionAnswer: {
        minHeight: 42,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 9,
        backgroundColor: colors.white,
      },
      selectedQuestionAnswer: {
        borderColor: colors.orange,
        backgroundColor: colors.palePink,
      },
      questionAnswerLetter: {
        color: colors.orangeDark,
        ...typography.p.labelBold,
      },
      selectedQuestionAnswerLetter: {
        color: colors.orange,
      },
      questionAnswerText: {
        flex: 1,
        color: colors.brown,
        ...typography.p.regular,
      },
      eligibilityOptions: {
        marginTop: 16,
      },
      selectArrowOpen: {
        transform: [{ rotate: '180deg' }],
      },
      progressTrack: {
        height: 5,
        marginTop: 18,
        marginBottom: 20,
        overflow: 'hidden',
        borderRadius: 3,
        backgroundColor: colors.border,
      },
      progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: colors.orange,
      },
      optionCard: {
        minHeight: 62,
        marginBottom: 10,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        backgroundColor: colors.white,
      },
      selectedOptionCard: {
        borderColor: colors.orange,
        backgroundColor: colors.cream,
      },
      optionTitle: {
        color: colors.brown,
        ...typography.p.labelBold,
      },
      optionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.palePink,
      },
      optionCopy: {
        flex: 1,
        gap: 3,
      },
      optionDescription: {
        color: colors.muted,
        ...typography.p.regular,
      },
      notice: {
        marginBottom: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.gold,
        borderRadius: 12,
        backgroundColor: colors.cream,
      },
      noticeTitle: {
        marginBottom: 5,
        color: colors.orangeDark,
        ...typography.p.labelBold,
      },
      noticeIcon: {
        alignSelf: 'center',
        marginBottom: 12,
      },
      noticeHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      noticeBody: {
        marginTop: 10,
        color: colors.muted,
        ...typography.p.regular,
        lineHeight: 23,
      },
      noticeFootnote: {
        marginTop: 14,
        marginBottom: 0,
      },
      noticeText: {
        color: colors.muted,
        ...typography.p.regular,
      },
      choice: {
        minHeight: 44,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: colors.white,
      },
      choiceList: {
        gap: 8,
      },
      choiceField: {
        marginBottom: 17,
      },
      selectedChoice: {
        borderColor: colors.orange,
        backgroundColor: colors.cream,
      },
      choiceText: {
        color: colors.brown,
        ...typography.p.regular,
      },
      languageOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
      },
      languageButton: {
        minHeight: 38,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 20,
        backgroundColor: colors.white,
      },
      selectedLanguageButton: {
        borderColor: colors.orange,
        backgroundColor: colors.orange,
      },
      languageButtonText: {
        color: colors.brown,
        ...typography.p.regular,
      },
      selectedLanguageButtonText: {
        color: colors.white,
      },
      documentSection: {
        marginTop: 18,
        marginBottom: 8,
        color: colors.orangeDark,
        ...typography.p.formLabel,
      },
      documentButton: {
        minHeight: 54,
        marginBottom: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
        borderRadius: 12,
        backgroundColor: colors.white,
      },
      documentTitle: {
        color: colors.brown,
        ...typography.p.label,
      },
      documentCopy: {
        flex: 1,
        gap: 3,
      },
      documentStatus: {
        color: colors.muted,
        ...typography.p.regular,
      },
      qualificationGrid: {
        gap: 9,
      },
      qualificationCard: {
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: colors.white,
      },
      selectedQualification: {
        borderColor: colors.orange,
        backgroundColor: colors.cream,
      },
      skillRow: {
        marginBottom: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: colors.white,
      },
      skillDescription: {
        color: colors.muted,
        ...typography.p.regular,
      },
      starRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      starButton: {
        padding: 2,
      },
      summary: {
        marginBottom: 16,
        padding: 14,
        gap: 8,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: colors.cream,
      },
      summaryTitle: {
        color: colors.brown,
        ...typography.p.labelBold,
      },
      summaryText: {
        color: colors.muted,
        ...typography.p.regular,
      },
      consentText: {
        flex: 1,
        color: colors.brown,
        ...typography.p.regular,
      },
      consentRow: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      },
      consentBox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 5,
        backgroundColor: colors.white,
      },
      consentBoxChecked: {
        borderColor: colors.orange,
        backgroundColor: colors.orange,
      },
      footerButtons: {
        marginTop: 24,
        flexDirection: 'row',
        gap: 10,
      },
      footerButton: {
        flex: 1,
      },
      success: {
        alignItems: 'center',
        paddingTop: 32,
        paddingBottom: 40,
        gap: 14,
      },
      successTitle: {
        color: colors.brown,
        ...typography.h2,
      },
      successText: {
        color: colors.muted,
        ...typography.p.regular,
      },
      successItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      successButton: {
        alignSelf: 'stretch',
        marginTop: 10,
      },
      blockedBackButton: {
        marginTop: 12,
      },
    },
  },
};

export default theme;
