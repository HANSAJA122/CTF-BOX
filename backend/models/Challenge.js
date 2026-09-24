const mongoose = require('mongoose');

/**
 * Challenge Schema Definition
 * Represents a CTF challenge stage with its flag, hints, points, and Docker port configuration.
 */
const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Challenge title is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Challenge description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'OSINT Reconnaissance',
        'Steganography',
        'Web Security',
        'Cryptography',
        'Digital Forensics',
        'Linux Security',
      ],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: ['Easy', 'Medium', 'Hard'],
    },
    points: {
      type: Number,
      required: [true, 'Points are required'],
      default: 100,
    },
    flag: {
      type: String,
      required: [true, 'Flag is required'],
      select: false, // Security: Do NOT include flag in normal challenge queries
    },
    hints: [
      {
        content: { type: String, required: true },
        cost: { type: Number, default: 0 },
      },
    ],
    containerPort: {
      type: Number,
      required: true,
    },
    dockerImage: {
      type: String,
      required: true,
    },
    serviceUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Challenge', challengeSchema);
