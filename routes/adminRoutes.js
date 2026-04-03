const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, createTeam, getTeams, getAnalytics } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('Admin'));

router.get('/users', getAllUsers);
router.put('/users/:id', updateUserRole);

router.post('/teams', createTeam);
router.get('/teams', getTeams);

router.get('/analytics', getAnalytics);

module.exports = router;
