#!/bin/bash

# Script de build optimizado para Render
echo "🚀 Iniciando build optimizado para Render..."

# Configurar variables de entorno para optimización de memoria
export NODE_OPTIONS="--max-old-space-size=8192"
export NODE_ENV="production"

# Limpiar cache de npm
echo "🧹 Limpiando cache..."
npm cache clean --force

# Instalar dependencias de producción únicamente
echo "📦 Instalando dependencias..."
npm ci --only=production --ignore-scripts

# Instalar dependencias de desarrollo necesarias para el build
npm install --no-save @angular/cli @angular-devkit/build-angular

# Construir la aplicación
echo "🔨 Construyendo aplicación..."
npx ng build --configuration production --verbose

echo "✅ Build completado exitosamente!"
