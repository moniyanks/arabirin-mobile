import type { SupportedPhase } from './types'

export function normalizePhase(phase: string): SupportedPhase {
  switch (phase) {
    case 'period':
    case 'follicular':
    case 'fertile':
    case 'ovulation':
    case 'luteal':
    case 'unknown':
      return phase
    default:
      return 'unknown'
  }
}
