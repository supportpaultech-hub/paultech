const User = require('../models/User');

const getStats = async (req, res) => {
  try {
    // 1. Total Employees
    const totalEmployees = await User.countDocuments({ role: 'EMPLOYEE' });

    // 2. Department Breakdown
    const departmentStats = await User.aggregate([
      { $match: { role: 'EMPLOYEE', department: { $exists: true, $ne: '' } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);

    // Fill in default departments if no data yet to make chart look good
    const defaultDepts = ['Engineering', 'Design', 'QA', 'HR', 'Sales'];
    const formattedDeptStats = defaultDepts.map(dept => {
      const found = departmentStats.find(d => d.name === dept);
      return found ? found : { name: dept, value: 0 };
    });

    // 3. Recent Hires
    const recentHires = await User.find({ role: 'EMPLOYEE' })
      .select('firstName lastName username designation department createdAt')
      .sort({ createdAt: -1, _id: -1 })
      .limit(5);

    // 4. Skills Breakdown (bonus for the chart)
    const skillsStats = await User.aggregate([
      { $match: { role: 'EMPLOYEE', skills: { $exists: true, $ne: [] } } },
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);

    res.json({
      totalEmployees,
      departmentStats: formattedDeptStats,
      skillsStats,
      recentHires
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

module.exports = { getStats };
