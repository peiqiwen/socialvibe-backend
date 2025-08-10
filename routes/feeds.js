const express = require('express');
const { body, validationResult } = require('express-validator');
const Feed = require('../models/Feed');
const User = require('../models/User');
const Friend = require('../models/Friend');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/feeds
// @desc    Get feeds with pagination (only friends' feeds for authenticated users)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query based on filters
    let query = { status: 'active' };
    
    // If user is authenticated, show feeds from friends and user's own feeds
    if (req.user) {
      // Get user's friends
      const friends = await Friend.find({ userId: req.user._id });
      const friendIds = friends.map(friend => friend.friendId);
      friendIds.push(req.user._id); // Include user's own feeds
      
      query = {
        $and: [
          { status: 'active' },
          { author: { $in: friendIds } }
        ]
      };
    } else {
      // For non-authenticated users, only show public feeds
      query.isPublic = true;
    }

    const feeds = await Feed.find(query)
      .populate('author', 'username displayName avatar isVerified')
      .populate('likes', 'username displayName avatar')
      .populate('comments.user', 'username displayName avatar')
      .populate('mentions', 'username displayName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feed.countDocuments(query);

    // Add isLiked field for authenticated users
    if (req.user) {
      feeds.forEach(feed => {
        feed.isLiked = feed.likes.some(like => 
          like._id.toString() === req.user._id.toString()
        );
      });
    }

    res.json({
      feeds,
      page,
      limit,
      total,
      hasMore: skip + feeds.length < total
    });

  } catch (error) {
    console.error('Get feeds error:', error);
    res.status(500).json({
      error: 'Failed to get feeds',
      message: 'Something went wrong'
    });
  }
});

// @route   POST /api/feeds
// @desc    Create a new feed
// @access  Private
router.post('/', [
  auth,
  body('content')
    .isLength({ min: 1, max: 2000 })
    .trim()
    .withMessage('Content must be 1-2000 characters long'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
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

    const { content, media, tags, mentions, location, isPublic = true } = req.body;

    // Process tags (convert to lowercase and remove duplicates)
    const processedTags = tags ? [...new Set(tags.map(tag => tag.toLowerCase().trim()))] : [];

    // Process mentions (extract usernames and find user IDs)
    let mentionUserIds = [];
    if (mentions && mentions.length > 0) {
      const mentionedUsers = await User.find({
        username: { $in: mentions },
        isActive: true
      });
      mentionUserIds = mentionedUsers.map(user => user._id);
    }

    const feed = new Feed({
      author: req.user._id,
      content,
      media,
      tags: processedTags,
      mentions: mentionUserIds,
      location,
      isPublic
    });

    await feed.save();

    // Populate the feed with user data
    const populatedFeed = await Feed.getFeedWithUser(feed._id);

    res.status(201).json({
      message: 'Feed created successfully',
      feed: populatedFeed
    });

  } catch (error) {
    console.error('Create feed error:', error);
    res.status(500).json({
      error: 'Failed to create feed',
      message: 'Something went wrong'
    });
  }
});

// @route   GET /api/feeds/:feedId/comments
// @desc    Get comments for a feed
// @access  Public
router.get('/:feedId/comments', optionalAuth, async (req, res) => {
  try {
    const { feedId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const feed = await Feed.findById(feedId)
      .populate('comments.user', 'username displayName avatar')
      .select('comments author isPublic status');
    
    if (!feed || feed.status !== 'active') {
      return res.status(404).json({
        error: 'Feed not found',
        message: 'Feed does not exist or has been deleted'
      });
    }

    // Check if user can view this feed
    if (!feed.isPublic && (!req.user || feed.author.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'This feed is private'
      });
    }

    // Sort comments by creation date (newest first)
    const sortedComments = feed.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply pagination
    const paginatedComments = sortedComments.slice(skip, skip + limit);

    res.json({
      comments: paginatedComments,
      page,
      limit,
      total: feed.comments.length,
      hasMore: skip + paginatedComments.length < feed.comments.length
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      error: 'Failed to get comments',
      message: 'Something went wrong'
    });
  }
});

// @route   GET /api/feeds/:feedId
// @desc    Get a specific feed
// @access  Public
router.get('/:feedId', optionalAuth, async (req, res) => {
  try {
    const { feedId } = req.params;
    
    const feed = await Feed.getFeedWithUser(feedId);
    
    if (!feed || feed.status !== 'active') {
      return res.status(404).json({
        error: 'Feed not found',
        message: 'Feed does not exist or has been deleted'
      });
    }

    // Check if user can view this feed
    if (!feed.isPublic && (!req.user || feed.author._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'This feed is private'
      });
    }

    // Add isLiked field for authenticated users
    if (req.user) {
      feed.isLiked = feed.likes.some(like => 
        like._id.toString() === req.user._id.toString()
      );
    }

    // Increment view count
    await feed.incrementViewCount();

    res.json({
      feed
    });

  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({
      error: 'Failed to get feed',
      message: 'Something went wrong'
    });
  }
});

// @route   PUT /api/feeds/:feedId
// @desc    Update a feed
// @access  Private
router.put('/:feedId', [
  auth,
  body('content')
    .isLength({ min: 1, max: 2000 })
    .trim()
    .withMessage('Content must be 1-2000 characters long')
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

    const { feedId } = req.params;
    const { content, tags, isPublic } = req.body;

    const feed = await Feed.findById(feedId);
    
    if (!feed) {
      return res.status(404).json({
        error: 'Feed not found',
        message: 'Feed does not exist'
      });
    }

    // Check if user owns this feed
    if (feed.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only edit your own feeds'
      });
    }

    // Update feed
    feed.content = content;
    if (tags) {
      feed.tags = [...new Set(tags.map(tag => tag.toLowerCase().trim()))];
    }
    if (isPublic !== undefined) {
      feed.isPublic = isPublic;
    }
    feed.isEdited = true;
    feed.editedAt = new Date();

    await feed.save();

    const updatedFeed = await Feed.getFeedWithUser(feedId);

    res.json({
      message: 'Feed updated successfully',
      feed: updatedFeed
    });

  } catch (error) {
    console.error('Update feed error:', error);
    res.status(500).json({
      error: 'Failed to update feed',
      message: 'Something went wrong'
    });
  }
});

// @route   DELETE /api/feeds/:feedId
// @desc    Delete a feed
// @access  Private
router.delete('/:feedId', auth, async (req, res) => {
  try {
    const { feedId } = req.params;

    const feed = await Feed.findById(feedId);
    
    if (!feed) {
      return res.status(404).json({
        error: 'Feed not found',
        message: 'Feed does not exist'
      });
    }

    // Check if user owns this feed
    if (feed.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own feeds'
      });
    }

    // Soft delete
    feed.status = 'deleted';
    await feed.save();

    res.json({
      message: 'Feed deleted successfully'
    });

  } catch (error) {
    console.error('Delete feed error:', error);
    res.status(500).json({
      error: 'Failed to delete feed',
      message: 'Something went wrong'
    });
  }
});

// @route   POST /api/feeds/:feedId/like
// @desc    Like/unlike a feed
// @access  Private
router.post('/:feedId/like', auth, async (req, res) => {
  try {
    const { feedId } = req.params;

    const feed = await Feed.findById(feedId);
    
    if (!feed || feed.status !== 'active') {
      return res.status(404).json({
        error: 'Feed not found',
        message: 'Feed does not exist or has been deleted'
      });
    }

    const isLiked = feed.likes.some(like => 
      like.toString() === req.user._id.toString()
    );

    if (isLiked) {
      // Unlike
      await feed.removeLike(req.user._id);
      res.json({
        message: 'Feed unliked successfully',
        isLiked: false
      });
    } else {
      // Like
      await feed.addLike(req.user._id);
      res.json({
        message: 'Feed liked successfully',
        isLiked: true
      });
    }

  } catch (error) {
    console.error('Like feed error:', error);
    res.status(500).json({
      error: 'Failed to like feed',
      message: 'Something went wrong'
    });
  }
});

// @route   POST /api/feeds/:feedId/comment
// @desc    Add a comment to a feed
// @access  Private
router.post('/:feedId/comment', [
  auth,
  body('content')
    .isLength({ min: 1, max: 1000 })
    .trim()
    .withMessage('Comment must be 1-1000 characters long')
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

    const { feedId } = req.params;
    const { content } = req.body;

    const feed = await Feed.findById(feedId);
    
    if (!feed || feed.status !== 'active') {
      return res.status(404).json({
        error: 'Feed not found',
        message: 'Feed does not exist or has been deleted'
      });
    }

    await feed.addComment(req.user._id, content);

    const updatedFeed = await Feed.getFeedWithUser(feedId);

    res.json({
      message: 'Comment added successfully',
      feed: updatedFeed
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      error: 'Failed to add comment',
      message: 'Something went wrong'
    });
  }
});

// @route   GET /api/feeds/user/:username
// @desc    Get feeds by username
// @access  Public
router.get('/user/:username', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const user = await User.findOne({ username, isActive: true });
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist or has been deactivated'
      });
    }

    const feeds = await Feed.getFeedsByUser(user._id, page, limit);

    // Add isLiked field for authenticated users
    if (req.user) {
      feeds.forEach(feed => {
        feed.isLiked = feed.likes.some(like => 
          like._id.toString() === req.user._id.toString()
        );
      });
    }

    const total = await Feed.countDocuments({ 
      author: user._id, 
      status: 'active' 
    });

    res.json({
      feeds,
      page,
      limit,
      total,
      hasMore: (page - 1) * limit + feeds.length < total
    });

  } catch (error) {
    console.error('Get user feeds error:', error);
    res.status(500).json({
      error: 'Failed to get user feeds',
      message: 'Something went wrong'
    });
  }
});

module.exports = router; 