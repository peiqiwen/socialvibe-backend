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

// Simulate login response
const testLoginResponse = async () => {
  try {
    console.log('🧪 Testing login API response...');
    
    // Get a test user
    const testUser = await User.findOne({});
    if (!testUser) {
      console.log('❌ No test user found');
      return;
    }
    
    console.log(`👤 Testing with user: ${testUser.username} (${testUser.email})`);
    console.log(`   Friend Code: ${testUser.friendCode || 'MISSING'}`);
    
    // Simulate what the login endpoint does
    console.log('\n📋 Simulating login endpoint response...');
    
    // 1. Find user by email (simulate login)
    const user = await User.findOne({ email: testUser.email });
    if (!user) {
      console.log('❌ User not found by email');
      return;
    }
    
    // 2. Get public profile (what login endpoint returns)
    const publicProfile = user.getPublicProfile();
    
    console.log('\n📋 Login API Response:');
    console.log(JSON.stringify({
      message: 'Login successful',
      token: 'simulated-jwt-token',
      user: publicProfile
    }, null, 2));
    
    // Check if friendCode is present
    if (publicProfile.friendCode) {
      console.log(`\n✅ friendCode is present in login response: ${publicProfile.friendCode}`);
    } else {
      console.log('\n❌ friendCode is missing from login response');
      
      // Debug: check what fields are in publicProfile
      console.log('\n🔍 Debug: Available fields in publicProfile:');
      Object.keys(publicProfile).forEach(key => {
        console.log(`   ${key}: ${publicProfile[key]}`);
      });
      
      // Debug: check user object directly
      console.log('\n🔍 Debug: User object friendCode:');
      console.log(`   user.friendCode: ${user.friendCode}`);
      console.log(`   user.friendCode type: ${typeof user.friendCode}`);
      console.log(`   user.friendCode === null: ${user.friendCode === null}`);
      console.log(`   user.friendCode === undefined: ${user.friendCode === undefined}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing login response:', error.message);
  }
};

// Test registration response
const testRegistrationResponse = async () => {
  try {
    console.log('\n🧪 Testing registration API response...');
    
    // Create a test user for registration
    const testEmail = 'test_registration@example.com';
    const testUsername = 'test_registration_user';
    const testPassword = 'password123';
    const testDisplayName = 'Test Registration User';
    
    // Check if user already exists
    let existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      console.log('⚠️  Test user already exists, using existing user');
    } else {
      console.log('📝 Creating new test user for registration...');
      
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(testPassword, salt);
      
      // Create user
      existingUser = new User({
        email: testEmail,
        username: testUsername,
        password: hashedPassword,
        displayName: testDisplayName
      });
      
      // Generate friend code
      existingUser.friendCode = await User.generateUniqueFriendCode();
      
      await existingUser.save();
      console.log(`✅ Created test user with friend code: ${existingUser.friendCode}`);
    }
    
    // Simulate registration response
    const publicProfile = existingUser.getPublicProfile();
    
    console.log('\n📋 Registration API Response:');
    console.log(JSON.stringify({
      message: 'Registration successful',
      token: 'simulated-jwt-token',
      user: publicProfile
    }, null, 2));
    
    // Check if friendCode is present
    if (publicProfile.friendCode) {
      console.log(`\n✅ friendCode is present in registration response: ${publicProfile.friendCode}`);
    } else {
      console.log('\n❌ friendCode is missing from registration response');
    }
    
  } catch (error) {
    console.error('❌ Error testing registration response:', error.message);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testLoginResponse();
  await testRegistrationResponse();
  
  console.log('\n🏁 Login API testing completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 