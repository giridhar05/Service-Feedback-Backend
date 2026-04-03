const mongoose = require('mongoose');

const StatusLogSchema = new mongoose.Schema({
  feedback_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback', required: true },
  changed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  old_status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], required: true },
  new_status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], required: true }
}, { timestamps: { createdAt: 'changed_at', updatedAt: false } });

module.exports = mongoose.model('StatusLog', StatusLogSchema);
