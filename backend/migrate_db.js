const mongoose = require('mongoose');
const LearnerProfile = require('./models/LearnerProfile');

mongoose.connect('mongodb://127.0.0.1:27017/learnwise')
  .then(async () => {
    console.log("Connected to MongoDB");
    const profiles = await LearnerProfile.find({});
    let updated = 0;
    for (const profile of profiles) {
      if (profile.currentSkills && profile.currentSkills.length > 0) {
        // If it's an array of objects
        let changed = false;
        const newSkills = profile.currentSkills.map(s => {
          if (typeof s === 'string') return s;
          if (s && s.skill && s.level) {
            changed = true;
            return `${s.level} in ${s.skill}`;
          }
          return s;
        });

        if (changed) {
          // Bypass mongoose schema for the old structure update, we will simply use updateOne
          await mongoose.connection.collection('learnerprofiles').updateOne(
            { _id: profile._id },
            { $set: { currentSkills: newSkills } }
          );
          updated++;
        }
      }
    }
    console.log(`Migrated ${updated} profiles to new string format.`);
    
    // Also log the current documents to verify
    const finalProfiles = await mongoose.connection.collection('learnerprofiles').find({}).toArray();
    console.log("Current LearnerProfiles in DB:");
    console.log(JSON.stringify(finalProfiles, null, 2));

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
