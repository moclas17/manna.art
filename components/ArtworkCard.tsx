'use client';

import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useSubscription } from '@/hooks/useSubscription';

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
  ipId?: string;
  nftTokenId?: string;
  licenseTermsIds?: string[];
  parentIpId?: string;
  isRemix?: boolean;
}

interface ArtworkCardProps {
  artwork: Artwork;
  showRemixButton?: boolean;
}

export default function ArtworkCard({ artwork, showRemixButton = true }: ArtworkCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isRemixing, setIsRemixing] = useState(false);
  const [showRemixModal, setShowRemixModal] = useState(false);
  const [remixTitle, setRemixTitle] = useState('');
  const [remixDescription, setRemixDescription] = useState('');
  const [remixIpType, setRemixIpType] = useState('image');
  const [remixFile, setRemixFile] = useState<File | null>(null);
  const [remixFilePreview, setRemixFilePreview] = useState<string>('');
  const [remixLicenseFee, setRemixLicenseFee] = useState('0');
  const [remixCommercialRevShare, setRemixCommercialRevShare] = useState('10');
  const [parentArtwork, setParentArtwork] = useState<Artwork | null>(null);

  const { user, primaryWallet } = useDynamicContext();
  const { subscription } = useSubscription();

  // Cargar información del parent artwork si es un remix
  useEffect(() => {
    const loadParentArtwork = async () => {
      if (artwork.isRemix && artwork.parentIpId) {
        try {
          const response = await fetch('/api/artworks');
          const data = await response.json();
          const parent = data.artworks.find((a: Artwork) => a.ipId === artwork.parentIpId);
          if (parent) {
            setParentArtwork(parent);
          }
        } catch (error) {
          console.error('Error cargando parent artwork:', error);
        }
      }
    };

    loadParentArtwork();
  }, [artwork.isRemix, artwork.parentIpId]);

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

  const canRemix = () => {
    // Verificar que el usuario esté conectado
    if (!user || !primaryWallet) return false;

    // Verificar que tenga membresía activa
    if (!subscription || subscription.status !== 'active') return false;

    // Verificar que la obra tenga ipId (esté registrada en Story Protocol)
    if (!artwork.ipId) return false;

    // Verificar que no sea su propia obra
    if (artwork.creatorWallet.toLowerCase() === primaryWallet.address.toLowerCase()) return false;

    return true;
  };

  const handleRemixClick = () => {
    if (!canRemix()) {
      if (!user || !primaryWallet) {
        alert('Debes conectar tu wallet para hacer un remix');
        return;
      }
      if (!subscription || subscription.status !== 'active') {
        alert('Necesitas una membresía activa para hacer remixes');
        window.location.href = '/pricing';
        return;
      }
      if (!artwork.ipId) {
        alert('Esta obra no está registrada en Story Protocol y no puede ser remixada');
        return;
      }
      return;
    }

    setShowRemixModal(true);
    setRemixTitle(`Remix: ${artwork.title}`);
    setRemixDescription(`Basado en: ${artwork.description}`);
    setRemixIpType(artwork.ipType);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRemixFile(file);

      // Crear preview para imágenes
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setRemixFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setRemixFilePreview('');
      }
    }
  };

  const handleRemixSubmit = async () => {
    if (!remixTitle.trim() || !remixDescription.trim() || !remixFile) {
      alert('Por favor completa todos los campos y sube un archivo');
      return;
    }

    setIsRemixing(true);

    try {
      const formData = new FormData();
      formData.append('parentIpId', artwork.ipId!);
      formData.append('title', remixTitle);
      formData.append('description', remixDescription);
      formData.append('ipType', remixIpType);
      formData.append('file', remixFile);
      formData.append('walletAddress', primaryWallet?.address || '');
      formData.append('email', user?.email || '');
      formData.append('licenseFee', remixLicenseFee);
      formData.append('commercialRevShare', remixCommercialRevShare);

      const response = await fetch('/api/remix', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear el remix');
      }

      const data = await response.json();
      alert('¡Remix creado exitosamente! Redirigiendo a tus obras...');
      window.location.href = '/my-artworks';
    } catch (error: any) {
      console.error('Error creating remix:', error);
      alert(`Error al crear el remix: ${error.message}`);
    } finally {
      setIsRemixing(false);
      setShowRemixModal(false);
    }
  };

  return (
    <>
      <div className="artwork-card">
        <div className="artwork-image-container">
          {artwork.isRemix && (
            <div className="remix-ribbon">
              🎨 Remix
            </div>
          )}
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
            <div className="overlay-buttons">
              <a
                href={artwork.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="view-btn"
              >
                Ver en Arweave
              </a>
              {showRemixButton && artwork.ipId && (
                <button
                  onClick={handleRemixClick}
                  className="remix-btn"
                  disabled={!canRemix()}
                >
                  🎨 Remix
                </button>
              )}
            </div>
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
            <div className="creators-section">
              {artwork.isRemix && parentArtwork ? (
                <div className="creators-row">
                  <div className="creator-info">
                    <span className="creator-label">Remixeado por</span>
                    <a
                      href={`https://etherscan.io/address/${artwork.creatorWallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="creator-address"
                    >
                      {shortenAddress(artwork.creatorWallet)}
                    </a>
                  </div>
                  <div className="creator-info">
                    <span className="creator-label">Original de</span>
                    <a
                      href={`https://etherscan.io/address/${parentArtwork.creatorWallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="creator-address"
                    >
                      {shortenAddress(parentArtwork.creatorWallet)}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="creator-info">
                  <span className="creator-label">Creador</span>
                  <a
                    href={`https://etherscan.io/address/${artwork.creatorWallet}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="creator-address"
                  >
                    {shortenAddress(artwork.creatorWallet)}
                  </a>
                </div>
              )}
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

      {/* Modal de Remix */}
      {showRemixModal && (
        <div className="modal-overlay" onClick={() => setShowRemixModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Crear Remix</h2>
              <button className="close-btn" onClick={() => setShowRemixModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="remix-info">
                Vas a crear un remix de <strong>{artwork.title}</strong>.
                Este remix será registrado como un derivative NFT en Story Protocol.
              </p>

              <div className="form-group">
                <label htmlFor="remix-file">Archivo del Remix *</label>
                <input
                  id="remix-file"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  disabled={isRemixing}
                  className="file-input"
                />
                {remixFilePreview && (
                  <div className="file-preview">
                    <img src={remixFilePreview} alt="Preview" />
                  </div>
                )}
                {remixFile && (
                  <p className="file-name">{remixFile.name}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="remix-type">Tipo de IP</label>
                <select
                  id="remix-type"
                  value={remixIpType}
                  onChange={(e) => setRemixIpType(e.target.value)}
                  disabled={isRemixing}
                >
                  <option value="image">Imagen</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="document">Documento</option>
                  <option value="3d">Modelo 3D</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="remix-title">Título del Remix *</label>
                <input
                  id="remix-title"
                  type="text"
                  value={remixTitle}
                  onChange={(e) => setRemixTitle(e.target.value)}
                  placeholder="Título de tu remix"
                  disabled={isRemixing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="remix-description">Descripción *</label>
                <textarea
                  id="remix-description"
                  value={remixDescription}
                  onChange={(e) => setRemixDescription(e.target.value)}
                  placeholder="Describe tu remix"
                  rows={4}
                  disabled={isRemixing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="remix-license-fee">Precio de Licencia (USD)</label>
                <input
                  id="remix-license-fee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={remixLicenseFee}
                  onChange={(e) => setRemixLicenseFee(e.target.value)}
                  placeholder="10"
                  disabled={isRemixing}
                />
                <p className="field-hint">Precio en USD que otros pagarán por usar tu remix comercialmente</p>
              </div>

              <div className="form-group">
                <label htmlFor="remix-rev-share">Porcentaje de Royalty (%)</label>
                <input
                  id="remix-rev-share"
                  type="number"
                  min="0"
                  max="100"
                  value={remixCommercialRevShare}
                  onChange={(e) => setRemixCommercialRevShare(e.target.value)}
                  placeholder="10"
                  disabled={isRemixing}
                />
                <p className="field-hint">Porcentaje de ingresos que recibirás de obras derivadas de tu remix</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowRemixModal(false)}
                disabled={isRemixing}
              >
                Cancelar
              </button>
              <button
                className="submit-btn"
                onClick={handleRemixSubmit}
                disabled={isRemixing}
              >
                {isRemixing ? 'Creando Remix...' : 'Crear Remix'}
              </button>
            </div>
          </div>
        </div>
      )}

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
          overflow: visible;
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
        .overlay-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .view-btn, .remix-btn {
          padding: 0.75rem 1.5rem;
          background: #ffe152;
          color: #030a18;
          text-decoration: none;
          font-weight: 600;
          border-radius: 0.28rem;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
          font-size: 0.9375rem;
          text-align: center;
        }
        .view-btn:hover, .remix-btn:hover:not(:disabled) {
          background: #ffd93d;
          transform: scale(1.05);
        }
        .remix-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
        .remix-ribbon {
          position: absolute;
          top: 12px;
          left: -8px;
          z-index: 10;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #ffe152 0%, #ffd93d 100%);
          color: #030a18;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        .remix-ribbon::before {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 0;
          height: 0;
          border-left: 8px solid #d4a600;
          border-bottom: 8px solid transparent;
        }
        .artwork-meta {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(3, 10, 24, 0.06);
          margin-bottom: 1rem;
        }
        .creators-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .creators-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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
          font-weight: 600;
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

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(3, 10, 24, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        .modal-content {
          background: #ffffff;
          border-radius: 0.5rem;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(3, 10, 24, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #030a18;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #666666;
          cursor: pointer;
          padding: 0;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.25rem;
          transition: all 0.2s ease;
        }
        .close-btn:hover {
          background: rgba(3, 10, 24, 0.05);
          color: #030a18;
        }
        .modal-body {
          padding: 1.5rem;
        }
        .remix-info {
          margin: 0 0 1.5rem 0;
          padding: 1rem;
          background: #fcf5e7;
          border-radius: 0.28rem;
          font-size: 0.9375rem;
          color: #666666;
          line-height: 1.5;
        }
        .remix-info strong {
          color: #030a18;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #030a18;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid rgba(3, 10, 24, 0.12);
          border-radius: 0.28rem;
          font-size: 0.9375rem;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #ffe152;
          box-shadow: 0 0 0 3px rgba(255, 225, 82, 0.1);
        }
        .form-group input:disabled,
        .form-group textarea:disabled,
        .form-group select:disabled {
          background: rgba(3, 10, 24, 0.03);
          cursor: not-allowed;
        }
        .file-input {
          padding: 0.5rem;
          cursor: pointer;
        }
        .file-preview {
          margin-top: 1rem;
          border-radius: 0.28rem;
          overflow: hidden;
          max-width: 100%;
        }
        .file-preview img {
          width: 100%;
          height: auto;
          max-height: 300px;
          object-fit: contain;
          background: rgba(3, 10, 24, 0.03);
        }
        .file-name {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #666666;
          word-break: break-all;
        }
        .field-hint {
          margin-top: 0.5rem;
          font-size: 0.8125rem;
          color: #999999;
          line-height: 1.4;
        }
        .modal-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(3, 10, 24, 0.08);
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }
        .cancel-btn,
        .submit-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.28rem;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        .cancel-btn {
          background: transparent;
          color: #666666;
          border: 1px solid rgba(3, 10, 24, 0.12);
        }
        .cancel-btn:hover:not(:disabled) {
          background: rgba(3, 10, 24, 0.03);
          color: #030a18;
        }
        .submit-btn {
          background: #ffe152;
          color: #030a18;
        }
        .submit-btn:hover:not(:disabled) {
          background: #ffd93d;
        }
        .cancel-btn:disabled,
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
