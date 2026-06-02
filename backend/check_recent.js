const fs = require('fs');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/learnwise')
  .then(async () => {
    const LearnerProfile = require('./models/LearnerProfile');
    // Get all profiles created/updated in the last hour
    const recent = new Date(Date.now() - 60 * 60 * 1000);
    const profiles = await LearnerProfile.find({ updatedAt: { $gte: recent } }).sort({ updatedAt: -1 });
    fs.writeFileSync('recent.json', JSON.stringify(profiles, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
