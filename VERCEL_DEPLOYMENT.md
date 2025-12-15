# Guía de Despliegue a Vercel con FreeSQLDatabase

## 📋 Pasos para Desplegar

### 1. Importar Base de Datos a FreeSQLDatabase

1. Ve a [phpmyadmin en FreeSQLDatabase](https://www.phpmyadmin.co/)
2. Inicia sesión con tus credenciales:
   - **Host**: sql5.freesqldatabase.com
   - **Usuario**: sql5811887
   - **Contraseña**: ca5kptZhSN
   - **Base de datos**: sql5811887

3. Ve a la pestaña **"Importar"**
4. Selecciona tu archivo `proyecto.sql`
5. Click en **"Continuar"** para importar

### 2. Configurar Variables de Entorno

Las variables ya están configuradas en `.env.local` y `.env.production`:

```bash
DB_HOST=sql5.freesqldatabase.com
DB_PORT=3306
DB_USER=sql5811887
DB_PASSWORD=ca5kptZhSN
DB_NAME=sql5811887
```

### 3. Subir a GitHub

```bash
# Inicializar repositorio si no lo has hecho
git init
git add .
git commit -m "Initial commit - Cinema 22 Dashboard"

# Crear repositorio en GitHub y luego:
git remote add origin https://github.com/TU_USUARIO/Cinema22BD.git
git branch -M main
git push -u origin main
```

### 4. Desplegar en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Conecta tu cuenta de GitHub
3. Importa el repositorio `Cinema22BD`
4. En **"Environment Variables"**, agrega las siguientes variables:

   ```
   DB_HOST = sql5.freesqldatabase.com
   DB_PORT = 3306
   DB_USER = sql5811887
   DB_PASSWORD = ca5kptZhSN
   DB_NAME = sql5811887
   ```

5. Click en **"Deploy"**

### 5. Verificar Despliegue

Una vez desplegado:
- Vercel te dará una URL como: `https://cinema22bd.vercel.app`
- Visita la URL y verifica que todo funcione correctamente
- Las consultas SQL deberían ejecutarse sin problemas

## 🔧 Troubleshooting

### Error: "Can't connect to MySQL server"

**Solución**: FreeSQLDatabase a veces tiene límites de conexiones simultáneas. Verifica:
1. Que las credenciales estén correctas en Vercel
2. Que la base de datos esté activa en FreeSQLDatabase
3. Espera unos minutos si el servicio está ocupado

### Error: "Table doesn't exist"

**Solución**: La base de datos no se importó correctamente
1. Ve a phpMyAdmin
2. Verifica que existan las tablas: `pelicula`, `director`, `tipo_cine`, etc.
3. Si no existen, reimporta `proyecto.sql`

### Límite de Conexiones

FreeSQLDatabase tiene límites en el plan gratuito:
- **Conexiones simultáneas**: 30
- **Tamaño de BD**: 5MB
- Si tienes problemas, considera usar PlanetScale o Railway (tienen planes gratuitos más generosos)

## 📊 Monitoreo

Vercel te proporciona:
- **Analytics**: Visitas y rendimiento
- **Logs**: Errores en tiempo real (Function Logs)
- **Speed Insights**: Métricas de velocidad

## 🔄 Actualizaciones

Para actualizar tu proyecto:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Vercel automáticamente detectará los cambios y redesplegará.

## 🌟 Dominios Personalizados

En el panel de Vercel, puedes agregar un dominio personalizado:
1. Ve a **Settings** → **Domains**
2. Agrega tu dominio
3. Configura los DNS según las instrucciones

## 🔒 Seguridad

**Importante**: 
- Las variables de entorno en Vercel están encriptadas
- Nunca compartas tu archivo `.env.local` públicamente
- El `.gitignore` ya está configurado para ignorar archivos `.env`

## ✅ Checklist Final

- [ ] Base de datos importada en FreeSQLDatabase
- [ ] Variables de entorno configuradas en Vercel
- [ ] Código subido a GitHub
- [ ] Proyecto desplegado en Vercel
- [ ] Todas las páginas funcionan correctamente
- [ ] Las consultas SQL se ejecutan sin errores
