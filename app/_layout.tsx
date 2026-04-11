import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import * as Notifications from 'expo-notifications'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { AuthProvider, useAuth } from '../context/AuthContext'
import { AppDataProvider } from '../context/AppDataContext'
import { useColors } from '../styles'
import { ThemeModeProvider, useThemeMode } from '../context/ThemeModeContext'

void SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'CormorantGaramond-Regular': require('../assets/fonts/CormorantGaramond-Regular.ttf'),
    'CormorantGaramond-Italic': require('../assets/fonts/CormorantGaramond-Italic.ttf'),
    'CormorantGaramond-SemiBold': require('../assets/fonts/CormorantGaramond-SemiBold.ttf'),
    'DMSans-Regular': require('../assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium': require('../assets/fonts/DMSans-Medium.ttf'),
    'DMSans-SemiBold': require('../assets/fonts/DMSans-SemiBold.ttf')
  })

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <ThemeModeProvider>
      <RootLayoutContent />
    </ThemeModeProvider>
  )
}

function RootLayoutContent() {
  const { resolvedScheme } = useThemeMode()
  const colors = useColors()
  const router = useRouter()

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as {
        screen?: string
        date?: string
        openSheet?: boolean
      }

      if (data?.screen === 'calendar') {
        const query: Record<string, string> = {}

        if (data.date) query.date = data.date
        if (data.openSheet) query.openSheet = '1'

        router.push({
          pathname: '/calendar',
          params: query
        })
        return
      }

      if (data?.screen === 'home') {
        router.push('/')
        return
      }

      router.push('/calendar')
    })

    return () => {
      subscription.remove()
    }
  }, [router])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppDataProvider>
            <AuthGate />
            <StatusBar style={resolvedScheme === 'dark' ? 'light' : 'dark'} />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.bgPrimary },
                animation: 'fade'
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(public)/auth/index" />
              <Stack.Screen name="(setup)/consent/index" />
              <Stack.Screen name="(setup)/onboarding/index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="(modals)/privacy"
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name="(modals)/terms"
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name="(modals)/appointment"
                options={{ presentation: 'modal', headerShown: false }}
              />
              <Stack.Screen
                name="(modals)/periods"
                options={{ presentation: 'modal', headerShown: false }}
              />
            </Stack>
          </AppDataProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

function AuthGate() {
  const { status } = useAuth()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (status === 'loading') {
      return
    }

    const rootGroup = segments[0]

    const inPublic = rootGroup === '(public)'
    const inSetup = rootGroup === '(setup)'
    const inTabs = rootGroup === '(tabs)'
    const inModals = rootGroup === '(modals)'

    if (status === 'signed_out') {
      // Signed-out users can only remain in public auth screens.
      if (!inPublic) {
        router.replace('/(public)/auth')
      }
      return
    }

    if (status === 'signed_in') {
      // Signed-in users should never remain in public auth screens.
      if (inPublic) {
        router.replace('/')
        return
      }

      // Signed-in users are allowed in tabs, setup, modals, and root index.
      if (inTabs || inSetup || inModals) {
        return
      }

      router.replace('/')
    }
  }, [status, segments, router])

  return null
}
