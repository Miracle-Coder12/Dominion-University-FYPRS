const express = require('express');
const router = express.Router();
const { login, logout, register, getCurrentUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register); // Optional, for setup
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;
