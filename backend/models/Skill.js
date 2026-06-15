const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: Number, min: 0, max: 100, default: 70 },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
