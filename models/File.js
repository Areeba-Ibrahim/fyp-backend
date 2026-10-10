const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  storedName: { type: String, required: true },
  path: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('File', FileSchema);