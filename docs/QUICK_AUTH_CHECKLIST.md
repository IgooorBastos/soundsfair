# ⚡ Checklist Rápido - Ativar Autenticação

## ✅ Status: O que já está pronto

- ✅ Projeto Supabase criado e configurado
- ✅ Variáveis de ambiente no `.env.local`
- ✅ Código de autenticação implementado
- ✅ Página de login criada (`/login`)
- ✅ Rota de callback criada (`/auth/callback`)
- ✅ Hook de autenticação (`useAuth`)
- ✅ Integração com Header (botão LOGIN/Start Learning)

---

## 🚀 O QUE VOCÊ PRECISA FAZER AGORA (5 minutos)

### Passo 1: Acessar Dashboard do Supabase
🔗 **Link direto:** https://supabase.com/dashboard/project/ebvwnpyjvbexrtqwrbkk

### Passo 2: Habilitar Email Authentication
```
Menu lateral → Authentication → Providers → Email
```

**Configure assim:**
- [x] **Enable Email provider** → ✅ LIGADO
- [ ] **Confirm email** → ❌ DESLIGADO (por enquanto, para facilitar testes)

Clique em **SAVE** no final da página

### Passo 3: Configurar Site URL
```
Menu lateral → Authentication → URL Configuration
```

**Site URL:**
```
http://localhost:3000
```

**Redirect URLs** (clique "Add URL" para cada):
```
http://localhost:3000/**
http://localhost:3000/lessons
http://localhost:3000/auth/callback
```

Clique em **SAVE**

### Passo 4: Testar!
```bash
cd soundsfair-app
npm run dev
```

Acesse: http://localhost:3000/login

**Teste os 3 métodos:**
1. ✅ Criar conta (Sign Up)
2. ✅ Login com senha
3. ✅ Magic Link (login sem senha)

---

## 📸 Guia Visual - Onde clicar

### 1. Authentication → Providers
```
┌─────────────────────────────────────┐
│ 🔐 Authentication                   │
│  ├─ Users                           │
│  ├─ ✅ Providers  ← CLIQUE AQUI    │
│  ├─ Configuration                   │
│  ├─ Policies                        │
│  └─ URL Configuration               │
└─────────────────────────────────────┘
```

### 2. Encontre "Email" na lista
```
┌─────────────────────────────────────┐
│ Providers                           │
│                                     │
│ ✅ Email  ← CLIQUE PARA EXPANDIR   │
│    Configure email authentication   │
│                                     │
│ □ Phone                             │
│ □ Google                            │
│ □ GitHub                            │
└─────────────────────────────────────┘
```

### 3. Dentro de Email provider
```
┌─────────────────────────────────────┐
│ Email Auth                          │
│                                     │
│ ✅ Enable Email provider   ← LIGUE │
│                                     │
│ Email confirmations                 │
│ ❌ Confirm email          ← DESLIGUE│
│                                     │
│ [SAVE] ← CLIQUE AQUI               │
└─────────────────────────────────────┘
```

### 4. URL Configuration
```
┌─────────────────────────────────────┐
│ URL Configuration                   │
│                                     │
│ Site URL                            │
│ [http://localhost:3000]             │
│                                     │
│ Redirect URLs                       │
│ [http://localhost:3000/**]          │
│ [+ Add URL]                         │
│                                     │
│ [SAVE] ← CLIQUE AQUI               │
└─────────────────────────────────────┘
```

---

## 🧪 Como Testar

### Teste 1: Criar Conta (Sign Up)
1. Vá em: http://localhost:3000/login
2. Clique na aba **"Sign Up"**
3. Digite seu email e senha (mínimo 6 caracteres)
4. Clique em **"Create Account"**
5. ✅ Se aparecer "Account created!", funcionou!

### Teste 2: Login com Senha
1. Use o email/senha que você criou
2. Clique na aba **"Login"**
3. Digite email e senha
4. Clique em **"Login"**
5. ✅ Você será redirecionado para `/lessons`

### Teste 3: Magic Link (Sem Senha)
1. Clique na aba **"Magic Link"**
2. Digite seu email
3. Clique em **"Send Magic Link"**
4. Abra o email (verifique spam)
5. Clique no link
6. ✅ Você será logado automaticamente

---

## 🐛 Problemas Comuns

### ❌ "Invalid API key"
**Solução:** Suas credenciais estão corretas no `.env.local`, então esse erro não deve aparecer.

### ❌ "Email not confirmed"
**Solução:** Você desabilitou "Confirm email" no passo 2? Se não, volte lá e desabilite.

### ❌ Magic link não funciona
**Checklist:**
- [ ] Configurou Site URL?
- [ ] Configurou Redirect URLs?
- [ ] Incluiu `/auth/callback` nas URLs?
- [ ] Email caiu no spam?

### ❌ "signup is disabled"
**Solução:** Em Authentication → Settings, verifique se "Enable signup" está ligado.

---

## ✅ Como Saber que Funcionou?

Quando tudo estiver funcionando:

1. **Antes do login:**
   - Botão do header mostra: **LOGIN**
   - XP/Level não aparece

2. **Depois do login:**
   - Botão do header mostra: **Start Learning**
   - XP/Level aparece no header
   - Você pode navegar normalmente

3. **Verificar usuários no Dashboard:**
   - Vá em: Authentication → Users
   - Você verá sua conta listada lá

---

## 📞 Se ainda tiver problemas

Execute o script de teste:
```bash
cd soundsfair-app
npx tsx scripts/test-auth.ts
```

Isso vai verificar se suas credenciais estão corretas.

---

## 🎯 Resumo do que você faz

1. **Abra:** https://supabase.com/dashboard/project/ebvwnpyjvbexrtqwrbkk
2. **Clique:** Authentication → Providers → Email
3. **Ligue:** Enable Email provider
4. **Desligue:** Confirm email (para facilitar testes)
5. **Save**
6. **Clique:** Authentication → URL Configuration
7. **Adicione:** Site URL e Redirect URLs
8. **Save**
9. **Teste:** http://localhost:3000/login

**Tempo estimado:** 5 minutos

**PRONTO! 🎉**
