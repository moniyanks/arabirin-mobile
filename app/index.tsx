import { useEffect, useRef } from 'react'
import { View, ActivityIndicator, useColorScheme } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { theme } from '../constants/theme'

export default function Index() {
  const router = useRouter()
  const scheme = useColorScheme()
  const colors = scheme === 'dark' ? theme.dark : theme.light
  const { status: authStatus } = useAuth()
  const { bootstrapStatus, consent, profile } = useAppData()
  const hasNavigated = useRef(false)

  useEffect(() => {
    if (hasNavigated.current) return
    if (authStatus === 'loading') return
    if (authStatus === 'signed_out') {
      hasNavigated.current = true
      router.replace('/(public)/auth')
      return
    }
    if (bootstrapStatus === 'idle' || bootstrapStatus === 'loading') return

    hasNavigated.current = true

    if (!consent) {
      router.replace('/(setup)/consent')
      return
    }
    if (!profile) {
      router.replace('/(setup)/onboarding')
      return
    }
    router.replace('/(tabs)')
  }, [authStatus, bootstrapStatus, consent, profile])

  // Reset navigation lock when auth changes
  useEffect(() => {
    hasNavigated.current = false
  }, [authStatus])

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bgPrimary
      }}
    >
      <ActivityIndicator color={colors.accentRose} />
    </View>
  )
}
