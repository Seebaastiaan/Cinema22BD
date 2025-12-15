# 🚀 Guía de Despliegue a Vercel con FreeSQLDatabase

Esta guía te ayudará a desplegar tu aplicación Cinema22 en Vercel usando FreeSQLDatabase como base de datos MySQL remota.

## 📦 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [FreeSQLDatabase](https://www.freesqldatabase.com)
- Repositorio de GitHub con tu proyecto
- Base de datos ya importada en FreeSQLDatabase

## 🔧 Configuración de FreeSQLDatabase

### Credenciales de tu Base de Datos

```
Host: sql5.freesqldatabase.com
Database name: sql5811887
Database user: sql5811887
Database password: ca5kptZhSN
Port number: 3306
```

### 1. Importar Base de Datos

1. Ve a [phpMyAdmin de FreeSQLDatabase](https://www.phpmyadmin.co/)
2. Inicia sesión con las credenciales de arriba
3. Selecciona la base de datos `sql5811887`
4. Ve a la pestaña **"Importar"**
5. Selecciona tu archivo `proyecto.sql` o `proyecto1_1.sql`
6. Click en **"Continuar"**
7. Verifica que todas las tablas se crearon correctamente

**Tablas esperadas:**
- `pelicula`
- `director`
- `tipo_cine`
- `horario_funcion`
- `cine_capsula`
- `log_cartelera` (creada por trigger)

**Stored Procedures esperados:**
- `SP_ConsultarCarteleraPorTipo`
- `SP_ContarPeliculasPorDirector`
- `SP_ActualizarSinopsis`

**Triggers esperados:**
- `TR_BeforeInsert_Pelicula_Duracion`
- `TR_AfterInsert_Horario`

**Views esperadas:**
- `VW_CarteleraSemanal`
- `VW_Capsulas_Asociadas`
- `VW_ResumenPeliculasCortas`

## 📤 Subir Proyecto a GitHub

Si no has subido tu proyecto a GitHub:

```bash
# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Crear commit inicial
git commit -m "🎬 Cinema22 Dashboard - Initial commit"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/TU_USUARIO/Cinema22BD.git
git branch -M main
git push -u origin main
```

**Importante:** Verifica que `.env.local` está en `.gitignore` para no subir credenciales locales.

## 🌐 Desplegar en Vercel

### Opción 1: Desde Vercel Dashboard (Recomendado)

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click en **"Import Git Repository"**
3. Selecciona tu repositorio `Cinema22BD`
4. En **"Configure Project"**, agrega las siguientes **Environment Variables**:

```bash
DB_HOST=sql5.freesqldatabase.com
DB_PORT=3306
DB_USER=sql5811887
DB_PASSWORD=ca5kptZhSN
DB_NAME=sql5811887
```

5. Click en **"Deploy"**
6. Espera a que termine el despliegue (2-3 minutos)

### Opción 2: Usando Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Desplegar
vercel

# Configurar variables de entorno
vercel env add DB_HOST
# Valor: sql5.freesqldatabase.com

vercel env add DB_PORT
# Valor: 3306

vercel env add DB_USER
# Valor: sql5811887

vercel env add DB_PASSWORD
# Valor: ca5kptZhSN

vercel env add DB_NAME
# Valor: sql5811887

# Redesplegar con las nuevas variables
vercel --prod
```

## ✅ Verificación Post-Despliegue

Una vez desplegado, visita tu URL de Vercel y verifica:

### 1. Dashboard Principal (Inicio)
- ✅ 4 tarjetas de estadísticas se cargan correctamente
- ✅ Grid de películas muestra todas las películas
- ✅ Modales de películas abren con detalles completos

### 2. Alta de Película
- ✅ Formulario carga directores y tipos de cine
- ✅ Crear película funciona
- ✅ Trigger `TR_BeforeInsert_Pelicula_Duracion` se activa (duración <= 0 → 1)
- ✅ Formulario de horario aparece después de crear película
- ✅ Crear horario funciona
- ✅ Trigger `TR_AfterInsert_Horario` guarda en `log_cartelera`

### 3. Editar Película
- ✅ Búsqueda encuentra películas
- ✅ Seleccionar película carga datos en formulario
- ✅ Actualizar película funciona
- ✅ Checkbox "Usar Stored Procedure" funciona para sinopsis
- ✅ `SP_ActualizarSinopsis` se ejecuta correctamente

### 4. Consultas SQL
- ✅ Todas las 6 consultas se ejecutan sin errores
- ✅ Datos se muestran correctamente
- ✅ Acordeones con código SQL funcionan

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

**Causa:** Variables de entorno no configuradas o incorrectas.

**Solución:**
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Verifica que todas las variables estén correctas
4. Redeploy desde Deployments → ⋯ → Redeploy

### Error: "Table doesn't exist"

**Causa:** Base de datos no importada correctamente.

**Solución:**
1. Ve a phpMyAdmin de FreeSQLDatabase
2. Verifica que todas las tablas existen
3. Si faltan, importa nuevamente `proyecto.sql`

### Error: "Procedure does not exist"

**Causa:** Stored Procedures no se crearon en la importación.

**Solución:**
1. Ve a phpMyAdmin → Routines
2. Verifica que existen los 3 SPs
3. Si faltan, ejecuta manualmente las sentencias `CREATE PROCEDURE` de `proyecto1_1.sql`

### Error: "Too many connections"

**Causa:** Connection pool lleno (límite de FreeSQLDatabase).

**Solución:**
1. FreeSQLDatabase tiene límite de conexiones simultáneas
2. La configuración actual ya usa connection pooling optimizado
3. Si persiste, considera upgrade a plan pago de FreeSQLDatabase

### Las imágenes no cargan

**Causa:** Las URLs de imágenes usan rutas locales o no existen.

**Solución:**
1. Actualiza las URLs en la base de datos con imágenes de TMDB o URLs públicas
2. Ejemplo: `https://image.tmdb.org/t/p/w500/ruta_imagen.jpg`

## 🔄 Actualizar Despliegue

Cuando hagas cambios en tu código:

```bash
# Commit cambios
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Vercel automáticamente detectará el push y redesplegará tu aplicación.

## 📊 Monitoreo

### Ver Logs en Tiempo Real

1. Ve a Vercel Dashboard → Tu Proyecto
2. Click en la pestaña **"Logs"**
3. Puedes ver errores, queries de base de datos, etc.

### Métricas de Base de Datos

FreeSQLDatabase tiene límites:
- **Queries por hora:** Variable según plan
- **Almacenamiento:** 5MB en plan gratuito
- **Conexiones simultáneas:** Limitadas

Monitorea el uso en el dashboard de FreeSQLDatabase.

## 🎉 ¡Listo!

Tu aplicación Cinema22 está ahora en producción:

```
🌐 URL de Producción: https://tu-proyecto.vercel.app
📊 Dashboard de Vercel: https://vercel.com/tu-usuario/cinema22bd
🗄️ phpMyAdmin: https://www.phpmyadmin.co/
```

## 🔐 Seguridad

### Mejores Prácticas

1. ✅ **Nunca** commits archivos `.env.local` a Git
2. ✅ Variables de entorno configuradas en Vercel (no en código)
3. ✅ Connection pooling configurado para evitar sobrecargar DB
4. ✅ Prepared statements usados en todas las queries (previene SQL injection)

### Rotación de Credenciales

Si necesitas cambiar la contraseña de la base de datos:
1. Cambia en FreeSQLDatabase
2. Actualiza en Vercel → Settings → Environment Variables
3. Redeploy la aplicación

## 📱 Soporte

- **Vercel Docs:** https://vercel.com/docs
- **FreeSQLDatabase Support:** https://www.freesqldatabase.com/support
- **Next.js Docs:** https://nextjs.org/docs

---

**¡Disfruta tu aplicación Cinema22 en producción! 🎬🍿**
