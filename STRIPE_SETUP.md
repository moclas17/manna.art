# Configuración de Stripe para Manna Art

## 1. Crear cuenta en Stripe

Si aún no tienes una cuenta:
1. Ve a [stripe.com](https://stripe.com)
2. Crea una cuenta
3. Completa el proceso de verificación

## 2. Obtener las claves API

1. Ve a [Dashboard de Stripe](https://dashboard.stripe.com/test/apikeys)
2. Cambia a modo "Test" (toggle en la parte superior derecha)
3. Copia las siguientes claves:
   - **Publishable key** (comienza con `pk_test_`)
   - **Secret key** (comienza con `sk_test_`)

## 3. Crear los productos y precios en Stripe

### Opción A: Usando el Dashboard de Stripe (Recomendado)

1. Ve a [Productos](https://dashboard.stripe.com/test/products)
2. Crea 3 productos:

#### Producto 1: Plan CREADOR
- **Nombre:** Plan CREADOR
- **Descripción:** Hasta 4 registros por mes
- **Precio mensual:** $5 USD
- **Precio anual:** $60 USD
- Copia los Price IDs que se generen

#### Producto 2: Plan PROFESIONAL
- **Nombre:** Plan PROFESIONAL
- **Descripción:** Hasta 20 registros mensuales
- **Precio mensual:** $19 USD
- **Precio anual:** $228 USD
- Copia los Price IDs que se generen

#### Producto 3: Plan ELITE
- **Nombre:** Plan ELITE
- **Descripción:** Hasta 100 registros mensuales
- **Precio mensual:** $49 USD
- **Precio anual:** $588 USD
- Copia los Price IDs que se generen

### Opción B: Usando Stripe CLI

```bash
# Instalar Stripe CLI
brew install stripe/stripe-brew/stripe

# Login
stripe login

# Crear productos y precios
stripe products create --name="Plan CREADOR" --description="Hasta 4 registros por mes"
stripe prices create --product=PRODUCT_ID --unit-amount=500 --currency=usd --recurring[interval]=month
stripe prices create --product=PRODUCT_ID --unit-amount=6000 --currency=usd --recurring[interval]=year

# Repetir para PROFESIONAL ($19/mes, $228/año) y ELITE ($49/mes, $588/año)
```

## 4. Actualizar las variables de entorno

Edita el archivo `.env.local` y actualiza las siguientes variables:

```env
# Claves de API de Stripe
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui

# Price IDs (copiarlos desde el dashboard de Stripe)
STRIPE_PRICE_CREADOR_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_CREADOR_YEARLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_PROFESIONAL_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_PROFESIONAL_YEARLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_ELITE_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_ELITE_YEARLY=price_xxxxxxxxxxxxx

# URL base (cambiar en producción)
NEXT_PUBLIC_URL=http://localhost:3000
```

## 5. Configurar Webhooks (Opcional pero recomendado)

Para recibir notificaciones cuando se complete un pago:

1. Ve a [Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Clic en "Add endpoint"
3. URL: `https://tu-dominio.com/api/webhooks/stripe`
4. Eventos a escuchar:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## 6. Probar la integración

1. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

2. Visita `http://localhost:3000`
3. Conecta tu wallet
4. Intenta suscribirte a un plan
5. Usa las tarjetas de prueba de Stripe:
   - **Éxito:** 4242 4242 4242 4242
   - **Requiere autenticación:** 4000 0025 0000 3155
   - **Falla:** 4000 0000 0000 9995
   - Cualquier fecha futura para expiración
   - Cualquier CVV de 3 dígitos

## 7. Producción

Cuando estés listo para producción:

1. Cambia a modo "Live" en Stripe
2. Obtén las claves de producción (empiezan con `pk_live_` y `sk_live_`)
3. Crea los productos en modo Live
4. Actualiza las variables de entorno en tu servidor de producción
5. Actualiza `NEXT_PUBLIC_URL` con tu dominio real

## Recursos adicionales

- [Documentación de Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Documentación de Suscripciones](https://stripe.com/docs/billing/subscriptions/overview)
- [Testing con Stripe](https://stripe.com/docs/testing)
