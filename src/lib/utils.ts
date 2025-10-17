export const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString)
    return true
  } catch {
    return false
  }
}

// List of domains that should use unoptimized images
const UNOPTIMIZED_DOMAINS = [
  'placeimg.com',
  'example.com', 
  'dummyimage.com',
  'laravelpoint.com',
  'via.placeholder.com'
]

// List of trusted domains that can be optimized
const TRUSTED_DOMAINS = [
  'i.imgur.com',
  'images.unsplash.com',
  'picsum.photos'
]

export const getSafeImageUrl = (urlString: string | undefined): string => {
  if (!urlString) return '/placeholder-image.jpg'
  
  try {
    const url = new URL(urlString)
    
    // Check if it's a problematic domain
    if (UNOPTIMIZED_DOMAINS.some(domain => url.hostname.includes(domain))) {
      return '/placeholder-image.jpg'
    }
    
    return urlString
  } catch {
    return '/placeholder-image.jpg'
  }
}

export const shouldOptimizeImage = (urlString: string): boolean => {
  try {
    const url = new URL(urlString)
    const canOptimize = TRUSTED_DOMAINS.some(domain => url.hostname.includes(domain))
    
    return canOptimize
  } catch {
    return false
  }
}

export const isExternalImage = (urlString: string): boolean => {
  try {
    const url = new URL(urlString)
    return !url.hostname.includes('localhost') && !url.hostname.includes('127.0.0.1')
  } catch {
    return false
  }
}