const User = require('../models/User');
const Resource = require('../models/Resource');
const Roadmap = require('../models/Roadmap');
const SystemSettings = require('../models/SystemSettings');

// --- ANALYTICS ---
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalRoadmaps = await Roadmap.countDocuments();
    const totalResources = await Resource.countDocuments();

    res.status(200).json({
      totalUsers,
      activeUsers,
      totalRoadmaps,
      totalResources
    });
  } catch (error) {
    console.error('getAnalytics error', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// --- RESOURCES ---
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addResource = async (req, res) => {
  try {
    const { title, type, category, difficulty, url } = req.body;
    if (!title || !type || !category || !difficulty || !url) {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    const newResource = new Resource({ title, type, category, difficulty, url });
    await newResource.save();
    res.status(201).json({ message: 'Resource added successfully', resource: newResource });
  } catch (error) {
    if (error.name === 'ValidationError') {
       return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, category, difficulty, url } = req.body;
    
    const resource = await Resource.findByIdAndUpdate(
      id, 
      { title, type, category, difficulty, url },
      { new: true, runValidators: true }
    );
    
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    
    res.status(200).json({ message: 'Resource updated successfully', resource });
  } catch (error) {
     if (error.name === 'ValidationError') {
       return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndDelete(id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// --- USERS ---
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'activate' or 'deactivate'
    
    if (action !== 'activate' && action !== 'deactivate') {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const isActive = action === 'activate';
    const user = await User.findByIdAndUpdate(id, { isActive }, { new: true }).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json({ message: `User ${action}d successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Note: in a real app, you might want to cleanly cascade delete Roadmaps and Profiles.
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// --- AI MODEL MANAGEMENT ---
exports.getModel = async (req, res) => {
  try {
    let setting = await SystemSettings.findOne({ key: 'ai_model' });
    if (!setting) {
      setting = new SystemSettings({ key: 'ai_model', value: 'llama3:latest' });
      await setting.save();
    }
    res.status(200).json({ model: setting.value });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateModel = async (req, res) => {
  try {
    const { modelName } = req.body;
    if (!modelName) return res.status(400).json({ message: 'Missing model name' });

    let setting = await SystemSettings.findOne({ key: 'ai_model' });
    if (setting) {
      setting.value = modelName;
      await setting.save();
    } else {
      setting = new SystemSettings({ key: 'ai_model', value: modelName });
      await setting.save();
    }
    res.status(200).json({ message: 'Model updated successfully', model: setting.value });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
