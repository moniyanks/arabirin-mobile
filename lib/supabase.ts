import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

import { appConfig } from './config'
import { secureSessionStorage } from './storage/secureSessionStorage'

export const supabase = createClient(appConfig.supabaseUrl, appConfig.supabaseAnonKey, {
  auth: {
    storage: secureSessionStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})
