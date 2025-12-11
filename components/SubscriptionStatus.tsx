'use client';

import { Subscription } from '@/hooks/useSubscription';

interface SubscriptionStatusProps {
  subscription: Subscription;
}

export default function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const registrationsRemaining = subscription.registrationsLimit - subscription.registrationsUsed;
  const usagePercentage = (subscription.registrationsUsed / subscription.registrationsLimit) * 100;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <>
      <div className="subscription-status">
        <div className="status-header">
          <div>
            <h2 className="status-title">Tu Suscripción</h2>
            <p className="status-plan">Plan {subscription.plan}</p>
          </div>
          <div className={`status-badge status-${subscription.status}`}>
            {subscription.status === 'active' ? 'Activo' : subscription.status}
          </div>
        </div>

        <div className="usage-section">
          <div className="usage-header">
            <span className="usage-label">Registros utilizados este mes</span>
            <span className="usage-numbers">
              <strong>{subscription.registrationsUsed}</strong> / {subscription.registrationsLimit}
            </span>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${usagePercentage}%` }}></div>
          </div>

          <p className="usage-info">
            Te quedan <strong>{registrationsRemaining} registros</strong> disponibles este mes
          </p>
        </div>

        <div className="renewal-info">
          <div className="info-item">
            <span className="info-label">Próxima renovación</span>
            <span className="info-value">{formatDate(subscription.currentPeriodEnd)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .subscription-status {
          background: #ffffff;
          border-radius: 0.28rem;
          border: 1px solid rgba(3, 10, 24, 0.08);
          box-shadow: 0 1px 3px rgba(3, 10, 24, 0.05);
          padding: 2rem;
          transition: all 0.2s ease;
        }
        .subscription-status:hover {
          box-shadow: 0 4px 12px rgba(3, 10, 24, 0.08);
        }
        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(3, 10, 24, 0.06);
        }
        .status-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #030a18;
          margin: 0 0 0.25rem 0;
        }
        .status-plan {
          font-size: 1rem;
          color: #666666;
          margin: 0;
        }
        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 0.28rem;
          font-size: 0.875rem;
          font-weight: 600;
        }
        .status-active {
          background: #e8f5e9;
          color: #1b5e20;
          border: 1px solid #a5d6a7;
        }
        .usage-section {
          margin-bottom: 2rem;
        }
        .usage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .usage-label {
          font-size: 0.9375rem;
          color: #666666;
        }
        .usage-numbers {
          font-size: 1.125rem;
          color: #030a18;
        }
        .usage-numbers strong {
          color: #ffe152;
          font-weight: 700;
        }
        .progress-bar {
          width: 100%;
          height: 12px;
          background: rgba(3, 10, 24, 0.06);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffe152 0%, #ffd93d 100%);
          transition: width 0.3s ease;
          border-radius: 6px;
        }
        .usage-info {
          font-size: 0.875rem;
          color: #666666;
          margin: 0;
        }
        .usage-info strong {
          color: #030a18;
        }
        .renewal-info {
          background: #fcf5e7;
          padding: 1.25rem;
          border-radius: 0.28rem;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .info-label {
          font-size: 0.9375rem;
          color: #666666;
        }
        .info-value {
          font-size: 1rem;
          font-weight: 600;
          color: #030a18;
        }
        @media (max-width: 768px) {
          .subscription-status {
            padding: 1.5rem;
          }
          .status-header {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
}
