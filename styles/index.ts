import { useColorScheme } from 'react-native'
import { theme, type ThemeColors } from '../constants/theme'

export const useColors = (): ThemeColors => {
  const scheme = useColorScheme()
  return scheme === 'dark' ? theme.dark : theme.light
}

export { theme }
