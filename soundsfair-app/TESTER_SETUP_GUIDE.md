# 🧪 GUIA COMPLETO DE SETUP PARA TESTADORES

**Para:** Testadores QA / Beta Testers
**Objetivo:** Ter o projeto rodando localmente em 10 minutos

---

## ✅ PRÉ-REQUISITOS

Você precisa ter instalado:

### 1. Git
**Windows:**
- Download: https://git-scm.com/download/win
- Instale com opções padrão

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git
```

### 2. Node.js (v18+)
**Verificar versão atual:**
```bash
node --version
# Deve ser v18.x.x ou maior
```

**Se não tem:**
- Windows/Mac: https://nodejs.org/ (baixar LTS)
- Linux:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Um editor de código (opcional)
- VS Code: https://code.visualstudio.com/ (recomendado)
- Sublime Text, Atom, etc.

---

## 📥 PASSO 1: CLONE O PROJETO

### Opção A: Se tem acesso ao repositório GitHub

```bash
# 1. Abra terminal/PowerShell
# 2. Navegue para onde quer guardar o projeto:
cd ~/projetos
# ou
cd C:\Users\seu_usuario\Documents

# 3. Clone o repositório:
git clone https://github.com/SEU_USUARIO/soundsfair-bitcoin.git

# 4. Entre na pasta:
cd soundsfair-bitcoin/soundsfair-app

# 5. Veja os arquivos:
ls -la
```

### Opção B: Se recebeu como arquivo ZIP

```bash
# 1. Descompacte o arquivo ZIP
# 2. Abra terminal na pasta descompactada:
cd caminho/para/soundsfair-app

# 3. Veja os arquivos:
ls -la
# Deve ver: package.json, next.config.ts, app/, content/, etc.
```

---

## 📦 PASSO 2: INSTALE DEPENDÊNCIAS

```bash
# Na pasta soundsfair-app, execute:
npm install

# Você verá:
# - Downloading packages...
# - Installing dependencies...
# - [########..........] 45% (pode levar 2-5 minutos)

# Quando terminar, você verá:
# added 350 packages, and audited 351 packages
```

**⚠️ Se encontrar erros:**

```bash
# Tente limpar cache:
npm cache clean --force

# Depois:
npm install
```

---

## 🚀 PASSO 3: INICIE O SERVIDOR

```bash
# Execute:
npm run dev

# Você verá algo como:
# ▲ Next.js 14.0.0
# - Local:        http://localhost:3000
# - Environments: .env.local
#
# ✓ Ready in 2.1s
```

---

## 🌐 PASSO 4: ABRA NO NAVEGADOR

### Método 1: Click no link (mais fácil)
- Veja a linha `Local:        http://localhost:3000`
- CTRL+Click (Windows/Linux) ou CMD+Click (Mac) no link
- Ou copie-cole manualmente

### Método 2: Navegador manual
1. Abra seu navegador (Chrome, Firefox, Safari)
2. Vá para: `http://localhost:3000`
3. Pressione ENTER

**Você deve ver a homepage com:**
- Logo soundsfair no topo
- "soundsfair - Bitcoin Education Platform" como título
- Fundo preto, texto branco, acentos em dourado
- Botões "Start Learning" e "Ask an Expert"

---

## 🧪 PASSO 5: COMECE A TESTAR

### Teste Rápido (5 minutos)

1. **Homepage:**
   - [ ] Página carrega
   - [ ] Clicar "Start Learning" vai para `/learn`
   - [ ] Clicar "Ask Expert" vai para `/qa`

2. **Learning Page:**
   - [ ] 9 lições estão listadas
   - [ ] Clicar "Start Lesson" abre primeira lição

3. **Level 1 Lesson:**
   - [ ] Conteúdo sobre dinheiro fiduciário carrega
   - [ ] Scroll para baixo, encontra seção "Quiz"
   - [ ] Quiz aparece como componente interativo
   - [ ] Tente responder uma pergunta

4. **DCA Calculator:**
   - [ ] Vá para `/tools/dca` (clique em "Tools" → "DCA Calculator")
   - [ ] Insira $1000, selecione Bitcoin
   - [ ] Clique "Calculate"
   - [ ] Gráfico aparece

### Teste Completo

Siga o **QA_QUICK_CHECKLIST.md** (versão curta)
ou
**QA_TEST_PLAN.md** (versão completa)

---

## 🛠️ DICAS ÚTEIS DURANTE OS TESTES

### Abrir Developer Tools
```
Windows/Linux: F12
Mac: Cmd + Option + I
```

**Aba Console:** Mostra erros
- Se vir mensagens **vermelhas** = problema!
- Mensagens **amarelas** = warnings (OK)
- Sem mensagens = bom sinal!

### Limpar Cache do Navegador
Se vê conteúdo antigo:
1. Abra DevTools (F12)
2. Clique direito no botão Refresh
3. Selecione "Empty cache and hard reload"

### Testar Responsividade (Mobile)
1. Abra DevTools (F12)
2. Clique no ícone "Mobile" (smartphone)
3. Selecione device (iPhone 12, Pixel 5, etc)
4. Teste o site em mobile

---

## 🔧 PROBLEMAS COMUNS & SOLUÇÕES

### Problema 1: "npm not found"
```
❌ Erro: 'npm' is not recognized as an internal or external command

✅ Solução:
1. Node.js não está instalado
2. Reinstale Node.js
3. Feche terminal e abra novamente
4. Teste: npm --version
```

### Problema 2: "Port 3000 already in use"
```
❌ Erro: Error: listen EADDRINUSE: address already in use :::3000

✅ Solução (opção A - mude porta):
npm run dev -- -p 3001
# Acesse http://localhost:3001

✅ Solução (opção B - mate processo):
# Windows:
netstat -ano | findstr :3000
taskkill /PID XXXX /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Problema 3: "Module not found"
```
❌ Erro: Error: Cannot find module 'next'

✅ Solução:
npm install
# Roda novamente
```

### Problema 4: Página em branco
```
❌ Vê página branca, sem conteúdo

✅ Solução:
1. Abra DevTools (F12 → Console)
2. Veja se tem erros vermelhos
3. Se sim, copie o erro completo
4. Relate para time
5. Tente: npm run dev (restart)
```

### Problema 5: Quiz não funciona
```
❌ Quiz não carrega ou não responde

✅ Solução:
1. Abra DevTools (F12 → Console)
2. Procure por erros vermelhos
3. Hard refresh: Ctrl+Shift+R
4. Se ainda não funcionar, relate
```

---

## 📝 DURANTE OS TESTES

### Mantenha um Log
```
Data: Dezembro 15, 2025
Testador: João Silva
Versão: v1.0

TESTES PASSADOS:
✅ Homepage carrega
✅ Learn page funciona
✅ Level 1 abre
...

PROBLEMAS ENCONTRADOS:
🔴 Quiz exposto em texto - FIXED ✅
🟡 Typo em Level 3 - "recieve" deveria ser "receive"
...
```

### Tire Screenshots
Se encontrar um problema:
1. Windows: `Print Screen` → paste em Paint/Word
2. Mac: `Cmd + Shift + 4` → select área
3. Linux: `Shift + Print Screen`

### Grave Vídeo (se possível)
- Windows 10+: `Windows + G` (Xbox Game Bar)
- Mac: QuickTime (⌘ + Space → QuickTime)
- Chrome: Extensão "Loom"

---

## 🎯 CHECKLIST FINAL ANTES DE TESTAR

Antes de começar, confirme:

- [ ] Node.js está instalado (`node --version` retorna v18+)
- [ ] npm está instalado (`npm --version`)
- [ ] Projeto foi clonado/extraído
- [ ] Executou `npm install` (sem erros)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Browser abre `http://localhost:3000` sem erros
- [ ] Consegue clicar em botões e navegar

---

## 📞 PRECISA DE AJUDA?

### Passos para relatar problema:

1. **Anote exatamente:**
   - URL que estava
   - O que fez
   - O que esperava
   - O que aconteceu

2. **Copie erro do console:**
   - Abra DevTools (F12)
   - Vá para Console
   - Procure por texto vermelho
   - Copie o erro completo

3. **Screenshot/vídeo:**
   - Se possível, tire print do problema

4. **Informações:**
   - Browser (Chrome? Firefox? Safari?)
   - OS (Windows? Mac? Linux?)
   - Tamanho de tela (Desktop/Tablet/Mobile?)

5. **Relate para:**
   - [EMAIL DO RESPONSÁVEL]
   - Ou abra issue no GitHub

---

## ✅ VOCÊ ESTÁ PRONTO!

Agora:

1. ✅ Seu projeto está rodando localmente
2. ✅ Você tem os guias de teste
3. ✅ Você sabe como relatar problemas
4. ✅ Comece a testar!

**Tempo estimado para ler este guia:** 5 minutos
**Tempo para setup completo:** 10 minutos
**Tempo para testes:** 1-4 horas (depende da profundidade)

---

## 🎓 PRÓXIMOS PASSOS

1. **Execute `npm run dev`**
2. **Abra `http://localhost:3000`**
3. **Siga QA_QUICK_CHECKLIST.md** (começo rápido)
4. **Ou siga QA_TEST_PLAN.md** (completo)
5. **Relate todos os problemas encontrados**

---

**Boa sorte com os testes! 🚀**

Qualquer dúvida, volte a este guia ou pergunte ao time.

---

**Última atualização:** Dezembro 2025
