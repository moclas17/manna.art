'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useEffect, useState } from 'react';

export default function WalletInfo() {
  const { primaryWallet } = useDynamicContext();
  const [balance, setBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (primaryWallet) {
        try {
          // Obtener balance
          const walletBalance = await primaryWallet.getBalance();
          setBalance(walletBalance || '0');

          // Obtener chain ID
          const network = await primaryWallet.connector.getNetwork();
          if (typeof network === 'number') {
            setChainId(network);
          } else if (typeof network === 'string') {
            setChainId(parseInt(network, 10));
          }
        } catch (error) {
          console.error('Error al obtener información de la wallet:', error);
        }
      }
    };

    fetchWalletData();
  }, [primaryWallet]);

  if (!primaryWallet) {
    return null;
  }

  return (
    <div className="wallet-info">
      <h3>Información de la Wallet</h3>
      <div className="info-grid">
        <div className="info-item">
          <span className="label">Dirección:</span>
          <span className="value">{primaryWallet.address}</span>
        </div>
        <div className="info-item">
          <span className="label">Balance:</span>
          <span className="value">{parseFloat(balance).toFixed(4)} IP</span>
        </div>
        <div className="info-item">
          <span className="label">Chain ID:</span>
          <span className="value">{chainId || 'Cargando...'}</span>
        </div>
        <div className="info-item">
          <span className="label">Conector:</span>
          <span className="value">{primaryWallet.connector.name}</span>
        </div>
      </div>
      <style jsx>{`
        .wallet-info {
          margin-top: 0;
          padding: 2rem;
          background: #ffffff;
          border-radius: 0.28rem;
          border: 1px solid rgba(3, 10, 24, 0.08);
          box-shadow: 0 1px 3px rgba(3, 10, 24, 0.05);
          max-width: 600px;
          width: 100%;
          transition: all 0.2s ease;
        }
        .wallet-info:hover {
          box-shadow: 0 4px 12px rgba(3, 10, 24, 0.08);
        }
        h3 {
          margin-bottom: 1.5rem;
          color: #030a18;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .info-grid {
          display: grid;
          gap: 1.25rem;
        }
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .label {
          font-size: 0.875rem;
          color: #999999;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .value {
          color: #030a18;
          word-break: break-all;
          font-family: monospace;
          background: #fcf5e7;
          padding: 0.75rem;
          border-radius: 0.28rem;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
