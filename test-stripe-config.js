// Script para verificar la configuración de Stripe
const fs = require('fs');
const path = require('path');

// Leer .env.local manualmente
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

console.log('\n🔍 Verificando configuración de Stripe...\n');

const config = {
  'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY,
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  'STRIPE_PRICE_CREADOR_MONTHLY': process.env.STRIPE_PRICE_CREADOR_MONTHLY,
  'STRIPE_PRICE_CREADOR_YEARLY': process.env.STRIPE_PRICE_CREADOR_YEARLY,
  'STRIPE_PRICE_PROFESIONAL_MONTHLY': process.env.STRIPE_PRICE_PROFESIONAL_MONTHLY,
  'STRIPE_PRICE_PROFESIONAL_YEARLY': process.env.STRIPE_PRICE_PROFESIONAL_YEARLY,
  'STRIPE_PRICE_ELITE_MONTHLY': process.env.STRIPE_PRICE_ELITE_MONTHLY,
  'STRIPE_PRICE_ELITE_YEARLY': process.env.STRIPE_PRICE_ELITE_YEARLY,
  'NEXT_PUBLIC_URL': process.env.NEXT_PUBLIC_URL,
};

let hasErrors = false;

Object.entries(config).forEach(([key, value]) => {
  const isConfigured = value && !value.includes('_id') && !value.includes('aqui');
  const status = isConfigured ? '✅' : '❌';
  const displayValue = value ? (key.includes('SECRET') ? value.substring(0, 12) + '...' : value) : 'NO CONFIGURADO';

  console.log(`${status} ${key}: ${displayValue}`);

  if (!isConfigured) {
    hasErrors = true;
  }
});

console.log('\n');

if (hasErrors) {
  console.log('❌ Hay variables de entorno sin configurar correctamente.');
  console.log('\n📋 Para configurar los precios faltantes:');
  console.log('1. Ve a https://dashboard.stripe.com/products');
  console.log('2. Crea los precios anuales para cada plan');
  console.log('3. Copia los Price IDs (empiezan con "price_")');
  console.log('4. Actualiza el archivo .env.local\n');
} else {
  console.log('✅ Todas las variables de entorno están configuradas correctamente!\n');
}

// Test de conexión con Stripe
if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('aqui')) {
  console.log('🔌 Probando conexión con Stripe...\n');

  const Stripe = require('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
  });

  stripe.prices.list({ limit: 3 })
    .then(prices => {
      console.log('✅ Conexión exitosa con Stripe!');
      console.log(`📊 Precios disponibles en tu cuenta: ${prices.data.length > 0 ? prices.data.length : 'Ninguno'}\n`);

      if (prices.data.length > 0) {
        console.log('Primeros precios encontrados:');
        prices.data.slice(0, 3).forEach(price => {
          console.log(`  - ${price.id}: $${(price.unit_amount || 0) / 100} ${price.currency.toUpperCase()} ${price.recurring?.interval || 'one-time'}`);
        });
        console.log('');
      }
    })
    .catch(error => {
      console.error('❌ Error al conectar con Stripe:', error.message);
    });
}
