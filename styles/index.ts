import { useThemeMode } from '../context/ThemeModeContext'
import { theme, type ThemeColors } from '../constants/theme'

export const useColors = (): ThemeColors => {
  const { resolvedScheme } = useThemeMode()
  return theme[resolvedScheme]
}

export { theme }
