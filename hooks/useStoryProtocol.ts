'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useState, useEffect } from 'react';
import { STORY_CHAIN_CONFIG, isStoryChain } from '@/lib/story-config';

export function useStoryProtocol() {
  const { primaryWallet } = useDynamicContext();
  const [isConnectedToStory, setIsConnectedToStory] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    const checkChain = async () => {
      if (primaryWallet) {
        try {
          const network = await primaryWallet.connector.getNetwork();
          if (typeof network === 'number') {
            setChainId(network);
            setIsConnectedToStory(isStoryChain(network));
          } else if (typeof network === 'string') {
            const chainIdNum = parseInt(network, 10);
            setChainId(chainIdNum);
            setIsConnectedToStory(isStoryChain(chainIdNum));
          }
        } catch (error) {
          console.error('Error al verificar la red:', error);
        }
      }
    };

    checkChain();
  }, [primaryWallet]);

  const switchToStoryChain = async () => {
    if (!primaryWallet) {
      throw new Error('No hay wallet conectada');
    }

    try {
      // Intentar cambiar a Story Chain
      await primaryWallet.connector.switchNetwork({
        networkChainId: STORY_CHAIN_CONFIG.chainId,
      });

      setIsConnectedToStory(true);
      setChainId(STORY_CHAIN_CONFIG.chainId);

      return true;
    } catch (error: any) {
      // Si la red no existe, intentar agregarla
      if (error.code === 4902 || error.message?.includes('Unrecognized chain')) {
        try {
          // Dynamic.xyz ya debería tener la red configurada en dynamic-config.ts
          // Si aún así no funciona, el usuario debe agregarla manualmente
          console.error('La red Story Protocol debe estar configurada en Dynamic.xyz');
          throw new Error('Por favor, configura la red Story Protocol en tu wallet');
        } catch (addError) {
          console.error('Error al agregar la red:', addError);
          throw addError;
        }
      }
      throw error;
    }
  };

  return {
    isConnectedToStory,
    chainId,
    switchToStoryChain,
    storyChainConfig: STORY_CHAIN_CONFIG,
  };
}
