import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

export const dynamicConfig = {
  environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || '',

  walletConnectors: [EthereumWalletConnectors],

  // Configuración para Story Protocol (Mainnet)
  overrides: {
    evmNetworks: [
      {
        blockExplorerUrls: ['https://mainnet.storyscan.xyz'],
        chainId: 1514,
        chainName: 'Story Protocol Mainnet',
        iconUrls: ['https://story.foundation/favicon.ico'],
        name: 'Story',
        nativeCurrency: {
          decimals: 18,
          name: 'IP',
          symbol: 'IP',
        },
        networkId: 1514,
        rpcUrls: ['https://mainnet.storyrpc.io'],
        vanityName: 'Story',
      },
      // También incluir Ethereum Mainnet si es necesario
      {
        blockExplorerUrls: ['https://etherscan.io'],
        chainId: 1,
        chainName: 'Ethereum Mainnet',
        iconUrls: ['https://ethereum.org/favicon.ico'],
        name: 'Ethereum',
        nativeCurrency: {
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
        },
        networkId: 1,
        rpcUrls: ['https://eth.llamarpc.com'],
        vanityName: 'Ethereum',
      },
    ],
  },
};
