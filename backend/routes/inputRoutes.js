const express = require('express');
const router = express.Router();
const inputController = require('../controllers/inputController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/input', verifyToken, inputController.saveInput);
router.get('/input', verifyToken, inputController.getInput);

module.exports = router;
