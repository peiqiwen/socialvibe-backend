const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const feedSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  media: {
    images: [{
      url: String,
      thumbnail: String,
      width: Number,
      height: Number
    }],
    video: {
      url: String,
      thumbnail: String,
      duration: Number,
      width: Number,
      height: Number
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  location: {
    name: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  shares: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tips: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    message: {
      type: String,
      maxlength: 100
    },
    tippedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalTips: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
feedSchema.index({ author: 1, createdAt: -1 });
feedSchema.index({ tags: 1 });
feedSchema.index({ mentions: 1 });
feedSchema.index({ createdAt: -1 });
feedSchema.index({ likes: 1 });
feedSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for like count
feedSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
feedSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for share count
feedSchema.virtual('shareCount').get(function() {
  return this.shares.length;
});

// Methods
feedSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
  }
  return this.save();
};

feedSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(id => !id.equals(userId));
  return this.save();
};

feedSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content: content
  });
  return this.save();
};

feedSchema.methods.addTip = function(userId, amount, message = '') {
  this.tips.push({
    user: userId,
    amount: amount,
    message: message
  });
  this.totalTips += amount;
  return this.save();
};

feedSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Static methods
feedSchema.statics.getFeedWithUser = function(feedId) {
  return this.findById(feedId)
    .populate('author', 'username displayName avatar isVerified')
    .populate('likes', 'username displayName avatar')
    .populate('comments.user', 'username displayName avatar')
    .populate('mentions', 'username displayName')
    .populate('tips.user', 'username displayName avatar');
};

feedSchema.statics.getFeedsByUser = function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ author: userId, status: 'active' })
    .populate('author', 'username displayName avatar isVerified')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Ensure virtual fields are serialized
feedSchema.set('toJSON', { virtuals: true });
feedSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Feed', feedSchema); 