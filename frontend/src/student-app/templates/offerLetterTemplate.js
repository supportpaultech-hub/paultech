// PaulTech Offer Letter Template & Domain Configurations
// Pixel-perfect implementation matching official company documents

export const COMPANY_DETAILS = {
  name: 'PAULTECH SOFTWARE SERVICES (OPC) PVT LTD.',
  shortName: 'PaulTech Software Services',
  regNo: 'Reg. No.-013440',
  gstin: '20AAKCP7675D1ZE',
  addressLine1: '1st Floor, Pacific Height Building, Aambagan,',
  addressLine2: 'Sakchi, Jamshedpur-831001',
  phones: '7209986943/7061273234',
  email: 'hr@paultechsoftwareservices.com',
  website: 'https://paultechsoftwareservices.com',
  signatory: {
    closing: 'Thanks & Regards,',
    name: 'Mrs. Daljeet Paul',
    designation: 'HR MANAGER HEAD',
    company: 'PaulTech Software Services (OPC) Pvt Ltd.'
  }
};

export const DOMAIN_CONFIGS = {
  // 1. HR Domain (Exact reproduction of Ashwini Kumari offer letter)
  'Human Resources (HR)': {
    domainKey: 'HR',
    aliases: ['HR', 'Human Resources', 'HR Intern', 'Human Resource'],
    positionTitle: 'Human Resource Intern',
    positionShort: 'HR Intern',
    department: 'HR',
    subjectLine: '',
    reportingTo: 'Mrs. Daljeet Paul, Senior HR Department',
    defaultDuration: '6 Weeks',
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
    department: 'IT & Software Development',
    subjectLine: 'Subject: Internship Offer for MERN Stack Web Development',
    reportingTo: 'Mrs. Daljeet Paul, Senior HR Department',
    defaultDuration: '60 Days',
    paragraphs: [
      `During your internship, you will have the opportunity to build modern full-stack web applications using MongoDB, Express.js, React, and Node.js. You will collaborate closely with senior engineers to design and implement RESTful APIs, scalable frontend state architectures, and robust database models while adhering to industry engineering standards.`,
      `Throughout the program, you will receive structured mentorship to master real-world software workflows, version control, and full-stack deployment best practices. During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.`,
      `We are excited to have you on board and look forward to working with you!`
    ]
  },

  // 4. Python / Django Full Stack
  'Full stack (DJANGO)': {
    domainKey: 'DJANGO',
    aliases: ['Python', 'Django', 'Full stack Django', 'Python Developer', 'Python Full Stack'],
    positionTitle: 'Python & Django Full Stack Intern',
    positionShort: 'Python Developer Intern',
    department: 'Software Development',
    subjectLine: 'Subject: Internship Offer for Python & Django Full Stack Development',
    reportingTo: 'Mrs. Daljeet Paul, Senior HR Department',
    defaultDuration: '60 Days',
    paragraphs: [
      `During your internship, you will have the opportunity to develop robust backend web architectures using Python, Django, and relational databases. You will collaborate closely with senior engineers to implement scalable RESTful APIs, authenticate secure endpoints, and optimize query performance within production environments.`,
      `During your internship, you are expected to adhere to all company policies, commit to clean software engineering practices, and maintain the confidentiality of all proprietary information.`,
      `We are excited to have you on board and look forward to working with you!`
    ]
  },

  // 5. Full Stack PHP
  'FULL STACK PHP': {
    domainKey: 'PHP',
    aliases: ['PHP', 'Laravel', 'Full Stack PHP', 'PHP Developer'],
    positionTitle: 'Full Stack PHP Development Intern',
    positionShort: 'PHP Developer Intern',
    department: 'IT & Web Development',
    subjectLine: 'Subject: Internship Offer for Full Stack PHP Development',
    reportingTo: 'Mrs. Daljeet Paul, Senior HR Department',
    defaultDuration: '60 Days',
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
    department: 'Creative & UI/UX Design',
    subjectLine: 'Subject: Internship Offer for Web Design & UI/UX',
    reportingTo: 'Mrs. Daljeet Paul, Senior HR Department',
    defaultDuration: '60 Days',
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
    department: 'Data & Business Intelligence',
    subjectLine: 'Subject: Internship Offer for Data Analytics',
    reportingTo: 'Mrs. Daljeet Paul, Senior HR Department',
    defaultDuration: '60 Days',
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
    department: 'Data & AI Technologies',
    subjectLine: 'Subject: Internship Offer for Data Science',
    reportingTo: 'Mrs. Daljeet Paul, Senior HR Department',
    defaultDuration: '60 Days',
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
    department: 'AI Research & Engineering',
    subjectLine: 'Subject: Internship Offer for Artificial Intelligence & Machine Learning',
    reportingTo: 'Mrs. Daljeet Paul, Senior HR Department',
    defaultDuration: '60 Days',
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
    department: 'Marketing & Growth',
    subjectLine: 'Subject: Internship Offer for Digital Marketing',
    reportingTo: 'Mrs. Daljeet Paul, Senior HR Department',
    defaultDuration: '60 Days',
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
    department: 'Finance & Accounts',
    subjectLine: 'Subject: Internship Offer for Finance',
    reportingTo: 'Mrs. Daljeet Paul, Senior HR Department',
    defaultDuration: '60 Days',
    paragraphs: [
      `During your internship, you will have the opportunity to assist in corporate ledger reconciliation, financial reporting, and invoice audits. You will work alongside finance leads to analyze cost structures, verify compliance documents, and learn statutory accounting methodologies in a corporate setting.`,
      `During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.`,
      `We wish you a successful and enriching internship experience with PAULTECH SOFTWARE SERVICES (OPC) PVT LTD.`
    ]
  }
};

export const DEFAULT_DOMAIN_CONFIG = {
  domainKey: 'DEFAULT',
  positionTitle: 'Software Engineering Intern',
  positionShort: 'Intern',
  department: 'IT & Technology',
  subjectLine: 'Subject: Internship Offer Letter',
  reportingTo: 'Mrs. Daljeet Paul, Senior HR Department',
  defaultDuration: '60 Days',
  paragraphs: [
    `During your internship, you will have the opportunity to work closely with senior mentors and team members across key live projects. You will participate in feature implementation, code reviews, and project documentation while strengthening your technical expertise and professional communication skills.`,
    `During your internship, you are expected to adhere to all company policies and maintain the confidentiality of all proprietary information.`,
    `We wish you a successful and enriching internship experience with PAULTECH SOFTWARE SERVICES (OPC) PVT LTD.`
  ]
};

// PRESET SAMPLES (Recreating exact files from user images)
export const SAMPLE_PRESETS = {
  hrSample: {
    label: 'Ashwini Kumari (HR Sample)',
    name: 'ASHWINI KUMARI',
    phone: '9431953256',
    email: 'kumariashwini091@gmail.com',
    date: '09.10.2026',
    startDate: '12th Oct 2026',
    duration: '6 Weeks',
    domain: 'Human Resources (HR)',
    reportingTo: 'Mrs. Daljeet Paul, Senior HR Department',
    subjectLine: ''
  },
  fullstackSample: {
    label: 'Suvra Satpathy (Full Stack Sample)',
    name: 'SUVRA SATPATHY',
    phone: '9635785942',
    email: 'suvrasatpathy07@gmil.com',
    date: '24.09.2026',
    startDate: '25th Sep 2026',
    duration: '60 Days',
    domain: 'Full Stack Web Development',
    reportingTo: 'Mrs. Daljeet, Senior HR department',
    subjectLine: 'Subject: Internship Offer for Full Stack Web Development'
  },
  blankTemplate: {
    label: 'Blank Master Format (Placeholders)',
    name: '{{STUDENT_NAME}}',
    phone: '{{CONTACT_NO}}',
    email: '{{EMAIL}}',
    date: '{{DATE}}',
    startDate: '{{START_DATE}}',
    duration: '{{DURATION}}',
    domain: 'Human Resources (HR)',
    reportingTo: '{{REPORTING_TO}}',
    subjectLine: '{{SUBJECT_LINE}}'
  }
};

export const getDomainConfig = (domainStr) => {
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

export const formatDateDDMMYYYY = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

export const formatDateOrdinal = (dateVal) => {
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

export const formatDurationText = (months, domainKey) => {
  if (!months) return domainKey === 'HR' ? '6 Weeks' : '60 Days';
  const m = parseInt(months, 10);
  if (isNaN(m) || m <= 0) return '60 Days';
  if (m === 1) return '30 Days';
  if (m === 2) return '60 Days';
  if (m === 3) return '90 Days';
  if (m === 6) return '6 Months';
  return `${m} Months`;
};
