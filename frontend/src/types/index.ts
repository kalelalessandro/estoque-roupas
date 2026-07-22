export interface Product {
  id: string;
  name: string;
  category: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  sku: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export interface StockEntry {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  createdAt: string;
}

export interface DashboardSummary {
  totalProducts: number;
  totalSales: number;
  lowStockThreshold: number;
  lowStockProducts: Pick<Product, 'id' | 'name' | 'sku' | 'quantity'>[];
}

export interface AuthUser {
  id: string;
  email: string;
}
