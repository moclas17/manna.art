'use client';

import { useState } from 'react';

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

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎬';
      case 'audio':
        return '🎵';
      case 'document':
        return '📄';
      case '3d':
        return '🎨';
      default:
        return '📦';
    }
  };

  return (
    <>
      <div className="artwork-card">
        <div className="artwork-image-container">
          {!imageError && artwork.ipType === 'image' ? (
            <>
              {!imageLoaded && (
                <div className="image-placeholder">
                  <div className="loading-spinner"></div>
                </div>
              )}
              <img
                src={artwork.fileUrl}
                alt={artwork.title}
                className={`artwork-image ${imageLoaded ? 'loaded' : ''}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div className="artwork-placeholder">
              <div className="type-icon">{getTypeIcon(artwork.ipType)}</div>
              <p className="type-label">{artwork.ipType.toUpperCase()}</p>
            </div>
          )}
          <div className="artwork-overlay">
            <a
              href={artwork.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="view-btn"
            >
              Ver en Arweave
            </a>
          </div>
        </div>

        <div className="artwork-info">
          <h3 className="artwork-title">{artwork.title}</h3>
          <p className="artwork-description">
            {artwork.description.length > 100
              ? `${artwork.description.substring(0, 100)}...`
              : artwork.description}
          </p>

          <div className="artwork-meta">
            <div className="creator-info">
              <span className="creator-label">Creador:</span>
              <a
                href={`https://etherscan.io/address/${artwork.creatorWallet}`}
                target="_blank"
                rel="noopener noreferrer"
                className="creator-address"
              >
                {shortenAddress(artwork.creatorWallet)}
              </a>
            </div>

            <div className="artwork-stats">
              <div className="stat">
                <span className="stat-icon">👁️</span>
                <span className="stat-value">{artwork.views}</span>
              </div>
              <div className="stat">
                <span className="stat-icon">❤️</span>
                <span className="stat-value">{artwork.likes}</span>
              </div>
            </div>
          </div>

          <div className="artwork-footer">
            <span className="artwork-date">{formatDate(artwork.createdAt)}</span>
            <a
              href={artwork.metadataUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="metadata-link"
            >
              Metadata
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .artwork-card {
          background: #ffffff;
          border-radius: 0.5rem;
          border: 1px solid rgba(3, 10, 24, 0.08);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .artwork-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(3, 10, 24, 0.12);
          border-color: #ffe152;
        }
        .artwork-image-container {
          position: relative;
          width: 100%;
          padding-top: 100%;
          background: rgba(3, 10, 24, 0.03);
          overflow: hidden;
        }
        .image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(3, 10, 24, 0.1);
          border-top-color: #ffe152;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .artwork-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .artwork-image.loaded {
          opacity: 1;
        }
        .artwork-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fcf5e7 0%, #fff9e6 100%);
        }
        .type-icon {
          font-size: 4rem;
          margin-bottom: 0.5rem;
        }
        .type-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #666666;
          margin: 0;
        }
        .artwork-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(3, 10, 24, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .artwork-card:hover .artwork-overlay {
          opacity: 1;
        }
        .view-btn {
          padding: 0.75rem 1.5rem;
          background: #ffe152;
          color: #030a18;
          text-decoration: none;
          font-weight: 600;
          border-radius: 0.28rem;
          transition: all 0.2s ease;
        }
        .view-btn:hover {
          background: #ffd93d;
          transform: scale(1.05);
        }
        .artwork-info {
          padding: 1.5rem;
        }
        .artwork-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #030a18;
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
        }
        .artwork-description {
          font-size: 0.9375rem;
          color: #666666;
          line-height: 1.5;
          margin: 0 0 1rem 0;
        }
        .artwork-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(3, 10, 24, 0.06);
          margin-bottom: 1rem;
        }
        .creator-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .creator-label {
          font-size: 0.75rem;
          color: #999999;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .creator-address {
          font-size: 0.875rem;
          color: #030a18;
          text-decoration: none;
          font-weight: 500;
        }
        .creator-address:hover {
          color: #ffe152;
        }
        .artwork-stats {
          display: flex;
          gap: 1rem;
        }
        .stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .stat-icon {
          font-size: 1rem;
        }
        .stat-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #030a18;
        }
        .artwork-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .artwork-date {
          font-size: 0.875rem;
          color: #999999;
        }
        .metadata-link {
          font-size: 0.875rem;
          color: #030a18;
          text-decoration: none;
          font-weight: 500;
        }
        .metadata-link:hover {
          color: #ffe152;
        }
      `}</style>
    </>
  );
}
