import { useMemo } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { format } from 'date-fns'

import {
  getCycleStatus,
  getCycleStatusCopy,
  shouldShowJourneyCard
} from '../../utils/journeyStatusHelper'
import { useColors } from '../../styles'
import { useAppData } from '../../context/AppDataContext'
import { makeHomeStyles } from '../../styles/screens/home'
import HomeHeader from '../../components/home/HomeHeader'
import EmptyStateCard from '../../components/home/EmptyStateCard'
import HomeSectionRenderer from '../../components/home/renderHomeSection'
import { buildHomeViewModel } from '../../features/home/buildHomeViewModel'
import JourneyChangeSheet from '../../components/common/JourneyChangeSheet'
import { useJourneyChange } from '../../hooks/useJourneyChange'

export default function HomeScreen() {
  const colors = useColors()
  const styles = useMemo(() => makeHomeStyles(colors), [colors])
  const router = useRouter()

  const { profile, periods, symptomLogs, cycleLength, periodLength } = useAppData()
  const journeyChange = useJourneyChange()

  const home = useMemo(
    () =>
      buildHomeViewModel({
        profile,
        periods,
        symptomLogs,
        cycleLength,
        periodLength
      }),
    [profile, periods, symptomLogs, cycleLength, periodLength]
  )

  const name = profile?.name?.trim() || 'Sister'
  const firstLetter = name.charAt(0).toUpperCase() || 'A'
  const currentMode = profile?.mode || 'cycle'

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const cycleStatus = getCycleStatus({
    mode: currentMode,
    periods,
    cycleLength,
    todayStr,
    symptomLogs
  })

  const cycleStatusCopy = getCycleStatusCopy(cycleStatus)
  const showJourneyCard = shouldShowJourneyCard(profile, cycleStatus)

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader colors={colors} firstLetter={firstLetter} />

        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>
            {home.greeting}, {name} 🌸
          </Text>
          <Text style={styles.context}>{home.contextLabel}</Text>
        </View>

        {showJourneyCard && (
          <View style={styles.journeyCard}>
            <Text style={styles.journeyCardTitle}>{cycleStatusCopy.title}</Text>
            <Text style={styles.journeyCardText}>{cycleStatusCopy.body}</Text>

            <Pressable style={styles.journeyCardButton} onPress={journeyChange.open}>
              <Text style={styles.journeyCardButtonText}>My journey has changed</Text>
            </Pressable>
          </View>
        )}

        {home.emptyState ? (
          <EmptyStateCard
            styles={styles}
            title={home.emptyState.title}
            description={home.emptyState.description}
            ctaLabel={home.emptyState.ctaLabel}
            onPress={() => router.push('/(tabs)/calendar')}
          />
        ) : (
          home.sections.map((section, index) => (
            <HomeSectionRenderer
              key={`${section.type}-${index}`}
              section={section}
              home={home}
              styles={styles}
              colors={colors}
              conditions={profile?.conditions || []}
            />
          ))
        )}
      </ScrollView>

      <JourneyChangeSheet
        visible={journeyChange.visible}
        loading={journeyChange.loading}
        error={journeyChange.error}
        currentMode={currentMode}
        onClose={journeyChange.close}
        onSubmit={journeyChange.submit}
      />
    </SafeAreaView>
  )
}
