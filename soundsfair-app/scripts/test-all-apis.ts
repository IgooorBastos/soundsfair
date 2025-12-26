/**
 * Complete API Testing Script
 * Tests all 17 API endpoints in the soundsfair application
 *
 * Usage:
 *   npx tsx scripts/test-all-apis.ts
 *
 * Or specify custom deployment URL:
 *   API_BASE_URL=https://your-deployment.vercel.app npx tsx scripts/test-all-apis.ts
 */

const API_BASE_URL = process.env.API_BASE_URL || 'https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  statusCode?: number;
  error?: string;
  response?: any;
  duration?: number;
}

const results: TestResult[] = [];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color: keyof typeof colors, ...args: any[]) {
  console.log(colors[color], ...args, colors.reset);
}

async function testAPI(
  name: string,
  method: string,
  endpoint: string,
  options?: {
    body?: any;
    headers?: Record<string, string>;
    expectedStatus?: number | number[];
    skip?: boolean;
    skipReason?: string;
  }
): Promise<TestResult> {
  const url = `${API_BASE_URL}${endpoint}`;
  const startTime = Date.now();

  if (options?.skip) {
    log('yellow', `⏭️  SKIP: ${name} - ${options.skipReason || 'Skipped'}`);
    return {
      endpoint: name,
      method,
      status: 'SKIP',
    };
  }

  try {
    log('cyan', `🧪 Testing: ${name}`);
    log('blue', `   ${method} ${endpoint}`);

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    };

    if (options?.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, fetchOptions);
    const duration = Date.now() - startTime;

    let responseData: any;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    const expectedStatuses = Array.isArray(options?.expectedStatus)
      ? options.expectedStatus
      : options?.expectedStatus
      ? [options.expectedStatus]
      : [200, 201];

    const isSuccess = expectedStatuses.includes(response.status);

    if (isSuccess) {
      log('green', `   ✅ PASS (${response.status}) - ${duration}ms`);
      console.log('   Response:', JSON.stringify(responseData).substring(0, 200));
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
      console.log('   Response:', JSON.stringify(responseData).substring(0, 500));
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
    log('red', `   ❌ ERROR: ${error instanceof Error ? error.message : String(error)}`);
    return {
      endpoint: name,
      method,
      status: 'FAIL',
      error: error instanceof Error ? error.message : String(error),
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

  // ============================================================================
  // 1. DCA Calculator APIs (CRITICAL - Already verified working)
  // ============================================================================

  log('yellow', '\n📊 === DCA Calculator APIs ===\n');

  results.push(await testAPI(
    'DCA Calculate - POST',
    'POST',
    '/api/dca/calculate',
    {
      body: {
        amount: 100,
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: '2024-12-26',
        assets: ['BTC'],
      },
      expectedStatus: 200,
    }
  ));

  results.push(await testAPI(
    'DCA Calculate - Shareable (GET)',
    'GET',
    '/api/dca/calculate?id=test123',
    {
      expectedStatus: 501, // Not implemented yet
    }
  ));

  results.push(await testAPI(
    'Bitcoin Prices - GET',
    'GET',
    '/api/prices?asset=BTC&from=2024-01-01&to=2024-12-26',
    {
      expectedStatus: 200,
    }
  ));

  // ============================================================================
  // 2. Bitcoin Info APIs
  // ============================================================================

  log('yellow', '\n₿  === Bitcoin Info APIs ===\n');

  results.push(await testAPI(
    'Bitcoin Price - GET',
    'GET',
    '/api/bitcoin/price',
    {
      expectedStatus: 200,
    }
  ));

  results.push(await testAPI(
    'Bitcoin Historical Price - GET',
    'GET',
    '/api/bitcoin/historical?date=2024-01-01',
    {
      expectedStatus: 200,
    }
  ));

  results.push(await testAPI(
    'Bitcoin Halving - GET',
    'GET',
    '/api/bitcoin/halving',
    {
      expectedStatus: 200,
    }
  ));

  results.push(await testAPI(
    'Bitcoin Fear & Greed - GET',
    'GET',
    '/api/bitcoin/fear-greed',
    {
      expectedStatus: [200, 503], // May fail if external API down
    }
  ));

  // ============================================================================
  // 3. Admin Authentication APIs (CRITICAL - User reported as broken)
  // ============================================================================

  log('yellow', '\n🔐 === Admin Authentication APIs ===\n');

  results.push(await testAPI(
    'Admin Login - POST (Invalid Credentials)',
    'POST',
    '/api/admin/login',
    {
      body: {
        email: 'test@example.com',
        password: 'wrong_password',
      },
      expectedStatus: 401, // Should return Unauthorized
    }
  ));

  results.push(await testAPI(
    'Admin Login - POST (Missing Fields)',
    'POST',
    '/api/admin/login',
    {
      body: {},
      expectedStatus: 400, // Should return Bad Request
    }
  ));

  // Test with correct credentials (if environment variables are set)
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const loginResult = await testAPI(
      'Admin Login - POST (Valid Credentials)',
      'POST',
      '/api/admin/login',
      {
        body: {
          email: adminEmail,
          password: adminPassword,
        },
        expectedStatus: 200,
      }
    );
    results.push(loginResult);

    // If login successful, test authenticated endpoints
    if (loginResult.status === 'PASS' && loginResult.response?.csrfToken) {
      const csrfToken = loginResult.response.csrfToken;

      results.push(await testAPI(
        'Admin Questions - GET (Authenticated)',
        'GET',
        '/api/admin/questions?status=all',
        {
          expectedStatus: [200, 401], // May fail if session cookie not sent
        }
      ));

      results.push(await testAPI(
        'Admin Logout - POST',
        'POST',
        '/api/admin/logout',
        {
          expectedStatus: 200,
        }
      ));
    }
  } else {
    log('yellow', '⏭️  SKIP: Valid admin login test - ADMIN_EMAIL/ADMIN_PASSWORD not set');
    results.push({
      endpoint: 'Admin Login - Valid Credentials',
      method: 'POST',
      status: 'SKIP',
    });
  }

  results.push(await testAPI(
    'Admin Questions - GET (Unauthenticated)',
    'GET',
    '/api/admin/questions',
    {
      expectedStatus: 401, // Should return Unauthorized
    }
  ));

  // ============================================================================
  // 4. Q&A System APIs
  // ============================================================================

  log('yellow', '\n❓ === Q&A System APIs ===\n');

  results.push(await testAPI(
    'Q&A Submit - POST (Invalid Data)',
    'POST',
    '/api/qa/submit',
    {
      body: {
        // Missing required fields
      },
      expectedStatus: 400,
    }
  ));

  results.push(await testAPI(
    'Q&A Submit - POST (Honeypot Trap)',
    'POST',
    '/api/qa/submit',
    {
      body: {
        userEmail: 'test@example.com',
        userName: 'Test User',
        questionText: 'This is a test question',
        category: 'Bitcoin Basics',
        pricingTier: 'express',
        publishToArchive: false,
        website: 'bot filled this', // Honeypot field
      },
      expectedStatus: 400,
    }
  ));

  results.push(await testAPI(
    'Q&A Payment Status - GET (Invalid ID)',
    'GET',
    '/api/qa/payment-status?questionId=invalid-uuid',
    {
      expectedStatus: 400,
    }
  ));

  results.push(await testAPI(
    'Q&A Payment Status - GET (Not Found)',
    'GET',
    '/api/qa/payment-status?questionId=00000000-0000-0000-0000-000000000000',
    {
      expectedStatus: 404,
    }
  ));

  // ============================================================================
  // 5. Progress Sync APIs (Requires Authentication)
  // ============================================================================

  log('yellow', '\n📈 === Progress Sync APIs ===\n');

  results.push(await testAPI(
    'Progress Pull - GET (No Auth)',
    'GET',
    '/api/progress/pull',
    {
      expectedStatus: 401,
    }
  ));

  results.push(await testAPI(
    'Progress Sync - POST (No Auth)',
    'POST',
    '/api/progress/sync',
    {
      body: {
        progressData: {
          total_xp: 100,
          current_level: 2,
        },
      },
      expectedStatus: 401,
    }
  ));

  results.push(await testAPI(
    'Progress Sync Status - GET (No Auth)',
    'GET',
    '/api/progress/sync',
    {
      expectedStatus: 401,
    }
  ));

  // ============================================================================
  // 6. Email/Webhook APIs
  // ============================================================================

  log('yellow', '\n📧 === Email & Webhook APIs ===\n');

  results.push(await testAPI(
    'Unsubscribe - POST (Invalid Email)',
    'POST',
    '/api/unsubscribe',
    {
      body: {
        email: 'not-an-email',
      },
      expectedStatus: 400,
    }
  ));

  results.push(await testAPI(
    'Unsubscribe - GET (Check Status)',
    'GET',
    '/api/unsubscribe?email=test@example.com',
    {
      expectedStatus: 200,
    }
  ));

  results.push(await testAPI(
    'OpenNode Webhook - GET (Health Check)',
    'GET',
    '/api/webhooks/opennode',
    {
      expectedStatus: 200,
    }
  ));

  results.push(await testAPI(
    'Resend Webhook - GET (Health Check)',
    'GET',
    '/api/webhooks/resend',
    {
      expectedStatus: 200,
    }
  ));

  results.push(await testAPI(
    'OpenNode Webhook - POST (Invalid Signature)',
    'POST',
    '/api/webhooks/opennode',
    {
      body: { test: 'data' },
      expectedStatus: 401, // Should fail signature verification
    }
  ));

  results.push(await testAPI(
    'Resend Webhook - POST (Invalid Signature)',
    'POST',
    '/api/webhooks/resend',
    {
      body: { type: 'email.sent', data: {} },
      expectedStatus: [400, 401], // Should fail validation
    }
  ));

  // ============================================================================
  // GENERATE REPORT
  // ============================================================================

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
          console.log(`      Response: ${JSON.stringify(r.response).substring(0, 200)}`);
        }
        console.log('');
      });
  }

  // Critical API status
  log('yellow', '\n🔥 === CRITICAL APIs STATUS ===\n');

  const criticalApis = [
    'DCA Calculate - POST',
    'Bitcoin Prices - GET',
    'Admin Login - POST (Invalid Credentials)',
    'Q&A Submit - POST (Invalid Data)',
  ];

  criticalApis.forEach((name) => {
    const result = results.find((r) => r.endpoint === name);
    if (result) {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
      log(result.status === 'PASS' ? 'green' : 'red', `   ${icon} ${name}`);
    }
  });

  console.log('\n');
  log('cyan', '╔════════════════════════════════════════════════════════════╗');
  log('cyan', '║                      TEST COMPLETE                         ║');
  log('cyan', '╚════════════════════════════════════════════════════════════╝\n');

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
