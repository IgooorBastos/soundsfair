# Guia Completo de Configuração - soundsfair

Este guia contém instruções detalhadas passo a passo para configurar todos os serviços necessários para a aplicação soundsfair.

---

## 1. Supabase (Autenticação & Database)

### 1.1 Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Clique em **"Start your project"**
3. Faça login ou crie uma conta (recomendado: usar GitHub)
4. Clique em **"New Project"**
5. Preencha os campos:
   - **Name**: `soundsfair` (ou nome de sua escolha)
   - **Database Password**: Crie uma senha forte e **ANOTE ESTA SENHA!**
   - **Region**: Escolha a região mais próxima (ex: South America - São Paulo)
   - **Pricing Plan**: Free (suficiente para começar)
6. Clique em **"Create new project"**
7. Aguarde 2-3 minutos enquanto o projeto é provisionado

### 1.2 Obter Credenciais do Supabase

1. No dashboard do projeto, clique em **"Settings"** (ícone de engrenagem no menu lateral)
2. Clique em **"API"**
3. Você verá duas seções importantes:

**Project URL:**
```
https://xxxxxxxxxx.supabase.co
```
Copie esta URL completa.

**Project API keys:**
- **anon / public**: Clique em "Copy" (chave longa começando com `eyJhbGciOi...`)
- **service_role / secret**: Clique em "Reveal" e depois em "Copy"

⚠️ **IMPORTANTE**: Guarde essas chaves em local seguro. Nunca compartilhe a `service_role` key!

### 1.3 Configurar Environment Variables

1. No diretório raiz do projeto, crie/edite o arquivo `.env.local`
2. Adicione as seguintes variáveis:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Substitua os valores pelos copiados no passo anterior
4. Salve o arquivo

### 1.4 Rodar Migrations do Database Schema

Você tem duas opções:

#### OPÇÃO A: Via Supabase Dashboard (Mais Fácil)

1. No dashboard do Supabase, clique em **"SQL Editor"** no menu lateral
2. Clique em **"+ New Query"**
3. Abra o arquivo `supabase/migrations/001_qa_schema.sql` no seu editor de código
4. Copie **TODO** o conteúdo do arquivo
5. Cole no SQL Editor do Supabase
6. Clique em **"Run"** (ou pressione Ctrl+Enter)
7. Aguarde aparecer **"Success. No rows returned"**
8. Repita o processo para os outros dois arquivos na ordem:
   - `supabase/migrations/002_fix_rls_policy.sql`
   - `supabase/migrations/003_disable_admin_rls.sql`

✅ Você verá mensagens de sucesso para cada migration.

#### OPÇÃO B: Via Supabase CLI (Mais Avançado)

1. Instale o Supabase CLI globalmente:
```bash
npm install -g supabase
```

2. Faça login no Supabase:
```bash
supabase login
```

3. Link seu projeto local ao projeto Supabase:
```bash
supabase link --project-ref xxxxxxxxxx
# Substitua xxxxxxxxxx pelo ID do projeto (encontrado na URL do dashboard)
```

4. Rode todas as migrations:
```bash
supabase db push
```

### 1.5 Criar Primeiro Admin User

Após rodar as migrations, você precisa criar pelo menos um usuário admin:

1. No Supabase Dashboard, vá em **"SQL Editor"**
2. Crie uma nova query
3. Cole o seguinte SQL (substituindo o email):

```sql
INSERT INTO admin_users (email, role)
VALUES ('seu-email@exemplo.com', 'super_admin');
```

4. **IMPORTANTE**: Substitua `seu-email@exemplo.com` pelo seu email real
5. Clique em **"Run"**
6. Você deve ver **"Success. 1 row affected"**

### 1.6 Verificar Tables Criadas

1. No dashboard do Supabase, clique em **"Table Editor"**
2. Você deve ver as seguintes tabelas:
   - `questions` - Perguntas dos usuários
   - `payments` - Registros de pagamentos Lightning
   - `admin_users` - Usuários administradores
   - `question_categories` - Categorias de perguntas (com 5 registros)
   - `pricing_tiers` - Planos de pagamento (com 3 registros)

### 1.7 Testar Conexão

Execute o script de teste:

```bash
npx tsx scripts/test-supabase.ts
```

Você deve ver:
```
✅ ALL TESTS PASSED!

Your Supabase configuration is working correctly.
```

Se houver erros, revise os passos anteriores e verifique:
- `.env.local` tem as credenciais corretas
- Migrations foram executadas com sucesso
- Você criou pelo menos um admin user

---

## 2. OpenNode (Pagamentos Lightning)

### 2.1 Criar Conta no OpenNode

1. Acesse https://opennode.com
2. Clique em **"Sign Up"**
3. Preencha o formulário de cadastro
4. Confirme seu email
5. Complete o processo de verificação KYC (se necessário)

### 2.2 Criar API Key

1. Faça login no dashboard do OpenNode
2. Clique em **"Settings"** ou **"Integrations"**
3. Vá para **"API Keys"**
4. Clique em **"Generate API Key"**
5. Escolha as permissões:
   - ✅ **Create invoices**
   - ✅ **Read invoices**
   - ✅ **Receive webhooks**
6. Dê um nome: `soundsfair-production`
7. Copie a API key gerada (começa com `ok_`)

⚠️ **IMPORTANTE**: Esta chave só é mostrada uma vez! Guarde em local seguro.

### 2.3 Configurar Webhook

1. No OpenNode dashboard, vá em **"Settings"** > **"Webhooks"**
2. Clique em **"Add Webhook"**
3. Configure:
   - **URL**: `https://seu-dominio.com/api/webhooks/opennode`
   - **Events**: Selecione todos os eventos de pagamento
   - **Status**: Active
4. Copie o **Webhook Secret** gerado
5. Clique em **"Save"**

### 2.4 Adicionar ao .env.local

Adicione as seguintes variáveis ao arquivo `.env.local`:

```bash
# OpenNode
OPENNODE_API_KEY=ok_xxxxxxxxxxxxxxxxxxxxxxxx
OPENNODE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx
```

### 2.5 Testar Integração (Após Deploy)

Após fazer deploy da aplicação:

1. Acesse a página Q&A do site
2. Submeta uma pergunta de teste
3. Você receberá uma invoice Lightning
4. Pague a invoice usando uma wallet Lightning (pode usar a wallet do OpenNode em testnet)
5. Verifique se o webhook foi recebido no OpenNode dashboard
6. Confirme que o status da pergunta mudou para "paid" no Supabase

---

## 3. CoinCap API (Preços Bitcoin)

### 3.1 API Pública (Sem Cadastro)

A API do CoinCap funciona sem necessidade de cadastro para até 200 requisições por minuto.

**Nenhuma configuração necessária para começar!**

### 3.2 [Opcional] Criar Conta para Rate Limits Maiores

Se precisar de mais requisições:

1. Acesse https://coincap.io
2. Clique em **"API"** no menu
3. Clique em **"Get API Key"**
4. Crie uma conta
5. Obtenha sua API key
6. Adicione ao `.env.local`:

```bash
# CoinCap (opcional)
COINCAP_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 3.3 Testar API

Execute este comando para testar:

```bash
curl https://api.coincap.io/v2/assets/bitcoin
```

Você deve receber um JSON com dados do Bitcoin, incluindo o preço atual.

---

## 4. Resend (Envio de Emails)

### 4.1 Criar Conta no Resend

1. Acesse https://resend.com
2. Clique em **"Sign Up"**
3. Crie uma conta (pode usar GitHub)
4. Confirme seu email

### 4.2 Adicionar e Verificar Domínio

1. No dashboard do Resend, vá em **"Domains"**
2. Clique em **"Add Domain"**
3. Digite seu domínio: `soundsfair.com` (ou seu domínio)
4. Clique em **"Add"**
5. Você verá registros DNS que precisa adicionar:

**Registros DNS necessários:**
```
Type: TXT
Name: resend._domainkey
Value: (será fornecido pelo Resend)

Type: MX
Name: @
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
```

6. Adicione esses registros no painel DNS do seu provedor de domínio
7. Aguarde propagação (pode levar até 48h, normalmente 10-30 minutos)
8. Clique em **"Verify"** no Resend

### 4.3 Criar API Key

1. No dashboard do Resend, vá em **"API Keys"**
2. Clique em **"Create API Key"**
3. Dê um nome: `soundsfair-production`
4. Escolha permissões: **Full Access** (ou personalize)
5. Clique em **"Create"**
6. Copie a API key (começa com `re_`)

### 4.4 Adicionar ao .env.local

```bash
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@soundsfair.com
```

### 4.5 Testar Envio de Email

Crie um arquivo de teste `test-email.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'noreply@soundsfair.com',
      to: ['seu-email@exemplo.com'],
      subject: 'Teste - soundsfair',
      html: '<p>Email de teste funcionando!</p>'
    });
    console.log('✅ Email enviado:', data);
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testEmail();
```

Execute:
```bash
npx tsx test-email.ts
```

---

## 5. Configurações Admin

### 5.1 Definir Credenciais de Admin

Adicione ao arquivo `.env.local`:

```bash
# Admin
ADMIN_EMAIL=seu@email.com
ADMIN_PASSWORD=sua_senha_super_secreta_aqui
```

⚠️ **SEGURANÇA**:
- Use uma senha forte (mínimo 16 caracteres)
- Nunca comite o `.env.local` no git
- Nunca compartilhe essas credenciais

### 5.2 Verificar .gitignore

Confirme que `.env.local` está no `.gitignore`:

```bash
grep -n "\.env\.local" .gitignore
```

Se não estiver, adicione:
```bash
echo ".env.local" >> .gitignore
```

---

## 6. Arquivo .env.local Completo

Aqui está o template completo do arquivo `.env.local`:

```bash
# ============================================================================
# Supabase (Autenticação & Database)
# ============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================================================
# OpenNode (Pagamentos Lightning)
# ============================================================================
OPENNODE_API_KEY=ok_xxxxxxxxxxxxxxxxxxxxxxxx
OPENNODE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx

# ============================================================================
# CoinCap API (Preços Bitcoin) - Opcional
# ============================================================================
# COINCAP_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# ============================================================================
# Resend (Envio de Emails)
# ============================================================================
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@soundsfair.com

# ============================================================================
# Admin Credentials
# ============================================================================
ADMIN_EMAIL=seu@email.com
ADMIN_PASSWORD=sua_senha_super_secreta_aqui

# ============================================================================
# Next.js
# ============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Em produção: NEXT_PUBLIC_APP_URL=https://soundsfair.com
```

---

## 7. Checklist de Verificação

Antes de fazer deploy, verifique:

- [ ] Supabase:
  - [ ] Projeto criado
  - [ ] Migrations executadas (3 arquivos)
  - [ ] Admin user criado
  - [ ] Teste de conexão passou
  - [ ] Credenciais no `.env.local`

- [ ] OpenNode:
  - [ ] Conta criada e verificada
  - [ ] API key gerada
  - [ ] Webhook configurado
  - [ ] Credenciais no `.env.local`

- [ ] CoinCap:
  - [ ] API pública testada
  - [ ] (Opcional) API key configurada

- [ ] Resend:
  - [ ] Conta criada
  - [ ] Domínio adicionado e verificado
  - [ ] API key gerada
  - [ ] Email de teste enviado com sucesso
  - [ ] Credenciais no `.env.local`

- [ ] Admin:
  - [ ] Email e senha definidos no `.env.local`
  - [ ] `.env.local` está no `.gitignore`

- [ ] Build:
  - [ ] `npm run build` executa sem erros
  - [ ] `npm run dev` funciona localmente
  - [ ] Todas as páginas acessíveis

---

## 8. Próximos Passos

Após completar todas as configurações:

1. **Testar Localmente**:
```bash
npm run dev
```
Acesse http://localhost:3000 e teste todas as funcionalidades.

2. **Build de Produção**:
```bash
npm run build
```
Certifique-se que não há erros.

3. **Deploy**:
   - Vercel (recomendado para Next.js)
   - Configure todas as environment variables no dashboard da Vercel
   - Faça deploy do branch main

4. **Configuração Pós-Deploy**:
   - Atualize o webhook URL no OpenNode com a URL de produção
   - Atualize `NEXT_PUBLIC_APP_URL` para a URL de produção
   - Teste o fluxo completo de pagamento em produção

---

## 9. Suporte e Troubleshooting

### Erro: "Missing environment variable"
- Verifique se o `.env.local` está no diretório raiz
- Reinicie o servidor de desenvolvimento após editar `.env.local`

### Erro: "Cannot connect to Supabase"
- Verifique se as credenciais estão corretas
- Certifique-se que o projeto Supabase não está pausado
- Verifique sua conexão com internet

### Erro: "Payment webhook not received"
- Verifique se a URL do webhook está correta
- Certifique-se que a aplicação está acessível publicamente
- Verifique logs do OpenNode dashboard

### Emails não chegam
- Verifique se o domínio está verificado no Resend
- Confira a pasta de spam
- Verifique logs no dashboard do Resend

---

## 10. Recursos Úteis

- **Supabase Docs**: https://supabase.com/docs
- **OpenNode API**: https://developers.opennode.com
- **CoinCap API**: https://docs.coincap.io
- **Resend Docs**: https://resend.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**Última atualização**: Dezembro 2024
