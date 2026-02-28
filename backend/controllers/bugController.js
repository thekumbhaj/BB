const { validationResult, body } = require('express-validator');
const Bug = require('../models/Bug');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');
const {
  bugCreatedTemplate,
  bugStatusUpdatedTemplate,
} = require('../utils/emailTemplates');

const bugValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('severity')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Severity must be one of: low, medium, high, critical'),
];

const createBug = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, severity } = req.body;

    const duplicate = await Bug.findOne({ title, createdBy: req.user._id });
    if (duplicate) {
      return res.status(409).json({ message: 'A bug with this title already exists for your account' });
    }

    const bug = await Bug.create({
      title,
      description,
      severity,
      createdBy: req.user._id,
    });

    await sendEmail(
      req.user.email,
      `Bug Report Submitted: ${title}`,
      bugCreatedTemplate(req.user.name, title, severity)
    );

    return res.status(201).json({ message: 'Bug created successfully', bug });
  } catch (error) {
    console.error('Create bug error:', error);
    return res.status(500).json({ message: 'Server error while creating bug' });
  }
};

const getMyBugs = async (req, res) => {
  try {
    const bugs = await Bug.find({ createdBy: req.user._id })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ bugs });
  } catch (error) {
    console.error('Get my bugs error:', error);
    return res.status(500).json({ message: 'Server error while fetching bugs' });
  }
};

const getAllBugs = async (req, res) => {
  try {
    const bugs = await Bug.find()
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ bugs });
  } catch (error) {
    console.error('Get all bugs error:', error);
    return res.status(500).json({ message: 'Server error while fetching all bugs' });
  }
};

const updateBugStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status must be one of: OPEN, IN_PROGRESS, RESOLVED' });
    }

    const bug = await Bug.findById(id).populate('createdBy', 'name email');
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    bug.status = status;
    await bug.save();

    if (bug.createdBy && bug.createdBy.email) {
      await sendEmail(
        bug.createdBy.email,
        `Bug Status Updated: ${bug.title}`,
        bugStatusUpdatedTemplate(bug.createdBy.name, bug.title, status)
      );
    }

    return res.status(200).json({ message: 'Bug status updated successfully', bug });
  } catch (error) {
    console.error('Update bug status error:', error);
    return res.status(500).json({ message: 'Server error while updating bug status' });
  }
};

const assignBug = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const assignee = await User.findById(userId);
    if (!assignee) {
      return res.status(404).json({ message: 'User to assign not found' });
    }

    const bug = await Bug.findByIdAndUpdate(
      id,
      { assignedTo: userId },
      { new: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    return res.status(200).json({ message: 'Bug assigned successfully', bug });
  } catch (error) {
    console.error('Assign bug error:', error);
    return res.status(500).json({ message: 'Server error while assigning bug' });
  }
};

module.exports = {
  bugValidation,
  createBug,
  getMyBugs,
  getAllBugs,
  updateBugStatus,
  assignBug,
};
