# 🚨 PROBLEMA IDENTIFICADO

Tu error es: **Mezcla de claves LIVE con Price IDs TEST**

## Logs del Error:
```
No such price: 'price_1SdDaSEOmtTzd7dZMJAVQATW'
```

Estás usando:
- ✅ Claves LIVE: `sk_live_...` y `pk_live_...`
- ❌ Price IDs TEST: `price_1SdDaSEOmtTzd7dZMJAVQATW` (modo test)

## SOLUCIÓN RÁPIDA:

### 1. Obtener claves de TEST:

1. Ve a https://dashboard.stripe.com/test/apikeys
2. Asegúrate que el toggle dice "Test mode" (arriba a la derecha)
3. Copia:
   - **Test Publishable Key:** `pk_test_...`
   - **Test Secret Key:** `sk_test_...`

### 2. Actualiza tu `.env.local`:

```env
# Stripe Configuration - MODO TEST
STRIPE_SECRET_KEY=sk_test_TU_CLAVE_AQUI
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_TU_CLAVE_AQUI

# Los Price IDs ya los tienes (son de test):
STRIPE_PRICE_CREADOR_MONTHLY=price_1SdDaSEOmtTzd7dZMJAVQATW
STRIPE_PRICE_PROFESIONAL_MONTHLY=price_1SdDbVEOmtTzd7dZVtpnMEOy
STRIPE_PRICE_ELITE_MONTHLY=price_1SdDbwEOmtTzd7dZO1Keo0JG
```

### 3. (Opcional) Crear precios anuales en TEST:

1. Ve a https://dashboard.stripe.com/test/products
2. Para cada producto (CREADOR, PROFESIONAL, ELITE):
   - Click en el producto
   - Click "Add another price"
   - Selecciona "Recurring"
   - Interval: "Yearly"
   - Amount: 
     - CREADOR: $60
     - PROFESIONAL: $228  
     - ELITE: $588
3. Copia los nuevos Price IDs y actualízalos en `.env.local`

---

## ALTERNATIVA: Usar modo LIVE (Producción)

⚠️ Solo si ya quieres aceptar pagos reales:

1. Ve a https://dashboard.stripe.com/products (sin /test/)
2. Cambia a modo "Live" (toggle arriba)
3. Crea los 3 productos con sus precios mensuales
4. Los Price IDs en LIVE serán diferentes
5. Usa las claves que ya tienes: `sk_live_...` y `pk_live_...`

---

## Tarjetas de prueba (modo TEST):

- **Éxito:** 4242 4242 4242 4242
- **Requiere 3D Secure:** 4000 0025 0000 3155
- **Falla:** 4000 0000 0000 9995
- Fecha: Cualquier fecha futura
- CVV: Cualquier 3 dígitos
- ZIP: Cualquier código postal

