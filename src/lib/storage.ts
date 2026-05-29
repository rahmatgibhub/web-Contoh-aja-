export interface SMMIDSettings {
  fayupediaApiKey: string;
  midtransClientKey: string;
  midtransServerKey: string;
  midtransEnv: 'sandbox' | 'production';
  markupPercent: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  whatsapp: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  serviceId: string;
  serviceName: string;
  link: string;
  quantity: number;
  priceIDR: number;
  customer: CustomerDetails;
  midtransOrderId: string;
  paymentStatus: 'pending' | 'success' | 'failed' | 'expired' | 'cancel';
  fayupediaOrderId?: string;
  fayupediaStatus?: string;
}

const SETTINGS_KEY = 'smmid_settings';
const ORDERS_KEY = 'smmid_orders';

const defaultSettings: SMMIDSettings = {
  fayupediaApiKey: '',
  midtransClientKey: '',
  midtransServerKey: '',
  midtransEnv: 'sandbox',
  markupPercent: 20,
};

export const getSettings = (): SMMIDSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      return { ...defaultSettings, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to parse settings', e);
  }
  return defaultSettings;
};

export const saveSettings = (settings: SMMIDSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getOrders = (): OrderRecord[] => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse orders', e);
  }
  return [];
};

export const getOrder = (id: string): OrderRecord | undefined => {
  const orders = getOrders();
  return orders.find((o) => o.id === id);
};

export const saveOrder = (order: OrderRecord) => {
  const orders = getOrders();
  const existingIndex = orders.findIndex((o) => o.id === order.id);
  if (existingIndex >= 0) {
    orders[existingIndex] = order;
  } else {
    orders.unshift(order);
  }
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const updateOrderPaymentStatus = (
  id: string,
  status: OrderRecord['paymentStatus'],
  fayupediaOrderId?: string
) => {
  const order = getOrder(id);
  if (order) {
    order.paymentStatus = status;
    if (fayupediaOrderId) {
      order.fayupediaOrderId = fayupediaOrderId;
    }
    saveOrder(order);
  }
};
