export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "expiring_soon";

export type PaymentMethod = "cash" | "upi" | "card" | "credit";

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  purchase_price: number; // cost price per unit
  selling_price: number;  // retail price per unit
  reorder_level: number;
  expiry_date?: string;   // ISO format YYYY-MM-DD
  supplier?: string;
  unit: string;           // e.g. "kg", "packet", "bottle", "piece"
  created_at: string;
  updated_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Sale {
  id: string;
  shop_id: string;
  total_amount: number;
  payment_method: PaymentMethod;
  created_at: string;
  items: SaleItem[];
}

export interface Expense {
  id: string;
  shop_id: string;
  description: string;
  amount: number;
  category: string;
  created_at: string;
}

export interface AIInsight {
  id: string;
  shop_id: string;
  type: "positive" | "warning" | "alert" | "info";
  title: string;
  description: string;
  action_label?: string;
  action_href?: string;
  created_at: string;
}

export interface ShopNotification {
  id: string;
  title: string;
  message: string;
  type: "low_stock" | "out_of_stock" | "expiring" | "slow_moving" | "ai_insight";
  date: string;
  read: boolean;
  link?: string;
}

export interface ShopSettings {
  id: string;
  shop_name: string;
  owner_name: string;
  phone: string;
  currency: "INR" | "USD" | "EUR";
  address: string;
  default_low_stock_threshold: number;
  slow_moving_days_threshold: number;
  is_demo: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  intent?: string;
  dataSummary?: {
    label: string;
    value: string | number;
  }[];
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
  recommendation?: {
    title: string;
    items: string[];
    based_on: string[];
  };
}
