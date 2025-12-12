# Manna Art - Login con Dynamic.xyz para Story Protocol

Proyecto de autenticacion Web3 usando Dynamic.xyz integrado con Story Protocol Mainnet.

## Caracteristicas

- Autenticacion segura con Dynamic.xyz
- Soporte para multiples wallets (MetaMask, WalletConnect, Coinbase Wallet, etc.)
- Integracion con Story Protocol Mainnet
- Gestion de identidad Web3
- Cambio automatico de red a Story Protocol
- Interfaz moderna y responsive

## Requisitos Previos

- Node.js 18+
- npm o yarn
- Una wallet Web3 (MetaMask, WalletConnect compatible, etc.)

## Configuracion

### 1. Obtener Environment ID de Dynamic.xyz

1. Ve a [Dynamic.xyz Dashboard](https://app.dynamic.xyz/)
2. Crea una cuenta o inicia sesion
3. Crea un nuevo proyecto
4. Copia tu **Environment ID** del dashboard

### 2. Configurar Variables de Entorno

Edita el archivo [.env.local](.env.local) y reemplaza con tu Environment ID real si es necesario:

```env
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=tu_environment_id_real
NEXT_PUBLIC_STORY_CHAIN_ID=1514
```

### 3. Instalar Dependencias

```bash
npm install
```

## Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build para Produccion

```bash
npm run build
npm start
```

## Estructura del Proyecto

```
manna.art/
├── app/
│   ├── layout.tsx          # Layout principal con Providers
│   ├── page.tsx            # Pagina principal
│   ├── providers.tsx       # Provider de Dynamic.xyz
│   └── globals.css         # Estilos globales
├── components/
│   ├── LoginButton.tsx     # Boton de login/logout
│   ├── WalletInfo.tsx      # Informacion de la wallet
│   └── StoryChainStatus.tsx # Estado de conexion a Story Protocol
├── hooks/
│   └── useStoryProtocol.ts # Hook para interactuar con Story Protocol
├── lib/
│   ├── dynamic-config.ts   # Configuracion de Dynamic.xyz
│   └── story-config.ts     # Configuracion de Story Protocol
├── .env.local              # Variables de entorno
└── package.json
```

## Configuracion de Story Protocol

El proyecto esta preconfigurado para conectarse a **Story Protocol Mainnet**:

- **Chain ID**: 1514
- **RPC URL**: https://mainnet.storyrpc.io
- **Explorer**: https://mainnet.storyscan.xyz
- **Native Currency**: IP

### Obtener Tokens IP

Para obtener tokens IP en mainnet:
- Puedes adquirirlos en exchanges que soporten Story Protocol
- O utilizar bridges compatibles para transferir activos

## Uso

1. Haz clic en "Conectar Wallet"
2. Selecciona tu wallet preferida (MetaMask, WalletConnect, etc.)
3. Autoriza la conexion
4. Si no estas en Story Protocol Mainnet, haz clic en "Cambiar a Story Protocol"
5. Tu wallet se conectara automaticamente a la mainnet de Story

## Caracteristicas de Dynamic.xyz

Dynamic.xyz proporciona:

- **Multi-wallet support**: MetaMask, WalletConnect, Coinbase Wallet, Rainbow, y mas
- **Embedded wallets**: Wallets integradas para usuarios sin wallet propia
- **Email/Social login**: Autenticacion con email o redes sociales
- **Multi-chain**: Soporte para multiples blockchains
- **MPC Wallets**: Seguridad mejorada con Multi-Party Computation

## Tecnologias Utilizadas

- [Next.js 14](https://nextjs.org/) - Framework de React
- [Dynamic.xyz](https://www.dynamic.xyz/) - Autenticacion Web3
- [Story Protocol](https://story.foundation/) - Protocol de IP en blockchain
- [Viem](https://viem.sh/) - Libreria de Ethereum
- [TypeScript](https://www.typescriptlang.org/) - Tipado estatico

## Story Protocol - Configuración Inicial

### ⚠️ Error al Registrar Obras de Arte?

Si obtienes el error `Workflow__CallerNotAuthorizedToMint`, necesitas crear tu propio SPG (Story Protocol Gateway).

**Solución rápida**: Ver [QUICK_START.md](./QUICK_START.md)

**Documentación completa**: Ver [STORY_PROTOCOL_SETUP.md](./STORY_PROTOCOL_SETUP.md)

### Verificar Balance y Configuración

```bash
node scripts/check-wallet-simple.js
```

### Crear tu SPG Personalizado

```bash
npx tsx scripts/create-spg.ts
```

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Compilar para producción
- `npm start` - Ejecutar en producción
- `node scripts/check-wallet-simple.js` - Verificar wallet del servidor
- `npx tsx scripts/create-spg.ts` - Crear SPG personalizado

## Recursos

- [Documentacion de Dynamic.xyz](https://docs.dynamic.xyz/)
- [Documentacion de Story Protocol](https://docs.story.foundation/)
- [Story Protocol GitHub](https://github.com/storyprotocol)
- [ChainList - Story Mainnet](https://chainlist.org/chain/1514)

## Licencia

MIT
