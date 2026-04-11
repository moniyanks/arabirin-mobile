import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { theme } from '../../constants/theme'
import {
  Home,
  Calendar,
  Heart,
  BarChart2,
  Users
} from 'lucide-react-native'

export default function TabLayout() {
  const scheme = useColorScheme()
  const c = scheme === 'dark' ? theme.dark : theme.light
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.bgSecondary,
          borderTopWidth: 1,
          borderTopColor: c.borderRose,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8
        },
        tabBarActiveTintColor: c.accentRose,
        tabBarInactiveTintColor: c.textMuted,
        tabBarLabelStyle: {
          fontFamily: theme.fonts.sans,
          fontSize: 10,
          letterSpacing: 0.5,
          marginTop: 2
        },
        tabBarIconStyle: {
          marginBottom: 0
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size - 2} color={color} strokeWidth={1.5} />
          )
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size - 2} color={color} strokeWidth={1.5} />
          )
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'Health',
          tabBarIcon: ({ color, size }) => (
            <Heart size={size - 2} color={color} strokeWidth={1.5} />
          )
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => (
            <BarChart2 size={size - 2} color={color} strokeWidth={1.5} />
          )
        }}
      />
      <Tabs.Screen
        name="sisters"
        options={{
          title: 'Sisters',
          tabBarIcon: ({ color, size }) => (
            <Users size={size - 2} color={color} strokeWidth={1.5} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null
        }}
      />
    </Tabs>
  )
}