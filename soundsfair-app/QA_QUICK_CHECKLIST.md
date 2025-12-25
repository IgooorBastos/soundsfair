# ⚡ QUICK QA CHECKLIST - soundsfair

**Versão Rápida:** Execute os testes essenciais em ~2 horas

---

## 🚀 SETUP (5 minutos)

```bash
# 1. Clone ou navigate para o projeto
cd soundsfair-app

# 2. Instale dependências (se needed)
npm install

# 3. Inicie o servidor
npm run dev

# 4. Abra no browser
http://localhost:3000
```

---

## 📋 TESTES RÁPIDOS (por área)

### ✅ HOMEPAGE (5 min)
- [ ] Página carrega sem erros
- [ ] Hero section visível
- [ ] "Start Learning" button clicável → vai para /learn
- [ ] "Ask Expert" button clicável → vai para /qa
- [ ] Header navegação funciona (Learn, Tools, Q&A, About)
- [ ] Footer visível com links

### ✅ LEARNING PATH (15 min)
- [ ] /learn carrega com as 9 lições
- [ ] Clicar em "Start Lesson" leva à lição correta
- [ ] **Testar Level 1 completo:**
  - [ ] Página carrega
  - [ ] Conteúdo é legível (fiat, Nixon Shock, petrodollar)
  - [ ] **Quiz aparece como COMPONENTE** (não texto exposto) ✅
  - [ ] Quiz: responda 10 perguntas
  - [ ] Quiz: veja score
  - [ ] Quiz: "Retake" funciona
- [ ] **Testar 1 lição de cada (Level 2, 3, 4):**
  - [ ] Carrega
  - [ ] Sem quiz exposto em texto
  - [ ] Next/Previous buttons funcionam

### ✅ DCA CALCULATOR (10 min)
- [ ] /tools/dca carrega
- [ ] Insira valores:
  - [ ] Amount: $1000
  - [ ] Assets: Bitcoin + S&P 500
  - [ ] Frequency: Monthly
  - [ ] Dates: Last 5 years
- [ ] Clique "Calculate"
  - [ ] Gráfico aparece (< 5 seg)
  - [ ] Resultado mostra BTC vs SPY performance
- [ ] Clique "Export CSV" → arquivo baixa
- [ ] Share URL funciona

### ✅ OTHER TOOLS (5 min)
- [ ] /tools/satoshi-converter: Conversões funcionam
- [ ] /tools/fear-greed-index: Índice carrega
- [ ] /tools/halving-countdown: Countdown ativo
- [ ] /tools/what-if-calculator: Funciona

### ✅ Q&A SYSTEM (10 min)
- [ ] /qa carrega
- [ ] 3 pricing tiers visíveis (Quick, Standard, Deep Dive)
- [ ] Selecione "Quick" tier
- [ ] Preencha formulário:
  - [ ] Name: "Test User"
  - [ ] Email: "test@example.com"
  - [ ] Question: "What is Bitcoin?"
- [ ] Clique "Submit & Pay"
  - [ ] QR code aparece
  - [ ] Mostra sats e preço USD
- [ ] ⚠️ **Testnet payment (opcional):**
  - [ ] Se tiver wallet de testnet, tente pagar
  - [ ] Se pagar com sucesso, deve receber confirmação

### ✅ INFO PAGES (5 min)
- [ ] /about: Carrega, conteúdo legível
- [ ] /faq: 20+ FAQs, clicável/expansível
- [ ] /glossary: 50+ termos, ordenados alfabeticamente

### ✅ RESPONSIVIDADE (5 min)
**Desktop (1920x1080):**
- [ ] Tudo funciona, layout bonito

**Tablet (768x1024):**
- [ ] Redimensione browser
- [ ] Layout adapta
- [ ] Nenhum overflow horizontal

**Mobile (375x667):**
- [ ] Redimensione browser para mobile
- [ ] Menu hamburger aparece
- [ ] Toque em items, funcionam
- [ ] Texto legível sem zoom

### ✅ PERFORMANCE (3 min)
Abra DevTools (F12) → Console

- [ ] **Nenhum erro vermelho no console** ✅
- [ ] **Warnings são OK** (alguns avisos React são normais)
- [ ] Homepage carrega em < 3 segundos
- [ ] Lição carrega em < 3 segundos
- [ ] DCA calcula em < 5 segundos

### ✅ DESIGN & COLORS (3 min)
- [ ] Fundo preto, texto branco ✅
- [ ] Dourado (#FFD000) usado para destaque
- [ ] Botões são visíveis e clicáveis
- [ ] Links são distinguíveis (cor diferente)
- [ ] Dark mode por padrão ✅

---

## 🐛 PROBLEMA CRÍTICO JÁ CORRIGIDO

```
❌ ANTES: Quiz completo exposto em texto nas lições
✅ DEPOIS: Apenas componente interativo visível (FIXED em commit 2da11c6)
```

**Verificação:**
```bash
# Confirmar que foi corrigido:
grep -r "Correct Answer:" content/lessons/level-[1-4]*.md
# Resultado deve ser: (vazio / 0 matches)
```

---

## 📊 RESULTADO FINAL

### Se TUDO passou:
```
✅ APP ESTÁ PRONTO PARA DEPLOYMENT
```

### Se encontrou problemas:
**Classifique por severidade:**

| Severidade | Exemplos | Bloqueia Deploy? |
|-----------|----------|-----------------|
| 🔴 CRÍTICO | Crash, perda de dados, segurança | SIM |
| 🟠 ALTO | Feature não funciona, conteúdo errado | Talvez |
| 🟡 MÉDIO | UX confusa, typos | Não |
| 🟢 BAIXO | Layout menor, cosmético | Não |

---

## 📝 TEMPLATE DE PROBLEMA

Se encontrou um bug, complete isto:

```
TÍTULO: [Breve descrição]

SEVERIDADE: [ ] Crítico [ ] Alto [ ] Médio [ ] Baixo

PASSOS PARA REPRODUZIR:
1. Vá para [URL]
2. Clique em [elemento]
3. Faça [ação]

RESULTADO ESPERADO:
[O que deveria acontecer]

RESULTADO REAL:
[O que realmente aconteceu]

AMBIENTE:
- Browser: [Chrome/Firefox/Safari]
- Versão: [xx.x]
- OS: [Windows/Mac/Linux]
- Tamanho: [Desktop/Mobile]

PRINT/VIDEO:
[Anexar screenshot ou link de vídeo]

CONSOLE ERRORS:
[Copiar erros do console se houver]
```

---

## ⏱️ TEMPO ESTIMADO

- **Testes Rápidos:** 1-2 horas
- **Testes Completos:** 3-4 horas (incluindo doc detalhado)
- **Testes de Stress:** 4-6 horas (performance, edge cases)

---

## ✨ DICA DE OURO

**Teste como um usuário real:**
- Não siga o checklist mecanicamente
- Use o app como alguém aprendendo sobre Bitcoin
- Leia conteúdo, pense se faz sentido
- Experimente coisas que não estão no checklist
- Se algo parecer estranho, anote

---

**Última atualização:** Dezembro 2025
**Status:** Pronto para testes
