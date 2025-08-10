const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');
const Friend = require('../models/Friend');

// 生成好友码
router.get('/code', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user.friendCode) {
            // 生成6位随机好友码
            const friendCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            user.friendCode = friendCode;
            await user.save();
        }
        
        res.json({
            success: true,
            data: {
                friendCode: user.friendCode
            }
        });
    } catch (error) {
        console.error('Error generating friend code:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate friend code'
        });
    }
});

// 重新生成好友码
router.post('/code/generate', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        // 生成新的6位随机好友码
        const friendCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        user.friendCode = friendCode;
        await user.save();
        
        res.json({
            success: true,
            data: {
                friendCode: user.friendCode
            }
        });
    } catch (error) {
        console.error('Error regenerating friend code:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to regenerate friend code'
        });
    }
});

// 发送好友申请
router.post('/request', auth, async (req, res) => {
    try {
        const { friendCode } = req.body;
        
        if (!friendCode) {
            return res.status(400).json({
                success: false,
                message: 'Friend code is required'
            });
        }
        
        // 查找目标用户
        const targetUser = await User.findOne({ friendCode: friendCode.toUpperCase() });
        
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this friend code'
            });
        }
        
        if (targetUser._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot send friend request to yourself'
            });
        }
        
        // 检查是否已经是好友
        const existingFriendship = await Friend.findOne({
            $or: [
                { userId: req.user.id, friendId: targetUser._id },
                { userId: targetUser._id, friendId: req.user.id }
            ]
        });
        
        if (existingFriendship) {
            return res.status(400).json({
                success: false,
                message: 'Already friends with this user'
            });
        }
        
        // 检查是否已经有待处理的申请
        const existingRequest = await FriendRequest.findOne({
            fromUserId: req.user.id,
            toUserId: targetUser._id,
            status: 0 // Pending
        });
        
        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'Friend request already sent'
            });
        }
        
        // 创建好友申请
        const friendRequest = new FriendRequest({
            fromUserId: req.user.id,
            toUserId: targetUser._id,
            fromUsername: req.user.username,
            fromEmail: req.user.email,
            fromAvatarURL: req.user.avatarURL,
            status: 0 // Pending
        });
        
        await friendRequest.save();
        
        res.json({
            success: true,
            message: 'Friend request sent successfully',
            data: {
                requestId: friendRequest._id
            }
        });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send friend request'
        });
    }
});

// 获取好友申请列表
router.get('/requests', auth, async (req, res) => {
    try {
        const requests = await FriendRequest.find({
            toUserId: req.user.id,
            status: 0 // Pending
        }).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Error getting friend requests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get friend requests'
        });
    }
});

// 接受好友申请
router.post('/requests/:requestId/accept', auth, async (req, res) => {
    try {
        const { requestId } = req.params;
        
        const friendRequest = await FriendRequest.findById(requestId);
        
        if (!friendRequest) {
            return res.status(404).json({
                success: false,
                message: 'Friend request not found'
            });
        }
        
        if (friendRequest.toUserId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to accept this request'
            });
        }
        
        if (friendRequest.status !== 0) {
            return res.status(400).json({
                success: false,
                message: 'Friend request already processed'
            });
        }
        
        // 获取申请者信息
        const fromUser = await User.findById(friendRequest.fromUserId);
        
        // 创建双向好友关系
        const friendship1 = new Friend({
            userId: req.user.id,
            friendId: friendRequest.fromUserId,
            username: fromUser.username,
            displayName: fromUser.displayName,
            email: fromUser.email,
            avatarURL: fromUser.avatarURL,
            bio: fromUser.bio
        });
        
        const friendship2 = new Friend({
            userId: friendRequest.fromUserId,
            friendId: req.user.id,
            username: req.user.username,
            displayName: req.user.displayName,
            email: req.user.email,
            avatarURL: req.user.avatarURL,
            bio: req.user.bio
        });
        
        await Promise.all([
            friendship1.save(),
            friendship2.save()
        ]);
        
        // 更新申请状态
        friendRequest.status = 1; // Accepted
        await friendRequest.save();
        
        res.json({
            success: true,
            message: 'Friend request accepted successfully'
        });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to accept friend request'
        });
    }
});

// 拒绝好友申请
router.post('/requests/:requestId/reject', auth, async (req, res) => {
    try {
        const { requestId } = req.params;
        
        const friendRequest = await FriendRequest.findById(requestId);
        
        if (!friendRequest) {
            return res.status(404).json({
                success: false,
                message: 'Friend request not found'
            });
        }
        
        if (friendRequest.toUserId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to reject this request'
            });
        }
        
        if (friendRequest.status !== 0) {
            return res.status(400).json({
                success: false,
                message: 'Friend request already processed'
            });
        }
        
        // 更新申请状态
        friendRequest.status = 2; // Rejected
        await friendRequest.save();
        
        res.json({
            success: true,
            message: 'Friend request rejected successfully'
        });
    } catch (error) {
        console.error('Error rejecting friend request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject friend request'
        });
    }
});

// 获取好友列表
router.get('/', auth, async (req, res) => {
    try {
        const friends = await Friend.find({
            userId: req.user.id
        }).sort({ username: 1 }); // 按用户名字母排序
        
        res.json({
            success: true,
            data: friends
        });
    } catch (error) {
        console.error('Error getting friends list:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get friends list'
        });
    }
});

// 删除好友
router.delete('/:friendId', auth, async (req, res) => {
    try {
        const { friendId } = req.params;
        
        // 删除双向好友关系
        await Promise.all([
            Friend.findOneAndDelete({
                userId: req.user.id,
                friendId: friendId
            }),
            Friend.findOneAndDelete({
                userId: friendId,
                friendId: req.user.id
            })
        ]);
        
        res.json({
            success: true,
            message: 'Friend removed successfully'
        });
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove friend'
        });
    }
});

// 获取好友申请数量（用于通知）
router.get('/requests/count', auth, async (req, res) => {
    try {
        const count = await FriendRequest.countDocuments({
            toUserId: req.user.id,
            status: 0 // Pending
        });
        
        res.json({
            success: true,
            data: {
                count: count
            }
        });
    } catch (error) {
        console.error('Error getting friend requests count:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get friend requests count'
        });
    }
});

module.exports = router; 