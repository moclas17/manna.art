'use client';

import LoginButton from '@/components/LoginButton';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, primaryWallet } = useDynamicContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link href="/" className="logo-section">
            <img
              src="https://www.manna.art/wp-content/uploads/2025/11/manna_logo_stripe.png"
              alt="Manna Art Logo"
              className="logo"
            />
          </Link>

          {mounted && (
            <nav className="nav-links">
              <Link
                href="/"
                className={`nav-link ${pathname === '/' ? 'active' : ''}`}
              >
                Inicio
              </Link>
              {user && primaryWallet && (
                <Link
                  href="/my-artworks"
                  className={`nav-link ${pathname === '/my-artworks' ? 'active' : ''}`}
                >
                  Mis Obras
                </Link>
              )}
              <Link
                href="/pricing"
                className={`nav-link ${pathname === '/pricing' ? 'active' : ''}`}
              >
                Planes
              </Link>
            </nav>
          )}

          <div className="auth-section">
            {user && primaryWallet ? (
              <div className="user-menu">
                <button
                  className="user-button"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="user-info-compact">
                    <span className="user-email">{user.email || 'Usuario'}</span>
                    <span className="wallet-address">
                      {primaryWallet.address.slice(0, 6)}...{primaryWallet.address.slice(-4)}
                    </span>
                  </div>
                  <svg
                    className={`chevron ${showDropdown ? 'open' : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item">
                      <span className="label">Red:</span>
                      <span className="value">{primaryWallet.connector.name}</span>
                    </div>
                    <LoginButton />
                  </div>
                )}
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </header>

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          background: #ffffff;
          border-bottom: 1px solid rgba(3, 10, 24, 0.08);
          padding: 0.75rem 2rem;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(3, 10, 24, 0.05);
        }
        .header-content {
          max-width: 1460px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }
        .logo-section {
          max-width: 140px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo {
          width: 100%;
          height: auto;
          display: block;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex: 1;
        }
        .nav-link {
          font-size: 1rem;
          font-weight: 500;
          color: #666666;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          color: #030a18;
          background: rgba(255, 225, 82, 0.1);
        }
        .nav-link.active {
          color: #030a18;
          font-weight: 600;
          background: rgba(255, 225, 82, 0.15);
        }
        .auth-section {
          display: flex;
          align-items: center;
        }
        .user-menu {
          position: relative;
        }
        .user-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          background: #fcf5e7;
          border: 1px solid rgba(3, 10, 24, 0.08);
          border-radius: 0.28rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .user-button:hover {
          background: #f5ecd8;
          border-color: rgba(3, 10, 24, 0.12);
        }
        .user-info-compact {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }
        .user-email {
          font-size: 0.9rem;
          font-weight: 600;
          color: #030a18;
        }
        .wallet-address {
          font-size: 0.8rem;
          font-family: monospace;
          color: #666666;
        }
        .chevron {
          transition: transform 0.2s ease;
          color: #666666;
        }
        .chevron.open {
          transform: rotate(180deg);
        }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          min-width: 280px;
          background: #ffffff;
          border: 1px solid rgba(3, 10, 24, 0.08);
          border-radius: 0.28rem;
          box-shadow: 0 4px 12px rgba(3, 10, 24, 0.1);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .dropdown-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(3, 10, 24, 0.06);
        }
        .label {
          font-size: 0.75rem;
          color: #999999;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .value {
          font-size: 0.875rem;
          color: #030a18;
        }
        @media (max-width: 768px) {
          .header {
            padding: 1rem;
          }
          .logo-section {
            max-width: 150px;
          }
          .user-email {
            font-size: 0.85rem;
          }
          .wallet-address {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}
