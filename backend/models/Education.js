const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  period: String,
  grade: String,
  status: String,
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Education', EducationSchema);
