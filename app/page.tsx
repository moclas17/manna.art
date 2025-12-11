'use client';

import LoginButton from '@/components/LoginButton';
import WalletInfo from '@/components/WalletInfo';
import StoryChainStatus from '@/components/StoryChainStatus';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export default function Home() {
  const { user } = useDynamicContext();

  return (
    <main className="container">
      <div className="content">
        <div className="logo-container">
          <img
            src="https://www.manna.art/wp-content/uploads/2025/11/manna_logo_stripe.png"
            alt="Manna Art Logo"
            className="logo"
          />
        </div>
        <p className="subtitle">Login con Dynamic.xyz para Story Protocol</p>

        <div className="login-section">
          <LoginButton />
        </div>

        {user && (
          <div className="wallet-section">
            <WalletInfo />
            <StoryChainStatus />
          </div>
        )}

        <div className="info-card">
          <h2>Características</h2>
          <ul>
            <li>Autenticación segura con Dynamic.xyz</li>
            <li>Soporte para múltiples wallets (MetaMask, WalletConnect, etc.)</li>
            <li>Integración con Story Protocol Odyssey Testnet</li>
            <li>Gestión de identidad Web3</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 3.5rem 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .content {
          max-width: 1460px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
        }
        .logo-container {
          width: 100%;
          max-width: 400px;
          margin-bottom: 1rem;
        }
        .logo {
          width: 100%;
          height: auto;
          display: block;
        }
        .subtitle {
          font-size: 1.125rem;
          color: #999999;
          text-align: center;
          margin: 0;
          font-weight: 400;
        }
        .login-section {
          margin: 2rem 0;
        }
        .wallet-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .info-card {
          background: #ffffff;
          padding: 2.5rem;
          border-radius: 0.28rem;
          border: 1px solid rgba(3, 10, 24, 0.08);
          width: 100%;
          max-width: 600px;
          box-shadow: 0 1px 3px rgba(3, 10, 24, 0.05);
          transition: all 0.2s ease;
        }
        .info-card:hover {
          box-shadow: 0 4px 12px rgba(3, 10, 24, 0.08);
        }
        .info-card h2 {
          color: #030a18;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-weight: 600;
        }
        .info-card ul {
          list-style: none;
          padding: 0;
        }
        .info-card li {
          padding: 1rem 0;
          color: #666666;
          border-bottom: 1px solid rgba(3, 10, 24, 0.06);
          position: relative;
          padding-left: 1.8rem;
          line-height: 1.6;
        }
        .info-card li:last-child {
          border-bottom: none;
        }
        .info-card li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #ffe152;
          font-weight: bold;
          font-size: 1.1rem;
        }
        @media (max-width: 768px) {
          .logo-container {
            max-width: 280px;
          }
          .subtitle {
            font-size: 1rem;
          }
          .container {
            padding: 2rem 1rem;
          }
          .info-card {
            padding: 1.8rem;
          }
        }
      `}</style>
    </main>
  );
}
