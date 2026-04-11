import { supabase } from '../lib/supabase'
import type { SistersCircleKey } from '../features/sisters/sistersContent'
import type { SistersReflectionRecord } from '../types/sisters'

export const sistersRepository = {
  async listReflections(circleKey: SistersCircleKey): Promise<SistersReflectionRecord[]> {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    let query = supabase
      .from('sisters_reflections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (circleKey !== 'all') {
      query = query.eq('circle_key', circleKey)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return (data ?? []) as SistersReflectionRecord[]
  },

  async saveReflection(input: {
    circleKey: SistersCircleKey
    reflectionText: string
  }): Promise<SistersReflectionRecord> {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User must be signed in to save a reflection.')
    }

    const { data, error } = await supabase
      .from('sisters_reflections')
      .insert({
        user_id: user.id,
        circle_key: input.circleKey,
        reflection_text: input.reflectionText.trim()
      })
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return data as SistersReflectionRecord
  }
}