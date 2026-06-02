const mongoose = require('mongoose');
const Roadmap = require('./models/Roadmap');
require('dotenv').config();

async function clearCache() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnwise';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    const result = await Roadmap.updateMany({}, { $unset: { topicMaterials: "" } });
    console.log(`Cleared topic materials cache. Modified ${result.modifiedCount} roadmaps.`);

  } catch (error) {
    console.error('Error clearing cache:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

clearCache();
