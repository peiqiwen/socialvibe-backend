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

// Test registration with valid data
const testValidRegistration = async () => {
  try {
    console.log('🧪 Testing valid registration...');
    
    const testData = {
      email: 'test_valid_reg@example.com',
      username: 'test_valid_user',
      password: 'password123',
      displayName: 'Test Valid User'
    };
    
    console.log(`📋 Test data: ${JSON.stringify(testData)}`);
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: testData.email }, { username: testData.username }]
    });
    
    if (existingUser) {
      console.log(`⚠️  User already exists, cleaning up...`);
      await User.findByIdAndDelete(existingUser._id);
    }
    
    // Create new user
    const user = new User(testData);
    
    // Generate friend code
    user.friendCode = await User.generateUniqueFriendCode();
    
    await user.save();
    
    console.log(`✅ User created successfully!`);
    console.log(`   User ID: ${user._id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Friend Code: ${user.friendCode}`);
    
    // Test public profile
    const publicProfile = user.getPublicProfile();
    console.log(`\n📋 Public Profile:`);
    console.log(JSON.stringify(publicProfile, null, 2));
    
    if (publicProfile.friendCode) {
      console.log(`✅ friendCode is present in public profile: ${publicProfile.friendCode}`);
    } else {
      console.log(`❌ friendCode is missing from public profile`);
    }
    
    // Clean up
    await User.findByIdAndDelete(user._id);
    console.log(`🧹 Test user cleaned up`);
    
  } catch (error) {
    console.error('❌ Error testing valid registration:', error.message);
  }
};

// Test common username patterns
const testUsernamePatterns = async () => {
  try {
    console.log('\n🧪 Testing username patterns...');
    
    const testCases = [
      { username: 'valid_user', valid: true },
      { username: 'user123', valid: true },
      { username: 'USER_NAME', valid: true },
      { username: 'user-name', valid: false }, // hyphen
      { username: 'user.name', valid: false }, // dot
      { username: 'user name', valid: false }, // space
      { username: 'user@name', valid: false }, // @ symbol
      { username: '用户名', valid: false }, // Chinese characters
      { username: 'ab', valid: false }, // too short
      { username: 'a'.repeat(31), valid: false } // too long
    ];
    
    for (const testCase of testCases) {
      console.log(`\n📋 Testing username: "${testCase.username}"`);
      
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      const isValidFormat = usernameRegex.test(testCase.username);
      const isValidLength = testCase.username.length >= 3 && testCase.username.length <= 30;
      const isValid = isValidFormat && isValidLength;
      
      console.log(`   Format valid: ${isValidFormat}`);
      console.log(`   Length valid: ${isValidLength} (${testCase.username.length} chars)`);
      console.log(`   Overall valid: ${isValid}`);
      console.log(`   Expected: ${testCase.valid}`);
      
      if (isValid === testCase.valid) {
        console.log(`   ✅ Test passed`);
      } else {
        console.log(`   ❌ Test failed`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing username patterns:', error.message);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testValidRegistration();
  await testUsernamePatterns();
  
  console.log('\n🏁 Registration testing completed');
  console.log('\n💡 Registration requirements:');
  console.log('   - Email: Valid email format');
  console.log('   - Username: 3-30 characters, only letters, numbers, and underscores');
  console.log('   - Password: At least 6 characters');
  console.log('   - Display Name: 1-50 characters');
  console.log('   - Friend Code: Automatically generated (8 characters)');
  
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 