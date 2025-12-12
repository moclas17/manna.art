# Configuración de Story Protocol

Este documento explica cómo resolver el error de autorización al mintear NFTs en Story Protocol.

## Problema

Cuando intentas registrar una obra de arte, obtienes el error:
```
Workflow__CallerNotAuthorizedToMint
```

Esto significa que la wallet del servidor (configurada en `STORY_WALLET_PRIVATE_KEY`) no tiene permisos para mintear NFTs en el contrato SPG (Story Protocol Gateway) que estás usando.

## Solución: Crear tu propio SPG

La mejor solución es crear tu **propio SPG NFT Collection**. Esto te da control total sobre:

- ✅ Permisos de minteo (tú eres el owner)
- ✅ Configuración de fees
- ✅ Autorización de wallets
- ✅ Metadata del contrato
- ✅ Sin dependencias de contratos públicos

### Opción 1: Usar el Script (Recomendado)

```bash
npx tsx scripts/create-spg.ts
```

El script te mostrará:
```
✅ SPG NFT Collection creado exitosamente!

📝 Agrega esta variable de entorno a tu archivo .env.local:
SPG_NFT_CONTRACT=0x...tu_direccion_del_spg...

🔗 Ver en Storyscan:
https://mainnet.storyscan.xyz/address/0x...
```

### Opción 2: Usar la API

```bash
curl -X POST http://localhost:3001/api/spg/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Manna Art Collection",
    "symbol": "MANNA",
    "isPublicMinting": false
  }'
```

### Opción 3: Personalizar la Configuración

Puedes personalizar el SPG usando variables de entorno:

```bash
SPG_NAME="Mi Colección" \
SPG_SYMBOL="MIC" \
SPG_PUBLIC_MINTING=false \
npx tsx scripts/create-spg.ts
```

## Configuración

### 1. Crea tu SPG

Ejecuta cualquiera de las opciones anteriores. Recibirás una dirección de contrato como:
```
SPG_NFT_CONTRACT=0x1234567890abcdef...
```

### 2. Agrega la Variable de Entorno

Edita tu archivo [.env.local](.env.local) y agrega:

```env
# Tu SPG NFT Collection personalizado
SPG_NFT_CONTRACT=0x1234567890abcdef...
```

### 3. Reinicia el Servidor

```bash
# Detén el servidor (Ctrl+C) y reinicia
npm run dev
```

### 4. Prueba el Registro

Ahora intenta registrar una obra de arte nuevamente. Debería funcionar sin problemas.

## Verificación

Para verificar que tu SPG está configurado correctamente:

1. **Ver tu contrato en Storyscan:**
   ```
   https://mainnet.storyscan.xyz/address/TU_SPG_CONTRACT
   ```

2. **Verificar el owner:**
   El owner debe ser tu wallet del servidor (STORY_WALLET_PRIVATE_KEY)

3. **Verificar configuración:**
   - `isPublicMinting`: false (solo wallets autorizadas)
   - `mintOpen`: true (abierto para mintear)

## Permisos de Minteo

### Como Owner del SPG

Como owner del contrato SPG, tu wallet del servidor ya tiene permisos para mintear. No necesitas autorización adicional.

### Autorizar Otras Wallets (Opcional)

Si quieres autorizar otras wallets para mintear en tu SPG:

1. Ve a Storyscan: `https://mainnet.storyscan.xyz/address/TU_SPG_CONTRACT`
2. Conecta tu wallet (la del owner)
3. Llama a la función `setMintAuthorized(address, bool)`:
   - `address`: Wallet a autorizar
   - `bool`: `true` para autorizar, `false` para revocar

O usa un script con viem directamente.

## Costos

Crear un SPG tiene un costo de gas en Story Mainnet. Asegúrate de que tu wallet del servidor tenga suficientes tokens IP para pagar el gas.

Para ver el balance de tu wallet:
```bash
# Tu wallet del servidor
WALLET_ADDRESS=$(npx tsx -e "import { getServerWalletAddress } from './lib/story-client'; console.log(getServerWalletAddress())")
echo "Tu wallet: $WALLET_ADDRESS"
echo "Ver balance en: https://mainnet.storyscan.xyz/address/$WALLET_ADDRESS"
```

## Troubleshooting

### Error: Insufficient balance

Tu wallet del servidor no tiene suficientes tokens IP. Necesitas enviar tokens IP a la wallet configurada en `STORY_WALLET_PRIVATE_KEY`.

### Error: STORY_WALLET_PRIVATE_KEY no está configurada

Asegúrate de que tu archivo `.env.local` tenga la variable:
```env
STORY_WALLET_PRIVATE_KEY=tu_private_key_sin_0x
```

### Error: Contrato SPG no responde

Verifica que el contrato se haya creado correctamente en Storyscan. Si no aparece, es posible que la transacción haya fallado.

## Documentación Adicional

- [Story Protocol Docs](https://docs.story.foundation/)
- [SPG Overview](https://docs.story.foundation/concepts/spg/overview)
- [Deployed Contracts](https://docs.story.foundation/developers/deployed-smart-contracts)
- [Story Mainnet Explorer](https://mainnet.storyscan.xyz)

## Próximos Pasos

Una vez que tu SPG esté configurado:

1. ✅ Registra obras de arte sin problemas de autorización
2. ✅ Configura royalties y licencias personalizadas
3. ✅ Autoriza wallets adicionales si lo necesitas
4. ✅ Monitorea tus NFTs en Storyscan

---

**Nota:** Este SPG es tuyo. Tienes control total sobre él. Úsalo de forma responsable y asegúrate de mantener segura la private key de tu wallet del servidor.
