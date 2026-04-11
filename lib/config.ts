const getRequiredEnv = (key: 'EXPO_PUBLIC_SUPABASE_URL' | 'EXPO_PUBLIC_SUPABASE_ANON_KEY') => {
  const value = process.env[key]

  if (!value) {
    throw new Error(
      `${key} is not configured. Add it to your Expo environment before starting the app.`
    )
  }

  return value
}

export const appConfig = {
  supabaseUrl: getRequiredEnv('EXPO_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: getRequiredEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY')
} as const
