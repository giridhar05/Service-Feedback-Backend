const Feedback = require('../models/Feedback');
const Team = require('../models/Team');
const StatusLog = require('../models/StatusLog');

const getCategoryTeam = async (category) => {
  const team = await Team.findOne({ category_handled: category });
  return team ? team._id : null;
};

const createFeedback = async (req, res) => {
  const { title, description, category, priority } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ message: 'Please provide title, description and category' });
  }

  const team_id = await getCategoryTeam(category);
  
  if (!team_id) {
    return res.status(400).json({ message: 'No team handles this category' });
  }

  const feedback = await Feedback.create({
    title,
    description,
    category,
    priority: priority || 'Low',
    employee_id: req.user._id,
    team_id
  });

  req.app.get('io').to(team_id.toString()).emit('newFeedback', feedback);

  res.status(201).json(feedback);
};

const getMyFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.find({ employee_id: req.user._id }).populate('team_id', 'name');
  res.json(feedbacks);
};

const getTeamFeedbacks = async (req, res) => {
  if (req.user.role !== 'Team Member') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  const feedbacks = await Feedback.find({ team_id: req.user.team_id }).populate('employee_id', 'name email');
  res.json(feedbacks);
};

const getAllFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.find().populate('employee_id', 'name').populate('team_id', 'name');
  res.json(feedbacks);
};

const updateFeedbackStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const feedback = await Feedback.findById(id);
  
  if (!feedback) {
    return res.status(404).json({ message: 'Feedback not found' });
  }

  if (req.user.role === 'Team Member' && feedback.team_id.toString() !== req.user.team_id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this team\'s feedback' });
  }

  const old_status = feedback.status;
  feedback.status = status;
  await feedback.save();

  await StatusLog.create({
    feedback_id: feedback._id,
    changed_by: req.user._id,
    old_status,
    new_status: status
  });

  req.app.get('io').to(feedback.employee_id.toString()).emit('statusUpdated', feedback);

  res.json(feedback);
};

const getMyHistory = async (req, res) => {
  const feedbacks = await Feedback.find({ employee_id: req.user._id }).select('_id');
  const feedbackIds = feedbacks.map(f => f._id);
  
  const history = await StatusLog.find({ feedback_id: { $in: feedbackIds } })
    .populate('feedback_id', 'title category priority')
    .populate('changed_by', 'name role')
    .sort('-changed_at');
    
  res.json(history);
};

module.exports = { createFeedback, getMyFeedbacks, getTeamFeedbacks, getAllFeedbacks, updateFeedbackStatus, getMyHistory };
