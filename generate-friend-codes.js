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

// Generate friend codes for existing users
const generateFriendCodesForExistingUsers = async () => {
  try {
    console.log('🔍 Finding users without friend codes...');
    
    // Find users without friend codes
    const usersWithoutCodes = await User.find({ 
      $or: [
        { friendCode: { $exists: false } },
        { friendCode: null },
        { friendCode: '' }
      ]
    });
    
    console.log(`📊 Found ${usersWithoutCodes.length} users without friend codes`);
    
    if (usersWithoutCodes.length === 0) {
      console.log('✅ All users already have friend codes');
      return;
    }
    
    // Generate friend codes for each user
    for (const user of usersWithoutCodes) {
      try {
        const friendCode = await User.generateUniqueFriendCode();
        user.friendCode = friendCode;
        await user.save();
        console.log(`✅ Generated friend code ${friendCode} for user ${user.username} (${user.email})`);
      } catch (error) {
        console.error(`❌ Failed to generate friend code for user ${user.username}:`, error.message);
      }
    }
    
    console.log('🎉 Friend code generation completed!');
    
  } catch (error) {
    console.error('❌ Error generating friend codes:', error.message);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await generateFriendCodesForExistingUsers();
  
  console.log('🏁 Script completed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 