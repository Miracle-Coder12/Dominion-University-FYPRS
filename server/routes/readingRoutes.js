const express = require('express');
const router = express.Router();
const readingController = require('../controllers/readingController');
const { verifyToken } = require('../middleware/authMiddleware');

// All reading routes require authentication
router.use(verifyToken);

// Progress
router.post('/progress', readingController.saveProgress);
router.get('/progress/:projectId', readingController.getProgress);

// Annotations
router.get('/annotations/:versionId', readingController.getAnnotations);
router.post('/annotations', readingController.createAnnotation);
router.delete('/annotations/:id', readingController.deleteAnnotation);

// Comments
router.post('/comments', readingController.addComment);
router.get('/comments/:annotationId', readingController.getComments);

module.exports = router;
