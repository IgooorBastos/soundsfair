#!/bin/bash

# ============================================================================
# VERIFICAÇÃO RÁPIDA - Apenas TypeScript
# ============================================================================
#
# Este script faz apenas a verificação TypeScript (mais rápido).
# Use quando quiser verificar rapidamente se há erros de tipo.
#
# Uso: bash scripts/quick-check.sh
# ============================================================================

echo "⚡ VERIFICAÇÃO RÁPIDA DE TYPESCRIPT"
echo "===================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "📝 Executando: npx tsc --noEmit"
echo ""

if npx tsc --noEmit 2>&1; then
    echo ""
    echo -e "${GREEN}✅ ZERO ERROS TYPESCRIPT!${NC}"
    echo ""
    echo "Pode prosseguir com o build completo ou deploy."
    exit 0
else
    echo ""
    echo -e "${RED}❌ ERROS TYPESCRIPT ENCONTRADOS!${NC}"
    echo ""
    echo "Corrija os erros acima antes de fazer deploy."
    exit 1
fi
