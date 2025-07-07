const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile/:username
// @desc    Get user profile by username
// @access  Public
router.get('/profile/:username', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username, isActive: true })
      .select('-password -email')
      .populate('followers', 'username displayName avatar')
      .populate('following', 'username displayName avatar');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist or has been deactivated'
      });
    }

    // Check if current user is following this user
    let isFollowing = false;
    if (req.user) {
      isFollowing = user.followers.some(follower => 
        follower._id.toString() === req.user._id.toString()
      );
    }

    res.json({
      user: user.getPublicProfile(),
      isFollowing,
      followers: user.followers.length,
      following: user.following.length
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: 'Something went wrong'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('displayName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .trim()
    .withMessage('Display name must be 1-50 characters'),
  body('bio')
    .optional()
    .isLength({ max: 200 })
    .trim()
    .withMessage('Bio must be less than 200 characters'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input',
        details: errors.array()
      });
    }

    const { displayName, bio, avatar } = req.body;
    const user = await User.findById(req.user._id);

    // Update fields if provided
    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: 'Something went wrong'
    });
  }
});

// @route   POST /api/users/follow/:userId
// @desc    Follow a user
// @access  Private
router.post('/follow/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is trying to follow themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        error: 'Invalid action',
        message: 'You cannot follow yourself'
      });
    }

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser || !targetUser.isActive) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist or has been deactivated'
      });
    }

    // Follow the user
    await req.user.followUser(userId);
    await targetUser.addFollower(req.user._id);

    res.json({
      message: 'User followed successfully',
      isFollowing: true
    });

  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      error: 'Failed to follow user',
      message: 'Something went wrong'
    });
  }
});

// @route   DELETE /api/users/follow/:userId
// @desc    Unfollow a user
// @access  Private
router.delete('/follow/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    // Unfollow the user
    await req.user.unfollowUser(userId);
    await targetUser.removeFollower(req.user._id);

    res.json({
      message: 'User unfollowed successfully',
      isFollowing: false
    });

  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      error: 'Failed to unfollow user',
      message: 'Something went wrong'
    });
  }
});

// @route   GET /api/users/followers
// @desc    Get user's followers
// @access  Private
router.get('/followers', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id)
      .populate({
        path: 'followers',
        select: 'username displayName avatar bio isVerified',
        options: { skip, limit }
      });

    res.json({
      followers: user.followers,
      page,
      limit,
      total: user.followers.length
    });

  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      error: 'Failed to get followers',
      message: 'Something went wrong'
    });
  }
});

// @route   GET /api/users/following
// @desc    Get users that current user is following
// @access  Private
router.get('/following', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id)
      .populate({
        path: 'following',
        select: 'username displayName avatar bio isVerified',
        options: { skip, limit }
      });

    res.json({
      following: user.following,
      page,
      limit,
      total: user.following.length
    });

  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      error: 'Failed to get following',
      message: 'Something went wrong'
    });
  }
});

// @route   GET /api/users/search
// @desc    Search users by username or display name
// @access  Public
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: 'Invalid search query',
        message: 'Search query must be at least 2 characters long'
      });
    }

    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(q.trim(), 'i');

    const users = await User.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { username: searchRegex },
            { displayName: searchRegex }
          ]
        }
      ]
    })
    .select('username displayName avatar bio isVerified')
    .skip(skip)
    .limit(limit)
    .sort({ username: 1 });

    const total = await User.countDocuments({
      $and: [
        { isActive: true },
        {
          $or: [
            { username: searchRegex },
            { displayName: searchRegex }
          ]
        }
      ]
    });

    res.json({
      users,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      hasMore: skip + users.length < total
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: 'Something went wrong'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    // In a production app, you might want to:
    // 1. Soft delete (set isActive to false)
    // 2. Anonymize user data
    // 3. Keep some data for legal/compliance reasons
    
    await User.findByIdAndDelete(req.user._id);

    res.json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: 'Failed to delete account',
      message: 'Something went wrong'
    });
  }
});

module.exports = router; 