const express = require('express');
const router = express.Router();
const { verifyToken: protect } = require('../middleware/authMiddleware');
const { createProject, getAllProjects, getProjectDetails, uploadNewVersion, uploadMiddleware } = require('../controllers/projectController');

// All routes protected for now
router.post('/', protect, uploadMiddleware, createProject);
router.get('/', protect, getAllProjects);
router.get('/:id', protect, getProjectDetails);
router.post('/:id/versions', protect, uploadMiddleware, uploadNewVersion);

module.exports = router;
