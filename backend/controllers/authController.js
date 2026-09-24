const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate JWT Token signed with secret
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_cybervault_jwt_key_2026_ie3132',
    {
      expiresIn: '7d',
    }
  );
};

/**
 * @desc    Register a new user account
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide username, email, and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    // Check if user already exists
    const userExists = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists',
      });
    }

    // Create user
    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: password.trim(),
      role: role === 'admin' ? 'admin' : 'user',
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          score: user.score,
          completedChallenges: user.completedChallenges,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data provided' });
    }
  } catch (error) {
    console.error(`[-] Registration error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Authenticate user & get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please enter both email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Find user by email and explicitly select password field
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      console.log(`[-] Login failed: User email not found: ${cleanEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(cleanPassword);
    if (!isMatch) {
      console.log(`[-] Login failed: Password mismatch for user: ${cleanEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    console.log(`[+] Login successful for user: ${cleanEmail} (${user.role})`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        score: user.score,
        completedChallenges: user.completedChallenges,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error(`[-] Login error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'completedChallenges',
      'title category points difficulty'
    );
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
