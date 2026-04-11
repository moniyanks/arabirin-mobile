import { addDays, format, parseISO } from 'date-fns'

import { supabase } from '../lib/supabase'
import type { AppMode } from '../constants/appMode'

export type JourneyMode = AppMode

export type JourneyTransitionInput =
  | {
      mode: 'pregnant'
      lmpDate?: string | null
      dueDate?: string | null
    }
  | {
      mode: 'postpartum'
    }
  | {
      mode: 'cycle' | 'ttc' | 'healing' | 'perimenopause'
    }

function calculateDueDateFromLmp(lmpDate: string): string {
  return format(addDays(parseISO(lmpDate), 280), 'yyyy-MM-dd')
}

function calculateLmpFromDueDate(dueDate: string): string {
  return format(addDays(parseISO(dueDate), -280), 'yyyy-MM-dd')
}

export async function updateJourneyTransition(input: JourneyTransitionInput): Promise<void> {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No authenticated user')
  }

  const updatedAt = new Date().toISOString()

  if (input.mode === 'pregnant') {
    const pregnancy_lmp_date =
      input.lmpDate ?? (input.dueDate ? calculateLmpFromDueDate(input.dueDate) : null)

    const pregnancy_due_date =
      input.dueDate ?? (input.lmpDate ? calculateDueDateFromLmp(input.lmpDate) : null)

    const pregnancy_dating_method = input.lmpDate ? 'lmp' : input.dueDate ? 'due_date' : null

    const { error } = await supabase
      .from('profiles')
      .update({
        mode: 'pregnant',
        pregnancy_lmp_date,
        pregnancy_due_date,
        pregnancy_dating_method,
        updated_at: updatedAt
      })
      .eq('id', user.id)

    if (error) {
      throw error
    }

    return
  }

  if (input.mode === 'postpartum') {
    const { error } = await supabase
      .from('profiles')
      .update({
        mode: 'postpartum',
        updated_at: updatedAt
      })
      .eq('id', user.id)

    if (error) {
      throw error
    }

    return
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      mode: input.mode,
      updated_at: updatedAt
    })
    .eq('id', user.id)

  if (error) {
    throw error
  }
}
