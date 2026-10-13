const Leave = require('../models/Leave');
const User = require('../models/User');

// 1. Employee: Apply for Leave
const applyLeave = async (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      employeeEmail,
      department,
      designation,
      img,
      leaveType,
      startDate,
      endDate,
      reason
    } = req.body;

    if (!employeeEmail || !employeeName || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: 'Please provide all required fields (dates, reason, name, email).' });
    }

    // Calculate total days (inclusive)
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return res.status(400).json({ error: 'End date cannot be earlier than start date.' });
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const totalDays = Math.max(1, isNaN(diffDays) ? 1 : diffDays);

    // Look up user to resolve profile photo and official designation/role
    const user = await User.findOne({
      $or: [
        { username: employeeEmail.toLowerCase() },
        ...(employeeId ? [{ employeeId }] : [])
      ]
    }).lean();

    const finalEmpId = user?.employeeId || employeeId || '';
    const finalName = (user && user.firstName) ? `${user.firstName} ${user.lastName || ''}`.trim() : employeeName;
    const finalDesignation = user?.designation || user?.role || designation || 'Team Member';
    const finalImg = user?.img || img || '';

    const newLeave = new Leave({
      employeeId: finalEmpId,
      employeeName: finalName,
      employeeEmail,
      designation: finalDesignation,
      img: finalImg,
      department: department || user?.department || 'General',
      leaveType: leaveType || 'Casual Leave',
      startDate,
      endDate,
      totalDays,
      reason,
      status: 'Pending',
      appliedAt: new Date()
    });

    const saved = await newLeave.save();
    res.status(201).json({ message: 'Leave application submitted successfully!', leave: saved });
  } catch (err) {
    console.error('Error applying for leave:', err);
    res.status(500).json({ error: 'Failed to submit leave application: ' + err.message });
  }
};

// 2. Employee: Get personal leaves
const getMyLeaves = async (req, res) => {
  try {
    const { employeeEmail } = req.params;
    if (!employeeEmail) {
      return res.status(400).json({ error: 'Employee email is required.' });
    }

    const leaves = await Leave.find({ employeeEmail }).sort({ appliedAt: -1, _id: -1 }).lean();
    const user = await User.findOne({ username: employeeEmail.toLowerCase() }).lean();

    const enriched = leaves.map(l => ({
      ...l,
      employeeName: (user && user.firstName) ? `${user.firstName} ${user.lastName || ''}`.trim() : l.employeeName,
      employeeId: user?.employeeId || l.employeeId || '',
      designation: user?.designation || user?.role || l.designation || 'Team Member',
      role: user?.designation || user?.role || 'Team Member',
      img: user?.img || l.img || ''
    }));

    res.json(enriched);
  } catch (err) {
    console.error('Error fetching employee leaves:', err);
    res.status(500).json({ error: 'Failed to fetch leaves: ' + err.message });
  }
};

// 3. Admin: Get all leaves
const getAllLeaves = async (req, res) => {
  try {
    const { status, month } = req.query;
    let filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (month) {
      // month e.g. "2026-09"
      filter.startDate = { $regex: `^${month}` };
    }

    const leaves = await Leave.find(filter).sort({ appliedAt: -1, _id: -1 }).lean();

    // Dynamically join User model so existing & new leaves show real image, exact empId, and designation/role
    const users = await User.find({ role: 'EMPLOYEE' }).lean();
    const userMap = {};
    users.forEach(u => {
      if (u.username) userMap[u.username.toLowerCase()] = u;
      if (u.employeeId) userMap[u.employeeId.toLowerCase()] = u;
    });

    const enrichedLeaves = leaves.map(leave => {
      const emailKey = leave.employeeEmail ? leave.employeeEmail.toLowerCase() : '';
      const empIdKey = leave.employeeId ? leave.employeeId.toLowerCase() : '';
      const u = userMap[emailKey] || userMap[empIdKey];

      return {
        ...leave,
        employeeName: (u && u.firstName) ? `${u.firstName} ${u.lastName || ''}`.trim() : leave.employeeName,
        employeeId: u?.employeeId || leave.employeeId || 'N/A',
        designation: u?.designation || u?.role || leave.designation || 'Team Member',
        role: u?.designation || u?.role || 'Team Member',
        img: u?.img || leave.img || ''
      };
    });

    res.json(enrichedLeaves);
  } catch (err) {
    console.error('Error fetching all leaves:', err);
    res.status(500).json({ error: 'Failed to fetch leaves: ' + err.message });
  }
};

// 4. Admin: Update leave status (Approve / Reject)
const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks, reviewedBy } = req.body;

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found.' });
    }

    leave.status = status;
    if (adminRemarks !== undefined) leave.adminRemarks = adminRemarks;
    leave.reviewedBy = reviewedBy || 'Admin';
    leave.reviewedAt = new Date();

    const updated = await leave.save();
    res.json({ message: `Leave request ${status.toLowerCase()} successfully!`, leave: updated });
  } catch (err) {
    console.error('Error updating leave status:', err);
    res.status(500).json({ error: 'Failed to update leave status: ' + err.message });
  }
};

// 5. Delete / Cancel leave
const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Leave.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Leave request not found.' });
    }
    res.json({ message: 'Leave record deleted successfully.' });
  } catch (err) {
    console.error('Error deleting leave:', err);
    res.status(500).json({ error: 'Failed to delete leave: ' + err.message });
  }
};

// 6. Admin / Global: Get Leave Statistics
const getLeaveStats = async (req, res) => {
  try {
    const totalLeaves = await Leave.countDocuments();
    const pendingCount = await Leave.countDocuments({ status: 'Pending' });
    const approvedCount = await Leave.countDocuments({ status: 'Approved' });
    const rejectedCount = await Leave.countDocuments({ status: 'Rejected' });

    // Count employees on leave today
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const onLeaveToday = await Leave.countDocuments({
      status: 'Approved',
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    res.json({
      totalLeaves,
      pendingCount,
      approvedCount,
      rejectedCount,
      onLeaveToday
    });
  } catch (err) {
    console.error('Error fetching leave stats:', err);
    res.status(500).json({ error: 'Failed to fetch leave statistics: ' + err.message });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
  getLeaveStats
};
