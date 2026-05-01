const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
} = require('../controllers/taskController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTask);
router.get('/:projectId', protect, getTasks);
router.put('/:id', protect, updateTask);

module.exports = router;