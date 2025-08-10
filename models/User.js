const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 200,
    default: ''
  },
  vibeCoins: {
    type: Number,
    default: 100, // Starting coins
    min: 0
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  friendCode: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true,
    minlength: 6,
    maxlength: 6
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  preferences: {
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'zh', 'es', 'fr', 'de']
    },
    notifications: {
      likes: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      follows: { type: Boolean, default: true },
      tips: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: { type: String, default: 'public', enum: ['public', 'private', 'friends'] },
      showEmail: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    username: this.username,
    displayName: this.displayName,
    avatar: this.avatar,
    bio: this.bio,
    isVerified: this.isVerified,
    followers: this.followers.length,
    following: this.following.length,
    createdAt: this.createdAt
  };
};

// Add/remove follower methods
userSchema.methods.addFollower = function(userId) {
  if (!this.followers.includes(userId)) {
    this.followers.push(userId);
  }
  return this.save();
};

userSchema.methods.removeFollower = function(userId) {
  this.followers = this.followers.filter(id => !id.equals(userId));
  return this.save();
};

userSchema.methods.followUser = function(userId) {
  if (!this.following.includes(userId)) {
    this.following.push(userId);
  }
  return this.save();
};

userSchema.methods.unfollowUser = function(userId) {
  this.following = this.following.filter(id => !id.equals(userId));
  return this.save();
};

module.exports = mongoose.model('User', userSchema); 