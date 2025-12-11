import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY no está configurada en las variables de entorno');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
});

// Definir los precios de Stripe
const PRICE_IDS = {
  CREADOR_MONTHLY: process.env.STRIPE_PRICE_CREADOR_MONTHLY,
  CREADOR_YEARLY: process.env.STRIPE_PRICE_CREADOR_YEARLY,
  PROFESIONAL_MONTHLY: process.env.STRIPE_PRICE_PROFESIONAL_MONTHLY,
  PROFESIONAL_YEARLY: process.env.STRIPE_PRICE_PROFESIONAL_YEARLY,
  ELITE_MONTHLY: process.env.STRIPE_PRICE_ELITE_MONTHLY,
  ELITE_YEARLY: process.env.STRIPE_PRICE_ELITE_YEARLY,
};

export async function POST(request: NextRequest) {
  try {
    const { planName, isYearly, userEmail } = await request.json();

    console.log('📝 Procesando suscripción:', { planName, isYearly, userEmail });

    // Validar que el email existe
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Determinar qué price ID usar
    let priceId: string | undefined;

    if (planName === 'CREADOR') {
      priceId = isYearly ? PRICE_IDS.CREADOR_YEARLY : PRICE_IDS.CREADOR_MONTHLY;
    } else if (planName === 'PROFESIONAL') {
      priceId = isYearly ? PRICE_IDS.PROFESIONAL_YEARLY : PRICE_IDS.PROFESIONAL_MONTHLY;
    } else if (planName === 'ELITE') {
      priceId = isYearly ? PRICE_IDS.ELITE_YEARLY : PRICE_IDS.ELITE_MONTHLY;
    } else {
      return NextResponse.json(
        { error: 'Plan inválido' },
        { status: 400 }
      );
    }

    // Validar que el price ID existe
    if (!priceId || priceId.includes('_id')) {
      console.error('❌ Price ID no configurado:', priceId);
      return NextResponse.json(
        { error: `Price ID para el plan ${planName} (${isYearly ? 'anual' : 'mensual'}) no está configurado. Por favor, configura STRIPE_PRICE_${planName}_${isYearly ? 'YEARLY' : 'MONTHLY'} en .env.local` },
        { status: 500 }
      );
    }

    console.log('💳 Usando Price ID:', priceId);

    // Crear la sesión de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/?canceled=true`,
      metadata: {
        planName,
        isYearly: isYearly.toString(),
      },
      subscription_data: {
        metadata: {
          planName,
          isYearly: isYearly.toString(),
          registrationsUsed: '0',
        },
      },
    });

    console.log('✅ Sesión de checkout creada:', session.id);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('❌ Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear la sesión de pago' },
      { status: 500 }
    );
  }
}
