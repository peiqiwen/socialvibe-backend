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

// Check and fix user friend codes
const checkAndFixUserFriendCodes = async () => {
  try {
    console.log('🔍 Checking all users for friend codes...');
    
    // Get all users
    const allUsers = await User.find({});
    console.log(`📊 Found ${allUsers.length} total users`);
    
    let usersWithoutCodes = 0;
    let usersWithCodes = 0;
    
    for (const user of allUsers) {
      console.log(`\n👤 User: ${user.username} (${user.email})`);
      console.log(`   Friend Code: ${user.friendCode || 'MISSING'}`);
      
      if (!user.friendCode) {
        try {
          const friendCode = await User.generateUniqueFriendCode();
          user.friendCode = friendCode;
          await user.save();
          console.log(`   ✅ Generated new friend code: ${friendCode}`);
          usersWithoutCodes++;
        } catch (error) {
          console.error(`   ❌ Failed to generate friend code:`, error.message);
        }
      } else {
        usersWithCodes++;
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Users with friend codes: ${usersWithCodes}`);
    console.log(`   Users without friend codes: ${usersWithoutCodes}`);
    console.log(`   Total users processed: ${allUsers.length}`);
    
    if (usersWithoutCodes > 0) {
      console.log(`\n🎉 Generated friend codes for ${usersWithoutCodes} users`);
    } else {
      console.log(`\n✅ All users already have friend codes`);
    }
    
  } catch (error) {
    console.error('❌ Error checking user friend codes:', error.message);
  }
};

// Test API response
const testAPIResponse = async () => {
  try {
    console.log('\n🧪 Testing API response format...');
    
    // Get a sample user
    const sampleUser = await User.findOne({});
    if (sampleUser) {
      const publicProfile = sampleUser.getPublicProfile();
      console.log('📋 Sample user public profile:');
      console.log(JSON.stringify(publicProfile, null, 2));
      
      if (publicProfile.friendCode) {
        console.log('✅ friendCode field is included in public profile');
      } else {
        console.log('❌ friendCode field is missing from public profile');
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing API response:', error.message);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await checkAndFixUserFriendCodes();
  await testAPIResponse();
  
  console.log('\n🏁 Script completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 