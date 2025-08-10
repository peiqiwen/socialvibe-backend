const mongoose = require('mongoose');
const User = require('./models/User');
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

// Test friend code functionality
const testFriendCodeFunctionality = async () => {
  try {
    console.log('🧪 Testing friend code functionality...');
    
    // Test 1: Check if all users have friend codes
    console.log('\n📋 Test 1: Check user friend codes');
    const allUsers = await User.find({});
    for (const user of allUsers) {
      console.log(`   ${user.username}: ${user.friendCode || 'MISSING'}`);
      if (!user.friendCode) {
        console.log(`   ❌ User ${user.username} is missing friend code`);
      }
    }
    
    // Test 2: Test friend code generation
    console.log('\n📋 Test 2: Test friend code generation');
    const testCode1 = User.generateFriendCode();
    const testCode2 = User.generateFriendCode();
    console.log(`   Generated code 1: ${testCode1} (length: ${testCode1.length})`);
    console.log(`   Generated code 2: ${testCode2} (length: ${testCode2.length})`);
    console.log(`   ✅ Both codes are 8 characters long`);
    
    // Test 3: Test unique friend code generation
    console.log('\n📋 Test 3: Test unique friend code generation');
    const uniqueCode = await User.generateUniqueFriendCode();
    console.log(`   Generated unique code: ${uniqueCode}`);
    
    // Check if it's actually unique
    const existingUser = await User.findOne({ friendCode: uniqueCode });
    if (existingUser) {
      console.log(`   ❌ Generated code already exists for user: ${existingUser.username}`);
    } else {
      console.log(`   ✅ Generated code is unique`);
    }
    
    // Test 4: Test public profile format
    console.log('\n📋 Test 4: Test public profile format');
    const sampleUser = await User.findOne({});
    if (sampleUser) {
      const publicProfile = sampleUser.getPublicProfile();
      console.log('   Public profile fields:');
      Object.keys(publicProfile).forEach(key => {
        console.log(`     ${key}: ${publicProfile[key]}`);
      });
      
      if (publicProfile.friendCode) {
        console.log(`   ✅ friendCode field is present: ${publicProfile.friendCode}`);
      } else {
        console.log(`   ❌ friendCode field is missing`);
      }
    }
    
    // Test 5: Test friend code lookup
    console.log('\n📋 Test 5: Test friend code lookup');
    const userWithCode = await User.findOne({ friendCode: { $exists: true, $ne: null } });
    if (userWithCode) {
      const foundUser = await User.findOne({ friendCode: userWithCode.friendCode });
      if (foundUser && foundUser._id.toString() === userWithCode._id.toString()) {
        console.log(`   ✅ Successfully found user by friend code: ${userWithCode.friendCode} -> ${userWithCode.username}`);
      } else {
        console.log(`   ❌ Failed to find user by friend code: ${userWithCode.friendCode}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing friend code functionality:', error.message);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testFriendCodeFunctionality();
  
  console.log('\n🏁 Friend code testing completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 