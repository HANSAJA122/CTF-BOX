const express = require('express');
const router = express.Router();
const { submitFlag, getUserSubmissions } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitFlag);
router.get('/my', protect, getUserSubmissions);

module.exports = router;
