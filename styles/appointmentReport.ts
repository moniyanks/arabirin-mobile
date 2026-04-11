export const appointmentReportCss = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
    font-size: 13px;
    line-height: 1.6;
    color: #2D1D26;
    background: #ffffff;
  }

  .header {
    background: #1A0F17;
    color: #F3E5D8;
    padding: 28px 32px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .logo {
    font-size: 26px;
    font-weight: 600;
    color: #D99B9B;
    letter-spacing: 0.5px;
  }

  .tagline {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(243,229,216,0.5);
    margin-top: 3px;
  }

  .header-right {
    text-align: right;
    font-size: 11px;
    color: rgba(243,229,216,0.6);
  }

  .report-title {
    font-size: 14px;
    font-weight: 600;
    color: #F3E5D8;
    margin-bottom: 4px;
  }

  .patient-banner {
    background: #2D1D26;
    color: #F3E5D8;
    padding: 16px 32px;
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
  }

  .patient-field label {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: rgba(243,229,216,0.5);
    display: block;
    margin-bottom: 2px;
  }

  .patient-field span {
    font-size: 13px;
    font-weight: 600;
    color: #D99B9B;
  }

  .disclaimer-banner {
    background: rgba(217,155,155,0.1);
    border-left: 3px solid #D99B9B;
    padding: 10px 32px;
    font-size: 11px;
    color: #666;
    font-style: italic;
  }

  .body {
    padding: 24px 32px;
  }

  .section {
    margin-bottom: 24px;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .section-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #D99B9B;
    border-bottom: 1px solid rgba(217,155,155,0.3);
    padding-bottom: 6px;
    margin-bottom: 12px;
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .data-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid rgba(45,29,38,0.06);
  }

  .data-label {
    color: #666;
    font-size: 12px;
  }

  .data-value {
    font-weight: 600;
    color: #2D1D26;
    font-size: 12px;
    text-align: right;
  }

  .data-value.accent {
    color: #D99B9B;
  }

  .symptom-bar-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 0;
  }

  .symptom-bar-label {
    width: 160px;
    font-size: 12px;
    color: #444;
    flex-shrink: 0;
  }

  .symptom-bar-track {
    flex: 1;
    height: 6px;
    background: rgba(217,155,155,0.15);
    border-radius: 3px;
    overflow: hidden;
  }

  .symptom-bar-fill {
    height: 100%;
    background: #D99B9B;
    border-radius: 3px;
  }

  .symptom-bar-count {
    width: 40px;
    text-align: right;
    font-size: 11px;
    color: #888;
    flex-shrink: 0;
  }

  .condition-card {
    border: 1px solid rgba(217,155,155,0.3);
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 10px;
  }

  .condition-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .condition-name {
    font-weight: 700;
    font-size: 13px;
    color: #2D1D26;
  }

  .condition-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 99px;
    background: rgba(217,155,155,0.15);
    color: #D99B9B;
  }

  .condition-signals {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  }

  .signal-chip {
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 99px;
    border: 1px solid rgba(217,155,155,0.3);
    color: #666;
  }

  .signal-chip.met {
    background: rgba(217,155,155,0.1);
    color: #D99B9B;
    border-color: rgba(217,155,155,0.5);
  }

  .helper-text {
    font-size: 11px;
    color: #999;
    margin-top: 6px;
  }

  .question-item {
    display: flex;
    gap: 10px;
    padding: 7px 0;
    border-bottom: 1px solid rgba(45,29,38,0.06);
    align-items: flex-start;
  }

  .question-number {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(217,155,155,0.15);
    color: #D99B9B;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .question-text {
    font-size: 12px;
    color: #333;
    line-height: 1.5;
  }

  .source-item {
    font-size: 11px;
    color: #666;
    line-height: 1.8;
    margin-bottom: 4px;
  }

  .footer {
    background: #1A0F17;
    color: rgba(243,229,216,0.4);
    padding: 16px 32px;
    font-size: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
  }

  .footer-disclaimer {
    max-width: 500px;
    line-height: 1.5;
  }

  .footer-brand {
    text-align: right;
    color: rgba(243,229,216,0.3);
  }

  .footer-brand strong {
    color: #D99B9B;
    display: block;
    font-size: 12px;
  }
`
