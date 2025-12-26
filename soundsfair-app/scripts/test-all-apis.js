/**
 * Complete API Testing Script (Pure JavaScript - No TypeScript)
 * Tests all 17 API endpoints in the soundsfair application
 *
 * Usage:
 *   node scripts/test-all-apis.js
 */

const API_BASE_URL = process.env.API_BASE_URL || 'https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app';

const results = [];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(colors[color], ...args.join(' '), colors.reset);
}

async function testAPI(name, method, endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const startTime = Date.now();

  if (options.skip) {
    log('yellow', `⏭️  SKIP: ${name} - ${options.skipReason || 'Skipped'}`);
    return { endpoint: name, method, status: 'SKIP' };
  }

  try {
    log('cyan', `🧪 Testing: ${name}`);
    log('blue', `   ${method} ${endpoint}`);

    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, fetchOptions);
    const duration = Date.now() - startTime;

    let responseData;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    const expectedStatuses = Array.isArray(options.expectedStatus)
      ? options.expectedStatus
      : options.expectedStatus
      ? [options.expectedStatus]
      : [200, 201];

    const isSuccess = expectedStatuses.includes(response.status);

    if (isSuccess) {
      log('green', `   ✅ PASS (${response.status}) - ${duration}ms`);
      const preview = typeof responseData === 'string'
        ? responseData.substring(0, 200)
        : JSON.stringify(responseData).substring(0, 200);
      console.log('   Response:', preview);
      return {
        endpoint: name,
        method,
        status: 'PASS',
        statusCode: response.status,
        response: responseData,
        duration,
      };
    } else {
      log('red', `   ❌ FAIL (${response.status}) - Expected ${expectedStatuses.join(' or ')}`);
      const preview = typeof responseData === 'string'
        ? responseData.substring(0, 500)
        : JSON.stringify(responseData).substring(0, 500);
      console.log('   Response:', preview);
      return {
        endpoint: name,
        method,
        status: 'FAIL',
        statusCode: response.status,
        error: `Expected ${expectedStatuses.join(' or ')}, got ${response.status}`,
        response: responseData,
        duration,
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    log('red', `   ❌ ERROR: ${error.message}`);
    return {
      endpoint: name,
      method,
      status: 'FAIL',
      error: error.message,
      duration,
    };
  }
}

async function runTests() {
  console.clear();
  log('cyan', '\n╔════════════════════════════════════════════════════════════╗');
  log('cyan', '║    SoundsFair - Complete API Test Suite                   ║');
  log('cyan', '╚════════════════════════════════════════════════════════════╝\n');
  log('blue', `🌐 Testing deployment: ${API_BASE_URL}\n`);

  // DCA Calculator APIs
  log('yellow', '\n📊 === DCA Calculator APIs ===\n');

  results.push(await testAPI('DCA Calculate - POST', 'POST', '/api/dca/calculate', {
    body: {
      amount: 100,
      frequency: 'monthly',
      startDate: '2024-01-01',
      endDate: '2024-12-26',
      assets: ['BTC'],
    },
    expectedStatus: 200,
  }));

  results.push(await testAPI('Bitcoin Prices - GET', 'GET', '/api/prices?asset=BTC&from=2024-01-01&to=2024-12-26', {
    expectedStatus: 200,
  }));

  // Bitcoin Info APIs
  log('yellow', '\n₿  === Bitcoin Info APIs ===\n');

  results.push(await testAPI('Bitcoin Price - GET', 'GET', '/api/bitcoin/price', {
    expectedStatus: 200,
  }));

  results.push(await testAPI('Bitcoin Historical - GET', 'GET', '/api/bitcoin/historical?date=2024-01-01', {
    expectedStatus: 200,
  }));

  results.push(await testAPI('Bitcoin Halving - GET', 'GET', '/api/bitcoin/halving', {
    expectedStatus: 200,
  }));

  results.push(await testAPI('Bitcoin Fear & Greed - GET', 'GET', '/api/bitcoin/fear-greed', {
    expectedStatus: [200, 503],
  }));

  // Admin Authentication APIs
  log('yellow', '\n🔐 === Admin Authentication APIs ===\n');

  results.push(await testAPI('Admin Login - Invalid Credentials', 'POST', '/api/admin/login', {
    body: { email: 'test@example.com', password: 'wrong_password' },
    expectedStatus: 401,
  }));

  results.push(await testAPI('Admin Login - Missing Fields', 'POST', '/api/admin/login', {
    body: {},
    expectedStatus: 400,
  }));

  results.push(await testAPI('Admin Questions - Unauthenticated', 'GET', '/api/admin/questions', {
    expectedStatus: 401,
  }));

  // Q&A System APIs
  log('yellow', '\n❓ === Q&A System APIs ===\n');

  results.push(await testAPI('Q&A Submit - Invalid Data', 'POST', '/api/qa/submit', {
    body: {},
    expectedStatus: 400,
  }));

  results.push(await testAPI('Q&A Payment Status - Invalid UUID', 'GET', '/api/qa/payment-status?questionId=invalid', {
    expectedStatus: 400,
  }));

  // Progress Sync APIs
  log('yellow', '\n📈 === Progress Sync APIs ===\n');

  results.push(await testAPI('Progress Pull - No Auth', 'GET', '/api/progress/pull', {
    expectedStatus: 401,
  }));

  results.push(await testAPI('Progress Sync - No Auth', 'POST', '/api/progress/sync', {
    body: { progressData: { total_xp: 100 } },
    expectedStatus: 401,
  }));

  // Email & Webhook APIs
  log('yellow', '\n📧 === Email & Webhook APIs ===\n');

  results.push(await testAPI('Unsubscribe - Invalid Email', 'POST', '/api/unsubscribe', {
    body: { email: 'not-an-email' },
    expectedStatus: 400,
  }));

  results.push(await testAPI('Unsubscribe - Check Status', 'GET', '/api/unsubscribe?email=test@example.com', {
    expectedStatus: 200,
  }));

  results.push(await testAPI('OpenNode Webhook - Health Check', 'GET', '/api/webhooks/opennode', {
    expectedStatus: 200,
  }));

  results.push(await testAPI('Resend Webhook - Health Check', 'GET', '/api/webhooks/resend', {
    expectedStatus: 200,
  }));

  // GENERATE REPORT
  console.log('\n\n');
  log('cyan', '╔════════════════════════════════════════════════════════════╗');
  log('cyan', '║                    TEST RESULTS SUMMARY                    ║');
  log('cyan', '╚════════════════════════════════════════════════════════════╝\n');

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const skipped = results.filter((r) => r.status === 'SKIP').length;
  const total = results.length;

  log('green', `✅ PASSED:  ${passed}/${total}`);
  log('red', `❌ FAILED:  ${failed}/${total}`);
  log('yellow', `⏭️  SKIPPED: ${skipped}/${total}`);

  const passRate = ((passed / (total - skipped)) * 100).toFixed(1);
  log('cyan', `\n📊 Success Rate: ${passRate}%\n`);

  // Detailed failures
  if (failed > 0) {
    log('red', '\n❌ === FAILED TESTS ===\n');
    results
      .filter((r) => r.status === 'FAIL')
      .forEach((r) => {
        log('red', `   ${r.endpoint} (${r.method})`);
        console.log(`      Status: ${r.statusCode || 'N/A'}`);
        console.log(`      Error: ${r.error || 'Unknown'}`);
        if (r.response) {
          const preview = typeof r.response === 'string'
            ? r.response.substring(0, 200)
            : JSON.stringify(r.response).substring(0, 200);
          console.log(`      Response: ${preview}`);
        }
        console.log('');
      });
  }

  // Critical API status
  log('yellow', '\n🔥 === CRITICAL APIs STATUS ===\n');

  const criticalApis = [
    'DCA Calculate - POST',
    'Bitcoin Prices - GET',
    'Admin Login - Invalid Credentials',
    'Q&A Submit - Invalid Data',
  ];

  criticalApis.forEach((name) => {
    const result = results.find((r) => r.endpoint === name);
    if (result) {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
      const color = result.status === 'PASS' ? 'green' : 'red';
      log(color, `   ${icon} ${name}`);
    }
  });

  console.log('\n');
  log('cyan', '╔════════════════════════════════════════════════════════════╗');
  log('cyan', '║                      TEST COMPLETE                         ║');
  log('cyan', '╚════════════════════════════════════════════════════════════╝\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
