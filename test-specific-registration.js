const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
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

// Simulate the exact registration request
const testSpecificRegistration = async () => {
  try {
    console.log('🧪 Testing specific registration request...');
    
    // The exact data from the error log
    const testData = {
      email: '12345678@qq.com',
      username: '12345678',
      password: '12345678',
      displayName: '12345678'
    };
    
    console.log(`📋 Test data: ${JSON.stringify(testData)}`);
    
    // Check validation rules
    console.log('\n📋 Validation checks:');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(testData.email);
    console.log(`   Email valid: ${isEmailValid} (${testData.email})`);
    
    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const isUsernameValid = usernameRegex.test(testData.username);
    const isUsernameLengthValid = testData.username.length >= 3 && testData.username.length <= 30;
    console.log(`   Username format valid: ${isUsernameValid} (${testData.username})`);
    console.log(`   Username length valid: ${isUsernameLengthValid} (${testData.username.length} chars)`);
    
    // Password validation
    const isPasswordValid = testData.password.length >= 6;
    console.log(`   Password valid: ${isPasswordValid} (${testData.password.length} chars)`);
    
    // Display name validation
    const isDisplayNameValid = testData.displayName.length >= 1 && testData.displayName.length <= 50;
    console.log(`   Display name valid: ${isDisplayNameValid} (${testData.displayName.length} chars)`);
    
    // Check if user already exists
    console.log('\n📋 Checking existing users...');
    const existingUser = await User.findOne({
      $or: [{ email: testData.email }, { username: testData.username }]
    });
    
    if (existingUser) {
      console.log(`   ⚠️  User already exists:`);
      console.log(`      - Email: ${existingUser.email}`);
      console.log(`      - Username: ${existingUser.username}`);
      console.log(`      - ID: ${existingUser._id}`);
      console.log(`   ❌ This would cause a 400 error: "User already exists"`);
      return;
    } else {
      console.log(`   ✅ No existing user found with this email or username`);
    }
    
    // Test the validation middleware
    console.log('\n📋 Testing validation middleware...');
    const validateRegistration = [
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
      body('username')
        .isLength({ min: 3, max: 30 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores'),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
      body('displayName')
        .isLength({ min: 1, max: 50 })
        .trim()
        .withMessage('Display name must be 1-50 characters')
    ];
    
    const req = { body: testData };
    
    try {
      await Promise.all(validateRegistration.map(validation => validation.run(req)));
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        console.log(`   ❌ Validation failed:`);
        errors.array().forEach(error => {
          console.log(`      - ${error.param}: ${error.msg}`);
        });
      } else {
        console.log(`   ✅ Validation passed`);
      }
    } catch (error) {
      console.log(`   ❌ Validation error: ${error.message}`);
    }
    
    // Try to create user directly
    console.log('\n📋 Testing user creation...');
    try {
      const user = new User(testData);
      user.friendCode = await User.generateUniqueFriendCode();
      await user.save();
      
      console.log(`   ✅ User created successfully!`);
      console.log(`      - ID: ${user._id}`);
      console.log(`      - Username: ${user.username}`);
      console.log(`      - Email: ${user.email}`);
      console.log(`      - Friend Code: ${user.friendCode}`);
      
      // Clean up
      await User.findByIdAndDelete(user._id);
      console.log(`   🧹 Test user cleaned up`);
      
    } catch (error) {
      console.log(`   ❌ User creation failed: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing specific registration:', error.message);
  }
};

// Check all existing users
const checkExistingUsers = async () => {
  try {
    console.log('\n🧪 Checking all existing users...');
    
    const allUsers = await User.find({});
    console.log(`📊 Found ${allUsers.length} users:`);
    
    for (const user of allUsers) {
      console.log(`   - ${user.username} (${user.email}) - Friend Code: ${user.friendCode}`);
    }
    
    // Check for conflicts with test data
    const testEmail = '12345678@qq.com';
    const testUsername = '12345678';
    
    const emailConflict = await User.findOne({ email: testEmail });
    const usernameConflict = await User.findOne({ username: testUsername });
    
    if (emailConflict) {
      console.log(`\n⚠️  Email conflict: ${testEmail} already exists (${emailConflict.username})`);
    }
    
    if (usernameConflict) {
      console.log(`\n⚠️  Username conflict: ${testUsername} already exists (${usernameConflict.email})`);
    }
    
    if (!emailConflict && !usernameConflict) {
      console.log(`\n✅ No conflicts found for test data`);
    }
    
  } catch (error) {
    console.error('❌ Error checking existing users:', error.message);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testSpecificRegistration();
  await checkExistingUsers();
  
  console.log('\n🏁 Specific registration testing completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 