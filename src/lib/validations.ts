import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  stock: z.number().min(0, 'Stock cannot be negative'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type ProductFormData = z.infer<typeof productSchema>