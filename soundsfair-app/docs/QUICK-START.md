# Guia Rápido - soundsfair

Este é um guia resumido para começar rapidamente. Para instruções detalhadas, veja [SETUP-GUIDE.md](./SETUP-GUIDE.md).

---

## Configuração em 5 Passos

### 1️⃣ Supabase (5-10 minutos)

```bash
# 1. Criar projeto em https://supabase.com
# 2. Copiar credenciais de Settings > API
# 3. Rodar migrations no SQL Editor (3 arquivos em /supabase/migrations/)
# 4. Criar admin user:

INSERT INTO admin_users (email, role)
VALUES ('seu@email.com', 'super_admin');

# 5. Testar conexão:
npx tsx scripts/test-supabase.ts
```

**Environment Variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

---

### 2️⃣ OpenNode (10-15 minutos)

```bash
# 1. Criar conta em https://opennode.com
# 2. Gerar API Key em Settings > API Keys
# 3. Configurar webhook: https://seu-dominio.com/api/webhooks/opennode
```

**Environment Variables:**
```bash
OPENNODE_API_KEY=ok_xxx
OPENNODE_WEBHOOK_SECRET=whsec_xxx
```

---

### 3️⃣ CoinCap (Opcional - 2 minutos)

```bash
# API pública funciona sem cadastro!
# Opcional: https://coincap.io para criar conta e obter API key
```

**Environment Variables (opcional):**
```bash
COINCAP_API_KEY=xxx
```

---

### 4️⃣ Resend (10-15 minutos)

```bash
# 1. Criar conta em https://resend.com
# 2. Adicionar domínio em Domains
# 3. Configurar DNS (TXT + MX records)
# 4. Gerar API Key em API Keys
```

**Environment Variables:**
```bash
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@soundsfair.com
```

---

### 5️⃣ Admin Credentials

**Environment Variables:**
```bash
ADMIN_EMAIL=seu@email.com
ADMIN_PASSWORD=senha_forte_aqui_minimo_16_chars
```

---

## Arquivo .env.local Completo

```bash
# Copie .env.local.example para .env.local
cp .env.local.example .env.local

# Edite e preencha todas as credenciais
nano .env.local  # ou vim, ou seu editor preferido
```

---

## Checklist Rápido

**Antes de começar:**
- [ ] Node.js 18+ instalado
- [ ] npm ou yarn instalado
- [ ] Git instalado

**Configuração:**
- [ ] Supabase configurado e testado
- [ ] OpenNode API key obtida
- [ ] Resend API key obtida
- [ ] `.env.local` criado e preenchido
- [ ] Admin user criado no Supabase

**Verificação:**
```bash
# 1. Instalar dependências
npm install

# 2. Testar Supabase
npx tsx scripts/test-supabase.ts
# ✅ Deve mostrar "ALL TESTS PASSED!"

# 3. Build de produção
npm run build
# ✅ Deve compilar sem erros

# 4. Rodar localmente
npm run dev
# ✅ Acesse http://localhost:3000
```

**Testes Manuais:**
- [ ] Homepage carrega
- [ ] Navegação funciona (about, FAQ, glossary)
- [ ] Todas as 9 lições abrem
- [ ] Login/signup funciona
- [ ] Q&A form funciona
- [ ] DCA calculator funciona
- [ ] Admin login funciona

---

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev                    # Inicia servidor de desenvolvimento

# Build & Produção
npm run build                  # Build de produção
npm run start                  # Inicia servidor de produção

# Testes
npx tsx scripts/test-supabase.ts   # Testa conexão Supabase

# Linting
npm run lint                   # Verifica código
```

---

## Estrutura de Pastas

```
soundsfair-app/
├── app/                       # Next.js app router
│   ├── api/                   # API routes
│   │   ├── admin/             # Admin endpoints
│   │   ├── qa/                # Q&A endpoints
│   │   └── webhooks/          # Webhook handlers
│   ├── lessons/               # Lesson pages
│   ├── tools/                 # Tools (DCA calculator)
│   └── types/                 # TypeScript types
├── components/                # React components
│   ├── charts/                # Chart components
│   ├── layout/                # Layout components (Header, Footer)
│   ├── lesson/                # Lesson-specific components
│   ├── qa/                    # Q&A components
│   ├── tools/                 # Tool components
│   └── ui/                    # UI components
├── lib/                       # Utility libraries
│   ├── supabase.ts            # Supabase client
│   ├── opennode.ts            # OpenNode integration
│   ├── validation.ts          # Zod schemas
│   └── ...
├── supabase/
│   └── migrations/            # SQL migrations (3 arquivos)
├── scripts/                   # Utility scripts
│   └── test-supabase.ts       # Supabase test script
└── docs/                      # Documentation
    ├── SETUP-GUIDE.md         # Guia completo (este arquivo)
    └── QUICK-START.md         # Guia rápido
```

---

## Troubleshooting Rápido

**Erro: "Missing environment variable"**
```bash
# Certifique-se que .env.local existe
ls -la .env.local

# Reinicie o servidor após editar .env.local
# Ctrl+C e depois: npm run dev
```

**Erro: Supabase connection failed**
```bash
# Verifique credenciais
cat .env.local | grep SUPABASE

# Rode o teste
npx tsx scripts/test-supabase.ts
```

**Erro: Build failed**
```bash
# Limpe cache e reinstale
rm -rf .next node_modules
npm install
npm run build
```

**Página não abre/404**
```bash
# Verifique se o servidor está rodando
# Deve mostrar: "Local: http://localhost:3000"
npm run dev
```

---

## Deploy (Vercel)

```bash
# 1. Instale Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Configure environment variables no dashboard da Vercel
# Settings > Environment Variables
# Adicione TODAS as variáveis do .env.local

# 5. Redeploy
vercel --prod
```

**Pós-Deploy:**
1. Atualize webhook URL no OpenNode para URL de produção
2. Atualize `NEXT_PUBLIC_APP_URL` para URL de produção
3. Teste fluxo completo de pagamento

---

## Próximos Passos

1. Complete a configuração seguindo este guia
2. Teste localmente todas as funcionalidades
3. Faça deploy no Vercel
4. Configure webhooks de produção
5. Teste em produção

Para detalhes completos, veja [SETUP-GUIDE.md](./SETUP-GUIDE.md).

---

## Suporte

- Supabase Docs: https://supabase.com/docs
- OpenNode API: https://developers.opennode.com
- Resend Docs: https://resend.com/docs
- Next.js Docs: https://nextjs.org/docs

**Issues?** Revise o [SETUP-GUIDE.md](./SETUP-GUIDE.md) completo para instruções detalhadas.
