# 🔐 Como Adicionar Variáveis de Ambiente na Vercel

**Problema Atual:** Build falha porque as variáveis do Supabase não estão configuradas
**Erro:** `Error: Missing NEXT_PUBLIC_SUPABASE_URL environment variable`

---

## 🎯 PASSO 1: Pegar as Variáveis do Supabase

### 1.1 Acessar o Dashboard do Supabase
1. Abra uma nova aba no navegador
2. Vá para: **https://app.supabase.com**
3. Faça login se necessário
4. Você verá uma lista dos seus projetos

### 1.2 Selecionar o Projeto soundsfair
1. Clique no projeto **soundsfair** (ou o nome que você deu)
2. Aguarde carregar o dashboard do projeto

### 1.3 Ir para Settings → API
1. No menu lateral esquerdo, clique em **⚙️ Settings** (ícone de engrenagem)
2. No submenu que aparece, clique em **API**
3. Você verá uma página com várias informações

### 1.4 Copiar as Variáveis Necessárias

Você vai precisar de **3 valores**. Vou te mostrar onde cada um está:

#### **Variável 1: NEXT_PUBLIC_SUPABASE_URL** ⭐ OBRIGATÓRIA
**Onde está:**
- Procure a seção **"Project URL"** ou **"URL"**
- Você verá algo como: `https://abcdefghijklmnop.supabase.co`

**Como copiar:**
1. Clique no botão de copiar ao lado da URL
2. Cole em um bloco de notas temporário
3. Rotule como: `NEXT_PUBLIC_SUPABASE_URL`

---

#### **Variável 2: NEXT_PUBLIC_SUPABASE_ANON_KEY** ⭐ OBRIGATÓRIA
**Onde está:**
- Procure a seção **"Project API keys"**
- Encontre a chave rotulada como **"anon" / "public"**
- É uma chave LONGA (parece com: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

**Como copiar:**
1. Clique no botão "Reveal" ou no ícone do olho para revelar a chave
2. Clique no botão de copiar
3. Cole em um bloco de notas temporário
4. Rotule como: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

#### **Variável 3: SUPABASE_SERVICE_ROLE_KEY** ⭐ OBRIGATÓRIA
**Onde está:**
- Na mesma seção **"Project API keys"**
- Encontre a chave rotulada como **"service_role"**
- ⚠️ **ATENÇÃO:** Esta é uma chave SECRETA - nunca compartilhe publicamente!

**Como copiar:**
1. Clique no botão "Reveal" ou no ícone do olho
2. Clique no botão de copiar
3. Cole em um bloco de notas temporário
4. Rotule como: `SUPABASE_SERVICE_ROLE_KEY`

---

### 1.5 Verificar suas Variáveis

No seu bloco de notas, você deve ter algo assim:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **Pronto!** Agora vamos adicionar na Vercel.

---

## 🎯 PASSO 2: Adicionar as Variáveis na Vercel

Você já está na página certa: https://vercel.com/igors-projects-1a6352fa/soundsfair/settings/environment-variables

### 2.1 Adicionar a PRIMEIRA variável

1. **Environment:** Deixe "All Environments" (ou escolha "Production, Preview")
2. **Key:** Digite `NEXT_PUBLIC_SUPABASE_URL`
3. **Value:** Cole o valor que você copiou do Supabase (a URL)
4. **Não clique em "Save" ainda!**
5. Clique no botão **"Add Another"** no rodapé

### 2.2 Adicionar a SEGUNDA variável

1. Um novo formulário vai aparecer embaixo
2. **Key:** Digite `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Value:** Cole a chave anon que você copiou
4. Clique em **"Add Another"** novamente

### 2.3 Adicionar a TERCEIRA variável

1. Mais um formulário vai aparecer
2. **Key:** Digite `SUPABASE_SERVICE_ROLE_KEY`
3. **Value:** Cole a chave service_role que você copiou
4. **AGORA SIM:** Clique no botão **"Save"** no topo da página

---

## 🎯 PASSO 3: Adicionar Variáveis Opcionais (Recomendado)

Se você tiver as chaves do OpenNode e Resend, adicione também:

### 3.1 OpenNode (para pagamentos Lightning)
```
Key: OPENNODE_API_KEY
Value: [sua chave do OpenNode]
```

### 3.2 Resend (para envio de emails)
```
Key: RESEND_API_KEY
Value: [sua chave do Resend]
```

### 3.3 Chaves de Admin
```
Key: ADMIN_EMAIL
Value: seu@email.com

Key: ADMIN_PASSWORD
Value: [senha segura]

Key: ADMIN_SECRET_KEY
Value: [chave secreta aleatória - mínimo 32 caracteres]
```

**Como gerar ADMIN_SECRET_KEY:**
- Use um gerador online: https://randomkeygen.com/
- Ou gere no terminal: `openssl rand -base64 32`

---

## 🎯 PASSO 4: Triggerar um Novo Deploy

Após salvar as variáveis, você precisa fazer um novo deploy:

### Opção A: Redeploy pela Interface (Mais Fácil)
1. Vá para: https://vercel.com/igors-projects-1a6352fa/soundsfair/deployments
2. Clique no último deployment (o que falhou)
3. Clique no botão **"Redeploy"** (ícone de reload)
4. Confirme clicando em **"Redeploy"** novamente

### Opção B: Push Vazio para GitHub
1. Abra o terminal
2. Navegue até o projeto:
   ```bash
   cd /mnt/c/Users/igor/projetos-claude/sites/ativos/bitcoin.com/soundsfair-app
   ```
3. Faça um commit vazio:
   ```bash
   git commit --allow-empty -m "chore: trigger Vercel redeploy with environment variables"
   git push origin main
   ```

---

## 🎯 PASSO 5: Acompanhar o Novo Build

### 5.1 Ir para Deployments
1. Acesse: https://vercel.com/igors-projects-1a6352fa/soundsfair/deployments
2. Aguarde aparecer um novo deployment
3. Ele vai mostrar:
   ```
   🟡 Building...
      Triggered X seconds ago
   ```

### 5.2 Ver os Logs
1. Clique no deployment que está "Building"
2. Role a página para ver os logs em tempo real

### 5.3 O Que Esperar Ver (Build de Sucesso)
```
✓ Compiled successfully
Running TypeScript ...
✓ Linting and checking validity of types
✓ Build completed in 84 seconds
Deployment ready!
```

### 5.4 O Que NÃO Deve Ver Mais
```
❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL environment variable
```
**Se este erro sumir, as variáveis foram configuradas corretamente!** ✅

---

## 🎯 PASSO 6: Testar o Site

Quando o status mudar para **✅ Ready**:

### 6.1 Copiar a URL do Preview
```
✅ Ready
   https://soundsfair-xyz123.vercel.app
   Deployed X minutes ago
```

### 6.2 Abrir no Navegador
1. Clique na URL ou copie e cole em uma nova aba
2. O site deve carregar!

### 6.3 Verificar Console do Navegador
1. Pressione **F12** para abrir DevTools
2. Clique na aba **"Console"**
3. ✅ **BOM:** Sem erros em vermelho relacionados ao Supabase
4. ❌ **RUIM:** Se aparecer erros de conexão com Supabase, as chaves podem estar erradas

### 6.4 Testar Páginas Principais
- [ ] Homepage: `/`
- [ ] Learning Path: `/learn`
- [ ] Lição 1: `/lessons/level-1-fiat-system`
- [ ] Calculadora DCA: `/tools/dca`

---

## 📋 CHECKLIST COMPLETO

### Configuração do Supabase:
- [ ] Acessei https://app.supabase.com
- [ ] Abri o projeto soundsfair
- [ ] Fui em Settings → API
- [ ] Copiei `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copiei `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copiei `SUPABASE_SERVICE_ROLE_KEY`

### Configuração da Vercel:
- [ ] Fui em Settings → Environment Variables
- [ ] Adicionei `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Adicionei `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Adicionei `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Cliquei em "Save"
- [ ] Triggerou um novo deploy (Redeploy ou push vazio)

### Verificação:
- [ ] Novo build iniciou
- [ ] Erro de "Missing NEXT_PUBLIC_SUPABASE_URL" sumiu
- [ ] Build passou com sucesso (✅ Ready)
- [ ] Copiei a URL do preview
- [ ] Testei o site - carrega sem erros
- [ ] Console do navegador sem erros de Supabase

---

## ❓ TROUBLESHOOTING

### Erro: "Invalid API key" ou "Invalid JWT"
**Causa:** Você copiou a chave errada ou incompleta
**Solução:**
1. Volte no Supabase
2. Revele a chave novamente
3. Copie TODA a chave (ela é muito longa!)
4. Cole novamente na Vercel
5. Salve e redeploy

### Erro: Variáveis não estão sendo reconhecidas
**Causa:** Você salvou mas não fez um novo deploy
**Solução:**
1. Vá em Deployments
2. Clique em "Redeploy" no último deployment

### Erro: Site carrega mas funcionalidades não funcionam
**Causa:** Faltam outras variáveis (OpenNode, Resend, Admin)
**Solução:**
1. Adicione as variáveis opcionais do PASSO 3
2. Redeploy

---

## 🎯 VARIÁVEIS OBRIGATÓRIAS vs OPCIONAIS

### ⭐ OBRIGATÓRIAS (site não funciona sem):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### 🟡 OPCIONAIS (funcionalidades específicas):
```
OPENNODE_API_KEY          → Pagamentos Lightning
RESEND_API_KEY            → Envio de emails
ADMIN_EMAIL               → Login admin
ADMIN_PASSWORD            → Login admin
ADMIN_SECRET_KEY          → Segurança admin
RESEND_WEBHOOK_SECRET     → Webhooks de email
OPENNODE_WEBHOOK_SECRET   → Webhooks de pagamento
```

---

## 📞 ME AVISE QUANDO:

**✅ Após adicionar as variáveis:**
```
Adicionei as 3 variáveis obrigatórias
Salvei na Vercel
Triggerou novo deploy
```

**🟡 Durante o build:**
```
Build está rodando
Está na linha: [número da linha dos logs]
```

**✅ Build com sucesso:**
```
Deploy deu certo!
URL: https://soundsfair-xyz.vercel.app
Site carrega sem erros
```

**❌ Se der erro:**
```
Erro: [mensagem de erro]
Screenshot dos logs
```

---

**🚀 Comece pelo PASSO 1 e me avise seu progresso!**
