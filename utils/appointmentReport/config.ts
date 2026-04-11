import type { QuestionSourceKey, SupportedMode } from './types'

export const REPORT_BRAND_NAME = 'Àràbìrín'
export const REPORT_COMPANY_NAME = 'Àràbìrín Technologies'
export const REPORT_CONTACT_EMAIL = 'support@arabirin.com'

export const FALLBACK_NAME = 'Sister'
export const FALLBACK_MODE: SupportedMode = 'cycle'

export const MAX_TOP_SYMPTOMS = 8
export const MAX_DOCTOR_QUESTIONS = 10

export const MODE_LABELS: Record<SupportedMode, string> = {
  cycle: 'Cycle Tracking',
  ttc: 'Trying to Conceive',
  pregnant: 'Pregnancy',
  postpartum: 'Postpartum Recovery',
  healing: 'Loss or Recovery',
  perimenopause: 'Perimenopause'
}

export const SYMPTOM_LABELS: Record<string, string> = {
  cramps: 'Cramps',
  bloating: 'Bloating',
  headache: 'Headache',
  backPain: 'Back pain',
  breastTenderness: 'Breast tenderness',
  nausea: 'Nausea',
  insomnia: 'Insomnia',
  pelvicPressure: 'Pelvic pressure',
  pelvicPain: 'Pelvic pain',
  painDuringSex: 'Pain during sex',
  fatigue: 'Fatigue',
  hairLoss: 'Hair thinning',
  acne: 'Acne',
  spotting: 'Spotting',
  urinaryFrequency: 'Frequent urination',
  cervicalMucus: 'Cervical mucus changes',
  ovulationPain: 'Ovulation pain',
  paleSkin: 'Pale skin',
  boneAche: 'Bone ache',
  breathlessness: 'Breathlessness'
}

export const DOCTOR_QUESTIONS: Record<QuestionSourceKey, string[]> = {
  fibroids: [
    'Based on my symptoms, could uterine fibroids be worth investigating?',
    'Can we arrange an ultrasound to check for fibroids?',
    'Given my reported heavy bleeding, should we check my iron levels for anaemia?',
    'If fibroids are found, what treatment options would you recommend?',
    'How frequently should I be monitored if fibroids are confirmed?',
    'Could fibroids be contributing to any fertility concerns?'
  ],
  endo: [
    'Based on my documented pain levels, could endometriosis be worth investigating?',
    'What diagnostic steps can we take — is a laparoscopy something to consider?',
    'Can you refer me to a specialist with experience in endometriosis?',
    'What pain management options are available beyond over-the-counter medication?',
    'How might endometriosis affect my fertility?',
    'What should I continue tracking to support an accurate diagnosis?'
  ],
  pcos: [
    'Can we run a hormone panel to check for markers associated with PCOS?',
    'Would a pelvic ultrasound help clarify my irregular cycles?',
    'Should we check my insulin sensitivity given my symptoms?',
    'What evidence-based lifestyle changes would you recommend?',
    'How might PCOS affect my fertility?',
    'What are the longer-term health considerations I should monitor?'
  ],
  thalassemia: [
    'Have I been tested for thalassemia trait or thalassemia major?',
    'Can we arrange a haemoglobin electrophoresis test?',
    'Could my heavy periods and fatigue be related to thalassemia?',
    'Should I be taking iron supplements given my period heaviness?',
    'How might thalassemia affect my fertility and pregnancy planning?',
    'Should my partner be tested for thalassemia trait?'
  ],
  ttc: [
    'Based on my cycle data, when is my most fertile window?',
    'Are there any baseline tests you recommend before we continue trying?',
    'After how long of trying would you recommend further investigation?',
    'Could my luteal phase length be affecting implantation?',
    'Are there supplements with evidence behind them you would recommend?',
    'At what point would you refer us to a reproductive specialist?'
  ],
  cycle: [
    'Are my documented cycle patterns within a normal range?',
    'Could my symptoms indicate an underlying condition worth investigating?',
    'Are there specific things you would recommend I continue tracking?',
    'Are there any baseline blood tests you would suggest?',
    'What changes in my cycle should prompt me to seek care?',
    'Are there lifestyle factors that evidence suggests could support cycle health?'
  ]
}

export const RESEARCH_SOURCES: string[] = [
  'Baird et al. (2003). High cumulative incidence of uterine leiomyoma. Am J Obstet Gynecol, 188(1), 100–107.',
  'Bougie et al. (2019). Influence of race/ethnicity on prevalence of endometriosis. BJOG, 126(9), 1104–1115.',
  'Bozdag et al. (2016). The prevalence and phenotype of polycystic ovary syndrome. Human Reproduction, 31(12).',
  'CDC MMWR (2019). Racial/Ethnic Disparities in Pregnancy-Related Deaths, United States 2007–2016.',
  'Weatherall DJ. (2010). The inherited diseases of hemoglobin. Am J Human Genetics, 86(2), 187–201.'
]
