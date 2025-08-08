'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {CreditCard, Loader2} from 'lucide-react';
import {initMercadoPago, Wallet} from '@mercadopago/sdk-react';

// Initialize Mercado Pago SDK
initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '', {
  locale: 'es-AR',
});

export function CheckoutButton() {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createPreference = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.id) {
        setPreferenceId(data.id);
      }
    } catch (error) {
      console.error('Failed to create preference:', error);
      alert('Failed to create payment preference.');
    } finally {
      setIsLoading(false);
    }
  };

  if (preferenceId) {
    return (
      <Wallet
        initialization={{preferenceId: preferenceId}}
        customization={{texts: {valueProp: 'smart_option'}}}
      />
    );
  }

  return (
    <Button onClick={createPreference} disabled={isLoading} className="w-full">
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="mr-2 h-4 w-4" />
      )}
      {isLoading ? 'Processing...' : 'Support the Project'}
    </Button>
  );
}
