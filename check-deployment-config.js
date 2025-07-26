#!/usr/bin/env node

console.log('🔍 Checking deployment configuration...\n');

// 检查必要的环境变量
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'MONGODB_URI',
  'JWT_SECRET'
];

let allConfigured = true;

console.log('📋 Environment Variables Check:');
console.log('================================');

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // 隐藏敏感信息
    const displayValue = varName.includes('KEY') || varName.includes('SECRET') 
      ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allConfigured = false;
  }
});

console.log('\n📊 Summary:');
console.log('===========');

if (allConfigured) {
  console.log('✅ All required environment variables are configured');
  console.log('🚀 Ready for deployment!');
} else {
  console.log('❌ Some environment variables are missing');
  console.log('\n🔧 To fix this:');
  console.log('1. Set the missing environment variables in your deployment platform');
  console.log('2. For Railway: Go to your project → Variables tab → Add variables');
  console.log('3. For Render: Go to your service → Environment → Add variables');
  console.log('4. For Heroku: Use "heroku config:set VARIABLE_NAME=value"');
}

console.log('\n🌐 Test your deployment:');
console.log('curl https://your-app-url/api/ai/health');

process.exit(allConfigured ? 0 : 1); 