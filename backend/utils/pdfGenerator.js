const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { generateOfferLetterHtml } = require('../templates/offerLetterTemplate');

// Browser executable resolver for Windows & Linux / Cloud
const findBrowserExecutable = () => {
  const possiblePaths = [
    // Windows Edge (Pre-installed on every Windows 10/11)
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    // Windows Chrome
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Google\\Chrome\\Application\\chrome.exe') : null,
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Microsoft\\Edge\\Application\\msedge.exe') : null,
    // Linux / Docker / Cloud environments
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium'
  ].filter(Boolean);

  for (const exePath of possiblePaths) {
    if (fs.existsSync(exePath)) {
      return exePath;
    }
  }

  // Fallback to CHROME_PATH environment variable if defined
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  return null;
};

/**
 * Automatically generate Offer Letter PDF Buffer for a student
 * @param {Object} studentData Student / Candidate record
 * @param {string} domainOverride Optional domain name to override
 * @returns {Promise<{ success: boolean, pdfBuffer: Buffer, filename: string, error?: string }>}
 */
const generateOfferLetterPdfBuffer = async (studentData = {}, domainOverride = null) => {
  const executablePath = findBrowserExecutable();

  if (!executablePath) {
    console.warn('PDF Generator Warning: No Chrome or Edge browser executable found on system.');
    return {
      success: false,
      error: 'Browser executable not found for PDF rendering'
    };
  }

  let browser = null;
  try {
    const rawName = (studentData.name || studentData.candidateName || 'Candidate').trim();
    const cleanFileName = `Offer_Letter_${rawName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

    const htmlContent = generateOfferLetterHtml(studentData, domainOverride);

    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-first-run'
      ]
    });

    const page = await browser.newPage();
    
    // Set HTML with embedded base64 logo and vector assets
    await page.setContent(htmlContent, {
      waitUntil: 'domcontentloaded',
      timeout: 20000
    });

    // Generate strict A4 portrait PDF with high DPI print background
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });

    await browser.close();
    browser = null;

    console.log(`PDF Generator: Successfully compiled ${cleanFileName} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);

    return {
      success: true,
      pdfBuffer: Buffer.from(pdfBuffer),
      filename: cleanFileName
    };
  } catch (err) {
    console.error('PDF Generator Error: Failed to compile Offer Letter PDF:', err);
    if (browser) {
      try { await browser.close(); } catch (e) {}
    }
    return {
      success: false,
      error: err.message
    };
  }
};

module.exports = {
  findBrowserExecutable,
  generateOfferLetterPdfBuffer
};
