import { appointmentReportCss } from '../../styles/appointmentReport'
import type { ReportViewModel, ConditionCard, TopSymptom } from './types'
import {
  REPORT_BRAND_NAME,
  REPORT_COMPANY_NAME,
  REPORT_CONTACT_EMAIL,
} from './config'
import { escapeHtml } from './helpers'

// ── Partial renderers ──

function renderPatientField(label: string, value: string): string {
  return `
    <div class="patient-field">
      <label>${label}</label>
      <span>${value}</span>
    </div>`
}

function renderDataRow(label: string, value: string, accent = false): string {
  return `
    <div class="data-row">
      <span class="data-label">${label}</span>
      <span class="data-value${accent ? ' accent' : ''}">${value}</span>
    </div>`
}

function renderSymptomBar(symptom: TopSymptom, maxCount: number): string {
  const pct = maxCount > 0
    ? Math.min((symptom.count / maxCount) * 100, 100)
    : 0
  return `
    <div class="symptom-bar-row">
      <div class="symptom-bar-label">${escapeHtml(symptom.label)}</div>
      <div class="symptom-bar-track">
        <div class="symptom-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="symptom-bar-count">${symptom.count}×</div>
    </div>`
}

function renderConditionCard(card: ConditionCard): string {
  const signals = card.signals
    .map((s) => `<span class="signal-chip${s.met ? ' met' : ''}">${escapeHtml(s.label)}</span>`)
    .join('')

  const note = !card.enoughData
    ? `<div class="helper-text">Based on ${card.logsAnalysed} entries — continue logging for fuller analysis.</div>`
    : ''

  return `
    <div class="condition-card">
      <div class="condition-header">
        <span class="condition-name">${escapeHtml(card.name)}</span>
        <span class="condition-badge">${escapeHtml(card.scoreLabel)}</span>
      </div>
      <div class="condition-signals">${signals}</div>
      ${note}
    </div>`
}

function renderQuestion(text: string, index: number): string {
  return `
    <div class="question-item">
      <div class="question-number">${index + 1}</div>
      <div class="question-text">${escapeHtml(text)}</div>
    </div>`
}

function renderSource(source: string): string {
  return `<div class="source-item">${escapeHtml(source)}</div>`
}

// ── Main renderer ──

export function renderAppointmentReportHtml(vm: ReportViewModel): string {
  const { cycleSummary: cs, flowSummary: fs } = vm
  const maxSymptomCount = vm.topSymptoms[0]?.count ?? 1

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(REPORT_BRAND_NAME)} — Appointment Preparation Report</title>
  <style>${appointmentReportCss}</style>
</head>
<body>

  <div class="header">
    <div>
      <div class="logo">◉ ${escapeHtml(REPORT_BRAND_NAME)}</div>
      <div class="tagline">Body Intelligence for Every Stage</div>
    </div>
    <div class="header-right">
      <div class="report-title">Appointment Preparation Report</div>
      <div>Generated: ${escapeHtml(vm.generatedDate)}</div>
      <div>${vm.symptomEntryCount} symptom entries · ${vm.periodsLoggedCount} periods logged</div>
    </div>
  </div>

  <div class="patient-banner">
    ${renderPatientField('Prepared for', vm.preparedFor)}
    ${renderPatientField('Health journey', escapeHtml(vm.modeLabel))}
    ${vm.trackedConditionsLabel
      ? renderPatientField('Tracked conditions', escapeHtml(vm.trackedConditionsLabel))
      : ''}
    ${renderPatientField('Report date', escapeHtml(vm.generatedDate))}
  </div>

  <div class="disclaimer-banner">
    This report contains personal health tracking data from the
    ${escapeHtml(REPORT_BRAND_NAME)} app. It is not a medical diagnosis and
    should not replace professional medical advice. Share with your healthcare
    provider as supporting context.
  </div>

  <div class="body">

    <div class="section">
      <div class="section-title">Cycle Summary</div>
      <div class="two-col">
        <div>
          ${renderDataRow('Periods logged', String(vm.periodsLoggedCount))}
          ${renderDataRow('Average cycle length', cs.avgCycleLength)}
          ${renderDataRow('Average period length', cs.avgPeriodLength)}
          ${cs.cycleRange ? renderDataRow('Cycle range', cs.cycleRange) : ''}
        </div>
        <div>
          ${cs.lastPeriodStarted
            ? renderDataRow('Last period started', cs.lastPeriodStarted, true)
            : ''}
          ${cs.nextPeriodPredicted
            ? renderDataRow('Next period predicted', cs.nextPeriodPredicted, true)
            : ''}
          ${cs.fertileWindow
            ? renderDataRow('Fertile window', cs.fertileWindow)
            : ''}
          ${renderDataRow('Prediction confidence', cs.predictionConfidence)}
        </div>
      </div>
    </div>

    ${fs.hasAnyFlow ? `
    <div class="section">
      <div class="section-title">Flow Severity</div>
      <div class="two-col">
        ${fs.heavyFlow  > 0 ? renderDataRow('Heavy flow',  `${fs.heavyFlow} days logged`,  true) : ''}
        ${fs.mediumFlow > 0 ? renderDataRow('Medium flow', `${fs.mediumFlow} days logged`)       : ''}
        ${fs.lightFlow  > 0 ? renderDataRow('Light flow',  `${fs.lightFlow} days logged`)        : ''}
      </div>
    </div>` : ''}

    ${vm.topSymptoms.length > 0 ? `
    <div class="section">
      <div class="section-title">
        Symptom Patterns (${vm.symptomEntryCount} total entries)
      </div>
      ${vm.topSymptoms.map((s) => renderSymptomBar(s, maxSymptomCount)).join('')}
    </div>` : ''}

    ${vm.conditionCards.length > 0 ? `
    <div class="section">
      <div class="section-title">Condition Pattern Analysis</div>
      ${vm.conditionCards.map(renderConditionCard).join('')}
      <div class="helper-text" style="margin-top:8px;font-style:italic;">
        Pattern analysis is based on logged symptoms only and does not
        constitute a medical diagnosis.
      </div>
    </div>` : ''}

    <div class="section">
      <div class="section-title">Questions for Your Healthcare Provider</div>
      ${vm.questions.map(renderQuestion).join('')}
    </div>

    <div class="section">
      <div class="section-title">Research Sources</div>
      ${vm.researchSources.map(renderSource).join('')}
    </div>

  </div>

  <div class="footer">
    <div class="footer-disclaimer">
      This document was generated by the ${escapeHtml(REPORT_BRAND_NAME)} app
      and contains personal health tracking data only. It is not a medical
      diagnosis, prescription, or treatment plan. Always consult a qualified
      healthcare provider before making health decisions.
    </div>
    <div class="footer-brand">
      <strong>◉ ${escapeHtml(REPORT_BRAND_NAME)}</strong>
      ${escapeHtml(REPORT_COMPANY_NAME)}<br>
      ${escapeHtml(REPORT_CONTACT_EMAIL)}
    </div>
  </div>

</body>
</html>`
}