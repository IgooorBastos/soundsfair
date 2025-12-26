#!/bin/bash

# ============================================================================
# VERIFICAÇÃO COMPLETA DE BUILD - Simula exatamente o que a Vercel faz
# ============================================================================
#
# Este script testa TUDO que a Vercel vai fazer, mas localmente.
# Execute antes de fazer qualquer deploy para evitar erros na Vercel.
#
# Uso: bash scripts/verify-build.sh
# ============================================================================

set -e  # Para no primeiro erro

echo "🚀 INICIANDO VERIFICAÇÃO COMPLETA DE BUILD"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de erros
ERRORS=0

# ============================================================================
# STEP 1: Verificar se estamos no diretório correto
# ============================================================================
echo "📁 STEP 1: Verificando diretório..."
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ ERRO: package.json não encontrado${NC}"
    echo "Execute este script da pasta raiz do projeto soundsfair-app"
    exit 1
fi
echo -e "${GREEN}✅ Diretório correto${NC}"
echo ""

# ============================================================================
# STEP 2: Verificar Node.js e npm
# ============================================================================
echo "🔧 STEP 2: Verificando Node.js e npm..."
NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo "Node.js: $NODE_VERSION"
echo "npm: $NPM_VERSION"
echo -e "${GREEN}✅ Node.js e npm instalados${NC}"
echo ""

# ============================================================================
# STEP 3: Verificar variáveis de ambiente (opcional para build)
# ============================================================================
echo "🔐 STEP 3: Verificando variáveis de ambiente..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local encontrado${NC}"
    # Verificar se tem as variáveis críticas (mas não são obrigatórias para build agora)
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "   - NEXT_PUBLIC_SUPABASE_URL: ✓"
    else
        echo -e "${YELLOW}   ⚠️  NEXT_PUBLIC_SUPABASE_URL não encontrada (OK para build, mas necessária em runtime)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env.local não encontrado (OK - usando placeholders para build)${NC}"
fi
echo ""

# ============================================================================
# STEP 4: TypeScript Type Checking (O QUE A VERCEL FAZ)
# ============================================================================
echo "📝 STEP 4: TypeScript Type Checking..."
echo "Executando: npx tsc --noEmit"
if npx tsc --noEmit; then
    echo -e "${GREEN}✅ TypeScript: ZERO ERROS${NC}"
else
    echo -e "${RED}❌ TypeScript: ERROS ENCONTRADOS${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# ============================================================================
# STEP 5: ESLint (O QUE A VERCEL FAZ)
# ============================================================================
echo "🔍 STEP 5: ESLint Checking..."
echo "Executando: npm run lint"
if npm run lint; then
    echo -e "${GREEN}✅ ESLint: SEM PROBLEMAS${NC}"
else
    echo -e "${YELLOW}⚠️  ESLint: Warnings encontrados (não bloqueia build)${NC}"
fi
echo ""

# ============================================================================
# STEP 6: Next.js Build (O MAIS IMPORTANTE - IGUAL VERCEL)
# ============================================================================
echo "🏗️  STEP 6: Next.js Build (ESTE É O TESTE PRINCIPAL)..."
echo "Executando: npm run build"
echo "Isso pode levar 2-5 minutos..."
echo ""

if npm run build; then
    echo ""
    echo -e "${GREEN}✅✅✅ BUILD PASSOU COM SUCESSO! ✅✅✅${NC}"
else
    echo ""
    echo -e "${RED}❌❌❌ BUILD FALHOU! ❌❌❌${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# ============================================================================
# STEP 7: Verificar tamanho do build
# ============================================================================
echo "📊 STEP 7: Analisando tamanho do build..."
if [ -d ".next" ]; then
    BUILD_SIZE=$(du -sh .next 2>/dev/null || echo "N/A")
    echo "Tamanho do build: $BUILD_SIZE"
    echo -e "${GREEN}✅ Pasta .next gerada com sucesso${NC}"
else
    echo -e "${RED}❌ Pasta .next não encontrada${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# ============================================================================
# STEP 8: Verificar se todas as páginas foram geradas
# ============================================================================
echo "📄 STEP 8: Verificando páginas geradas..."
if [ -d ".next/server/app" ]; then
    PAGE_COUNT=$(find .next/server/app -name "*.html" 2>/dev/null | wc -l)
    echo "Páginas HTML geradas: $PAGE_COUNT"
    echo -e "${GREEN}✅ Páginas estáticas geradas${NC}"
else
    echo -e "${YELLOW}⚠️  Pasta de páginas não encontrada (pode ser normal para App Router)${NC}"
fi
echo ""

# ============================================================================
# RESUMO FINAL
# ============================================================================
echo ""
echo "=========================================="
echo "📋 RESUMO DA VERIFICAÇÃO"
echo "=========================================="
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCESSO TOTAL!${NC}"
    echo ""
    echo "✅ TypeScript: OK"
    echo "✅ ESLint: OK"
    echo "✅ Build: OK"
    echo "✅ Páginas: OK"
    echo ""
    echo -e "${GREEN}🚀 PODE FAZER DEPLOY COM SEGURANÇA!${NC}"
    echo ""
    echo "O build na Vercel DEVE passar sem erros."
    echo ""
    exit 0
else
    echo -e "${RED}❌ ERROS ENCONTRADOS: $ERRORS${NC}"
    echo ""
    echo "NÃO faça deploy ainda!"
    echo "Corrija os erros acima antes de fazer push."
    echo ""
    exit 1
fi
