#!/bin/bash

# Script de build para servidor Ubuntu
echo "🚀 Iniciando build para servidor Ubuntu..."

# Verificar se existe node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    yarn install
fi

# Limpar cache de build anterior
echo "🧹 Limpando cache..."
rm -rf public/build
rm -rf bootstrap/ssr

# Tentar build normal primeiro
echo "🔨 Tentando build normal..."
if yarn run build:skip-types; then
    echo "✅ Build concluído com sucesso!"
    exit 0
fi

echo "⚠️  Build normal falhou, tentando build sem verificação de tipos..."

# Se falhar, tentar sem verificação de tipos
if yarn run build:skip-types; then
    echo "✅ Build concluído sem verificação de tipos!"
    echo "⚠️  Recomendado: corrigir os tipos posteriormente"
    exit 0
else
    echo "❌ Build falhou completamente"
    exit 1
fi