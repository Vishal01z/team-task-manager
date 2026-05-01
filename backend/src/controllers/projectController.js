const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = await Project.create({
      name,
      description,
      members: [{ user: req.user._id, role: 'admin' }],
    });

    const populated = await project.populate('members.user', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects for logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      'members.user': req.user._id,
    }).populate('members.user', 'name email');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single project
// @route   GET /api/projects/:id
// @access  Private (member)
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'members.user',
      'name email'
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check membership
    const isMember = project.members.some(
      (m) => m.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private (admin)
const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    const project = req.project; // set by requireAdmin middleware

    const alreadyMember = project.members.some(
      (m) => m.user.toString() === userToAdd._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push({
      user: userToAdd._id,
      role: role === 'admin' ? 'admin' : 'member',
    });

    await project.save();
    await project.populate('members.user', 'name email');

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (admin)
const removeMember = async (req, res) => {
  try {
    const project = req.project; // set by requireAdmin middleware
    const { userId } = req.params;

    // Prevent removing yourself if you're the only admin
    const admins = project.members.filter((m) => m.role === 'admin');
    const targetMember = project.members.find(
      (m) => m.user.toString() === userId
    );

    if (!targetMember) {
      return res.status(404).json({ message: 'Member not found in project' });
    }

    if (
      targetMember.role === 'admin' &&
      admins.length === 1 &&
      userId === req.user._id.toString()
    ) {
      return res
        .status(400)
        .json({ message: 'Cannot remove the only admin from a project' });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== userId
    );

    await project.save();
    await project.populate('members.user', 'name email');

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  addMember,
  removeMember,
};