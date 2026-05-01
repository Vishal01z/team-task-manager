const Task = require('../models/Task');
const Project = require('../models/Project');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ Get projects where user is a member
    const projects = await Project.find({ members: userId });

    const projectIds = projects.map((p) => p._id);

    // ✅ Get all tasks from those projects
    const allTasks = await Task.find({
      project: { $in: projectIds },
    })
      .populate('assignedTo', 'name email')
      .populate('project', 'name');

    // ✅ My tasks
    const myTasks = allTasks.filter(
      (t) =>
        t.assignedTo &&
        t.assignedTo._id.toString() === userId.toString()
    );

    // ✅ Overdue tasks
    const now = new Date();
    const overdueTasks = allTasks.filter(
      (t) =>
        t.dueDate &&
        new Date(t.dueDate) < now &&
        t.status !== 'done'
    );

    // ✅ Tasks per user
    const tasksPerUser = {};

    allTasks.forEach((task) => {
      if (task.assignedTo) {
        const key = task.assignedTo._id.toString();

        if (!tasksPerUser[key]) {
          tasksPerUser[key] = {
            user: task.assignedTo,
            total: 0,
            todo: 0,
            inprogress: 0,
            done: 0,
          };
        }

        tasksPerUser[key].total++;

        if (task.status === 'todo') tasksPerUser[key].todo++;
        if (task.status === 'inprogress') tasksPerUser[key].inprogress++;
        if (task.status === 'done') tasksPerUser[key].done++;
      }
    });

    // ✅ Final response
    res.json({
      totalProjects: projects.length,
      totalTasks: allTasks.length,

      tasksByStatus: {
        todo: allTasks.filter((t) => t.status === 'todo').length,
        inprogress: allTasks.filter((t) => t.status === 'inprogress').length,
        done: allTasks.filter((t) => t.status === 'done').length,
      },

      myTasks: {
        total: myTasks.length,
        todo: myTasks.filter((t) => t.status === 'todo').length,
        inprogress: myTasks.filter((t) => t.status === 'inprogress').length,
        done: myTasks.filter((t) => t.status === 'done').length,
      },

      overdueTasks: overdueTasks.map((t) => ({
        _id: t._id,
        title: t.title,
        dueDate: t.dueDate,
        project: t.project,
        assignedTo: t.assignedTo,
        status: t.status,
        priority: t.priority,
      })),

      tasksPerUser: Object.values(tasksPerUser),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };