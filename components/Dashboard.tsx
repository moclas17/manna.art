'use client';

import { useSubscription } from '@/hooks/useSubscription';
import SubscriptionStatus from './SubscriptionStatus';
import IPRegistration from './IPRegistration';

export default function Dashboard() {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando tu panel...</p>
        <style jsx>{`
          .dashboard-loading {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 1.5rem;
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
            to {
              transform: rotate(360deg);
            }
          }
          p {
            font-size: 1.125rem;
            color: #666666;
          }
        `}</style>
      </div>
    );
  }

  if (!subscription) {
    return null;
  }

  return (
    <>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Panel de Trabajo</h1>
          <p className="dashboard-subtitle">
            Gestiona tus registros de propiedad intelectual en Story Protocol
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="main-content">
            <SubscriptionStatus subscription={subscription} />
            <IPRegistration subscription={subscription} />
          </div>

          <div className="sidebar">
            <div className="quick-stats">
              <h3>Estadísticas Rápidas</h3>
              <div className="stat-item">
                <span className="stat-label">Registros este mes</span>
                <span className="stat-value">
                  {subscription.registrationsUsed} / {subscription.registrationsLimit}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Plan activo</span>
                <span className="stat-value plan-badge">{subscription.plan}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Estado</span>
                <span className={`stat-value status-${subscription.status}`}>
                  {subscription.status === 'active' ? 'Activo' : subscription.status}
                </span>
              </div>
            </div>

            <div className="help-card">
              <h3>¿Necesitas ayuda?</h3>
              <p>
                Visita nuestra documentación o contacta con soporte para cualquier duda sobre el
                registro de tus obras.
              </p>
              <a href="#" className="help-link">
                Ver documentación →
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1460px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }
        .dashboard-header {
          margin-bottom: 3rem;
        }
        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #030a18;
          margin: 0 0 0.5rem 0;
        }
        .dashboard-subtitle {
          font-size: 1.125rem;
          color: #666666;
          margin: 0;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }
        .main-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .quick-stats {
          background: #ffffff;
          padding: 2rem;
          border-radius: 0.28rem;
          border: 1px solid rgba(3, 10, 24, 0.08);
          box-shadow: 0 1px 3px rgba(3, 10, 24, 0.05);
        }
        .quick-stats h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #030a18;
          margin: 0 0 1.5rem 0;
        }
        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(3, 10, 24, 0.06);
        }
        .stat-item:last-child {
          border-bottom: none;
        }
        .stat-label {
          font-size: 0.875rem;
          color: #999999;
        }
        .stat-value {
          font-weight: 600;
          color: #030a18;
        }
        .plan-badge {
          background: #ffe152;
          padding: 0.25rem 0.75rem;
          border-radius: 0.28rem;
          font-size: 0.875rem;
        }
        .status-active {
          color: #4caf50;
        }
        .help-card {
          background: #fcf5e7;
          padding: 2rem;
          border-radius: 0.28rem;
          border: 1px solid rgba(3, 10, 24, 0.06);
        }
        .help-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #030a18;
          margin: 0 0 1rem 0;
        }
        .help-card p {
          font-size: 0.9375rem;
          color: #666666;
          line-height: 1.6;
          margin: 0 0 1rem 0;
        }
        .help-link {
          display: inline-block;
          color: #030a18;
          font-weight: 600;
          font-size: 0.9375rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .help-link:hover {
          color: #1a2332;
          transform: translateX(4px);
        }
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .sidebar {
            order: -1;
          }
        }
        @media (max-width: 768px) {
          .dashboard {
            padding: 2rem 1rem;
          }
          .dashboard-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
}
