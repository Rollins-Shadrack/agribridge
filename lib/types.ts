// User types
export type UserRole = 'buyer' | 'farmer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  vendorId: string;
  quantity: number;
  unit: string; // 'kg', 'lb', 'bag', etc.
  certification?: string; // 'organic', 'fair-trade', etc.
  createdAt: string;
}

// Vendor types
export interface Vendor {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  verified: boolean;
  verificationDate?: string;
  rating: number;
  reviewCount: number;
  responseTime: number; // in hours
  successRate: number; // percentage
  createdAt: string;
  isVerified?: boolean; // alias for verified
  avatarEmoji?: string;
  specialty?: string;
}

// Review types
export interface Review {
  id: string;
  vendorId: string;
  buyerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Order types
export type OrderStatus = 'awaiting_confirmation' | 'accepted' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  total: number;
}

export interface Order {
  id: string;
  buyerId: string;
  vendorId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  phoneNumber: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Cart types
export interface CartItem {
  productId: string;
  vendorId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}
