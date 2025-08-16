#!/bin/bash

# Script de despliegue para Render
echo "🚀 Iniciando despliegue en Render..."

# Variables de entorno
export NODE_ENV=production
export ANGULAR_ENABLE_BUNDLE_BUDGETS=false

# Información de debug
echo "📋 Variables de entorno:"
echo "   NODE_ENV: $NODE_ENV"
echo "   PORT: $PORT"
echo "   PWD: $(pwd)"

# Verificar que el build existe
if [ ! -d "dist/almuerzos-peru-front" ]; then
    echo "❌ Error: No se encontró el directorio dist/almuerzos-peru-front"
    exit 1
fi

echo "✅ Directorio dist encontrado"

# Verificar archivos esenciales
if [ ! -f "dist/almuerzos-peru-front/server/server.mjs" ]; then
    echo "❌ Error: No se encontró server.mjs"
    exit 1
fi

if [ ! -d "dist/almuerzos-peru-front/browser" ]; then
    echo "❌ Error: No se encontró el directorio browser"
    exit 1
fi

echo "✅ Archivos esenciales verificados"

# Verificar traducciones
if [ ! -f "dist/almuerzos-peru-front/browser/messages/es.json" ]; then
    echo "⚠️  Advertencia: No se encontraron archivos de traducción"
else
    echo "✅ Archivos de traducción encontrados"
fi

echo "🎯 Listo para iniciar el servidor..."

# Iniciar el servidor
exec node dist/almuerzos-peru-front/server/server.mjs
