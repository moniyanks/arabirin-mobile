export const CYCLE_OPTIONS = [21, 24, 28, 30, 35]
export const PERIOD_OPTIONS = [3, 4, 5, 6, 7]

export const LIMITS = {
  cycle: { min: 15, max: 60 },
  period: { min: 1, max: 14 },
  age: { min: 18, max: 80 },
  height: { min: 100, max: 220 },
  weight: { min: 30, max: 200 },
}

export function clampNumber(value: string, min: number, max: number) {
  const n = parseInt(value, 10)
  if (isNaN(n)) return ''
  return Math.min(Math.max(n, min), max).toString()
}

export function calculateBMI(weight: string, height: string) {
  const w = parseFloat(weight)
  const h = parseFloat(height)

  if (!w || !h || h <= 0) return null

  return (w / ((h / 100) ** 2)).toFixed(1)
}

export function getBMICategory(bmi: string | null) {
  const b = parseFloat(bmi ?? '')
  if (!b) return null
  if (b < 18.5) return { label: 'Underweight', color: '#6BB5D6' }
  if (b < 25) return { label: 'Normal', color: '#9BA88D' }
  if (b < 30) return { label: 'Overweight', color: '#F3C98B' }
  return { label: 'Obese', color: '#D99B9B' }
}

export function isValidDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00`)
  return !Number.isNaN(date.getTime())
}

export function isFutureDateOnly(value: string) {
  const today = new Date()
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const input = new Date(`${value}T00:00:00`)
  return input.getTime() > todayOnly.getTime()
}

export function formatDisplayDate(value: string) {
  if (!value || !isValidDateOnly(value)) return ''
  const date = new Date(`${value}T00:00:00`)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function validateProfileForm(form: {
  name: string
  age: string
  weight: string
  height: string
  cycleLength: string
  periodLength: string
  mode: string
  pregnancyDatingMethod: 'lmp' | 'edd'
  pregnancyLmpDate: string
  pregnancyDueDate: string
}) {
  const errors: Record<string, string> = {}

  if (!form.name.trim()) {
    errors.name = 'Name is required'
  }

  if (
    form.age &&
    (parseInt(form.age, 10) < LIMITS.age.min || parseInt(form.age, 10) > LIMITS.age.max)
  ) {
    errors.age = `Age must be between ${LIMITS.age.min} and ${LIMITS.age.max}`
  }

  if (
    form.height &&
    (parseFloat(form.height) < LIMITS.height.min ||
      parseFloat(form.height) > LIMITS.height.max)
  ) {
    errors.height = `Height must be between ${LIMITS.height.min} and ${LIMITS.height.max} cm`
  }

  if (
    form.weight &&
    (parseFloat(form.weight) < LIMITS.weight.min ||
      parseFloat(form.weight) > LIMITS.weight.max)
  ) {
    errors.weight = `Weight must be between ${LIMITS.weight.min} and ${LIMITS.weight.max} kg`
  }

  if (
    form.cycleLength &&
    (parseInt(form.cycleLength, 10) < LIMITS.cycle.min ||
      parseInt(form.cycleLength, 10) > LIMITS.cycle.max)
  ) {
    errors.cycleLength = `Cycle must be between ${LIMITS.cycle.min} and ${LIMITS.cycle.max} days`
  }

  if (
    form.periodLength &&
    (parseInt(form.periodLength, 10) < LIMITS.period.min ||
      parseInt(form.periodLength, 10) > LIMITS.period.max)
  ) {
    errors.periodLength = `Period must be between ${LIMITS.period.min} and ${LIMITS.period.max} days`
  }

  if (form.mode === 'pregnant') {
    if (form.pregnancyDatingMethod === 'lmp') {
      if (!form.pregnancyLmpDate) {
        errors.pregnancyLmpDate = 'Please enter the first day of your last period'
      } else if (!isValidDateOnly(form.pregnancyLmpDate)) {
        errors.pregnancyLmpDate = 'Please use the format YYYY-MM-DD'
      } else if (isFutureDateOnly(form.pregnancyLmpDate)) {
        errors.pregnancyLmpDate = 'Last period date cannot be in the future'
      }
    }

    if (form.pregnancyDatingMethod === 'edd') {
      if (!form.pregnancyDueDate) {
        errors.pregnancyDueDate = 'Please enter your estimated due date'
      } else if (!isValidDateOnly(form.pregnancyDueDate)) {
        errors.pregnancyDueDate = 'Please use the format YYYY-MM-DD'
      }
    }
  }

  return errors
}