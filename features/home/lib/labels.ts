export function getContextLabel(mode: string): string {
  switch (mode) {
    case 'ttc':
      return 'Stay close to your body’s rhythm'
    case 'pregnant':
      return 'A gentle space for today’s changes'
    case 'postpartum':
      return 'Recovery, one day at a time'
    case 'healing':
      return 'Move at your own pace'
    case 'perimenopause':
      return 'Understanding changing patterns'
    case 'cycle':
    default:
      return 'A softer way to understand your body'
  }
}

export function getPrimaryActionLabel(mode: string): string {
  switch (mode) {
    case 'ttc':
      return 'Notice today’s fertility cues'
    case 'pregnant':
      return 'Record today’s body changes'
    case 'postpartum':
      return 'Reflect on today’s recovery'
    case 'healing':
      return 'Notice how today feels'
    case 'perimenopause':
      return 'Track today’s changes gently'
    case 'cycle':
    default:
      return 'Notice how your body feels'
  }
}
