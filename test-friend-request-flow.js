const mongoose = require('mongoose');
const User = require('./models/User');
const FriendRequest = require('./models/FriendRequest');
const Friend = require('./models/Friend');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialvibe', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Test complete friend request flow
const testFriendRequestFlow = async () => {
  try {
    console.log('🧪 Testing complete friend request flow...');
    
    // Step 1: Create test users
    console.log('\n📋 Step 1: Creating test users...');
    
    // Create user A
    const userAEmail = 'user_a_test@example.com';
    const userAUsername = 'user_a_test';
    let userA = await User.findOne({ email: userAEmail });
    
    if (!userA) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      userA = new User({
        email: userAEmail,
        username: userAUsername,
        password: hashedPassword,
        displayName: 'User A Test'
      });
      userA.friendCode = await User.generateUniqueFriendCode();
      await userA.save();
      console.log(`   ✅ Created user A: ${userA.username} (${userA.email}) - Friend Code: ${userA.friendCode}`);
    } else {
      console.log(`   ⚠️  User A already exists: ${userA.username} (${userA.email}) - Friend Code: ${userA.friendCode}`);
    }
    
    // Create user B
    const userBEmail = 'user_b_test@example.com';
    const userBUsername = 'user_b_test';
    let userB = await User.findOne({ email: userBEmail });
    
    if (!userB) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      userB = new User({
        email: userBEmail,
        username: userBUsername,
        password: hashedPassword,
        displayName: 'User B Test'
      });
      userB.friendCode = await User.generateUniqueFriendCode();
      await userB.save();
      console.log(`   ✅ Created user B: ${userB.username} (${userB.email}) - Friend Code: ${userB.friendCode}`);
    } else {
      console.log(`   ⚠️  User B already exists: ${userB.username} (${userB.email}) - Friend Code: ${userB.friendCode}`);
    }
    
    // Step 2: Simulate user A sending friend request to user B
    console.log('\n📋 Step 2: User A sending friend request to User B...');
    console.log(`   User A: ${userA.username} (${userA.email})`);
    console.log(`   User B: ${userB.username} (${userB.email})`);
    console.log(`   Friend Code: ${userB.friendCode}`);
    
    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      fromUserId: userA._id,
      toUserId: userB._id,
      status: 0 // Pending
    });
    
    if (existingRequest) {
      console.log(`   ⚠️  Friend request already exists from ${userA.username} to ${userB.username}`);
    } else {
      // Create friend request
      const friendRequest = new FriendRequest({
        fromUserId: userA._id,
        toUserId: userB._id,
        fromUsername: userA.username,
        fromEmail: userA.email,
        fromAvatarURL: userA.avatarURL,
        status: 0 // Pending
      });
      
      await friendRequest.save();
      console.log(`   ✅ Friend request created: ${friendRequest._id}`);
    }
    
    // Step 3: Check friend requests for user B
    console.log('\n📋 Step 3: Checking friend requests for User B...');
    
    const friendRequests = await FriendRequest.find({
      toUserId: userB._id,
      status: 0 // Pending
    }).sort({ createdAt: -1 });
    
    console.log(`   Found ${friendRequests.length} pending friend requests for User B:`);
    
    for (const request of friendRequests) {
      console.log(`   - From: ${request.fromUsername} (${request.fromEmail})`);
      console.log(`     Request ID: ${request._id}`);
      console.log(`     Status: ${request.status} (0 = Pending)`);
      console.log(`     Created: ${request.createdAt}`);
    }
    
    // Step 4: Simulate user B accepting the request
    console.log('\n📋 Step 4: User B accepting friend request...');
    
    if (friendRequests.length > 0) {
      const requestToAccept = friendRequests[0];
      
      // Update request status to accepted
      requestToAccept.status = 1; // Accepted
      await requestToAccept.save();
      console.log(`   ✅ Friend request accepted: ${requestToAccept._id}`);
      
      // Create friendship
      const friendship = new Friend({
        userId: userB._id,
        friendId: userA._id,
        username: userA.username,
        email: userA.email,
        avatarURL: userA.avatarURL
      });
      
      await friendship.save();
      console.log(`   ✅ Friendship created: ${friendship._id}`);
      
      // Create reverse friendship
      const reverseFriendship = new Friend({
        userId: userA._id,
        friendId: userB._id,
        username: userB.username,
        email: userB.email,
        avatarURL: userB.avatarURL
      });
      
      await reverseFriendship.save();
      console.log(`   ✅ Reverse friendship created: ${reverseFriendship._id}`);
      
    } else {
      console.log(`   ⚠️  No pending friend requests to accept`);
    }
    
    // Step 5: Verify friendship
    console.log('\n📋 Step 5: Verifying friendship...');
    
    const userAFriends = await Friend.find({ userId: userA._id });
    const userBFriends = await Friend.find({ userId: userB._id });
    
    console.log(`   User A friends: ${userAFriends.length}`);
    for (const friend of userAFriends) {
      console.log(`     - ${friend.username} (${friend.email})`);
    }
    
    console.log(`   User B friends: ${userBFriends.length}`);
    for (const friend of userBFriends) {
      console.log(`     - ${friend.username} (${friend.email})`);
    }
    
    // Step 6: Check final request status
    console.log('\n📋 Step 6: Checking final request status...');
    
    const allRequests = await FriendRequest.find({
      $or: [
        { fromUserId: userA._id, toUserId: userB._id },
        { fromUserId: userB._id, toUserId: userA._id }
      ]
    });
    
    console.log(`   Total requests between users: ${allRequests.length}`);
    for (const request of allRequests) {
      const statusText = request.status === 0 ? 'Pending' : request.status === 1 ? 'Accepted' : 'Rejected';
      console.log(`   - ${request.fromUsername} -> ${request.toUserId === userB._id ? userB.username : userA.username}: ${statusText}`);
    }
    
    console.log('\n🎉 Friend request flow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing friend request flow:', error.message);
  }
};

// Clean up test data
const cleanupTestData = async () => {
  try {
    console.log('\n🧹 Cleaning up test data...');
    
    // Delete test users
    const testEmails = ['user_a_test@example.com', 'user_b_test@example.com'];
    for (const email of testEmails) {
      const user = await User.findOne({ email });
      if (user) {
        // Delete related data
        await FriendRequest.deleteMany({
          $or: [{ fromUserId: user._id }, { toUserId: user._id }]
        });
        await Friend.deleteMany({
          $or: [{ userId: user._id }, { friendId: user._id }]
        });
        await User.findByIdAndDelete(user._id);
        console.log(`   🧹 Deleted user: ${email}`);
      }
    }
    
    console.log('   ✅ Test data cleanup completed');
    
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error.message);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testFriendRequestFlow();
  await cleanupTestData();
  
  console.log('\n🏁 Friend request flow testing completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 