const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String },
  auth_provider: { type: String, enum: ['local', 'google'], default: 'local' },
  google_id: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['Employee', 'Team Member', 'Admin'], default: 'Employee' },
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('User', UserSchema);
