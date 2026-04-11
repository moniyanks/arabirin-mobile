import React from 'react'
import { Text } from 'react-native'

export function PrivacyPolicyContent({ s, effectiveDate }: { s: any; effectiveDate: string }) {
  return (
    <>
      <Text style={s.docTitle}>Privacy Policy</Text>
      <Text style={s.docVersion}>Effective Date: {effectiveDate} · Version 1.0</Text>

      <Text style={s.docBody}>
        This Privacy Policy describes how Àràbìrín Technologies ("we", "us", or "our") collects,
        uses, stores, and protects your personal information when you use the Àràbìrín mobile
        application ("the App"). By using the App, you agree to the practices described in this
        Policy.
      </Text>
      <Text style={s.docBody}>
        We are committed to protecting your privacy and handling your data with the highest
        standards of care, particularly given the sensitive nature of reproductive health
        information. This Policy is designed to comply with the General Data Protection Regulation
        (GDPR), the UK GDPR, the Personal Information Protection and Electronic Documents Act
        (PIPEDA), the California Consumer Privacy Act (CCPA), and other applicable data protection
        laws worldwide.
      </Text>

      <Text style={s.docSection}>1. Data Controller</Text>
      <Text style={s.docBody}>
        The data controller responsible for your personal information is:
      </Text>
      <Text style={s.docHighlight}>Àràbìrín Technologies</Text>
      <Text style={s.docBody}>
        Contact: titayanks@gmail.com{'\n'}
        For all data protection enquiries, data subject access requests, or complaints, please
        contact us at the email address above.
      </Text>

      <Text style={s.docSection}>2. Information We Collect</Text>
      <Text style={s.docBody}>We collect the following categories of personal information:</Text>
      <Text style={s.docBody}>
        <Text style={s.docHighlight}>Account Information: </Text>
        Your email address, used solely for authentication purposes via one-time passcode.
      </Text>
      <Text style={s.docBody}>
        <Text style={s.docHighlight}>Profile Information: </Text>
        Your chosen display name, date of birth (for age verification), height, weight, and health
        journey preference.
      </Text>
      <Text style={s.docBody}>
        <Text style={s.docHighlight}>Special Category Health Data: </Text>
        Menstrual cycle dates, period start and end dates, symptom logs including mood, flow
        intensity, pain levels, energy levels, and free-text health notes. This constitutes "special
        category data" under GDPR and is afforded the highest level of protection under applicable
        law.
      </Text>
      <Text style={s.docBody}>
        <Text style={s.docHighlight}>Technical Information: </Text>
        Device type, operating system, app version, and limited technical information used to
        maintain security, diagnose issues, and improve app performance.
      </Text>
      <Text style={s.docBody}>
        <Text style={s.docHighlight}>Consent Records: </Text>A timestamped record of when you viewed
        and agreed to this Privacy Policy and our Terms of Service, the platform you used, and the
        app version in use at the time of consent. This record is maintained for legal compliance
        purposes.
      </Text>

      <Text style={s.docSection}>3. Legal Basis for Processing</Text>
      <Text style={s.docBody}>We process your personal data on the following legal bases:</Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>Explicit Consent (Article 9(2)(a) GDPR): </Text>
        For the processing of your special category reproductive health data. You may withdraw this
        consent at any time by deleting your account.
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>Contract Performance: </Text>
        To provide the core cycle tracking and health insights features of the App.
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>Legitimate Interests: </Text>
        For improving the App, ensuring security, and preventing fraud.
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>Legal Obligation: </Text>
        Where processing is required to comply with applicable law.
      </Text>

      <Text style={s.docSection}>4. How We Use Your Information</Text>
      <Text style={s.docBody}>We use your information exclusively to:</Text>
      <Text style={s.docBullet}>
        • Provide personalised menstrual cycle tracking and predictions
      </Text>
      <Text style={s.docBullet}>• Generate health insights based on your logged data</Text>
      <Text style={s.docBullet}>• Authenticate your account securely</Text>
      <Text style={s.docBullet}>• Maintain legally required consent records</Text>
      <Text style={s.docBullet}>• Improve App performance and user experience</Text>
      <Text style={s.docBullet}>• Communicate with you regarding your account</Text>
      <Text style={s.docBody}>
        We will never sell, rent, or trade your personal data to third parties for marketing
        purposes. We will never use your reproductive health data for advertising targeting.
      </Text>

      <Text style={s.docSection}>5. Data Storage and Security</Text>
      <Text style={s.docBody}>
        Your data is stored on Supabase infrastructure, which uses PostgreSQL databases with
        row-level security policies ensuring your data is accessible only to you. All data is
        encrypted in transit using TLS 1.2 or higher and encrypted at rest.
      </Text>
      <Text style={s.docBody}>
        We implement appropriate technical and organisational measures to protect your data against
        unauthorised access, alteration, disclosure, or destruction, in accordance with Article 32
        of the GDPR.
      </Text>
      <Text style={s.docBody}>
        In the event of a data breach that is likely to result in a risk to your rights and
        freedoms, we will notify the relevant supervisory authority within 72 hours of becoming
        aware of the breach, and will notify affected users without undue delay where required by
        applicable law.
      </Text>
      <Text style={s.docBody}>
        Supabase acts as a data processor on our behalf under a Data Processing Agreement that
        complies with GDPR requirements. For more information on Supabase's security practices,
        visit supabase.com/security.
      </Text>
      <Text style={s.docBody}>
        We may use trusted third-party service providers to support authentication, hosting,
        storage, security, and app operations. These providers process data only on our instructions
        and under appropriate contractual safeguards.
      </Text>

      <Text style={s.docSection}>6. Data Retention</Text>
      <Text style={s.docBody}>
        We retain your personal data for as long as your account is active. You may request deletion
        of your account and associated personal data at any time by contacting us at the email
        address provided in this Policy. Where an in-app account deletion feature is available, you
        may also initiate deletion directly within the App.
      </Text>
      <Text style={s.docBody}>
        Upon receiving a valid deletion request, all personal data including health records, symptom
        logs, and profile information will be permanently deleted within 30 days, except where
        retention is required by law.
      </Text>

      <Text style={s.docSection}>7. Your Rights</Text>
      <Text style={s.docBody}>
        Depending on your jurisdiction, you have the following rights regarding your personal data:
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>Right of Access: </Text>Request a copy of all personal data
        we hold about you
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>Right to Rectification: </Text>Correct inaccurate or
        incomplete data
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>Right to Erasure: </Text>Request deletion of your personal
        data ("right to be forgotten")
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>Right to Restriction: </Text>Request that we restrict
        processing of your data
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>Right to Data Portability: </Text>Receive your data in a
        machine-readable format
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>Right to Object: </Text>Object to processing based on
        legitimate interests
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>Right to Withdraw Consent: </Text>Withdraw consent for
        processing special category data at any time
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>CCPA Rights: </Text>California residents have the right to
        know, delete, and opt-out of sale of personal information
      </Text>
      <Text style={s.docBody}>
        To exercise any of these rights, contact us at titayanks@gmail.com. We will respond within
        30 days.
      </Text>
      <Text style={s.docBody}>
        You also have the right to lodge a complaint with your local data protection authority:
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>UK: </Text>Information Commissioner's Office — ico.org.uk
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>EU: </Text>Your national data protection authority
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>Canada: </Text>Office of the Privacy Commissioner —
        priv.gc.ca
      </Text>
      <Text style={s.docBullet}>
        • <Text style={s.docHighlight}>USA: </Text>Federal Trade Commission — ftc.gov
      </Text>

      <Text style={s.docSection}>8. Reproductive Health Data and Law Enforcement</Text>
      <Text style={s.docBody}>
        Àràbìrín will never voluntarily share your reproductive health data with law enforcement or
        government agencies. In the event of a legal order compelling disclosure, we will:
      </Text>
      <Text style={s.docBullet}>• Notify you to the fullest extent permitted by law</Text>
      <Text style={s.docBullet}>• Challenge any order we believe is overbroad</Text>
      <Text style={s.docBullet}>• Only disclose the minimum information legally required</Text>
      <Text style={s.docBody}>
        We are aware that in some jurisdictions, reproductive health data may be subject to legal
        scrutiny. We have designed our data practices to minimise the data we hold and to protect
        your privacy to the greatest extent possible under law.
      </Text>

      <Text style={s.docSection}>9. International Data Transfers</Text>
      <Text style={s.docBody}>
        Your data is stored on Supabase infrastructure. Supabase stores data in data centres that
        may be located outside your country of residence. Where data is transferred outside the
        European Economic Area, Supabase maintains Standard Contractual Clauses as required under
        GDPR Article 46.
      </Text>
      <Text style={s.docBody}>
        By using the App, you acknowledge that your data may be transferred to and processed in
        countries that may not have the same data protection laws as your country of residence. We
        take all reasonable steps to ensure your data is treated securely and in accordance with
        this Privacy Policy.
      </Text>

      <Text style={s.docSection}>10. Children's Privacy</Text>
      <Text style={s.docBody}>
        The App is not intended for use by individuals under the age of 18. We do not knowingly
        collect personal data from minors. If we become aware that a minor has provided us with
        personal data, we will delete that data immediately.
      </Text>

      <Text style={s.docSection}>11. Changes to This Policy</Text>
      <Text style={s.docBody}>
        We may update this Privacy Policy from time to time. We will notify you of material changes
        via the App and will require your renewed consent where required by law. The effective date
        at the top of this document indicates when it was last revised.
      </Text>

      <Text style={s.docSection}>12. Contact Us</Text>
      <Text style={s.docBody}>
        For any questions, concerns, or requests regarding this Privacy Policy or your personal
        data, please contact:{'\n\n'}
        <Text style={s.docHighlight}>Àràbìrín Technologies{'\n'}</Text>
        <Text style={s.docLink}>titayanks@gmail.com</Text>
      </Text>
    </>
  )
}

export function TermsOfServiceContent({ s, effectiveDate }: { s: any; effectiveDate: string }) {
  return (
    <>
      <Text style={s.docTitle}>Terms of Service</Text>
      <Text style={s.docVersion}>Effective Date: {effectiveDate} · Version 1.0</Text>

      <Text style={s.docBody}>
        These Terms of Service ("Terms") constitute a legally binding agreement between you ("User",
        "you") and Àràbìrín Technologies ("we", "us", "our") governing your access to and use of the
        Àràbìrín mobile application ("the App").
      </Text>
      <Text style={s.docBody}>
        By creating an account or using the App, you acknowledge that you have read, understood, and
        agree to be bound by these Terms. If you do not agree, you must not use the App.
      </Text>

      <Text style={s.docSection}>1. Eligibility</Text>
      <Text style={s.docBody}>
        You must be at least 18 years of age to use the App. By using the App, you represent and
        warrant that you are 18 years of age or older and have the legal capacity to enter into
        these Terms.
      </Text>

      <Text style={s.docSection}>2. Nature of the Service</Text>
      <Text style={s.docBody}>
        Àràbìrín is a personal health tracking application designed to help users monitor their
        menstrual cycles, log symptoms, and access educational health information. The App is
        intended for general wellness and informational purposes only.
      </Text>
      <Text style={s.docBody}>
        <Text style={s.docHighlight}>
          THE APP DOES NOT PROVIDE MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT.
        </Text>{' '}
        Nothing in the App constitutes or should be construed as medical advice. The information and
        insights provided are for informational and educational purposes only and are not a
        substitute for professional medical advice, diagnosis, or treatment from a qualified
        healthcare provider.
      </Text>
      <Text style={s.docBody}>
        Always seek the advice of your physician or other qualified health provider with any
        questions you may have regarding a medical condition. Never disregard professional medical
        advice or delay in seeking it because of something you have read in the App.
      </Text>
      <Text style={s.docBody}>
        The App is not intended for emergency use. If you believe you are experiencing a medical
        emergency, call your local emergency services or seek immediate medical attention.
      </Text>

      <Text style={s.docSection}>3. Account Registration</Text>
      <Text style={s.docBody}>
        To use the App, you must register an account using a valid email address. You are
        responsible for maintaining the confidentiality of your account and for all activities that
        occur under your account. You agree to notify us immediately of any unauthorised use of your
        account.
      </Text>
      <Text style={s.docBody}>
        You may only create one account per email address. You must provide accurate and complete
        information during registration and keep this information up to date.
      </Text>

      <Text style={s.docSection}>4. Acceptable Use</Text>
      <Text style={s.docBody}>You agree that you will not:</Text>
      <Text style={s.docBullet}>
        • Use the App for any unlawful purpose or in violation of any applicable laws
      </Text>
      <Text style={s.docBullet}>
        • Attempt to gain unauthorised access to any part of the App or its infrastructure
      </Text>
      <Text style={s.docBullet}>
        • Reverse engineer, decompile, or disassemble any part of the App
      </Text>
      <Text style={s.docBullet}>• Transmit any viruses, malware, or other harmful code</Text>
      <Text style={s.docBullet}>• Interfere with the proper working of the App or its servers</Text>
      <Text style={s.docBullet}>
        • Impersonate any person or entity or misrepresent your affiliation
      </Text>
      <Text style={s.docBullet}>• Collect or harvest personal data from other users</Text>
      <Text style={s.docBullet}>
        • Use the App in any manner that could damage, overburden, or impair our services
      </Text>

      <Text style={s.docSection}>5. Intellectual Property</Text>
      <Text style={s.docBody}>
        The App and all content, features, and functionality — including but not limited to text,
        graphics, logos, icons, images, and software — are the exclusive property of Àràbìrín
        Technologies and are protected by copyright, trademark, and other intellectual property
        laws.
      </Text>
      <Text style={s.docBody}>
        We grant you a limited, non-exclusive, non-transferable, revocable licence to use the App
        for your personal, non-commercial purposes in accordance with these Terms. This licence does
        not include any resale or commercial use of the App or its contents.
      </Text>

      <Text style={s.docSection}>6. Health Data and Accuracy</Text>
      <Text style={s.docBody}>
        Cycle predictions, fertile window estimates, and health insights provided by the App are
        based on data you input and general statistical models. These predictions are not medically
        validated and may not be accurate for every individual.
      </Text>
      <Text style={s.docBody}>
        You acknowledge that cycle tracking is not a reliable method of contraception. The App
        should not be used as a family planning or contraceptive tool. We expressly disclaim any
        liability for pregnancy, health outcomes, or any other consequences arising from reliance on
        the App's predictions or insights.
      </Text>

      <Text style={s.docSection}>7. Sisters Circle Community</Text>
      <Text style={s.docBody}>
        The Sisters Circle community feature (when available) allows users to share experiences and
        information. Content shared in this feature is the sole responsibility of the user who
        posted it. We do not endorse or verify the accuracy of community posts.
      </Text>
      <Text style={s.docBody}>
        You agree not to post content that is harmful, abusive, discriminatory, or that violates the
        rights of others. We may review, remove, restrict, or moderate community content at our
        discretion to protect users and maintain a safe environment.
      </Text>

      <Text style={s.docSection}>8. Disclaimer of Warranties</Text>
      <Text style={s.docBody}>
        THE APP IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND,
        EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
      </Text>
      <Text style={s.docBody}>
        We do not warrant that the App will be uninterrupted, error-free, or free of viruses or
        other harmful components. We do not warrant the accuracy, completeness, or usefulness of any
        information provided through the App.
      </Text>

      <Text style={s.docSection}>9. Limitation of Liability</Text>
      <Text style={s.docBody}>
        TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, ÀRÀBÌRÍN TECHNOLOGIES SHALL NOT BE LIABLE
        FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT
        LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR PERSONAL INJURY, ARISING OUT OF OR IN
        CONNECTION WITH YOUR USE OF THE APP.
      </Text>
      <Text style={s.docBody}>
        Our total liability to you for any claim arising out of these Terms or the App shall not
        exceed the amount paid by you (if any) to access the App in the twelve months preceding the
        claim.
      </Text>

      <Text style={s.docSection}>10. Indemnification</Text>
      <Text style={s.docBody}>
        You agree to indemnify, defend, and hold harmless Àràbìrín Technologies and its officers,
        directors, employees, and agents from and against any claims, liabilities, damages, losses,
        and expenses arising out of or in any way connected with your use of the App or violation of
        these Terms.
      </Text>

      <Text style={s.docSection}>11. Termination</Text>
      <Text style={s.docBody}>
        We reserve the right to suspend or terminate your account and access to the App at our sole
        discretion, with or without notice, for conduct that we believe violates these Terms or is
        harmful to other users, us, or third parties.
      </Text>
      <Text style={s.docBody}>
        You may terminate your account at any time by deleting it within the App. Upon termination,
        your right to use the App will immediately cease.
      </Text>

      <Text style={s.docSection}>12. Governing Law and Dispute Resolution</Text>
      <Text style={s.docBody}>
        These Terms shall be governed by and construed in accordance with the laws of the Province
        of British Columbia, Canada, without regard to its conflict of law principles. For users in
        the EU or UK, the mandatory consumer protection laws of your country of residence apply
        regardless of this clause.
      </Text>
      <Text style={s.docBody}>
        Any disputes arising out of or in connection with these Terms shall first be attempted to be
        resolved through good faith negotiation. If negotiation fails within 30 days, disputes may
        be referred to binding arbitration or the courts of competent jurisdiction in the user's
        country of residence.
      </Text>

      <Text style={s.docSection}>13. Changes to Terms</Text>
      <Text style={s.docBody}>
        We reserve the right to modify these Terms at any time. We will provide notice of material
        changes through the App. Your continued use of the App after such changes constitutes your
        acceptance of the revised Terms. Where required by law, we will seek your renewed consent.
      </Text>

      <Text style={s.docSection}>14. Severability</Text>
      <Text style={s.docBody}>
        If any provision of these Terms is found to be unenforceable or invalid, that provision will
        be limited or eliminated to the minimum extent necessary so that the remaining Terms will
        otherwise remain in full force and effect.
      </Text>

      <Text style={s.docSection}>15. App Store Terms</Text>
      <Text style={s.docBody}>
        Your use of Àràbìrín downloaded from the Apple App Store is also subject to Apple's Media
        Services Terms and Conditions. In the event of any conflict between these Terms and Apple's
        terms, Apple's terms shall prevail with respect to App Store usage only.
      </Text>
      <Text style={s.docBody}>
        Apple is not responsible for the App or its content. Apple has no obligation to provide
        maintenance or support for the App. Apple is not a party to these Terms and is not
        responsible for any claims relating to the App.
      </Text>
      <Text style={s.docBody}>
        In the event of any third party claim that the App infringes intellectual property rights,
        Apple is not responsible for the investigation, defence, settlement or discharge of such
        claim.
      </Text>

      <Text style={s.docSection}>16. Contact</Text>
      <Text style={s.docBody}>
        For questions regarding these Terms, please contact:{'\n\n'}
        <Text style={s.docHighlight}>Àràbìrín Technologies{'\n'}</Text>
        <Text style={s.docLink}>titayanks@gmail.com</Text>
      </Text>
    </>
  )
}
