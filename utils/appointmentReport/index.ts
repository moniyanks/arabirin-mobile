import { Platform } from 'react-native'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { buildAppointmentReportViewModel } from './viewmodel'
import { renderAppointmentReportHtml } from './template'

export async function generateAndShareAppointmentPDF(
  profile: any,
  periods: any[],
  symptomLogs: any[]
): Promise<{ success: true; uri: string; shared: boolean } | { success: false; error: string }> {
  try {
    const viewModel = buildAppointmentReportViewModel(profile, periods, symptomLogs)
    const html = renderAppointmentReportHtml(viewModel)

    // ✅ WEB FLOW (CRITICAL FIX)
    if (Platform.OS === 'web') {
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'appointment-report.html'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)

      return { success: true, uri: url, shared: false }
    }

    // ✅ MOBILE FLOW
    const { uri } = await Print.printToFileAsync({
      html
    })

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri)
      return { success: true, uri, shared: true }
    }

    return { success: true, uri, shared: false }
  } catch (error) {
    console.error('PDF generation error:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate report'
    }
  }
}
