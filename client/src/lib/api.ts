const API_BASE = import.meta.env.VITE_API_URL || "";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  pricePkr: number;
  categoryId: string | null;
  createdAt: string;
  images: ProductImage[];
  category: Category | null;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const api = {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  async getProducts(): Promise<ApiResponse<Product[]>> {
    const response = await fetch(`${API_BASE}/api/v1/products`);
    return response.json();
  },

  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    const response = await fetch(`${API_BASE}/api/v1/products/${slug}`);
    return response.json();
  },

  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await fetch(`${API_BASE}/api/v1/categories`);
    return response.json();
  },

  async getCollections(): Promise<ApiResponse<Collection[]>> {
    const response = await fetch(`${API_BASE}/api/v1/collections`);
    return response.json();
  },

  async createProduct(token: string, productData: any): Promise<ApiResponse<Product>> {
    const response = await fetch(`${API_BASE}/api/v1/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  async uploadImage(token: string, file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("image", file);
    
    const response = await fetch(`${API_BASE}/api/v1/admin/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },

  async deleteProduct(token: string, id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE}/api/v1/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.json();
  },
};
