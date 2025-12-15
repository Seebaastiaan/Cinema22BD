# 🎬 Cinema 22 Dashboard

Dashboard moderno y completo para visualización y gestión del catálogo de películas de Cinema 22, con integración de Stored Procedures, Triggers y Views de MySQL.

## ✨ Características Principales

### 📊 Dashboard Interactivo
- Visualización de estadísticas en tiempo real
- 4 tarjetas con métricas clave (películas, directores, tipos de cine, horarios)
- Diseño con gradientes coloridos y modernos

### 🎥 Catálogo de Películas
- Grid responsivo con tarjetas de películas
- Modales con información detallada
- Horarios de transmisión y cápsulas relacionadas
- Búsqueda y filtrado de películas

### ➕ Alta de Películas
- Formulario completo para crear películas
- Integración con trigger `TR_BeforeInsert_Pelicula_Duracion`
- Creación de horarios con trigger `TR_AfterInsert_Horario`
- Validación automática de duración

### ✏️ Edición de Películas
- Búsqueda de películas existentes
- Actualización de datos con formulario dinámico
- Opción para usar `SP_ActualizarSinopsis` (Stored Procedure)
- Actualización selectiva de campos

### 🔍 Consultas SQL Especiales
- 6 consultas complejas ejecutadas en tiempo real
- Stored Procedures: `SP_ConsultarCarteleraPorTipo`, `SP_ContarPeliculasPorDirector`
- Views: `VW_CarteleraSemanal`, `VW_Capsulas_Asociadas`, `VW_ResumenPeliculasCortas`
- Queries con GROUP BY, HAVING, y JOINs múltiples
- Acordeones con código SQL completo

### 🎨 Interfaz Moderna
- Navegación por pestañas (sin scroll infinito)
- Header sticky con efecto glassmorphism
- Gradientes purple/pink, orange/pink, blue/cyan
- Server Actions para consultas seguras
- Totalmente responsivo (móvil, tablet, desktop)

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **React**: Client Components con useState/useEffect
- **Estilos**: Tailwind CSS v4 (gradientes lineales)
- **Componentes UI**: Shadcn UI + Radix UI
- **Base de Datos**: MySQL 8.0 con mysql2/promise
- **Iconos**: Lucide React
- **TypeScript**: Tipado estricto sin 'any'
- **Server Actions**: 'use server' para operaciones de DB

## 💻 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Seebaastiaan/Cinema22BD.git
cd Cinema22BD
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos local

Copia el archivo de ejemplo y edita con tus credenciales:

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=cinema22_db
```

### 4. Importar base de datos

```bash
# Crear base de datos
mysql -u root -p -e "CREATE DATABASE cinema22_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Importar estructura y datos
mysql -u root -p cinema22_db < proyecto.sql

# Importar stored procedures, triggers y views
mysql -u root -p cinema22_db < proyecto1_1.sql
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 6. Build de producción (opcional)

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
proyecto-database/
├── app/
│   ├── layout.tsx              # Layout principal con metadata SEO
│   ├── page.tsx                # Dashboard con navegación por tabs
│   └── globals.css             # Estilos globales y variables CSS
├── components/
│   ├── ui/                     # Componentes base de Shadcn UI
│   │   ├── button.tsx          # Botones con variantes
│   │   ├── card.tsx            # Tarjetas contenedoras
│   │   ├── dialog.tsx          # Modales/diálogos
│   │   ├── badge.tsx           # Etiquetas pequeñas
│   │   ├── skeleton.tsx        # Loading placeholders
│   │   └── accordion.tsx       # Acordeones expandibles
│   ├── stats-cards.tsx         # 4 tarjetas de estadísticas
│   ├── pelicula-card.tsx       # Tarjeta de película individual
│   ├── pelicula-dialog.tsx     # Modal con detalles completos
│   ├── alta-pelicula.tsx       # Formulario crear película (+ horario)
│   ├── editar-pelicula.tsx     # Búsqueda + formulario edición
│   └── consultas-especiales.tsx # 6 consultas SQL especiales
├── lib/
│   ├── db.ts                   # Pool de conexiones MySQL
│   ├── actions.ts              # Server Actions (12 funciones)
│   ├── types.ts                # Interfaces TypeScript
│   └── utils.ts                # Utilidades (cn, formatDate)
├── proyecto.sql                # Estructura y datos base
├── proyecto1_1.sql             # SPs, Triggers, Views
├── .env.example                # Template de variables
├── .env.production             # Credenciales FreeSQLDatabase
├── vercel.json                 # Configuración Vercel
├── deploy.sh                   # Script automatizado de despliegue
└── DEPLOYMENT_GUIDE.md         # Guía completa de despliegue
```

## 🗄️ Base de Datos

### Tablas Principales

- **pelicula** (30 registros): Películas con título, sinopsis, año, país, duración, ficha técnica
- **director** (12 registros): Directores con biografía
- **tipo_cine** (8 registros): Categorías (Cine de Autor, Culto, Mexicano, etc.)
- **horario_funcion** (30 registros): Funciones programadas con fecha/hora
- **cine_capsula** (30 registros): Cápsulas de contenido relacionado
- **log_cartelera**: Tabla de logs (trigger `TR_AfterInsert_Horario`)

### Stored Procedures

1. **SP_ConsultarCarteleraPorTipo**(nombre_tipo): Películas filtradas por tipo
2. **SP_ContarPeliculasPorDirector**(nombre_director, OUT total): Cuenta películas
3. **SP_ActualizarSinopsis**(id_pelicula, nueva_sinopsis): Actualiza sinopsis

### Triggers

1. **TR_BeforeInsert_Pelicula_Duracion**: Valida duración ≤0 → 1 minuto
2. **TR_AfterInsert_Horario**: Log automático en `log_cartelera`

### Views

1. **VW_CarteleraSemanal**: Horarios completos ordenados
2. **VW_Capsulas_Asociadas**: Cápsulas con película relacionada
3. **VW_ResumenPeliculasCortas**: Películas ≤100 minutos

## 🚀 Despliegue en Vercel con FreeSQLDatabase

### Opción 1: Script Automatizado (Recomendado)

```bash
./deploy.sh
```

Este script:
- ✅ Instala Vercel CLI si no existe
- ✅ Hace login en Vercel
- ✅ Configura todas las variables de entorno
- ✅ Despliega a producción automáticamente

### Opción 2: Manual

**1. Importar base de datos a FreeSQLDatabase**

Ve a [phpMyAdmin](https://www.phpmyadmin.co/) e importa:
1. `proyecto.sql` (estructura y datos)
2. `proyecto1_1.sql` (SPs, triggers, views)

Credenciales:
```
Host: sql5.freesqldatabase.com
Database: sql5811887
User: sql5811887
Password: ca5kptZhSN
Port: 3306
```

**2. Desplegar en Vercel**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Importar proyecto
vercel

# Configurar variables de entorno en Vercel Dashboard
# Settings → Environment Variables:
DB_HOST=sql5.freesqldatabase.com
DB_PORT=3306
DB_USER=sql5811887
DB_PASSWORD=ca5kptZhSN
DB_NAME=sql5811887

# Desplegar
vercel --prod
```

**📚 Guía detallada:** Ver [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## ✅ Checklist de Despliegue

Antes de desplegar, verifica:

- [ ] Base de datos importada en FreeSQLDatabase (proyecto.sql + proyecto1_1.sql)
- [ ] Todas las tablas creadas correctamente (6 tablas)
- [ ] Stored Procedures funcionando (3 SPs)
- [ ] Triggers creados (2 triggers)
- [ ] Views creadas (3 views)
- [ ] Variables de entorno configuradas en Vercel
- [ ] Repositorio subido a GitHub
- [ ] Build local exitoso (`npm run build`)

## 🧪 Testing Post-Despliegue

Después de desplegar, verifica:

### Dashboard Principal
- [ ] 4 tarjetas de stats cargan correctamente
- [ ] Grid de películas muestra todas las películas
- [ ] Modales abren con horarios y cápsulas

### Alta de Película
- [ ] Selects de director y tipo cargan opciones
- [ ] Crear película funciona
- [ ] Trigger valida duración (≤0 → 1)
- [ ] Formulario de horario aparece
- [ ] Trigger guarda log en `log_cartelera`

### Editar Película
- [ ] Búsqueda encuentra películas
- [ ] Formulario se llena con datos
- [ ] Actualización funciona
- [ ] Checkbox SP actualiza sinopsis correctamente

### Consultas SQL
- [ ] Las 6 consultas ejecutan sin errores
- [ ] Datos se muestran en tablas
- [ ] Acordeones muestran código SQL

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica variables de entorno en Vercel
- Confirma que FreeSQLDatabase está activo
- Revisa límites de conexiones

### Error: "Table doesn't exist"
- Reimporta proyecto.sql en phpMyAdmin
- Verifica nombre de base de datos (sql5811887)

### Error: "Procedure does not exist"
- Importa proyecto1_1.sql manualmente
- Ve a Routines en phpMyAdmin y verifica

Ver más en [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#-solución-de-problemas)

## 📊 Funcionalidades Técnicas

### Server Actions Implementadas

```typescript
// Estadísticas y consultas
getDashboardStats()      // Stats del dashboard
getPeliculas()           // Todas las películas
getDirectores()          // Lista de directores
getTiposCine()           // Tipos de cine

// CRUD de películas
crearPelicula()          // INSERT + trigger duración
actualizarPelicula()     // UPDATE dinámico
actualizarSinopsisSP()   // CALL SP_ActualizarSinopsis
buscarPeliculas()        // LIKE search

// Horarios
crearHorarioFuncion()    // INSERT + trigger log

// Consultas especiales (6 queries)
consultarCarteleraPorTipo()
contarPeliculasPorDirector()
// ... y más
```

### Connection Pooling Optimizado

```typescript
// lib/db.ts
connectionLimit: 10       // Máximo 10 conexiones
maxIdle: 10              // Conexiones idle máximas
idleTimeout: 60000       // 60s timeout
enableKeepAlive: true    // Mantener conexión viva
```

## 🎨 Diseño UI/UX

- **Navegación por Tabs**: Elimina scroll infinito
- **Header Sticky**: Siempre visible con glassmorphism
- **Gradientes**: Purple/pink, orange/pink, blue/cyan
- **Responsive**: Mobile-first design
- **Loading States**: Skeletons y spinners
- **Feedback Visual**: Mensajes de éxito/error

## 🔐 Seguridad

- ✅ Prepared statements (previene SQL injection)
- ✅ Variables de entorno (no credenciales en código)
- ✅ Connection pooling (evita sobrecarga)
- ✅ .env.local en .gitignore
- ✅ TypeScript strict mode

## 📚 Recursos

- **Next.js 14**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS v4**: [tailwindcss.com](https://tailwindcss.com)
- **Shadcn UI**: [ui.shadcn.com](https://ui.shadcn.com)
- **MySQL**: [dev.mysql.com/doc](https://dev.mysql.com/doc/)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **FreeSQLDatabase**: [freesqldatabase.com](https://www.freesqldatabase.com)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es para fines educativos - Cinema 22 Database Management.

## 👨‍💻 Autor

**Sebastian**
- GitHub: [@Seebaastiaan](https://github.com/Seebaastiaan)
- Proyecto: Cinema22BD

---

**¡Hecho con ❤️ para Cinema 22!** 🎬🍿
# Cinema22BD
