export type ProductCategory = 'all' | 'lighting' | 'furniture' | 'ceramics' | 'audio' | 'textiles';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface ProductVariant {
  name: string;
  options: {
    label: string;
    value: string;
    hex?: string;
    inStock: boolean;
  }[];
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  price: number; // in USD
  originalPrice?: number;
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isLimited?: boolean;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  materials: string;
  dimensions: string;
  origin: string;
  leadTime: string;
  variants?: ProductVariant[];
  reviews: ProductReview[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedVariant: { [variantName: string]: string };
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  deliveryMethod: string;
  paymentMethod: 'card' | 'cod' | 'wallet';
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  name: string;
}
