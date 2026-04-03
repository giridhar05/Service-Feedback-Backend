const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  feedback_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback', required: true },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Comment', CommentSchema);
