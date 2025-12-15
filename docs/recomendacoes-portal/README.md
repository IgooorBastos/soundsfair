# Recomendações para retenção e evolução do portal (Soundsfair)

Este diretório contém uma análise do projeto em `soundsfair-app/` e um conjunto de recomendações para aumentar **retenção**, **tempo de sessão** e **valor percebido**, transformando o site em um **portal de informação de alto nível** sobre Bitcoin (conteúdo + ferramentas + dados).

## Como usar estes documentos

- Comece por `01-diagnostico-do-projeto.md` para entender o estado atual (stack, funcionalidades, gaps).
- Em seguida leia `02-metricas-retencao-e-loops.md` para alinhar objetivos, métricas e loops.
- Se for implementar features de retenção (alertas/brief), leia `06-arquitetura-e-implementacao.md`.
- Use `04-backlog-priorizado.md` como backlog inicial (impacto × esforço) e plano de execução.
- `05-referencias.md` lista referências e APIs para implementação.

## Escopo analisado

- Projeto raiz: `projetos-claude/sites/ativos/bitcoin.com/`
- Aplicação principal: `soundsfair-app/` (Next.js 16 / React 19 / TS / Tailwind / Supabase / OpenNode / Resend)
