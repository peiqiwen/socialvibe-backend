// Decode the error response from the log
const errorData = "7b226572 726f7222 3a225573 65722061 ... 73746572 6564227d";

console.log('🔍 Decoding error response...');

// Convert hex to string
function hexToString(hex) {
    const hexArray = hex.split(' ');
    const bytes = new Uint8Array(hexArray.map(h => parseInt(h, 16)));
    return new TextDecoder().decode(bytes);
}

// Try to decode the error
try {
    // Remove the "bytes = 0x" prefix and decode
    const hexString = errorData.replace(/^0x/, '');
    const decoded = hexToString(hexString);
    console.log('📋 Decoded error response:');
    console.log(decoded);
    
    // Try to parse as JSON
    try {
        const errorObj = JSON.parse(decoded);
        console.log('\n📋 Parsed error object:');
        console.log(JSON.stringify(errorObj, null, 2));
    } catch (parseError) {
        console.log('❌ Could not parse as JSON:', parseError.message);
    }
    
} catch (error) {
    console.log('❌ Error decoding:', error.message);
}

// Common error patterns
console.log('\n💡 Common 400 error patterns:');
console.log('1. "User already exists" - Email or username already registered');
console.log('2. "Validation failed" - Input validation errors');
console.log('3. "Username already taken" - Username conflict');
console.log('4. "Email already registered" - Email conflict');

// Test the specific data
console.log('\n🧪 Testing the specific registration data:');
const testData = {
    email: '12345678@qq.com',
    username: '12345678',
    password: '12345678',
    displayName: '12345678'
};

console.log('📋 Data validation:');
console.log(`   Email: ${testData.email} - Valid: ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testData.email)}`);
console.log(`   Username: ${testData.username} - Valid: ${/^[a-zA-Z0-9_]+$/.test(testData.username)}`);
console.log(`   Password length: ${testData.password.length} - Valid: ${testData.password.length >= 6}`);
console.log(`   Display name length: ${testData.displayName.length} - Valid: ${testData.displayName.length >= 1 && testData.displayName.length <= 50}`);

// Check if this could be a "User already exists" error
console.log('\n🔍 Possible causes:');
console.log('1. User with email "12345678@qq.com" already exists');
console.log('2. User with username "12345678" already exists');
console.log('3. Network connectivity issue');
console.log('4. Backend validation logic issue');
console.log('5. Database connection issue');

console.log('\n💡 Next steps:');
console.log('1. Check if user already exists in database');
console.log('2. Verify backend is running correctly');
console.log('3. Check network connectivity');
console.log('4. Review backend logs for more details'); 