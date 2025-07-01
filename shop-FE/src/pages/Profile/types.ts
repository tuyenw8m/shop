export type TabType = 
  | 'notifications' 
  | 'account' 
  | 'bank' 
  | 'address' 
  | 'password' 
  | 'purchase' 
  | 'waitingPayment' 
  | 'shipping' 
  | 'waitingDelivery' 
  | 'completed' 
  | 'cancelled' 
  | 'returned';

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: number;
  message: string;
  read: boolean;
  created_at?: string;
}

export interface Purchase {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: PurchaseItem[];
  address?: string;
  phone?: string;
}

export interface PurchaseItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

export interface Purchases {
  purchase: Purchase[];
  waitingPayment: Purchase[];
  shipping: Purchase[];
  waitingDelivery: Purchase[];
  completed: Purchase[];
  cancelled: Purchase[];
  returned: Purchase[];
} 