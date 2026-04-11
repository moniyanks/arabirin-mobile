import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { useColors } from '../../styles'
import { makeLegalNoticeCardStyles } from '../../styles/components/common/legalNoticeCard'

export default function LegalNoticeCard() {
  const colors = useColors()
  const s = makeLegalNoticeCardStyles(colors)
  const router = useRouter()

  const items = [
    {
      label: 'Privacy Policy',
      route: '/legal?tab=privacy'
    },
    {
      label: 'Terms of Service',
      route: '/legal?tab=terms'
    },
    {
      label: 'Medical Disclaimer',
      route: '/legal?tab=medical'
    }
  ]

  return (
    <View style={s.card}>
      <Text style={s.title}>Legal & safety</Text>
      <Text style={s.subtitle}>
        Review how your data is handled and how Àràbìrìn should be used.
      </Text>

      <View style={s.list}>
        {items.map((item, index) => (
          <Pressable
            key={item.label}
            style={[s.row, index !== items.length - 1 && s.rowBorder]}
            onPress={() => router.push(item.route as any)}
          >
            <Text style={s.rowText}>{item.label}</Text>
            <ChevronRight color={colors.textMuted} size={18} strokeWidth={1.8} />
          </Pressable>
        ))}
      </View>
    </View>
  )
}
