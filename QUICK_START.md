# Inicio Rápido - Resolver Error de Story Protocol

## Estado Actual

✅ **Wallet del servidor configurada**: `0x4a5Cde56d7F753B3F9212a74dDF232416CFA4fA5`
✅ **Balance suficiente**: 0.122 IP tokens
❌ **SPG_NFT_CONTRACT**: No configurado (usando SPG público sin permisos)

## Problema

Al intentar registrar una obra de arte, obtienes:
```
Error: Workflow__CallerNotAuthorizedToMint
```

**Causa**: La wallet del servidor no tiene permisos en el SPG público.

## Solución en 3 Pasos

### Paso 1: Crear tu Propio SPG

Ejecuta el script para crear tu SPG personalizado:

```bash
npx tsx scripts/create-spg.ts
```

Esto creará un contrato SPG donde **tú eres el owner** y tu wallet del servidor tiene permisos automáticos para mintear.

**Salida esperada:**
```
✅ SPG NFT Collection creado exitosamente!

📝 Agrega esta variable de entorno a tu archivo .env.local:
SPG_NFT_CONTRACT=0xABCD1234...
```

### Paso 2: Configurar la Variable de Entorno

1. Copia la dirección del contrato SPG que se muestra
2. Abre el archivo [.env.local](.env.local)
3. Agrega al final:

```env
# Tu SPG NFT Collection personalizado
SPG_NFT_CONTRACT=0xABCD1234...TU_DIRECCION_AQUI...
```

### Paso 3: Reiniciar el Servidor

```bash
# Detén el servidor (Ctrl+C en la terminal donde corre)
# Luego reinicia:
npm run dev
```

### Paso 4: Probar el Registro

1. Ve a [http://localhost:3001/register](http://localhost:3001/register)
2. Conecta tu wallet
3. Sube una obra de arte
4. Debería registrarse exitosamente en Story Protocol

## Verificación

Para verificar que todo está configurado correctamente:

```bash
node scripts/check-wallet-simple.js
```

Deberías ver:
```
✅ SPG_NFT_CONTRACT: 0xABCD1234... (configurado)
```

## Ver tus NFTs

Una vez registrados, puedes ver tus NFTs en:

- **Tu SPG Contract**: `https://mainnet.storyscan.xyz/address/TU_SPG_CONTRACT`
- **Tu Wallet**: `https://mainnet.storyscan.xyz/address/0x4a5Cde56d7F753B3F9212a74dDF232416CFA4fA5`

## Alternativa: Usar la API

Si prefieres usar la API en lugar del script:

```bash
curl -X POST http://localhost:3001/api/spg/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Manna Art Collection",
    "symbol": "MANNA",
    "isPublicMinting": false
  }'
```

## Troubleshooting

### Error: "insufficient funds"

Tu balance es de 0.122 IP tokens, lo cual debería ser suficiente. Si obtienes este error:

1. Verifica el balance actualizado: `node scripts/check-wallet-simple.js`
2. Si el balance es muy bajo, envía más IP tokens a: `0x4a5Cde56d7F753B3F9212a74dDF232416CFA4fA5`

### Error: "Transaction reverted"

Verifica la transacción en Storyscan para ver el error específico.

### SPG ya creado pero sigue el error

1. Asegúrate de haber agregado `SPG_NFT_CONTRACT` a `.env.local`
2. Reinicia el servidor con `Ctrl+C` y `npm run dev`
3. Verifica la configuración con: `node scripts/check-wallet-simple.js`

## Documentación Completa

Para más detalles, ver [STORY_PROTOCOL_SETUP.md](./STORY_PROTOCOL_SETUP.md)

---

**Siguiente paso**: Ejecuta `npx tsx scripts/create-spg.ts` para crear tu SPG personalizado.
