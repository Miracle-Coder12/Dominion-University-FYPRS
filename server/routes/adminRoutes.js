const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// All admin routes require token and Admin role
router.use(verifyToken);
router.use(isAdmin);

router.get('/users', adminController.getAllUsers);
router.patch('/users/status', adminController.updateUserStatus);
router.get('/stats', adminController.getSystemStats);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
