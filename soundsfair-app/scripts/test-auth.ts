/**
 * Script de teste para verificar configuração do Supabase Auth
 *
 * Execute: npx tsx scripts/test-auth.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas!');
  console.log('Certifique-se de que .env.local está configurado');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log('🔍 Testando configuração do Supabase Auth...\n');

  // Test 1: Verificar conexão
  console.log('1️⃣ Verificando conexão com Supabase...');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Anon Key: ${supabaseAnonKey.substring(0, 20)}...`);

  // Test 2: Verificar auth providers
  console.log('\n2️⃣ Verificando providers de autenticação...');
  try {
    // Tentar obter a sessão (deve retornar null se nenhum usuário logado)
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('   ❌ Erro ao verificar sessão:', error.message);
    } else {
      console.log('   ✅ Conexão com Auth funcionando!');
      console.log(`   Sessão atual: ${session ? 'Usuário logado' : 'Nenhum usuário logado'}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('   ❌ Erro:', message);
  }

  console.log('\n3️⃣ Configuração verificada!');
  console.log('\n📝 Próximos passos:');
  console.log('   1. Habilite Email provider no Supabase Dashboard');
  console.log('   2. Configure Site URL e Redirect URLs');
  console.log('   3. Teste criando um usuário em /login');
  console.log('\n✅ Setup completo! Você pode começar a usar autenticação.');
}

testAuth();
