/**
 * Integration Testing Script
 * Tests Supabase, OpenNode, and Resend integrations
 *
 * Usage: node scripts/test-integrations.js
 */

const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

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

// Simple fetch polyfill for Node.js
function simpleFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          statusText: res.statusMessage,
          json: async () => JSON.parse(data),
          text: async () => data,
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }

    req.end();
  });
}

const results = {
  supabase: [],
  opennode: [],
  resend: [],
};

// ============================================================================
// SUPABASE TESTS
// ============================================================================

async function testSupabase() {
  log('cyan', '\n╔════════════════════════════════════════╗');
  log('cyan', '║    1️⃣  TESTING SUPABASE INTEGRATION   ║');
  log('cyan', '╚════════════════════════════════════════╝\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Test 1: Check environment variables
  log('blue', '📝 Test 1: Environment Variables');
  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    log('red', '   ❌ FAIL: Missing Supabase environment variables');
    results.supabase.push({ test: 'Environment Variables', status: 'FAIL' });
    return;
  }
  log('green', `   ✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`);
  log('green', `   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey.substring(0, 50)}...`);
  log('green', `   ✅ SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey.substring(0, 50)}...`);
  results.supabase.push({ test: 'Environment Variables', status: 'PASS' });

  // Test 2: Connection test (REST API)
  log('blue', '\n📝 Test 2: Supabase Connection (REST API)');
  try {
    const response = await simpleFetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
    });

    if (response.ok) {
      log('green', '   ✅ PASS: Successfully connected to Supabase REST API');
      results.supabase.push({ test: 'Connection', status: 'PASS' });
    } else {
      log('red', `   ❌ FAIL: Connection failed (${response.status} ${response.statusText})`);
      results.supabase.push({ test: 'Connection', status: 'FAIL', error: response.statusText });
    }
  } catch (error) {
    log('red', `   ❌ ERROR: ${error.message}`);
    results.supabase.push({ test: 'Connection', status: 'ERROR', error: error.message });
  }

  // Test 3: List tables
  log('blue', '\n📝 Test 3: Database Tables');
  try {
    const response = await simpleFetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
    });

    const data = await response.json();

    const expectedTables = [
      'admin_users',
      'questions',
      'payments',
      'user_progress',
      'lesson_progress',
      'quiz_results',
      'email_preferences',
      'email_logs',
    ];

    log('yellow', `   Expected tables: ${expectedTables.length}`);

    // Try to query each table
    let tablesFound = 0;
    for (const table of expectedTables) {
      try {
        const tableResponse = await simpleFetch(
          `${supabaseUrl}/rest/v1/${table}?select=*&limit=0`,
          {
            headers: {
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`,
            },
          }
        );

        if (tableResponse.ok) {
          log('green', `   ✅ ${table}`);
          tablesFound++;
        } else {
          log('red', `   ❌ ${table} (${tableResponse.status})`);
        }
      } catch (err) {
        log('red', `   ❌ ${table} (error: ${err.message})`);
      }
    }

    if (tablesFound === expectedTables.length) {
      log('green', `\n   ✅ PASS: All ${expectedTables.length} tables found`);
      results.supabase.push({ test: 'Database Tables', status: 'PASS', tablesFound });
    } else {
      log('yellow', `\n   ⚠️  WARNING: Only ${tablesFound}/${expectedTables.length} tables found`);
      results.supabase.push({ test: 'Database Tables', status: 'PARTIAL', tablesFound });
    }
  } catch (error) {
    log('red', `   ❌ ERROR: ${error.message}`);
    results.supabase.push({ test: 'Database Tables', status: 'ERROR', error: error.message });
  }

  // Test 4: Test admin_users table
  log('blue', '\n📝 Test 4: Admin Users Table');
  try {
    const response = await simpleFetch(
      `${supabaseUrl}/rest/v1/admin_users?select=email,role,created_at`,
      {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      log('green', `   ✅ PASS: admin_users table accessible`);
      log('yellow', `   Found ${data.length} admin user(s)`);

      if (data.length > 0) {
        data.forEach((user, i) => {
          log('cyan', `   ${i + 1}. ${user.email} (${user.role})`);
        });
      } else {
        log('yellow', '   ⚠️  WARNING: No admin users found in database');
      }

      results.supabase.push({ test: 'Admin Users', status: 'PASS', count: data.length });
    } else {
      log('red', `   ❌ FAIL: ${response.status} ${response.statusText}`);
      results.supabase.push({ test: 'Admin Users', status: 'FAIL' });
    }
  } catch (error) {
    log('red', `   ❌ ERROR: ${error.message}`);
    results.supabase.push({ test: 'Admin Users', status: 'ERROR', error: error.message });
  }
}

// ============================================================================
// OPENNODE TESTS
// ============================================================================

async function testOpenNode() {
  log('cyan', '\n╔════════════════════════════════════════╗');
  log('cyan', '║    2️⃣  TESTING OPENNODE INTEGRATION   ║');
  log('cyan', '╚════════════════════════════════════════╝\n');

  const apiKey = process.env.OPENNODE_API_KEY;

  // Test 1: Check environment variable
  log('blue', '📝 Test 1: API Key Configuration');
  if (!apiKey) {
    log('red', '   ❌ FAIL: OPENNODE_API_KEY not configured');
    results.opennode.push({ test: 'API Key', status: 'FAIL' });
    return;
  }
  log('green', `   ✅ OPENNODE_API_KEY: ${apiKey.substring(0, 20)}...`);
  results.opennode.push({ test: 'API Key', status: 'PASS' });

  // Test 2: Test API connection
  log('blue', '\n📝 Test 2: OpenNode API Connection');
  try {
    const response = await simpleFetch('https://dev-api.opennode.com/v1/account/balance', {
      headers: {
        'Authorization': apiKey,
      },
    });

    if (response.ok) {
      const data = await response.json();
      log('green', '   ✅ PASS: Successfully connected to OpenNode API');
      log('cyan', `   Account Balance: ${JSON.stringify(data.data, null, 2)}`);
      results.opennode.push({ test: 'API Connection', status: 'PASS', balance: data.data });
    } else {
      const errorText = await response.text();
      log('red', `   ❌ FAIL: ${response.status} ${response.statusText}`);
      log('red', `   Error: ${errorText}`);
      results.opennode.push({ test: 'API Connection', status: 'FAIL', error: errorText });
    }
  } catch (error) {
    log('red', `   ❌ ERROR: ${error.message}`);
    results.opennode.push({ test: 'API Connection', status: 'ERROR', error: error.message });
  }

  // Test 3: List recent charges
  log('blue', '\n📝 Test 3: Recent Charges');
  try {
    const response = await simpleFetch('https://dev-api.opennode.com/v1/charges', {
      headers: {
        'Authorization': apiKey,
      },
    });

    if (response.ok) {
      const data = await response.json();
      log('green', '   ✅ PASS: Successfully retrieved charges');
      log('yellow', `   Total charges: ${data.data?.length || 0}`);

      if (data.data && data.data.length > 0) {
        log('cyan', '   Recent charges:');
        data.data.slice(0, 3).forEach((charge, i) => {
          log('cyan', `   ${i + 1}. ${charge.id} - ${charge.status} - ${charge.amount} sats`);
        });
      }

      results.opennode.push({ test: 'Recent Charges', status: 'PASS', count: data.data?.length || 0 });
    } else {
      log('yellow', `   ⚠️  WARNING: ${response.status} ${response.statusText}`);
      results.opennode.push({ test: 'Recent Charges', status: 'WARNING' });
    }
  } catch (error) {
    log('red', `   ❌ ERROR: ${error.message}`);
    results.opennode.push({ test: 'Recent Charges', status: 'ERROR', error: error.message });
  }
}

// ============================================================================
// RESEND TESTS
// ============================================================================

async function testResend() {
  log('cyan', '\n╔════════════════════════════════════════╗');
  log('cyan', '║    3️⃣  TESTING RESEND INTEGRATION     ║');
  log('cyan', '╚════════════════════════════════════════╝\n');

  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  // Test 1: Check environment variables
  log('blue', '📝 Test 1: API Key Configuration');
  if (!apiKey) {
    log('red', '   ❌ FAIL: RESEND_API_KEY not configured');
    results.resend.push({ test: 'API Key', status: 'FAIL' });
    return;
  }
  log('green', `   ✅ RESEND_API_KEY: ${apiKey.substring(0, 20)}...`);
  log('green', `   ✅ ADMIN_EMAIL: ${adminEmail}`);
  results.resend.push({ test: 'API Key', status: 'PASS' });

  // Test 2: Verify API key
  log('blue', '\n📝 Test 2: Resend API Connection');
  try {
    const response = await simpleFetch('https://api.resend.com/api-keys', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      log('green', '   ✅ PASS: Successfully connected to Resend API');
      log('cyan', `   API Keys found: ${data.data?.length || 0}`);
      results.resend.push({ test: 'API Connection', status: 'PASS' });
    } else {
      const errorText = await response.text();
      log('red', `   ❌ FAIL: ${response.status} ${response.statusText}`);
      log('red', `   Error: ${errorText}`);
      results.resend.push({ test: 'API Connection', status: 'FAIL', error: errorText });
    }
  } catch (error) {
    log('red', `   ❌ ERROR: ${error.message}`);
    results.resend.push({ test: 'API Connection', status: 'ERROR', error: error.message });
  }

  // Test 3: List domains
  log('blue', '\n📝 Test 3: Email Domains');
  try {
    const response = await simpleFetch('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      log('green', '   ✅ PASS: Successfully retrieved domains');
      log('yellow', `   Domains configured: ${data.data?.length || 0}`);

      if (data.data && data.data.length > 0) {
        data.data.forEach((domain, i) => {
          log('cyan', `   ${i + 1}. ${domain.name} - ${domain.status}`);
        });
      } else {
        log('yellow', '   ⚠️  WARNING: No domains configured (using default onboarding@resend.dev)');
      }

      results.resend.push({ test: 'Email Domains', status: 'PASS', count: data.data?.length || 0 });
    } else {
      log('yellow', `   ⚠️  WARNING: ${response.status} ${response.statusText}`);
      results.resend.push({ test: 'Email Domains', status: 'WARNING' });
    }
  } catch (error) {
    log('red', `   ❌ ERROR: ${error.message}`);
    results.resend.push({ test: 'Email Domains', status: 'ERROR', error: error.message });
  }

  // Test 4: List recent emails (last 10)
  log('blue', '\n📝 Test 4: Recent Emails');
  try {
    const response = await simpleFetch('https://api.resend.com/emails?limit=10', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      log('green', '   ✅ PASS: Successfully retrieved emails');
      log('yellow', `   Recent emails: ${data.data?.length || 0}`);

      if (data.data && data.data.length > 0) {
        log('cyan', '   Latest emails:');
        data.data.slice(0, 5).forEach((email, i) => {
          log('cyan', `   ${i + 1}. ${email.to} - ${email.subject || 'No subject'} - ${email.last_event || 'pending'}`);
        });
      }

      results.resend.push({ test: 'Recent Emails', status: 'PASS', count: data.data?.length || 0 });
    } else {
      log('yellow', `   ⚠️  WARNING: ${response.status} ${response.statusText}`);
      results.resend.push({ test: 'Recent Emails', status: 'WARNING' });
    }
  } catch (error) {
    log('red', `   ❌ ERROR: ${error.message}`);
    results.resend.push({ test: 'Recent Emails', status: 'ERROR', error: error.message });
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function runTests() {
  console.clear();
  log('cyan', '\n╔════════════════════════════════════════════════════════════╗');
  log('cyan', '║    SoundsFair - Integration Testing Suite                 ║');
  log('cyan', '╚════════════════════════════════════════════════════════════╝\n');

  await testSupabase();
  await testOpenNode();
  await testResend();

  // Summary
  log('cyan', '\n╔════════════════════════════════════════════════════════════╗');
  log('cyan', '║                    SUMMARY                                 ║');
  log('cyan', '╚════════════════════════════════════════════════════════════╝\n');

  function countResults(arr) {
    const pass = arr.filter(r => r.status === 'PASS').length;
    const fail = arr.filter(r => r.status === 'FAIL').length;
    const error = arr.filter(r => r.status === 'ERROR').length;
    const warning = arr.filter(r => r.status === 'WARNING').length;
    const partial = arr.filter(r => r.status === 'PARTIAL').length;
    return { pass, fail, error, warning, partial, total: arr.length };
  }

  const supabaseStats = countResults(results.supabase);
  const opennodeStats = countResults(results.opennode);
  const resendStats = countResults(results.resend);

  log('blue', '1️⃣  SUPABASE:');
  log('green', `   ✅ PASS: ${supabaseStats.pass}/${supabaseStats.total}`);
  if (supabaseStats.fail > 0) log('red', `   ❌ FAIL: ${supabaseStats.fail}`);
  if (supabaseStats.error > 0) log('red', `   💥 ERROR: ${supabaseStats.error}`);
  if (supabaseStats.warning > 0) log('yellow', `   ⚠️  WARNING: ${supabaseStats.warning}`);
  if (supabaseStats.partial > 0) log('yellow', `   🔶 PARTIAL: ${supabaseStats.partial}`);

  log('blue', '\n2️⃣  OPENNODE:');
  log('green', `   ✅ PASS: ${opennodeStats.pass}/${opennodeStats.total}`);
  if (opennodeStats.fail > 0) log('red', `   ❌ FAIL: ${opennodeStats.fail}`);
  if (opennodeStats.error > 0) log('red', `   💥 ERROR: ${opennodeStats.error}`);
  if (opennodeStats.warning > 0) log('yellow', `   ⚠️  WARNING: ${opennodeStats.warning}`);

  log('blue', '\n3️⃣  RESEND:');
  log('green', `   ✅ PASS: ${resendStats.pass}/${resendStats.total}`);
  if (resendStats.fail > 0) log('red', `   ❌ FAIL: ${resendStats.fail}`);
  if (resendStats.error > 0) log('red', `   💥 ERROR: ${resendStats.error}`);
  if (resendStats.warning > 0) log('yellow', `   ⚠️  WARNING: ${resendStats.warning}`);

  const totalPass = supabaseStats.pass + opennodeStats.pass + resendStats.pass;
  const totalTests = supabaseStats.total + opennodeStats.total + resendStats.total;
  const successRate = ((totalPass / totalTests) * 100).toFixed(1);

  log('cyan', `\n📊 Overall Success Rate: ${successRate}% (${totalPass}/${totalTests} tests passing)\n`);

  const hasFailures = supabaseStats.fail > 0 || supabaseStats.error > 0 ||
                      opennodeStats.fail > 0 || opennodeStats.error > 0 ||
                      resendStats.fail > 0 || resendStats.error > 0;

  process.exit(hasFailures ? 1 : 0);
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
