# Arquitetura e implementação (propostas dentro do stack atual)

O projeto já usa Supabase + Resend + Next.js. As recomendações abaixo partem disso para evitar “recomeçar do zero”.

## 1) Alertas (e-mail / web push) — base técnica

### Dados (tabelas sugeridas)

Crie algo simples e evolutivo:

- `user_alerts`
  - `id`, `user_id`, `type`, `payload_json`, `channel` (`email|webpush`), `enabled`
  - `cooldown_minutes`, `last_triggered_at`, `created_at`
- `user_notification_preferences`
  - `user_id`, `timezone`, `digest_frequency` (`daily|weekly|none`), `email_opt_in`, `push_opt_in`
- `newsletter_subscribers` (se permitir usuários sem conta)
  - `id`, `email`, `status` (`pending|confirmed|unsubscribed`), `confirmed_at`, `created_at`

### Execução (como disparar)

Opções pragmáticas:
1. **Cron externo + endpoint protegido**:
   - um cron (GitHub Actions / cron-job no servidor / serviço de cron) chama `/api/cron/alerts`.
   - o endpoint busca alertas ativos, calcula gatilhos e envia via Resend.
2. **Supabase cron/edge function** (quando você quiser “consolidar”):
   - mantém tudo no ecossistema Supabase.

### Tipos de alerta (primeiro lote)

- `price_above` / `price_below`
- `fear_greed_extreme` (ex.: ≤25 ou ≥75)
- `fees_high` (mempool fee recomendado acima de X)
- `halving_milestone` (ex.: 100k, 50k, 10k blocos restantes)

## 2) Brief diário/semanal (conteúdo + retenção)

### Por que funciona
Você cria um motivo externo para retorno (email/push) + uma página indexável (SEO).

### Implementação simples (primeira versão)

- Uma rota: `/brief/YYYY-MM-DD` (ou `/brief/weekly-YYYY-WW`).
- Conteúdo pode começar manual (Markdown) e depois evoluir para pipeline editorial.
- Sempre incluir:
  - “3 fatos do dia”
  - “1 gráfico”
  - “1 conceito (glossário)”
  - “1 ação: continue sua aula / faça este mini-quiz / use esta tool”

## 3) Q&A público como biblioteca

Objetivo: transformar Q&A pago em “conteúdo perene” (com opt-in).

### Dados (sugestão)

- `questions`
  - `id`, `user_email`, `question`, `tier`, `status`, `allow_public`
- `answers`
  - `question_id`, `answer_md`, `published_at`, `slug`, `tags`

### UX

- Página “arquivo” filtrável por tags.
- Interlink automático: Q&A → glossário → aulas → ferramentas.
- “Se sua pergunta já existe, leia de graça” (reduz suporte repetido e aumenta valor do acervo).

## 4) Busca (portal precisa)

O header hoje busca uma lista estática. Para portal, evoluir:

- Índice full-text (ex.: Meilisearch/Typesense/Algolia).
- Filtros por tipo (Aula / Q&A / Tool / Glossário / Brief).
- Autocomplete com “atalhos”.

MVP sem serviço externo: usar Postgres full-text search no Supabase (se o conteúdo estiver no banco).

## 5) “Páginas programáticas” (crescimento orgânico)

Exemplos:
- `/topics/self-custody`, `/topics/lightning`, `/topics/privacy`, `/topics/mining`
- cada topic agrega:
  - explicação curta (editorial)
  - links internos (aulas / glossário / Q&A / ferramentas)
  - links externos oficiais (cuidado com qualidade)

Isso aumenta profundidade de navegação (páginas/sessão) e SEO (clusters).

