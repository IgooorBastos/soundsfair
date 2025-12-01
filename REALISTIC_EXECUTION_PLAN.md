# SOUNDSFAIR - Plano de Execução Realista
## Ajustado para Budget <$5K | Skills Intermediárias | 15-25h/semana

**Versão:** 2.0 - Realista e Executável
**Data:** 25 Novembro 2024
**Status:** ✅ APROVADO PARA EXECUÇÃO
**Preparado para:** Igor

---

## 🎯 PERFIL DO PROJETO (Sua Realidade)

### ✅ Recursos Disponíveis
- **Budget Total**: <$5.000 (R$25.000)
- **Skills Técnicas**: Intermediário em programação (pode aprender)
- **Tempo Semanal**: 15-25 horas (projeto part-time sério)
- **Timeline**: 9-12 meses até lançamento
- **Expectativa**: Sustentável em 12-24 meses

### 🎯 Estratégias Definidas
- **Tradução**: IA (Claude/GPT) + Revisor freelancer barato ($500-1K)
- **Desenvolvimento**: DIY (você aprende e faz)
- **Design**: Templates premium customizados ($300-500)
- **Conteúdo**: Híbrido (IA + sua curadoria)

---

## 💰 BUDGET BREAKDOWN (Total: $4.800)

| Categoria | Item | Custo | Prioridade |
|-----------|------|-------|------------|
| **Legal & Compliance** | Templates legais + consulta básica | $300-500 | 🔴 CRÍTICO |
| **Domínio & Hosting** | Domínio (3 anos) + Vercel Pro opcional | $50-150 | 🔴 CRÍTICO |
| **Design** | Tailwind UI + Logo Fiverr | $350-450 | 🔴 CRÍTICO |
| **Tradução** | Claude AI + Revisor nativo freelancer | $500-1.000 | 🔴 CRÍTICO |
| **Learning** | Cursos Next.js/React (Udemy/egghead) | $100-200 | 🟠 ALTO |
| **Tools** | Plausible Analytics (6 meses) | $54 | 🟡 MÉDIO |
| **APIs** | CoinGecko (free) + OpenNode (free) | $0 | ✅ FREE |
| **Contingência** | Imprevistos (15%) | $200-400 | 🟡 MÉDIO |
| **TOTAL ESTIMADO** | | **$1.554-2.750** | |
| **Buffer Restante** | Para Fase 2/3 | **$2.250-3.446** | |

**Resultado:** Budget VIÁVEL com margem confortável!

---

## 📅 TIMELINE REALISTA (9 Meses)

### 🗓️ MÊS 1-2: FOUNDATION & LEARNING (Weeks 1-8)

**Objetivo:** Resolver blockers críticos + aprender tech stack

#### Week 1-2: Critical Blockers ⚠️
- [ ] **DIA 1**: Registrar domínio `soundsfair.com` + `.org` ($30)
- [ ] **DIA 2-3**: Comprar templates legais (Termly.io $200/ano) ou iubenda ($27/mês)
- [ ] **DIA 3-5**: Pesquisar + contratar revisor nativo PT→EN no Fiverr/Upwork
  - Buscar: "Bitcoin writer" ou "crypto content editor"
  - Budget: $500-1.000 (50-100 horas @ $10-20/hr)
  - Entregas: Revisar traduções IA, adaptar tom, fact-check
- [ ] **DIA 6-7**: Setup inicial
  - Twitter: @soundsfair
  - GitHub repo privado
  - Notion workspace (project management)

**Budget Mês 1-2:** $730-1.230

#### Week 3-8: Learning & Setup (5 semanas) 📚
- [ ] **Curso Next.js 14** (escolher 1):
  - Next.js 14 Master Course (Udemy, $15, 30h)
  - Next.js Official Docs + Tutorial (free, 40h)
  - Frontend Masters Next.js (paid, $39/mês, cancelar depois)
- [ ] **Setup Projeto**:
  - [ ] Criar Next.js 14 project (App Router)
  - [ ] Setup Tailwind CSS + Tailwind UI ($299)
  - [ ] Configurar TypeScript (strict mode)
  - [ ] Setup Prettier + ESLint
  - [ ] Git repo + GitHub
- [ ] **Parallel: Tradução Fase 1**
  - [ ] Usar Claude para traduzir 9 lições do PDF
  - [ ] Enviar para revisor freelancer
  - [ ] Revisar feedback e ajustar

**Budget Week 3-8:** $314-354 (curso + Tailwind UI)

**Entregável Mês 1-2:**
- ✅ Legal foundation pronta
- ✅ Domínio registrado
- ✅ Next.js knowledge adquirido
- ✅ Projeto configurado
- ✅ Primeiras traduções revisadas

---

### 🗓️ MÊS 3-5: MVP DEVELOPMENT (Weeks 9-20)

**Objetivo:** Build core features - Homepage + DCA Calculator + 3 páginas essenciais

#### Week 9-12: Design System & Homepage (1 mês)
- [ ] **Design System**:
  - [ ] Configurar cores brand (Black #000000 + Yellow #FFD000)
  - [ ] Typography (Inter + Roboto Slab)
  - [ ] Component library base (buttons, cards, inputs)
  - [ ] Responsiveness (mobile-first)
- [ ] **Homepage**:
  - [ ] Hero section (headline + CTA)
  - [ ] Value propositions (3 sections)
  - [ ] DCA Calculator teaser
  - [ ] Learn Path overview
  - [ ] Footer (links, social)
- [ ] **Navigation**:
  - [ ] Header/Menu
  - [ ] Mobile menu

**Tempo estimado:** 60-80 horas (15-20h/semana × 4 semanas)

#### Week 13-16: DCA Calculator (MVP Version) ⭐ CORE FEATURE
- [ ] **Backend Logic**:
  - [ ] API route: `/api/dca-calculate`
  - [ ] Integrate CoinGecko API (historical prices)
  - [ ] Algorithm: DCA calculation (amount, frequency, dates)
  - [ ] Support 3 assets: BTC, S&P500, Gold
  - [ ] Calculate: total invested, units, current value, ROI%, CAGR
- [ ] **Frontend**:
  - [ ] Input form (amount, frequency, dates, assets)
  - [ ] Chart display (Recharts - line chart)
  - [ ] Results summary (metrics)
  - [ ] Shareable URLs (query params)
- [ ] **Testing**:
  - [ ] Validate calculations against dcaBTC.com
  - [ ] Test edge cases (crashes, halvings)

**Tempo estimado:** 60-80 horas (15-20h/semana × 4 semanas)

#### Week 17-20: Core Content Pages (1 mês)
- [ ] **3 Essential Pages**:
  - [ ] `/what-is-bitcoin` (O que é Bitcoin - traduzido)
  - [ ] `/why-bitcoin` (Por que Bitcoin - Fair Money argument)
  - [ ] `/get-started` (Primeiros passos - 3 steps)
- [ ] **Legal Pages**:
  - [ ] `/privacy-policy` (template Termly)
  - [ ] `/terms-of-service` (template Termly)
  - [ ] `/disclaimer` (consulta básica legal ou template)
- [ ] **Outros**:
  - [ ] `/about` (sobre o projeto)
  - [ ] Sitemap.xml
  - [ ] Robots.txt

**Tempo estimado:** 40-60 horas

**Budget Mês 3-5:** $50-100 (APIs, tools)

**Entregável Mês 3-5:**
- ✅ MVP funcional com 8 páginas
- ✅ DCA Calculator 100% funcional e testado
- ✅ Design consistente e profissional
- ✅ Mobile-responsive

---

### 🗓️ MÊS 6-7: EDUCATIONAL CONTENT (Weeks 21-28)

**Objetivo:** Learn Path Levels 1-4 completos

#### Week 21-24: Learn Path Structure + Levels 1-2
- [ ] **Structure**:
  - [ ] Database schema (ou JSON files simples)
  - [ ] `/learn` page (overview de 8 níveis)
  - [ ] `/learn/[level]` dynamic route
  - [ ] Progress tracking (localStorage ou Supabase simples)
- [ ] **Level 1**: "O Sistema Fiat e suas Falhas"
  - [ ] Texto traduzido e revisado
  - [ ] 5-7 sub-tópicos
  - [ ] Quiz (5 questões)
  - [ ] Estimated time: 20min read
- [ ] **Level 2**: "O Sistema Bancário e Criação de Dívidas"
  - [ ] Texto traduzido e revisado
  - [ ] 5-7 sub-tópicos
  - [ ] Quiz (5 questões)

**Tempo estimado:** 40-60 horas

#### Week 25-28: Levels 3-4 + Video Curation
- [ ] **Level 3**: "Bitcoin: A Revolução Contra o Fiat"
- [ ] **Level 4**: "Bitcoin e Geopolítica"
- [ ] **Video Curation (20 videos)**:
  - [ ] `/videos` page
  - [ ] Embed YouTube player
  - [ ] Curator notes (2-3 frases + bullet points)
  - [ ] Filter by topic/difficulty

**Tempo estimado:** 40-60 horas

**Budget Mês 6-7:** $100-200 (revisor para feedback adicional se necessário)

**Entregável Mês 6-7:**
- ✅ Learn Path Levels 1-4 completos
- ✅ 20 videos curados
- ✅ Quiz system funcionando

---

### 🗓️ MÊS 8-9: POLISH, SEO & SOFT LAUNCH (Weeks 29-36)

**Objetivo:** Polish, SEO, beta test, iteração

#### Week 29-32: Polish & Optimization
- [ ] **Performance**:
  - [ ] Lighthouse score >90
  - [ ] Image optimization (WebP, lazy loading)
  - [ ] Code splitting
- [ ] **SEO**:
  - [ ] Meta tags (title, description) all pages
  - [ ] Open Graph tags
  - [ ] Structured data (JSON-LD)
  - [ ] Internal linking strategy
- [ ] **Accessibility**:
  - [ ] WCAG AA compliance check (axe DevTools)
  - [ ] Keyboard navigation
  - [ ] Screen reader testing
- [ ] **Analytics**:
  - [ ] Setup Plausible Analytics
  - [ ] Custom events (calculator use, level completion)

**Tempo estimado:** 30-40 horas

#### Week 33-36: Beta Test & Iteration
- [ ] **Private Beta**:
  - [ ] Recrutar 20-50 beta testers (Twitter, Reddit r/Bitcoin)
  - [ ] Feedback form
  - [ ] Bug tracking
- [ ] **Iteration**:
  - [ ] Fix bugs críticos
  - [ ] Ajustar UX baseado em feedback
  - [ ] Polir copy
- [ ] **Content**:
  - [ ] Escrever 5 blog posts SEO-optimized
  - [ ] Famous quotes section (50 quotes)

**Tempo estimado:** 40-60 horas

**Budget Mês 8-9:** $54 (Plausible 6 meses) + $50-100 (contingência)

**Entregável Mês 8-9:**
- ✅ Plataforma polida e otimizada
- ✅ Beta testado com feedback incorporado
- ✅ Pronto para soft launch

---

## 🚀 PHASE 2: POST-LAUNCH (Mês 10-12)

### Goals: Grow traffic, complete content, add monetization

- [ ] **Content Expansion**:
  - [ ] Completar Levels 5-8
  - [ ] Escrever 20+ blog posts
  - [ ] Expandir video library (50+ videos)
- [ ] **Lightning Integration** (se budget permitir):
  - [ ] OpenNode integration
  - [ ] `/ask` page (paid Q&A)
  - [ ] Lightning tips
- [ ] **Marketing**:
  - [ ] Twitter posting (daily)
  - [ ] Bitcoin communities engagement
  - [ ] Guest posts / Podcast appearances
- [ ] **SEO**:
  - [ ] Monitor rankings
  - [ ] Build backlinks
  - [ ] Optimize based on data

**Budget Phase 2:** Usar buffer restante ($2.250-3.446)

---

## 🎯 SUCCESS METRICS (KPIs)

### Mês 3 (MVP Launch Interno):
- ✅ MVP funcional (8 páginas + calculator)
- ✅ 0 bugs críticos
- ✅ Lighthouse score >85

### Mês 7 (Beta Launch):
- 🎯 50 beta testers
- 🎯 500 unique visitors
- 🎯 100 DCA calculations performed
- 🎯 20 Learn Path Level 1 completions
- 🎯 Beta feedback: 7/10+ satisfaction

### Mês 9 (Public Soft Launch):
- 🎯 1.000 unique visitors
- 🎯 500 DCA calculations
- 🎯 50 Learn Path completions (all levels)
- 🎯 Top 50 ranking for 3 keywords

### Mês 12 (Growth Phase):
- 🎯 5.000 unique visitors/month
- 🎯 2.000 DCA calculations/month
- 🎯 200 Learn Path completions
- 🎯 $500-1.000/month revenue (tips, affiliates, future features)
- 🎯 Top 20 ranking for 5 keywords

### Mês 24 (Sustainability):
- 🎯 20.000+ unique visitors/month
- 🎯 Self-sustaining ($500-1.500/month covering hosting, tools, maintenance)

---

## ⚠️ RISCOS & MITIGAÇÕES

### Risco 1: Qualidade da Tradução IA
**Impacto:** Médio
**Mitigação:**
- Usar Claude Opus (melhor modelo) para tradução
- Revisor nativo faz heavy editing
- Beta testers (nativos) dão feedback
- Melhorar iterativamente com receita futura

### Risco 2: Curva de Aprendizado Next.js
**Impacto:** Timeline延长
**Mitigação:**
- Começar com templates/exemplos
- Community support (Discord Next.js)
- Budget buffer para consultor pontual ($100-200)

### Risco 3: Budget Overrun
**Impacto:** Alto (projeto pode parar)
**Mitigação:**
- Budget conservador com 15% contingência
- Priorização estrita (MVP first)
- Alternativas free sempre que possível
- Buscar grants em paralelo (HRF, OpenSats)

### Risco 4: Burnout (9 meses é longo)
**Impacto:** Alto
**Mitigação:**
- Milestones claros a cada 4 semanas
- Celebrate wins pequenos
- Community support (build in public no Twitter)
- Semanas "easy" após sprints pesados

### Risco 5: Falta de Tração (Zero Usuários)
**Impacto:** Médio (desmotiva)
**Mitigação:**
- Build in public (Twitter desde Mês 1)
- Beta privado (engagement garantido)
- SEO desde início (long-term play)
- Engage Bitcoin communities (Reddit, forums)

---

## 💡 DECISÕES ESTRATÉGICAS TOMADAS

### ✅ O que INCLUIR no MVP:
1. Homepage profissional
2. DCA Calculator (3 assets, shareable)
3. Learn Path Levels 1-4
4. 3 páginas core content
5. 20 videos curados
6. Legal pages compliant
7. Mobile-responsive
8. SEO básico

### ❌ O que POSTERGAR para Phase 2:
1. Lightning integration (complexo, pode esperar)
2. Levels 5-8 (completar após validação 1-4)
3. Newsletter system (usar Substack free depois)
4. Advanced calculator features (7 assets, tax reports)
5. User authentication (não necessário para MVP)
6. Comments/Community features
7. Certificate system
8. Learn & Earn gamification

### 🎯 Por quê essas decisões?
- **MVP deve ser LAUNCHABLE em 7-9 meses**
- **Budget <$5K impõe hard constraints**
- **Validate core value prop antes de expand**
- **Better launch com menos features do que never launch**

---

## 🛠️ TECH STACK FINAL (Confirmado)

### Frontend:
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Tailwind UI ($299)
- **Components**: Radix UI (accessible primitives)
- **Charts**: Recharts (DCA calculator)
- **Forms**: React Hook Form + Zod

### Backend:
- **API Routes**: Next.js serverless functions
- **Database**: JSON files (MVP), Supabase (Phase 2 - free tier)
- **APIs**: CoinGecko (free), Alpha Vantage (stocks - free)

### Hosting & Tools:
- **Hosting**: Vercel (free tier sufficient)
- **Domain**: Namecheap/Cloudflare ($15/year)
- **Analytics**: Plausible ($9/month - start Mês 7)
- **Legal**: Termly.io ($200/year) ou iubenda ($27/month)

### Future (Phase 2):
- **Payments**: OpenNode (Lightning)
- **Email**: Resend (free 3K/month)
- **Search**: Algolia free tier ou client-side (Fuse.js)

---

## 📋 CHECKLIST SEMANA 1 (Next Steps)

Esta semana, execute EXATAMENTE isso (ordem importa):

### 🔴 DIA 1 (Hoje):
- [ ] Registrar domínio `soundsfair.com` + `.org` ($30)
  - Recomendação: Namecheap ou Cloudflare Registrar
- [ ] Criar conta Twitter: @soundsfair (ou similar se taken)
- [ ] Post inicial: "Building soundsfair - educational platform about Bitcoin and fair money. Follow the journey. #Bitcoin #BuildInPublic"

### 🟠 DIA 2-3:
- [ ] Pesquisar templates legais:
  - Option A: Termly.io ($200/year) - automated, comprehensive
  - Option B: iubenda ($27/month) - cancel anytime
  - Deliverable: Privacy Policy + Terms + Disclaimers
- [ ] Comprar escolhido
- [ ] Download/setup templates

### 🟠 DIA 4-5:
- [ ] Post job no Fiverr/Upwork: "Bitcoin Content Editor (PT→EN)"
  - Budget: $500-1.000
  - Description: "Need native English speaker with Bitcoin knowledge to review AI-translated educational content. 50-100 hours over 2-3 months. Must understand Bitcoin, Austrian economics, libertarian values."
  - Deliverables: Edit 9 lessons (15K palavras), fact-check, adapt tone
- [ ] Entrevistar 3-5 candidates (ask about Bitcoin knowledge)
- [ ] Hire melhor candidate

### 🟡 DIA 6-7 (Weekend):
- [ ] Setup Notion workspace:
  - Project roadmap (copy do timeline acima)
  - Weekly sprints
  - Budget tracker
  - Content backlog
- [ ] Create GitHub repo (private)
- [ ] Escolher curso Next.js (start next week)

### 📊 End of Week 1:
- ✅ Domain registered
- ✅ Legal foundation setup
- ✅ Revisor hired
- ✅ Project management ready
- ✅ Learning path chosen
- ✅ Twitter active

**Budget Week 1:** $730-1.230

---

## 🎬 CONCLUSÃO

### Este plano é EXECUTÁVEL porque:

1. ✅ **Budget realista**: $4.800 total, buffer confortável
2. ✅ **Skills achievable**: Intermediário pode aprender
3. ✅ **Timeline viável**: 9 meses para MVP (15-25h/semana)
4. ✅ **Scope gerenciável**: MVP enxuto, Phase 2 expansão
5. ✅ **Priorização clara**: Core features first, nice-to-have depois
6. ✅ **Mitigação de riscos**: Alternativas para cada blocker
7. ✅ **Expectativa alinhada**: Sustentável em 12-24 meses (não 6)

### Seu próximo passo CRÍTICO:

**🎯 COMEÇAR SEMANA 1 CHECKLIST (acima)**

Não overthink. Não replanejar. Executar ações de Dia 1-7.

Quando concluir Week 1, volte aqui e marque ✅. Depois, começe Week 2 (Learning Phase).

---

**"O melhor momento para plantar uma árvore foi há 20 anos. O segundo melhor momento é AGORA."**

Vamos construir isso! 🚀

---

*Documento criado: 25 Nov 2024*
*Baseado em: Assessment real do Igor + Market research + 4 documentos estratégicos*
*Status: APPROVED - READY FOR EXECUTION*
