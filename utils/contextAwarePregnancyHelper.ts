type SupportedCondition = 'fibroids' | 'sickle_cell' | 'thalassemia' | 'pcos' | 'endo'

export type PregnancyConditionOverlay = {
  title: string
  message: string
  focusAreas: string[]
}

function hasCondition(conditions: string[], key: SupportedCondition) {
  return conditions.includes(key)
}

function unique(items: string[]) {
  return Array.from(new Set(items))
}

export function getContextAwarePregnancyOverlay(params: {
  conditions: string[]
  weeks: number
}): PregnancyConditionOverlay | null {
  const { conditions, weeks } = params

  if (!conditions || conditions.length === 0) {
    return null
  }

  const overlays: PregnancyConditionOverlay[] = []

  if (hasCondition(conditions, 'fibroids')) {
    overlays.push({
      title: 'A more layered season of care',
      message:
        'Pregnancy can already bring pressure, tenderness, or shifting energy. With fibroids in the picture, gentle tracking may help you notice what is changing over time.',
      focusAreas: ['Pressure', 'Pain', 'Bleeding', 'Energy']
    })
  }

  if (hasCondition(conditions, 'sickle_cell')) {
    overlays.push({
      title: 'Your body may need softer pacing',
      message:
        'Pregnancy can place more demands on the body. If you live with sickle cell, rest, hydration, and noticing changes in how you feel may be especially important.',
      focusAreas: ['Pain', 'Energy', 'Hydration', 'Breath']
    })
  }

  if (hasCondition(conditions, 'thalassemia')) {
    overlays.push({
      title: 'A gentler check-in may go a long way',
      message:
        'Your body may be carrying extra demands right now. Gentle tracking can help you notice shifts in fatigue, breath, or how supported you feel day to day.',
      focusAreas: ['Fatigue', 'Breath', 'Energy', 'Dizziness']
    })
  }

  if (hasCondition(conditions, 'pcos')) {
    overlays.push({
      title: 'Your story may not follow a textbook pattern',
      message:
        'If PCOS has shaped your cycle history, pregnancy may still bring questions or unpredictability. Gentle check-ins can help you stay connected to what feels true in your body.',
      focusAreas: ['Energy', 'Mood', 'Pain', 'Sleep']
    })
  }

  if (hasCondition(conditions, 'endo')) {
    overlays.push({
      title: 'Your body may carry memory as well as change',
      message:
        'If endometriosis has been part of your story, pregnancy may still come with tenderness, fatigue, or sensations that deserve noticing without judgment.',
      focusAreas: ['Pain', 'Fatigue', 'Pressure', 'Rest']
    })
  }

  if (overlays.length === 0) {
    return null
  }

  // Prefer the first overlay as the lead narrative.
  // If multiple conditions exist, keep the tone broad and combine focus areas.
  if (overlays.length === 1) {
    return overlays[0]
  }

  const combinedFocusAreas = unique(overlays.flatMap((item) => item.focusAreas)).slice(0, 6)

  return {
    title: 'A more layered season of care',
    message:
      weeks <= 13
        ? 'This early chapter may already carry more complexity. We’ll keep your check-ins grounded in what deserves gentle noticing, without assuming every pregnancy feels the same.'
        : 'Your pregnancy may carry additional layers of care. We’ll keep your check-ins grounded in what deserves noticing, while leaving room for your experience to be your own.',
    focusAreas: combinedFocusAreas
  }
}
