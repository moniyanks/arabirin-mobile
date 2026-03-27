import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { CalendarDays, Heart, Activity, Moon } from 'lucide-react-native'
import { makeQuickActionGridStyles } from '../../styles/components/home/quickActionGrid'

type QuickActionGridProps = {
  colors: any
}

export default function QuickActionGrid({ colors }: QuickActionGridProps) {
  const styles = makeQuickActionGridStyles(colors)
  const router = useRouter()

 const actions = [
  {
    title: 'Cycle History',
    subtitle: 'Review your dates, logs, and rhythm over time.',
    icon: <CalendarDays color={colors.accentRose} size={18} strokeWidth={1.8} />,
    onPress: () => router.push('/(tabs)/calendar'),
  },
  {
    title: 'Body Health',
    subtitle: 'Explore what may be shaping how you feel.',
    icon: <Heart color={colors.accentRose} size={18} strokeWidth={1.8} />,
    onPress: () => router.push('/(tabs)/health'),
  },
  {
    title: 'Body Insights',
    subtitle: 'See the patterns emerging from your logs.',
    icon: <Activity color={colors.accentRose} size={18} strokeWidth={1.8} />,
    onPress: () => router.push('/(tabs)/insights'),
  },
  {
    title: "Sister’s Circle",
    subtitle: 'Find shared stories, support, and community.',
    icon: <Moon color={colors.accentRose} size={18} strokeWidth={1.8} />,
    onPress: () => router.push('/(tabs)/sisters'),
  },
  ]

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick actions</Text>

      <View style={styles.grid}>
        {actions.map((action) => (
          <Pressable
            key={action.title}
            style={styles.card}
            onPress={action.onPress}
          >
            <View style={styles.iconWrap}>{action.icon}</View>
            <Text style={styles.cardTitle}>{action.title}</Text>
            <Text style={styles.cardSubtitle}>{action.subtitle}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}