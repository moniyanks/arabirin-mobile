export type GreetingKey = 'morning' | 'afternoon' | 'evening' | 'night'

export const getGreetingKey = (): GreetingKey => {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 16) return 'afternoon'
  if (hour >= 16 && hour < 20) return 'evening'
  return 'night'
}

export const getGreetingText = () => {
  const key = getGreetingKey()

  switch (key) {
    case 'morning':
      return 'Good morning'
    case 'afternoon':
      return 'Good afternoon'
    case 'evening':
      return 'Good evening'
    case 'night':
    default:
      return 'Good night'
  }
}
