'use client';

import Header from '@/components/Header';
import PricingCard from '@/components/PricingCard';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const pricingPlans = [
  {
    name: 'CREADOR',
    price: 5,
    originalPrice: 10,
    yearlyPrice: 60,
    registrations: 4,
    registrationValue: 20,
    features: [
      'Hasta 4 registros por mes',
      'Enlace único a portafolio CREADOR',
      'Presencia en sección CREADORES del store global',
      'Soporte vía email y asesoramiento',
      'Rastreo básico de registros y obras derivadas',
    ],
  },
  {
    name: 'PROFESIONAL',
    price: 19,
    originalPrice: 50,
    yearlyPrice: 228,
    registrations: 20,
    registrationValue: 100,
    features: [
      'Hasta 20 registros mensuales',
      'Enlace personalizado a portafolio PROFESIONAL',
      'Presencia destacada en sección PROFESIONALES',
      'Soporte prioritario por chat o email',
      'Rastreo detallado de registros, remixes y regalías',
      'Control y revocación de accesos compartidos',
    ],
    popular: true,
  },
  {
    name: 'ELITE',
    price: 49,
    originalPrice: 150,
    yearlyPrice: 588,
    registrations: 100,
    registrationValue: 500,
    features: [
      'Hasta 100 registros mensuales',
      'Portafolio ELITE con oportunidades de licenciamiento',
      'Soporte premium con asesoramiento para monetización',
      'Análisis detallado de impacto e ingresos',
      'Control total de accesos al portafolio compartido',
    ],
  },
];

export default function PricingPage() {
  const { user } = useDynamicContext();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planName: string, isYearly: boolean) => {
    if (!user?.email) {
      alert('Por favor, conecta tu wallet primero');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName,
          isYearly,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirigir a Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert('Error al crear la sesión de pago: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="container">
        <section className="hero-section">
          <h1 className="hero-title">Planes de Suscripción</h1>
          <p className="hero-subtitle">
            Elige el plan que mejor se adapte a tus necesidades como creador
          </p>
        </section>

        <section className="pricing-section">
          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <PricingCard
                key={plan.name}
                plan={plan}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>

          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Procesando...</p>
            </div>
          )}
        </section>

        <section className="features-section">
          <h2 className="features-title">¿Por qué elegir Manna Art?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Registro Inmutable</h3>
              <p>Tu obra queda registrada permanentemente en blockchain con prueba de autoría</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Regalías Automáticas</h3>
              <p>Recibe ingresos cada vez que tu obra sea utilizada o licenciada</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Portafolio Global</h3>
              <p>Presencia en nuestro marketplace con alcance internacional</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Control Total</h3>
              <p>Gestiona accesos, permisos y licencias de tus creaciones</p>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .container {
          min-height: calc(100vh - 80px);
          padding: 4rem 2rem;
        }
        .hero-section {
          max-width: 1460px;
          margin: 0 auto 5rem;
          text-align: center;
          padding: 3rem 0;
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          color: #030a18;
          margin: 0 0 1.5rem 0;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: #666666;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .pricing-section {
          max-width: 1460px;
          margin: 0 auto 5rem;
          position: relative;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.5rem;
          margin-bottom: 3rem;
        }
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(252, 245, 231, 0.95);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          z-index: 1000;
        }
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(3, 10, 24, 0.1);
          border-top-color: #ffe152;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .loading-overlay p {
          font-size: 1.125rem;
          color: #030a18;
          font-weight: 600;
        }
        .features-section {
          max-width: 1460px;
          margin: 0 auto;
          padding: 4rem 0;
        }
        .features-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #030a18;
          text-align: center;
          margin: 0 0 3rem 0;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        .feature-card {
          background: #ffffff;
          padding: 2.5rem;
          border-radius: 0.28rem;
          border: 1px solid rgba(3, 10, 24, 0.08);
          text-align: center;
          transition: all 0.2s ease;
        }
        .feature-card:hover {
          border-color: #ffe152;
          box-shadow: 0 8px 24px rgba(3, 10, 24, 0.08);
          transform: translateY(-4px);
        }
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #030a18;
          margin: 0 0 1rem 0;
        }
        .feature-card p {
          font-size: 1rem;
          color: #666666;
          line-height: 1.6;
          margin: 0;
        }
        @media (max-width: 768px) {
          .container {
            padding: 2rem 1rem;
          }
          .hero-title {
            font-size: 2.25rem;
          }
          .hero-subtitle {
            font-size: 1.125rem;
          }
          .features-title {
            font-size: 2rem;
          }
          .pricing-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </>
  );
}
