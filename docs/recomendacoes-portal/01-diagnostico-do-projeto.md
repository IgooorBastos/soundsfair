# Diagnóstico completo do projeto (estado atual)

## 1) O que existe hoje (alto nível)

### Estrutura do repositório

- Raiz contém documentação ampla em `docs/`, materiais-fonte em `content-source/` e o app em `soundsfair-app/`.
- `legal-templates/` já tem templates (privacy/terms/disclaimer) prontos para adaptação e publicação.

### Aplicação (`soundsfair-app/`)

**Stack**
- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind.
- Supabase (Auth + Postgres) para login e sincronização opcional de progresso.
- OpenNode para pagamentos Lightning no fluxo de Q&A.
- Resend para e-mails.

**Funcionalidades que já ajudam retenção**
- Curso com aulas em Markdown (`soundsfair-app/content/lessons`) + render + `generateStaticParams`.
- Glossary + FAQ com busca (no header).
- Progresso local (localStorage): XP/níveis, streak, “continue learning”, barra de progresso de leitura.
- Login + Profile + Cloud Sync (híbrido: localStorage como fonte de verdade + sync opcional).
- Hub de ferramentas em `/tools` e ferramentas individuais (DCA, Fear & Greed, Halving countdown, Satoshi converter, What-if).
- API routes com cache e fallback para dados (CoinCap/CoinGecko; Alternative.me; endpoints internos).

## 2) Pontos fortes (o que vale preservar)

- **Já existe um “núcleo de produto”**: ferramentas + curso + progressão + conta. Isso é uma base real de retenção.
- **Arquitetura de dados** já prevê sincronização e autenticação; dá para evoluir para personalização.
- **Boas decisões para confiabilidade** em APIs (caching e fallback) — essencial para portal.
- **Documentação** no repo é extensa (roadmap/status), então dá para operar com disciplina.

## 3) Gaps / inconsistências observáveis (impactam retenção)

### 3.1 Inconsistência de conteúdo vs UI/SEO
- `public/sitemap.xml` parece **incompleto**: não inclui todas as rotas (ex.: `/tools`, várias ferramentas, `/qa`, lições 1–4 etc.).
- `app/learn/page.tsx` marca níveis 5–9 como “coming soon”, mas o repo indica **9 aulas completas** (e o header lista níveis 1–9). Isso confunde o usuário e reduz confiança.

### 3.2 “Loops de retorno” ainda fracos fora do produto
- Existe UI de newsletter no footer, mas não parece conectada a backend/consentimento e sem estratégia de “cadência” (daily/weekly digests).
- Não há um “home dashboard” orientado a retorno diário (ex.: “seu briefing do dia”, watchlist, alertas, trilha sugerida baseada em comportamento).

### 3.3 Portal de informação (alto nível) ainda não está claro
Hoje o site é mais “curso + ferramentas”. Para virar portal:
- Falta um **pilar editorial contínuo** (conteúdo novo recorrente e indexável).
- Falta um **sistema de informação** (ex.: hubs por tema, relatórios, séries, calendário econômico, métricas on-chain, curadoria de links/vídeos).
- Falta “profundidade navegável” (coleções, tags, séries, leitura recomendada, trilhas por objetivo).

### 3.4 Observabilidade e aprendizado do produto
- Não há evidência de instrumentação de eventos (analytics) para medir ativação/retorno (ex.: “aula iniciada”, “aula concluída”, “tool run”, “share”, “cadastro”, “sync ok/fail”, “alert created”).

## 4) Recomendações rápidas (sem grandes refactors)

1. Corrigir inconsistências de UX (Learn/lessons status; sitemap; rotas “soon”).
2. Definir um **North Star Metric** e um painel mínimo (ver `02-metricas-retencao-e-loops.md`).
3. Introduzir “retorno diário”: um bloco fixo na home com 3 cards (Brief do dia, Próxima ação, Ferramenta recomendada).
4. Transformar Q&A em “conteúdo reutilizável” com um arquivo público (opt-in) e páginas indexáveis.

