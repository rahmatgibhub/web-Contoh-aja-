const CORS_PROXY = 'https://corsproxy.io/?';

export const loadSnapScript = (clientKey: string, env: 'sandbox' | 'production'): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.snap) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = env === 'production' 
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
      
    script.setAttribute('data-client-key', clientKey);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Midtrans snap script'));
    document.body.appendChild(script);
  });
};

export const createTransaction = async (
  serverKey: string,
  env: 'sandbox' | 'production',
  payload: any
): Promise<{ token: string; redirect_url: string }> => {
  const url = env === 'production'
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

  const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(serverKey + ':')}`
    },
    body: JSON.stringify({
      ...payload,
      enabled_payments: ['gopay','shopeepay','qris','bca_va','bni_va','bri_va','permata_va','cimb_va','other_va','dana','linkaja']
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Midtrans API Error: ${err}`);
  }

  return response.json();
};

export const payWithSnap = (token: string, callbacks: {
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (result: any) => void;
  onClose?: () => void;
}) => {
  if (!window.snap) {
    throw new Error('Snap not loaded');
  }
  
  window.snap.pay(token, callbacks);
};

// Declare window.snap for TypeScript
declare global {
  interface Window {
    snap?: any;
  }
}
