import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY no está configurada');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
});

const PLAN_LIMITS = {
  CREADOR: 4,
  PROFESIONAL: 20,
  ELITE: 100,
};

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // MODO DESARROLLO: Simular suscripción para testing
    // Cambia DEV_MODE_SKIP_SUBSCRIPTION a false en producción
    if (process.env.DEV_MODE_SKIP_SUBSCRIPTION === 'true') {
      console.log('🔧 Development mode: Simulating active subscription for', email);
      return NextResponse.json({
        subscription: {
          id: 'dev_sub_' + Date.now(),
          plan: 'PROFESIONAL',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          registrationsUsed: 0,
          registrationsLimit: PLAN_LIMITS['PROFESIONAL'],
        },
      });
    }

    // Buscar cliente por email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ subscription: null });
    }

    const customer = customers.data[0];

    // Buscar suscripciones activas
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ subscription: null });
    }

    const subscription = subscriptions.data[0];

    // Acceder a current_period_end o usar billing_cycle_anchor como fallback
    let periodEnd = (subscription as any).current_period_end;

    // Si current_period_end no existe, calcular desde billing_cycle_anchor o created
    if (!periodEnd) {
      const anchorTimestamp = (subscription as any).billing_cycle_anchor || subscription.created;

      // Obtener el intervalo del plan (mensual, anual, etc.)
      const planInterval = subscription.items?.data?.[0]?.price?.recurring?.interval;
      const intervalCount = subscription.items?.data?.[0]?.price?.recurring?.interval_count || 1;

      // Calcular el siguiente período basado en el intervalo
      let monthsToAdd = 1; // default: mensual
      if (planInterval === 'year') {
        monthsToAdd = 12 * intervalCount;
      } else if (planInterval === 'month') {
        monthsToAdd = intervalCount;
      }

      // Calcular timestamp del final del período
      const anchorDate = new Date(anchorTimestamp * 1000);
      anchorDate.setMonth(anchorDate.getMonth() + monthsToAdd);
      periodEnd = Math.floor(anchorDate.getTime() / 1000);
    }

    const planName = subscription.metadata?.planName as 'CREADOR' | 'PROFESIONAL' | 'ELITE';

    // Si no hay planName en metadata, intentar inferirlo del price ID
    if (!planName) {
      console.warn('⚠️ No planName found in subscription metadata');
    }

    // En producción, deberías almacenar el uso en una base de datos
    // Por ahora, usaremos metadata de Stripe
    const registrationsUsed = parseInt(subscription.metadata?.registrationsUsed || '0');

    // Validar que current_period_end es un número válido antes de convertir
    let currentPeriodEnd: string;
    try {
      if (periodEnd && typeof periodEnd === 'number') {
        const date = new Date(periodEnd * 1000);
        if (!isNaN(date.getTime())) {
          currentPeriodEnd = date.toISOString();
        } else {
          console.error('❌ Invalid timestamp:', periodEnd);
          currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        }
      } else {
        console.error('❌ current_period_end is not a number:', periodEnd);
        currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }
    } catch (error) {
      console.error('❌ Error converting current_period_end:', error);
      currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        plan: planName || 'CREADOR',
        status: subscription.status,
        currentPeriodEnd,
        registrationsUsed,
        registrationsLimit: PLAN_LIMITS[planName] || PLAN_LIMITS['CREADOR'],
      },
    });
  } catch (error: any) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
