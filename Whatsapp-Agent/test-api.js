/**
 * WhatsApp Agent - API Test Script
 * 
 * This script tests all API endpoints
 * Make sure the WhatsApp Agent is running before executing this script
 */

const BASE_URL = 'http://localhost:3000';
const TEST_NUMBER = '1234567890'; // ⚠️ REPLACE WITH YOUR TEST NUMBER

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function section(message) {
  console.log('\n' + '='.repeat(60));
  log(message, 'cyan');
  console.log('='.repeat(60) + '\n');
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testEndpoint(name, url, options = {}) {
  try {
    info(`Testing: ${name}`);
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      success(`${name} - SUCCESS`);
      console.log('Response:', JSON.stringify(data, null, 2));
      return { success: true, data };
    } else {
      error(`${name} - FAILED (${response.status})`);
      console.log('Error:', JSON.stringify(data, null, 2));
      return { success: false, error: data };
    }
  } catch (err) {
    error(`${name} - ERROR`);
    console.log('Exception:', err.message);
    return { success: false, error: err.message };
  }
}

async function runTests() {
  log('\n🚀 WhatsApp Agent - API Test Suite\n', 'cyan');
  log(`Base URL: ${BASE_URL}`, 'yellow');
  log(`Test Number: ${TEST_NUMBER}`, 'yellow');
  log('\n⚠️  Make sure to replace TEST_NUMBER with a real WhatsApp number!\n', 'yellow');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };

  // Test 1: Health Check
  section('1️⃣  Health Check');
  let result = await testEndpoint('Health Check', `${BASE_URL}/health`);
  results.total++;
  if (result.success) results.passed++;
  else results.failed++;
  await delay(1000);

  // Test 2: Status Check
  section('2️⃣  Status Check');
  result = await testEndpoint('Status Check', `${BASE_URL}/status`);
  results.total++;
  if (result.success) results.passed++;
  else results.failed++;
  
  if (!result.data?.ready) {
    error('⚠️  WhatsApp is not ready! Please scan QR code first.');
    error('Run "npm start" in another terminal to start the agent.');
    return;
  }
  
  await delay(1000);

  // Test 3: Check if number exists
  section('3️⃣  Check if Number is Registered');
  result = await testEndpoint(
    'Check Number',
    `${BASE_URL}/check/${TEST_NUMBER}`
  );
  results.total++;
  if (result.success) results.passed++;
  else results.failed++;
  
  if (!result.data?.isRegistered) {
    error(`⚠️  ${TEST_NUMBER} is not registered on WhatsApp!`);
    error('Please use a valid WhatsApp number for testing.');
  }
  
  await delay(1000);

  // Test 4: Send Text Message
  section('4️⃣  Send Text Message');
  result = await testEndpoint(
    'Send Message',
    `${BASE_URL}/send/message`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: TEST_NUMBER,
        message: '🧪 Test message from WhatsApp Agent API!\n\nThis is an automated test.'
      })
    }
  );
  results.total++;
  if (result.success) results.passed++;
  else results.failed++;
  await delay(2000);

  // Test 5: Send Image from URL
  section('5️⃣  Send Image from URL');
  result = await testEndpoint(
    'Send Image from URL',
    `${BASE_URL}/send/image-url`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: TEST_NUMBER,
        url: 'https://picsum.photos/800/600',
        caption: '🖼️ Test image from URL (via Lorem Picsum)'
      })
    }
  );
  results.total++;
  if (result.success) results.passed++;
  else results.failed++;
  await delay(2000);

  // Test 6: Send Location
  section('6️⃣  Send Location');
  result = await testEndpoint(
    'Send Location',
    `${BASE_URL}/send/location`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: TEST_NUMBER,
        latitude: 28.6139,
        longitude: 77.2090,
        description: '📍 New Delhi, India (Test Location)'
      })
    }
  );
  results.total++;
  if (result.success) results.passed++;
  else results.failed++;
  await delay(2000);

  // Test 7: Get Chats
  section('7️⃣  Get All Chats');
  result = await testEndpoint('Get Chats', `${BASE_URL}/chats`);
  results.total++;
  if (result.success) {
    results.passed++;
    info(`Found ${result.data.chats?.length || 0} chats`);
  } else {
    results.failed++;
  }
  await delay(1000);

  // Test 8: Get Contacts
  section('8️⃣  Get All Contacts');
  result = await testEndpoint('Get Contacts', `${BASE_URL}/contacts`);
  results.total++;
  if (result.success) {
    results.passed++;
    info(`Found ${result.data.contacts?.length || 0} contacts`);
  } else {
    results.failed++;
  }
  await delay(1000);

  // Test 9: Get Profile Picture
  section('9️⃣  Get Profile Picture');
  result = await testEndpoint(
    'Get Profile Picture',
    `${BASE_URL}/profile/${TEST_NUMBER}`
  );
  results.total++;
  if (result.success) results.passed++;
  else results.failed++;
  await delay(1000);

  // Test 10: Broadcast (to single number for testing)
  section('🔟 Broadcast Message (Single Number Test)');
  result = await testEndpoint(
    'Broadcast Message',
    `${BASE_URL}/broadcast/message`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumbers: [TEST_NUMBER],
        message: '📢 Test broadcast message!\n\nThis is a broadcast test with single recipient.',
        delay: 2000
      })
    }
  );
  results.total++;
  if (result.success) {
    results.passed++;
    info(`Broadcast: ${result.data.successful}/${result.data.total} successful`);
  } else {
    results.failed++;
  }
  await delay(2000);

  // Test Summary
  section('📊 Test Summary');
  log(`Total Tests: ${results.total}`, 'cyan');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  
  const passRate = ((results.passed / results.total) * 100).toFixed(1);
  log(`\nPass Rate: ${passRate}%`, passRate === '100.0' ? 'green' : 'yellow');
  
  if (passRate === '100.0') {
    log('\n🎉 All tests passed! Your WhatsApp Agent is working perfectly!\n', 'green');
  } else {
    log('\n⚠️  Some tests failed. Check the output above for details.\n', 'yellow');
  }
  
  log('💡 Tip: Check your WhatsApp to see the messages that were sent!\n', 'cyan');
}

// Run the tests
console.clear();
runTests().catch(err => {
  error('Test suite failed with error:');
  console.error(err);
  process.exit(1);
});

