# 🔐 Configuração de Autenticação - Supabase

Este guia explica como configurar a autenticação do Supabase para o projeto soundsfair.

## ✅ Status Atual

- [x] Projeto Supabase criado
- [x] Variáveis de ambiente configuradas (`.env.local`)
- [ ] **Authentication habilitado (FAÇA AGORA)**
- [ ] Email provider configurado
- [ ] Site URL configurado

---

## 📋 Checklist de Configuração

### 1. Acessar Dashboard do Supabase

🔗 **Link direto para seu projeto:**
https://supabase.com/dashboard/project/ebvwnpyjvbexrtqwrbkk

1. Faça login em https://supabase.com
2. Selecione o projeto **ebvwnpyjvbexrtqwrbkk**

---

### 2. Habilitar Email Authentication

#### Caminho no Dashboard:
```
Authentication (menu lateral) → Providers → Email
```

#### Configurações:

| Configuração | Desenvolvimento | Produção |
|--------------|----------------|----------|
| **Enable Email provider** | ✅ ON | ✅ ON |
| **Confirm email** | ❌ OFF (facilita testes) | ✅ ON (segurança) |
| **Secure email change** | ❌ OFF | ✅ ON |
| **Double confirm email changes** | ❌ OFF | ✅ ON |

**Para começar rápido (desenvolvimento):**
1. ✅ Habilite **Email provider**
2. ❌ **Desabilite** "Confirm email" (você pode testar imediatamente)
3. Clique em **Save**

---

### 3. Configurar Site URL e Redirect URLs

#### Caminho no Dashboard:
```
Authentication → URL Configuration
```

#### Configurações para Desenvolvimento:

**Site URL:**
```
http://localhost:3000
```

**Redirect URLs (adicione todas):**
```
http://localhost:3000/**
http://localhost:3000/lessons
http://localhost:3000/auth/callback
```

> 💡 O `/**` permite qualquer rota no localhost

#### Para Produção (depois):

**Site URL:**
```
https://seudominio.com
```

**Redirect URLs:**
```
https://seudominio.com/**
https://seudominio.com/lessons
https://seudominio.com/auth/callback
```

---

### 4. Configurar Magic Link Email Template

#### Caminho no Dashboard:
```
Authentication → Email Templates → Magic Link
```

Verifique se o template está ativo e contém:

```html
<h2>Magic Link</h2>
<p>Follow this link to login:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink">Log In</a></p>
```

Se estiver diferente, você pode customizar depois.

---

### 5. Criar Página de Callback (Necessário para Magic Links)

Crie o arquivo: `soundsfair-app/app/auth/callback/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next') || '/lessons';

  if (token_hash && type) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // Redirect to login on error
  return NextResponse.redirect(new URL('/login?error=invalid_link', requestUrl.origin));
}
```

---

## 🧪 Testar a Configuração

### Opção 1: Teste via Script

```bash
cd soundsfair-app
npx tsx scripts/test-auth.ts
```

### Opção 2: Teste via Interface

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse: http://localhost:3000/login

3. Teste os 3 métodos:
   - **Signup**: Crie uma conta nova
   - **Login**: Entre com email/senha
   - **Magic Link**: Login sem senha (receba email)

---

## 📧 Configuração de Email (Para Magic Links e Confirmações)

O Supabase usa o serviço de email deles por padrão, mas tem limites:
- ⚠️ **Limite free tier**: ~3-4 emails/hora por projeto
- ⚠️ Emails podem cair no spam

### Para produção (recomendado):

Configure um provedor de email customizado:

#### Opção A: Resend (Recomendado)
1. Crie conta em: https://resend.com
2. Verifique seu domínio
3. Adicione API key no `.env.local`:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
4. Configure no Supabase: Authentication → Settings → SMTP

#### Opção B: SendGrid, Mailgun, etc.
Similar ao Resend, configure SMTP settings.

---

## 🔒 Segurança - Checklist de Produção

Antes de fazer deploy para produção:

- [ ] Habilite **"Confirm email"**
- [ ] Habilite **"Secure email change"**
- [ ] Configure provedor de email customizado (Resend)
- [ ] Adicione domínio de produção nas Redirect URLs
- [ ] Configure **Row Level Security (RLS)** nas tabelas
- [ ] Revise políticas de senha (mínimo 8 caracteres)
- [ ] Configure rate limiting

---

## 📊 Próximos Passos

Após configurar autenticação:

1. ✅ Usuários podem criar contas
2. ✅ Usuários podem fazer login
3. ✅ XP/Progress será salvo por usuário

### Para salvar progresso no Supabase:

Você precisará criar uma tabela `user_progress`:

```sql
create table user_progress (
  id uuid references auth.users primary key,
  total_xp integer default 0,
  current_level integer default 1,
  lessons_completed text[] default '{}',
  current_streak integer default 0,
  longest_streak integer default 0,
  last_activity timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table user_progress enable row level security;

-- Policy: Users can only see/edit their own progress
create policy "Users can view own progress"
  on user_progress for select
  using (auth.uid() = id);

create policy "Users can update own progress"
  on user_progress for update
  using (auth.uid() = id);

create policy "Users can insert own progress"
  on user_progress for insert
  with check (auth.uid() = id);
```

---

## 🆘 Troubleshooting

### Problema: "Invalid API key"
**Solução:** Verifique se as variáveis no `.env.local` estão corretas.

### Problema: "Email not confirmed"
**Solução:** Desabilite "Confirm email" em Development, ou verifique o email de confirmação.

### Problema: Magic link não funciona
**Solução:**
1. Verifique Site URL e Redirect URLs
2. Crie a rota `/auth/callback/route.ts`
3. Confira o email template

### Problema: Emails caem no spam
**Solução:** Configure SMTP customizado (Resend/SendGrid) em produção.

---

## 📚 Documentação Oficial

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Email Auth](https://supabase.com/docs/guides/auth/auth-email)
- [Magic Links](https://supabase.com/docs/guides/auth/auth-magic-link)
- [Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)

---

**✅ Pronto! Sua autenticação está configurada.**

Após seguir este guia, execute:
```bash
npm run dev
```

E acesse: http://localhost:3000/login
