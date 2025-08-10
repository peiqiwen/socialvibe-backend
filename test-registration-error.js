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

// Test registration validation
const testRegistrationValidation = async () => {
  try {
    console.log('🧪 Testing registration validation...');
    
    // Test cases
    const testCases = [
      {
        name: 'Valid registration data',
        data: {
          email: 'test_valid@example.com',
          username: 'test_valid_user',
          password: 'password123',
          displayName: 'Test Valid User'
        },
        shouldPass: true
      },
      {
        name: 'Invalid email',
        data: {
          email: 'invalid-email',
          username: 'test_user',
          password: 'password123',
          displayName: 'Test User'
        },
        shouldPass: false
      },
      {
        name: 'Username too short',
        data: {
          email: 'test@example.com',
          username: 'ab',
          password: 'password123',
          displayName: 'Test User'
        },
        shouldPass: false
      },
      {
        name: 'Username with invalid characters',
        data: {
          email: 'test@example.com',
          username: 'test-user@123',
          password: 'password123',
          displayName: 'Test User'
        },
        shouldPass: false
      },
      {
        name: 'Password too short',
        data: {
          email: 'test@example.com',
          username: 'test_user',
          password: '123',
          displayName: 'Test User'
        },
        shouldPass: false
      },
      {
        name: 'Missing displayName',
        data: {
          email: 'test@example.com',
          username: 'test_user',
          password: 'password123'
        },
        shouldPass: false
      }
    ];
    
    for (const testCase of testCases) {
      console.log(`\n📋 Testing: ${testCase.name}`);
      console.log(`   Data: ${JSON.stringify(testCase.data)}`);
      
      try {
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [{ email: testCase.data.email }, { username: testCase.data.username }]
        });
        
        if (existingUser) {
          console.log(`   ❌ User already exists: ${existingUser.email === testCase.data.email ? 'Email' : 'Username'} already taken`);
          continue;
        }
        
        // Try to create user
        const user = new User(testCase.data);
        
        // Generate friend code
        user.friendCode = await User.generateUniqueFriendCode();
        
        await user.save();
        
        if (testCase.shouldPass) {
          console.log(`   ✅ Test passed - User created successfully`);
          console.log(`   ✅ Friend code generated: ${user.friendCode}`);
          
          // Clean up - delete test user
          await User.findByIdAndDelete(user._id);
          console.log(`   🧹 Test user cleaned up`);
        } else {
          console.log(`   ❌ Test failed - Should have failed but passed`);
          // Clean up
          await User.findByIdAndDelete(user._id);
        }
        
      } catch (error) {
        if (testCase.shouldPass) {
          console.log(`   ❌ Test failed - Should have passed but failed: ${error.message}`);
        } else {
          console.log(`   ✅ Test passed - Correctly failed: ${error.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing registration validation:', error.message);
  }
};

// Test existing users
const testExistingUsers = async () => {
  try {
    console.log('\n🧪 Testing existing users...');
    
    const allUsers = await User.find({});
    console.log(`📊 Found ${allUsers.length} existing users:`);
    
    for (const user of allUsers) {
      console.log(`   - ${user.username} (${user.email}) - Friend Code: ${user.friendCode}`);
    }
    
    // Check for potential conflicts
    const testEmails = ['ios_test@example.com', 'device_test@example.com'];
    const testUsernames = ['ios_test_user', 'device_test_user'];
    
    console.log('\n🔍 Checking for potential conflicts:');
    
    for (const email of testEmails) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`   ⚠️  Email ${email} already exists: ${existingUser.username}`);
      } else {
        console.log(`   ✅ Email ${email} is available`);
      }
    }
    
    for (const username of testUsernames) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        console.log(`   ⚠️  Username ${username} already exists: ${existingUser.email}`);
      } else {
        console.log(`   ✅ Username ${username} is available`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing existing users:', error.message);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testRegistrationValidation();
  await testExistingUsers();
  
  console.log('\n🏁 Registration testing completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 