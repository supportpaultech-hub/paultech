# PaulTech Software Services - Internship Offer Letter System

## Overview
This document specifies the master **Internship Offer Letter** format, dynamic placeholders, domain-specific content rules, and PDF generation architecture for **PaulTech Software Services (OPC) Pvt Ltd**.

---

## 1. Master Blank Offer Letter Format & Placeholders

The master template layout is identical across all domains, maintaining the official letterhead, top and bottom geometric polygon branding, official logo, candidate details, authentic circular company seal, watermark, and footer credentials.

### Master Placeholder Tokens:

| Placeholder Token | Description | Example (HR) | Example (Full Stack) |
|---|---|---|---|
| `{{STUDENT_NAME}}` | Candidate full name (Uppercase) | `ASHWINI KUMARI` | `SUVRA SATPATHY` |
| `{{CONTACT_NO}}` | Mobile contact number | `9431953256` | `9635785942` |
| `{{EMAIL}}` | Candidate email address | `kumariashwini091@gmail.com` | `suvrasatpathy07@gmil.com` |
| `{{DATE}}` | Offer issue date (DD.MM.YYYY) | `09.10.2026` | `24.09.2026` |
| `{{SALUTATION_NAME}}` | Candidate first name in salutation | `ASHWINI` | `SUVRA` |
| `{{SUBJECT_LINE}}` | Optional domain subject line | *(Empty / Optional)* | `Subject: Internship Offer for Full Stack Web Development` |
| `{{POSITION_TITLE}}` | Formal role title in paragraph | `Human Resource Intern` | `Full Stack Web Development Intern` |
| `{{POSITION_SHORT}}` | Role in "Internship Details" box | `HR Intern` | `Web Developer Intern` |
| `{{DEPARTMENT}}` | Assigned department | `HR` | `IT` |
| `{{START_DATE}}` | Internship start date | `12th Oct 2026` | `25th Sep 2026` |
| `{{DURATION}}` | Internship duration | `6 Weeks` | `60 Days` |
| `{{REPORTING_TO}}` | Direct reporting authority | `Mrs. Daljeet Paul, Senior HR Department` | `Mrs. Daljeet, Senior HR department` |
| `{{DOMAIN_BODY_CONTENT}}` | Domain-specific body paragraphs | *(See Section 2)* | *(See Section 2)* |

---

## 2. Domain-Specific Content Library

The core layout and credentials remain identical for every student, while the **body paragraphs**, **position title**, and **department** adapt dynamically to the student's domain:

### A. Human Resources (HR)
- **Position Title**: Human Resource Intern
- **Position (Details Box)**: HR Intern
- **Department**: HR
- **Default Duration**: 6 Weeks
- **Body Content**:
  > "Throughout your internship, you will receive guidance and support from a dedicated mentor and the HR team. You will have the opportunity to strengthen your knowledge of recruitment, talent management, employee relations, HR operations, communication, teamwork, analytical thinking, and problem-solving skills.
  >
  > The internship is designed to provide practical, project-based learning and help you understand real-world HR practices while developing your professional capabilities.
  >
  > We wish you a successful and enriching internship experience with PAULTECH SOFTWARE SERVICES (OPC) PVT LTD."

### B. Full Stack Web Development
- **Position Title**: Full Stack Web Development Intern
- **Position (Details Box)**: Web Developer Intern
- **Department**: IT
- **Subject Line**: `Subject: Internship Offer for Full Stack Web Development`
- **Default Duration**: 60 Days
- **Body Content**:
  > "During your internship, you will have the opportunity to assisting in developing and maintaining web technologies. You will collaborate closely with senior developers to design and implement new features, while also assisting in the maintenance of project documentation. Throughout the program, you will be supported by a dedicated mentor and team members who will guide you in strengthening your technical expertise, as well as your communication and problem-solving skills within a professional work environment.
  >
  > During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.
  >
  > We are excited to have you on board and look forward to working with you!"

### C. MERN Stack Web Development
- **Position Title**: MERN Stack Web Development Intern
- **Position (Details Box)**: MERN Stack Intern
- **Department**: IT & Software Development
- **Subject Line**: `Subject: Internship Offer for MERN Stack Web Development`
- **Default Duration**: 60 Days
- **Body Content**: Focused on MongoDB, Express.js, React, Node.js API development, frontend architectures, database modeling, and code review practices.

### D. Python & Django Full Stack
- **Position Title**: Python & Django Full Stack Intern
- **Position (Details Box)**: Python Developer Intern
- **Department**: Software Development
- **Subject Line**: `Subject: Internship Offer for Python & Django Full Stack Development`
- **Default Duration**: 60 Days
- **Body Content**: Focused on Python, Django, backend REST APIs, relational databases, query optimization, and secure web architectures.

### E. Other Supported Domains:
- **FULL STACK PHP** (PHP & MySQL application development)
- **WEB DESIGN** (UI/UX design, Figma, responsive web styling)
- **Data Analytics** (Data analytics, dashboards, and BI reports)
- **DATA Science** (Exploratory data analysis, ML algorithms, statistical modeling)
- **AI/ML** (Artificial intelligence pipelines and model evaluation)
- **Digital Marketing** (SEO, social media branding, content growth)
- **Finance** (Corporate ledger reconciliation, financial reporting, statutory audits)

---

## 3. Official Company Credentials & Stamp Details

- **Company**: PAULTECH SOFTWARE SERVICES (OPC) PVT LTD.
- **Registration Number**: `Reg. No.-013440`
- **GSTIN**: `20AAKCP7675D1ZE`
- **Registered Address**: 1st Floor, Pacific Height Building, Aambagan, Sakchi, Jamshedpur-831001
- **Phones**: 7209986943 / 7061273234
- **Email**: hr@paultechsoftwareservices.com
- **Website**: https://paultechsoftwareservices.com
- **Authorized Signatory**: Mrs. Daljeet Paul, HR MANAGER HEAD
- **Stamp Seal**: High-resolution vector circular rubber stamp in official ink blue (`#22397e`), tilted at `-12°`.
- **Watermark**: Tilted diagonal text (`PAULTECH SOFTWARE SERVICES`) running across page center at `-45°` at low opacity (`0.065`).

---

## 4. File Architecture

1. `backend/templates/OFFER_LETTER_BLANK_TEMPLATE.html`:
   - Standalone, self-contained HTML file that opens in any browser, prints cleanly, or converts directly to PDF.
2. `backend/templates/OFFER_LETTER_SCHEMA.json`:
   - Structured JSON schema specifying all fields, types, and domain paragraphs.
3. `backend/templates/offerLetterTemplate.js`:
   - Node.js generator function `generateOfferLetterHtml(data, domain, isBlank)`.
4. `backend/controllers/offerLetterController.js` & `backend/routes/offerLetterRoutes.js`:
   - REST endpoints:
     - `GET /api/offer-letter/domains`: Get all domains and configurations.
     - `GET /api/offer-letter/blank`: Get blank HTML template.
     - `POST /api/offer-letter/render`: Render custom HTML from payload.
     - `GET /api/offer-letter/student/:id`: Render HTML for a student in DB.
     - `GET /api/offer-letter/application/:id`: Render HTML for an applicant in DB.
5. `frontend/src/student-app/templates/offerLetterTemplate.js`:
   - Frontend domain configuration library, presets, and helpers.
6. `frontend/src/student-app/components/OfferLetterModal.jsx`:
   - Interactive preview modal with:
     - **Mode Switcher**: Blank Master Format, HR Sample (Ashwini), Full Stack Sample (Suvra), Live Student Data.
     - **Domain Switcher**: Instantly switches content for all 11+ domains.
     - **Live Field Editor**: Allows tweaking any field with instant live preview.
     - **Download PDF**: Generates crisp A4 PDF using `html2canvas` + `jsPDF`.
     - **Print**: Browser print dialog with print-optimized CSS.
     - **Copy HTML**: Copies standalone HTML code to clipboard.
7. `frontend/src/student-app/pages/StudentDirectory.jsx`:
   - Added `[📜 Offer Letter]` button on every student row/card, and top header `[📜 Offer Letter]` button.
8. `frontend/src/student-app/pages/Applications.jsx`:
   - Added `[📜 Preview Offer Letter]` action button on candidate cards and application details modal.

---

## 5. Future Email Automation Integration Note

When you provide the email body/subject template, the system is ready to:
1. Render the HTML using `generateOfferLetterHtml(student, student.domain)`
2. Generate the PDF attachment
3. Send it automatically via `mailer.js` (Brevo API / SMTP) to the student's email address upon approval or manual dispatch!
