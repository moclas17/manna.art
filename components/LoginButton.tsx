'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export default function LoginButton() {
  const { setShowAuthFlow, primaryWallet, user, handleLogOut } = useDynamicContext();

  const handleLogin = () => {
    setShowAuthFlow(true);
  };

  if (user && primaryWallet) {
    return (
      <div className="user-info">
        <div className="wallet-details">
          <p className="user-email">{user.email || 'Usuario conectado'}</p>
          <p className="wallet-address">
            {primaryWallet.address.slice(0, 6)}...{primaryWallet.address.slice(-4)}
          </p>
          <p className="chain-info">Red: {primaryWallet.connector.name}</p>
        </div>
        <button onClick={handleLogOut} className="logout-btn">
          Desconectar
        </button>
        <style jsx>{`
          .user-info {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
            padding: 2rem;
            background: #ffffff;
            border-radius: 0.28rem;
            border: 1px solid rgba(3, 10, 24, 0.08);
            box-shadow: 0 1px 3px rgba(3, 10, 24, 0.05);
            transition: all 0.2s ease;
          }
          .user-info:hover {
            box-shadow: 0 4px 12px rgba(3, 10, 24, 0.08);
          }
          .wallet-details {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          .user-email {
            font-weight: 600;
            color: #030a18;
            font-size: 1rem;
          }
          .wallet-address {
            font-family: monospace;
            color: #666666;
            font-size: 0.9rem;
            background: #fcf5e7;
            padding: 0.5rem 0.75rem;
            border-radius: 0.28rem;
          }
          .chain-info {
            font-size: 0.875rem;
            color: #999999;
          }
          .logout-btn {
            padding: 0.875rem 1.75rem;
            background: #030a18;
            color: #ffffff;
            border: none;
            border-radius: 0.28rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9rem;
          }
          .logout-btn:hover {
            background: #1a2332;
            transform: scale(1.02);
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <button onClick={handleLogin} className="login-btn">
        Conectar Wallet
      </button>
      <style jsx>{`
        .login-btn {
          padding: 1rem 2.5rem;
          background: #ffe152;
          color: #030a18;
          border: none;
          border-radius: 0.28rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(255, 225, 82, 0.3);
        }
        .login-btn:hover {
          background: #ffd93d;
          transform: scale(1.05);
          box-shadow: 0 4px 16px rgba(255, 225, 82, 0.4);
        }
      `}</style>
    </>
  );
}
