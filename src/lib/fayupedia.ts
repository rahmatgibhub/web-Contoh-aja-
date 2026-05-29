const CORS_PROXY = 'https://corsproxy.io/?';
const API_URL = 'https://fayupedia.id/api/v2';

export interface Service {
  service: string;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
  refill?: boolean;
  cancel?: boolean;
}

const request = async (data: Record<string, string>) => {
  const params = new URLSearchParams(data);
  
  const response = await fetch(`${CORS_PROXY}${encodeURIComponent(API_URL)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  if (result.error) {
    throw new Error(result.error);
  }
  return result;
};

export const getServices = async (apiKey: string): Promise<Service[]> => {
  return request({ key: apiKey, action: 'services' });
};

export const addOrder = async (
  apiKey: string,
  data: { service: string; link: string; quantity: number }
): Promise<{ order: number }> => {
  return request({
    key: apiKey,
    action: 'add',
    service: data.service,
    link: data.link,
    quantity: data.quantity.toString(),
  });
};

export const getOrderStatus = async (
  apiKey: string,
  orderId: string
): Promise<{ charge: string; start_count: string; status: string; remains: string; currency: string }> => {
  return request({
    key: apiKey,
    action: 'status',
    order: orderId,
  });
};

export const getBalance = async (
  apiKey: string
): Promise<{ balance: string; currency: string }> => {
  return request({ key: apiKey, action: 'balance' });
};
