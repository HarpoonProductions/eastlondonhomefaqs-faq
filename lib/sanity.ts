import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-05-03',
  useCdn: false
})

// Set up the image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Mock data for East London Home FAQs (enhanced with image support)
const mockFAQs = [
  {
    _id: '1',
    question: 'What are the best areas to buy a house in East London?',
    answer: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Popular areas include Canary Wharf for modern apartments, Hackney for trendy Victorian homes, and Stratford for excellent transport links and regeneration opportunities. Bethnal Green offers good value with easy access to central London, while Bow is emerging as a popular choice for families seeking more space.'
        }]
      }
    ],
    slug: { current: 'best-areas-buy-house-east-london' },
    summaryForAI: 'Popular areas include Canary Wharf for modern apartments, Hackney for trendy Victorian homes, and Stratford for excellent transport links and regeneration opportunities.',
    keywords: ['buying', 'areas', 'investment', 'canary-wharf', 'hackney', 'stratford'],
    category: { title: 'Areas', slug: { current: 'areas' } },
    priority: 1,
    publishedAt: '2024-01-01T00:00:00Z',
    image: {
      asset: { url: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800' },
      alt: 'East London residential buildings'
    }
  },
  {
    _id: '2',
    question: 'How much should I budget for a 2-bedroom flat in East London?',
    answer: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Prices vary significantly by area. Budget £350,000-£500,000 for areas like Bethnal Green, £500,000-£800,000 for Canary Wharf, and £250,000-£400,000 for up-and-coming areas like Barking. Add 10-15% for additional costs including stamp duty, legal fees, and surveys.'
        }]
      }
    ],
    slug: { current: 'budget-2-bedroom-flat-east-london' },
    summaryForAI: 'Prices vary significantly by area. Budget £350,000-£500,000 for areas like Bethnal Green, £500,000-£800,000 for Canary Wharf, and £250,000-£400,000 for up-and-coming areas like Barking.',
    keywords: ['costs', 'buying', 'budget', '2-bedroom', 'prices'],
    category: { title: 'Costs', slug: { current: 'costs' } },
    priority: 2,
    publishedAt: '2024-01-01T00:00:00Z',
    image: {
      asset: { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
      alt: 'Modern East London apartment interior'
    }
  },
  {
    _id: '3',
    question: 'What transport links should I consider when buying in East London?',
    answer: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Key considerations include proximity to the Central, District, and Jubilee lines, DLR connections, and Crossrail (Elizabeth Line) stations which significantly improve connectivity. Consider stations like Canary Wharf, Whitechapel, and Stratford for best transport links.'
        }]
      }
    ],
    slug: { current: 'transport-links-buying-east-london' },
    summaryForAI: 'Key considerations include proximity to the Central, District, and Jubilee lines, DLR connections, and Crossrail (Elizabeth Line) stations which significantly improve connectivity.',
    keywords: ['transport', 'buying', 'connectivity', 'crossrail', 'tube'],
    category: { title: 'Transport', slug: { current: 'transport' } },
    priority: 3,
    publishedAt: '2024-01-01T00:00:00Z',
    image: {
      asset: { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800' },
      alt: 'London Underground station entrance'
    }
  },
  {
    _id: '4',
    question: 'Which areas in East London are best for families?',
    answer: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Hackney offers excellent primary schools and Victoria Park nearby. Bow provides more space and good schools like Bow School. Stratford has new developments with family amenities and Olympic Park access. Bethnal Green offers affordable family housing with good transport links.'
        }]
      }
    ],
    slug: { current: 'areas-best-for-families-east-london' },
    summaryForAI: 'Hackney offers excellent primary schools and Victoria Park nearby. Bow provides more space and good schools. Stratford has new developments with family amenities and Olympic Park access.',
    keywords: ['families', 'schools', 'areas', 'children', 'parks'],
    category: { title: 'Areas', slug: { current: 'areas' } },
    priority: 4,
    publishedAt: '2024-01-01T00:00:00Z',
    image: {
      asset: { url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800' },
      alt: 'Family-friendly park in East London'
    }
  },
  {
    _id: '5',
    question: 'What are the average rental costs in East London?',
    answer: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: '1-bedroom: £1,200-£2,500/month. 2-bedroom: £1,800-£3,500/month. 3-bedroom: £2,500-£5,000/month. Canary Wharf commands premium rents, while Bow, Bethnal Green, and Hackney offer better value. Factor in council tax, utilities, and potential agent fees.'
        }]
      }
    ],
    slug: { current: 'average-rental-costs-east-london' },
    summaryForAI: '1-bedroom: £1,200-£2,500/month. 2-bedroom: £1,800-£3,500/month. 3-bedroom: £2,500-£5,000/month. Canary Wharf commands premium rents, while other areas offer better value.',
    keywords: ['renting', 'costs', 'rental-prices', 'monthly-budget'],
    category: { title: 'Renting', slug: { current: 'renting' } },
    priority: 5,
    publishedAt: '2024-01-01T00:00:00Z',
    image: {
      asset: { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
      alt: 'East London rental property living room'
    }
  }
]

export async function getFAQs() {
  try {
    const faqs = await client.fetch(`
      *[_type == "faq"] | order(priority asc) {
        _id,
        question,
        answer,
        slug,
        summaryForAI,
        keywords,
        category->{
          title,
          slug
        },
        image {
          asset->{
            _id,
            url
          },
          alt
        },
        priority,
        publishedAt
      }
    `)
    return faqs.length > 0 ? faqs : mockFAQs
  } catch (error) {
    console.log('Using mock data:', error)
    return mockFAQs
  }
}

export async function getFAQBySlug(slug: string) {
  try {
    const faq = await client.fetch(`
      *[_type == "faq" && slug.current == $slug][0] {
        _id,
        question,
        answer,
        slug,
        summaryForAI,
        keywords,
        category->{
          title,
          slug
        },
        image {
          asset->{
            _id,
            url
          },
          alt
        },
        priority,
        publishedAt,
        author->{
          _id,
          name,
          slug,
          jobTitle,
          image {
            asset->{
              _id,
              url
            },
            alt
          }
        }
      }
    `, { slug })
    
    if (!faq) {
      return mockFAQs.find(f => f.slug.current === slug)
    }
    return faq
  } catch (error) {
    console.log('Using mock data for slug:', slug, error)
    return mockFAQs.find(f => f.slug.current === slug)
  }
}

export { client as default }