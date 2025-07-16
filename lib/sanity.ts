import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-05-03',
  useCdn: false
})

// Mock data for East London Home FAQs
const mockFAQs = [
  {
    _id: '1',
    question: 'What are the best areas to buy a house in East London?',
    answer: 'Popular areas include Canary Wharf for modern apartments, Hackney for trendy Victorian homes, and Stratford for excellent transport links and regeneration opportunities. Bethnal Green offers good value with easy access to central London, while Bow is emerging as a popular choice for families seeking more space.',
    category: 'areas',
    slug: { current: 'best-areas-buy-house-east-london' },
    tags: ['buying', 'areas', 'investment'],
    priority: 1,
    publishedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    question: 'How much should I budget for a 2-bedroom flat in East London?',
    answer: 'Prices vary significantly by area. Budget £350,000-£500,000 for areas like Bethnal Green, £500,000-£800,000 for Canary Wharf, and £250,000-£400,000 for up-and-coming areas like Barking. Add 10-15% for additional costs including stamp duty, legal fees, and surveys.',
    category: 'costs',
    slug: { current: 'budget-2-bedroom-flat-east-london' },
    tags: ['costs', 'buying', 'budget'],
    priority: 2,
    publishedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '3',
    question: 'What transport links should I consider when buying in East London?',
    answer: 'Key considerations include proximity to the Central, District, and Jubilee lines, DLR connections, and Crossrail (Elizabeth Line) stations which significantly improve connectivity. Consider stations like Canary Wharf, Whitechapel, and Stratford for best transport links.',
    category: 'transport',
    slug: { current: 'transport-links-buying-east-london' },
    tags: ['transport', 'buying', 'connectivity'],
    priority: 3,
    publishedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '4',
    question: 'Which areas in East London are best for families?',
    answer: 'Hackney offers excellent primary schools and Victoria Park nearby. Bow provides more space and good schools like Bow School. Stratford has new developments with family amenities and Olympic Park access. Bethnal Green offers affordable family housing with good transport links.',
    category: 'areas',
    slug: { current: 'areas-best-for-families-east-london' },
    tags: ['families', 'schools', 'areas'],
    priority: 4,
    publishedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '5',
    question: 'What are the average rental costs in East London?',
    answer: '1-bedroom: £1,200-£2,500/month. 2-bedroom: £1,800-£3,500/month. 3-bedroom: £2,500-£5,000/month. Canary Wharf commands premium rents, while Bow, Bethnal Green, and Hackney offer better value. Factor in council tax, utilities, and potential agent fees.',
    category: 'renting',
    slug: { current: 'average-rental-costs-east-london' },
    tags: ['renting', 'costs', 'rental-prices'],
    priority: 5,
    publishedAt: '2024-01-01T00:00:00Z'
  }
]

export async function getFAQs() {
  try {
    const faqs = await client.fetch(`
      *[_type == "faq"] | order(priority asc) {
        _id,
        question,
        answer,
        category,
        slug,
        tags,
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
        category,
        slug,
        tags,
        priority,
        publishedAt
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

export { client }