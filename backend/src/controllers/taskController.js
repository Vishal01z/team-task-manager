const Task = require('../models/Task');

// ✅ Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, project, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      project,
      assignedTo,
      status: 'todo',
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Tasks by Project
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('project', 'name');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = req.body.status || task.status;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ IMPORTANT EXPORT
module.exports = {
  createTask,
  getTasks,
  updateTask,
};