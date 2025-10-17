import { ProductFormData } from './validations'

const API_BASE_URL = 'https://api.bitechx.com'

export interface Category {
  id: string
  name: string
  image: string | null
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: Category
  images: string[]
  slug: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    // Safely get token only on client side
    let token: string | null = null
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token')
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    return response.json()
  }

  async login(email: string): Promise<AuthResponse> {
    return this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async getProducts(offset: number = 0, limit: number = 10, search: string = ''): Promise<Product[]> {
    const queryParams = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    })
    
    return this.request(`/products?${queryParams}`)
  }

  async getProduct(slug: string): Promise<Product> {
    return this.request(`/products/${slug}`)
  }

  async createProduct(product: ProductFormData): Promise<Product> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    })
  }

  async updateProduct(slug: string, product: ProductFormData): Promise<Product> {
    return this.request(`/products/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })
  }

  async deleteProduct(slug: string): Promise<void> {
    return this.request(`/products/${slug}`, {
      method: 'DELETE',
    })
  }
}

export const apiService = new ApiService()