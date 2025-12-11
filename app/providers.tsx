'use client';

import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { dynamicConfig } from '@/lib/dynamic-config';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      settings={dynamicConfig}
    >
      {children}
    </DynamicContextProvider>
  );
}
