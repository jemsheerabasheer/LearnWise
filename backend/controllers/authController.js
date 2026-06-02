const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be created through registration.' });
    }

    // Email format validation (basic regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 8) {
       return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'learner',
      status: 'active'
    });

    await user.save();

    res.status(201).json({ message: 'New user created successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// POST /api/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check pass
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// POST /api/logout
exports.logout = async (req, res) => {
  // Client-side handles destroying the JWT token.
  res.status(200).json({ message: 'Successfully logged out' });
};

// PUT /api/user/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let isUpdated = false;

    if (name) {
      user.name = name;
      isUpdated = true;
    }

    if (password) {
      if(password.length < 8) {
         return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      isUpdated = true;
    }

    if (!isUpdated) {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
