import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

import { notificationService } from '../services/notificationService'
import type { AppMode } from '../constants/appMode'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

export async function configureNotifications(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Àràbìrín',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#C9847A'
    })
  }
}

export async function rescheduleAllReminders(
  userId: string,
  nextPeriodDate: string | null,
  fertileStart: string | null,
  mode: AppMode,
  dailyRemindersEnabled = false
): Promise<void> {
  await notificationService.rescheduleFromStoredSettings(
    userId,
    {
      nextPeriodStart: nextPeriodDate,
      fertileStart
    },
    mode,
    dailyRemindersEnabled
  )
}

export async function disableAllReminders(userId: string): Promise<void> {
  await notificationService.clearAllLocalSchedules(userId)
}
