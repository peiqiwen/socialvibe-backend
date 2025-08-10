const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true
    },
    avatarURL: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    isOnline: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// 创建复合索引防止重复好友关系
friendSchema.index({ userId: 1, friendId: 1 }, { unique: true });

module.exports = mongoose.model('Friend', friendSchema); 