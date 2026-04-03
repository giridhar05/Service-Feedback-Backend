const express = require('express');
const router = express.Router();
const { createFeedback, getMyFeedbacks, getTeamFeedbacks, getAllFeedbacks, updateFeedbackStatus, getMyHistory } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('Employee'), createFeedback)
  .get(protect, authorize('Admin'), getAllFeedbacks);

router.get('/my', protect, authorize('Employee'), getMyFeedbacks);
router.get('/team', protect, authorize('Team Member'), getTeamFeedbacks);
router.get('/history', protect, authorize('Employee'), getMyHistory);

router.put('/:id/status', protect, authorize('Team Member', 'Admin'), updateFeedbackStatus);

module.exports = router;
