import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type ProductFormData = z.infer<typeof productSchema>
export type CategoryFormData = z.infer<typeof categorySchema>