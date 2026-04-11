const en = {
  appName: 'Àràbìrín',
  tagline: 'Beyond your period lies the truth of your body.',
  greetings: {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    night: 'Good night'
  },
  nav: {
    home: 'Home',
    calendar: 'Calendar',
    health: 'Health',
    insights: 'Insights',
    sisters: 'Sisters'
  },
  onboarding: {
    welcome: 'Welcome to Àràbìrín',
    subtitle: "Your body holds wisdom. Let's help you understand it.",
    begin: "Let's begin →",
    nameQuestion: 'What shall we call you?',
    nameHint: 'Just your first name is fine 🌸',
    namePlaceholder: 'Enter your name',
    periodQuestion: 'When did your last period start?',
    periodHint: 'Your best guess is fine too',
    periodLengthQuestion: 'How many days does your period usually last?',
    cycleLengthQuestion: 'How long is your usual cycle?',
    cycleLengthHint: 'From first day of period to next period',
    notSure: 'Not sure',
    continue: 'Continue →',
    finish: 'Take me in 🌸'
  },
  phaseLabels: {
    period: 'MENSTRUAL',
    follicular: 'FOLLICULAR',
    fertile: 'FERTILE',
    ovulation: 'OVULATION',
    luteal: 'LUTEAL',
    unknown: 'CYCLE'
  },
  phaseMessages: {
    period: 'Rest and be gentle with yourself. Your body is releasing.',
    follicular: 'Energy levels are rising. A good time for creativity.',
    ovulation: 'You are at your peak. Bold and magnetic today.',
    fertile: 'Your fertile window. A powerful time in your cycle.',
    luteal: 'Turn inward. Rest, reflect and nourish yourself.',
    unknown: 'Track your cycle to see your phase message.'
  },
  symptoms: {
    title: 'How are you feeling?',
    mood: 'Mood',
    flow: 'Flow',
    cramps: 'Cramps',
    energy: 'Energy',
    other: 'Other symptoms',
    notes: 'Notes (optional)',
    notesPlaceholder: 'Anything else you want to remember about today...',
    save: "Save Today's Log",
    saved: 'Saved beautifully 🌸',
    moods: { happy: 'Happy', calm: 'Calm', anxious: 'Anxious', irritable: 'Irritable', sad: 'Sad' },
    flows: { none: 'None', spotting: 'Spotting', light: 'Light', medium: 'Medium', heavy: 'Heavy' },
    crampLevels: { none: 'None', mild: 'Mild', moderate: 'Moderate', severe: 'Severe' },
    energyLevels: { high: 'High', medium: 'Medium', low: 'Low' },
    extras: {
      bloating: 'Bloating',
      headache: 'Headache',
      backPain: 'Back Pain',
      breastTenderness: 'Breast Tenderness',
      nausea: 'Nausea',
      insomnia: 'Insomnia'
    }
  },
  healthHub: {
    title: "Black Women's Health Hub",
    subtitle: 'Conditions that disproportionately affect us',
    fibroids: 'Fibroids',
    fibroidsDesc: 'Up to 80% of Black women develop fibroids by age 50',
    endo: 'Endometriosis',
    endoDesc: 'Often misdiagnosed or dismissed in Black women',
    pcos: 'PCOS',
    pcosDesc: 'Polycystic ovary syndrome affects 1 in 10 women',
    maternal: 'Maternal Health',
    maternalDesc: 'Black women are 3x more likely to die in childbirth'
  },
  log: {
    history: 'Period History',
    noHistory: 'No periods logged yet',
    ongoing: 'Ongoing',
    nextPeriod: 'Next period expected',
    dueToday: 'Your period is due today',
    dueSoon: 'Your period is coming soon',
    days: 'days',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete'
  },
  insights: {
    title: 'Your Insights',
    averageCycle: 'Avg Cycle',
    averagePeriod: 'Avg Period',
    totalLogged: 'Logged',
    days: 'days',
    periods: 'periods',
    longestCycle: 'Longest',
    shortestCycle: 'Shortest',
    noInsights: 'Log at least 2 periods to see your insights',
    regular: 'Regular',
    irregular: 'Irregular'
  }
}

export type Translations = typeof en
export default en
