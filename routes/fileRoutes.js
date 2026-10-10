const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  uploadFile,
  downloadFile,
  getProjectFiles,
  giveFeedback,
  getProjectFeedback,
  markProjectComplete
} = require('../controllers/fileController');

// Student file upload
router.post('/upload', protect, authorize('Student'), upload.single('file'), uploadFile);

// File downloads & views
router.get('/download/:fileId', protect, downloadFile);
router.get('/project/:projectId', protect, getProjectFiles);

// Feedback routes
router.post('/feedback', protect, authorize('Teacher'), giveFeedback);
router.get('/feedback/:projectId', protect, getProjectFeedback);

// Mark completed
router.put('/complete/:projectId', protect, authorize('Teacher'), markProjectComplete);

module.exports = router;