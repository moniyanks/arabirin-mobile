import { supabase } from '../lib/supabase'
import { type AppMode, normalizeAppMode } from '../constants/appMode'
import type { Profile } from '../types/appData'

export type PregnancyDatingMethod = 'lmp' | 'edd'

export type ProfileFormState = {
  name: string
  age: string
  weight: string
  height: string
  mode: AppMode
  conditions: string[]
  cycleLength: string
  periodLength: string
  pregnancyDatingMethod: PregnancyDatingMethod
  pregnancyLmpDate: string
  pregnancyDueDate: string
}

export function buildFormState(profile: Profile): ProfileFormState {
  return {
    name: profile?.name || '',
    age: profile?.age?.toString() || '',
    weight: profile?.weight?.toString() || '',
    height: profile?.height?.toString() || '',
    mode: normalizeAppMode(profile?.mode),
    conditions: profile?.conditions || [],
    cycleLength: profile?.cycle_length?.toString() || '28',
    periodLength: profile?.period_length?.toString() || '5',
    pregnancyDatingMethod: profile?.pregnancy_dating_method === 'edd' ? 'edd' : 'lmp',
    pregnancyLmpDate: profile?.pregnancy_lmp_date || '',
    pregnancyDueDate: profile?.pregnancy_due_date || '',
  }
}

export function buildProfilePayload(userId: string, form: ProfileFormState) {
  return {
    id: userId,
    name: form.name.trim(),
    mode: form.mode,
    conditions: form.conditions ?? [],
    age: form.age ? parseInt(form.age, 10) : null,
    weight: form.weight ? parseFloat(form.weight) : null,
    height: form.height ? parseFloat(form.height) : null,
    cycle_length: parseInt(form.cycleLength, 10),
    period_length: parseInt(form.periodLength, 10),
    pregnancy_lmp_date: form.mode === 'pregnant' ? form.pregnancyLmpDate || null : null,
    pregnancy_due_date: form.mode === 'pregnant' ? form.pregnancyDueDate || null : null,
    pregnancy_dating_method: form.mode === 'pregnant' ? form.pregnancyDatingMethod : null,
  }
}

export async function saveProfile(form: ProfileFormState) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) throw userError
  if (!user) throw new Error('Not authenticated')

  const payload = buildProfilePayload(user.id, form)

  const { error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })

  if (error) throw error
}

export async function deleteUserData() {
  const { error } = await supabase.rpc('delete_user_data')
  if (error) throw error
}