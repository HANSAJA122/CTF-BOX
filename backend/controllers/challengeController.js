const Challenge = require('../models/Challenge');
const http = require('http');

/**
 * @desc    Get all challenges with completion status for logged-in user
 * @route   GET /api/challenges
 * @access  Private
 */
const getChallenges = async (req, res) => {
  try {
    // Fetch all challenges without the secret flag field
    const challenges = await Challenge.find().select('-flag');

    const completedSet = new Set(
      req.user.completedChallenges.map((id) => id.toString())
    );

    const challengesWithStatus = challenges.map((ch) => {
      const chObj = ch.toObject();
      chObj.isSolved = completedSet.has(ch._id.toString());
      return chObj;
    });

    res.json({
      success: true,
      count: challengesWithStatus.length,
      data: challengesWithStatus,
    });
  } catch (error) {
    console.error(`[-] Error fetching challenges: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single challenge detail by ID
 * @route   GET /api/challenges/:id
 * @access  Private
 */
const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).select('-flag');

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const isSolved = req.user.completedChallenges.some(
      (id) => id.toString() === challenge._id.toString()
    );

    const chObj = challenge.toObject();
    chObj.isSolved = isSolved;

    res.json({
      success: true,
      data: chObj,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new challenge (Admin only)
 * @route   POST /api/challenges
 * @access  Private/Admin
 */
const createChallenge = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      points,
      flag,
      hints,
      containerPort,
      dockerImage,
    } = req.body;

    const challenge = await Challenge.create({
      title,
      description,
      category,
      difficulty,
      points,
      flag,
      hints: hints || [],
      containerPort,
      dockerImage,
    });

    res.status(201).json({
      success: true,
      message: 'Challenge created successfully',
      data: challenge,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Check live health status of Docker container port
 * @route   GET /api/challenges/:id/status
 * @access  Private
 */
const getContainerStatus = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const port = challenge.containerPort;
    const host = '127.0.0.1';

    // Simple HTTP ping to test container availability
    const reqPing = http.request({ host, port, method: 'HEAD', timeout: 1500 }, (pingRes) => {
      res.json({
        success: true,
        online: true,
        port: port,
        statusCode: pingRes.statusCode,
      });
    });

    reqPing.on('error', (err) => {
      res.json({
        success: true,
        online: false,
        port: port,
        reason: 'Container port not accepting connections (docker container may be starting or offline)',
      });
    });

    reqPing.on('timeout', () => {
      reqPing.destroy();
      res.json({
        success: true,
        online: false,
        port: port,
        reason: 'Connection timed out',
      });
    });

    reqPing.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getChallenges,
  getChallengeById,
  createChallenge,
  getContainerStatus,
};
