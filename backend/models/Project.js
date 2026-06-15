const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['fullstack', 'backend', 'frontend', 'ai', 'other'], default: 'other' },
  description: String,
  longDescription: String,
  technologies: [String],
  image: { type: String, default: '' },
  github: String,
  live: String,
  guideUrl: String,
  guideLabel: { type: String, default: 'Case Study' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  highlights: [String]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
