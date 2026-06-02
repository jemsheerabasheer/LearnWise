const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/generate', verifyToken, roadmapController.generateRoadmap);
router.post('/materials', verifyToken, roadmapController.generateMaterialsForTopic);
router.get('/', verifyToken, roadmapController.getRoadmap);

module.exports = router;
