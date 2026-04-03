const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Team = require('../models/Team');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { name, email, password, role, team_name } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Password validation: min 8 chars, 1 uppercase, 1 number
  const passRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passRegex.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters, contain 1 uppercase letter and 1 number' });
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  let team_id = null;
  if (role === 'Team Member' && team_name) {
    const team = await Team.findOne({ name: team_name });
    if (team) {
      team_id = team._id;
    }
  }

  const user = await User.create({
    name,
    email,
    password_hash,
    role: role || 'Employee',
    team_id
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      team_id: user.team_id,
      token: generateToken(user._id)
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && user.is_active && (await bcrypt.compare(password, user.password_hash))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      team_id: user.team_id,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, getMe };
