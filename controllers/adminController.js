const User = require('../models/User');
const Project = require('../models/Project');

// 1. Get system-wide dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'Student' });
    const totalTeachers = await User.countDocuments({ role: 'Teacher' });
    
    const totalProjects = await Project.countDocuments();
    const pendingProjects = await Project.countDocuments({ status: 'pending' });
    const approvedProjects = await Project.countDocuments({ status: 'approved' });
    const rejectedProjects = await Project.countDocuments({ status: 'rejected' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });

    res.status(200).json({
      users: {
        students: totalStudents,
        teachers: totalTeachers
      },
      projects: {
        total: totalProjects,
        pending: pendingProjects,
        approved: approvedProjects,
        rejected: rejectedProjects,
        completed: completedProjects
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get all registered users (Filterable by role)
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    
    const users = await User.find(filter).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};