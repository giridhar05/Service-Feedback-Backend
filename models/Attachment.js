const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema({
  feedback_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback', required: true },
  file_url: { type: String, required: true },
  file_type: { type: String, required: true },
  file_size: { type: Number, required: true }
}, { timestamps: { createdAt: 'uploaded_at', updatedAt: false } });

module.exports = mongoose.model('Attachment', AttachmentSchema);
