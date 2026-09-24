const User = require('../models/User');

/**
 * @desc    Get global CTF leaderboard ranking
 * @route   GET /api/leaderboard
 * @access  Private / Public
 */
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('username score completedChallenges createdAt')
      .sort({ score: -1, updatedAt: 1 }); // Higher score first, tied resolved by earlier completion

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      username: user.username,
      score: user.score,
      solvedCount: user.completedChallenges.length,
      joinedAt: user.createdAt,
    }));

    res.json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    console.error(`[-] Leaderboard fetch error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLeaderboard,
};
