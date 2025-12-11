'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="success-card">
      <div className="success-icon">✓</div>
      <h1 className="title">¡Suscripción Exitosa!</h1>
      <p className="message">
        Gracias por suscribirte a Manna Art. Tu suscripción ha sido procesada correctamente.
      </p>
      {sessionId && (
        <p className="session-info">
          ID de sesión: <code>{sessionId}</code>
        </p>
      )}
      <Link href="/" className="back-button">
        Volver al inicio
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="container">
      <Suspense fallback={
        <div className="success-card">
          <div className="loading">Cargando...</div>
        </div>
      }>
        <SuccessContent />
      </Suspense>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }
        .success-card {
          background: #ffffff;
          padding: 3rem;
          border-radius: 0.28rem;
          border: 1px solid rgba(3, 10, 24, 0.08);
          box-shadow: 0 4px 12px rgba(3, 10, 24, 0.08);
          max-width: 500px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .success-icon {
          width: 80px;
          height: 80px;
          background: #e8f5e9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: #4caf50;
        }
        .title {
          font-size: 2rem;
          font-weight: 700;
          color: #030a18;
          margin: 0;
        }
        .message {
          font-size: 1.125rem;
          color: #666666;
          line-height: 1.6;
          margin: 0;
        }
        .session-info {
          background: #fcf5e7;
          padding: 1rem;
          border-radius: 0.28rem;
          font-size: 0.875rem;
          color: #666666;
          width: 100%;
        }
        .session-info code {
          font-family: monospace;
          color: #030a18;
          display: block;
          margin-top: 0.5rem;
          word-break: break-all;
        }
        .back-button {
          padding: 1rem 2rem;
          background: #ffe152;
          color: #030a18;
          border-radius: 0.28rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .back-button:hover {
          background: #ffd93d;
          transform: scale(1.02);
        }
        .loading {
          padding: 2rem;
          color: #666666;
          font-size: 1.125rem;
        }
      `}</style>
    </main>
  );
}
