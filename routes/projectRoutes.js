const express = require('express');
const router = express.Router();
const { 
  submitProposal, 
  approveProposal, 
  rejectProposal, 
  getAllProjects 
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student route: Submit proposal
router.post('/submit', protect, authorize('Student'), submitProposal);

// Admin routes: Review proposals
router.put('/:id/approve', protect, authorize('Admin'), approveProposal);
router.put('/:id/reject', protect, authorize('Admin'), rejectProposal);
router.get('/', protect, authorize('Admin', 'Teacher'), getAllProjects);

module.exports = router;