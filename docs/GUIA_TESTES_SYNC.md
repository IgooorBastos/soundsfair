# Guia de Testes Manuais - Sistema de Sincronização Híbrido

## 📋 Visão Geral

Este guia fornece instruções passo a passo para testar o sistema de sincronização híbrido de progresso (localStorage + Supabase).

**Arquitetura:** Offline-first com sync opcional para nuvem
**Pré-requisito:** Supabase configurado com migration 004 aplicada

---

## 🛠️ Pré-requisitos

### 1. Configurar Supabase

```bash
# Aplicar migration
psql -h <your-supabase-host> -U postgres -d postgres -f supabase/migrations/004_user_progress_schema.sql

# Ou via Supabase Dashboard:
# SQL Editor > New Query > Colar conteúdo de 004_user_progress_schema.sql > Run
```

### 2. Variáveis de Ambiente

Verificar se `.env.local` contém:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### 3. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
# Servidor em: http://localhost:3000
```

---

## 🧪 Casos de Teste

### Teste 1: Uso Offline (Sem Autenticação)

**Objetivo:** Verificar que o app funciona 100% offline sem autenticação.

**Passos:**
1. Abrir o navegador em modo anônimo
2. Acessar `http://localhost:3000`
3. Navegar para `/lessons`
4. Completar uma lição (ler até o final)
5. Fazer um quiz e passar
6. Verificar XP ganho no header

**Resultado Esperado:**
- ✅ Progresso salvo em localStorage
- ✅ XP e level atualizados
- ✅ Badge de sync NÃO aparece (usuário não autenticado)
- ✅ Experiência funcional completa

**Verificação:**
```javascript
// Console do navegador
localStorage.getItem('soundsfair-xp') // Deve ter valor > 0
JSON.parse(localStorage.getItem('soundsfair-lesson-progress')) // Deve ter lições
```

---

### Teste 2: Auto-Migration (Primeiro Login)

**Objetivo:** Verificar que dados locais são automaticamente enviados para nuvem no primeiro login.

**Pré-condição:** Ter progresso local do Teste 1.

**Passos:**
1. Navegar para `/login`
2. Fazer login/signup
3. Aguardar redirecionamento para `/profile`
4. Observar mensagem de sucesso: "✓ Your local progress has been backed up to the cloud!"

**Resultado Esperado:**
- ✅ Mensagem de auto-migration aparece (~2 segundos após carregar)
- ✅ Progresso local foi enviado para Supabase
- ✅ Badge de sync aparece no canto inferior direito

**Verificação no Supabase:**
```sql
-- Verificar dados enviados
SELECT * FROM user_progress WHERE id = '<user-id>';
SELECT * FROM lesson_progress WHERE user_id = '<user-id>';
SELECT * FROM quiz_results WHERE user_id = '<user-id>';
```

---

### Teste 3: Indicador de Sync Visual

**Objetivo:** Verificar estados visuais do ProgressSyncIndicator.

**Passos:**
1. Login no sistema
2. Observar badge no canto inferior direito
3. Clicar no badge para expandir painel
4. Observar 3 botões:
   - Upload to Cloud
   - Download from Cloud
   - Merge & Sync (Recommended)

**Estados Visuais:**
- 🔵 **Idle:** Badge cinza com "Cloud" - sistema em repouso
- 🟡 **Syncing:** Badge amarelo com ícone girando - sincronizando
- 🟢 **Success:** Badge verde com checkmark - sincronização bem-sucedida
- 🔴 **Error:** Badge vermelho com "X" - erro na sincronização

**Resultado Esperado:**
- ✅ Badge visível e posicionado corretamente
- ✅ Painel expande/colapsa ao clicar
- ✅ Botões estilizados e funcionais

---

### Teste 4: Upload Manual

**Objetivo:** Testar upload manual de progresso local para nuvem.

**Passos:**
1. Com usuário autenticado
2. Completar uma nova lição (ganhar XP)
3. Ir para `/profile`
4. Na seção "Cloud Sync", clicar em "Upload to Cloud"
5. Observar feedback visual

**Resultado Esperado:**
- ✅ Botão mostra loading durante upload
- ✅ Mensagem de sucesso aparece: "✓ Successfully uploaded..."
- ✅ Badge de sync muda para estado "success" (verde)
- ✅ Dados visíveis no Supabase

**Verificação:**
```sql
SELECT updated_at FROM user_progress WHERE id = '<user-id>';
-- updated_at deve ser timestamp recente
```

---

### Teste 5: Download Manual

**Objetivo:** Testar download de progresso da nuvem para localStorage.

**Passos:**
1. Limpar localStorage: `localStorage.clear()` (console)
2. Recarregar página
3. Fazer login
4. Ir para `/profile`
5. Clicar em "Download from Cloud"

**Resultado Esperado:**
- ✅ Progresso restaurado do Supabase
- ✅ XP e level aparecem no header
- ✅ Lições completadas marcadas corretamente
- ✅ Mensagem: "✓ Successfully downloaded..."

**Verificação:**
```javascript
// Console
localStorage.getItem('soundsfair-xp') // Deve ter valor correto
```

---

### Teste 6: Merge & Sync (Conflito Simples)

**Objetivo:** Testar merge inteligente quando há diferenças entre local e nuvem.

**Cenário:**
- Local: 500 XP, 2 lições completadas
- Nuvem: 300 XP, 1 lição completada

**Passos:**
1. Editar localStorage manualmente:
```javascript
localStorage.setItem('soundsfair-xp', '500')
// Adicionar lições em soundsfair-lesson-progress
```

2. Editar Supabase para ter valores menores
3. Ir para `/profile`
4. Clicar em "Merge & Sync (Recommended)"

**Resultado Esperado:**
- ✅ Merge escolhe maior XP: 500
- ✅ Merge faz union de lições: 2 lições no total
- ✅ Dados sincronizados tanto em local quanto nuvem
- ✅ Mensagem: "✓ Successfully merged and synced..."

**Estratégia de Merge:**
- XP: `Math.max(local, cloud)`
- Level: `Math.max(local, cloud)`
- Streaks: `Math.max(local, cloud)`
- Lições: Union de ambos os conjuntos

---

### Teste 7: Auto-Sync (5 minutos)

**Objetivo:** Verificar que sync automático funciona em background.

**Passos:**
1. Fazer login
2. Completar uma lição (ganhar XP)
3. Observar badge de sync
4. Aguardar 5 minutos (ou modificar SYNC_CONFIG.AUTO_SYNC_INTERVAL para testar)
5. Observar console do navegador

**Resultado Esperado:**
- ✅ Console mostra: `[Progress Sync] Auto-sync triggered`
- ✅ Badge muda para "syncing" temporariamente
- ✅ Progresso sincronizado automaticamente
- ✅ Sem intervenção do usuário

**Verificação Console:**
```javascript
// Deve aparecer a cada 5 minutos quando autenticado
[Progress Sync] Auto-sync triggered
[Progress Sync] Upload completed successfully
```

---

### Teste 8: Multi-Device Sync

**Objetivo:** Testar sincronização entre dois dispositivos.

**Passos:**

**Device 1 (Desktop):**
1. Login
2. Ganhar 100 XP, completar lição A
3. Upload to Cloud

**Device 2 (Mobile/Outro Browser):**
1. Login com mesma conta
2. Download from Cloud
3. Verificar que 100 XP e lição A estão presentes
4. Ganhar 50 XP, completar lição B
5. Upload to Cloud

**Device 1 (Desktop):**
1. Merge & Sync
2. Verificar que agora tem 150 XP e lições A + B

**Resultado Esperado:**
- ✅ Device 2 recebe progresso do Device 1
- ✅ Device 1 recebe novo progresso do Device 2
- ✅ Merge funciona corretamente (150 XP, 2 lições)
- ✅ Nenhum dado perdido

---

### Teste 9: Error Handling

**Objetivo:** Verificar comportamento em caso de erro.

**Cenários a Testar:**

#### 9.1 - Usuário Não Autenticado
```javascript
// Fazer logout e tentar sync
uploadProgressToCloud() // Deve retornar erro
```

**Resultado:** ❌ Mensagem: "User not authenticated"

#### 9.2 - Sem Conexão Internet
1. Desativar rede (modo avião)
2. Tentar Upload to Cloud

**Resultado:**
- ❌ Badge muda para estado "error" (vermelho)
- ❌ Mensagem de erro aparece
- ✅ Dados locais permanecem intactos

#### 9.3 - Supabase Indisponível
1. Desativar Supabase temporariamente
2. Tentar sync

**Resultado:**
- ❌ Erro tratado gracefully
- ✅ App continua funcionando offline

---

### Teste 10: API Endpoints

**Objetivo:** Testar endpoints diretamente.

#### 10.1 - POST /api/progress/sync

```bash
curl -X POST http://localhost:3000/api/progress/sync \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "progressData": {
      "total_xp": 500,
      "current_level": 5,
      "current_streak": 3,
      "longest_streak": 10
    }
  }'
```

**Resultado Esperado:**
```json
{
  "success": true,
  "message": "Progress synced successfully"
}
```

#### 10.2 - GET /api/progress/pull

```bash
curl -X GET http://localhost:3000/api/progress/pull \
  -H "Authorization: Bearer <jwt-token>"
```

**Resultado Esperado:**
```json
{
  "success": true,
  "data": {
    "user_progress": { "total_xp": 500, ... },
    "lesson_progress": [ ... ],
    "quiz_results": [ ... ]
  }
}
```

---

## 🔍 Verificações no Console

### Console do Navegador

Mensagens esperadas durante uso normal:

```
[Progress Sync] Starting auto-sync (every 5 minutes)
[Progress Sync] Auto-sync triggered
[Progress Sync] Upload completed successfully
[Progress Sync] Merge completed successfully { mergedXP: 500, ... }
```

### Console do Servidor (Terminal)

```
POST /api/progress/sync 200 in 45ms
GET /api/progress/pull 200 in 32ms
```

---

## 🐛 Troubleshooting

### Problema: Badge não aparece

**Solução:**
1. Verificar se usuário está autenticado
2. Verificar console para erros
3. Verificar se `ProgressSyncIndicator` está em `layout.tsx`

### Problema: "User not authenticated"

**Solução:**
1. Fazer login novamente
2. Verificar JWT token válido
3. Verificar variáveis de ambiente do Supabase

### Problema: Dados não sincronizam

**Solução:**
1. Verificar console para erros HTTP
2. Verificar RLS policies no Supabase
3. Verificar se migration foi aplicada corretamente

### Problema: Merge perdeu dados

**Solução:**
1. Verificar logs do console
2. Conferir estratégia de merge em `progress-sync.ts`
3. Verificar timestamps no Supabase

---

## ✅ Checklist Final

Antes de considerar o sistema pronto para produção:

- [ ] Teste 1: Uso offline funciona 100%
- [ ] Teste 2: Auto-migration funciona no primeiro login
- [ ] Teste 3: Badge visual tem todos os estados corretos
- [ ] Teste 4: Upload manual funciona
- [ ] Teste 5: Download manual funciona
- [ ] Teste 6: Merge & Sync resolve conflitos corretamente
- [ ] Teste 7: Auto-sync funciona em background
- [ ] Teste 8: Multi-device sync preserva todos os dados
- [ ] Teste 9: Error handling gracioso
- [ ] Teste 10: API endpoints respondem corretamente
- [ ] Migration SQL aplicada em produção
- [ ] RLS policies validadas
- [ ] Documentação atualizada

---

## 📊 Métricas de Sucesso

- **Uptime Offline:** 100% (app funciona sem internet)
- **Data Loss:** 0% (merge nunca perde dados)
- **Sync Success Rate:** >99%
- **User Experience:** Transparente e automática

---

## 🚀 Próximos Passos Após Testes

1. Deploy da migration em produção
2. Monitorar logs de erro
3. Coletar feedback de usuários
4. Otimizar auto-sync interval baseado em uso
5. Adicionar analytics de sync (opcional)

---

**Última atualização:** 2025-12-12
**Versão:** 1.0.0
**Status:** Pronto para testes
