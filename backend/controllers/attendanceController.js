const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Office Coordinates: PaulTech Software Services, Sakchi, Jamshedpur (Google Maps: https://maps.app.goo.gl/2Y1YeRf7kRH7fGYm7)
const OFFICE_LAT = 22.8065521;
const OFFICE_LNG = 86.2038378;
const GEOFENCE_RADIUS_METERS = 250; // 250m radius to account for indoor mobile GPS accuracy drift

// Haversine formula to compute distance in meters between two lat/lng points
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // returns distance in meters
}

const extractTimeStr = (devTime) => {
  if (!devTime) return null;
  const str = devTime.toString().trim();
  if (str.includes(',')) {
    const parts = str.split(',');
    return parts[1] ? parts[1].trim() : str;
  }
  return str;
};

const formatTimeIST = (d) => {
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata'
  });
};

const getISTDateTime = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const parts = formatter.formatToParts(now);
  const getPart = (type) => parts.find(p => p.type === type)?.value || '00';
  
  const year = getPart('year');
  const month = getPart('month');
  const day = getPart('day');
  const hour = parseInt(getPart('hour'), 10);
  const minute = parseInt(getPart('minute'), 10);
  
  const istDateStr = `${year}-${month}-${day}`;
  return { istDateStr, hour, minute, now };
};

const getTodayDateString = () => {
  const { istDateStr } = getISTDateTime();
  return istDateStr;
};

// Automatic 7:00 PM Punch-OUT engine
// If an employee punched IN, but has not punched OUT before 7:00 PM (19:00 IST),
// automatically punch them out at 07:00:00 PM on the same day.
const autoCloseUnpunchedAttendance = async () => {
  try {
    const { istDateStr, hour } = getISTDateTime();

    // Condition 1: Any past dates (< istDateStr) where employee punched IN but never punched OUT
    const conditions = [
      {
        date: { $lt: istDateStr },
        $or: [
          { checkOutTime: { $exists: false } },
          { checkOutTime: null },
          { checkOutTime: '' },
          { status: 'Present' }
        ]
      }
    ];

    // Condition 2: Today's date (=== istDateStr) IF current IST time is 7:00 PM (19:00) or later
    if (hour >= 19) {
      conditions.push({
        date: istDateStr,
        $or: [
          { checkOutTime: { $exists: false } },
          { checkOutTime: null },
          { checkOutTime: '' },
          { status: 'Present' }
        ]
      });
    }

    const recordsToClose = await Attendance.find({ $or: conditions });

    if (recordsToClose && recordsToClose.length > 0) {
      for (const record of recordsToClose) {
        record.checkOutTime = '07:00:00 PM';
        record.status = 'Checked Out';
        const note = 'Auto Punch-OUT (07:00 PM)';
        if (!record.deviceTime || !record.deviceTime.includes('Auto')) {
          record.deviceTime = record.deviceTime ? `${record.deviceTime} | ${note}` : note;
        }
        await record.save();
      }
      console.log(`[Auto Punch-OUT] Auto-closed ${recordsToClose.length} employee attendance record(s) at 07:00 PM.`);
    }
  } catch (err) {
    console.error('Error in autoCloseUnpunchedAttendance:', err);
  }
};

// Get today's attendance status for an employee
exports.getTodayAttendance = async (req, res) => {
  try {
    // Run auto punch out check
    await autoCloseUnpunchedAttendance();

    const { employeeEmail } = req.params;
    if (!employeeEmail || employeeEmail === 'undefined' || employeeEmail === 'null') {
      return res.json(null);
    }
    const todayStr = getTodayDateString();

    // Look up user to match all possible identifier variations (email, username, employeeId)
    const user = await User.findOne({
      $or: [
        { username: employeeEmail.toLowerCase() },
        { email: employeeEmail.toLowerCase() },
        { employeeId: employeeEmail }
      ]
    });

    const emailToSearch = user ? user.username.toLowerCase() : employeeEmail.toLowerCase();
    const empIdToSearch = user ? user.employeeId : '';

    const record = await Attendance.findOne({
      $or: [
        { employeeEmail: emailToSearch },
        { employeeEmail: new RegExp('^' + emailToSearch.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '$', 'i') },
        ...(empIdToSearch ? [{ employeeId: empIdToSearch }] : [])
      ],
      date: todayStr
    }).sort({ createdAt: -1 });

    res.json(record || null);
  } catch (err) {
    console.error('Error fetching today attendance:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Check-IN (Employee Punch IN with GPS & Device Time)
exports.checkIn = async (req, res) => {
  try {
    const { employeeId, employeeName, employeeEmail, deviceTime, latitude, longitude } = req.body;

    if (!employeeEmail) {
      return res.status(400).json({ error: 'Employee email is required.' });
    }

    const todayStr = getTodayDateString();

    // Lookup actual Employee User profile from DB
    const userProfile = await User.findOne({ 
      $or: [
        { username: employeeEmail.toLowerCase() },
        { email: employeeEmail.toLowerCase() },
        { employeeId: employeeId }
      ]
    });

    const finalEmail = userProfile ? (userProfile.username || userProfile.email).toLowerCase() : employeeEmail.toLowerCase();
    const finalEmpId = (userProfile && userProfile.employeeId) || employeeId || (userProfile && userProfile._id ? `EMP-${userProfile._id.toString().slice(-4)}` : '') || finalEmail || 'EMP-GENERAL';
    const finalName = userProfile && userProfile.firstName 
      ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim()
      : (employeeName || userProfile?.username || 'Employee');

    // Check if already checked in today
    let record = await Attendance.findOne({
      $or: [
        { employeeEmail: finalEmail },
        ...(finalEmpId ? [{ employeeId: finalEmpId }] : [])
      ],
      date: todayStr
    });

    if (record) {
      return res.status(400).json({ error: 'You have already checked IN for today.' });
    }

    let distance = null;
    let locationVerified = true;
    let locationStatusMsg = 'Verified (Sakchi Office)';

    // Verify GPS Geofencing if coordinates provided
    if (latitude && longitude) {
      distance = calculateHaversineDistance(OFFICE_LAT, OFFICE_LNG, Number(latitude), Number(longitude));
      
      // If distance exceeds 100m geofence
      if (distance > GEOFENCE_RADIUS_METERS) {
        locationVerified = false;
        locationStatusMsg = `Outside Premises (${distance}m away from Sakchi Office)`;
      } else {
        locationStatusMsg = `Verified Sakchi Office (${distance}m distance)`;
      }
    } else {
      locationVerified = false;
      locationStatusMsg = 'GPS Location Permission Denied';
    }

    if (!locationVerified) {
      return res.status(403).json({
        error: `Check-IN Denied: You must be within Sakchi Office premises to punch attendance. ${locationStatusMsg}`
      });
    }

    const now = new Date();
    const checkInTimeStr = extractTimeStr(deviceTime) || formatTimeIST(now);

    record = new Attendance({
      employeeId: finalEmpId,
      employeeName: finalName,
      employeeEmail: finalEmail,
      date: todayStr,
      checkInTime: checkInTimeStr,
      deviceTime: deviceTime || now.toLocaleString(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      distanceMeters: distance,
      locationStatus: locationStatusMsg,
      status: 'Present'
    });

    await record.save();
    res.status(201).json({ message: 'Check-IN successful! Attendance recorded.', record });
  } catch (err) {
    console.error('Error during check-in:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Check-OUT (Employee Punch OUT)
exports.checkOut = async (req, res) => {
  try {
    // Run auto-close check first
    await autoCloseUnpunchedAttendance();

    const { employeeEmail, deviceTime } = req.body;
    const todayStr = getTodayDateString();

    const user = await User.findOne({
      $or: [
        { username: employeeEmail.toLowerCase() },
        { email: employeeEmail.toLowerCase() },
        { employeeId: employeeEmail }
      ]
    });

    const emailToSearch = user ? user.username.toLowerCase() : employeeEmail.toLowerCase();
    const empIdToSearch = user ? user.employeeId : '';

    const record = await Attendance.findOne({
      $or: [
        { employeeEmail: emailToSearch },
        { employeeEmail: new RegExp('^' + emailToSearch.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '$', 'i') },
        ...(empIdToSearch ? [{ employeeId: empIdToSearch }] : [])
      ],
      date: todayStr
    }).sort({ createdAt: -1 });

    if (!record) {
      return res.status(404).json({ error: 'No Check-IN record found for today.' });
    }

    if (record.checkOutTime) {
      return res.status(200).json({ 
        message: `Already checked OUT (at ${record.checkOutTime}).`, 
        record 
      });
    }

    const now = new Date();
    const checkOutTimeStr = extractTimeStr(deviceTime) || formatTimeIST(now);

    record.checkOutTime = checkOutTimeStr;
    record.status = 'Checked Out';
    if (deviceTime) record.deviceTime = deviceTime;

    await record.save();
    res.json({ message: 'Check-OUT successful! Have a great evening.', record });
  } catch (err) {
    console.error('Error during check-out:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin Manual Check-OUT endpoint
exports.adminCheckOut = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Attendance.findById(id);

    if (!record) {
      return res.status(404).json({ error: 'Attendance record not found.' });
    }

    const now = new Date();
    const checkOutTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    record.checkOutTime = checkOutTimeStr;
    record.status = 'Checked Out';
    await record.save();

    res.json({ message: 'Employee checked OUT by Admin successfully.', record });
  } catch (err) {
    console.error('Error during admin check-out:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get All Attendance Logs (Admin) - Enrich with user profile (Name, Employee ID, Cloudinary Avatar)
exports.getAllAttendance = async (req, res) => {
  try {
    // Run auto-close check first
    await autoCloseUnpunchedAttendance();

    const logs = await Attendance.find().sort({ createdAt: -1 }).lean();
    
    // Fetch all users from DB
    const users = await User.find().lean();
    const userMap = {};
    users.forEach(u => {
      if (u.username) userMap[u.username.toLowerCase()] = u;
      if (u.email) userMap[u.email.toLowerCase()] = u;
      if (u.employeeId) userMap[u.employeeId.toLowerCase()] = u;
    });

    const enrichedLogs = logs.map(log => {
      const emailKey = log.employeeEmail ? log.employeeEmail.toLowerCase() : '';
      const empIdKey = log.employeeId ? log.employeeId.toLowerCase() : '';
      const u = userMap[emailKey] || userMap[empIdKey];
      
      let resolvedName = '';
      if (u && u.firstName) {
        resolvedName = `${u.firstName} ${u.lastName || ''}`.trim();
      } else {
        resolvedName = log.employeeName || 'Employee';
      }

      return {
        ...log,
        employeeName: resolvedName,
        employeeEmail: u?.username || log.employeeEmail || '',
        employeeId: u?.employeeId || log.employeeId || '',
        designation: u?.designation || 'Team Member',
        department: u?.department || 'IT',
        img: u?.img || ''
      };
    });

    res.json(enrichedLogs);
  } catch (err) {
    console.error('Error fetching attendance logs:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Employee's Personal Attendance History Logs
exports.getEmployeeAttendanceHistory = async (req, res) => {
  try {
    // Run auto-close check first
    await autoCloseUnpunchedAttendance();

    const { employeeEmail } = req.params;
    if (!employeeEmail || employeeEmail === 'undefined') {
      return res.json([]);
    }
    
    const user = await User.findOne({
      $or: [
        { username: employeeEmail.toLowerCase() },
        { email: employeeEmail.toLowerCase() },
        { employeeId: employeeEmail }
      ]
    });

    const emailToSearch = user ? user.username.toLowerCase() : employeeEmail.toLowerCase();
    const empIdToSearch = user ? user.employeeId : '';

    const logs = await Attendance.find({
      $or: [
        { employeeEmail: emailToSearch },
        { employeeEmail: new RegExp('^' + emailToSearch.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '$', 'i') },
        ...(empIdToSearch ? [{ employeeId: empIdToSearch }] : [])
      ]
    }).sort({ createdAt: -1 }).lean();

    res.json(logs);
  } catch (err) {
    console.error('Error fetching employee attendance history:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete Attendance record (Admin)
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Attendance.findByIdAndDelete(id);
    if (!record) {
      return res.status(404).json({ error: 'Attendance record not found.' });
    }
    res.json({ message: 'Attendance record deleted successfully.' });
  } catch (err) {
    console.error('Error deleting attendance:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Clear All Attendance Logs (Admin reset)
exports.clearAllAttendance = async (req, res) => {
  try {
    await Attendance.deleteMany({});
    res.json({ message: 'All attendance logs cleared successfully.' });
  } catch (err) {
    console.error('Error clearing all attendance:', err);
    res.status(500).json({ error: 'Failed to clear attendance logs.' });
  }
};

// Export autoCloseUnpunchedAttendance for server cron / periodic execution
exports.autoCloseUnpunchedAttendance = autoCloseUnpunchedAttendance;

