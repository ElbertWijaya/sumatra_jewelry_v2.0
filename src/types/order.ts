export type OrderStatus = 'draft' | 'ongoing' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  code: string; // e.g., ORD-0001
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type OrderSortBy = 'updatedAt' | 'total' | 'customerName';
export type OrderSortDir = 'asc' | 'desc';

export interface OrderQuery {
  page: number;
  pageSize: number;
  search?: string; // code or customerName
  status?: OrderStatus | 'all';
  sortBy?: OrderSortBy;
  sortDir?: OrderSortDir;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  pages: number;
}
