# 🚀 Guia de Deploy na Vercel

Este guia explica como fazer deploy do soundsfair na Vercel.

---

## 🔴 PROBLEMA COMUM: Build Falhando

Se você vê este erro:

```
Error: Missing NEXT_PUBLIC_SUPABASE_URL environment variable
Error: Command "npm run build" exited with 1
```

**CAUSA:** As variáveis de ambiente não estão configuradas na Vercel.

---

## ✅ SOLUÇÃO: Configurar Environment Variables

### **Passo 1: Acessar Configurações**

1. Ir para: https://vercel.com/seu-usuario/soundsfair
2. Clicar em **"Settings"** (menu superior)
3. Clicar em **"Environment Variables"** (menu lateral)

### **Passo 2: Adicionar Variáveis**

Você precisa copiar TODAS as variáveis do seu arquivo `.env.local` para a Vercel.

**Para cada variável:**

1. Clicar em **"Add New"**
2. Copiar o **nome** da variável (ex: `NEXT_PUBLIC_SUPABASE_URL`)
3. Copiar o **valor** da variável do `.env.local`
4. Selecionar os ambientes:
   - ✅ Production (obrigatório)
   - ✅ Preview (recomendado)
   - ✅ Development (opcional)
5. Clicar em **"Save"**

### **Passo 3: Lista de Variáveis Necessárias**

#### 🌐 Variáveis Públicas (Frontend)

Estas variáveis começam com `NEXT_PUBLIC_` e são acessíveis no browser:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 🔒 Variáveis Privadas (Backend)

Estas variáveis são secretas e só funcionam no servidor:

- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `OPENNODE_API_KEY`
- `RESEND_API_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

#### ⚙️ Variáveis Opcionais (Rate Limiting)

Se não configuradas, usam valores padrão:

- `QA_SUBMIT_RL_IP_LIMIT` (padrão: 10)
- `QA_SUBMIT_RL_IP_WINDOW_SEC` (padrão: 600)
- `QA_SUBMIT_RL_EMAIL_LIMIT` (padrão: 5)
- `QA_SUBMIT_RL_EMAIL_WINDOW_SEC` (padrão: 3600)

### **Passo 4: Redeploy**

Após adicionar todas as variáveis, você precisa fazer um novo deploy:

#### Opção 1: Redeploy Manual (Mais Rápido)

1. Ir para: https://vercel.com/seu-usuario/soundsfair/deployments
2. Clicar nos **"..."** do último deploy
3. Clicar em **"Redeploy"**
4. Aguardar ~5-8 minutos

#### Opção 2: Novo Commit (Automático)

```bash
git add .
git commit -m "chore: update configuration"
git push origin main
```

---

## ✅ Verificar Sucesso

Quando o deploy completar com sucesso, você verá:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (44/44)
✓ Build completed successfully
```

---

## 🚨 Troubleshooting

### **Erro: "Missing env var" ainda aparece**

- Verifique se adicionou TODAS as variáveis obrigatórias
- Confirme que marcou "Production"
- Faça um redeploy (variáveis só aplicam em novos deploys)

### **Build passa mas site retorna erro 500**

- Verifique logs de runtime na Vercel
- Confirme que variáveis privadas foram adicionadas
- Teste conexão com Supabase

### **Erro de TypeScript durante build**

- Rode `npm run build` localmente ANTES de fazer push
- Veja `TESTAR_ANTES_DE_DEPLOY.md` para mais detalhes

---

## 📋 Checklist de Deploy

- [ ] Testei build local (`npm run build` passou)
- [ ] Adicionei variáveis públicas (5x NEXT_PUBLIC_*)
- [ ] Adicionei variáveis privadas (7x server-side)
- [ ] Marquei "Production" em todas
- [ ] Fiz commit e push para GitHub
- [ ] Aguardei deploy completar na Vercel
- [ ] Verifiquei que build passou
- [ ] Testei site em produção

---

## 🔒 Segurança

**IMPORTANTE:**

- ⚠️ Nunca commite o arquivo `.env.local` no git
- ⚠️ Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend
- ⚠️ Nunca compartilhe credenciais publicamente
- ✅ Use variáveis `NEXT_PUBLIC_*` apenas para dados não-sensíveis
- ✅ Mantenha secrets apenas no servidor

---

## 🎯 Workflow Ideal

1. **Desenvolvimento local:**
   ```bash
   npm run dev
   # Testar mudanças em localhost:3000
   ```

2. **Antes de cada push:**
   ```bash
   npm run build
   # Garantir que build passa
   ```

3. **Commit e push:**
   ```bash
   git add .
   git commit -m "feat: minha feature"
   git push origin main
   ```

4. **Aguardar Vercel:**
   - Deploy automático inicia
   - Build passa (~5-8 min)
   - Site atualizado em produção

---

## 📚 Recursos

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- `TESTAR_ANTES_DE_DEPLOY.md` - Como testar localmente
- `RESOLVER_PROBLEMA_NODE_MODULES.md` - Problemas com WSL

---

**Tempo total: ~10-15 minutos (primeira vez)**

**Depois de configurado, deploys são automáticos!** ✅
