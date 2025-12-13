# Checklist de Deploy - Supabase Migration 004

## 📋 Pré-requisitos

- [ ] Acesso ao Supabase Dashboard
- [ ] Backup do banco de dados atual (se houver dados importantes)
- [ ] Arquivo de migration: `supabase/migrations/004_user_progress_schema.sql`
- [ ] Variáveis de ambiente configuradas em produção

---

## 🚀 Passos para Deploy no Supabase

### Método 1: Via Supabase Dashboard (Recomendado)

#### 1. Acessar SQL Editor

1. Login no Supabase Dashboard: https://app.supabase.com
2. Selecionar projeto
3. Navegar para: **SQL Editor** (menu lateral)

#### 2. Executar Migration

1. Clicar em **"New Query"**
2. Copiar conteúdo completo de `004_user_progress_schema.sql`
3. Colar no editor SQL
4. Clicar em **"Run"** (ou Ctrl+Enter)
5. Aguardar confirmação: "Success. No rows returned"

#### 3. Verificar Tabelas Criadas

Executar no SQL Editor:

```sql
-- Verificar se tabelas foram criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_progress', 'lesson_progress', 'quiz_results');
```

**Resultado esperado:** 3 linhas retornadas

#### 4. Verificar RLS Habilitado

```sql
-- Verificar Row Level Security
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('user_progress', 'lesson_progress', 'quiz_results');
```

**Resultado esperado:** `rowsecurity = true` para todas

#### 5. Verificar Policies Criadas

```sql
-- Listar todas as policies
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('user_progress', 'lesson_progress', 'quiz_results')
ORDER BY tablename, cmd;
```

**Resultado esperado:** 9 policies no total

#### 6. Verificar Triggers

```sql
-- Listar triggers
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('user_progress', 'lesson_progress')
  OR trigger_name = 'on_auth_user_created';
```

**Resultado esperado:** 3 triggers

#### 7. Verificar Indexes

```sql
-- Listar indexes
SELECT indexname, tablename
FROM pg_indexes
WHERE tablename IN ('user_progress', 'lesson_progress', 'quiz_results')
  AND schemaname = 'public'
ORDER BY tablename;
```

**Resultado esperado:** 6+ indexes

---

### Método 2: Via Supabase CLI

#### 1. Instalar Supabase CLI

```bash
npm install -g supabase
```

#### 2. Login

```bash
supabase login
```

#### 3. Linkar Projeto

```bash
supabase link --project-ref <your-project-ref>
```

#### 4. Aplicar Migration

```bash
supabase db push
```

---

### Método 3: Via psql (Conexão Direta)

```bash
# Obter connection string do Supabase Dashboard
# Settings > Database > Connection string (Direct connection)

psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  -f supabase/migrations/004_user_progress_schema.sql
```

---

## ✅ Validações Pós-Deploy

### 1. Testar Criação de User Progress no Signup

```sql
-- Simular signup de novo usuário (CUIDADO: só em dev/staging!)
-- No Dashboard > Authentication > Users > Invite User
-- Depois verificar:
SELECT * FROM user_progress WHERE id = '<new-user-id>';
```

**Resultado esperado:** Registro criado automaticamente com valores default

### 2. Testar RLS Policies

```sql
-- Tentar acessar como anônimo (deve falhar)
SET ROLE anon;
SELECT * FROM user_progress;
-- Deve retornar 0 rows (RLS bloqueando)

-- Voltar para role normal
RESET ROLE;
```

### 3. Testar Insert Manual

```sql
-- Com usuário autenticado (usar ID real do auth.users)
INSERT INTO user_progress (id, total_xp, current_level)
VALUES ('<real-user-id>', 100, 2)
ON CONFLICT (id) DO UPDATE SET total_xp = 100;

-- Verificar
SELECT * FROM user_progress WHERE id = '<real-user-id>';
```

### 4. Testar Trigger de updated_at

```sql
-- Fazer update e verificar se updated_at mudou
UPDATE user_progress
SET total_xp = 200
WHERE id = '<user-id>';

-- Verificar updated_at (deve ser NOW())
SELECT id, total_xp, updated_at FROM user_progress WHERE id = '<user-id>';
```

### 5. Testar Foreign Keys e Cascade Delete

```sql
-- CUIDADO: Só testar em ambiente de desenvolvimento!
-- Deletar usuário deve deletar progress em cascade
DELETE FROM auth.users WHERE id = '<test-user-id>';

-- Verificar que progress foi deletado
SELECT COUNT(*) FROM lesson_progress WHERE user_id = '<test-user-id>';
-- Deve retornar 0
```

---

## 🔍 Troubleshooting

### Erro: "permission denied for table auth.users"

**Solução:** Executar como superuser ou via Supabase Dashboard

### Erro: "relation already exists"

**Solução:** Migration é idempotente. Se quiser recriar:

```sql
-- CUIDADO: Isso apaga TODOS os dados!
DROP TABLE IF EXISTS quiz_results CASCADE;
DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
-- Depois executar migration novamente
```

### Erro: "function handle_new_user() does not exist"

**Solução:** Executar somente a parte das functions da migration

### RLS não está funcionando

**Solução:** Verificar se RLS está habilitado:

```sql
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
```

---

## 🔐 Considerações de Segurança

### 1. RLS Habilitado

- ✅ **CRÍTICO:** RLS deve estar habilitado em TODAS as tabelas
- ✅ Sem RLS = qualquer usuário pode ver dados de outros

### 2. Policies Corretas

- ✅ Todas as policies usam `auth.uid()`
- ✅ Nenhuma policy usa `true` (que permitiria acesso total)

### 3. SECURITY DEFINER

- ✅ `handle_new_user()` usa SECURITY DEFINER (correto)
- ⚠️  Não usar SECURITY DEFINER em functions expostas ao cliente

### 4. Anon Key vs Service Role Key

- ✅ Frontend usa `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ❌ NUNCA expor Service Role Key no frontend

---

## 📊 Monitoramento Pós-Deploy

### 1. Logs de Erro

Supabase Dashboard > Logs > Database Logs

Procurar por:
- Erros de RLS
- Constraint violations
- Foreign key errors

### 2. Performance de Queries

```sql
-- Ver queries mais lentas
SELECT * FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### 3. Uso de Indexes

```sql
-- Verificar se indexes estão sendo usados
SELECT * FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND relname IN ('user_progress', 'lesson_progress', 'quiz_results');
```

---

## 🎯 Checklist Final

### Antes do Deploy

- [ ] Backup do banco de dados
- [ ] Migration testada localmente
- [ ] Variáveis de ambiente configuradas
- [ ] Plano de rollback preparado

### Durante o Deploy

- [ ] Migration executada sem erros
- [ ] 3 tabelas criadas
- [ ] 9 RLS policies ativas
- [ ] 6 indexes criados
- [ ] 2 triggers funcionando
- [ ] 2 functions criadas

### Após o Deploy

- [ ] Tabelas visíveis no Table Editor
- [ ] RLS habilitado e testado
- [ ] Trigger de signup testado com novo usuário
- [ ] Frontend conectado e funcionando
- [ ] Auto-migration testada (usuário com dados locais)
- [ ] Logs monitorados por 24h
- [ ] Performance verificada

### Rollback (Se Necessário)

```sql
-- CUIDADO: Isso remove TUDO!
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_lesson_progress_updated_at ON lesson_progress;
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS quiz_results CASCADE;
DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
```

---

## 📞 Suporte

- **Supabase Docs:** https://supabase.com/docs
- **Community:** https://github.com/supabase/supabase/discussions
- **Status Page:** https://status.supabase.com

---

## 📝 Próximos Passos Após Deploy

1. [ ] Testar sistema completo seguindo `GUIA_TESTES_SYNC.md`
2. [ ] Monitorar logs por 48 horas
3. [ ] Validar performance com usuários reais
4. [ ] Documentar qualquer issue encontrado
5. [ ] Preparar hotfix se necessário

---

**Deploy preparado em:** 2025-12-12
**Migration:** 004_user_progress_schema.sql
**Status:** ✅ Pronto para produção
