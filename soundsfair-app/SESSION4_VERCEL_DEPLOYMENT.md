# soundsfair - Sessão 4: Deploy no Vercel (Guia Passo a Passo)

**Data:** 17 de Dezembro de 2025
**Status:** Pronto para Deploy em Produção
**Tempo Estimado:** 60-90 minutos

⚠️ **IMPORTANTE:** Execute estes passos NO SEU navegador (não via Claude Code)

---

## 🎯 Objetivo da Sessão 4

Fazer deploy do **soundsfair** em produção no Vercel e validar tudo funcionando!

**O que vamos fazer:**
1. ✅ Importar projeto do GitHub no Vercel
2. ✅ Configurar 11 environment variables
3. ✅ Fazer deploy em produção
4. ✅ Executar smoke tests
5. ✅ Verificar site funcionando 100%

---

## 📋 ETAPA 1: Preparação (5 min)

### **1.1 Verificar GitHub**

1. Acesse: https://github.com/IgooorBastos/soundsfair
2. Verifique que o código está atualizado
3. Últimos commits devem incluir:
   - `chore: add database verification script for deployment checks`
   - `security: protect credential documentation files in gitignore`

✅ **Código está no GitHub!**

### **1.2 Ter Credenciais em Mãos**

Você vai precisar copiar e colar estas variáveis. Tenha o arquivo `.env.local` aberto:

```bash
# Localização do arquivo:
C:\Users\igor\projetos-claude\sites\ativos\bitcoin.com\soundsfair-app\.env.local
```

**Ou use os valores abaixo que eu já separei para você:**

---

## 📋 ETAPA 2: Importar Projeto no Vercel (10 min)

### **2.1 Acessar Vercel Dashboard**

1. Acesse: https://vercel.com/dashboard
2. Faça login com sua conta (já criada na Sessão 1)
3. Você deve ver o projeto **soundsfair-prod** que criamos antes

### **2.2 Opção A: Se o Projeto JÁ EXISTE (soundsfair-prod)**

**Se você já vê o projeto "soundsfair-prod" no dashboard:**

1. Clique no projeto **soundsfair-prod**
2. Vá em **Settings** (menu lateral esquerdo)
3. Vá em **Git** (submenu)
4. Verifique se está conectado ao repositório: `IgooorBastos/soundsfair`
5. Verifique se o branch é: `main`

**Resultado esperado:**
```
✅ Repository: IgooorBastos/soundsfair
✅ Branch: main
✅ Auto-deploy: Enabled
```

**Prossiga para ETAPA 3!**

### **2.3 Opção B: Se o Projeto NÃO EXISTE (criar novo)**

**Se o projeto não existe ou você quer recriá-lo:**

1. No Vercel Dashboard, clique em **"Add New..."** (botão no canto superior direito)
2. Selecione **"Project"**
3. Selecione **"Import Git Repository"**

#### **Conectar GitHub:**

4. Se aparecer "Configure GitHub App":
   - Clique em **"Configure GitHub App"**
   - Autorize o Vercel a acessar seus repositórios
   - Selecione: **"Only select repositories"**
   - Escolha: **"IgooorBastos/soundsfair"**
   - Clique em **"Install & Authorize"**

5. De volta ao Vercel:
   - Você deve ver o repositório **"IgooorBastos/soundsfair"** listado
   - Clique em **"Import"** ao lado do repositório

#### **Configurar Projeto:**

6. **Project Name:**
   - Digite: `soundsfair-prod`
   - (Ou deixe `soundsfair` se preferir)

7. **Framework Preset:**
   - Deve detectar automaticamente: **Next.js**
   - Deixe como está ✅

8. **Root Directory:**
   - **IMPORTANTE:** Clique em **"Edit"**
   - Digite: `soundsfair-app`
   - (Porque o projeto Next.js está na pasta soundsfair-app, não na raiz)

9. **Build and Output Settings:**
   - Deixe tudo padrão:
     - Build Command: `next build`
     - Output Directory: `.next`
     - Install Command: `npm install`

10. **NÃO CLIQUE EM "DEPLOY" AINDA!**
    - Antes precisamos configurar as **Environment Variables**
    - Vá para a seção "Environment Variables" na mesma página

**Prossiga para ETAPA 3!**

---

## 📋 ETAPA 3: Configurar Environment Variables (15 min)

**CRÍTICO:** O deploy só vai funcionar se TODAS as 11 variáveis estiverem configuradas!

### **3.1 Adicionar Variáveis (uma por uma)**

Na seção **"Environment Variables"** da página de import do Vercel:

#### **Variável 1: NEXT_PUBLIC_SITE_URL**

1. **Key:** `NEXT_PUBLIC_SITE_URL`
2. **Value:**
   ```
   https://soundsfair-prod.vercel.app
   ```
   (Ou use o domínio que o Vercel vai gerar)
3. **Environment:** Selecione **Production, Preview, Development** (todas)
4. Clique em **"Add"**

#### **Variável 2: NEXT_PUBLIC_SITE_NAME**

1. **Key:** `NEXT_PUBLIC_SITE_NAME`
2. **Value:** `soundsfair`
3. **Environment:** Todas (Production, Preview, Development)
4. Clique em **"Add"**

#### **Variável 3: NEXT_PUBLIC_APP_URL**

1. **Key:** `NEXT_PUBLIC_APP_URL`
2. **Value:**
   ```
   https://soundsfair-prod.vercel.app
   ```
3. **Environment:** Todas
4. Clique em **"Add"**

#### **Variável 4: NEXT_PUBLIC_SUPABASE_URL**

1. **Key:** `NEXT_PUBLIC_SUPABASE_URL`
2. **Value:**
   ```
   https://qqoykizmbkznfiuvqdlu.supabase.co
   ```
3. **Environment:** Todas
4. Clique em **"Add"**

#### **Variável 5: NEXT_PUBLIC_SUPABASE_ANON_KEY**

1. **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. **Value:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxb3lraXptYmt6bmZpdXZxZGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTY0MjMsImV4cCI6MjA4MTUzMjQyM30.ES6QnIbwgtemBN9PubsJN6bon6zEbf5f6GqXX67jM1o
   ```
3. **Environment:** Todas
4. Clique em **"Add"**

#### **Variável 6: SUPABASE_SERVICE_ROLE_KEY** ⚠️ SECRETA

1. **Key:** `SUPABASE_SERVICE_ROLE_KEY`
2. **Value:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxb3lraXptYmt6bmZpdXZxZGx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk1NjQyMywiZXhwIjoyMDgxNTMyNDIzfQ.o8u_eqzujmSt6Hp3Zb-Ga9JV_liMJJxF0MYH2jTDzok
   ```
3. **Environment:** **APENAS Production** (não adicione em Preview/Development por segurança)
4. Clique em **"Add"**

⚠️ **ATENÇÃO:** Esta chave é SECRETA! Só deve estar em Production.

#### **Variável 7: DATABASE_URL** (Opcional - útil para migrations)

1. **Key:** `DATABASE_URL`
2. **Value:**
   ```
   postgresql://postgres:DyUYdAffDeCG6Zow@db.qqoykizmbkznfiuvqdlu.supabase.co:5432/postgres
   ```
3. **Environment:** Apenas Production
4. Clique em **"Add"**

#### **Variável 8: OPENNODE_API_KEY**

1. **Key:** `OPENNODE_API_KEY`
2. **Value:**
   ```
   66742ef7-befc-4924-b5e7-877127bc5524
   ```
3. **Environment:** Todas (ou apenas Production se quiser ser mais restritivo)
4. Clique em **"Add"**

#### **Variável 9: RESEND_API_KEY**

1. **Key:** `RESEND_API_KEY`
2. **Value:**
   ```
   re_UZgKXD5o_FMSPvT8q3uPhTpugqKvYfixz
   ```
3. **Environment:** Todas
4. Clique em **"Add"**

#### **Variável 10: ADMIN_EMAIL**

1. **Key:** `ADMIN_EMAIL`
2. **Value:**
   ```
   igorbast@gmail.com
   ```
3. **Environment:** Todas
4. Clique em **"Add"**

#### **Variável 11: ADMIN_PASSWORD** ⚠️ SECRETA

1. **Key:** `ADMIN_PASSWORD`
2. **Value:**
   ```
   UaiutSFrPRGinfQAaSrZTJNdAGDTx03a/5XrnRnqqyo=
   ```
3. **Environment:** **APENAS Production**
4. Clique em **"Add"**

#### **Variável 12: ADMIN_SESSION_SECRET** ⚠️ SECRETA

1. **Key:** `ADMIN_SESSION_SECRET`
2. **Value:**
   ```
   dad8cc31ff1cd651c41f8ebec06237683a5b2ea2d2eaa44cfaf35cd65ec7b85f46662080ca80d0888e7c12ddf3d51413443be0768e75b3b4f76ed7f5fd0a7604
   ```
3. **Environment:** **APENAS Production**
4. Clique em **"Add"**

### **3.2 Verificar Todas as Variáveis**

Confira que você adicionou **TODAS** as 12 variáveis:

```
✅ NEXT_PUBLIC_SITE_URL
✅ NEXT_PUBLIC_SITE_NAME
✅ NEXT_PUBLIC_APP_URL
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY (apenas Production)
✅ DATABASE_URL (opcional, apenas Production)
✅ OPENNODE_API_KEY
✅ RESEND_API_KEY
✅ ADMIN_EMAIL
✅ ADMIN_PASSWORD (apenas Production)
✅ ADMIN_SESSION_SECRET (apenas Production)
```

**Se algo estiver faltando, adicione agora antes de fazer deploy!**

---

## 📋 ETAPA 4: Fazer Deploy (10 min)

### **4.1 Iniciar Deploy**

1. Revise todas as configurações:
   - ✅ Root Directory: `soundsfair-app`
   - ✅ Framework: Next.js
   - ✅ Environment Variables: 12 variáveis configuradas

2. Clique em **"Deploy"** (botão azul no final da página)

### **4.2 Aguardar Build**

Você vai ver uma tela com logs do build em tempo real:

```
Cloning repository...
Installing dependencies...
Running build...
Generating static pages...
Finalizing...
```

**Tempo esperado:** 3-5 minutos

### **4.3 Verificar Build**

**Se o build der SUCESSO:**
```
✅ Build completed successfully!
✅ Deployment ready
✅ URL: https://soundsfair-prod.vercel.app
```

**Clique no link da URL** ou clique em **"Visit"**

### **4.4 Se o Build FALHAR**

Se der erro, **NÃO entre em pânico**:

1. Clique em **"Build Logs"** para ver detalhes do erro
2. Erros comuns:
   - **Missing environment variables:** Volte para ETAPA 3 e adicione a variável faltante
   - **TypeScript errors:** Isso não deve acontecer (já verificamos antes)
   - **Module not found:** Execute `npm install` localmente e faça um novo commit

3. Para refazer o deploy:
   - Vá em **Deployments** (menu lateral)
   - Clique em **"Redeploy"** no último deployment

---

## 📋 ETAPA 5: Smoke Tests em Produção (20 min)

Agora vamos testar o site em **PRODUÇÃO** para garantir que tudo funciona!

### **5.1 Testar Homepage**

1. Acesse: https://soundsfair-prod.vercel.app (ou a URL que o Vercel gerou)

2. **Você deve ver:**
   - [ ] Design preto (#000000) + amarelo (#FFD000)
   - [ ] Logo "soundsfair" no header
   - [ ] Hero section com título sobre Bitcoin
   - [ ] Navegação funcionando
   - [ ] Footer com links

3. **Abra DevTools (F12) → Console:**
   - [ ] Sem erros vermelhos críticos
   - [ ] Pode ter warnings (OK)

**Resultado esperado:**
```
✅ Homepage carrega em < 3 segundos
✅ Design correto
✅ Sem erros no console
```

### **5.2 Testar Database (Supabase)**

#### **Glossário:**
1. Acesse: https://soundsfair-prod.vercel.app/glossary
2. **Você deve ver:**
   - [ ] Lista de 62 termos Bitcoin
   - [ ] Cada termo com definição
   - [ ] Links funcionando

#### **FAQ:**
1. Acesse: https://soundsfair-prod.vercel.app/faq
2. **Você deve ver:**
   - [ ] Lista de 20 perguntas frequentes
   - [ ] Respostas ao expandir
   - [ ] Conteúdo carregado

#### **Lições:**
1. Acesse: https://soundsfair-prod.vercel.app/lessons
2. **Você deve ver:**
   - [ ] 9 lições listadas (Level 1 a 9)
   - [ ] Clique em Level 1
   - [ ] Lição abre com conteúdo completo
   - [ ] Quiz no final da lição

**Resultado esperado:**
```
✅ Glossário: 62 termos carregados
✅ FAQ: 20 perguntas carregadas
✅ Lições: 9 níveis funcionando
✅ Conexão Supabase OK
```

### **5.3 Testar Admin Dashboard**

1. Acesse: https://soundsfair-prod.vercel.app/admin/login

2. **Faça login com:**
   - Email: `igorbast@gmail.com`
   - Password: `UaiutSFrPRGinfQAaSrZTJNdAGDTx03a/5XrnRnqqyo=`

3. **Você deve:**
   - [ ] Login bem-sucedido
   - [ ] Ser redirecionado para `/admin/queue`
   - [ ] Ver dashboard com "Question Queue"
   - [ ] Ver contador "0 paid questions"

4. **Teste logout:**
   - [ ] Clique em "Logout"
   - [ ] Deve voltar para página de login
   - [ ] Tente acessar `/admin/queue` sem login
   - [ ] Deve redirecionar para login

**Resultado esperado:**
```
✅ Admin login funciona
✅ Dashboard acessível
✅ Sessão persiste
✅ Logout funciona
✅ Proteção de rotas OK
```

### **5.4 Testar Ferramentas Bitcoin**

#### **1. DCA Calculator:**
1. Acesse: https://soundsfair-prod.vercel.app/tools/dca
2. Preencha:
   - Initial investment: $1000
   - Monthly: $100
   - Start date: 2020-01-01
   - Frequency: Monthly
3. Clique "Calculate"
4. **Você deve ver:**
   - [ ] Gráfico com evolução do investimento
   - [ ] Valores calculados (total investido, valor atual, ROI)
   - [ ] Botão "Export CSV" funcional

#### **2. Satoshi Converter:**
1. Acesse: https://soundsfair-prod.vercel.app/tools/satoshi-converter
2. Teste conversões:
   - Digite 100000 sats → deve converter para BTC e USD
   - Digite 1 BTC → deve converter para sats e USD
3. **Você deve ver:**
   - [ ] Conversões em tempo real
   - [ ] Preço BTC atual (via CoinCap API)

#### **3. Fear & Greed Index:**
1. Acesse: https://soundsfair-prod.vercel.app/tools/fear-greed-index
2. **Você deve ver:**
   - [ ] Índice atual (número + texto)
   - [ ] Gráfico histórico (30 dias)
   - [ ] Explicação dos níveis

#### **4. Halving Countdown:**
1. Acesse: https://soundsfair-prod.vercel.app/tools/halving-countdown
2. **Você deve ver:**
   - [ ] Countdown em tempo real (atualiza a cada segundo)
   - [ ] Próximo halving: April 15, 2028
   - [ ] Progress bar
   - [ ] Block atual

#### **5. What-If Calculator:**
1. Acesse: https://soundsfair-prod.vercel.app/tools/what-if-calculator
2. Preencha:
   - Amount: $1000
   - Date: 2015-01-01
3. Clique "Calculate"
4. **Você deve ver:**
   - [ ] Valor atual (ex: $361,447)
   - [ ] ROI percentual
   - [ ] BTC adquirido

**Resultado esperado:**
```
✅ DCA Calculator: Funcionando
✅ Satoshi Converter: Conversões OK
✅ Fear & Greed: Índice carregado
✅ Halving Countdown: Timer rodando
✅ What-If Calculator: Cálculos precisos
✅ Todas as 5 ferramentas funcionais
```

### **5.5 Testar Performance**

1. **Abra DevTools (F12) → Network tab**
2. Recarregue a homepage (Ctrl+F5)
3. Verifique:
   - [ ] Tempo de carregamento < 3 segundos
   - [ ] Requests para Supabase: 200 OK
   - [ ] Requests para CoinCap: 200 OK
   - [ ] Sem erros 404 ou 500

4. **Teste em diferentes dispositivos:**
   - [ ] Desktop/Laptop
   - [ ] Mobile (Chrome DevTools → Toggle device toolbar)

**Resultado esperado:**
```
✅ Performance: Rápido (< 3s)
✅ Mobile: Responsivo
✅ APIs: Todas conectadas
✅ Sem erros HTTP
```

---

## 📋 ETAPA 6: Configurações Finais (5 min)

### **6.1 Verificar Domínio**

1. No Vercel Dashboard, vá no seu projeto
2. Vá em **Settings → Domains**
3. Você deve ver:
   - **Production Domain:** `soundsfair-prod.vercel.app`
   - Status: ✅ Active

4. **Opcional:** Se você tiver um domínio custom (ex: soundsfair.com):
   - Clique em **"Add Domain"**
   - Digite seu domínio
   - Siga as instruções de DNS

### **6.2 Habilitar Analytics (Opcional)**

1. No Vercel Dashboard, vá em **Analytics**
2. Clique em **"Enable Analytics"** (free tier)
3. Isso vai te dar:
   - Visitantes únicos
   - Page views
   - Performance metrics

---

## ✅ CHECKLIST FINAL - DEPLOYMENT

### **Vercel:**
- [ ] Projeto importado do GitHub
- [ ] Root directory: `soundsfair-app`
- [ ] Framework: Next.js detectado
- [ ] 12 environment variables configuradas
- [ ] Deploy bem-sucedido (build passou)
- [ ] URL ativa: https://soundsfair-prod.vercel.app

### **Smoke Tests em Produção:**
- [ ] Homepage carrega corretamente
- [ ] Design preto + amarelo aplicado
- [ ] Glossário: 62 termos carregados
- [ ] FAQ: 20 perguntas carregadas
- [ ] Lições: 9 níveis funcionando
- [ ] Admin login funciona
- [ ] Admin dashboard acessível
- [ ] DCA Calculator funciona
- [ ] Satoshi Converter funciona
- [ ] Fear & Greed Index funciona
- [ ] Halving Countdown funciona
- [ ] What-If Calculator funciona
- [ ] Performance: < 3 segundos
- [ ] Mobile: Responsivo
- [ ] Sem erros críticos

### **APIs Externas:**
- [ ] CoinCap API conectada (preço BTC)
- [ ] Supabase conectado (database)
- [ ] Fear & Greed API conectada
- [ ] Todas as requisições: 200 OK

---

## 🎉 SE TUDO PASSOU

**PARABÉNS! Seu site está NO AR! 🚀**

Você tem agora:
- ✅ Site em produção: https://soundsfair-prod.vercel.app
- ✅ Database configurado (Supabase)
- ✅ Pagamentos testnet (OpenNode)
- ✅ Emails configurados (Resend)
- ✅ Admin dashboard funcional
- ✅ Todas as ferramentas Bitcoin funcionando
- ✅ Performance otimizada
- ✅ Segurança implementada

**O que você pode fazer agora:**
1. ✅ Compartilhar o link com outras pessoas
2. ✅ Testar fluxo completo de Q&A (testnet)
3. ✅ Criar conteúdo educacional
4. ✅ Monitorar analytics
5. ✅ Quando estiver pronto: Migrar OpenNode para LIVE (produção real)

---

## ⚠️ SE ALGO FALHOU

### **Problema: Build Failed**

**Erro comum:** "Missing environment variable"
- **Solução:** Vá em Settings → Environment Variables e adicione a variável faltante
- Depois vá em Deployments → Redeploy

**Erro comum:** "Module not found"
- **Solução:** Verifique se o Root Directory está: `soundsfair-app`
- Se ainda assim falhar, execute localmente: `npm install` e faça commit

### **Problema: Homepage carrega mas sem dados**

**Sintoma:** Glossário/FAQ/Lições vazios
- **Solução:** Verifique environment variables do Supabase:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Abra DevTools → Console e veja se há erros

### **Problema: Admin login não funciona**

**Sintoma:** "Invalid credentials"
- **Solução:** Verifique environment variables:
  - `ADMIN_EMAIL=igorbast@gmail.com`
  - `ADMIN_PASSWORD=UaiutSFrPRGinfQAaSrZTJNdAGDTx03a/5XrnRnqqyo=`
  - `ADMIN_SESSION_SECRET=dad8cc31...`
- Certifique-se que estão configuradas APENAS em Production

### **Problema: Ferramentas não calculam**

**Sintoma:** DCA Calculator ou What-If não mostra resultados
- **Solução:** Verifique conexão com CoinCap API
  - Abra DevTools → Network → veja se requisições para `api.coincap.io` estão com status 200
  - Pode ser rate limit (aguarde 1 minuto e tente novamente)

### **Problema: Site muito lento**

**Sintoma:** Homepage demora > 5 segundos
- **Solução:**
  - Verifique no Vercel Dashboard → Analytics → Web Vitals
  - Pode ser problema temporário de CDN (aguarde alguns minutos)
  - Limpe cache do navegador (Ctrl+Shift+Delete)

---

## 📊 Próximos Passos Opcionais

**Após deploy bem-sucedido, você pode:**

1. **Domínio Custom** (se você tiver):
   - Compre um domínio (ex: soundsfair.com)
   - Configure DNS no Vercel
   - SSL automático via Vercel

2. **Migrar OpenNode para Produção:**
   - Crie conta LIVE no OpenNode
   - Complete KYC
   - Gere nova API key (produção)
   - Atualize `OPENNODE_API_KEY` no Vercel

3. **Configurar Domínio no Resend:**
   - Adicione seu domínio no Resend
   - Configure DNS (SPF, DKIM, DMARC)
   - Emails vão sair de noreply@seudominio.com

4. **Monitoramento:**
   - Habilite Vercel Analytics
   - Configure alertas de erro
   - Monitore performance

5. **SEO:**
   - Configure sitemap.xml
   - Adicione meta tags
   - Google Search Console

---

## 💡 Comandos Úteis

### **Fazer Redeploy (sem mudanças no código):**
1. Vercel Dashboard → Deployments
2. Clique em "..." no último deployment
3. Clique em "Redeploy"

### **Ver Logs de Produção:**
1. Vercel Dashboard → Deployments
2. Clique no deployment ativo
3. Clique em "Build Logs" ou "Function Logs"

### **Adicionar/Editar Environment Variable:**
1. Vercel Dashboard → Settings → Environment Variables
2. Edite a variável desejada
3. **IMPORTANTE:** Após editar, faça um Redeploy para aplicar

### **Rollback para Versão Anterior:**
1. Vercel Dashboard → Deployments
2. Encontre o deployment antigo que funcionava
3. Clique em "..." → "Promote to Production"

---

## 📚 Recursos Úteis

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Status: https://vercel.com/status

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs

**APIs:**
- CoinCap: https://docs.coincap.io
- OpenNode: https://developers.opennode.com
- Resend: https://resend.com/docs

---

**Tempo Total Estimado:** 60-90 minutos

**Quando completar todos os testes, me confirme:**
- ✅ "Deploy completo! Site funcionando!"
- ✅ "Todos os smoke tests passaram!"
- ✅ "soundsfair está no ar! 🚀"

---

**Última Atualização:** 17 de Dezembro de 2025
**Criado por:** Claude Code
