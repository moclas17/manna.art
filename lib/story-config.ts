// Configuración de Story Protocol
export const STORY_CHAIN_CONFIG = {
  chainId: 1514,
  chainName: 'Story Protocol Mainnet',
  nativeCurrency: {
    name: 'IP',
    symbol: 'IP',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet.storyrpc.io'],
  blockExplorerUrls: ['https://mainnet.storyscan.xyz'],
};

// Direcciones de contratos importantes de Story Protocol (actualizar según necesidad)
export const STORY_CONTRACTS = {
  // Agregar direcciones de contratos cuando las necesites
  // Por ejemplo:
  // IP_ASSET_REGISTRY: '0x...',
  // LICENSING_MODULE: '0x...',
};

export const isStoryChain = (chainId: number | null): boolean => {
  return chainId === STORY_CHAIN_CONFIG.chainId;
};
