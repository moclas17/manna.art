'use client';

import { useStoryProtocol } from '@/hooks/useStoryProtocol';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export default function StoryChainStatus() {
  const { primaryWallet } = useDynamicContext();
  const { isConnectedToStory, chainId, switchToStoryChain, storyChainConfig } = useStoryProtocol();

  if (!primaryWallet) {
    return null;
  }

  const handleSwitchChain = async () => {
    try {
      await switchToStoryChain();
    } catch (error: any) {
      alert(`Error al cambiar de red: ${error.message}`);
    }
  };

  return (
    <div className="chain-status">
      <div className="status-header">
        <h3>Estado de la Red</h3>
        <span className={`status-badge ${isConnectedToStory ? 'connected' : 'disconnected'}`}>
          {isConnectedToStory ? '✓ Conectado a Story' : '⚠ Red Incorrecta'}
        </span>
      </div>

      <div className="chain-info">
        <p><strong>Red Actual:</strong> Chain ID {chainId}</p>
        <p><strong>Red Story:</strong> {storyChainConfig.chainName} (Chain ID {storyChainConfig.chainId})</p>
      </div>

      {!isConnectedToStory && (
        <button onClick={handleSwitchChain} className="switch-btn">
          Cambiar a Story Protocol
        </button>
      )}

      {isConnectedToStory && (
        <div className="success-message">
          <p>¡Estás conectado a Story Protocol Odyssey Testnet!</p>
          <p className="rpc-info">RPC: {storyChainConfig.rpcUrls[0]}</p>
        </div>
      )}

      <style jsx>{`
        .chain-status {
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
        .chain-status:hover {
          box-shadow: 0 4px 12px rgba(3, 10, 24, 0.08);
        }
        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        h3 {
          margin: 0;
          color: #030a18;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 0.28rem;
          font-size: 0.875rem;
          font-weight: 600;
        }
        .status-badge.connected {
          background: #e8f5e9;
          color: #1b5e20;
          border: 1px solid #a5d6a7;
        }
        .status-badge.disconnected {
          background: #fff3e0;
          color: #e65100;
          border: 1px solid #ffcc80;
        }
        .chain-info {
          margin: 1rem 0;
          padding: 1.25rem;
          background: #fcf5e7;
          border-radius: 0.28rem;
        }
        .chain-info p {
          margin: 0.75rem 0;
          color: #666666;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .switch-btn {
          width: 100%;
          padding: 1rem 1.75rem;
          background: #ffe152;
          color: #030a18;
          border: none;
          border-radius: 0.28rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 1rem;
          font-size: 0.95rem;
        }
        .switch-btn:hover {
          background: #ffd93d;
          transform: scale(1.02);
          box-shadow: 0 2px 8px rgba(255, 225, 82, 0.3);
        }
        .success-message {
          margin-top: 1rem;
          padding: 1.25rem;
          background: #e8f5e9;
          border-radius: 0.28rem;
          border-left: 3px solid #4caf50;
        }
        .success-message p {
          margin: 0.5rem 0;
          color: #1b5e20;
          line-height: 1.6;
        }
        .rpc-info {
          font-size: 0.85rem;
          font-family: monospace;
          color: #2e7d32;
        }
      `}</style>
    </div>
  );
}
