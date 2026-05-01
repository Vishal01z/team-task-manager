const Project = require('../models/Project');

// Middleware to check if the user is an admin of the given project
// Requires :projectId in route params OR projectId in body
const requireAdmin = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id || req.body.project;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member || member.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Access denied. Admin role required.' });
    }

    req.project = project;
    req.userRole = 'admin';
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware to check if user is a member (any role) of the project
const requireMember = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id || req.body.project;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member) {
      return res
        .status(403)
        .json({ message: 'Access denied. Not a project member.' });
    }

    req.project = project;
    req.userRole = member.role;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { requireAdmin, requireMember };