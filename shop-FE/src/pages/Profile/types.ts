export interface ProfileUser {
  id: string;
  token?: string;
  name: string;
  email: string;
  gender?: string;
  birthDate?: string;
  avatar_url?: string;
  address?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
}

export interface Purchase {
  id: string;
  date: string;
  product: string;
  originalPrice: string;
  price: string;
  totalPrice: string;
  status: string;
  shop: string;
  image: string;
}

export interface Purchases {
  [key: string]: Purchase[];
  purchase: Purchase[];
  waitingPayment: Purchase[];
  shipping: Purchase[];
  waitingDelivery: Purchase[];
  completed: Purchase[];
  cancelled: Purchase[];
  returned: Purchase[];
}

export interface Notification {
  id: number;
  message: string;
  read: boolean;
}

export type TabType = 'notifications' | 'account' | 'purchase' | 'waitingPayment' | 'shipping' | 'waitingDelivery' | 'completed' | 'cancelled' | 'returned' | 'bank' | 'address' | 'password';