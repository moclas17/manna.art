'use client';

import { useState } from 'react';
import { Subscription } from '@/hooks/useSubscription';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

interface IPRegistrationProps {
  subscription: Subscription;
}

interface RegistrationResult {
  fileUrl: string;
  fileId: string;
  metadataUrl: string;
  metadataId: string;
  registrationsUsed: number;
  registrationsLimit: number;
  message: string;
}

export default function IPRegistration({ subscription }: IPRegistrationProps) {
  const { user, primaryWallet } = useDynamicContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileType: 'image',
    file: null as File | null,
    licenseFee: '0', // Precio de licencia en ETH
    commercialRevShare: '10', // Porcentaje de royalty por defecto 10%
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canRegister = subscription.registrationsUsed < subscription.registrationsLimit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canRegister) {
      alert('Has alcanzado el límite de registros para este mes');
      return;
    }

    if (!user?.email) {
      alert('Por favor, conecta tu wallet primero');
      return;
    }

    if (!primaryWallet?.address) {
      alert('No se pudo obtener la dirección de tu wallet');
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      // Crear FormData para enviar el archivo
      const formDataToSend = new FormData();
      formDataToSend.append('email', user.email);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('ipType', formData.fileType);
      formDataToSend.append('walletAddress', primaryWallet.address);
      formDataToSend.append('licenseFee', formData.licenseFee);
      formDataToSend.append('commercialRevShare', formData.commercialRevShare);

      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      // Enviar al endpoint de registro
      const response = await fetch('/api/register-ip', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar la obra');
      }

      setSuccess(true);
      setResult(data.data);
      setFormData({
        title: '',
        description: '',
        fileType: 'image',
        file: null,
        licenseFee: '0',
        commercialRevShare: '10',
      });

      // Recargar la página después de 3 segundos para actualizar el conteo
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error: any) {
      console.error('Error registering IP:', error);
      setError(error.message || 'Error al registrar la obra. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="ip-registration">
        <div className="registration-header">
          <h2 className="registration-title">Registrar Nueva Obra</h2>
          <p className="registration-subtitle">
            Protege tu propiedad intelectual en Story Protocol
          </p>
        </div>

        {!canRegister && (
          <div className="limit-warning">
            <strong>⚠️ Límite alcanzado</strong>
            <p>
              Has utilizado todos tus registros este mes ({subscription.registrationsUsed}/
              {subscription.registrationsLimit}). Tu límite se restablecerá el{' '}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString('es-ES')}.
            </p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <strong>❌ Error</strong>
            <p>{error}</p>
          </div>
        )}

        {success && result && (
          <div className="success-message">
            <strong>✓ ¡Registro exitoso!</strong>
            <p>{result.message}</p>
            <div className="result-links">
              <p><strong>Archivo en Arweave:</strong></p>
              <a href={result.fileUrl} target="_blank" rel="noopener noreferrer" className="arweave-link">
                {result.fileUrl}
              </a>
              <p><strong>Metadata en Arweave:</strong></p>
              <a href={result.metadataUrl} target="_blank" rel="noopener noreferrer" className="arweave-link">
                {result.metadataUrl}
              </a>
              <p className="usage-info">
                Registros usados: {result.registrationsUsed}/{result.registrationsLimit}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Título de la obra *
            </label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Mi Obra Maestra 2024"
              required
              disabled={!canRegister || loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Descripción
            </label>
            <textarea
              id="description"
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe tu obra..."
              rows={4}
              disabled={!canRegister || loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fileType" className="form-label">
              Tipo de archivo
            </label>
            <select
              id="fileType"
              className="form-select"
              value={formData.fileType}
              onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
              disabled={!canRegister || loading}
            >
              <option value="image">Imagen</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="document">Documento</option>
              <option value="3d">Modelo 3D</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="file" className="form-label">
              Archivo de la obra *
            </label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="file"
                className="file-input"
                onChange={(e) =>
                  setFormData({ ...formData, file: e.target.files?.[0] || null })
                }
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                required
                disabled={!canRegister || loading}
              />
              <div className="file-input-placeholder">
                {formData.file ? formData.file.name : 'Seleccionar archivo...'}
              </div>
            </div>
          </div>

          <div className="license-section">
            <h3 className="section-title">Configuración de Licencia</h3>
            <p className="section-subtitle">Define los términos comerciales para tu obra</p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="licenseFee" className="form-label">
                  Precio de Licencia (USD)
                </label>
                <input
                  type="number"
                  id="licenseFee"
                  className="form-input"
                  value={formData.licenseFee}
                  onChange={(e) => setFormData({ ...formData, licenseFee: e.target.value })}
                  placeholder="0.0"
                  step="0.001"
                  min="0"
                  disabled={!canRegister || loading}
                />
                <p className="field-help">
                  Costo que otros pagarán para licenciar tu obra (0 = gratis)
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="commercialRevShare" className="form-label">
                  Royalty Comercial (%)
                </label>
                <input
                  type="number"
                  id="commercialRevShare"
                  className="form-input"
                  value={formData.commercialRevShare}
                  onChange={(e) => setFormData({ ...formData, commercialRevShare: e.target.value })}
                  placeholder="10"
                  min="0"
                  max="100"
                  disabled={!canRegister || loading}
                />
                <p className="field-help">
                  Porcentaje de ingresos que recibirás de uso comercial
                </p>
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={!canRegister || loading}>
            {loading ? 'Registrando...' : 'Registrar Obra en Story Protocol'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .ip-registration {
          background: #ffffff;
          border-radius: 0.28rem;
          border: 1px solid rgba(3, 10, 24, 0.08);
          box-shadow: 0 1px 3px rgba(3, 10, 24, 0.05);
          padding: 2rem;
          transition: all 0.2s ease;
        }
        .ip-registration:hover {
          box-shadow: 0 4px 12px rgba(3, 10, 24, 0.08);
        }
        .registration-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(3, 10, 24, 0.06);
        }
        .registration-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #030a18;
          margin: 0 0 0.5rem 0;
        }
        .registration-subtitle {
          font-size: 0.9375rem;
          color: #666666;
          margin: 0;
        }
        .limit-warning {
          background: #fff3e0;
          border: 1px solid #ffcc80;
          border-radius: 0.28rem;
          padding: 1.25rem;
          margin-bottom: 2rem;
        }
        .limit-warning strong {
          display: block;
          color: #e65100;
          margin-bottom: 0.5rem;
        }
        .limit-warning p {
          color: #e65100;
          font-size: 0.9375rem;
          margin: 0;
        }
        .error-message {
          background: #ffebee;
          border: 1px solid #ef9a9a;
          border-radius: 0.28rem;
          padding: 1.25rem;
          margin-bottom: 2rem;
        }
        .error-message strong {
          display: block;
          color: #c62828;
          margin-bottom: 0.5rem;
        }
        .error-message p {
          color: #c62828;
          font-size: 0.9375rem;
          margin: 0;
        }
        .success-message {
          background: #e8f5e9;
          border: 1px solid #a5d6a7;
          border-radius: 0.28rem;
          padding: 1.25rem;
          margin-bottom: 2rem;
        }
        .success-message strong {
          display: block;
          color: #1b5e20;
          margin-bottom: 0.5rem;
        }
        .success-message p {
          color: #1b5e20;
          font-size: 0.9375rem;
          margin: 0 0 0.5rem 0;
        }
        .result-links {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #a5d6a7;
        }
        .result-links p {
          margin: 0.5rem 0 0.25rem 0;
          font-size: 0.875rem;
        }
        .arweave-link {
          display: block;
          color: #1b5e20;
          font-size: 0.875rem;
          word-break: break-all;
          text-decoration: underline;
          margin-bottom: 1rem;
        }
        .arweave-link:hover {
          color: #2e7d32;
        }
        .usage-info {
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid #a5d6a7;
          font-weight: 600;
        }
        .registration-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-label {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #030a18;
        }
        .form-input,
        .form-textarea,
        .form-select {
          padding: 0.875rem;
          border: 1px solid rgba(3, 10, 24, 0.15);
          border-radius: 0.28rem;
          font-size: 0.9375rem;
          color: #030a18;
          background: #ffffff;
          transition: all 0.2s ease;
        }
        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #ffe152;
          box-shadow: 0 0 0 3px rgba(255, 225, 82, 0.1);
        }
        .form-input:disabled,
        .form-textarea:disabled,
        .form-select:disabled {
          background: rgba(3, 10, 24, 0.03);
          cursor: not-allowed;
        }
        .file-input-wrapper {
          position: relative;
        }
        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        .file-input:disabled {
          cursor: not-allowed;
        }
        .file-input-placeholder {
          padding: 0.875rem;
          border: 2px dashed rgba(3, 10, 24, 0.15);
          border-radius: 0.28rem;
          font-size: 0.9375rem;
          color: #666666;
          background: rgba(3, 10, 24, 0.02);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .file-input:not(:disabled) + .file-input-placeholder:hover {
          border-color: #ffe152;
          background: rgba(255, 225, 82, 0.05);
        }
        .submit-btn {
          padding: 1rem 2rem;
          background: #ffe152;
          color: #030a18;
          border: none;
          border-radius: 0.28rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 1rem;
        }
        .submit-btn:hover:not(:disabled) {
          background: #ffd93d;
          transform: scale(1.02);
          box-shadow: 0 4px 16px rgba(255, 225, 82, 0.4);
        }
        .submit-btn:disabled {
          background: rgba(3, 10, 24, 0.1);
          color: rgba(3, 10, 24, 0.4);
          cursor: not-allowed;
        }
        .license-section {
          background: rgba(255, 225, 82, 0.05);
          border: 1px solid rgba(255, 225, 82, 0.2);
          border-radius: 0.28rem;
          padding: 1.5rem;
          margin-top: 0.5rem;
        }
        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #030a18;
          margin: 0 0 0.5rem 0;
        }
        .section-subtitle {
          font-size: 0.875rem;
          color: #666666;
          margin: 0 0 1.25rem 0;
        }
        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        .field-help {
          font-size: 0.8125rem;
          color: #666666;
          margin: 0.25rem 0 0 0;
        }
        @media (max-width: 768px) {
          .ip-registration {
            padding: 1.5rem;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
