import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

import { AppError } from '../errors/appError'

type SupportedStorage = {
  getItem: (key: string) => Promise<string | null>
  setItem: (key: string, value: string) => Promise<void>
  removeItem: (key: string) => Promise<void>
}

const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
}

const isWeb = Platform.OS === 'web'

async function assertSecureStoreAvailable(): Promise<void> {
  const isAvailable = await SecureStore.isAvailableAsync()

  if (!isAvailable) {
    throw new AppError({
      code: 'AUTH_FAILED',
      message: 'Secure storage is not available on this device.',
      userMessage:
        'Secure sign-in is not available on this device right now. Please try again on a supported device.',
      retryable: false
    })
  }
}

const secureStorage: SupportedStorage = {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      return AsyncStorage.getItem(key)
    }

    try {
      await assertSecureStoreAvailable()
      return await SecureStore.getItemAsync(key, SECURE_STORE_OPTIONS)
    } catch (error) {
      throw new AppError({
        code: 'AUTH_FAILED',
        message: `Secure storage read failed for key "${key}".`,
        userMessage: 'We could not securely restore your session. Please sign in again.',
        cause: error,
        retryable: false
      })
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      await AsyncStorage.setItem(key, value)
      return
    }

    try {
      await assertSecureStoreAvailable()
      await SecureStore.setItemAsync(key, value, SECURE_STORE_OPTIONS)
    } catch (error) {
      throw new AppError({
        code: 'AUTH_FAILED',
        message: `Secure storage write failed for key "${key}".`,
        userMessage: 'We could not securely save your session. Please try signing in again.',
        cause: error,
        retryable: false
      })
    }
  },

  async removeItem(key: string): Promise<void> {
    if (isWeb) {
      await AsyncStorage.removeItem(key)
      return
    }

    try {
      await assertSecureStoreAvailable()
      await SecureStore.deleteItemAsync(key, SECURE_STORE_OPTIONS)
    } catch (error) {
      throw new AppError({
        code: 'AUTH_FAILED',
        message: `Secure storage delete failed for key "${key}".`,
        userMessage: 'We could not securely clear your session. Please close and reopen the app.',
        cause: error,
        retryable: false
      })
    }
  }
}

export const secureSessionStorage = secureStorage
