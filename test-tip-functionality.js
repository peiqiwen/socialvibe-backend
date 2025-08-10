const mongoose = require('mongoose');
const User = require('./models/User');
const Feed = require('./models/Feed');
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

// Test tip functionality
const testTipFunctionality = async () => {
  try {
    console.log('🧪 Testing tip functionality...');
    
    // Step 1: Create test users
    console.log('\n📋 Step 1: Creating test users...');
    
    // Create user A (tipper)
    const userAEmail = 'user_a_tip@example.com';
    const userAUsername = 'user_a_tip';
    let userA = await User.findOne({ email: userAEmail });
    
    if (!userA) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      userA = new User({
        email: userAEmail,
        username: userAUsername,
        password: hashedPassword,
        displayName: 'User A Tip',
        vibeCoins: 1000 // Give some coins for testing
      });
      userA.friendCode = await User.generateUniqueFriendCode();
      await userA.save();
      console.log(`   ✅ Created user A: ${userA.username} (${userA.email}) - Vibe Coins: ${userA.vibeCoins}`);
    } else {
      console.log(`   ⚠️  User A already exists: ${userA.username} (${userA.email}) - Vibe Coins: ${userA.vibeCoins}`);
    }
    
    // Create user B (feed author)
    const userBEmail = 'user_b_tip@example.com';
    const userBUsername = 'user_b_tip';
    let userB = await User.findOne({ email: userBEmail });
    
    if (!userB) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      userB = new User({
        email: userBEmail,
        username: userBUsername,
        password: hashedPassword,
        displayName: 'User B Tip',
        vibeCoins: 100 // Give some coins for testing
      });
      userB.friendCode = await User.generateUniqueFriendCode();
      await userB.save();
      console.log(`   ✅ Created user B: ${userB.username} (${userB.email}) - Vibe Coins: ${userB.vibeCoins}`);
    } else {
      console.log(`   ⚠️  User B already exists: ${userB.username} (${userB.email}) - Vibe Coins: ${userB.vibeCoins}`);
    }
    
    // Step 2: Create a test feed
    console.log('\n📋 Step 2: Creating test feed...');
    
    const testFeedContent = 'This is a test feed for tip functionality';
    let testFeed = await Feed.findOne({ content: testFeedContent, author: userB._id });
    
    if (!testFeed) {
      testFeed = new Feed({
        author: userB._id,
        content: testFeedContent,
        media: [],
        likes: [],
        comments: [],
        tips: [],
        totalTips: 0,
        status: 'active'
      });
      await testFeed.save();
      console.log(`   ✅ Created test feed: ${testFeed._id}`);
    } else {
      console.log(`   ⚠️  Test feed already exists: ${testFeed._id}`);
    }
    
    // Step 3: Test tip functionality
    console.log('\n📋 Step 3: Testing tip functionality...');
    
    const tipAmount = 50;
    const tipMessage = 'Great content!';
    
    console.log(`   User A (${userA.username}) tipping User B (${userB.username})`);
    console.log(`   Amount: ${tipAmount} Vibe Coins`);
    console.log(`   Message: "${tipMessage}"`);
    
    // Check if user A has enough coins
    if (userA.vibeCoins < tipAmount) {
      console.log(`   ❌ User A doesn't have enough coins: ${userA.vibeCoins} < ${tipAmount}`);
      return;
    }
    
    // Check if user is trying to tip their own feed
    if (testFeed.author.toString() === userA._id.toString()) {
      console.log(`   ❌ User A cannot tip their own feed`);
      return;
    }
    
    // Process the tip
    try {
      // Update user A's balance
      userA.vibeCoins -= tipAmount;
      await userA.save();
      console.log(`   ✅ User A's balance updated: ${userA.vibeCoins} coins`);
      
      // Add tip to feed
      await testFeed.addTip(userA._id, tipAmount, tipMessage);
      console.log(`   ✅ Tip added to feed`);
      
      // Update user B's balance
      userB.vibeCoins += tipAmount;
      await userB.save();
      console.log(`   ✅ User B's balance updated: ${userB.vibeCoins} coins`);
      
      // Create tip transaction record
      const tipTransaction = {
        id: `tip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromUserId: userA._id,
        toUserId: userB._id,
        feedId: testFeed._id,
        amount: tipAmount,
        message: tipMessage,
        status: 'completed',
        timestamp: new Date()
      };
      
      console.log(`   ✅ Tip transaction created: ${tipTransaction.id}`);
      
      // Step 4: Verify results
      console.log('\n📋 Step 4: Verifying results...');
      
      // Refresh user data
      const updatedUserA = await User.findById(userA._id);
      const updatedUserB = await User.findById(userB._id);
      const updatedFeed = await Feed.findById(testFeed._id);
      
      console.log(`   User A final balance: ${updatedUserA.vibeCoins} coins`);
      console.log(`   User B final balance: ${updatedUserB.vibeCoins} coins`);
      console.log(`   Feed total tips: ${updatedFeed.totalTips} coins`);
      console.log(`   Feed tip count: ${updatedFeed.tips.length} tips`);
      
      if (updatedFeed.tips.length > 0) {
        const lastTip = updatedFeed.tips[updatedFeed.tips.length - 1];
        console.log(`   Last tip details:`);
        console.log(`     - Amount: ${lastTip.amount} coins`);
        console.log(`     - Message: "${lastTip.message}"`);
        console.log(`     - User: ${lastTip.user}`);
        console.log(`     - Date: ${lastTip.tippedAt}`);
      }
      
      console.log('\n🎉 Tip functionality test completed successfully!');
      
    } catch (error) {
      console.error('❌ Error processing tip:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing tip functionality:', error.message);
  }
};

// Clean up test data
const cleanupTestData = async () => {
  try {
    console.log('\n🧹 Cleaning up test data...');
    
    // Delete test users
    const testEmails = ['user_a_tip@example.com', 'user_b_tip@example.com'];
    for (const email of testEmails) {
      const user = await User.findOne({ email });
      if (user) {
        // Delete related feeds
        await Feed.deleteMany({ author: user._id });
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
  await testTipFunctionality();
  await cleanupTestData();
  
  console.log('\n🏁 Tip functionality testing completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 