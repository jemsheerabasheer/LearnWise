const LearnerProfile = require('../models/LearnerProfile');

// POST /api/user/input
exports.saveInput = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentSkills, preferences, careerGoals } = req.body;

    // Validation
    if (!preferences || !careerGoals) {
      return res.status(400).json({ message: 'Missing parameters' });
    }
    
    const skillsToSave = Array.isArray(currentSkills) ? currentSkills : [];

    if (!['videos', 'articles', 'projects'].includes(preferences)) {
      return res.status(400).json({ message: 'Invalid preference' });
    }

    if (typeof careerGoals !== 'string' || careerGoals.length < 3) {
      return res.status(400).json({ message: 'Career goals must be at least 3 characters' });
    }

    // Check if profile already exists
    let profile = await LearnerProfile.findOne({ userId });

    if (profile) {
      // Update existing
      profile.currentSkills = skillsToSave;
      profile.preferences = preferences;
      profile.careerGoals = careerGoals;
      await profile.save();
    } else {
      // Create new
      profile = new LearnerProfile({
        userId,
        currentSkills: skillsToSave,
        preferences,
        careerGoals
      });
      await profile.save();
    }

    // Attempt to automatically call POST /api/roadmap/generate if it exists
    // Assuming you have a roadmapController, we might call it or leave it to frontend.
    // The instructions say "After submitting input successfully call POST /api/roadmap/generate automatically"
    // Usually this means frontend calls it. If backend, we'd do an internal call here.
    // I'll proceed keeping it simple.

    res.status(201).json({ message: 'Learning inputs saved successfully' });
  } catch (error) {
    console.error('Save input error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET /api/user/input
exports.getInput = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const profile = await LearnerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: 'User input not found' });
    }

    res.status(200).json({
      currentSkills: profile.currentSkills,
      preferences: profile.preferences,
      careerGoals: profile.careerGoals
    });
  } catch (error) {
    console.error('Get input error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
