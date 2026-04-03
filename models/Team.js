const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category_handled: { type: String, enum: ['Bug Report', 'Feature Request', 'Complaint', 'Usability Feedback'], required: true },
  is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Team', TeamSchema);
