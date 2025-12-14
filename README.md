# Cinema 22 Dashboard

Dashboard moderno para visualización y gestión del catálogo de películas de Cinema 22.

## 🚀 Características

- **Dashboard Interactivo**: Visualización de estadísticas en tiempo real
- **Catálogo de Películas**: Grid responsivo con tarjetas de películas
- **Detalles Completos**: Modales con información detallada, horarios y cápsulas
- **Server Actions**: Consultas SQL seguras del lado del servidor
- **UI Moderna**: Componentes de Shadcn UI con Tailwind CSS
- **SEO Optimizado**: Metadata completa y estructura semántica
- **Totalmente Responsivo**: Diseño adaptable a todos los dispositivos

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Estilos**: Tailwind CSS v4
- **Componentes**: Shadcn UI
- **Base de Datos**: MySQL
- **Iconos**: Lucide React
- **TypeScript**: Tipado completo

## 📦 Instalación

1. **Instalar dependencias**:

```bash
npm install
```

2. **Configurar la base de datos**:
   - Copia `.env.local.example` a `.env.local`
   - Edita las variables de entorno con tus credenciales de MySQL

```bash
cp .env.local.example .env.local
```

3. **Importar la base de datos**:

```bash
mysql -u root -p < proyecto.sql
```

4. **Ejecutar en desarrollo**:

```bash
npm run dev
```

5. Abrir [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
proyecto-database/
├── app/
│   ├── layout.tsx          # Layout principal con metadata SEO
│   ├── page.tsx             # Dashboard principal
│   └── globals.css          # Estilos globales y variables CSS
├── components/
│   ├── ui/                  # Componentes base de Shadcn UI
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   └── skeleton.tsx
│   ├── stats-cards.tsx      # Tarjetas de estadísticas
│   ├── pelicula-card.tsx    # Tarjeta de película
│   └── pelicula-dialog.tsx  # Modal de detalles
├── lib/
│   ├── db.ts                # Conexión a la base de datos
│   ├── actions.ts           # Server Actions
│   ├── types.ts             # Tipos TypeScript
│   └── utils.ts             # Utilidades
└── proyecto.sql             # Base de datos SQL
```

## 🗄️ Base de Datos

La base de datos `cinema22_db` incluye:

- **pelicula**: 30 películas con información completa
- **director**: Directores de las películas
- **tipo_cine**: Categorías (Cine de Autor, Culto, etc.)
- **horario_funcion**: 30 funciones programadas
- **cine_capsula**: 30 cápsulas de contenido extra

## 🌐 Despliegue en Vercel

1. **Subir tu base de datos** a un servicio como PlanetScale, Railway, o usar Vercel Postgres

2. **Conectar con Vercel**:

```bash
vercel
```

3. **Configurar variables de entorno** en el dashboard de Vercel:

   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`

4. **Desplegar**:

```bash
vercel --prod
```

## 🎨 Características de UI/UX

- **Diseño Minimalista**: Interfaz limpia y fácil de usar
- **Animaciones Suaves**: Transiciones fluidas entre estados
- **Loading States**: Skeletons mientras carga el contenido
- **Modo Oscuro**: Soporte completo para tema oscuro
- **Accesibilidad**: Componentes accesibles por defecto

---

**Desarrollado con ❤️ usando Next.js 14 y Shadcn UI**
# Cinema22BD
