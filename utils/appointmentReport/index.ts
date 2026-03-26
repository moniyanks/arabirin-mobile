import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import type { Period, SymptomLog, Profile } from '../../context/AppDataContext'
import type { GenerateAppointmentPdfResult } from './types'
import { buildAppointmentReportViewModel } from './viewmodel'
import { renderAppointmentReportHtml } from './template'

export function buildAppointmentReportHtml(
  profile:     Profile,
  periods:     Period[],
  symptomLogs: SymptomLog[],
): string {
  const viewModel = buildAppointmentReportViewModel(profile, periods, symptomLogs)
  return renderAppointmentReportHtml(viewModel)
}

export async function generateAndShareAppointmentPDF(
  profile:     Profile,
  periods:     Period[],
  symptomLogs: SymptomLog[],
): Promise<GenerateAppointmentPdfResult> {
  try {
    const html    = buildAppointmentReportHtml(profile, periods, symptomLogs)
    const { uri } = await Print.printToFileAsync({ html, base64: false })

    const canShare = await Sharing.isAvailableAsync()

    if (canShare) {
      await Sharing.shareAsync(uri, {
        mimeType:    'application/pdf',
        dialogTitle: 'Share your Appointment Prep Report',
        UTI:         'com.adobe.pdf',
      })
      return { success: true, uri, shared: true }
    }

    await Print.printAsync({ uri })
    return { success: true, uri, shared: false }

  } catch (error) {
    console.error('Failed to generate appointment PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown PDF generation error',
    }
  }
}