# Guía de Despliegue - Cinema 22 Dashboard

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Base de datos MySQL accesible online o cuenta en un servicio de base de datos
- Repositorio Git (GitHub, GitLab, o Bitbucket)

## 🗄️ Opción 1: Desplegar con MySQL Externo

### Paso 1: Preparar la Base de Datos

Puedes usar cualquiera de estos servicios gratuitos/económicos:

#### A. PlanetScale (Recomendado)

1. Crea una cuenta en [PlanetScale](https://planetscale.com)
2. Crea una nueva base de datos
3. Usa el CLI o la interfaz web para importar `proyecto.sql`
4. Obtén las credenciales de conexión

#### B. Railway

1. Crea una cuenta en [Railway](https://railway.app)
2. Crea un nuevo proyecto MySQL
3. Conecta vía MySQL CLI y ejecuta `proyecto.sql`
4. Copia las variables de entorno

#### C. Aiven

1. Crea una cuenta en [Aiven](https://aiven.io)
2. Crea un servicio MySQL
3. Importa la base de datos
4. Obtén las credenciales

### Paso 2: Desplegar en Vercel

1. **Push tu código a Git**:

```bash
git add .
git commit -m "Initial commit - Cinema 22 Dashboard"
git push origin main
```

2. **Conectar con Vercel**:

   - Ve a [vercel.com/new](https://vercel.com/new)
   - Importa tu repositorio
   - Configura las variables de entorno:
     ```
     DB_HOST=tu-servidor.mysql.com
     DB_USER=tu_usuario
     DB_PASSWORD=tu_contraseña_segura
     DB_NAME=cinema22_db
     ```

3. **Desplegar**:
   - Click en "Deploy"
   - Espera a que termine el despliegue
   - Tu aplicación estará en `https://tu-proyecto.vercel.app`

## 🐘 Opción 2: Desplegar con Vercel Postgres

Si prefieres usar Vercel Postgres (recomendado para mejor integración):

### Paso 1: Instalar Dependencias de Postgres

```bash
npm install @vercel/postgres
```

### Paso 2: Actualizar `lib/db.ts`

```typescript
import { sql } from "@vercel/postgres";

export async function query<T>(sqlQuery: string, params?: any[]): Promise<T[]> {
  try {
    const result = params
      ? await sql.query(sqlQuery, params)
      : await sql.query(sqlQuery);
    return result.rows as T[];
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Error al consultar la base de datos");
  }
}
```

### Paso 3: Convertir SQL de MySQL a PostgreSQL

El archivo `proyecto.sql` necesita algunos ajustes:

```sql
-- Cambiar AUTO_INCREMENT por SERIAL
-- MySQL:
id_pelicula INT AUTO_INCREMENT PRIMARY KEY

-- PostgreSQL:
id_pelicula SERIAL PRIMARY KEY

-- Cambiar YEAR por INTEGER
-- MySQL:
anio_lanzamiento YEAR NOT NULL

-- PostgreSQL:
anio_lanzamiento INTEGER NOT NULL

-- Cambiar DATETIME por TIMESTAMP
-- MySQL:
fecha_hora_transmision DATETIME NOT NULL

-- PostgreSQL:
fecha_hora_transmision TIMESTAMP NOT NULL
```

### Paso 4: Configurar Vercel Postgres

1. En tu proyecto de Vercel, ve a "Storage"
2. Click en "Create Database"
3. Selecciona "Postgres"
4. Conecta usando el CLI de Vercel:

```bash
vercel env pull .env.local
```

5. Ejecuta las migraciones:

```bash
psql $POSTGRES_URL < proyecto-postgres.sql
```

## 🔒 Variables de Entorno en Vercel

En el dashboard de Vercel > Settings > Environment Variables:

### Para MySQL:

```
DB_HOST=host.railway.app
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=cinema22_db
```

### Para Postgres:

```
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
```

## 🚀 Despliegue desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

## 🔄 Actualizar el Despliegue

Cada vez que hagas push a tu rama principal, Vercel desplegará automáticamente:

```bash
git add .
git commit -m "Update: descripción de cambios"
git push origin main
```

## 📊 Monitoreo

- **Logs**: Vercel Dashboard > Deployments > Tu deployment > Logs
- **Analytics**: Vercel Dashboard > Analytics
- **Performance**: Vercel Dashboard > Speed Insights

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

- Verifica que las variables de entorno estén correctas
- Asegúrate de que el servidor de BD acepte conexiones externas
- Verifica que la IP de Vercel no esté bloqueada

### Error: "Module not found"

- Ejecuta `npm install` localmente
- Verifica que `package.json` tenga todas las dependencias
- Haz commit y push de `package-lock.json`

### Páginas en blanco

- Revisa los logs en Vercel Dashboard
- Verifica que la base de datos tenga datos
- Asegúrate de que todas las Server Actions funcionen

## 📈 Optimizaciones para Producción

### 1. Caché de Queries

En `lib/actions.ts`, añade revalidación:

```typescript
export const revalidate = 60; // Revalidar cada 60 segundos

export async function getPeliculas() {
  // ... tu código
}
```

### 2. Imágenes (si las añades después)

Usa el componente `next/image` para optimización automática

### 3. Loading States

Ya implementados con Skeleton components

### 4. Error Boundaries

Crea `app/error.tsx` para manejo de errores:

```typescript
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Algo salió mal!</h2>
      <button onClick={() => reset()}>Intentar de nuevo</button>
    </div>
  );
}
```

## 🔐 Seguridad

- ✅ Server Actions protegen las queries SQL
- ✅ Variables de entorno no expuestas al cliente
- ✅ Prepared statements previenen SQL injection
- ⚠️ Considera añadir autenticación para admin

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs de Vercel
2. Verifica las variables de entorno
3. Asegúrate de que la BD esté accesible
4. Revisa la consola del navegador

---

**¡Tu aplicación está lista para producción! 🎉**
