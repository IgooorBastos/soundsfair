import { createClient } from '@supabase/supabase-js';

async function checkTables() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const tables = [
    'questions',
    'payments',
    'admin_users',
    'question_categories',
    'pricing_tiers',
    'quiz_responses',
    'admin_audit_log',
    'email_logs',
    'email_preferences'
  ];

  console.log('=== SUPABASE DATABASE CHECK ===\n');
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log(`Checking ${tables.length} tables...\n`);

  let errors = 0;

  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(0);
    if (error) {
      console.log(`  ❌ ${table} - ${error.message}`);
      errors++;
    } else {
      console.log(`  ✅ ${table}`);
    }
  }

  console.log(`\nResult: ${tables.length - errors}/${tables.length} tables accessible`);
  process.exit(errors > 0 ? 1 : 0);
}

checkTables();
