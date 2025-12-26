/**
 * Supabase Connection Test Script
 *
 * Run this to verify your Supabase configuration is working correctly.
 *
 * Usage: npx tsx scripts/test-supabase.ts
 */

// Load environment variables from .env.local
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { supabase } from '../lib/supabase';
import { supabaseAdmin } from '../lib/supabase-admin';

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  console.log('=' .repeat(60));

  let hasErrors = false;

  // Test 1: Fetch pricing tiers (public data)
  console.log('\n📊 Test 1: Fetching pricing tiers...');
  try {
    const { data: tiers, error: tiersError } = await supabase
      .from('pricing_tiers')
      .select('*')
      .order('display_order');

    if (tiersError) {
      console.error('❌ Error fetching tiers:', tiersError.message);
      hasErrors = true;
    } else if (!tiers || tiers.length === 0) {
      console.error('❌ No pricing tiers found in database');
      hasErrors = true;
    } else {
      console.log('✅ Pricing tiers:', tiers.length, 'found');
      tiers.forEach(tier => {
        console.log(`   💰 ${tier.name}: ${tier.amount_sats} sats (${tier.response_time_hours}h)`);
      });
    }
  } catch (error) {
    console.error('❌ Exception:', error);
    hasErrors = true;
  }

  // Test 2: Fetch categories
  console.log('\n📂 Test 2: Fetching question categories...');
  try {
    const { data: categories, error: catError } = await supabase
      .from('question_categories')
      .select('*')
      .order('display_order');

    if (catError) {
      console.error('❌ Error fetching categories:', catError.message);
      hasErrors = true;
    } else if (!categories || categories.length === 0) {
      console.error('❌ No categories found in database');
      hasErrors = true;
    } else {
      console.log('✅ Categories:', categories.length, 'found');
      categories.forEach(cat => {
        console.log(`   ${cat.icon} ${cat.name}: ${cat.description}`);
      });
    }
  } catch (error) {
    console.error('❌ Exception:', error);
    hasErrors = true;
  }

  // Test 3: Admin connection and stats
  console.log('\n📈 Test 3: Testing admin connection (get_question_stats)...');
  try {
    const { data: stats, error: statsError } = await supabaseAdmin
      .rpc('get_question_stats');

    if (statsError) {
      console.error('❌ Error getting stats:', statsError.message);
      console.log('   This might mean the function doesn\'t exist or admin key is wrong');
      hasErrors = true;
    } else if (!stats || stats.length === 0) {
      console.error('❌ No stats returned');
      hasErrors = true;
    } else {
      console.log('✅ Question stats retrieved:');
      const s = stats[0];
      console.log(`   Total questions: ${s.total_questions}`);
      console.log(`   Paid questions: ${s.paid_questions}`);
      console.log(`   Answered: ${s.answered_questions}`);
      console.log(`   In queue: ${s.in_queue}`);
      console.log(`   Revenue: ${s.total_revenue_sats} sats`);
      console.log(`   Avg response time: ${s.avg_response_time_hours.toFixed(1)}h`);
    }
  } catch (error) {
    console.error('❌ Exception:', error);
    hasErrors = true;
  }

  // Test 4: Check admin users
  console.log('\n👥 Test 4: Checking admin users...');
  try {
    const { data: admins, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('email, role, created_at');

    if (adminError) {
      console.error('❌ Error fetching admins:', adminError.message);
      hasErrors = true;
    } else if (!admins || admins.length === 0) {
      console.warn('⚠️  No admin users found!');
      console.log('   You need to create at least one admin user.');
      console.log('   Run this SQL in Supabase:');
      console.log('   INSERT INTO admin_users (email, role) VALUES (\'your-email@example.com\', \'super_admin\');');
    } else {
      console.log('✅ Admin users:', admins.length, 'found');
      admins.forEach(admin => {
        const date = new Date(admin.created_at).toLocaleDateString();
        console.log(`   🔑 ${admin.email} (${admin.role}) - created ${date}`);
      });
    }
  } catch (error) {
    console.error('❌ Exception:', error);
    hasErrors = true;
  }

  // Test 5: Test RLS by trying to query questions table
  console.log('\n🔒 Test 5: Testing Row Level Security...');
  try {
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('count');

    if (questionsError) {
      console.error('❌ Error querying questions:', questionsError.message);
      hasErrors = true;
    } else {
      console.log('✅ RLS working - questions table accessible');
      console.log(`   Found ${questions?.length || 0} questions`);
    }
  } catch (error) {
    console.error('❌ Exception:', error);
    hasErrors = true;
  }

  // Test 6: Verify environment variables
  console.log('\n🔑 Test 6: Checking environment variables...');
  const envVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  for (const [key, value] of Object.entries(envVars)) {
    if (!value) {
      console.error(`❌ Missing: ${key}`);
      hasErrors = true;
    } else {
      const preview = key.includes('KEY')
        ? value.substring(0, 20) + '...'
        : value;
      console.log(`✅ ${key}: ${preview}`);
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  if (hasErrors) {
    console.log('\n❌ TESTS FAILED - There were errors during testing');
    console.log('\nTroubleshooting steps:');
    console.log('1. Check your .env.local file has correct credentials');
    console.log('2. Verify the migration script ran successfully in Supabase');
    console.log('3. Check Supabase project is active (not paused)');
    console.log('4. Review error messages above for specific issues');
    console.log('\nSee docs/SUPABASE_SETUP.md for detailed setup instructions.\n');
    process.exit(1);
  } else {
    console.log('\n✅ ALL TESTS PASSED!');
    console.log('\nYour Supabase configuration is working correctly.');
    console.log('You\'re ready to continue with the Q&A implementation!\n');
    process.exit(0);
  }
}

// Run the tests
console.log('Starting Supabase connection tests...\n');
testConnection().catch((error) => {
  console.error('\n💥 Fatal error running tests:', error);
  console.log('\nThis usually means:');
  console.log('- Environment variables are not loaded');
  console.log('- .env.local file is missing or in wrong location');
  console.log('- Network connection issue\n');
  process.exit(1);
});
