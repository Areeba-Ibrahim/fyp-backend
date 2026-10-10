const File = require('../models/File');
const Feedback = require('../models/Feedback');
const Project = require('../models/Project');
const path = require('path');

// 1. Student uploads a project file
exports.uploadFile = async (req, res) => {
  try {
    const studentId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Check project status and supervisor assignment
    const project = await Project.findOne({ studentId, status: 'approved' });
    if (!project) {
      return res.status(400).json({ message: 'File upload blocked: Project must be approved' });
    }
    if (!project.supervisorId) {
      return res.status(400).json({ message: 'File upload blocked: Supervisor must be assigned first' });
    }

    const fileExt = path.extname(req.file.originalname).substring(1).toUpperCase();

    const newFile = await File.create({
      filename: req.file.originalname,
      storedName: req.file.filename,
      path: req.file.path,
      uploadedBy: studentId,
      projectId: project._id,
      size: req.file.size,
      type: fileExt
    });

    res.status(201).json({ message: 'File uploaded successfully', file: newFile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Download file by ID
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    const filePath = path.join(__dirname, '..', file.path);
    res.download(filePath, file.filename);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get files for a project
exports.getProjectFiles = async (req, res) => {
  try {
    const files = await File.find({ projectId: req.params.projectId }).populate('uploadedBy', 'name email');
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Teacher submits feedback
exports.giveFeedback = async (req, res) => {
  try {
    const { projectId, type, title, message } = req.body;
    const teacherId = req.user.userId;

    const feedback = await Feedback.create({
      projectId,
      teacherId,
      type,
      title,
      message
    });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Get feedback for a project (includes positive count)
exports.getProjectFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ projectId: req.params.projectId }).populate('teacherId', 'name email');
    const positiveCount = feedbacks.filter(f => f.type === 'positive').length;

    res.status(200).json({ feedbacks, positiveCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Teacher marks project as complete
exports.markProjectComplete = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByIdAndUpdate(
      projectId,
      { status: 'completed' },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json({ message: 'Project marked as complete', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};