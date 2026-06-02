const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'article', 'course'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
