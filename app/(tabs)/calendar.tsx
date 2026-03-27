import { useMemo, useState } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ChevronLeft, ChevronRight, History } from 'lucide-react-native'
import { format, addDays } from 'date-fns'

import { useColors } from '../../styles'
import { makeCalendarStyles } from '../../styles/screens/calendar'
import { useAppData } from '../../context/AppDataContext'
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

type SheetMode = 'log' | 'symptoms' | 'predicted' | 'fertile' | 'ovulation' | 'extend'

export default function CalendarScreen() {
  const colors = useColors()
  const styles = useMemo(() => makeCalendarStyles(colors), [colors])
  const router = useRouter()

  const {
    profile,
    periods,
    symptomLogs,
    cycleLength,
    periodLength,
    refetchAll,
  } = useAppData()

  const mode = profile?.mode || 'cycle'

  const [monthDate, setMonthDate]     = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [sheetVisible, setSheetVisible] = useState(false)
  const [sheetMode, setSheetMode]     = useState<SheetMode | null>(null)

  const predictedPeriods =
    mode === 'cycle'
      ? getPredictedPeriods(periods, cycleLength, periodLength, 6)
      : []

  const fertileWindows =
    mode === 'cycle' ? getAllFertileWindows(periods, cycleLength) : []

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

  const selectedDateInfo = getSelectedDateInfo({
    mode,
    isPeriod: !!selectedPeriod,
    isPredictedPeriod: !!selectedPredicted,
    isFertile: !!selectedFertile,
    isOvulation: !!selectedOvulation,
  })

  const weekdayLabels = getWeekdayLabels()

  const handleDayPress = (day: (typeof days)[number]) => {
    setSelectedDate(day.date)

    if (day.isPeriod) {
      setSheetMode('symptoms')
      setSheetVisible(true)
      return
    }

    if (day.isPredictedPeriod) {
      setSheetMode('predicted')
      setSheetVisible(true)
      return
    }

    if (day.isOvulation) {
      setSheetMode('ovulation')
      setSheetVisible(true)
      return
    }

    if (day.isFertile) {
      setSheetMode('fertile')
      setSheetVisible(true)
      return
    }

    if (day.dateStr <= todayStr) {
      // Check if this day is the day after a period ended
      const yesterday = format(addDays(day.date, -1), 'yyyy-MM-dd')
      const periodEndedYesterday = periods.find((p) => p.endDate === yesterday)

      if (periodEndedYesterday) {
        setSheetMode('extend')
        setSheetVisible(true)
        return
      }

      setSheetMode('log')
      setSheetVisible(true)
    }
  }

  const openLogForSelectedDate = () => {
    if (mode === 'cycle' && selectedPeriod) {
      setSheetMode('symptoms')
      setSheetVisible(true)
      return
    }

    if (mode === 'cycle' && selectedPredicted) {
      setSheetMode('predicted')
      setSheetVisible(true)
      return
    }

    if (mode === 'cycle' && selectedOvulation) {
      setSheetMode('ovulation')
      setSheetVisible(true)
      return
    }

    if (mode === 'cycle' && selectedFertile) {
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

          {mode === 'cycle' && (
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.legendDotPeriod]} />
                <Text style={styles.legendText}>Period</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.legendDotPredicted]} />
                <Text style={styles.legendText}>Predicted</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.legendDotFertile]} />
                <Text style={styles.legendText}>Fertile</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.legendDotOvulation]} />
                <Text style={styles.legendText}>Ovulation</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailDate}>{format(selectedDate, 'EEEE, d MMMM')}</Text>

          <View style={styles.badgeRow}>
            {selectedPeriod && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Period day</Text>
              </View>
            )}
            {!selectedPeriod && selectedPredicted && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Predicted period</Text>
              </View>
            )}
            {!selectedPeriod && selectedFertile && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Fertile window</Text>
              </View>
            )}
            {selectedOvulation && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Ovulation</Text>
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

          <Text style={styles.detailText}>
            {selectedDateInfo.message}
          </Text>

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

        {/* Period history link */}
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