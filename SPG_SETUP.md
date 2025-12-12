# Configuración de SPG Personalizado

Este documento explica cómo crear y configurar tu propio SPG (Story Protocol Gateway) NFT Collection para tener control total sobre los permisos de minteo.

## ¿Por qué crear tu propio SPG?

Al usar el SPG público de Story Protocol, necesitas que el owner del contrato te autorice para mintear. Con tu propio SPG:

- ✅ Eres el owner del contrato
- ✅ Puedes autorizar cualquier wallet para mintear
- ✅ Control total sobre las fees de minteo
- ✅ Personalización completa de la colección

## Opción 1: Usar el Script

### 1. Instalar dependencias

```bash
npm install --save-dev tsx
```

### 2. Crear el SPG

```bash
# Con valores por defecto
npx tsx scripts/create-spg.ts

# Con valores personalizados
SPG_NAME="Manna Art Collection" \
SPG_SYMBOL="MANNA" \
SPG_PUBLIC_MINTING="false" \
npx tsx scripts/create-spg.ts
```

### 3. Configurar la variable de entorno

Después de crear el SPG, agrega la dirección del contrato a tu `.env.local`:

```env
SPG_NFT_CONTRACT=0x...  # Dirección del contrato SPG creado
```

## Opción 2: Usar la API

### Crear SPG vía API

```bash
POST /api/spg/create
Content-Type: application/json

{
  "name": "Manna Art Collection",
  "symbol": "MANNA",
  "isPublicMinting": false,
  "mintFeeRecipient": "0x0000000000000000000000000000000000000000"
}
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "spgNftContract": "0x...",
    "txHash": "0x...",
    "storyscanUrl": "https://mainnet.storyscan.xyz/address/0x...",
    "message": "SPG NFT Collection creado exitosamente..."
  }
}
```

## Configuración de Variables de Entorno

Agrega estas variables a tu `.env.local`:

```env
# Wallet del servidor (requerida)
STORY_WALLET_PRIVATE_KEY=0x...

# RPC URL de Story Protocol (opcional, tiene default)
STORY_RPC_URL=https://mainnet.storyrpc.io

# Contrato SPG personalizado (opcional, usa el público por defecto)
SPG_NFT_CONTRACT=0x...
```

## Parámetros del SPG

| Parámetro | Descripción | Default |
|-----------|-------------|---------|
| `name` | Nombre de la colección | "Manna Art Collection" |
| `symbol` | Símbolo del token | "MANNA" |
| `isPublicMinting` | Si `true`, cualquiera puede mintear. Si `false`, solo wallets autorizadas | `false` |
| `mintOpen` | Si está abierto para mintear al crear | `true` |
| `mintFeeRecipient` | Dirección que recibe las fees de minteo | `0x0000...` (sin fees) |
| `contractURI` | URI del contrato (ERC-7572) | `""` |
| `baseURI` | Base URI para los tokens | `undefined` |
| `owner` | Owner del contrato | Wallet del servidor |

## Autorizar Wallets para Mintear

Si `isPublicMinting` es `false`, necesitas autorizar wallets para mintear.

### Opción A: Usar Storyscan

1. Ve a https://mainnet.storyscan.xyz/address/YOUR_SPG_CONTRACT
2. Conecta tu wallet (debe ser el owner)
3. Ejecuta la función `setMintAuthorized(address, true)`

### Opción B: Script con viem

```typescript
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

const account = privateKeyToAccount('0x...' as `0x${string}`);
const client = createWalletClient({
  account,
  chain: mainnet,
  transport: http('https://mainnet.storyrpc.io')
});

await client.writeContract({
  address: 'YOUR_SPG_CONTRACT',
  abi: [...], // ABI del contrato SPG
  functionName: 'setMintAuthorized',
  args: ['WALLET_TO_AUTHORIZE', true]
});
```

## Verificar Autorización

Para verificar si una wallet está autorizada:

1. Usa Storyscan para leer el contrato
2. Llama al método `mintAuthorized(address)` del contrato SPG

## Solución de Problemas

### Error: "Workflow__CallerNotAuthorizedToMint"

**Causa**: La wallet del servidor no está autorizada para mintear.

**Solución**:
1. Si usas SPG público: Contacta al owner o crea tu propio SPG
2. Si usas SPG personalizado: Autoriza la wallet del servidor usando `setMintAuthorized`

### Error: "SPG_NFT_CONTRACT no configurado"

**Solución**: Agrega la variable de entorno `SPG_NFT_CONTRACT` a tu `.env.local`

## Recursos

- [Documentación de Story Protocol SPG](https://docs.story.foundation/concepts/spg/overview)
- [Storyscan Explorer](https://mainnet.storyscan.xyz)
- [SDK de Story Protocol](https://docs.story.foundation/sdk-reference/nftclient)


