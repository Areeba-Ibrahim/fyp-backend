const Project = require('../models/Project');

// Student submits a proposal
exports.submitProposal = async (req, res) => {
  try {
    const studentId = req.user.userId;

    // Rule: Check if student has an existing proposal that is NOT rejected
    const existingProject = await Project.findOne({ 
      studentId, 
      status: { $ne: 'rejected' } 
    });

    if (existingProject) {
      return res.status(400).json({ 
        message: 'You already have an active or pending project proposal.' 
      });
    }

    const newProject = await Project.create({
      title: req.body.title,
      description: req.body.description,
      studentId
    });

    res.status(201).json({ 
      message: 'Proposal submitted successfully', 
      project: newProject 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin approves a project proposal
exports.approveProposal = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json({ message: 'Proposal approved successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin rejects a project proposal
exports.rejectProposal = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json({ message: 'Proposal rejected', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all projects (For Admin review)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('studentId', 'name email dept')
      .populate('supervisorId', 'name email');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};