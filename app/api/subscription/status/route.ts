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

    // Log para debugging
    console.log('📊 Subscription data:', {
      id: subscription.id,
      status: subscription.status,
      current_period_end: subscription.current_period_end,
      metadata: subscription.metadata,
    });

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
      if (subscription.current_period_end && typeof subscription.current_period_end === 'number') {
        const date = new Date(subscription.current_period_end * 1000);
        if (!isNaN(date.getTime())) {
          currentPeriodEnd = date.toISOString();
        } else {
          console.error('❌ Invalid timestamp:', subscription.current_period_end);
          currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 días desde ahora
        }
      } else {
        console.error('❌ current_period_end is not a number:', subscription.current_period_end);
        currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 días desde ahora
      }
    } catch (error) {
      console.error('❌ Error converting current_period_end:', error);
      currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 días desde ahora
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
