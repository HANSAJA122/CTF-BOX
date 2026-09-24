const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Submission = require('../models/Submission');

/**
 * @desc    Submit a flag for validation
 * @route   POST /api/submissions
 * @access  Private
 */
const submitFlag = async (req, res) => {
  try {
    const { challengeId, submittedFlag } = req.body;

    if (!challengeId || !submittedFlag) {
      return res
        .status(400)
        .json({ success: false, message: 'Challenge ID and submitted flag are required' });
    }

    // Find challenge and explicitly select the hidden flag field
    const challenge = await Challenge.findById(challengeId).select('+flag');
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    // Check if user has already solved this challenge
    const user = await User.findById(req.user._id);
    const alreadySolved = user.completedChallenges.some(
      (id) => id.toString() === challengeId.toString()
    );

    if (alreadySolved) {
      return res.status(400).json({
        success: false,
        message: 'You have already completed this challenge!',
      });
    }

    // Sanitize and trim submitted flag and correct flag
    const cleanSubmitted = submittedFlag.trim();
    const cleanCorrect = challenge.flag.trim();

    const isCorrect = cleanSubmitted === cleanCorrect;

    // Save submission log in database for auditing
    await Submission.create({
      user: req.user._id,
      challenge: challengeId,
      submittedFlag: cleanSubmitted,
      isCorrect,
    });

    if (isCorrect) {
      // Award points and append completed challenge ID
      user.completedChallenges.push(challengeId);
      user.score += challenge.points;
      await user.save();

      return res.json({
        success: true,
        isCorrect: true,
        message: `[+] Congratulations! Correct Flag! +${challenge.points} Points awarded!`,
        pointsAwarded: challenge.points,
        newScore: user.score,
      });
    } else {
      return res.status(400).json({
        success: false,
        isCorrect: false,
        message: '[-] Incorrect Flag. Review your methodology and try again!',
      });
    }
  } catch (error) {
    console.error(`[-] Flag submission error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get current user submission history
 * @route   GET /api/submissions/my
 * @access  Private
 */
const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate('challenge', 'title category points difficulty')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitFlag,
  getUserSubmissions,
};
