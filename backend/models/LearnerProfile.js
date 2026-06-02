const mongoose = require('mongoose');

const learnerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  currentSkills: [{
    type: String,
    required: true
  }],
  preferences: {
    type: String,
    enum: ['videos', 'articles', 'projects'],
    required: true,
  },
  careerGoals: {
    type: String,
    required: true,
    minlength: 3,
  }
}, { timestamps: true });

module.exports = mongoose.model('LearnerProfile', learnerProfileSchema);
