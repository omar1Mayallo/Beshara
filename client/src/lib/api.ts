import { getAuthToken } from "./cookies";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  selected_color?: string;
  selected_size?: string;
  created_at: string;
  updated_at: string;
  // Flattened product fields
  category_id: number;
  category: string;
  name: string;
  description: string;
  price: string; // API returns string, will parse to number in frontend
  original_price: string;
  rating: string;
  review_count: number;
  in_stock: boolean;
  stock_quantity: number;
  brand: string;
  sku: string;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  colors: Array<{ name: string; value: string; available: boolean }>;
  sizes: string[];
  badge?: string;
  badge_variant?: "default" | "secondary" | "destructive" | "outline";
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image?: string;
  item_count: number;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  category_id: number;
  category: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  rating: number;
  review_count: number;
  in_stock: boolean;
  stock_quantity: number;
  brand: string;
  sku: string;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  colors: Array<{ name: string; value: string; available: boolean }>;
  sizes: string[];
  badge?: string;
  badge_variant?: "default" | "secondary" | "destructive" | "outline";
  created_at: string;
  updated_at: string;
}

export interface CategoryWithProducts {
  id: number;
  name: string;
  description: string;
  productCount: number;
  products: Product[];
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  address: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const token = await getAuthToken();
    const headers = new Headers({
      "Content-Type": "application/json",
      ...options.headers,
    });

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || "An error occurred",
        response.status,
        data.code
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error. Please check your connection.", 0);
  }
}

interface LoginResponse {
  access_token: string;
}

interface RegisterResponse {
  access_token?: string;
  message?: string;
}

export const productsApi = {
  getCategories: () =>
    apiRequest<Category[]>(`${API_BASE_URL}/api/products/categories`),
  getFeaturedProducts: () =>
    apiRequest<Product[]>(`${API_BASE_URL}/api/products/featured`),
  getProductsByCategory: (categoryId: number) =>
    apiRequest<CategoryWithProducts>(
      `${API_BASE_URL}/api/products/categories/${categoryId}/products`
    ),
  getProductById: (productId: number) =>
    apiRequest<Product>(`${API_BASE_URL}/api/products/${productId}`),
  addToCart: (
    productId: number,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) =>
    apiRequest<CartItem>(`${API_BASE_URL}/api/cart`, {
      method: "POST",
      body: JSON.stringify({
        productId,
        quantity,
        selectedColor,
        selectedSize,
      }),
    }),
  getUserCart: () => apiRequest<CartItem[]>(`${API_BASE_URL}/api/cart`),
};

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest<LoginResponse>(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData: {
    firstName: string;
    lastName?: string;
    username: string;
    email: string;
    password: string;
    address?: string;
  }) =>
    apiRequest<RegisterResponse>(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getMe: async () => {
    return apiRequest<UserProfile>(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
    });
  },
};
