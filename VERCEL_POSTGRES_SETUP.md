# Configuración de Vercel Postgres

Este proyecto ahora usa **Vercel Postgres** en producción para almacenar los artworks, reemplazando el sistema de archivos JSON que causaba errores `EROFS: read-only file system` en Vercel.

## ¿Por qué Vercel Postgres?

Vercel usa un sistema de archivos de solo lectura, por lo que no puedes guardar archivos en el disco. La solución es usar una base de datos externa.

## Configuración en Vercel

### 1. Crear la base de datos Postgres

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en la pestaña **Storage**
3. Haz clic en **Create Database**
4. Selecciona **Postgres**
5. Dale un nombre (ejemplo: `manna-art-db`)
6. Haz clic en **Create**

### 2. Conectar la base de datos a tu proyecto

1. Una vez creada la base de datos, Vercel te mostrará las variables de entorno
2. Haz clic en **Connect Project** y selecciona tu proyecto
3. Las variables de entorno se agregarán automáticamente:
   - `POSTGRES_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NO_SSL`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

### 3. La tabla se crea automáticamente

La primera vez que se ejecute la aplicación en producción, el código creará automáticamente la tabla `artworks` con el esquema correcto.

## Migración de datos existentes (Opcional)

Si tienes datos en `data/artworks.json` que quieres migrar a Postgres:

### Opción 1: Via API (Recomendado)

Puedes crear un script simple que lea el JSON y llame a tu API para crear cada artwork.

### Opción 2: Via SQL directo

1. Ve a la pestaña **Data** en tu base de datos de Vercel
2. Usa la consola SQL para insertar los datos manualmente

Ejemplo:
```sql
INSERT INTO artworks (
  id, title, description, ip_type, file_url, file_id,
  metadata_url, metadata_id, creator_wallet, creator_email,
  created_at, likes, views, ip_id, nft_token_id,
  license_terms_ids, parent_ip_id, is_remix
) VALUES (
  'artwork_1765579002457_ovyimr9lk',
  'Rock 01',
  'Rock 01',
  'image',
  'https://arweave.net/d4kVybSsj2efRgLcXfTN5SCaM5MxMSQhjwj3gTOx6yA',
  'd4kVybSsj2efRgLcXfTN5SCaM5MxMSQhjwj3gTOx6yA',
  'https://arweave.net/59JrsNOWZa0dr7MmDgo4agOprAmLM4d8145W0GE9Ynw',
  '59JrsNOWZa0dr7MmDgo4agOprAmLM4d8145W0GE9Ynw',
  '0x0e88AC34917a6BF5E36bFdc2C6C658E58078A1e6',
  'erik.valle@gmail.com',
  '2025-12-12T22:36:42.457Z',
  0,
  0,
  '0xBA8E2293960dB60D532a1166d962D5Db0D6963A9',
  '5',
  ARRAY['28412'],
  NULL,
  FALSE
);
```

## Funcionamiento en Desarrollo vs Producción

### Desarrollo Local
- Usa el archivo `data/artworks.json` (como antes)
- No requiere configuración adicional
- Los cambios se guardan en el archivo JSON

### Producción (Vercel)
- Usa Vercel Postgres automáticamente
- Detecta el entorno usando `process.env.VERCEL_ENV === 'production'`
- Requiere que la base de datos esté configurada

## Verificar que funciona

1. Despliega tu aplicación en Vercel
2. Intenta crear un nuevo artwork
3. Verifica en los logs que se guardó correctamente
4. Puedes ver los datos en la pestaña **Data** de tu base de datos en Vercel

## Solución de problemas

### Error: "relation 'artworks' does not exist"
- La tabla aún no se ha creado
- Espera unos segundos y vuelve a intentar
- Verifica los logs de deployment en Vercel

### Error: "POSTGRES_URL is not defined"
- Asegúrate de haber conectado la base de datos a tu proyecto
- Verifica que las variables de entorno estén configuradas en Vercel
- Haz un nuevo deployment después de agregar las variables

### Los datos no persisten
- Verifica que estés en producción (`VERCEL_ENV=production`)
- Revisa los logs para ver si hay errores de conexión
- Asegúrate de que la base de datos esté en la misma región que tu proyecto

## Costos

Vercel Postgres tiene un tier gratuito que incluye:
- 256 MB de almacenamiento
- 60 horas de compute por mes

Esto debería ser suficiente para empezar. Puedes escalar más adelante si es necesario.

## Más información

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Postgres SDK](https://vercel.com/docs/storage/vercel-postgres/sdk)
