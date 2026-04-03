const User = require('../models/User');
const Team = require('../models/Team');
const Feedback = require('../models/Feedback');

// Users
const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password_hash').populate('team_id', 'name');
  res.json(users);
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role, team_id, is_active } = req.body;
  
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.role = role || user.role;
  user.team_id = team_id !== undefined ? team_id : user.team_id;
  user.is_active = is_active !== undefined ? is_active : user.is_active;

  await user.save();
  res.json({ message: 'User updated successfully' });
};

// Teams
const createTeam = async (req, res) => {
  const { name, category_handled } = req.body;
  const teamExists = await Team.findOne({ name });
  if (teamExists) {
    return res.status(400).json({ message: 'Team already exists' });
  }
  const team = await Team.create({ name, category_handled });
  res.status(201).json(team);
};

const getTeams = async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
};

// Analytics
const getAnalytics = async (req, res) => {
  const totalFeedback = await Feedback.countDocuments();
  const resolvedFeedback = await Feedback.countDocuments({ status: { $in: ['Resolved', 'Closed'] } });
  
  const categoriesCount = await Feedback.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  res.json({
    total: totalFeedback,
    resolved: resolvedFeedback,
    categories: categoriesCount,
    resolutionRate: totalFeedback === 0 ? 0 : ((resolvedFeedback / totalFeedback) * 100).toFixed(2)
  });
};

module.exports = { getAllUsers, updateUserRole, createTeam, getTeams, getAnalytics };
