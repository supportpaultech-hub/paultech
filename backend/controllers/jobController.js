const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const Student = require('../models/Student');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const cloudinary = require('../config/cloudinary');
const { logActivity } = require('./activityController');
const { sendPaymentReceiptEmail } = require('../utils/mailer');

// Helper to stream remote file to response (follows redirects, sets inline PDF headers)
const streamRemoteFile = (targetUrl, res, filename = 'resume.pdf', maxRedirects = 4) => {
  if (maxRedirects <= 0) {
    return res.redirect(targetUrl);
  }

  try {
    const client = targetUrl.startsWith('https:') ? https : http;
    const request = client.get(targetUrl, (remoteRes) => {
      // Follow HTTP redirects (301, 302, 307, 308)
      if (remoteRes.statusCode >= 300 && remoteRes.statusCode < 400 && remoteRes.headers.location) {
        let redirectUrl = remoteRes.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const parsed = new URL(targetUrl);
          redirectUrl = new URL(redirectUrl, parsed.origin).href;
        }
        return streamRemoteFile(redirectUrl, res, filename, maxRedirects - 1);
      }

      if (remoteRes.statusCode === 200) {
        const contentType = remoteRes.headers['content-type'] || 'application/pdf';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        return remoteRes.pipe(res);
      }

      // If remote returned an error status, fallback to redirect
      console.warn(`Remote server returned status ${remoteRes.statusCode} for resume, redirecting`);
      return res.redirect(targetUrl);
    });

    request.on('error', (err) => {
      console.error('Error in resume streaming proxy:', err);
      if (!res.headersSent) {
        return res.redirect(targetUrl);
      }
    });

    request.setTimeout(15000, () => {
      request.destroy();
      if (!res.headersSent) {
        return res.redirect(targetUrl);
      }
    });
  } catch (err) {
    console.error('Exception in streamRemoteFile:', err);
    if (!res.headersSent) {
      return res.redirect(targetUrl);
    }
  }
};

// Helper to upload resume to Cloudinary
const uploadResumeToCloudinary = async (filePath) => {
  try {
    const isPdf = (filePath || '').toLowerCase().endsWith('.pdf');
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'paultech_resumes',
      resource_type: isPdf ? 'image' : 'raw',
      access_mode: 'public',
      type: 'upload'
    });
    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary resume upload error:', err);
    return null;
  }
};

// 1. Get all jobs & internships
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 2. Create a new job or internship (Admin)
exports.createJob = async (req, res) => {
  try {
    const { title, type, location, experience, salary, description, requirements } = req.body;

    let parsedRequirements = [];
    if (requirements) {
      if (Array.isArray(requirements)) {
        parsedRequirements = requirements;
      } else if (typeof requirements === 'string') {
        try {
          parsedRequirements = JSON.parse(requirements);
        } catch (e) {
          parsedRequirements = requirements.split('\n').map(s => s.trim()).filter(Boolean);
        }
      }
    }

    const newJob = new Job({
      title,
      type: type === 'Internship' ? 'Internship' : 'Job',
      location: location || 'Jamshedpur / Remote',
      experience: experience || (type === 'Internship' ? 'Fresher / Student' : '0-2 Years'),
      salary: salary || (type === 'Internship' ? 'Stipend Provided' : 'Best in Industry'),
      description,
      requirements: parsedRequirements
    });

    await newJob.save();
    res.status(201).json({ message: 'Career opening posted successfully', job: newJob });
  } catch (err) {
    console.error('Error creating job posting:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

// 3. Delete a job posting (Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Opening not found' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Opening deleted successfully' });
  } catch (err) {
    console.error('Error deleting job posting:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 4. Candidate Applies for Job (Compulsory Resume Upload)
exports.applyForJob = async (req, res) => {
  try {
    const { 
      jobId, 
      jobTitle, 
      candidateName, 
      candidateEmail, 
      candidatePhone, 
      domain, 
      duration, 
      joining_date, 
      college, 
      branch, 
      graduationYear, 
      experience, 
      coverNote,
      mode,
      registrationFee,
      paymentStatus,
      paymentId,
      paymentMethod
    } = req.body;

    if (!candidateName || !candidateEmail || !candidatePhone || !jobTitle) {
      return res.status(400).json({ error: 'Candidate name, email, phone, and job title are required.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Resume upload is compulsory. Please attach your PDF/DOC resume.' });
    }

    // Default to local path as primary backup
    let resumePath = `/uploads/${req.file.filename}`;

    // Try Cloudinary upload
    const cloudUrl = await uploadResumeToCloudinary(req.file.path);
    if (cloudUrl) {
      resumePath = cloudUrl;
    }

    const applicationMode = (mode === 'Online' || mode === 'online') ? 'Online' : 'Offline';

    const newApplication = new JobApplication({
      jobId: jobId || null,
      jobTitle,
      candidateName: (candidateName || '').trim(),
      candidateEmail: (candidateEmail || '').trim().toLowerCase(),
      candidatePhone: (candidatePhone || '').trim(),
      mode: applicationMode,
      domain: domain || 'MERN stack',
      duration: duration ? parseInt(duration, 10) : 2,
      joining_date: joining_date ? new Date(joining_date) : new Date(),
      college: college || '',
      branch: branch || '',
      graduationYear: graduationYear || '',
      experience: experience || 'Fresher',
      coverNote: coverNote || '',
      resumeUrl: resumePath,
      localResumePath: req.file ? `/uploads/${req.file.filename}` : '',
      registrationFee: registrationFee ? parseInt(registrationFee, 10) : 1000,
      paymentStatus: paymentStatus || 'Completed',
      paymentId: paymentId || '',
      paymentMethod: paymentMethod || 'UPI / Online Gateway',
      status: 'Pending'
    });

    await newApplication.save();

    // Send Payment Receipt email
    try {
      if (paymentStatus === 'Completed' || newApplication.paymentStatus === 'Completed') {
        sendPaymentReceiptEmail({
          candidateName: newApplication.candidateName,
          candidateEmail: newApplication.candidateEmail,
          jobTitle: newApplication.jobTitle,
          amount: newApplication.registrationFee || 1000,
          paymentId: newApplication.paymentId,
          paymentMethod: newApplication.paymentMethod
        }).catch(e => console.error('Error sending payment email:', e));
      }
    } catch (emailErr) {
      console.error('Error triggering payment receipt email:', emailErr);
    }

    // Log Activity for telemetry & audit trail
    try {
      const isIntern = (jobTitle || '').toLowerCase().includes('intern') || (experience && experience.toLowerCase().includes('student'));
      await logActivity(
        isIntern ? 'New Internship Application' : 'New Job Application',
        `${candidateName} applied for ${jobTitle} (${candidateEmail})`,
        'user',
        candidateName
      );
    } catch (actErr) {
      console.error('Error logging application activity:', actErr);
    }

    res.status(201).json({ 
      message: 'Job application submitted successfully! Our HR team will review your resume and contact you soon.', 
      application: newApplication 
    });
  } catch (err) {
    console.error('Error submitting job application:', err);
    res.status(500).json({ error: err.message || 'Failed to submit job application.' });
  }
};

// 5. Get All Candidate Applications (Admin)
exports.getApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error('Error fetching job applications:', err);
    res.status(500).json({ error: 'Failed to fetch job applications' });
  }
};

// 6. Get/View Candidate Resume File (Admin Proxy & Secure Streaming)
exports.getResume = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application || !application.resumeUrl) {
      return res.status(404).send('Resume file not found');
    }

    const resumeUrl = application.resumeUrl;
    const safeName = (application.candidateName || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFilename = `${safeName}_Resume.pdf`;

    // A. Check explicit localResumePath if stored
    if (application.localResumePath) {
      const explicitLocal = path.join(__dirname, '..', application.localResumePath);
      if (fs.existsSync(explicitLocal)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
        return res.sendFile(explicitLocal);
      }
    }

    // B. If saved directly as local /uploads/ URL
    if (resumeUrl.startsWith('/uploads/')) {
      const localPath = path.join(__dirname, '..', resumeUrl);
      if (fs.existsSync(localPath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
        return res.sendFile(localPath);
      }
    }

    // C. Check uploads directory for matching file or basename
    const uploadsDir = path.join(__dirname, '../uploads');
    if (fs.existsSync(uploadsDir)) {
      try {
        const basename = path.basename(resumeUrl);
        const candidateLocal = path.join(uploadsDir, basename);
        if (fs.existsSync(candidateLocal)) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
          return res.sendFile(candidateLocal);
        }
      } catch (checkErr) {
        // Proceed to remote retrieval
      }
    }

    // D. If saved as Cloudinary or remote URL
    if (resumeUrl.startsWith('http')) {
      // 1. Raw PDF Upload (Subject to Cloudinary ACL 401 on restricted accounts)
      if (resumeUrl.includes('/raw/upload/')) {
        const rawMatch = resumeUrl.match(/\/raw\/upload\/(?:v\d+\/)?(.+)$/);
        if (rawMatch && rawMatch[1]) {
          const publicId = decodeURIComponent(rawMatch[1]);
          try {
            // Generate authorized signed download URL using API Secret
            const signedDownloadUrl = cloudinary.utils.private_download_url(publicId, '', {
              resource_type: 'raw',
              type: 'upload',
              expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour validity
            });

            return streamRemoteFile(signedDownloadUrl, res, safeFilename);
          } catch (signErr) {
            console.error('Error generating signed download URL for raw resume:', signErr);
          }
        }
      }

      // 2. Image Upload PDF
      if (resumeUrl.includes('/image/upload/')) {
        let targetUrl = resumeUrl.replace('/fl_attachment/', '/');
        return streamRemoteFile(targetUrl, res, safeFilename);
      }

      // 3. Fallback for any other remote URL
      return streamRemoteFile(resumeUrl, res, safeFilename);
    }

    res.status(404).send('Resume asset unavailable');
  } catch (err) {
    console.error('Error serving candidate resume:', err);
    res.status(500).send('Failed to serve candidate resume');
  }
};

// 7. Update Application Status (Admin: Shortlisted, Rejected, etc.)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (status) application.status = status;
    await application.save();

    res.json({ message: 'Application status updated successfully', application });
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};

// 8. Delete Application (Admin)
exports.deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Delete local resume if applicable
    if (application.resumeUrl && application.resumeUrl.startsWith('/uploads/')) {
      const fullPath = path.join(__dirname, '..', application.resumeUrl);
      if (fs.existsSync(fullPath)) {
        try { fs.unlinkSync(fullPath); } catch (e) {}
      }
    }

    await JobApplication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error('Error deleting application:', err);
    res.status(500).json({ error: 'Failed to delete application' });
  }
};

// 9. Student Admin Accepts Application, Creates Student & Dispatches Offer Letter
exports.acceptApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const Certificate = require('../models/Certificate');

    // Auto-generate sequential Certificate Number starting from PSS/2026/001
    const existingCerts = await Certificate.find({}, { certificateNo: 1 });
    const existingStudents = await Student.find({}, { 'certificate.certificateNo': 1 });

    let maxNum = 0;
    const regex = /PSS\/2026\/(\d+)/i;
    const checkNum = (str) => {
      if (str) {
        const m = str.toString().match(regex);
        if (m) {
          const val = parseInt(m[1], 10);
          if (!isNaN(val) && val > maxNum) maxNum = val;
        }
      }
    };
    existingCerts.forEach(c => checkNum(c.certificateNo));
    existingStudents.forEach(s => checkNum(s.certificate?.certificateNo));

    let nextVal = maxNum + 1;
    let certNo = `PSS/2026/${String(nextVal).padStart(3, '0')}`;
    while (
      (await Certificate.exists({ certificateNo: certNo })) ||
      (await Student.exists({ 'certificate.certificateNo': certNo }))
    ) {
      nextVal++;
      certNo = `PSS/2026/${String(nextVal).padStart(3, '0')}`;
    }

    const joinDate = application.joining_date ? new Date(application.joining_date) : new Date();
    const durationMonths = application.duration ? parseInt(application.duration, 10) : 2;
    const endDate = new Date(joinDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    // Find if student exists with email or create new
    let student = null;
    if (application.candidateEmail) {
      student = await Student.findOne({ email: application.candidateEmail.toLowerCase() });
    }

    if (!student) {
      student = await Student.create({
        name: application.candidateName,
        email: application.candidateEmail ? application.candidateEmail.toLowerCase() : '',
        phone: application.candidatePhone || '',
        domain: application.domain || 'MERN stack',
        joining_date: joinDate,
        duration: durationMonths,
        mode: application.mode || 'Offline',
        college: application.college || '',
        branch: application.branch || '',
        graduationYear: application.graduationYear || '',
        resumeUrl: application.resumeUrl || '',
        applicationId: application._id,
        status: 'Active',
        certificate: {
          certificateNo: certNo,
          startDate: joinDate,
          endDate: endDate,
          issueDate: new Date()
        }
      });

      // Sync Certificate collection
      try {
        await Certificate.create({
          certificateNo: student.certificate.certificateNo,
          candidateName: student.name,
          email: student.email ? student.email.toLowerCase() : '',
          phone: student.phone || '',
          domain: student.domain,
          startDate: student.certificate.startDate,
          endDate: student.certificate.endDate,
          issueDate: student.certificate.issueDate,
          duration: `${durationMonths} Months`
        });
      } catch (certErr) {
        console.error('Error auto-syncing Certificate in acceptApplication:', certErr);
      }
    } else {
      student.status = 'Active';
      student.domain = application.domain || student.domain;
      student.joining_date = joinDate;
      student.duration = durationMonths;
      student.applicationId = application._id;
      if (application.college) student.college = application.college;
      if (application.branch) student.branch = application.branch;
      if (application.graduationYear) student.graduationYear = application.graduationYear;
      if (application.resumeUrl) student.resumeUrl = application.resumeUrl;
      await student.save();
    }

    // Dispatch official Offer Letter Email
    let emailSent = false;
    if (student.email) {
      try {
        const { sendWelcomeEmail } = require('../utils/mailer');
        await sendWelcomeEmail(student);
        emailSent = true;
      } catch (mailErr) {
        console.error('Error sending offer letter email:', mailErr);
      }
    }

    application.status = 'Accepted';
    application.studentId = student._id;
    application.offerLetterSent = emailSent;
    application.offerLetterSentAt = new Date();
    await application.save();

    // Log Activity
    try {
      await logActivity(
        'Student Application Accepted & Offer Letter Sent',
        `Mrs. Daljeet accepted ${application.candidateName} for ${application.domain || 'Internship'}. Offer Letter dispatched to ${application.candidateEmail}.`,
        'student',
        'Student Admin'
      );
    } catch (actErr) {
      console.error('Error logging accept activity:', actErr);
    }

    res.json({
      success: true,
      message: `Student application accepted successfully! Registered into Student Directory and official Offer Letter email sent to ${student.email}.`,
      student,
      application
    });
  } catch (err) {
    console.error('Error in acceptApplication:', err);
    res.status(500).json({ error: err.message || 'Failed to accept student application' });
  }
};

// 10. Student Admin Rejects Application
exports.rejectApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = 'Rejected';
    await application.save();

    res.json({ success: true, message: 'Application rejected', application });
  } catch (err) {
    console.error('Error in rejectApplication:', err);
    res.status(500).json({ error: 'Failed to reject application' });
  }
};

// 11. Download / Preview Offer Letter PDF for an Application
exports.downloadOfferLetter = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { generateOfferLetterPdfBuffer } = require('../utils/pdfGenerator');
    const studentData = {
      name: application.candidateName,
      email: application.candidateEmail,
      phone: application.candidatePhone,
      domain: application.jobTitle,
      date: application.appliedAt || new Date(),
      joining_date: new Date(),
      duration: 2
    };

    const pdfResult = await generateOfferLetterPdfBuffer(studentData);
    if (!pdfResult.success || !pdfResult.pdfBuffer) {
      return res.status(500).json({ error: pdfResult.error || 'Failed to generate Offer Letter PDF' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${pdfResult.filename}"`);
    return res.send(pdfResult.pdfBuffer);
  } catch (err) {
    console.error('Error generating offer letter PDF for application:', err);
    res.status(500).json({ error: 'Failed to generate Offer Letter PDF' });
  }
};



