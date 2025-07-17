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
  console.log('getImageUrl called with:', { image, width, height })
  
  if (!image?.asset?.url) {
    console.log('No image asset URL, using fallback')
    return '/fallback.jpg'
  }
  
  try {
    const imageBuilder = urlFor(image)
    if (!imageBuilder) {
      console.log('urlFor returned null, using fallback')
      return '/fallback.jpg'
    }
    
    let finalUrl
    if (width && height) {
      finalUrl = imageBuilder.width(width).height(height).fit('crop').url()
    } else if (width) {
      finalUrl = imageBuilder.width(width).url()
    } else {
      finalUrl = imageBuilder.url()
    }
    
    console.log('Generated image URL:', finalUrl)
    return finalUrl
  } catch (error) {
    console.warn('Image URL generation error:', error)
    const fallbackUrl = image.asset.url || '/fallback.jpg'
    console.log('Using fallback URL:', fallbackUrl)
    return fallbackUrl
  }
}