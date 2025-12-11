import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export interface Subscription {
  id: string;
  plan: 'CREADOR' | 'PROFESIONAL' | 'ELITE';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: Date;
  registrationsUsed: number;
  registrationsLimit: number;
}

export function useSubscription() {
  const { user } = useDynamicContext();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.email) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      try {
        // TODO: En producción, esto debería ser una llamada a tu API
        // que verifique en Stripe si el usuario tiene una suscripción activa
        const response = await fetch('/api/subscription/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.subscription) {
            setSubscription({
              ...data.subscription,
              currentPeriodEnd: new Date(data.subscription.currentPeriodEnd),
            });
          } else {
            setSubscription(null);
          }
        } else {
          setSubscription(null);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user?.email]);

  return { subscription, loading, hasActiveSubscription: !!subscription };
}
