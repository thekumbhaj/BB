const express = require('express');
const router = express.Router();
const {
  bugValidation,
  createBug,
  getMyBugs,
  getAllBugs,
  updateBugStatus,
  assignBug,
} = require('../controllers/bugController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.post('/', protect, bugValidation, createBug);
router.get('/my', protect, getMyBugs);
router.get('/', protect, requireRole('admin'), getAllBugs);
router.patch('/:id/status', protect, requireRole('admin'), updateBugStatus);
router.patch('/:id/assign', protect, requireRole('admin'), assignBug);

module.exports = router;
