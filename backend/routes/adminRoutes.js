const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(verifyAdmin);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// Resources
router.get('/resources', adminController.getAllResources); // For admin table view
router.post('/resource', adminController.addResource);
router.put('/resource/:id', adminController.updateResource);
router.delete('/resource/:id', adminController.deleteResource);

// Users
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// Model
router.get('/model', adminController.getModel);
router.put('/model', adminController.updateModel);

module.exports = router;
