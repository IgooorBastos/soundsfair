# Backlog priorizado (impacto × esforço)

Este backlog é propositalmente pragmático: começa por corrigir inconsistências e criar loops simples, depois evolui para portal/dados/editorial.

## P0 (0–7 dias) — “Arrumar a casa”

1. **Alinhar UX do Learn/lessons com a realidade** (se 9 lições estão prontas, remover “coming soon”).
2. **Sitemap/robots completos**:
   - incluir `/tools`, ferramentas, `/qa`, `/profile`, lições 1–9, glossary terms (se tiver páginas individuais), etc.
3. **CTA de newsletter funcional**:
   - endpoint + double opt-in + consentimento (LGPD/GDPR) + armazenar no Supabase.
4. **Instrumentação mínima** (sem overkill):
   - capturar eventos principais (ver `02-metricas-retencao-e-loops.md`).

## P1 (1–3 semanas) — “Criar retorno semanal”

1. **Daily/Weekly Brief**:
   - página do brief (indexável) + envio por e-mail (Resend).
2. **Q&A público (opt-in)**:
   - criar páginas públicas com slugs, tags e interlinking (vira biblioteca).
3. **Alertas básicos**:
   - preço e fear/greed (e-mail) + preferências no perfil.
4. **Home dashboard**:
   - card “Seu progresso”, card “Brief do dia”, card “Ferramenta recomendada”.

## P2 (1–2 meses) — “Portal de dados”

1. **Bitcoin Fee / Mempool dashboard** (fonte: mempool.space):
   - recommended fees, mempool size, blocks, etc.
2. **Difficulty & hashrate** (fonte: APIs públicas ou seu próprio node):
   - visualização simples + explicações.
3. **Páginas programáticas por tópico**:
   - “Self-custody”, “Lightning”, “Privacy”, “Mining”, “Economics”, etc.

## P3 (2–4 meses) — “Crescer com conteúdo e comunidade”

1. **Curadoria de vídeos e leituras**:
   - coleções, notas, timestamps, tags.
2. **Comentários/discussão com moderação**:
   - alternativa: integrar Nostr (mais alinhado ao ethos) ou discussões internas moderadas.
3. **Social sharing melhor**:
   - OG images dinâmicas para ferramentas, brief e conquistas.

## Critérios de priorização (para você ajustar)

- Impacto direto em: retorno D7/D30, tempo por sessão, páginas por sessão.
- Esforço técnico realista dentro do stack atual.
- “Reuso”: recursos que viram base para outros (ex.: alertas → notificações → brief).

