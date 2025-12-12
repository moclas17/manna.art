'use client';

import { useState, useEffect } from 'react';
import ArtworkCard from './ArtworkCard';

interface Artwork {
  id: string;
  title: string;
  description: string;
  ipType: string;
  fileUrl: string;
  metadataUrl: string;
  creatorWallet: string;
  createdAt: string;
  likes: number;
  views: number;
}

export default function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'recent' | 'popular'>('recent');

  useEffect(() => {
    fetchArtworks();
  }, [filter]);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/artworks?filter=${filter}&limit=12`);
      const data = await response.json();
      setArtworks(data.artworks || []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="gallery">
        <div className="gallery-header">
          <h2 className="gallery-title">Obras Registradas</h2>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'recent' ? 'active' : ''}`}
              onClick={() => setFilter('recent')}
            >
              Recientes
            </button>
            <button
              className={`filter-tab ${filter === 'popular' ? 'active' : ''}`}
              onClick={() => setFilter('popular')}
            >
              Populares
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando obras...</p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎨</div>
            <h3>No hay obras registradas aún</h3>
            <p>Sé el primero en registrar tu obra en Story Protocol</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .gallery {
          max-width: 1460px;
          margin: 0 auto;
          padding: 2rem 0;
        }
        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .gallery-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #030a18;
          margin: 0;
        }
        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          background: #ffffff;
          padding: 0.25rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(3, 10, 24, 0.08);
        }
        .filter-tab {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #666666;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-tab:hover {
          color: #030a18;
          background: rgba(3, 10, 24, 0.03);
        }
        .filter-tab.active {
          background: #ffe152;
          color: #030a18;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6rem 2rem;
          gap: 1.5rem;
        }
        .spinner {
          width: 60px;
          height: 60px;
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
        .loading-state p {
          font-size: 1.125rem;
          color: #666666;
          margin: 0;
        }
        .empty-state {
          text-align: center;
          padding: 6rem 2rem;
        }
        .empty-icon {
          font-size: 5rem;
          margin-bottom: 1.5rem;
        }
        .empty-state h3 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #030a18;
          margin: 0 0 1rem 0;
        }
        .empty-state p {
          font-size: 1.125rem;
          color: #666666;
          margin: 0;
        }
        @media (max-width: 768px) {
          .gallery-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .gallery-title {
            font-size: 2rem;
          }
          .gallery-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
