# Métricas, retenção e loops (o que medir e como crescer)

## 1) Definição do objetivo (retensão + tempo)

Para um portal de informação + ferramentas, o objetivo não é só “pageviews”. O objetivo é:
- **Usuário voltar** (D1/D7/D30) e criar hábito.
- **Usuário consumir profundidade** (sessões mais longas e com múltiplas ações).

## 2) Sugestão de North Star Metric (NSM)

Escolha 1 NSM para operar semanalmente. Exemplos:

### Opção A (educação-first)
**“Minutos de aprendizado qualificado por usuário/semana”**
- Qualificado = leitura de aula + quiz + uso de ferramenta + leitura de Q&A/relatório.

### Opção B (portal-first)
**“Sessões com ≥ 2 ações úteis por usuário/semana”**
- Ações úteis: tool run, salvar item, criar alerta, completar quiz, compartilhar link, abrir “brief do dia”, etc.

## 3) Frameworks úteis (operacional)

### AARRR (Pirate Metrics)
- Acquisition → Activation → Retention → Revenue → Referral
- Útil para organizar o funil e priorizar “o próximo gargalo”.

### HEART (Google)
- Happiness, Engagement, Adoption, Retention, Task success
- Útil para evitar “crescer” piorando UX (ex.: push agressivo, dark patterns, etc.).

## 4) Eventos mínimos para instrumentar (MVP de analytics)

Sem isso, você não sabe o que retém:

- `signup_started`, `signup_completed`, `login_completed`
- `lesson_opened`, `lesson_scrolled_50`, `lesson_completed`
- `quiz_started`, `quiz_passed`, `quiz_failed`
- `tool_opened`, `tool_run`, `tool_share`, `tool_export`
- `search_opened`, `search_result_clicked`
- `qa_submitted`, `qa_paid`, `qa_answer_sent`, `qa_public_opt_in`
- `progress_sync_started`, `progress_sync_success`, `progress_sync_error`
- `newsletter_subscribe`, `alert_created`, `alert_triggered`

## 5) Loops de retenção (o que “puxa” o usuário de volta)

### Loop 1: Aprendizado diário (hábito)
1. Usuário recebe um “Daily Brief” (e-mail/web push).
2. Abre o site → consome 1 insight + 1 ação rápida (mini-quiz/checkpoint).
3. Ganha XP/streak + recomenda próxima aula/tool.
4. Salva/watchlist/alerta → retorno futuro.

### Loop 2: Ferramentas + compartilhamento
1. Usuário roda ferramenta (DCA/What-if/Converter).
2. Gera “resultado compartilhável” (link/OG imagem).
3. Outro usuário chega por referral → roda ferramenta → vira conta/assinante.

### Loop 3: Q&A como biblioteca
1. Pergunta paga (alta intenção).
2. Resposta vira conteúdo (opt-in) → indexa (SEO) → tráfego.
3. Tráfego consome → cadastra para alertas/newsletter → volta.

## 6) “Retenção” exige valor recorrente

O portal precisa de coisas que mudam sempre:
- dashboards (fees, halving, preço, métricas)
- brief (diário/semanal)
- biblioteca viva (Q&A público, curadoria, relatórios)

