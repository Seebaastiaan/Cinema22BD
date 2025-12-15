# 🚀 Quick Deploy - Cinema22 a Vercel

## Pasos Rápidos (5 minutos)

### 1️⃣ Importar Base de Datos

1. Ve a: https://www.phpmyadmin.co/
2. Login:
   - **Server**: sql5.freesqldatabase.com
   - **Username**: sql5811887
   - **Password**: ca5kptZhSN
3. Selecciona base de datos: `sql5811887`
4. Tab "Importar" → Sube `proyecto.sql` → Ejecutar
5. Tab "Importar" → Sube `proyecto1_1.sql` → Ejecutar
6. ✅ Verifica en tab "Estructura" que existen 6 tablas

### 2️⃣ Preparar Repositorio

```bash
# Si no tienes Git inicializado
git init
git add .
git commit -m "🎬 Cinema22 - Ready for deployment"

# Sube a GitHub
git remote add origin https://github.com/Seebaastiaan/Cinema22BD.git
git push -u origin main
```

### 3️⃣ Desplegar en Vercel

**Opción A: Usando el Script (Automático)**

```bash
./deploy.sh
```

**Opción B: Manual**

```bash
# Instalar CLI si no la tienes
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Cuando pregunte:
# - Link to existing project? No
# - Project name: cinema22bd
# - Directory: ./
# - Override settings? No

# Configurar variables (en dashboard.vercel.com):
# Project → Settings → Environment Variables
# Agrega estas 5 variables:

DB_HOST=sql5.freesqldatabase.com
DB_PORT=3306
DB_USER=sql5811887
DB_PASSWORD=ca5kptZhSN
DB_NAME=sql5811887

# Redeploy con variables
vercel --prod
```

### 4️⃣ Verificar

Abre tu URL de Vercel y verifica:

- [ ] Dashboard carga con stats
- [ ] Grid de películas funciona
- [ ] Puedes crear una película
- [ ] Puedes editar una película
- [ ] Consultas SQL muestran datos

## 🔧 Variables de Entorno en Vercel

```bash
DB_HOST=sql5.freesqldatabase.com
DB_PORT=3306
DB_USER=sql5811887
DB_PASSWORD=ca5kptZhSN
DB_NAME=sql5811887
```

## ⚡ Comandos Útiles

```bash
# Ver logs en tiempo real
vercel logs --follow

# Redeploy
vercel --prod

# Ver info del proyecto
vercel inspect

# Eliminar deployment
vercel remove
```

## 🐛 Problemas Comunes

**"Cannot connect to database"**
→ Verifica variables de entorno en Vercel Dashboard

**"Table doesn't exist"**
→ Reimporta proyecto.sql en phpMyAdmin

**"Build failed"**
→ Prueba local: `npm run build`

---

**Listo en 5 minutos** ⚡ Ver guía completa: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
