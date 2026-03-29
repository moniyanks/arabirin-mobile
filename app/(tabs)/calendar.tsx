import { useEffect, useMemo, useState } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ChevronLeft, ChevronRight, History } from 'lucide-react-native'
import { format, addDays } from 'date-fns'

import { useColors } from '../../styles'
import { makeCalendarStyles } from '../../styles/screens/calendar'
import { useAppData } from '../../context/AppDataContext'
import { supportsCyclePredictions } from '../../constants/appMode'
import {
  getPredictedPeriods,
  getAllFertileWindows,
} from '../../utils/cycleHelper'
import {
  buildMonthGrid,
  getMonthLabel,
  getWeekdayLabels,
  goToNextMonth,
  goToPreviousMonth,
  getSelectedDateInfo,
} from '../../utils/calendarHelper'
import { CalendarDayCell } from '../../components/calendar/CalendarDayCell'
import { CalendarSheet } from '../../components/calendar/CalendarSheet'
import MedicalDisclaimer from '../../components/common/MedicalDisclaimer'

type SheetMode =
  | 'log'
  | 'symptoms'
  | 'predicted'
  | 'fertile'
  | 'ovulation'
  | 'extend'

export default function CalendarScreen() {
  const colors = useColors()
  const styles = useMemo(() => makeCalendarStyles(colors), [colors])
  const router = useRouter()

  const params = useLocalSearchParams<{
    date?: string
    openSheet?: string
    focus?: string
  }>()

  const {
    profile,
    periods,
    symptomLogs,
    cycleLength,
    periodLength,
    refetchAll,
  } = useAppData()

  const mode = profile?.mode || 'cycle'
  const supportsPredictions = supportsCyclePredictions(mode as any)

  const [monthDate, setMonthDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [sheetVisible, setSheetVisible] = useState(false)
  const [sheetMode, setSheetMode] = useState<SheetMode | null>(null)

  const predictedPeriods = supportsPredictions
    ? getPredictedPeriods(periods, cycleLength, periodLength, 6)
    : []

  const fertileWindows = supportsPredictions
    ? getAllFertileWindows(periods, cycleLength)
    : []

  const days = buildMonthGrid(
    monthDate,
    selectedDate,
    periods,
    predictedPeriods,
    fertileWindows
  )

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const isFutureDate = selectedDateStr > todayStr

  const selectedPeriod = periods.find((p) => {
    const end = p.endDate ?? p.startDate
    return selectedDateStr >= p.startDate && selectedDateStr <= end
  })

  const selectedPredicted = predictedPeriods.find((p) => {
    return selectedDateStr >= p.startDate && selectedDateStr <= p.endDate
  })

  const selectedFertile = fertileWindows.find((w) => {
    return selectedDateStr >= w.fertileStart && selectedDateStr <= w.fertileEnd
  })

  const selectedOvulation = fertileWindows.find((w) => {
    return selectedDateStr === w.ovulationDay
  })

  const selectedLog = symptomLogs.find(
    (log) => log.log_date === selectedDateStr
  )
  const todayLog = symptomLogs.find((log) => log.log_date === todayStr)

  const incomingFocus = typeof params.focus === 'string' ? params.focus : null

  const todayLogSummary = useMemo(() => {
    if (!todayLog) return []

    const items: string[] = []

    if (todayLog.mood) items.push(`Mood: ${todayLog.mood}`)
    if (todayLog.flow) items.push(`Flow: ${todayLog.flow}`)
    if (todayLog.cramps) items.push(`Cramps: ${todayLog.cramps}`)
    if (todayLog.energy) items.push(`Energy: ${todayLog.energy}`)

    return items
  }, [todayLog])

  const selectedDateInfo = getSelectedDateInfo({
    mode,
    isPeriod: !!selectedPeriod,
    isPredictedPeriod: !!selectedPredicted,
    isFertile: !!selectedFertile,
    isOvulation: !!selectedOvulation,
  })

  const weekdayLabels = getWeekdayLabels()

  useEffect(() => {
    if (!params.date) return

    const incoming = new Date(params.date)
    if (Number.isNaN(incoming.getTime())) return

    setSelectedDate(incoming)
    setMonthDate(incoming)
  }, [params.date])

  useEffect(() => {
    if (params.openSheet !== '1') return
    if (selectedDateStr > todayStr) return

    setSheetMode('log')
    setSheetVisible(true)
  }, [params.openSheet, selectedDateStr, todayStr])

  const handleDayPress = (day: (typeof days)[number]) => {
    setSelectedDate(day.date)

    if (supportsPredictions && day.isPeriod) {
      setSheetMode('symptoms')
      setSheetVisible(true)
      return
    }

    if (supportsPredictions && day.isPredictedPeriod) {
      setSheetMode('predicted')
      setSheetVisible(true)
      return
    }

    if (supportsPredictions && day.isOvulation) {
      setSheetMode('ovulation')
      setSheetVisible(true)
      return
    }

    if (supportsPredictions && day.isFertile) {
      setSheetMode('fertile')
      setSheetVisible(true)
      return
    }

    if (day.dateStr <= todayStr) {
      const yesterday = format(addDays(day.date, -1), 'yyyy-MM-dd')
      const periodEndedYesterday = periods.find((p) => p.endDate === yesterday)

      if (supportsPredictions && periodEndedYesterday) {
        setSheetMode('extend')
        setSheetVisible(true)
        return
      }

      setSheetMode('log')
      setSheetVisible(true)
    }
  }

  const openLogForSelectedDate = () => {
    if (supportsPredictions && selectedPeriod) {
      setSheetMode('symptoms')
      setSheetVisible(true)
      return
    }

    if (supportsPredictions && selectedPredicted) {
      setSheetMode('predicted')
      setSheetVisible(true)
      return
    }

    if (supportsPredictions && selectedOvulation) {
      setSheetMode('ovulation')
      setSheetVisible(true)
      return
    }

    if (supportsPredictions && selectedFertile) {
      setSheetMode('fertile')
      setSheetVisible(true)
      return
    }

    if (selectedDateStr <= todayStr) {
      setSheetMode('log')
      setSheetVisible(true)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.todayCard}>
          <Text style={styles.todayCardEyebrow}>Today’s check-in</Text>

          <Text style={styles.todayCardTitle}>
            {todayLog
              ? 'You’ve checked in today'
              : 'Take a moment to notice how your body feels'}
          </Text>

          <Text style={styles.todayCardText}>
            {todayLog
              ? 'You can review or update today’s entry anytime.'
              : 'Even one mood, symptom, or energy entry helps build your body insight.'}
          </Text>

          {todayLogSummary.length > 0 && (
            <View style={styles.todayChipRow}>
              {todayLogSummary.slice(0, 3).map((item) => (
                <View key={item} style={styles.todayChip}>
                  <Text style={styles.todayChipText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          <Pressable
            style={styles.todayCardButton}
            onPress={() => {
              setSelectedDate(new Date())
              setMonthDate(new Date())
              setSheetMode('log')
              setSheetVisible(true)
            }}
          >
            <Text style={styles.todayCardButtonText}>
              {todayLog ? 'View or edit today’s check-in' : 'Log today'}
            </Text>
          </Pressable>
        </View>

        {incomingFocus ? (
          <View style={styles.focusBanner}>
            <Text style={styles.focusBannerLabel}>Suggested check-in focus</Text>
            <Text style={styles.focusBannerValue}>
              {incomingFocus.charAt(0).toUpperCase() + incomingFocus.slice(1)}
            </Text>
            <Text style={styles.focusBannerText}>
              We brought this forward based on what may deserve noticing today.
            </Text>
          </View>
        ) : null}

        <View style={styles.monthNav}>
          <Pressable
            style={styles.monthBtn}
            onPress={() => setMonthDate(goToPreviousMonth(monthDate))}
          >
            <ChevronLeft color={colors.accentRose} size={18} strokeWidth={1.8} />
          </Pressable>

          <Text style={styles.monthLabel}>{getMonthLabel(monthDate)}</Text>

          <Pressable
            style={styles.monthBtn}
            onPress={() => setMonthDate(goToNextMonth(monthDate))}
          >
            <ChevronRight color={colors.accentRose} size={18} strokeWidth={1.8} />
          </Pressable>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.weekdayRow}>
            {weekdayLabels.map((label, i) => (
              <View key={`${label}-${i}`} style={styles.weekdayCell}>
                <Text style={styles.weekdayText}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.grid}>
            {days.map((day) => (
              <CalendarDayCell
                key={day.dateStr}
                dayNumber={format(day.date, 'd')}
                inCurrentMonth={day.inCurrentMonth}
                isToday={day.isToday}
                isSelected={day.isSelected}
                isPeriod={day.isPeriod}
                isPredictedPeriod={day.isPredictedPeriod}
                isFertile={day.isFertile}
                isOvulation={day.isOvulation}
                colors={colors}
                onPress={() => handleDayPress(day)}
              />
            ))}
          </View>

          {supportsPredictions && (
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.legendDotPeriod]} />
                <Text style={styles.legendText}>Period</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.legendDotPredicted]} />
                <Text style={styles.legendText}>Predicted period</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.legendDotFertile]} />
                <Text style={styles.legendText}>Fertile window (est.)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.legendDotOvulation]} />
                <Text style={styles.legendText}>Ovulation (est.)</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailDate}>{format(selectedDate, 'EEEE, d MMMM')}</Text>

          <View style={styles.badgeRow}>
            {selectedPeriod && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Period</Text>
              </View>
            )}
            {!selectedPeriod && selectedPredicted && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Predicted period</Text>
              </View>
            )}
            {!selectedPeriod && selectedFertile && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Fertile window (est.)</Text>
              </View>
            )}
            {selectedOvulation && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Ovulation (est.)</Text>
              </View>
            )}
          </View>

          {selectedLog && (
            <View style={styles.logSummary}>
              {selectedLog.mood && (
                <View style={styles.logChip}>
                  <Text style={styles.logChipText}>😊 {selectedLog.mood}</Text>
                </View>
              )}
              {selectedLog.flow && (
                <View style={styles.logChip}>
                  <Text style={styles.logChipText}>◉ {selectedLog.flow}</Text>
                </View>
              )}
              {selectedLog.cramps && (
                <View style={styles.logChip}>
                  <Text style={styles.logChipText}>⚡ {selectedLog.cramps}</Text>
                </View>
              )}
              {selectedLog.energy && (
                <View style={styles.logChip}>
                  <Text style={styles.logChipText}>✦ {selectedLog.energy}</Text>
                </View>
              )}
              {selectedLog.extras?.length > 0 && (
                <View style={styles.logChip}>
                  <Text style={styles.logChipText}>
                    +{selectedLog.extras.length} more
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={{ gap: 8 }}>
            {selectedOvulation ? (
              <Text style={styles.detailText}>Estimated ovulation day</Text>
            ) : (
              <Text style={styles.detailText}>{selectedDateInfo.message}</Text>
            )}

            {!selectedOvulation && selectedFertile && (
              <Text style={styles.detailText}>
                Higher chance of conception during this window
              </Text>
            )}

            {(selectedFertile || selectedOvulation) && (
              <Text style={styles.detailSubtext}>
                Estimates based on your cycle length and logged periods.
              </Text>
            )}
          </View>

          <Pressable
            style={[styles.primaryBtn, isFutureDate && styles.primaryBtnDisabled]}
            onPress={openLogForSelectedDate}
            disabled={isFutureDate}
          >
            <Text style={styles.primaryBtnText}>
              {isFutureDate
                ? 'Logging opens on this date'
                : selectedLog
                  ? 'Edit symptoms'
                  : 'Log symptoms for this day'}
            </Text>
          </Pressable>
        </View>

        <MedicalDisclaimer />

        <Pressable
          style={styles.historyBtn}
          onPress={() => router.push('/(modals)/periods')}
        >
          <History color={colors.textMuted} size={16} strokeWidth={1.5} />
          <Text style={styles.historyBtnText}>View and manage period history</Text>
          <ChevronRight color={colors.textMuted} size={16} strokeWidth={1.5} />
        </Pressable>
      </ScrollView>

      {sheetVisible && (
        <CalendarSheet
          visible={sheetVisible}
          mode={sheetMode}
          dateLabel={format(selectedDate, 'EEEE, d MMMM')}
          dateStr={selectedDateStr}
          colors={colors}
          existingLog={selectedLog}
          journeyMode={mode}
          onClose={() => {
            setSheetVisible(false)
            setSheetMode(null)
          }}
          onSaved={async () => {
            await refetchAll?.()
          }}
        />
      )}
    </SafeAreaView>
  )
}