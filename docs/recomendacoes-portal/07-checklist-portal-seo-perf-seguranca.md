# Checklist: portal (SEO, performance, confiança)

## SEO (alto impacto)

- Sitemap dinâmico e completo (todas as rotas indexáveis).
- Canonical por página (principalmente ferramentas com query params).
- JSON-LD:
  - `Article`/`BlogPosting` (brief/relatórios)
  - `FAQPage` (FAQ)
  - `BreadcrumbList` (hubs/topics)
- OpenGraph/Twitter cards consistentes (imagens + títulos).
- Páginas “hub” por tema (clusters) para evitar conteúdo solto.

## Performance (para reduzir bounce e aumentar tempo)

- Lazy-load de gráficos pesados (dynamic import) e skeleton states.
- Caching agressivo nos endpoints “quase estáticos” (halving/dados históricos).
- Evitar re-renderizações custosas em tools (memoização de chart data).
- Budget de performance: LCP/INP/CLS monitorados.

## Confiança / credibilidade (portal “alto nível”)

- Páginas institucionais completas: About, metodologia de dados (“de onde vem cada métrica”), política editorial.
- Disclaimers claros em todas ferramentas e artigos (“educacional, não é recomendação”).
- “Last updated” e fontes nos gráficos/métricas (ex.: CoinCap, mempool.space).

## Segurança e privacidade

- LGPD/GDPR: consentimento para newsletter, logs mínimos, opt-out claro.
- Rate limiting em endpoints sensíveis (`/api/qa/*`, `/api/admin/*`, cron endpoints).
- Monitoramento de erros (Sentry ou similar) pelo menos em produção.

