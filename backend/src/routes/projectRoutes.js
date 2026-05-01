const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.post('/', protect, createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProject);
router.post('/:id/members', protect, requireAdmin, addMember);
router.delete('/:id/members/:userId', protect, requireAdmin, removeMember);

module.exports = router;