import { useMemo, useState } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import { format } from 'date-fns'

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

export default function CalendarScreen() {
  const colors = useColors()
  const styles = useMemo(() => makeCalendarStyles(colors), [colors])

  const { profile, periods, cycleLength, periodLength } = useAppData()
  const mode = ((profile as any)?.mode as string | undefined) || 'cycle'

  const [monthDate, setMonthDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const predictedPeriods =
    mode === 'cycle' ? getPredictedPeriods(periods, cycleLength, periodLength, 6) : []

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

  const selectedDateInfo = getSelectedDateInfo({
    mode,
    isPeriod: !!selectedPeriod,
    isPredictedPeriod: !!selectedPredicted,
    isFertile: !!selectedFertile,
    isOvulation: !!selectedOvulation,
  })

  const weekdayLabels = getWeekdayLabels()

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.subtitle}>
            Track your rhythm and symptoms.
          </Text>
        </View>

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
                onPress={() => setSelectedDate(day.date)}
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
                <View
                  style={[styles.legendDot, styles.legendDotPredicted]}
                />
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

          <Text style={styles.detailText}>
            {selectedDateInfo.message}
          </Text>

          <Pressable style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Log symptoms for this day</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}