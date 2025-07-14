import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Create client only if projectId is available
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const client = projectId ? createClient({
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: false,
}) : null

const builder = client ? imageUrlBuilder(client) : null

export function urlFor(source: any) {
  return builder ? builder.image(source) : null
}

// Safe fetch function that handles missing client
export async function safeFetch(query: string, params = {}) {
  if (!client) {
    console.log('Sanity client not configured - using mock data')
    return null
  }
  
  try {
    return await client.fetch(query, params)
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return null
  }
}

// Common queries
export const queries = {
  allFAQs: `*[_type == "faq"] | order(_createdAt desc) {
    _id,
    question,
    slug,
    summary,
    category,
    image,
    _createdAt
  }`,
  
  faqBySlug: `*[_type == "faq" && slug.current == $slug][0] {
    _id,
    question,
    answer,
    slug,
    summary,
    category,
    image,
    relatedFAQs[]->{
      _id,
      question,
      slug,
      summary
    }
  }`
}
