# 📋 PLANO COMPLETO DE TESTES QA - soundsfair

**Versão:** 1.0
**Data:** Dezembro 2025
**Objetivo:** Validação completa de UX, Conteúdo e Funcionalidade
**Público-alvo:** Testadores QA / Usuários Finais

---

## 🚀 SETUP INICIAL

### Pré-requisitos
- [ ] Acesso ao projeto em: **[URL do projeto]**
- [ ] Browser moderno (Chrome, Firefox, Safari, Edge)
- [ ] Testar em Desktop E Mobile
- [ ] Anotar todos os problemas encontrados em um documento separado

### Como Iniciar
1. Acesse a homepage do projeto
2. Abra DevTools (F12) para verificar erros no console
3. Teste cada seção conforme abaixo
4. Marque cada item como ✅ ao completar

---

## 📑 ÍNDICE DE TESTES

1. [Homepage & Navegação](#1-homepage--navegação)
2. [Sistema de Aprendizado (Lições)](#2-sistema-de-aprendizado-lições)
3. [Sistema de Quiz](#3-sistema-de-quiz)
4. [Ferramentas Bitcoin](#4-ferramentas-bitcoin)
5. [Sistema Q&A com Lightning](#5-sistema-qa-com-lightning)
6. [Páginas Informativas](#6-páginas-informativas)
7. [Design & Responsividade](#7-design--responsividade)
8. [Performance](#8-performance)
9. [Acessibilidade](#9-acessibilidade)

---

## 1. HOMEPAGE & NAVEGAÇÃO

### 1.1 Carregamento da Página
- [ ] Homepage carrega em menos de 3 segundos
- [ ] Sem erros no console (F12 → Console)
- [ ] Imagens carregam corretamente
- [ ] Layout está centralizado e bem distribuído

### 1.2 Hero Section
- [ ] **Título principal é visível:** "soundsfair - Bitcoin Education Platform"
- [ ] **Subtítulo está claro:** Menciona "Fair Money" e "Economic Freedom"
- [ ] **Cores corretas:**
  - [ ] Fundo preto (#000000 ou similar)
  - [ ] Letras brancas e acentos em dourado (#FFD000)
- [ ] **CTA (Call-to-Action) buttons:**
  - [ ] Botão "Start Learning" está presente e clicável
  - [ ] Botão "Ask an Expert" está presente e clicável
  - [ ] Botões redirecionam para as páginas corretas

### 1.3 Seções Principais
- [ ] **"Why Bitcoin?"** seção está visível com 3+ pontos principais
- [ ] **"Learning Path"** mostra um preview das 9 lições
- [ ] **"Tools"** seção lista as 5 ferramentas disponíveis
- [ ] **"Continue Learning"** widget aparece (se user visitou lições)

### 1.4 Header (Navegação Superior)
- [ ] Logo está clicável e redireciona para home
- [ ] Menu de navegação funcional:
  - [ ] Home
  - [ ] Learn
  - [ ] Tools
  - [ ] Q&A
  - [ ] About
- [ ] Menu é responsivo (mobile: hamburger menu)
- [ ] Não há erros de navegação

### 1.5 Footer
- [ ] Footer está visível no final da página
- [ ] Contém links úteis e informações
- [ ] Links de redes sociais (se aplicável) funcionam
- [ ] Copyright/info legais presentes

---

## 2. SISTEMA DE APRENDIZADO (LIÇÕES)

### 2.1 Página /learn
- [ ] Página carrega corretamente
- [ ] Título "Learning Path" está visível
- [ ] **Todas as 9 lições estão listadas:**
  - [ ] Level 1: The Fiat Money System
  - [ ] Level 2: Banking System and Debt Creation
  - [ ] Level 3: Bitcoin: A Revolution Against Fiat
  - [ ] Level 4: Bitcoin and Geopolitics (Introduction)
  - [ ] Level 5: Bitcoin as Store of Value
  - [ ] Level 6: Economic Freedom & Bitcoin
  - [ ] Level 7: Bitcoin's Geopolitical Future
  - [ ] Level 8: Protection Strategies Against Fiat Collapse
  - [ ] Level 9: Conclusion on Financial Freedom

### 2.2 Cards de Lições
Para CADA lição, verificar:
- [ ] Card mostra título correto
- [ ] Card mostra dificuldade (Beginner/Intermediate/Advanced)
- [ ] Card mostra duração estimada (40-45 min)
- [ ] Card é clicável
- [ ] Botão "Start Lesson" redireciona para lição correta

### 2.3 Página Individual de Lição (Level 1: Fiat System)

#### Estrutura & Conteúdo
- [ ] **Títulos corretos:**
  - [ ] "Level 1: The Fiat Money System and Its Failures" no topo
  - [ ] "Duration: 40-45 minutes"
  - [ ] "Difficulty: Beginner"

- [ ] **Introdução:**
  - [ ] "Introduction: Money is Control" seção presente
  - [ ] Texto é claro e legível
  - [ ] "What you'll learn:" lista os 7 tópicos

- [ ] **7 Seções Principais:**
  - [ ] Section 1: What is Fiat Money? (presente e completo)
  - [ ] Section 2: History of Modern Fiat Systems (presente e completo)
  - [ ] Section 3: How Central Banks Create Money from Nothing (presente)
  - [ ] Section 4: The Inflation Machine (presente)
  - [ ] Section 5: Failures of Fiat Money Throughout History (presente)
  - [ ] Section 6: The Structure of Fiat Control (presente)
  - [ ] Section 7: Why Bitcoin Exists (presente)

#### Conteúdo Específico - FIAT SYSTEM LESSON
- [ ] **Money's Three Functions** explicadas corretamente:
  - [ ] Medium of Exchange
  - [ ] Unit of Account
  - [ ] Store of Value

- [ ] **Fiat Money Characteristics** listadas:
  - [ ] "Not backed by gold, silver, or any commodity"
  - [ ] "Declared valuable by government authority"
  - [ ] "Central banks can print unlimited quantities"

- [ ] **Bretton Woods System** explicado:
  - [ ] 1944-1971 timeframe
  - [ ] $1 = 1/35 ounce of gold
  - [ ] Post-WWII context

- [ ] **Nixon Shock (1971)** explicado:
  - [ ] Data correta: August 15, 1971
  - [ ] Explicação de "gold window" closure
  - [ ] Impacto: Dollar became pure fiat

- [ ] **Petrodollar System (1974)** explicado:
  - [ ] US-Saudi Arabia agreement
  - [ ] Oil priced in USD
  - [ ] Why it replaced gold backing

- [ ] **Inflation Math** seção:
  - [ ] 2% annual inflation table (1950-2023)
  - [ ] $1 USD = $0.05 em 2023 (correto)
  - [ ] Cálculos parecem precisos

- [ ] **Históricos de Colapsos:**
  - [ ] Zimbabwe (2008) - 89.7 sextillion% inflation
  - [ ] Venezuela (2016-2023) - 670 VEF → 3M+ VEF
  - [ ] Weimar Germany (1923) - 2.2 trillion marks

#### Formatação & Design
- [ ] Texto está bem formatado e legível
- [ ] Listas têm bullets/números corretos
- [ ] **Ênfase visual:**
  - [ ] Títulos em h2/h3 (distintos visualmente)
  - [ ] Bold/italics usados apropriadamente
  - [ ] Blockquotes destacados (ex: Alan Greenspan quote)

- [ ] **Gráficos/Imagens:**
  - [ ] Se houver placeholders de imagens, estão marcados
  - [ ] Descrição do que deveria estar ali é clara

#### Links & Referências
- [ ] "Further Reading" seção está presente ao final
- [ ] Links para livros sugeridos (The Bitcoin Standard, etc)
- [ ] Recomendações de ações estão presentes

### 2.4 Testando TODAS as 9 Lições
Para cada uma das lições 2-9, fazer teste rápido:
- [ ] **Level 2** carrega completo, sem conteúdo exposto de quiz em texto
- [ ] **Level 3** carrega completo, sem conteúdo exposto de quiz em texto
- [ ] **Level 4** carrega completo, sem conteúdo exposto de quiz em texto
- [ ] **Level 5** carrega completo, conteúdo visível
- [ ] **Level 6** carrega completo, conteúdo visível
- [ ] **Level 7** carrega completo, conteúdo visível
- [ ] **Level 8** carrega completo, conteúdo visível
- [ ] **Level 9** carrega completo (Conclusion lesson)

### 2.5 Navegação Entre Lições
- [ ] Botão "Previous Lesson" funciona (exceto na Level 1)
- [ ] Botão "Next Lesson" funciona (exceto na Level 9)
- [ ] Navegação leva às lições corretas
- [ ] Não há saltos para lições erradas

---

## 3. SISTEMA DE QUIZ

### 3.1 Componente Quiz - Level 1
- [ ] **Quiz aparece APENAS como componente interativo** (não como texto)
- [ ] "Quiz Complete!" mensagem de instrução está visível
- [ ] "You need 70% (7/10) to pass" está claro

### 3.2 Quiz Interativo - Funcionalidade
- [ ] **Primeira pergunta carrega:**
  - [ ] "What are the three primary functions of money?" está visível
  - [ ] 4 opções (A, B, C, D) estão presentes e clicáveis
  - [ ] **NÃO há resposta correta visível no texto** ✅ (CORRIGIDO)
  - [ ] **NÃO há explicação visível antes de responder** ✅ (CORRIGIDO)

### 3.3 Respondendo ao Quiz
- [ ] Clique em uma resposta seleciona a opção
- [ ] Resposta selecionada muda de cor/estilo visualmente
- [ ] Botão "Submit" ou "Check Answer" aparece
- [ ] Após responder:
  - [ ] Feedback indica se está correta/incorreta
  - [ ] Explicação aparece APÓS responder
  - [ ] Botão "Next Question" para continuar

### 3.4 Quiz Completo
- [ ] Conseguir responder todas as 10 perguntas
- [ ] Resultado final mostra:
  - [ ] Score (ex: 8/10 = 80%)
  - [ ] Pass/Fail message apropriada
  - [ ] XP ganho exibido
- [ ] Botão "Retake Quiz" disponível
- [ ] Pode retomar sem perder progresso

### 3.5 Testando Quiz em TODAS as 4 Lições
- [ ] **Level 1** Quiz funciona completo (10 perguntas)
- [ ] **Level 2** Quiz funciona completo (10 perguntas)
- [ ] **Level 3** Quiz funciona completo (10 perguntas)
- [ ] **Level 4** Quiz funciona completo (10 perguntas)

**CRÍTICO:** Nenhuma resposta correta deve estar exposta no markdown!

---

## 4. FERRAMENTAS BITCOIN

### 4.1 Página /tools
- [ ] Página carrega corretamente
- [ ] Título "Bitcoin Tools" está visível
- [ ] **5 ferramentas estão listadas:**
  - [ ] DCA Calculator
  - [ ] Satoshi Converter
  - [ ] Fear & Greed Index
  - [ ] Halving Countdown
  - [ ] What-If Calculator

### 4.2 DCA Calculator (/tools/dca)

#### Carregamento
- [ ] Página carrega em menos de 3 segundos
- [ ] Interface está limpa e intuitiva

#### Inputs
- [ ] **Amount Input:**
  - [ ] Campo para inserir valor ($)
  - [ ] Aceita números decimais
  - [ ] Valida entradas inválidas

- [ ] **Asset Selection:**
  - [ ] Bitcoin (BTC) checkbox
  - [ ] S&P 500 checkbox
  - [ ] Gold (XAU) checkbox
  - [ ] MSCI World checkbox
  - [ ] Pode selecionar múltiplos assets

- [ ] **Frequency Selection:**
  - [ ] Daily
  - [ ] Weekly
  - [ ] Biweekly
  - [ ] Monthly

- [ ] **Date Range:**
  - [ ] Start Date picker funciona
  - [ ] End Date picker funciona
  - [ ] Datas logicamente válidas

#### Cálculo
- [ ] Botão "Calculate" está visível
- [ ] Clique em Calculate:
  - [ ] Executa cálculo (loading state visível)
  - [ ] Retorna resultados em menos de 5 segundos
  - [ ] Sem erros no console

#### Resultados
- [ ] **Gráfico de Performance:**
  - [ ] Mostra comparação entre assets selecionados
  - [ ] Eixo X (tempo) está correto
  - [ ] Eixo Y (valor) está correto
  - [ ] Legenda identificar cada asset
  - [ ] Cores diferem para cada asset

- [ ] **Tabela de Resultados:**
  - [ ] Mostra total investido
  - [ ] Mostra valor final para cada asset
  - [ ] Mostra ganho/perda percentual
  - [ ] Mostra ganho/perda em $

#### CSV Export
- [ ] Botão "Export CSV" está visível
- [ ] Click em Export baixa arquivo CSV
- [ ] Arquivo pode ser aberto em Excel/Sheets
- [ ] Dados no CSV correspondem ao gráfico

#### Shareable URL
- [ ] URL muda quando calcula (parâmetros adicionados)
- [ ] URL pode ser copiada e compartilhada
- [ ] Quando compartilhada, recarrega cálculo anterior

### 4.3 Satoshi Converter (/tools/satoshi-converter)
- [ ] Carrega rapidamente
- [ ] **Conversões funcionam:**
  - [ ] BTC → USD
  - [ ] USD → BTC
  - [ ] Satoshis conversão
  - [ ] Valores são atualizados em tempo real
- [ ] Usa preço atual do Bitcoin

### 4.4 Fear & Greed Index (/tools/fear-greed-index)
- [ ] Carrega a página
- [ ] Mostra índice de medo/ganância atual
- [ ] Escala visual (verde/vermelho) está apropriada
- [ ] Atualiza dados corretamente

### 4.5 Halving Countdown (/tools/halving-countdown)
- [ ] Carrega a página
- [ ] Mostra próximo halving date
- [ ] Countdown está ativo (diminui a cada segundo)
- [ ] Informações sobre o que é halving estão presentes

### 4.6 What-If Calculator (/tools/what-if-calculator)
- [ ] Carrega a página
- [ ] Permite comparar investimentos históricos
- [ ] Resultados parecem precisos
- [ ] Interface é intuitiva

---

## 5. SISTEMA Q&A COM LIGHTNING

### 5.1 Página /qa
- [ ] Página carrega corretamente
- [ ] Título "Ask an Expert" está visível
- [ ] Explicação do sistema está clara

### 5.2 Pricing Tiers (3 opções)
- [ ] **Quick (1,000 sats):**
  - [ ] Preço exibido
  - [ ] Descrição: "24h response"
  - [ ] Botão de seleção funciona

- [ ] **Standard (5,000 sats):**
  - [ ] Preço exibido
  - [ ] Descrição: "48h expert response with video option"
  - [ ] Botão de seleção funciona

- [ ] **Deep Dive (10,000 sats):**
  - [ ] Preço exibido
  - [ ] Descrição: "168h comprehensive analysis"
  - [ ] Botão de seleção funciona

### 5.3 Formulário de Pergunta
- [ ] **Input fields:**
  - [ ] Name field funciona
  - [ ] Email field valida formato
  - [ ] Question/Category field aceita texto
  - [ ] Question details textarea funciona

- [ ] **Validação:**
  - [ ] Campos obrigatórios indicados
  - [ ] Mensagens de erro ao tentar enviar vazio
  - [ ] Email validation (formato correto)

### 5.4 Processo de Pagamento (Testnet)
- [ ] Após preencher formulário + selecionar tier:
  - [ ] Clique em "Submit & Pay"
  - [ ] Página redireciona para QR code de pagamento

- [ ] **QR Code:**
  - [ ] QR code está visível e legível
  - [ ] Contém informações de pagamento Lightning
  - [ ] Label mostra valor em sats e USD

- [ ] **Pagamento com Testnet (⚠️ se testando):**
  - [ ] Se usar wallet de testnet: consegue escanear QR
  - [ ] Consegue enviar pagamento teste
  - [ ] Sistema reconhece pagamento

### 5.5 Confirmação
- [ ] Após pagamento:
  - [ ] Página mostra "Payment Confirmed!"
  - [ ] Mensagem de próximos passos está clara
  - [ ] Instruções sobre resposta estão presentes

### 5.6 Email Confirmação (Verificar inbox/spam)
- [ ] Email de confirmação é recebido
- [ ] Email contém:
  - [ ] Pergunta que foi feita
  - [ ] Tier selecionado
  - [ ] Informações de resposta esperada
  - [ ] Design está limpo e profissional

---

## 6. PÁGINAS INFORMATIVAS

### 6.1 Página /about
- [ ] Carrega corretamente
- [ ] Título "About soundsfair" está visível
- [ ] Conteúdo explica:
  - [ ] Objetivo do projeto
  - [ ] Visão sobre Bitcoin & liberdade econômica
  - [ ] Estrutura das 9 lições
- [ ] Texto está bem formatado
- [ ] Sem erros de ortografia/gramática

### 6.2 Página /faq
- [ ] Carrega corretamente
- [ ] Título "Frequently Asked Questions" está visível
- [ ] 20+ perguntas estão listadas
- [ ] **FAQs cobrindo:**
  - [ ] O que é Bitcoin
  - [ ] O que é dinheiro fiduciário
  - [ ] Como funciona o sistema Q&A
  - [ ] Como usar as ferramentas
  - [ ] Segurança/privacidade

- [ ] **Funcionalidade:**
  - [ ] Cada FAQ é clicável/expansível
  - [ ] Resposta aparece ao clicar
  - [ ] Pode clicar novamente para recolher

### 6.3 Página /glossary
- [ ] Carrega corretamente
- [ ] Título "Bitcoin Glossary" está visível
- [ ] 50+ termos estão listados
- [ ] Termos cobrem:
  - [ ] HODL
  - [ ] Satoshi
  - [ ] Blockchain
  - [ ] Mining
  - [ ] Wallet
  - [ ] Private Key
  - [ ] Public Key
  - [ ] etc.

- [ ] **Funcionalidade:**
  - [ ] Termos estão em ordem alfabética
  - [ ] Definições são claras e concisas
  - [ ] Podem ser buscados (se search existe)

---

## 7. DESIGN & RESPONSIVIDADE

### 7.1 Cores & Brand Identity
- [ ] **Verificar em toda página:**
  - [ ] Fundo primário é preto (#000000)
  - [ ] Texto primário é branco
  - [ ] Destaque/acentos em dourado (#FFD000)
  - [ ] Cores Bitcoin (#F7931A) onde apropriado

- [ ] **Hierarquia visual:**
  - [ ] Headings parecem prominentes
  - [ ] Body text é legível
  - [ ] Links são distinguíveis

### 7.2 Desktop (1920x1080)
- [ ] Toda página carrega corretamente
- [ ] Layout não tem overflow horizontal
- [ ] Espaçamento está uniforme
- [ ] Cards/containers estão alinhados
- [ ] Nenhuma informação está oculta

### 7.3 Tablet (768x1024)
- [ ] Redimensionar para tablet size
- [ ] Layout é responsivo
- [ ] Texto permanece legível
- [ ] Buttons/inputs são clicáveis
- [ ] Imagens escalam apropriadamente

### 7.4 Mobile (375x667)
- [ ] Redimensionar para mobile size
- [ ] **Header:**
  - [ ] Logo está visível
  - [ ] Menu hamburger aparece
  - [ ] Menu hamburger é funcional

- [ ] **Conteúdo:**
  - [ ] Stack verticalmente
  - [ ] Nenhum overflow horizontal
  - [ ] Texto permanece legível

- [ ] **Buttons/Inputs:**
  - [ ] Tamanho adequado para toque (min 44x44 pixels)
  - [ ] Espaço adequado entre cliques

- [ ] **Imagens:**
  - [ ] Carregam rapidamente
  - [ ] Não causam layout shift
  - [ ] Tamanho apropriado para mobile

### 7.5 Dark Mode
- [ ] Projeto está em dark mode por padrão ✅
- [ ] Contraste está suficiente para WCAG AA
- [ ] Não há elementos que fiquem invisíveis

---

## 8. PERFORMANCE

### 8.1 Velocidade de Carregamento
Testar usando Chrome DevTools (F12 → Performance):

- [ ] **Homepage:** < 3 segundos
- [ ] **Página de Lição:** < 3 segundos
- [ ] **Página de Quiz:** < 2 segundos
- [ ] **Ferramentas (DCA):** < 3 segundos (após cálculo)
- [ ] **Página Q&A:** < 3 segundos

### 8.2 Core Web Vitals (F12 → Lighthouse)
- [ ] **Largest Contentful Paint (LCP):** < 2.5s
- [ ] **First Input Delay (FID):** < 100ms
- [ ] **Cumulative Layout Shift (CLS):** < 0.1

### 8.3 Imagens & Assets
- [ ] Imagens estão otimizadas
- [ ] Nenhuma imagem não-utilizada carregada
- [ ] Format moderno (WebP onde possível)
- [ ] Sem FOUC (Flash of Unstyled Content)

### 8.4 JavaScript Bundle
- [ ] Nenhuma erro no console (F12 → Console)
- [ ] Warnings são minimizados
- [ ] App não congela durante interações

---

## 9. ACESSIBILIDADE

### 9.1 Navegação por Teclado
- [ ] Pressionar TAB navega através dos elementos
- [ ] Ordem de TAB é lógica
- [ ] Buttons e links são focados
- [ ] Sem keyboard traps

### 9.2 Screen Reader (testar com NVDA ou similar)
- [ ] Página é navegável por screen reader
- [ ] Headings estão estruturados (H1 → H2 → H3)
- [ ] Links têm descrições significativas
- [ ] Images têm alt text apropriado
- [ ] Form labels estão associados com inputs

### 9.3 Contraste & Legibilidade
- [ ] Texto está legível (WCAG AA padrão)
- [ ] Verificar em DevTools (F12 → Lighthouse)
- [ ] Nenhum texto < 12px por padrão

### 9.4 Cor Não é Único Indicador
- [ ] Informações não dependem APENAS de cor
- [ ] Ex: Links não só cor diferente, mas também underline
- [ ] Status de erro não apenas vermelho

### 9.5 Links & Buttons
- [ ] Links têm suficiente diferenciação visual
- [ ] Buttons têm hover/active states
- [ ] Buttons têm focus states

---

## 📝 TESTES DE CONTEÚDO ESPECÍFICO

### Verificações de Precisão

#### Level 1: Fiat Money System
- [ ] Bretton Woods fecha em 1971 (correto)
- [ ] Nixon Shock = 15 de Agosto de 1971 (correto)
- [ ] Petrodollar agreement com Arábia Saudita 1974 (correto)
- [ ] Zimbabwe hyperinflation 89.7 sextillion% (correto)
- [ ] Venezuela 670 VEF → 3M+ VEF (correto)
- [ ] Weimar 2.2 trillion marks (correto)

#### Level 2: Banking System
- [ ] Fractional reserve 10% reserve requirement = 10x multiplier (correto)
- [ ] Explicação de como bancos criam dinheiro (clara)
- [ ] Debt trap explicado corretamente

#### Todas as Lições
- [ ] Nenhuma informação factualmente incorreta
- [ ] Datas históricas estão corretas
- [ ] Citações estão corretamente atribuídas
- [ ] Não há typos ou erros gramaticais
- [ ] Links para leitura complementar são válidos

---

## ✅ CHECKLIST FINAL

### Antes de Passar no QA
- [ ] Todos os testes acima foram executados
- [ ] Nenhum "show stopper" encontrado
- [ ] Documentação de problemas está completa
- [ ] Screenshots de bugs foram tirados (se houver)

### Problemas Encontrados
**[Criar documento separado anotando todos os problemas por categoria]**

Exemplo:
```
CRÍTICO:
- [ ] Quiz exposto em texto (RESOLVIDO ✅)

ALTO:
- [ ] [Problema]

MÉDIO:
- [ ] [Problema]

BAIXO:
- [ ] [Problema]
```

### Assinatura QA
- [ ] Nome do Testador: ________________
- [ ] Data: ________________
- [ ] Versão Testada: ________________
- [ ] Status: [ ] PASSOU | [ ] FALHOU | [ ] PASSOU COM OBSERVAÇÕES

---

## 🎯 CRITÉRIOS DE SUCESSO

**A aplicação passa no QA se:**

✅ Sem erros críticos (crash, data loss, security issues)
✅ Todas as funcionalidades principais funcionam
✅ UX é intuitiva e fluida
✅ Conteúdo está correto e bem formatado
✅ Responsividade funciona em desktop, tablet, mobile
✅ Performance é aceitável (< 3s load time)
✅ Acessibilidade básica está ok

**A aplicação está PRONTA PARA DEPLOY se:**

✅ Todos os critérios de sucesso atendidos
✅ Nenhum bug crítico pendente
✅ Conteúdo foi revisado e aprovado
✅ Team concordou que está pronto

---

## 📞 SUPORTE DURANTE TESTES

Se encontrar problemas:

1. **Anotar exatamente o que aconteceu**
   - URL da página
   - O que você estava fazendo
   - O que esperava acontecer
   - O que realmente aconteceu

2. **Screenshots/Screen recording**
   - Tire screenshot do problema
   - Se possível, grave vídeo mostrando o problema

3. **Informações do Browser**
   - Chrome/Firefox/Safari?
   - Versão do browser?
   - Desktop/Mobile?
   - Windows/Mac/Linux?

4. **Console errors**
   - Abra DevTools (F12)
   - Vá para Console tab
   - Copie qualquer erro vermelho

---

**Documento Versão 1.0 - Dezembro 2025**
