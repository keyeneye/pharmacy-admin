export interface Medicine {
  id: string;
  name: string;
  stock: string | number;
  status: 'active' | 'trashed';
}

export interface OrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
}

export interface Order {
  id: string;
  status: string;
  items: OrderItem[];
}

// New additions for Order Sidebar
export const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];
export type FilterTab = 'All' | OrderStatus;

export interface OrdersSidebarProps {
  orders: Order[];
} 