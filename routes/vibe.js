const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Feed = require('../models/Feed');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Vibe币套餐配置
const VIBE_PACKAGES = [
  { id: 1, coins: 100, price: 0.99, bonus: 0 },
  { id: 2, coins: 500, price: 4.99, bonus: 25 },
  { id: 3, coins: 1000, price: 9.99, bonus: 100 },
  { id: 4, coins: 2500, price: 19.99, bonus: 300 },
  { id: 5, coins: 5000, price: 39.99, bonus: 750 },
  { id: 6, coins: 10000, price: 79.99, bonus: 2000 }
];

// @route   GET /api/vibe/balance
// @desc    Get user's Vibe coin balance
// @access  Private
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('vibeCoins');
    
    res.json({
      balance: user.vibeCoins,
      currency: 'VIBE'
    });

  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      error: 'Failed to get balance',
      message: 'Something went wrong'
    });
  }
});

// @route   GET /api/vibe/packages
// @desc    Get available Vibe coin packages
// @access  Public
router.get('/packages', (req, res) => {
  res.json({
    packages: VIBE_PACKAGES,
    currency: 'USD'
  });
});

// @route   POST /api/vibe/purchase
// @desc    Purchase Vibe coins (simulated)
// @access  Private
router.post('/purchase', [
  auth,
  body('packageId')
    .isInt({ min: 1, max: 6 })
    .withMessage('Invalid package ID'),
  body('paymentMethod')
    .isIn(['credit_card', 'paypal', 'apple_pay', 'google_pay'])
    .withMessage('Invalid payment method')
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

    const { packageId, paymentMethod } = req.body;
    
    // Find the selected package
    const selectedPackage = VIBE_PACKAGES.find(pkg => pkg.id === packageId);
    if (!selectedPackage) {
      return res.status(400).json({
        error: 'Invalid package',
        message: 'Selected package does not exist'
      });
    }

    // In a real application, you would:
    // 1. Process payment through Stripe/PayPal/etc.
    // 2. Verify payment success
    // 3. Add coins to user account
    // 4. Create transaction record
    
    // For now, we'll simulate a successful purchase
    const totalCoins = selectedPackage.coins + selectedPackage.bonus;
    
    const user = await User.findById(req.user._id);
    user.vibeCoins += totalCoins;
    await user.save();

    // Create transaction record (you might want to create a Transaction model)
    const transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user._id,
      type: 'purchase',
      amount: selectedPackage.coins,
      bonus: selectedPackage.bonus,
      total: totalCoins,
      price: selectedPackage.price,
      currency: 'USD',
      paymentMethod,
      status: 'completed',
      timestamp: new Date()
    };

    res.json({
      message: 'Purchase completed successfully',
      transaction,
      newBalance: user.vibeCoins,
      coinsAdded: totalCoins
    });

  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({
      error: 'Purchase failed',
      message: 'Something went wrong during purchase'
    });
  }
});

// @route   POST /api/vibe/tip
// @desc    Tip a feed with Vibe coins
// @access  Private
router.post('/tip', [
  auth,
  body('feedId')
    .isMongoId()
    .withMessage('Invalid feed ID'),
  body('amount')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Tip amount must be between 1 and 10000 coins'),
  body('message')
    .optional()
    .isLength({ max: 100 })
    .trim()
    .withMessage('Tip message must be less than 100 characters')
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

    const { feedId, amount, message = '' } = req.body;

    // Check if user has enough coins
    const user = await User.findById(req.user._id);
    if (user.vibeCoins < amount) {
      return res.status(400).json({
        error: 'Insufficient balance',
        message: 'You do not have enough Vibe coins'
      });
    }

    // Check if feed exists
    const feed = await Feed.findById(feedId);
    if (!feed || feed.status !== 'active') {
      return res.status(404).json({
        error: 'Feed not found',
        message: 'Feed does not exist or has been deleted'
      });
    }

    // Check if user is trying to tip their own feed
    if (feed.author.toString() === req.user._id.toString()) {
      return res.status(400).json({
        error: 'Invalid action',
        message: 'You cannot tip your own feed'
      });
    }

    // Process the tip
    user.vibeCoins -= amount;
    await user.save();

    await feed.addTip(req.user._id, amount, message);

    // Get the feed author to update their balance
    const feedAuthor = await User.findById(feed.author);
    if (feedAuthor) {
      feedAuthor.vibeCoins += amount;
      await feedAuthor.save();
    }

    // Create tip transaction record
    const tipTransaction = {
      id: `tip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId: user._id,
      toUserId: feed.author,
      feedId: feed._id,
      amount,
      message,
      status: 'completed',
      timestamp: new Date()
    };

    res.json({
      message: 'Tip sent successfully',
      transaction: tipTransaction,
      newBalance: user.vibeCoins,
      feedUpdated: true
    });

  } catch (error) {
    console.error('Tip error:', error);
    res.status(500).json({
      error: 'Tip failed',
      message: 'Something went wrong while sending tip'
    });
  }
});

// @route   GET /api/vibe/transactions
// @desc    Get user's transaction history
// @access  Private
router.get('/transactions', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // In a real application, you would query a Transaction collection
    // For now, we'll return a mock response
    const mockTransactions = [
      {
        id: 'txn_123456789',
        type: 'purchase',
        amount: 100,
        bonus: 0,
        total: 100,
        price: 0.99,
        currency: 'USD',
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        id: 'tip_987654321',
        type: 'tip',
        amount: 10,
        message: 'Great post!',
        status: 'completed',
        timestamp: new Date(Date.now() - 172800000) // 2 days ago
      }
    ];

    res.json({
      transactions: mockTransactions,
      page,
      limit,
      total: mockTransactions.length,
      hasMore: false
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      error: 'Failed to get transactions',
      message: 'Something went wrong'
    });
  }
});

// @route   POST /api/vibe/earn
// @desc    Earn Vibe coins through activities (simulated)
// @access  Private
router.post('/earn', [
  auth,
  body('activity')
    .isIn(['daily_login', 'post_feed', 'refer_friend', 'complete_profile'])
    .withMessage('Invalid activity type')
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

    const { activity } = req.body;

    // Define rewards for different activities
    const rewards = {
      daily_login: 5,
      post_feed: 10,
      refer_friend: 50,
      complete_profile: 25
    };

    const rewardAmount = rewards[activity];

    // In a real application, you would:
    // 1. Check if user has already earned this reward today
    // 2. Validate the activity
    // 3. Add coins to user account
    // 4. Create transaction record

    const user = await User.findById(req.user._id);
    user.vibeCoins += rewardAmount;
    await user.save();

    const transaction = {
      id: `earn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user._id,
      type: 'earn',
      activity,
      amount: rewardAmount,
      status: 'completed',
      timestamp: new Date()
    };

    res.json({
      message: `Earned ${rewardAmount} Vibe coins for ${activity}`,
      transaction,
      newBalance: user.vibeCoins,
      coinsEarned: rewardAmount
    });

  } catch (error) {
    console.error('Earn coins error:', error);
    res.status(500).json({
      error: 'Failed to earn coins',
      message: 'Something went wrong'
    });
  }
});

// @route   GET /api/vibe/leaderboard
// @desc    Get Vibe coin leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get top users by Vibe coin balance
    const topUsers = await User.find({ isActive: true })
      .select('username displayName avatar vibeCoins')
      .sort({ vibeCoins: -1 })
      .limit(limit);

    res.json({
      leaderboard: topUsers.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        vibeCoins: user.vibeCoins
      })),
      total: topUsers.length
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      error: 'Failed to get leaderboard',
      message: 'Something went wrong'
    });
  }
});

module.exports = router; 