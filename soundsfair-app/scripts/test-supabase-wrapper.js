#!/usr/bin/env node

/**
 * Wrapper script to load environment variables before running the TypeScript test
 */

const { resolve } = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envPath = resolve(__dirname, '../.env.local');
console.log(`Loading environment from: ${envPath}\n`);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env.local:', result.error.message);
  process.exit(1);
}

// Now load and run the TypeScript test
require('tsx/cjs').register();
require('./test-supabase');
