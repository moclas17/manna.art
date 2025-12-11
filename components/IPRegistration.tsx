'use client';

import { useState } from 'react';
import { Subscription } from '@/hooks/useSubscription';

interface IPRegistrationProps {
  subscription: Subscription;
}

export default function IPRegistration({ subscription }: IPRegistrationProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileType: 'image',
    file: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const canRegister = subscription.registrationsUsed < subscription.registrationsLimit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canRegister) {
      alert('Has alcanzado el límite de registros para este mes');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // TODO: Implementar registro en Story Protocol
      // Por ahora solo simulamos el registro
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        fileType: 'image',
        file: null,
      });

      // Recargar la página después de 2 segundos para actualizar el conteo
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error registering IP:', error);
      alert('Error al registrar la obra. Por favor, intenta de nuevo.');
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

        {success && (
          <div className="success-message">
            <strong>✓ ¡Registro exitoso!</strong>
            <p>Tu obra ha sido registrada en Story Protocol. Actualizando...</p>
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
          margin: 0;
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
        @media (max-width: 768px) {
          .ip-registration {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
