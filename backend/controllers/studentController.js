const Student = require('../models/Student');
const cloudinary = require('../config/cloudinary');

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

// Get all students (Admin & Developer)
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ joining_date: -1 });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a new student (Admin only)
const addStudent = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can add students' });
  }
  
  try {
    let studentData = { ...req.body };
    const shouldSendEmail = studentData.sendWelcomeEmail === 'true' || studentData.sendWelcomeEmail === true;
    delete studentData.sendWelcomeEmail;

    // Optional resume file upload
    if (req.file) {
      studentData.resumeUrl = `/uploads/${req.file.filename}`;
      const cloudUrl = await uploadResumeToCloudinary(req.file.path);
      if (cloudUrl) {
        studentData.resumeUrl = cloudUrl;
      }
    }
    
    // Auto-generate sequential Certificate Number starting from 001 (e.g. PSS/2026/001)
    const Certificate = require('../models/Certificate');
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

    const joinDate = studentData.joining_date ? new Date(studentData.joining_date) : new Date();
    const durationMonths = studentData.duration ? parseInt(studentData.duration, 10) : 3;
    const endDate = new Date(joinDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    if (!studentData.certificate) {
      studentData.certificate = {};
    }
    if (!studentData.certificate.certificateNo) {
      studentData.certificate.certificateNo = certNo;
    }
    studentData.certificate.startDate = studentData.certificate.startDate || joinDate;
    studentData.certificate.endDate = studentData.certificate.endDate || endDate;
    studentData.certificate.issueDate = studentData.certificate.issueDate || new Date();

    const student = await Student.create(studentData);
    
    // Sync into Certificate collection for public verification portal search
    try {
      const Certificate = require('../models/Certificate');
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
      console.error('Error auto-syncing new intern into Certificate registry:', certErr);
    }

    res.status(201).json(student);

    console.log(`Add Intern API: Intern created successfully with certNo=${student.certificate.certificateNo}. shouldSendEmail=${shouldSendEmail}, email=${student.email}`);
    if (shouldSendEmail && student.email) {
      const { sendWelcomeEmail } = require('../utils/mailer');
      sendWelcomeEmail(student).then(res => {
        console.log(`Welcome email result for ${student.email}:`, res);
      }).catch(err => {
        console.error('Failed to send welcome email in background:', err);
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a student (Admin only)
const updateStudent = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can update students' });
  }
  
  try {
    let updateData = { ...req.body };
    if (updateData.sendWelcomeEmail !== undefined) {
      delete updateData.sendWelcomeEmail;
    }

    if (req.file) {
      updateData.resumeUrl = `/uploads/${req.file.filename}`;
      const cloudUrl = await uploadResumeToCloudinary(req.file.path);
      if (cloudUrl) {
        updateData.resumeUrl = cloudUrl;
      }
    }

    const student = await Student.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update student certificate details (Admin & Developer)
const updateCertificate = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: { certificate: req.body } },
      { returnDocument: 'after' }
    );
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Sync update to Certificate registry
    try {
      const Certificate = require('../models/Certificate');
      if (student.certificate?.certificateNo) {
        await Certificate.findOneAndUpdate(
          { $or: [{ certificateNo: student.certificate.certificateNo }, { email: student.email?.toLowerCase() }] },
          {
            certificateNo: student.certificate.certificateNo,
            candidateName: student.name,
            email: student.email ? student.email.toLowerCase() : '',
            phone: student.phone || '',
            domain: student.domain,
            startDate: student.certificate.startDate,
            endDate: student.certificate.endDate,
            issueDate: student.certificate.issueDate || new Date(),
            duration: `${student.duration || 3} Months`
          },
          { upsert: true, new: true }
        );
      }
    } catch (certErr) {
      console.error('Error updating certificate registry:', certErr);
    }

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a student (Admin only)
const deleteStudent = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can delete students' });
  }
  
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Download / Preview Offer Letter PDF for a Student
const downloadOfferLetter = async (req, res) => {
  try {
    const Student = require('../models/Student');
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { generateOfferLetterPdfBuffer } = require('../utils/pdfGenerator');
    const pdfResult = await generateOfferLetterPdfBuffer(student);
    if (!pdfResult.success || !pdfResult.pdfBuffer) {
      return res.status(500).json({ error: pdfResult.error || 'Failed to generate Offer Letter PDF' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${pdfResult.filename}"`);
    return res.send(pdfResult.pdfBuffer);
  } catch (err) {
    console.error('Error generating offer letter PDF for student:', err);
    res.status(500).json({ error: 'Failed to generate Offer Letter PDF' });
  }
};

module.exports = {
  getAllStudents,
  addStudent,
  updateStudent,
  updateCertificate,
  deleteStudent,
  downloadOfferLetter
};
