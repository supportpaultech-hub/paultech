const Student = require('../models/Student');
const JobApplication = require('../models/JobApplication');
const { 
  DOMAIN_CONFIGS, 
  DEFAULT_DOMAIN_CONFIG, 
  generateOfferLetterHtml,
  formatDateDDMMYYYY,
  formatDateOrdinal
} = require('../templates/offerLetterTemplate');
const fs = require('fs');
const path = require('path');

// 1. Get available domains and their metadata
exports.getDomains = async (req, res) => {
  try {
    const domainsList = Object.keys(DOMAIN_CONFIGS).map(key => ({
      domainName: key,
      positionTitle: DOMAIN_CONFIGS[key].positionTitle,
      positionShort: DOMAIN_CONFIGS[key].positionShort,
      department: DOMAIN_CONFIGS[key].department,
      subjectLine: DOMAIN_CONFIGS[key].subjectLine,
      defaultDuration: DOMAIN_CONFIGS[key].defaultDuration,
      reportingTo: DOMAIN_CONFIGS[key].reportingTo,
      paragraphsCount: DOMAIN_CONFIGS[key].paragraphs.length
    }));
    res.json({ success: true, domains: domainsList, rawConfigs: DOMAIN_CONFIGS });
  } catch (err) {
    console.error('Error fetching offer letter domains:', err);
    res.status(500).json({ error: 'Failed to fetch offer letter domains' });
  }
};

// 2. Get Blank Template HTML
exports.getBlankTemplate = async (req, res) => {
  try {
    const blankHtml = generateOfferLetterHtml({}, 'Human Resources (HR)', true);
    res.type('html').send(blankHtml);
  } catch (err) {
    console.error('Error generating blank offer letter template:', err);
    res.status(500).json({ error: 'Failed to generate blank template' });
  }
};

// 3. Render Custom Offer Letter from Payload
exports.renderOfferLetter = async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      email, 
      domain, 
      date, 
      joining_date, 
      duration, 
      reportingTo,
      positionTitle,
      positionShort,
      department,
      subjectLine,
      asJson 
    } = req.body;

    const html = generateOfferLetterHtml({
      name,
      phone,
      email,
      domain,
      date,
      joining_date,
      duration,
      reportingTo,
      positionTitle,
      positionShort,
      department,
      subjectLine
    }, domain);

    if (asJson) {
      return res.json({ success: true, html });
    }
    res.type('html').send(html);
  } catch (err) {
    console.error('Error rendering offer letter:', err);
    res.status(500).json({ error: 'Failed to render offer letter' });
  }
};

// 4. Render for specific Student ID
exports.getStudentOfferLetter = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const html = generateOfferLetterHtml({
      name: student.name,
      email: student.email,
      phone: student.phone,
      domain: student.domain,
      joining_date: student.joining_date,
      duration: student.duration
    }, student.domain);

    if (req.query.json === 'true') {
      return res.json({ success: true, html, student });
    }
    res.type('html').send(html);
  } catch (err) {
    console.error('Error rendering student offer letter:', err);
    res.status(500).json({ error: 'Failed to render student offer letter' });
  }
};

// 5. Render for specific Job Application ID
exports.getApplicationOfferLetter = async (req, res) => {
  try {
    const app = await JobApplication.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const html = generateOfferLetterHtml({
      name: app.candidateName,
      email: app.candidateEmail,
      phone: app.candidatePhone,
      domain: app.domain || app.jobTitle,
      joining_date: app.joining_date,
      duration: app.duration
    }, app.domain || app.jobTitle);

    if (req.query.json === 'true') {
      return res.json({ success: true, html, application: app });
    }
    res.type('html').send(html);
  } catch (err) {
    console.error('Error rendering application offer letter:', err);
    res.status(500).json({ error: 'Failed to render application offer letter' });
  }
};
