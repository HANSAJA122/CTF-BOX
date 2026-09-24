const express = require('express');
const router = express.Router();
const {
  getChallenges,
  getChallengeById,
  createChallenge,
  getContainerStatus,
} = require('../controllers/challengeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getChallenges);
router.get('/:id', protect, getChallengeById);
router.get('/:id/status', protect, getContainerStatus);
router.post('/', protect, admin, createChallenge);

module.exports = router;
