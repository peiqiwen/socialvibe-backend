const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// Simulate the registration validation
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

// Test registration data
const testRegistrationData = () => {
  console.log('🧪 Testing registration validation...');
  
  const testCases = [
    {
      name: 'Valid data',
      data: {
        email: 'test@example.com',
        username: 'test_user_123',
        password: 'password123',
        displayName: 'Test User'
      }
    },
    {
      name: 'Username with hyphen (invalid)',
      data: {
        email: 'test@example.com',
        username: 'test-user',
        password: 'password123',
        displayName: 'Test User'
      }
    },
    {
      name: 'Username with @ symbol (invalid)',
      data: {
        email: 'test@example.com',
        username: 'test@user',
        password: 'password123',
        displayName: 'Test User'
      }
    },
    {
      name: 'Username too short',
      data: {
        email: 'test@example.com',
        username: 'ab',
        password: 'password123',
        displayName: 'Test User'
      }
    },
    {
      name: 'Invalid email',
      data: {
        email: 'invalid-email',
        username: 'test_user',
        password: 'password123',
        displayName: 'Test User'
      }
    },
    {
      name: 'Password too short',
      data: {
        email: 'test@example.com',
        username: 'test_user',
        password: '123',
        displayName: 'Test User'
      }
    },
    {
      name: 'Missing displayName',
      data: {
        email: 'test@example.com',
        username: 'test_user',
        password: 'password123'
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    console.log(`   Data: ${JSON.stringify(testCase.data)}`);
    
    // Create a mock request object
    const req = {
      body: testCase.data
    };
    
    // Create a mock response object
    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`   Status: ${code}`);
          console.log(`   Response: ${JSON.stringify(data, null, 4)}`);
        }
      })
    };
    
    // Run validation
    Promise.all(validateRegistration.map(validation => validation.run(req)))
      .then(() => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.log(`   ❌ Validation failed:`);
          errors.array().forEach(error => {
            console.log(`      - ${error.param}: ${error.msg}`);
          });
        } else {
          console.log(`   ✅ Validation passed`);
        }
      })
      .catch(error => {
        console.log(`   ❌ Validation error: ${error.message}`);
      });
  }
};

// Test with common frontend data
const testFrontendData = () => {
  console.log('\n🧪 Testing with common frontend registration data...');
  
  const frontendTestCases = [
    {
      name: 'iOS app registration',
      data: {
        email: 'ios_user@example.com',
        username: 'ios_user',
        password: 'password123',
        displayName: 'iOS User'
      }
    },
    {
      name: 'Username with spaces (invalid)',
      data: {
        email: 'user@example.com',
        username: 'user name',
        password: 'password123',
        displayName: 'User Name'
      }
    },
    {
      name: 'Username with dots (invalid)',
      data: {
        email: 'user@example.com',
        username: 'user.name',
        password: 'password123',
        displayName: 'User Name'
      }
    },
    {
      name: 'Username with Chinese characters (invalid)',
      data: {
        email: 'user@example.com',
        username: '用户名',
        password: 'password123',
        displayName: 'User Name'
      }
    }
  ];
  
  for (const testCase of frontendTestCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    console.log(`   Data: ${JSON.stringify(testCase.data)}`);
    
    const req = { body: testCase.data };
    
    Promise.all(validateRegistration.map(validation => validation.run(req)))
      .then(() => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.log(`   ❌ Validation failed:`);
          errors.array().forEach(error => {
            console.log(`      - ${error.param}: ${error.msg}`);
          });
        } else {
          console.log(`   ✅ Validation passed`);
        }
      })
      .catch(error => {
        console.log(`   ❌ Validation error: ${error.message}`);
      });
  }
};

// Main execution
const main = () => {
  testRegistrationData();
  testFrontendData();
  
  console.log('\n🏁 Registration validation testing completed');
  console.log('\n💡 Common validation rules:');
  console.log('   - Email: Must be a valid email format');
  console.log('   - Username: 3-30 characters, only letters, numbers, and underscores');
  console.log('   - Password: At least 6 characters');
  console.log('   - Display Name: 1-50 characters');
};

main(); 