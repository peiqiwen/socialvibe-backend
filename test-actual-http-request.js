const https = require('https');
const http = require('http');

// Test actual HTTP request to the backend
const testActualRequest = async () => {
  console.log('🧪 Testing actual HTTP request to backend...');
  
  const testData = {
    email: '12345678@qq.com',
    username: '12345678',
    password: '12345678',
    displayName: '12345678'
  };
  
  const postData = JSON.stringify(testData);
  
  const options = {
    hostname: 'socialvibe-backend-production-1a85.up.railway.app',
    port: 443,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  console.log(`📋 Request details:`);
  console.log(`   URL: https://${options.hostname}${options.path}`);
  console.log(`   Method: ${options.method}`);
  console.log(`   Headers: ${JSON.stringify(options.headers)}`);
  console.log(`   Data: ${postData}`);
  
  const req = https.request(options, (res) => {
    console.log(`\n📋 Response:`);
    console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
    console.log(`   Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`   Body: ${data}`);
      
      try {
        const responseObj = JSON.parse(data);
        console.log(`   Parsed response: ${JSON.stringify(responseObj, null, 2)}`);
      } catch (error) {
        console.log(`   Could not parse response as JSON: ${error.message}`);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error(`❌ Request error: ${error.message}`);
  });
  
  req.write(postData);
  req.end();
};

// Test with different data
const testWithDifferentData = async () => {
  console.log('\n🧪 Testing with different data...');
  
  const testCases = [
    {
      name: 'Valid data with letters',
      data: {
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'password123',
        displayName: 'Test User'
      }
    },
    {
      name: 'Valid data with numbers',
      data: {
        email: 'user123@example.com',
        username: 'user123',
        password: 'password123',
        displayName: 'User 123'
      }
    },
    {
      name: 'Original failing data',
      data: {
        email: '12345678@qq.com',
        username: '12345678',
        password: '12345678',
        displayName: '12345678'
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    console.log(`   Data: ${JSON.stringify(testCase.data)}`);
    
    const postData = JSON.stringify(testCase.data);
    
    const options = {
      hostname: 'socialvibe-backend-production-1a85.up.railway.app',
      port: 443,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   Response: ${data}`);
      });
    });
    
    req.on('error', (error) => {
      console.error(`   Error: ${error.message}`);
    });
    
    req.write(postData);
    req.end();
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

// Main execution
const main = async () => {
  await testActualRequest();
  await testWithDifferentData();
  
  console.log('\n🏁 HTTP request testing completed');
};

main().catch(error => {
  console.error('❌ Script failed:', error);
}); 