'use client';

import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface Artwork {
  id: string;
  title: string;
  description: string;
  ipType: string;
  fileUrl: string;
  fileId: string;
  metadataUrl: string;
  metadataId: string;
  creatorWallet: string;
  creatorEmail: string;
  createdAt: string;
  likes: number;
  views: number;
}

export default function MyArtworksPage() {
  const { user, primaryWallet } = useDynamicContext();
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !primaryWallet) {
      router.push('/');
      return;
    }

    fetchMyArtworks();
  }, [user, primaryWallet]);

  const fetchMyArtworks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/artworks');
      if (response.ok) {
        const data = await response.json();
        // Filtrar solo las obras del usuario actual
        const myArtworks = data.artworks.filter(
          (artwork: Artwork) => artwork.creatorEmail === user?.email
        );
        setArtworks(myArtworks);
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const openArweaveLink = (url: string) => {
    window.open(url, '_blank');
  };

  if (!user || !primaryWallet) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="container">
        <div className="header-section">
          <h1>Mis Obras Registradas</h1>
          <p className="subtitle">
            Aquí puedes ver todas las obras que has registrado en Arweave y Story Protocol
          </p>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando tus obras...</p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎨</div>
            <h2>Aún no has registrado ninguna obra</h2>
            <p>Comienza a proteger tu propiedad intelectual registrando tu primera obra</p>
            <button
              className="cta-button"
              onClick={() => router.push('/')}
            >
              Registrar Mi Primera Obra
            </button>
          </div>
        ) : (
          <div className="artworks-grid">
            {artworks.map((artwork) => (
              <div key={artwork.id} className="artwork-card">
                <div className="artwork-image-container">
                  <img
                    src={artwork.fileUrl}
                    alt={artwork.title}
                    className="artwork-image"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Cargando...';
                    }}
                  />
                  <div className="artwork-overlay">
                    <button
                      className="view-button"
                      onClick={() => openArweaveLink(artwork.fileUrl)}
                    >
                      Ver en Arweave
                    </button>
                  </div>
                </div>
                <div className="artwork-info">
                  <h3 className="artwork-title">{artwork.title}</h3>
                  <p className="artwork-description">{artwork.description}</p>

                  <div className="artwork-meta">
                    <div className="meta-row">
                      <span className="meta-label">Tipo:</span>
                      <span className="meta-value">{artwork.ipType}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Fecha:</span>
                      <span className="meta-value">{formatDate(artwork.createdAt)}</span>
                    </div>
                  </div>

                  <div className="artwork-links">
                    <a
                      href={artwork.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-button"
                    >
                      📄 Archivo
                    </a>
                    <a
                      href={artwork.metadataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-button"
                    >
                      📋 Metadata
                    </a>
                  </div>

                  <div className="artwork-ids">
                    <div className="id-row">
                      <span className="id-label">File ID:</span>
                      <code className="id-value">{artwork.fileId.substring(0, 20)}...</code>
                    </div>
                    <div className="id-row">
                      <span className="id-label">Metadata ID:</span>
                      <code className="id-value">{artwork.metadataId.substring(0, 20)}...</code>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .header-section h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #030a18;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          font-size: 1.125rem;
          color: #64748b;
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 2px dashed #cbd5e1;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          font-size: 1rem;
          color: #64748b;
          margin-bottom: 2rem;
        }

        .cta-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.875rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .artworks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .artwork-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(3, 10, 24, 0.1);
          transition: all 0.3s ease;
        }

        .artwork-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(3, 10, 24, 0.15);
        }

        .artwork-image-container {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .artwork-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .artwork-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .artwork-card:hover .artwork-overlay {
          opacity: 1;
        }

        .view-button {
          background: white;
          color: #030a18;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-button:hover {
          transform: scale(1.05);
        }

        .artwork-info {
          padding: 1.5rem;
        }

        .artwork-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #030a18;
          margin-bottom: 0.5rem;
        }

        .artwork-description {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 1rem;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .artwork-meta {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .meta-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
        }

        .meta-value {
          font-size: 0.875rem;
          color: #64748b;
        }

        .artwork-links {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .link-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #3b82f6;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .link-button:hover {
          background: #dbeafe;
          border-color: #93c5fd;
        }

        .artwork-ids {
          background: #f8fafc;
          padding: 0.75rem;
          border-radius: 6px;
        }

        .id-row {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.5rem;
        }

        .id-row:last-child {
          margin-bottom: 0;
        }

        .id-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .id-value {
          font-size: 0.75rem;
          font-family: 'Courier New', monospace;
          color: #475569;
          background: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        @media (max-width: 768px) {
          .artworks-grid {
            grid-template-columns: 1fr;
          }

          .header-section h1 {
            font-size: 2rem;
          }

          .container {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
}
