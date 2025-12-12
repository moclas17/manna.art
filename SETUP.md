# Manna Art - Guía de Configuración

## Resumen del Sistema

Manna Art es una plataforma que permite a los creadores registrar su propiedad intelectual en blockchain usando Story Protocol, con almacenamiento permanente en Arweave y gestión de suscripciones mediante Stripe.

## Arquitectura

1. **Autenticación**: Dynamic.xyz (wallets Web3)
2. **Pagos**: Stripe (suscripciones)
3. **Almacenamiento**: Arweave (archivos y metadata)
4. **Blockchain IP**: Story Protocol (registro de propiedad intelectual)

## Variables de Entorno Necesarias

Copia `.env.example` a `.env.local` y configura las siguientes variables:

### 1. Dynamic.xyz (Autenticación)
```bash
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_id
```
- Obtener en: https://app.dynamic.xyz/
- Crea un proyecto y copia el Environment ID

### 2. Stripe (Pagos)
```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Price IDs (crear en Stripe Dashboard)
STRIPE_PRICE_CREADOR_MONTHLY=price_...
STRIPE_PRICE_PROFESIONAL_MONTHLY=price_...
STRIPE_PRICE_ELITE_MONTHLY=price_...
```

**Configurar Productos en Stripe:**
1. Ve a https://dashboard.stripe.com/test/products
2. Crea 3 productos:
   - **CREADOR**: $5 USD mensual (4 registros/mes)
   - **PROFESIONAL**: $19 USD mensual (20 registros/mes)
   - **ELITE**: $49 USD mensual (100 registros/mes)
3. Copia los Price IDs generados

### 3. Arweave (Almacenamiento)
```bash
ARWEAVE_WALLET_KEY={"kty":"RSA",...}
```

**Obtener Wallet de Arweave:**

Opción A - Usando CLI:
```bash
npm install -g arweave
arweave key-generate wallet.json
cat wallet.json
```

Opción B - Web:
1. Ve a https://arweave.app/
2. Crea una cuenta y genera una wallet
3. Descarga el archivo JSON de la wallet

**⚠️ IMPORTANTE**:
- Necesitas AR tokens para subir archivos
- Puedes obtener tokens gratis para testing en: https://faucet.arweave.net/
- Pega el contenido completo del JSON en una sola línea en `.env.local`

### 4. Story Protocol (Blockchain IP)
```bash
STORY_WALLET_PRIVATE_KEY=0x...
STORY_RPC_URL=https://mainnet.storyrpc.io  # o https://rpc.odyssey.storyrpc.io para testnet

# Opcional: SPG personalizado (recomendado para producción)
SPG_NFT_CONTRACT=0x...  # Dirección de tu SPG personalizado
```

**Obtener Wallet para Story Protocol:**
1. Crea una wallet Ethereum (puedes usar MetaMask)
2. Exporta la private key
3. ⚠️ **NUNCA compartas esta clave**
4. ⚠️ **Usa una wallet separada solo para la aplicación**

**Crear SPG Personalizado (Recomendado):**
Para tener control total sobre los permisos de minteo, crea tu propio SPG:

```bash
# Instalar tsx si no está instalado
npm install --save-dev tsx

# Crear SPG
npm run create-spg

# O con valores personalizados
SPG_NAME="Manna Art Collection" SPG_SYMBOL="MANNA" npm run create-spg
```

Después de crear el SPG, agrega la dirección a `.env.local`:
```bash
SPG_NFT_CONTRACT=0x...  # Dirección del contrato creado
```

Ver [SPG_SETUP.md](./SPG_SETUP.md) para más detalles.

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus valores

# Iniciar servidor de desarrollo
npm run dev
```

## Flujo de Usuario

1. **Usuario se conecta** con su wallet (Dynamic.xyz)
2. **Compra suscripción** (Stripe Checkout)
   - CREADOR: $5/mes → 4 registros
   - PROFESIONAL: $19/mes → 20 registros
   - ELITE: $49/mes → 100 registros
3. **Accede al Dashboard** después de suscribirse
4. **Registra su obra**:
   - Sube archivo (imagen, video, audio, etc.)
   - Archivo se almacena en Arweave (permanente)
   - Metadata se sube a Arweave
   - Se prepara para registro en Story Protocol
5. **Contador de registros** se actualiza en Stripe

## Estructura de Archivos

```
manna.art/
├── app/
│   ├── api/
│   │   ├── create-checkout-session/  # Crear sesión de pago Stripe
│   │   ├── subscription/status/      # Verificar suscripción activa
│   │   └── register-ip/              # Registrar obra en Arweave
│   ├── page.tsx                      # Página principal
│   └── success/                      # Página de éxito post-pago
├── components/
│   ├── Header.tsx                    # Navegación y auth
│   ├── PricingCard.tsx              # Tarjetas de planes
│   ├── Dashboard.tsx                # Panel principal
│   ├── SubscriptionStatus.tsx       # Info de suscripción
│   └── IPRegistration.tsx           # Formulario de registro
├── hooks/
│   └── useSubscription.ts           # Hook para suscripción
├── lib/
│   ├── arweave-client.ts           # Cliente Arweave
│   ├── story-client.ts             # Cliente Story Protocol
│   └── dynamic-config.ts           # Config Dynamic.xyz
└── .env.local                       # Variables de entorno
```

## Testing

### 1. Test de Autenticación
- Conecta tu wallet
- Verifica que aparece tu email

### 2. Test de Stripe
- Usa tarjeta de prueba: `4242 4242 4242 4242`
- Fecha: cualquier fecha futura
- CVC: cualquier 3 dígitos
- Compra una suscripción

### 3. Test de Registro de Obra
- Después de suscribirte, ve al Dashboard
- Llena el formulario de registro
- Sube un archivo pequeño (< 1MB para testing)
- Verifica el link de Arweave generado

## Próximos Pasos (TODO)

1. **Completar integración con Story Protocol**:
   - ✅ Mint de NFT automático
   - ✅ Registro del NFT como IP Asset
   - ✅ Configurar términos de licencia
   - ✅ Crear SPG personalizado para control de permisos

2. **Mejorar UX**:
   - Preview de archivos antes de subir
   - Progress bar de upload
   - Galería de obras registradas

3. **Seguridad**:
   - Rate limiting en APIs
   - Validación de tipos de archivo
   - Sanitización de inputs

4. **Producción**:
   - Cambiar a Stripe LIVE mode
   - Cambiar a Story Protocol mainnet
   - Configurar dominio personalizado

## Soporte

Para problemas o preguntas:
- Story Protocol: https://docs.story.foundation/
- Arweave: https://docs.arweave.org/
- Stripe: https://stripe.com/docs
- Dynamic.xyz: https://docs.dynamic.xyz/
