// Simple image upload to ImgBB
export const uploadImageToImgBB = async (file: File): Promise<string> => {
  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '08d461f92a9ef00b0cab21077b253693';
  
  if (!IMGBB_API_KEY) {
    throw new Error('Image upload service is not configured. Please contact administrator.');
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to upload image');
    }

    return data.data.url;
  } catch (error) {
    throw new Error('Failed to upload image. Please try again.');
  }
};

export const validateImageFile = (file: File): string | null => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, GIF, WebP)';
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return 'Image size must be less than 5MB';
  }

  return null;
};