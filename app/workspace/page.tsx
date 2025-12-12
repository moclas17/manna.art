'use client';

import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';

export default function WorkspacePage() {
  // El Dashboard internamente maneja la validación de suscripción
  // y muestra el mensaje apropiado si no hay suscripción activa
  return (
    <>
      <Header />
      <Dashboard />
    </>
  );
}
