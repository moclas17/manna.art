'use client';

interface PricingPlan {
  name: string;
  price: number;
  originalPrice: number;
  yearlyPrice: number;
  registrations: number;
  registrationValue: number;
  features: string[];
  popular?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  onSubscribe: (planName: string, isYearly: boolean) => void;
}

export default function PricingCard({ plan, onSubscribe }: PricingCardProps) {
  return (
    <>
      <div className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
        {plan.popular && <div className="popular-badge">Más Popular</div>}

        <div className="plan-header">
          <h3 className="plan-name">{plan.name}</h3>
          <div className="price-section">
            <div className="price">
              <span className="currency">$</span>
              <span className="amount">{plan.price}</span>
              <span className="period">USD/mes</span>
            </div>
            <div className="original-price">
              Precio regular: ${plan.originalPrice} USD/mes
            </div>
          </div>
        </div>

        <div className="plan-value">
          <p className="registrations-info">
            Hasta <strong>{plan.registrations} registros</strong> por mes
          </p>
          <p className="value-info">
            Valor: ${plan.registrationValue} USD
          </p>
        </div>

        <ul className="features-list">
          {plan.features.map((feature, index) => (
            <li key={index} className="feature-item">
              {feature}
            </li>
          ))}
        </ul>

        <div className="cta-section">
          <button
            className="subscribe-btn monthly"
            onClick={() => onSubscribe(plan.name, false)}
          >
            Suscribirse - ${plan.price} USD/mes
          </button>
          <div className="yearly-notice">
            Pago anual disponible próximamente (${plan.yearlyPrice} USD/año)
          </div>
        </div>
      </div>

      <style jsx>{`
        .pricing-card {
          position: relative;
          background: #ffffff;
          border: 2px solid rgba(3, 10, 24, 0.08);
          border-radius: 0.28rem;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          transition: all 0.3s ease;
          height: 100%;
        }
        .pricing-card:hover {
          border-color: #ffe152;
          box-shadow: 0 8px 24px rgba(3, 10, 24, 0.12);
          transform: translateY(-4px);
        }
        .pricing-card.popular {
          border-color: #ffe152;
          border-width: 3px;
        }
        .popular-badge {
          position: absolute;
          top: -1rem;
          left: 50%;
          transform: translateX(-50%);
          background: #ffe152;
          color: #030a18;
          padding: 0.5rem 1.5rem;
          border-radius: 0.28rem;
          font-weight: 700;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .plan-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(3, 10, 24, 0.06);
        }
        .plan-name {
          font-size: 1.75rem;
          font-weight: 700;
          color: #030a18;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .price-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .price {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }
        .currency {
          font-size: 1.5rem;
          font-weight: 600;
          color: #666666;
        }
        .amount {
          font-size: 3rem;
          font-weight: 700;
          color: #030a18;
          line-height: 1;
        }
        .period {
          font-size: 1rem;
          color: #999999;
          font-weight: 500;
        }
        .original-price {
          font-size: 0.875rem;
          color: #999999;
          text-decoration: line-through;
        }
        .plan-value {
          background: #fcf5e7;
          padding: 1.25rem;
          border-radius: 0.28rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .registrations-info {
          font-size: 1rem;
          color: #030a18;
          margin: 0;
        }
        .value-info {
          font-size: 0.875rem;
          color: #666666;
          margin: 0;
        }
        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
        }
        .feature-item {
          padding-left: 1.75rem;
          position: relative;
          color: #666666;
          line-height: 1.6;
          font-size: 0.95rem;
        }
        .feature-item::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #ffe152;
          font-weight: bold;
          font-size: 1.2rem;
        }
        .cta-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: auto;
        }
        .subscribe-btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 0.28rem;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }
        .subscribe-btn.monthly {
          background: #ffe152;
          color: #030a18;
        }
        .subscribe-btn.monthly:hover {
          background: #ffd93d;
          transform: scale(1.02);
          box-shadow: 0 4px 16px rgba(255, 225, 82, 0.4);
        }
        .yearly-notice {
          text-align: center;
          font-size: 0.875rem;
          color: #999999;
          padding: 0.75rem;
          background: rgba(3, 10, 24, 0.02);
          border-radius: 0.28rem;
        }
        @media (max-width: 768px) {
          .pricing-card {
            padding: 2rem 1.5rem;
          }
          .plan-name {
            font-size: 1.5rem;
          }
          .amount {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </>
  );
}
