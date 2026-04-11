import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Appearance } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type ThemeMode = 'light' | 'dark' | 'system'

type ThemeModeContextType = {
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
  resolvedScheme: 'light' | 'dark'
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined)

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem('themeMode')
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setThemeModeState(saved)
        }
      } catch {
        // Intentionally ignore storage read failures and fall back to default theme.
      } finally {
        setIsLoaded(true)
      }
    }

    void loadTheme()
  }, [])

  const systemScheme: 'light' | 'dark' =
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'

  const resolvedScheme: 'light' | 'dark' =
    themeMode === 'system' ? systemScheme : themeMode

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode)
    void AsyncStorage.setItem('themeMode', mode)
  }

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      resolvedScheme
    }),
    [themeMode, resolvedScheme]
  )

  if (!isLoaded) return null

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider')
  }
  return ctx
}