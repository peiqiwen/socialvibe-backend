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

// Check if user exists
const checkUserExists = async () => {
  try {
    console.log('🔍 Checking if user already exists...');
    
    const testEmail = '12345678@qq.com';
    const testUsername = '12345678';
    
    console.log(`📋 Checking for:`);
    console.log(`   Email: ${testEmail}`);
    console.log(`   Username: ${testUsername}`);
    
    // Check by email
    const userByEmail = await User.findOne({ email: testEmail });
    if (userByEmail) {
      console.log(`\n⚠️  User with email "${testEmail}" already exists:`);
      console.log(`   - Username: ${userByEmail.username}`);
      console.log(`   - Email: ${userByEmail.email}`);
      console.log(`   - ID: ${userByEmail._id}`);
      console.log(`   - Created: ${userByEmail.createdAt}`);
      console.log(`   - Friend Code: ${userByEmail.friendCode}`);
    } else {
      console.log(`\n✅ No user found with email "${testEmail}"`);
    }
    
    // Check by username
    const userByUsername = await User.findOne({ username: testUsername });
    if (userByUsername) {
      console.log(`\n⚠️  User with username "${testUsername}" already exists:`);
      console.log(`   - Username: ${userByUsername.username}`);
      console.log(`   - Email: ${userByUsername.email}`);
      console.log(`   - ID: ${userByUsername._id}`);
      console.log(`   - Created: ${userByUsername.createdAt}`);
      console.log(`   - Friend Code: ${userByUsername.friendCode}`);
    } else {
      console.log(`\n✅ No user found with username "${testUsername}"`);
    }
    
    // Show all users
    console.log('\n📊 All users in database:');
    const allUsers = await User.find({});
    console.log(`   Total users: ${allUsers.length}`);
    
    for (const user of allUsers) {
      console.log(`   - ${user.username} (${user.email}) - Friend Code: ${user.friendCode}`);
    }
    
    // Check for similar usernames
    console.log('\n🔍 Checking for similar usernames:');
    const similarUsers = await User.find({
      username: { $regex: '12345678', $options: 'i' }
    });
    
    if (similarUsers.length > 0) {
      console.log(`   Found ${similarUsers.length} similar usernames:`);
      similarUsers.forEach(user => {
        console.log(`     - ${user.username} (${user.email})`);
      });
    } else {
      console.log(`   No similar usernames found`);
    }
    
    // Check for similar emails
    console.log('\n🔍 Checking for similar emails:');
    const similarEmails = await User.find({
      email: { $regex: '12345678', $options: 'i' }
    });
    
    if (similarEmails.length > 0) {
      console.log(`   Found ${similarEmails.length} similar emails:`);
      similarEmails.forEach(user => {
        console.log(`     - ${user.email} (${user.username})`);
      });
    } else {
      console.log(`   No similar emails found`);
    }
    
  } catch (error) {
    console.error('❌ Error checking user exists:', error.message);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await checkUserExists();
  
  console.log('\n🏁 User existence check completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 