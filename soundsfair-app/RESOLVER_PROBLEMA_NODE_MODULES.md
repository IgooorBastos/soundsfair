# 🔧 Resolver Problema: node_modules não instala no WSL

**Problema:** Erros TypeScript porque `node_modules` não está instalado corretamente.

**Causa:** WSL tem conflitos de permissão com arquivos do Windows em `/mnt/c`.

---

## ✅ SOLUÇÃO (2 minutos):

### **Opção 1: PowerShell (RECOMENDADO)**

1. **Abrir PowerShell** (não precisa ser administrador)
   - Pressionar `Win + X`
   - Clicar em "Windows PowerShell"

2. **Navegar até a pasta:**
   ```powershell
   cd C:\Users\igor\projetos-claude\sites\ativos\bitcoin.com\soundsfair-app
   ```

3. **Limpar tudo:**
   ```powershell
   Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
   ```

4. **Instalar dependências:**
   ```powershell
   npm install
   ```
   ⏱️ Tempo: ~2-3 minutos

5. **Testar build:**
   ```powershell
   npm run build
   ```
   ⏱️ Tempo: ~3-5 minutos

6. **Se passou → Pronto!** ✅

---

### **Opção 2: Explorador de Arquivos (Mais Simples)**

1. **Abrir a pasta no Windows:**
   - Pressionar `Win + E`
   - Navegar para: `C:\Users\igor\projetos-claude\sites\ativos\bitcoin.com\soundsfair-app`

2. **Deletar pastas/arquivos:**
   - Deletar pasta `node_modules` (Shift + Delete para forçar)
   - Deletar pasta `.next` (se existir)
   - Deletar arquivo `package-lock.json` (se existir)

3. **Abrir PowerShell nessa pasta:**
   - Na barra de endereços do Explorador, digitar: `powershell`
   - Pressionar Enter

4. **Instalar:**
   ```powershell
   npm install
   ```

5. **Testar:**
   ```powershell
   npm run build
   ```

---

## 🎯 O QUE VOCÊ DEVE VER:

### **Durante npm install:**
```
added 427 packages, and audited 428 packages in 2m

98 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### **Durante npm run build (SUCESSO):**
```
▲ Next.js 16.0.4 (webpack)
Creating an optimized production build ...
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (32/32)
✓ Build completed successfully
```

**SE VIU ISSO → FUNCIONOU!** ✅

---

## ❌ O QUE NÃO DEVE VER:

### **Erros de módulo não encontrado:**
```
Cannot find module 'next/link'
Cannot find module 'next/server'
```
→ Significa que node_modules ainda não está instalado

### **Erros de permissão:**
```
Error: EACCES: permission denied
```
→ Use PowerShell ao invés de WSL

---

## 🔄 DEPOIS QUE FUNCIONAR:

Você pode voltar a usar WSL normalmente:

```bash
# No WSL
cd /mnt/c/Users/igor/projetos-claude/sites/ativos/bitcoin.com/soundsfair-app

# Testar
npm run build

# Fazer mudanças
# ...

# Testar novamente
npm run build

# Commit e push
git add .
git commit -m "sua mensagem"
git push origin main
```

**IMPORTANTE:** Sempre rode `npm run build` ANTES de fazer push!

---

## 🚨 SE AINDA DER ERRO:

### **Erro: npm: command not found**
```powershell
# Instalar Node.js
# Download: https://nodejs.org/
```

### **Erro: Access denied ao deletar**
```powershell
# Fechar VS Code e qualquer terminal aberto
# Tentar deletar novamente
```

### **Build passa mas ainda vê erros no VS Code**
```
# Recarregar VS Code
# Ctrl+Shift+P → "Developer: Reload Window"
```

---

## ✅ CHECKLIST:

- [ ] Abri PowerShell
- [ ] Naveguei para a pasta do projeto
- [ ] Deletei node_modules, .next, package-lock.json
- [ ] Rodei `npm install` (sem erros)
- [ ] Rodei `npm run build` (passou!)
- [ ] Posso voltar ao WSL e usar normalmente

---

## 💡 POR QUE ISSO RESOLVE?

WSL (Linux no Windows) tem problemas com:
- Permissões de arquivo no filesystem do Windows (`/mnt/c`)
- Muitos arquivos pequenos (como node_modules do Next.js)
- Links simbólicos

PowerShell do Windows nativo:
- ✅ Acesso direto ao filesystem
- ✅ Sem conflitos de permissão
- ✅ Deleta/instala corretamente

Depois de instalado pelo PowerShell, o WSL consegue usar normalmente!

---

## 🎯 RESUMO:

1. **PowerShell** → Navegar para pasta
2. **Deletar** → node_modules, .next, package-lock.json
3. **npm install** → Instalar dependências
4. **npm run build** → Testar (deve passar!)
5. **Voltar ao WSL** → Funciona normalmente agora

---

**⏱️ Tempo total: ~5 minutos**

**Depois disso, nunca mais terá esse problema!** ✅
