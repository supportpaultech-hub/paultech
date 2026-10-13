const fs = require('fs');
const path = require('path');

// Asset caching helper - loads exact images extracted from official DOCX
const assetCache = {};
const getAssetDataUri = (filename, mimeType) => {
  if (assetCache[filename]) return assetCache[filename];
  try {
    const candidates = [
      path.join(__dirname, 'assets', filename),
      path.join(__dirname, '..', '..', 'frontend', 'public', 'offer-assets', filename),
      path.join(__dirname, '..', 'uploads', filename)
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        const b64 = fs.readFileSync(c).toString('base64');
        assetCache[filename] = `data:${mimeType};base64,${b64}`;
        return assetCache[filename];
      }
    }
  } catch (err) {
    console.error(`Error loading asset ${filename}:`, err);
  }
  return '';
};

// DOMAIN SPECIFIC CONTENT CONFIGURATIONS (Exact text from official PaulTech offer letters)
const DOMAIN_CONFIGS = {
  // 1. HR Domain (Exact reproduction of Ashwini Kumari offer letter)
  'Human Resources (HR)': {
    domainKey: 'HR',
    aliases: ['HR', 'Human Resources', 'HR Intern', 'Human Resource'],
    positionTitle: 'Human Resource Intern',
    positionShort: 'HR Intern',
    department: 'HR',
    subjectLine: '', // As in Ashwini's letter, subject line omitted
    reportingTo: 'Mrs. Daljeet Paul, Senior HR Department',
    defaultDuration: '6 Weeks',
    isInlineDetails: true, // Ashwini format: Position & Dept on line 1, Duration & Reporting on line 2
    paragraphs: [
      `Throughout your internship, you will receive guidance and support from a dedicated mentor and the HR team. You will have the opportunity to strengthen your knowledge of recruitment, talent management, employee relations, HR operations, communication, teamwork, analytical thinking, and problem-solving skills.`,
      `The internship is designed to provide practical, project-based learning and help you understand real-world HR practices while developing your professional capabilities.`,
      `We wish you a successful and enriching internship experience with PAULTECH SOFTWARE SERVICES (OPC) PVT LTD.`
    ]
  },

  // 2. Full Stack Web Development (Exact reproduction of Suvra Satpathy offer letter)
  'Full Stack Web Development': {
    domainKey: 'FULLSTACK',
    aliases: ['Full Stack', 'FullStack', 'Web Development', 'Full Stack Developer', 'Fullstack Web Development'],
    positionTitle: 'Full Stack Web Development Intern',
    positionShort: 'Web Developer Intern',
    department: 'IT',
    subjectLine: 'Subject: Internship Offer for Full Stack Web Development',
    reportingTo: 'Mrs. Daljeet, Senior HR department',
    defaultDuration: '60 Days',
    isInlineDetails: false, // Standard vertical list: Internship Details: Position, Department, Duration, Reporting To
    paragraphs: [
      `During your internship, you will have the opportunity to assisting in developing and maintaining web technologies. You will collaborate closely with senior developers to design and implement new features, while also assisting in the maintenance of project documentation. Throughout the program, you will be supported by a dedicated mentor and team members who will guide you in strengthening your technical expertise, as well as your communication and problem-solving skills within a professional work environment.`,
      `During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.`,
      `We are excited to have you on board and look forward to working with you!`
    ]
  },

  // 3. MERN Stack
  'MERN stack': {
    domainKey: 'MERN',
    aliases: ['MERN', 'MERN Stack', 'React', 'Node.js', 'MongoDB', 'Express'],
    positionTitle: 'MERN Stack Web Development Intern',
    positionShort: 'MERN Stack Intern',
    department: 'IT',
    subjectLine: 'Subject: Internship Offer for MERN Stack Web Development',
    reportingTo: 'Mrs. Daljeet, Senior HR department',
    defaultDuration: '60 Days',
    isInlineDetails: false,
    paragraphs: [
      `During your internship, you will have the opportunity to build modern full-stack web applications using MongoDB, Express.js, React, and Node.js. You will collaborate closely with senior engineers to design and implement RESTful APIs, scalable frontend architectures, and robust database models while adhering to industry engineering standards.`,
      `During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.`,
      `We are excited to have you on board and look forward to working with you!`
    ]
  },

  // 4. Python / Django Full Stack
  'Full stack (DJANGO)': {
    domainKey: 'DJANGO',
    aliases: ['Python', 'Django', 'Full stack Django', 'Python Developer', 'Python Full Stack'],
    positionTitle: 'Python & Django Full Stack Intern',
    positionShort: 'Python Developer Intern',
    department: 'IT',
    subjectLine: 'Subject: Internship Offer for Python & Django Full Stack Development',
    reportingTo: 'Mrs. Daljeet, Senior HR department',
    defaultDuration: '60 Days',
    isInlineDetails: false,
    paragraphs: [
      `During your internship, you will have the opportunity to develop robust backend web architectures using Python, Django, and relational databases. You will collaborate closely with senior engineers to implement scalable RESTful APIs, authenticate secure endpoints, and optimize query performance within production environments.`,
      `During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.`,
      `We are excited to have you on board and look forward to working with you!`
    ]
  },

  // 5. Full Stack PHP
  'FULL STACK PHP': {
    domainKey: 'PHP',
    aliases: ['PHP', 'Laravel', 'Full Stack PHP', 'PHP Developer'],
    positionTitle: 'Full Stack PHP Development Intern',
    positionShort: 'PHP Developer Intern',
    department: 'IT',
    subjectLine: 'Subject: Internship Offer for Full Stack PHP Development',
    reportingTo: 'Mrs. Daljeet, Senior HR department',
    defaultDuration: '60 Days',
    isInlineDetails: false,
    paragraphs: [
      `During your internship, you will have the opportunity to develop and maintain dynamic web applications, portals, and database schemas using PHP and MySQL. You will work alongside experienced developers to implement core application modules, integrate third-party APIs, and produce maintainable code.`,
      `During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.`,
      `We are excited to have you on board and look forward to working with you!`
    ]
  },

  // 6. Web Design / UI/UX
  'WEB DESIGN': {
    domainKey: 'WEB_DESIGN',
    aliases: ['Web Design', 'UI/UX', 'UI / UX', 'Frontend Design', 'Figma', 'Web Designer'],
    positionTitle: 'UI/UX & Web Design Intern',
    positionShort: 'Web Designer Intern',
    department: 'Design',
    subjectLine: 'Subject: Internship Offer for Web Design & UI/UX',
    reportingTo: 'Mrs. Daljeet, Senior HR department',
    defaultDuration: '60 Days',
    isInlineDetails: false,
    paragraphs: [
      `During your internship, you will have the opportunity to craft high-conversion user interfaces, wireframes, and responsive web layouts. You will work with modern design systems, typography principles, and frontend styling libraries to translate user needs into intuitive digital experiences.`,
      `During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.`,
      `We are excited to have you on board and look forward to working with you!`
    ]
  },

  // 7. Data Analytics
  'Data Analytics': {
    domainKey: 'DATA_ANALYTICS',
    aliases: ['Analytics', 'Data Analyst', 'PowerBI', 'Excel Analytics', 'Business Intelligence'],
    positionTitle: 'Data Analytics Intern',
    positionShort: 'Data Analyst Intern',
    department: 'Data & Analytics',
    subjectLine: 'Subject: Internship Offer for Data Analytics',
    reportingTo: 'Mrs. Daljeet, Senior HR department',
    defaultDuration: '60 Days',
    isInlineDetails: false,
    paragraphs: [
      `During your internship, you will have the opportunity to analyze complex datasets, build interactive dashboards, and synthesize actionable business intelligence reports. You will work closely with analytics mentors to translate raw business metrics into clear visual stories that drive strategic decision-making.`,
      `During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.`,
      `We are excited to have you on board and look forward to working with you!`
    ]
  },

  // 8. Data Science
  'DATA Science': {
    domainKey: 'DATA_SCIENCE',
    aliases: ['Data Science', 'Machine Learning', 'Data Scientist', 'ML'],
    positionTitle: 'Data Science & Machine Learning Intern',
    positionShort: 'Data Science Intern',
    department: 'Data Science',
    subjectLine: 'Subject: Internship Offer for Data Science',
    reportingTo: 'Mrs. Daljeet, Senior HR department',
    defaultDuration: '60 Days',
    isInlineDetails: false,
    paragraphs: [
      `During your internship, you will have the opportunity to work on exploratory data analysis, feature engineering, and statistical modeling using Python and industry ML frameworks. You will collaborate with data mentors to clean real-world data, validate predictive models, and benchmark performance metrics.`,
      `During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.`,
      `We are excited to have you on board and look forward to working with you!`
    ]
  },

  // 9. AI/ML
  'AI/ML': {
    domainKey: 'AIML',
    aliases: ['AI', 'Artificial Intelligence', 'Deep Learning', 'NLP'],
    positionTitle: 'Artificial Intelligence & Machine Learning Intern',
    positionShort: 'AI/ML Intern',
    department: 'AI Research',
    subjectLine: 'Subject: Internship Offer for Artificial Intelligence & Machine Learning',
    reportingTo: 'Mrs. Daljeet, Senior HR department',
    defaultDuration: '60 Days',
    isInlineDetails: false,
    paragraphs: [
      `During your internship, you will have the opportunity to participate in developing and evaluating intelligent models and AI-driven automation pipelines. You will collaborate with engineering teams to explore model fine-tuning, retrieval systems, and algorithm deployment within production environments.`,
      `During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.`,
      `We are excited to have you on board and look forward to working with you!`
    ]
  },

  // 10. Digital Marketing
  'Digital Marketing': {
    domainKey: 'DIGITAL_MARKETING',
    aliases: ['Marketing', 'SEO', 'Social Media', 'Content Marketing', 'Growth'],
    positionTitle: 'Digital Marketing Intern',
    positionShort: 'Marketing Intern',
    department: 'Marketing',
    subjectLine: 'Subject: Internship Offer for Digital Marketing',
    reportingTo: 'Mrs. Daljeet, Senior HR department',
    defaultDuration: '60 Days',
    isInlineDetails: false,
    paragraphs: [
      `During your internship, you will have the opportunity to assist in formulating and running digital growth initiatives across search engine optimization (SEO), social media branding, and content creation. You will analyze web analytics metrics to identify engagement opportunities and improve organic visibility.`,
      `During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.`,
      `We wish you a successful and enriching internship experience with PAULTECH SOFTWARE SERVICES (OPC) PVT LTD.`
    ]
  },

  // 11. Finance
  'Finance': {
    domainKey: 'FINANCE',
    aliases: ['Accounting', 'Accounts', 'Finance & Accounts', 'Financial Analyst'],
    positionTitle: 'Finance & Accounts Intern',
    positionShort: 'Finance Intern',
    department: 'Finance',
    subjectLine: 'Subject: Internship Offer for Finance',
    reportingTo: 'Mrs. Daljeet, Senior HR department',
    defaultDuration: '60 Days',
    isInlineDetails: false,
    paragraphs: [
      `During your internship, you will have the opportunity to assist in corporate ledger reconciliation, financial reporting, and invoice audits. You will work alongside finance leads to analyze cost structures, verify compliance documents, and learn statutory accounting methodologies in a corporate setting.`,
      `During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.`,
      `We wish you a successful and enriching internship experience with PAULTECH SOFTWARE SERVICES (OPC) PVT LTD.`
    ]
  }
};

const DEFAULT_DOMAIN_CONFIG = {
  domainKey: 'DEFAULT',
  positionTitle: 'Software Engineering Intern',
  positionShort: 'Software Intern',
  department: 'IT',
  subjectLine: 'Subject: Internship Offer Letter',
  reportingTo: 'Mrs. Daljeet, Senior HR department',
  defaultDuration: '60 Days',
  isInlineDetails: false,
  paragraphs: [
    `During your internship, you will have the opportunity to work closely with senior mentors and team members across key live projects. You will participate in feature implementation, code reviews, and project documentation while strengthening your technical expertise and professional communication skills.`,
    `During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.`,
    `We are excited to have you on board and look forward to working with you!`
  ]
};

// Helper: Match domain string to config
const getDomainConfig = (domainStr) => {
  if (!domainStr) return DEFAULT_DOMAIN_CONFIG;
  const trimmed = domainStr.trim();
  if (DOMAIN_CONFIGS[trimmed]) return DOMAIN_CONFIGS[trimmed];

  const lower = trimmed.toLowerCase();
  for (const [key, conf] of Object.entries(DOMAIN_CONFIGS)) {
    if (key.toLowerCase() === lower) return conf;
    if (conf.aliases && conf.aliases.some(a => a.toLowerCase() === lower || lower.includes(a.toLowerCase()))) {
      return conf;
    }
  }
  return {
    ...DEFAULT_DOMAIN_CONFIG,
    positionTitle: `${trimmed} Intern`,
    positionShort: `${trimmed} Intern`,
    subjectLine: `Subject: Internship Offer for ${trimmed}`
  };
};

// Date Format Helpers
const formatDateDDMMYYYY = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

const formatDateOrdinal = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  const day = d.getDate();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  const getOrdinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  return `${getOrdinal(day)} ${month} ${year}`;
};

const formatDurationText = (months, domainKey) => {
  if (typeof months === 'string') {
    const trimmed = months.trim();
    if (trimmed.toLowerCase().includes('week') || trimmed.toLowerCase().includes('day') || trimmed.toLowerCase().includes('month')) {
      return trimmed;
    }
  }
  if (!months) return domainKey === 'HR' ? '6 Weeks' : '60 Days';
  const m = parseInt(months, 10);
  if (isNaN(m) || m <= 0) return domainKey === 'HR' ? '6 Weeks' : '60 Days';
  if (m === 1) return '30 Days';
  if (m === 2) return '60 Days';
  if (m === 3) return '90 Days';
  if (m === 6) return '6 Months';
  return `${m} Months`;
};

/**
 * Generate populated Offer Letter HTML
 * Exact 1:1 match to PaulTech official DOCX format
 */
const generateOfferLetterHtml = (data = {}, domainOverride = null, isBlankTemplate = false) => {
  const domainKey = domainOverride || data.domain || 'Full Stack Web Development';
  const domainConf = getDomainConfig(domainKey);

  // Exact base64 images extracted from official DOCX
  const logoDataUri = getAssetDataUri('logo.png', 'image/png');
  const watermarkDataUri = getAssetDataUri('watermark.png', 'image/png');
  const stampDataUri = getAssetDataUri('stamp.jpeg', 'image/jpeg');
  const iconPhoneUri = getAssetDataUri('icon_phone.png', 'image/png');
  const iconEmailUri = getAssetDataUri('icon_email.png', 'image/png');
  const iconWebUri = getAssetDataUri('icon_web.png', 'image/png');
  const iconLocationUri = getAssetDataUri('icon_location.png', 'image/png');

  // Blank Template mode
  if (isBlankTemplate) {
    return buildHtmlDocument({
      logoDataUri,
      watermarkDataUri,
      stampDataUri,
      iconPhoneUri,
      iconEmailUri,
      iconWebUri,
      iconLocationUri,
      studentName: '{{CANDIDATE_NAME}}',
      contactNo: '{{CONTACT_NUMBER}}',
      email: '{{EMAIL_ADDRESS}}',
      date: '{{OFFER_DATE}}',
      salutationName: '{{FIRST_NAME}}',
      subjectLine: domainConf.subjectLine ? `<div class="doc-subject">Subject: Internship Offer for {{DOMAIN_NAME}}</div>` : '',
      positionTitle: '{{POSITION_TITLE}}',
      positionShort: '{{POSITION_SHORT}}',
      department: '{{DEPARTMENT}}',
      startDate: '{{START_DATE}}',
      duration: '{{DURATION}}',
      reportingTo: '{{REPORTING_TO}}',
      bodyParagraphs: domainConf.paragraphs.map(p => `<p class="doc-para">${p}</p>`).join(''),
      isInlineDetails: domainConf.isInlineDetails,
      isTemplate: true
    });
  }

  // Populated live candidate mode
  const rawName = (data.name || data.candidateName || 'Candidate Name').trim();
  const studentName = rawName.toUpperCase();
  const firstName = rawName.split(' ')[0].toUpperCase();
  const contactNo = data.phone || data.candidatePhone || '9876543210';
  const email = (data.email || data.candidateEmail || 'student@example.com').toLowerCase();

  const issueDateFormatted = data.date ? formatDateDDMMYYYY(data.date) : formatDateDDMMYYYY(new Date());
  const startDateFormatted = data.joining_date ? formatDateOrdinal(data.joining_date) : formatDateOrdinal(new Date());
  const durationText = data.durationText || formatDurationText(data.duration, domainConf.domainKey);
  const reportingTo = data.reportingTo || domainConf.reportingTo;

  const positionTitle = data.positionTitle || domainConf.positionTitle;
  const positionShort = data.positionShort || domainConf.positionShort;
  const department = data.department || domainConf.department;

  const subjectHtml = (data.subjectLine !== undefined ? data.subjectLine : domainConf.subjectLine)
    ? `<div class="doc-subject">${data.subjectLine || domainConf.subjectLine}</div>`
    : '';

  const paragraphsHtml = (data.paragraphs || domainConf.paragraphs)
    .map(p => `<p class="doc-para">${p}</p>`)
    .join('');

  return buildHtmlDocument({
    logoDataUri,
    watermarkDataUri,
    stampDataUri,
    iconPhoneUri,
    iconEmailUri,
    iconWebUri,
    iconLocationUri,
    studentName,
    contactNo,
    email,
    date: issueDateFormatted,
    salutationName: firstName,
    subjectLine: subjectHtml,
    positionTitle,
    positionShort,
    department,
    startDate: startDateFormatted,
    duration: durationText,
    reportingTo,
    bodyParagraphs: paragraphsHtml,
    isInlineDetails: domainConf.isInlineDetails,
    isTemplate: false
  });
};

/**
 * Build HTML Document reproducing the exact Word DOCX layout and typography
 */
function buildHtmlDocument({
  logoDataUri,
  watermarkDataUri,
  stampDataUri,
  iconPhoneUri,
  iconEmailUri,
  iconWebUri,
  iconLocationUri,
  studentName,
  contactNo,
  email,
  date,
  salutationName,
  subjectLine,
  positionTitle,
  positionShort,
  department,
  startDate,
  duration,
  reportingTo,
  bodyParagraphs,
  isInlineDetails,
  isTemplate
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PaulTech Internship Offer Letter - ${studentName}</title>
  <style>
    /* Reset */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #f1f5f9;
      font-family: 'Times New Roman', Times, serif;
      color: #000000;
      line-height: 1.25;
      -webkit-font-smoothing: antialiased;
      display: flex;
      justify-content: center;
      padding: 20px 0;
    }

    /* Standard A4 Page Dimensions (210mm x 297mm) */
    .docx-page {
      width: 210mm;
      height: 297mm;
      min-height: 297mm;
      max-height: 297mm;
      background: #ffffff;
      position: relative;
      margin: 0 auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0;
    }

    @media print {
      body {
        background: transparent !important;
        padding: 0 !important;
      }
      .docx-page {
        width: 210mm !important;
        height: 297mm !important;
        min-height: 297mm !important;
        max-height: 297mm !important;
        box-shadow: none !important;
        margin: 0 !important;
        page-break-after: avoid;
        page-break-inside: avoid;
      }
      @page {
        size: A4 portrait;
        margin: 0;
      }
    }

    /* TOP GEOMETRIC RIBBON BANNER */
    .docx-top-banner {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 48px;
      pointer-events: none;
      z-index: 10;
    }

    .docx-top-orange-line {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: #f26522;
    }

    .docx-top-svg {
      position: absolute;
      top: 0;
      right: 0;
      width: 320px;
      height: 48px;
    }

    /* BOTTOM GEOMETRIC RIBBON BANNER */
    .docx-bottom-banner {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 44px;
      pointer-events: none;
      z-index: 10;
    }

    .docx-bottom-dark-line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: #2b2e35;
    }

    .docx-bottom-svg {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 320px;
      height: 44px;
    }

    /* AUTHENTIC WATERMARK IMAGE - Exact DOCX extracted image */
    .docx-watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 195mm;
      height: auto;
      opacity: 0.18;
      pointer-events: none;
      z-index: 1;
      user-select: none;
    }

    /* MAIN CONTENT AREA - Matches Word Document Margins (Left 20mm, Right 16mm, Top 14mm, Bottom 14mm) */
    .docx-main {
      position: relative;
      z-index: 2;
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 16mm 18mm 12mm 20mm;
    }

    /* LOGO HEADER */
    .docx-logo-wrap {
      margin-top: 2mm;
      margin-bottom: 5mm;
    }

    .docx-logo-img {
      height: 58px;
      width: auto;
      object-fit: contain;
      display: block;
    }

    /* CANDIDATE INFO & DATE ROW */
    .docx-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 5mm;
    }

    .docx-candidate-info {
      font-size: 12pt;
      line-height: 1.35;
    }

    .docx-candidate-name {
      font-size: 13pt;
      font-weight: bold;
      color: #000000;
      letter-spacing: 0.2px;
      text-transform: uppercase;
      margin-bottom: 1px;
    }

    .docx-contact-field {
      font-size: 12pt;
      color: #000000;
      margin-bottom: 1px;
    }

    .docx-field-label {
      font-weight: bold;
    }

    .docx-email-link {
      color: #0033cc;
      text-decoration: underline;
    }

    .docx-date {
      font-size: 12pt;
      font-weight: bold;
      color: #000000;
      white-space: nowrap;
      padding-top: 1px;
    }

    /* SALUTATION & SUBJECT */
    .doc-salutation {
      font-size: 12pt;
      font-weight: bold;
      color: #000000;
      margin-bottom: 4mm;
    }

    .doc-subject {
      font-size: 12pt;
      font-weight: bold;
      color: #000000;
      margin-bottom: 4mm;
    }

    /* BODY PARAGRAPHS */
    .doc-para {
      font-size: 12pt;
      line-height: 1.28;
      color: #000000;
      margin-bottom: 3.5mm;
      text-align: justify;
    }

    .doc-para b {
      font-weight: bold;
    }

    /* INTERNSHIP DETAILS BLOCK */
    .doc-details-list {
      margin-bottom: 3.5mm;
      font-size: 12pt;
      line-height: 1.3;
    }

    .doc-details-heading {
      font-weight: bold;
      margin-bottom: 1.5px;
    }

    .doc-details-item {
      margin-bottom: 1px;
    }

    .doc-details-item b {
      font-weight: bold;
    }

    /* HR INLINE DETAILS BLOCK (Ashwini format) */
    .doc-hr-inline-block {
      margin-bottom: 3.5mm;
      font-size: 12pt;
      line-height: 1.35;
    }

    .doc-hr-row {
      display: flex;
      justify-content: flex-start;
      gap: 30mm;
      margin-bottom: 1.5px;
    }

    .doc-hr-row b {
      font-weight: bold;
    }

    /* AUTHENTIC SCANNED INK STAMP - Exact Docx extracted JPEG */
    .docx-stamp-wrap {
      text-align: center;
      margin: 2mm auto 1mm auto;
      pointer-events: none;
    }

    .docx-stamp-img {
      width: 126px;
      height: 126px;
      object-fit: contain;
      display: block;
      margin: 0 auto;
    }

    /* FOOTER ROW */
    .docx-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: auto;
      padding-bottom: 4mm;
    }

    /* SIGN-OFF (LEFT) */
    .docx-signoff {
      font-size: 12pt;
      line-height: 1.3;
      color: #000000;
    }

    .docx-signoff b {
      font-weight: bold;
      display: block;
    }

    /* CONTACT BLOCK (RIGHT) */
    .docx-contact {
      text-align: right;
      font-size: 11pt;
      color: #464646;
      line-height: 1.3;
    }

    .docx-contact-line {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 5px;
      margin-bottom: 1.5px;
      color: #464646;
    }

    .docx-contact-line a {
      color: #464646;
      text-decoration: underline;
    }

    .docx-icon {
      width: 13px;
      height: 13px;
      object-fit: contain;
      flex-shrink: 0;
      display: inline-block;
    }

    .docx-gstin {
      font-weight: bold;
      color: #464646;
      margin-top: 1px;
    }
  </style>
</head>
<body>

  <div class="docx-page" id="offerLetterPage">

    <!-- TOP GEOMETRIC RIBBON BANNER -->
    <div class="docx-top-banner">
      <div class="docx-top-orange-line"></div>
      <svg class="docx-top-svg" viewBox="0 0 320 48" preserveAspectRatio="none">
        <!-- Charcoal angular ribbon -->
        <polygon points="50,0 200,0 150,48 0,48" fill="#2b2e35" />
        <!-- White separator gap -->
        <polygon points="198,0 216,0 166,48 148,48" fill="#ffffff" />
        <!-- Orange angular ribbon -->
        <polygon points="214,0 320,0 270,48 164,48" fill="#f26522" />
      </svg>
    </div>

    <!-- BOTTOM GEOMETRIC RIBBON BANNER -->
    <div class="docx-bottom-banner">
      <div class="docx-bottom-dark-line"></div>
      <svg class="docx-bottom-svg" viewBox="0 0 320 44" preserveAspectRatio="none">
        <!-- Orange angular ribbon from bottom left -->
        <polygon points="0,0 150,0 200,44 0,44" fill="#f26522" />
        <!-- White separator gap -->
        <polygon points="146,0 164,0 214,44 196,44" fill="#ffffff" />
        <!-- Charcoal angular ribbon -->
        <polygon points="162,0 240,0 280,44 202,44" fill="#2b2e35" />
      </svg>
    </div>

    <!-- AUTHENTIC WATERMARK IMAGE (Extracted from official DOCX) -->
    ${watermarkDataUri ? `<img src="${watermarkDataUri}" alt="PaulTech Watermark" class="docx-watermark" />` : ''}

    <!-- MAIN BODY -->
    <div class="docx-main">

      <!-- LOGO -->
      <div class="docx-logo-wrap">
        ${logoDataUri ? `<img src="${logoDataUri}" alt="PaulTech Software Services" class="docx-logo-img" />` : ''}
      </div>

      <!-- CANDIDATE META & DATE -->
      <div class="docx-meta-row">
        <div class="docx-candidate-info">
          <div class="docx-candidate-name">${studentName}</div>
          <div class="docx-contact-field"><span class="docx-field-label">Contact No:</span> ${contactNo}</div>
          <div class="docx-contact-field"><span class="docx-field-label">Email:</span> <a href="mailto:${email}" class="docx-email-link">${email}</a></div>
        </div>
        <div class="docx-date">Date:${date}</div>
      </div>

      <!-- SALUTATION -->
      <div class="doc-salutation">Dear ${salutationName},</div>

      <!-- SUBJECT LINE (if applicable) -->
      ${subjectLine}

      <!-- LEAD PARAGRAPH -->
      <p class="doc-para">
        We are pleased to offer you the position of <b>${positionTitle}</b> at <b>PAULTECH SOFTWARE SERVICES (OPC) PVT LTD.</b> We believe your skills and enthusiasm will be a valuable addition to our team.
      </p>

      <!-- DETAILS BLOCK -->
      <div class="doc-details-list">
        <div class="doc-details-heading">Internship Details:</div>
        <div class="doc-details-item"><b>Position:</b> ${positionShort || positionTitle}</div>
        <div class="doc-details-item"><b>Department:</b> ${department}</div>
        <div class="doc-details-item"><b>Duration:</b> Starting from ${startDate}, ${duration}</div>
        <div class="doc-details-item"><b>Reporting To:</b> ${reportingTo}</div>
      </div>

      <!-- DOMAIN BODY PARAGRAPHS -->
      <div class="doc-domain-paragraphs">
        ${bodyParagraphs}
      </div>

      <!-- AUTHENTIC CIRCULAR RUBBER STAMP -->
      <div class="docx-stamp-wrap">
        ${stampDataUri ? `<img src="${stampDataUri}" alt="Official Stamp" class="docx-stamp-img" />` : ''}
      </div>

      <!-- FOOTER -->
      <div class="docx-footer">

        <!-- SIGN-OFF (LEFT) -->
        <div class="docx-signoff">
          <b>Thanks & Regards,</b>
          <b>Mrs. Daljeet Paul</b>
          <b>HR MANAGER HEAD</b>
          ${isInlineDetails ? `<b>PaulTech Software Services (OPC) Pvt Ltd.</b>` : ''}
        </div>

        <!-- CONTACT INFO (RIGHT) -->
        <div class="docx-contact">
          <div class="docx-contact-line">
            <span>7209986943/7061273234</span>
            ${iconPhoneUri ? `<img src="${iconPhoneUri}" alt="Phone" class="docx-icon" />` : ''}
          </div>
          <div class="docx-contact-line">
            <a href="mailto:hr@paultechsoftwareservices.com">hr@paultechsoftwareservices.com</a>
            ${iconEmailUri ? `<img src="${iconEmailUri}" alt="Email" class="docx-icon" />` : ''}
          </div>
          <div class="docx-contact-line">
            <a href="https://paultechsoftwareservices.com" target="_blank">https://paultechsoftwareservices.com</a>
            ${iconWebUri ? `<img src="${iconWebUri}" alt="Website" class="docx-icon" />` : ''}
          </div>
          <div class="docx-contact-line">
            <span>1<sup>st</sup> Floor, Pacific Height Building, Aambagan,</span>
            ${iconLocationUri ? `<img src="${iconLocationUri}" alt="Location" class="docx-icon" />` : ''}
          </div>
          <div class="docx-contact-line">
            <span>Sakchi, Jamshedpur-831001</span>
          </div>
          <div class="docx-gstin">GSTIN: 20AAKCP7675D1ZE</div>
        </div>

      </div>

    </div>

  </div>

</body>
</html>`;
}

module.exports = {
  DOMAIN_CONFIGS,
  DEFAULT_DOMAIN_CONFIG,
  getDomainConfig,
  generateOfferLetterHtml,
  formatDateDDMMYYYY,
  formatDateOrdinal,
  formatDurationText
};
