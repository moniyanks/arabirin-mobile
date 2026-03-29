import { useCallback, useState } from 'react'

import { useAppData } from '../context/AppDataContext'
import {
  updateJourneyTransition,
  type JourneyTransitionInput,
} from '../utils/journeyTransitionHelper'

export function useJourneyChange() {
  const { refetchAll } = useAppData()

  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const open = useCallback(() => {
    setError('')
    setVisible(true)
  }, [])

  const close = useCallback(() => {
    setError('')
    setVisible(false)
  }, [])

  const submit = useCallback(
    async (input: JourneyTransitionInput) => {
      setLoading(true)
      setError('')

      try {
        await updateJourneyTransition(input)
        await refetchAll()
        setVisible(false)
      } catch (err: any) {
        setError(err?.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    },
    [refetchAll]
  )

  return {
    visible,
    loading,
    error,
    open,
    close,
    submit,
  }
}