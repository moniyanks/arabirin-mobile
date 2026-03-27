import React from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'

import type { HomeSection, HomeViewModel } from '../../features/home/types'
import HeroSection from './HeroSection'
import NoticeTodayCard from './NoticeTodayCard'
import BodyInsightCard from './BodyInsightCard'
import QuickActionGrid from './QuickActionGrid'
import SistersPreviewCard from './SistersPreviewCard'

type HomeSectionRendererProps = {
  section: HomeSection
  home: HomeViewModel
  styles: any
  colors: any
  conditions?: string[]
}

export default function HomeSectionRenderer({
  section,
  home,
  styles,
  colors,
  conditions = [],
}: HomeSectionRendererProps) {
  const router = useRouter()

  const openCalendarWithFocus = (focus: string) => {
    router.push({
      pathname: '/(tabs)/calendar',
      params: {
        focus: focus.toLowerCase(),
        openSheet: '1',
      },
    })
  }

  switch (section.type) {
    case 'hero':
      return (
        <HeroSection
          styles={styles}
          colors={colors}
          hero={home.hero}
        />
      )

    case 'noticeToday':
      return (
        <NoticeTodayCard
          styles={styles}
          items={home.noticeToday}
          rhythm={home.rhythm}
          onPressCheckIn={() => router.push(home.primaryAction.route as any)}
        />
      )

    case 'primaryAction':
      return null

    case 'insight':
      return home.insight ? (
        <BodyInsightCard
          colors={colors}
          title={home.insight.title}
          message={home.insight.message}
        />
      ) : null

    case 'shortcuts':
      return (
        <View style={styles.shortcutsSection}>
          <Text style={styles.shortcutsHeading}>Track something specific</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.shortcutRow}
          >
            {home.shortcuts.map((item) => (
              <Pressable
                key={item.key}
                style={styles.shortcutBtn}
                onPress={() => openCalendarWithFocus(item.key)}
              >
                <Text style={styles.shortcutIcon}>{item.icon}</Text>
                <Text style={styles.shortcutLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )

    case 'quickActions':
      return (
        <QuickActionGrid
          colors={colors}
          actions={home.quickActions}
        />
      )

    case 'sistersPreview':
      return home.showSistersPreview ? (
        <SistersPreviewCard
          colors={colors}
          conditions={conditions}
          mode={home.mode}
        />
      ) : null

    case 'disclaimer':
      return home.showDisclaimer ? (
        <View style={styles.pregnancyFocusCard}>
          <Text style={styles.pregnancyFocusLabel}>
            For education only. Not medical advice.
          </Text>
        </View>
      ) : null

    default:
      return null
  }
}