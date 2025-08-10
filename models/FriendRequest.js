const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fromUsername: {
        type: String,
        required: true
    },
    fromEmail: {
        type: String,
        required: true
    },
    fromAvatarURL: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        enum: [0, 1, 2], // 0: Pending, 1: Accepted, 2: Rejected
        default: 0
    }
}, {
    timestamps: true
});

// 创建复合索引防止重复申请
friendRequestSchema.index({ fromUserId: 1, toUserId: 1, status: 1 });

module.exports = mongoose.model('FriendRequest', friendRequestSchema); 