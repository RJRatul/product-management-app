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

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
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

  // Product endpoints
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

  async createProduct(productData: { 
    name: string
    description: string
    price: number
    categoryId: string
    images: string[]
  }): Promise<Product> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id: string, productData: { 
    name: string
    description: string
    price?: number
    categoryId?: string
    images?: string[]
  }): Promise<Product> {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Category endpoints
  async getCategories(offset: number = 0, limit: number = 50): Promise<Category[]> {
    const queryParams = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
    })
    
    return this.request(`/categories?${queryParams}`)
  }

  async searchCategories(searchText: string): Promise<Category[]> {
    const queryParams = new URLSearchParams({
      searchedText: searchText,
    })
    
    return this.request(`/categories/search?${queryParams}`)
  }

  async getCategory(id: string): Promise<Category> {
    return this.request(`/categories/${id}`)
  }

  async createCategory(categoryData: { 
    name: string
    description?: string
    image?: string
  }): Promise<Category> {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    })
  }

  async updateCategory(id: string, categoryData: { 
    name: string
    description?: string
    image?: string
  }): Promise<Category> {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    })
  }

  async deleteCategory(id: string): Promise<void> {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiService = new ApiService()