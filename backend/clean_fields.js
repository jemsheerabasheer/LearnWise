const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/learnwise')
  .then(async () => {
    console.log("Connected to MongoDB. Cleaning up legacy fields...");
    
    // Drop old deprecated fields from all documents to avoid confusion
    const result = await mongoose.connection.collection('learnerprofiles').updateMany(
      {},
      { $unset: { skillLevel: "", knownLanguages: "" } }
    );
    
    console.log(`Matched ${result.matchedCount} documents, updated ${result.modifiedCount} documents.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
