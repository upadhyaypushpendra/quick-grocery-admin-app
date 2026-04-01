export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  imageUrl?: string;
  images?: string[];
  categoryId: string;
  tags?: string[];
  inStock: boolean;
  stockQty: number;
  unit?: string;
  brand?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  parentId?: string | null;
  sortOrder: number;
  children?: Category[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  inStockCount: number;
  outOfStockCount: number;
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'going_for_pickup'
  | 'out_for_delivery'
  | 'reached'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderUser {
  id: string;
  firstName: string;
  lastName: string;
  identifier: string;
}

export interface Order {
  id: string;
  userId: string;
  deliveryPartnerId: string | null;
  status: OrderStatus;
  addressSnapshot: { line1: string; line2?: string; city: string; postcode: string };
  totalAmount: number;
  deliveryFee: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user?: OrderUser;
  deliveryPartner?: OrderUser;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  byStatus: Record<OrderStatus, number>;
}
