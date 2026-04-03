const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Bug Report', 'Feature Request', 'Complaint', 'Usability Feedback'], required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Low' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Feedback', FeedbackSchema);
