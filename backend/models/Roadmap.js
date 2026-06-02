const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topics: {
    type: [String],
    default: []
  },
  sequences: {
    type: [String],
    default: []
  },
  resources: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  projects: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  topicMaterials: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
