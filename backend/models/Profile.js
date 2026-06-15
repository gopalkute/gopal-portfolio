const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: String,
  subtitle: String,
  email: String,
  phone: String,
  location: String,
  birthday: String,
  cgpa: String,
  languages: [String],
  linkedin: String,
  github: String,
  leetcode: String,
  avatar: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  about: [String],
  services: [{
    title: String,
    description: String,
    icon: String
  }],
  achievements: [String]
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
