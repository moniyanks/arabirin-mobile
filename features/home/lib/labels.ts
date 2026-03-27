export function getContextLabel(mode: string): string {
  switch (mode) {
    case 'ttc':
      return 'Trying to conceive'
    case 'pregnant':
      return 'Pregnancy journey'
    case 'postpartum':
      return 'Postpartum journey'
    case 'healing':
      return 'Healing journey'
    case 'perimenopause':
      return 'Perimenopause journey'
    case 'cycle':
    default:
      return 'Cycle awareness'
  }
}

export function getPrimaryActionLabel(mode: string): string {
  switch (mode) {
    case 'ttc':
      return 'Log today’s fertility signs'
    case 'pregnant':
      return 'Log today’s check-in'
    case 'cycle':
      return 'Log today’s symptoms'
    default:
      return 'Log today’s check-in'
  }
}