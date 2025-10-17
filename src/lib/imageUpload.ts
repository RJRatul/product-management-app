export interface ImageUploadResponse {
  data: {
    id: string
    title: string
    url_viewer: string
    url: string
    display_url: string
    size: number
    time: string
    expiration: string
  }
  success: boolean
  status: number
}

export const uploadImageToImgBB = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
  
  if (!apiKey) {
    throw new Error('ImgBB API key is not configured')
  }

  const formData = new FormData()
  formData.append('image', file)

  // ImgBB API expects the image to be base64 encoded, but we can send the file directly
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload image')
  }

  const data: ImageUploadResponse = await response.json()
  
  if (!data.success) {
    throw new Error('Image upload failed')
  }

  return data.data.url
}

export const validateImageFile = (file: File): string | null => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, GIF, WebP)'
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return 'Image size must be less than 5MB'
  }

  return null
}