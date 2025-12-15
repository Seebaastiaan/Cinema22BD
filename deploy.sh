#!/bin/bash

# 🚀 Script de Configuración para Despliegue en Vercel
# Este script configura las variables de entorno en Vercel

echo "🎬 Cinema22 - Configuración de Despliegue en Vercel"
echo "=================================================="
echo ""

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI no está instalado"
    echo "📦 Instalando Vercel CLI..."
    npm i -g vercel
fi

echo "✅ Vercel CLI disponible"
echo ""

# Login en Vercel
echo "🔐 Iniciando sesión en Vercel..."
vercel login

echo ""
echo "📝 Configurando variables de entorno..."
echo ""

# Variables de FreeSQLDatabase
DB_HOST="sql5.freesqldatabase.com"
DB_PORT="3306"
DB_USER="sql5811887"
DB_PASSWORD="ca5kptZhSN"
DB_NAME="sql5811887"

# Agregar variables de entorno
echo "$DB_HOST" | vercel env add DB_HOST production
echo "$DB_PORT" | vercel env add DB_PORT production
echo "$DB_USER" | vercel env add DB_USER production
echo "$DB_PASSWORD" | vercel env add DB_PASSWORD production
echo "$DB_NAME" | vercel env add DB_NAME production

echo ""
echo "✅ Variables de entorno configuradas"
echo ""

# Desplegar
echo "🚀 Desplegando a Vercel..."
vercel --prod

echo ""
echo "🎉 ¡Despliegue completado!"
echo ""
echo "📊 Panel de Vercel: https://vercel.com/dashboard"
echo "🗄️ phpMyAdmin: https://www.phpmyadmin.co/"
echo ""
