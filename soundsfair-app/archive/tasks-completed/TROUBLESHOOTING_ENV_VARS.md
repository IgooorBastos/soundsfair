# 🔍 Troubleshooting: Environment Variables Não Reconhecidas

**Problema:** Build continua falhando com erro de variáveis faltando
**Erro:** `Error: Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable`

---

## ❌ O QUE ESTÁ ACONTECENDO

Mesmo após você adicionar as variáveis de ambiente na Vercel, o build continua falhando com o erro de variável faltando. Isso indica que as variáveis **NÃO estão sendo aplicadas** durante o build.

---

## 🔍 POSSÍVEIS CAUSAS

### Causa 1: Variáveis Configuradas Apenas para Production
**Problema:** Você pode ter configurado as variáveis apenas para "Production", mas o build está sendo feito como "Preview"

**Como verificar:**
1. Vá em: https://vercel.com/igors-projects-1a6352fa/soundsfair/settings/environment-variables
2. Olhe cada variável que você adicionou
3. Na coluna "Environments", deve estar marcado: **Production, Preview, Development**

**Se estiver apenas "Production":**
- Clique em "Edit" (ícone de lápis) em cada variável
- Marque também "Preview" e "Development"
- Clique em "Save"

---

### Causa 2: Variáveis Não Foram Salvas Corretamente
**Problema:** Você clicou em "Add Another" mas não clicou no botão "Save" no final

**Como verificar:**
1. Vá em: https://vercel.com/igors-projects-1a6352fa/soundsfair/settings/environment-variables
2. Você deve ver uma **LISTA** com as 3 variáveis já adicionadas:
   ```
   NEXT_PUBLIC_SUPABASE_URL          Production, Preview, Development
   NEXT_PUBLIC_SUPABASE_ANON_KEY     Production, Preview, Development
   SUPABASE_SERVICE_ROLE_KEY         Production, Preview, Development
   ```

**Se NÃO vê nenhuma variável na lista:**
- As variáveis não foram salvas!
- Adicione novamente (veja instruções abaixo)

**Se vê as variáveis MAS sem "Preview":**
- Edite cada uma e marque "Preview"
- Salve

---

### Causa 3: Typo no Nome da Variável
**Problema:** Você pode ter digitado o nome da variável com erro

**Nomes CORRETOS (copie exatamente assim):**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

**Erros comuns:**
- ❌ `NEXT_PUBLIC_SUPABASE_ANON_KEY_` (underscore extra no final)
- ❌ `NEXT_PUBLIC_SUPABASE_ANNON_KEY` (dois N em ANON)
- ❌ `NEXT PUBLIC SUPABASE ANON KEY` (espaços ao invés de underscores)
- ❌ `next_public_supabase_anon_key` (minúsculas)

**Como verificar:**
1. Vá em Settings → Environment Variables
2. Verifique se os nomes estão EXATAMENTE como acima
3. Se houver erro, delete a variável e crie novamente

---

### Causa 4: Valor da Variável Está Vazio ou Errado
**Problema:** Você salvou a variável mas o valor está vazio

**Como verificar:**
1. Vá em Settings → Environment Variables
2. Clique em "Edit" (lápis) em cada variável
3. Verifique se o campo "Value" tem conteúdo
4. A `NEXT_PUBLIC_SUPABASE_ANON_KEY` deve ser uma string LONGA (tipo JWT)

**Se o valor estiver vazio:**
- Delete a variável
- Vá no Supabase e copie novamente
- Adicione de novo na Vercel

---

## 🎯 SOLUÇÃO PASSO A PASSO

### PASSO 1: Verificar Estado Atual das Variáveis

1. **Acesse:** https://vercel.com/igors-projects-1a6352fa/soundsfair/settings/environment-variables

2. **Verifique:**
   - [ ] Vejo uma LISTA com as 3 variáveis
   - [ ] Cada variável tem "Production, Preview, Development"
   - [ ] Os nomes estão corretos (sem typos)
   - [ ] Clico em "Edit" e vejo valores preenchidos

3. **Se TUDO está correto, vá para PASSO 2**
4. **Se algo está errado, vá para PASSO 1.1**

---

### PASSO 1.1: Deletar e Recriar as Variáveis

Se as variáveis existem mas estão com problemas, é melhor deletar e refazer:

1. **Deletar as variáveis existentes:**
   - Para cada variável, clique no ícone de **lixeira** (Delete)
   - Confirme a exclusão

2. **Adicionar novamente do ZERO:**

   **Primeira variável:**
   ```
   Environment: Production, Preview, Development (marcar os 3!)
   Key: NEXT_PUBLIC_SUPABASE_URL
   Value: [cole a URL do Supabase]
   ```
   Clique em **"Add Another"**

   **Segunda variável:**
   ```
   Environment: Production, Preview, Development (marcar os 3!)
   Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [cole a chave anon do Supabase]
   ```
   Clique em **"Add Another"**

   **Terceira variável:**
   ```
   Environment: Production, Preview, Development (marcar os 3!)
   Key: SUPABASE_SERVICE_ROLE_KEY
   Value: [cole a chave service_role do Supabase]
   ```

3. **IMPORTANTE: Clique no botão "Save" no TOPO da página**

4. **Vá para PASSO 2**

---

### PASSO 2: Forçar um Redeploy

Depois de garantir que as variáveis estão corretas:

**Opção A - Redeploy pela Interface (Recomendado):**

1. Vá em: https://vercel.com/igors-projects-1a6352fa/soundsfair/deployments
2. Encontre o último deployment (o que falhou)
3. Clique nos **3 pontinhos** (⋮) no canto direito
4. Clique em **"Redeploy"**
5. Confirme clicando em **"Redeploy"** novamente
6. **IMPORTANTE:** Marque a opção **"Use existing build cache"** = DESMARCADA (não usar cache!)

**Opção B - Commit Vazio (Alternativa):**

```bash
cd /mnt/c/Users/igor/projetos-claude/sites/ativos/bitcoin.com/soundsfair-app
git commit --allow-empty -m "chore: force redeploy after env vars fix"
git push origin main
```

---

### PASSO 3: Acompanhar o Novo Build

1. Vá em: https://vercel.com/igors-projects-1a6352fa/soundsfair/deployments
2. Clique no deployment que está "Building"
3. Role até os logs
4. Procure por:

**✅ BOM (deve aparecer):**
```
▲ Next.js 16.0.4 (webpack)
Creating an optimized production build ...
✓ Compiled successfully
```

**❌ RUIM (NÃO deve aparecer):**
```
Error: Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable
```

---

## 🔧 SOLUÇÃO ALTERNATIVA (Se nada funcionar)

Se mesmo depois de tudo isso o erro persistir, temos uma solução alternativa:

### Criar arquivo vercel.json

1. **Me avise** que nenhuma das soluções acima funcionou
2. Vou criar um arquivo `vercel.json` que força as variáveis
3. Isso deve resolver o problema definitivamente

---

## 📸 SCREENSHOTS PARA ENVIAR

Se o problema persistir, me envie screenshots de:

1. **Lista de variáveis:**
   - Acesse: Settings → Environment Variables
   - Tire print da lista completa de variáveis
   - Deve mostrar os 3 nomes e os environments

2. **Edição de uma variável:**
   - Clique em "Edit" na `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Tire print (pode cobrir parte do valor por segurança)
   - Deve mostrar os checkboxes de Production/Preview/Development

3. **Logs do erro:**
   - Copie o erro completo do build
   - Ou tire print da tela de erro

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Antes de fazer o redeploy, confirme:

### Nas Environment Variables da Vercel:
- [ ] Vejo 3 variáveis na lista (não vazio)
- [ ] Cada uma tem "Production, Preview, Development"
- [ ] Os nomes estão exatamente como especificado (copie/cole)
- [ ] Cliquei em "Edit" e confirmei que valores estão preenchidos
- [ ] Cliquei em "Save" após adicionar/editar

### No Supabase:
- [ ] Copiei a URL do projeto corretamente
- [ ] Copiei a chave "anon" completa (muito longa)
- [ ] Copiei a chave "service_role" completa (muito longa)
- [ ] Não tem espaços extras no início/fim dos valores

### No Deploy:
- [ ] Vou fazer "Redeploy" (não apenas aguardar)
- [ ] Vou desmarcar "Use existing cache"
- [ ] Vou acompanhar os logs em tempo real

---

## 🎯 RESUMO - O QUE FAZER AGORA

1. **Primeiro:** Vá em Settings → Environment Variables
2. **Verifique:** Se as 3 variáveis estão lá com "Production, Preview, Development"
3. **Se não estão corretas:** Delete e recrie (PASSO 1.1)
4. **Se estão corretas:** Faça Redeploy sem cache (PASSO 2)
5. **Aguarde:** 5-7 minutos para o build
6. **Me avise:** Se funcionou ou se o erro persiste

---

## 📞 ME REPORTE

**Se as variáveis ESTAVAM faltando:**
```
Problema: Variáveis não estavam salvas
Ação: Adicionei novamente
Status: Fazendo redeploy agora
```

**Se as variáveis ESTAVAM lá mas sem Preview:**
```
Problema: Variáveis só tinham Production
Ação: Marquei Preview e Development também
Status: Fazendo redeploy agora
```

**Se tudo PARECE correto:**
```
Problema: Não sei, variáveis parecem corretas
Status: Fazendo redeploy sem cache
Screenshot: [anexar]
```

---

**🎯 Comece pela verificação das variáveis e me avise o que encontrou!**
