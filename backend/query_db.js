const mongoose = require('mongoose');
const LearnerProfile = require('./models/LearnerProfile');

mongoose.connect('mongodb://127.0.0.1:27017/learnwise')
  .then(async () => {
    const profiles = await LearnerProfile.find({});
    console.log(JSON.stringify(profiles, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
