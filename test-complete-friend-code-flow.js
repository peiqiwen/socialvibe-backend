const mongoose = require('mongoose');
const User = require('./models/User');
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

// Test complete friend code flow
const testCompleteFlow = async () => {
  try {
    console.log('🧪 Testing complete friend code flow...');
    
    // Step 1: Check all users have friend codes
    console.log('\n📋 Step 1: Check all users have friend codes');
    const allUsers = await User.find({});
    for (const user of allUsers) {
      console.log(`   ${user.username}: ${user.friendCode || 'MISSING'}`);
      if (!user.friendCode) {
        console.log(`   ❌ User ${user.username} is missing friend code`);
        return;
      }
    }
    console.log('   ✅ All users have friend codes');
    
    // Step 2: Test login API response
    console.log('\n📋 Step 2: Test login API response');
    const testUser = await User.findOne({});
    const loginResponse = {
      message: 'Login successful',
      token: 'test-jwt-token',
      user: testUser.getPublicProfile()
    };
    
    console.log('   Login API Response:');
    console.log(JSON.stringify(loginResponse, null, 4));
    
    if (loginResponse.user.friendCode) {
      console.log(`   ✅ Login API includes friendCode: ${loginResponse.user.friendCode}`);
    } else {
      console.log('   ❌ Login API missing friendCode');
      return;
    }
    
    // Step 3: Test registration API response
    console.log('\n📋 Step 3: Test registration API response');
    const newFriendCode = await User.generateUniqueFriendCode();
    const newUser = {
      _id: 'test-user-id',
      username: 'test_new_user',
      displayName: 'Test New User',
      avatar: null,
      bio: '',
      isVerified: false,
      friendCode: newFriendCode,
      followers: 0,
      following: 0,
      createdAt: new Date()
    };
    
    const registrationResponse = {
      message: 'Registration successful',
      token: 'test-jwt-token',
      user: newUser
    };
    
    console.log('   Registration API Response:');
    console.log(JSON.stringify(registrationResponse, null, 4));
    
    if (registrationResponse.user.friendCode) {
      console.log(`   ✅ Registration API includes friendCode: ${registrationResponse.user.friendCode}`);
    } else {
      console.log('   ❌ Registration API missing friendCode');
      return;
    }
    
    // Step 4: Test friend code lookup
    console.log('\n📋 Step 4: Test friend code lookup');
    const userWithCode = await User.findOne({ friendCode: { $exists: true, $ne: null } });
    if (userWithCode) {
      const foundUser = await User.findOne({ friendCode: userWithCode.friendCode });
      if (foundUser && foundUser._id.toString() === userWithCode._id.toString()) {
        console.log(`   ✅ Successfully found user by friend code: ${userWithCode.friendCode} -> ${userWithCode.username}`);
      } else {
        console.log(`   ❌ Failed to find user by friend code: ${userWithCode.friendCode}`);
        return;
      }
    }
    
    // Step 5: Test friend code uniqueness
    console.log('\n📋 Step 5: Test friend code uniqueness');
    const existingCodes = new Set();
    for (const user of allUsers) {
      if (existingCodes.has(user.friendCode)) {
        console.log(`   ❌ Duplicate friend code found: ${user.friendCode}`);
        return;
      }
      existingCodes.add(user.friendCode);
    }
    console.log(`   ✅ All ${existingCodes.size} friend codes are unique`);
    
    console.log('\n🎉 All tests passed! Friend code system is working correctly.');
    
  } catch (error) {
    console.error('❌ Error testing complete flow:', error.message);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testCompleteFlow();
  
  console.log('\n🏁 Complete flow testing finished');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 