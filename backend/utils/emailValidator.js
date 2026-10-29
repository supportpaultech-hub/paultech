const dns = require('dns').promises;

// Common domain typos mapping
const DOMAIN_TYPOS = {
  'gamil.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gamil.co': 'gmail.com',
  'gmaill.co': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yaho.co': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outlock.com': 'outlook.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com'
};

// Top disposable / burner email domains
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', '10minutemail.com', 'mailinator.com', 'guerrillamail.com',
  'throwawaymail.com', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
  'getnada.com', 'yopmail.com', 'mohmal.com', 'dispostable.com',
  'sharklasers.com', 'crazymailing.com', 'mytemp.email', 'tempail.com',
  'generator.email', 'emailondeck.com', 'inboxkitten.com'
]);

/**
 * Validates an email address using multi-layer checks:
 * 1. Syntax / RFC check
 * 2. Typo suggestions
 * 3. Disposable domain check
 * 4. Provider-specific rules (e.g. Gmail 6-30 chars, no consecutive dots)
 * 5. DNS MX Record lookup (ensures domain has real active mail servers)
 */
async function validateEmailAddress(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email address is required.' };
  }

  const trimmed = email.trim().toLowerCase();

  // 1. Basic RFC syntax check
  const basicRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!basicRegex.test(trimmed)) {
    return { valid: false, error: 'Enter a valid email' };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Enter a valid email' };
  }

  const [username, domain] = parts;
  if (!username || !domain) {
    return { valid: false, error: 'Enter a valid email' };
  }

  // 2. Common Typo Check
  if (DOMAIN_TYPOS[domain]) {
    return { 
      valid: false, 
      error: `Did you mean @${DOMAIN_TYPOS[domain]}?` 
    };
  }

  // 3. Disposable / Temp Mail Check
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { 
      valid: false, 
      error: 'Temporary or disposable email addresses are not accepted.' 
    };
  }

  // 4. Gmail-specific validation rules
  if (domain === 'gmail.com') {
    // Google requires Gmail usernames to be between 6 and 30 characters
    if (username.length < 6 || username.length > 30) {
      return { 
        valid: false, 
        error: 'Gmail username must be between 6 and 30 characters.' 
      };
    }
    // Cannot start or end with a period
    if (username.startsWith('.') || username.endsWith('.')) {
      return { 
        valid: false, 
        error: 'Gmail username cannot start or end with a period.' 
      };
    }
    // Cannot contain consecutive periods (..)
    if (username.includes('..')) {
      return { 
        valid: false, 
        error: 'Gmail username cannot contain consecutive dots (..).' 
      };
    }
    // Must contain only letters, numbers, and periods
    if (!/^[a-z0-9.]+$/.test(username)) {
      return { 
        valid: false, 
        error: 'Gmail username can only contain letters, numbers, and periods.' 
      };
    }
  }

  // 5. DNS MX Record Verification (Checks if domain has real mail server)
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { 
        valid: false, 
        error: `Mail server not found for @${domain}. Enter a valid email.` 
      };
    }
  } catch (dnsErr) {
    // Code ENOTFOUND or ENODATA means domain doesn't exist or has no mail servers
    if (dnsErr.code === 'ENOTFOUND' || dnsErr.code === 'ENODATA' || dnsErr.code === 'EREFUSED') {
      return { 
        valid: false, 
        error: `Mail server not found for @${domain}. Enter a valid email.` 
      };
    }
    // In case of network sandbox or offline lookup, log and allow standard domains
    console.warn(`DNS lookup notice for ${domain}:`, dnsErr.message);
  }

  return { valid: true, email: trimmed };
}

module.exports = { validateEmailAddress, DOMAIN_TYPOS, DISPOSABLE_DOMAINS };

