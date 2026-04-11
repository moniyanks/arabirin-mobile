import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { CalendarDays, Heart, Activity, Moon } from 'lucide-react-native'
import { makeQuickActionGridStyles } from '../../styles/components/home/quickActionGrid'
import type { HomeQuickAction } from '../../features/home/types'

type QuickActionGridProps = {
  colors: any
  actions: HomeQuickAction[]
}

function renderIcon(icon: HomeQuickAction['icon'], colors: any) {
  switch (icon) {
    case 'calendar':
      return <CalendarDays color={colors.accentRose} size={18} strokeWidth={1.8} />
    case 'heart':
      return <Heart color={colors.accentRose} size={18} strokeWidth={1.8} />
    case 'activity':
      return <Activity color={colors.accentRose} size={18} strokeWidth={1.8} />
    case 'moon':
      return <Moon color={colors.accentRose} size={18} strokeWidth={1.8} />
    default:
      return <CalendarDays color={colors.accentRose} size={18} strokeWidth={1.8} />
  }
}

export default function QuickActionGrid({ colors, actions }: QuickActionGridProps) {
  const styles = makeQuickActionGridStyles(colors)
  const router = useRouter()

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick actions</Text>

      <View style={styles.grid}>
        {actions.map((action) => (
          <Pressable
            key={action.key}
            style={styles.card}
            onPress={() => router.push(action.route as any)}
          >
            <View style={styles.iconWrap}>{renderIcon(action.icon, colors)}</View>
            <Text style={styles.cardTitle}>{action.title}</Text>
            <Text style={styles.cardSubtitle}>{action.subtitle}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}
