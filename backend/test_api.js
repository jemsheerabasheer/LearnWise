const mongoose = require('mongoose');
const User = require('./models/User');
const LearnerProfile = require('./models/LearnerProfile');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

mongoose.connect('mongodb://127.0.0.1:27017/learnwise')
  .then(async () => {
    // 1. Create fake user
    const email = 'test_update_db@test.com' + Date.now();
    const user = new User({
      name: 'Test Update',
      email: email,
      password: 'password',
      role: 'learner'
    });
    await user.save();
    
    // 2. Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'supersecretlearnwisetoken2026',
      { expiresIn: '1h' }
    );
    
    // 3. Make HTTP request to backend
    try {
      const res = await axios.post('http://localhost:5000/api/user/input', {
        currentSkills: ["advanced in testpython"],
        preferences: "videos",
        careerGoals: "test dummy"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('API Response:', res.status, res.data);
    } catch(err) {
      console.error('API Error:', err.response ? err.response.data : err.message);
    }
    
    // 4. Check Database Directly
    const savedProfile = await LearnerProfile.findOne({ userId: user._id });
    console.log('Saved Profile in DB:', JSON.stringify(savedProfile, null, 2));
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
