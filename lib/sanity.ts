import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: '3lhihqg2',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
})

// Export for legacy compatibility
export const sanity = client

// Image URL builder with error handling
const builder = imageUrlBuilder(client)

export const urlFor = (source: any) => {
  if (!source || !source.asset) {
    return null
  }
  
  try {
    return builder.image(source)
  } catch (error) {
    console.warn('Image URL builder error:', error)
    return null
  }
}

// Helper function to get image URL with fallback
export const getImageUrl = (image: any, width?: number, height?: number) => {
  if (!image?.asset?.url) {
    return '/fallback.jpg'
  }
  
  try {
    const imageBuilder = urlFor(image)
    if (!imageBuilder) {
      return '/fallback.jpg'
    }
    
    if (width && height) {
      return imageBuilder.width(width).height(height).fit('crop').url()
    } else if (width) {
      return imageBuilder.width(width).url()
    } else {
      return imageBuilder.url()
    }
  } catch (error) {
    console.warn('Image URL generation error:', error)
    return image.asset.url || '/fallback.jpg'
  }
}