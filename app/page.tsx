'use client';

import Header from '@/components/Header';
import Gallery from '@/components/Gallery';
import Link from 'next/link';

export default function Home() {
  // Página de inicio pública - marketplace de arte digital
  return (
    <>
      <Header />

      <main className="container">
        <section className="hero-section">
          <h1 className="hero-title">Marketplace de Arte Digital Protegido</h1>
          <p className="hero-subtitle">
            Descubre obras registradas en blockchain con Story Protocol. Cada creación está protegida
            permanentemente y almacenada en Arweave.
          </p>
          <div className="cta-buttons">
            <Link href="/pricing" className="btn-primary">
              Registra tu Obra
            </Link>
            <a href="#gallery" className="btn-secondary">
              Explorar Galería
            </a>
          </div>
        </section>

        <section id="gallery" className="gallery-section">
          <Gallery />
        </section>

        <section className="info-section">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">🔐</div>
              <h3>Story Protocol</h3>
              <p>Registro de propiedad intelectual en blockchain con prueba inmutable de autoría</p>
            </div>
            <div className="info-card">
              <div className="info-icon">♾️</div>
              <h3>Arweave</h3>
              <p>Almacenamiento permanente de archivos y metadata que nunca desaparecerá</p>
            </div>
            <div className="info-card">
              <div className="info-icon">💎</div>
              <h3>Regalías</h3>
              <p>Sistema automatizado de regalías cada vez que tu obra sea utilizada</p>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .container {
          min-height: calc(100vh - 80px);
        }
        .hero-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 6rem 2rem 4rem;
          text-align: center;
        }
        .hero-title {
          font-size: 4rem;
          font-weight: 700;
          color: #030a18;
          margin: 0 0 1.5rem 0;
          letter-spacing: -0.02em;
          line-height: 1.1;
          background: linear-gradient(135deg, #030a18 0%, #333333 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: 1.375rem;
          color: #666666;
          max-width: 800px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }
        .cta-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-primary {
          padding: 1rem 2.5rem;
          background: #ffe152;
          color: #030a18;
          text-decoration: none;
          font-size: 1.125rem;
          font-weight: 600;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .btn-primary:hover {
          background: #ffd93d;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 225, 82, 0.4);
        }
        .btn-secondary {
          padding: 1rem 2.5rem;
          background: #ffffff;
          color: #030a18;
          text-decoration: none;
          font-size: 1.125rem;
          font-weight: 600;
          border-radius: 0.5rem;
          border: 2px solid #030a18;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .btn-secondary:hover {
          background: #030a18;
          color: #ffffff;
          transform: translateY(-2px);
        }
        .gallery-section {
          padding: 4rem 2rem;
          background: #ffffff;
        }
        .info-section {
          max-width: 1460px;
          margin: 0 auto;
          padding: 6rem 2rem;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
        }
        .info-card {
          text-align: center;
          padding: 2.5rem;
          background: #ffffff;
          border-radius: 0.5rem;
          border: 1px solid rgba(3, 10, 24, 0.08);
          transition: all 0.3s ease;
        }
        .info-card:hover {
          border-color: #ffe152;
          box-shadow: 0 12px 32px rgba(3, 10, 24, 0.1);
          transform: translateY(-8px);
        }
        .info-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }
        .info-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #030a18;
          margin: 0 0 1rem 0;
        }
        .info-card p {
          font-size: 1.0625rem;
          color: #666666;
          line-height: 1.6;
          margin: 0;
        }
        @media (max-width: 768px) {
          .hero-section {
            padding: 4rem 1.5rem 3rem;
          }
          .hero-title {
            font-size: 2.5rem;
          }
          .hero-subtitle {
            font-size: 1.125rem;
          }
          .cta-buttons {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-primary,
          .btn-secondary {
            width: 100%;
            text-align: center;
          }
          .info-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </>
  );
}
