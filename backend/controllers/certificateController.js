const Certificate = require('../models/Certificate');
const Student = require('../models/Student');

// Helper to generate unique Certificate Number (Format: PSS/2026/001)
const generateCertificateNo = async () => {
  try {
    const certs = await Certificate.find({}, { certificateNo: 1 });
    const students = await Student.find({}, { 'certificate.certificateNo': 1 });

    let maxNum = 0;
    const regex = /PSS\/2026\/(\d+)/i;

    const checkCert = (certNoStr) => {
      if (certNoStr) {
        const match = certNoStr.toString().match(regex);
        if (match) {
          const val = parseInt(match[1], 10);
          if (!isNaN(val) && val > maxNum) {
            maxNum = val;
          }
        }
      }
    };

    certs.forEach(c => checkCert(c.certificateNo));
    students.forEach(s => checkCert(s.certificate?.certificateNo));

    let candidateNum = maxNum + 1;
    let candidateCertNo = `PSS/2026/${String(candidateNum).padStart(3, '0')}`;

    while (
      (await Certificate.exists({ certificateNo: candidateCertNo })) ||
      (await Student.exists({ 'certificate.certificateNo': candidateCertNo }))
    ) {
      candidateNum++;
      candidateCertNo = `PSS/2026/${String(candidateNum).padStart(3, '0')}`;
    }

    return candidateCertNo;
  } catch (err) {
    const randomDigits = String(Math.floor(100 + Math.random() * 900));
    return `PSS/2026/${Date.now().toString().slice(-3)}${randomDigits}`;
  }
};

// 1. Verify Certificate Public Endpoint (Search by Certificate No, Email, or Phone)
const verifyCertificate = async (req, res) => {
  try {
    const { certNo } = req.params;
    if (!certNo || certNo.trim() === '') {
      return res.status(400).json({ error: 'Certificate number is required' });
    }

    const cleanCertNo = certNo.trim();
    const regexPattern = new RegExp('^' + cleanCertNo.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '$', 'i');

    // First search in Certificate collection
    let cert = await Certificate.findOne({
      $or: [
        { certificateNo: regexPattern },
        { certificateNo: cleanCertNo },
        { email: cleanCertNo.toLowerCase() },
        { phone: cleanCertNo }
      ]
    });

    if (cert) {
      return res.json({
        found: true,
        certificate: cert
      });
    }

    // Fallback: Search in Student collection (Interns)
    const student = await Student.findOne({
      $or: [
        { 'certificate.certificateNo': regexPattern },
        { 'certificate.certificateNo': cleanCertNo },
        { email: cleanCertNo.toLowerCase() },
        { phone: cleanCertNo }
      ]
    });

    if (student) {
      const mappedCert = {
        certificateNo: student.certificate?.certificateNo || `PSS/2026/${student.id ? student.id.toString().slice(-3).padStart(3, '0') : '001'}`,
        candidateName: student.name,
        email: student.email || '',
        phone: student.phone || '',
        domain: student.domain,
        startDate: student.certificate?.startDate || student.joining_date,
        endDate: student.certificate?.endDate || new Date(new Date(student.joining_date).setMonth(new Date(student.joining_date).getMonth() + (student.duration || 3))),
        issueDate: student.certificate?.issueDate || Date.now(),
        duration: `${student.duration || 3} Months`,
        status: 'VERIFIED'
      };

      return res.json({
        found: true,
        certificate: mappedCert
      });
    }

    // If not found in either
    return res.status(404).json({
      found: false,
      error: 'Invalid Certificate Number. No authentic record found in PaulTech registry.'
    });
  } catch (err) {
    console.error('Error verifying certificate:', err);
    res.status(500).json({ error: 'Server error during certificate verification' });
  }
};

// 2. Get All Certificates (Admin) - Auto Syncs from Student App to ensure complete list
const getAllCertificates = async (req, res) => {
  try {
    // Auto-sync any unsynced students from Student App
    try {
      const students = await Student.find();
      for (let index = 0; index < students.length; index++) {
        const st = students[index];
        const certNo = st.certificate?.certificateNo || await generateCertificateNo();

        const existing = await Certificate.findOne({
          $or: [
            { certificateNo: certNo },
            { email: st.email ? st.email.toLowerCase() : '____nonexist____' }
          ]
        });

        if (!existing) {
          const start = st.certificate?.startDate || st.joining_date;
          const durationMonths = st.duration || 3;
          const end = st.certificate?.endDate || new Date(new Date(start).setMonth(new Date(start).getMonth() + durationMonths));

          await Certificate.create({
            certificateNo: certNo,
            candidateName: st.name,
            email: st.email ? st.email.toLowerCase() : '',
            phone: st.phone || '',
            domain: st.domain,
            startDate: start,
            endDate: end,
            issueDate: st.certificate?.issueDate || new Date(),
            duration: `${durationMonths} Months`,
            studentId: st._id
          });

          if (!st.certificate?.certificateNo) {
            st.certificate = {
              certificateNo: certNo,
              startDate: start,
              endDate: end,
              issueDate: new Date()
            };
            await st.save();
          }
        }
      }
    } catch (syncErr) {
      console.error('Auto-sync error in getAllCertificates:', syncErr);
    }

    const certs = await Certificate.find().sort({ created_at: -1 });
    res.json(certs);
  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 3. Create Certificate (Admin)
const createCertificate = async (req, res) => {
  try {
    const { certificateNo, candidateName, email, phone, domain, startDate, endDate, issueDate, duration, grade } = req.body;

    const certNumber = certificateNo && certificateNo.trim() ? certificateNo.trim() : await generateCertificateNo();

    // Check if cert number already exists
    const existing = await Certificate.findOne({ certificateNo: certNumber });
    if (existing) {
      return res.status(400).json({ error: `Certificate number "${certNumber}" already exists.` });
    }

    const cert = new Certificate({
      certificateNo: certNumber,
      candidateName,
      email: email ? email.toLowerCase() : '',
      phone: phone || '',
      domain,
      startDate: startDate || new Date(),
      endDate: endDate || new Date(),
      issueDate: issueDate || new Date(),
      duration: duration || '3 Months',
      grade: grade || 'A'
    });

    await cert.save();
    res.status(201).json(cert);
  } catch (err) {
    console.error('Error creating certificate:', err);
    res.status(500).json({ error: err.message || 'Failed to create certificate' });
  }
};

// 4. Bulk Upload Certificates from Excel Data (Admin)
const bulkUploadCertificates = async (req, res) => {
  try {
    const { rows } = req.body;
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: 'No Excel data rows provided.' });
    }

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const row of rows) {
      const candidateName = row['Candidate Name'] || row['Name'] || row['name'] || row['candidateName'];
      const domain = row['Domain'] || row['Course'] || row['domain'] || 'Software Development';
      
      const rawCertNo = row['Certificate No'] || row['Certificate Number'] || row['Cert No'] || row['Certificate ID'] || row['Cert ID'] || row['certificateNo'] || row['certificate_no'];
      const isCustomCertNo = !!(rawCertNo && rawCertNo.toString().trim());
      const certNo = isCustomCertNo ? rawCertNo.toString().trim() : await generateCertificateNo();
      
      const email = row['Email'] || row['email'] || '';
      const phone = row['Phone'] || row['phone'] || '';
      const startDate = row['Start Date'] || row['startDate'] || new Date();
      const endDate = row['End Date'] || row['endDate'] || new Date();
      const issueDate = row['Issue Date'] || row['issueDate'] || new Date();

      if (!candidateName) {
        skippedCount++;
        continue;
      }

      // ONLY search for existing record IF user explicitly provided custom Certificate No in Excel
      let existing = null;
      if (isCustomCertNo) {
        existing = await Certificate.findOne({ certificateNo: certNo });
      }

      if (existing) {
        // Update existing record with new details
        existing.candidateName = candidateName;
        existing.domain = domain;
        if (email) existing.email = email.toString().toLowerCase();
        if (phone) existing.phone = phone.toString();
        if (startDate) existing.startDate = new Date(startDate);
        if (endDate) existing.endDate = new Date(endDate);
        if (issueDate) existing.issueDate = new Date(issueDate);
        if (row['Duration'] || row['duration']) existing.duration = row['Duration'] || row['duration'];
        if (row['Grade'] || row['grade']) existing.grade = row['Grade'] || row['grade'];
        
        await existing.save();
        updatedCount++;
      } else {
        // Create new record
        await Certificate.create({
          certificateNo: certNo,
          candidateName,
          email: email ? email.toString().toLowerCase() : '',
          phone: phone ? phone.toString() : '',
          domain,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          issueDate: new Date(issueDate),
          duration: row['Duration'] || row['duration'] || '3 Months',
          grade: row['Grade'] || row['grade'] || 'A'
        });
        createdCount++;
      }
    }

    res.json({
      message: `Bulk upload completed: ${createdCount} new certificates added, ${updatedCount} existing records updated, ${skippedCount} skipped.`,
      createdCount,
      updatedCount,
      skippedCount
    });
  } catch (err) {
    console.error('Error in bulk upload:', err);
    res.status(500).json({ error: 'Bulk upload failed: ' + err.message });
  }
};

// 5. Sync / Import Interns from Student App to Certificate Registry (Admin)
const syncFromStudents = async (req, res) => {
  try {
    const students = await Student.find();
    let syncedCount = 0;

    for (let index = 0; index < students.length; index++) {
      const st = students[index];
      const certNo = st.certificate?.certificateNo || await generateCertificateNo();

      const existing = await Certificate.findOne({
        $or: [
          { certificateNo: certNo },
          { email: st.email ? st.email.toLowerCase() : '____nonexist____' }
        ]
      });

      if (!existing) {
        const start = st.certificate?.startDate || st.joining_date;
        const durationMonths = st.duration || 3;
        const end = st.certificate?.endDate || new Date(new Date(start).setMonth(new Date(start).getMonth() + durationMonths));

        await Certificate.create({
          certificateNo: certNo,
          candidateName: st.name,
          email: st.email ? st.email.toLowerCase() : '',
          phone: st.phone || '',
          domain: st.domain,
          startDate: start,
          endDate: end,
          issueDate: st.certificate?.issueDate || new Date(),
          duration: `${durationMonths} Months`,
          studentId: st._id
        });

        // Update Student model with certificateNo if missing
        if (!st.certificate?.certificateNo) {
          st.certificate = {
            certificateNo: certNo,
            startDate: start,
            endDate: end,
            issueDate: new Date()
          };
          await st.save();
        }

        syncedCount++;
      }
    }

    res.json({ message: `Sync complete! ${syncedCount} intern certificates imported from Student App.`, syncedCount });
  } catch (err) {
    console.error('Error syncing students:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
};

// 6. Delete Certificate (Admin)
const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const cert = await Certificate.findByIdAndDelete(id);
    if (!cert) {
      return res.status(404).json({ error: 'Certificate record not found' });
    }
    res.json({ message: 'Certificate record deleted successfully' });
  } catch (err) {
    console.error('Error deleting certificate:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  verifyCertificate,
  getAllCertificates,
  createCertificate,
  bulkUploadCertificates,
  syncFromStudents,
  deleteCertificate
};
