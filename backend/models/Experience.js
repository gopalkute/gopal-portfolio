const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  period: String,
  startDate: String,
  endDate: String,
  description: String,
  technologies: [String],
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema);
