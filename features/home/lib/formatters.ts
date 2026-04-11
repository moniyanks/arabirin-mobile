export function formatShortDate(value?: string | null): string {
  if (!value) return '—'

  try {
    return new Date(value).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short'
    })
  } catch {
    return '—'
  }
}

export function mapConfidenceLabel(confidence?: string | null): string {
  switch (confidence) {
    case 'high':
      return 'High confidence'
    case 'medium':
      return 'Good confidence'
    default:
      return 'Building accuracy'
  }
}

export function extractPregnancyWeek(weekLabel?: string | null): number {
  if (!weekLabel) return 0
  const match = weekLabel.match(/Week\s+(\d+)/i)
  return match ? Number(match[1]) : 0
}
