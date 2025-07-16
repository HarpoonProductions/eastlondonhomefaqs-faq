'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3lhihqg2',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
})

interface FAQ {
  _id: string
  question: string
  answer: string
  category: string
  slug: { current: string }
}

const categories = [
  { id: 'all', name: 'All Categories', color: 'bg-blue-500' },
  { id: 'buying', name: 'Buying', color: 'bg-green-500' },
  { id: 'renting', name: 'Renting', color: 'bg-purple-500' },
  { id: 'areas', name: 'Areas', color: 'bg-orange-500' },
  { id: 'transport', name: 'Transport', color: 'bg-red-500' },
  { id: 'schools', name: 'Schools', color: 'bg-yellow-500' },
  { id: 'legal', name: 'Legal', color: 'bg-indigo-500' },
  { id: 'costs', name: 'Costs', color: 'bg-pink-500' },
  { id: 'moving', name: 'Moving', color: 'bg-teal-500' },
  { id: 'investment', name: 'Investment', color: 'bg-cyan-500' },
  { id: 'lifestyle', name: 'Lifestyle', color: 'bg-lime-500' },
  { id: 'safety', name: 'Safety', color: 'bg-amber-500' },
]

export default function HomePage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestionModal, setShowSuggestionModal] = useState(false)
  const [suggestionForm, setSuggestionForm] = useState({ question: '', email: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFaqs()
  }, [])

  useEffect(() => {
    filterFaqs()
  }, [faqs, selectedCategory, searchQuery])

  const fetchFaqs = async () => {
    try {
      const query = `*[_type == "faq"] | order(_createdAt desc) {
        _id,
        question,
        answer,
        category,
        slug
      }`
      const result = await client.fetch(query)
      setFaqs(result)
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      // Fallback to mock data
      const mockFaqs = [
        {
          _id: '1',
          question: 'What are the best areas to buy property in East London?',
          answer: 'Popular areas include Canary Wharf, Stratford, Hackney, and Bethnal Green, each offering different benefits...',
          category: 'buying',
          slug: { current: 'best-areas-to-buy-east-london' }
        },
        {
          _id: '2',
          question: 'How much does it cost to rent a 2-bedroom flat in East London?',
          answer: 'Rental prices vary significantly by area, with average costs ranging from £1,500 to £3,000 per month...',
          category: 'renting',
          slug: { current: 'cost-rent-2-bedroom-east-london' }
        },
        {
          _id: '3',
          question: 'What transport links are available in East London?',
          answer: 'East London is well-connected with the Elizabeth Line, DLR, London Underground, and extensive bus networks...',
          category: 'transport',
          slug: { current: 'transport-links-east-london' }
        }
      ]
      setFaqs(mockFaqs)
    } finally {
      setLoading(false)
    }
  }

  const filterFaqs = () => {
    let filtered = faqs

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredFaqs(filtered)
  }

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the suggestion to your backend
    console.log('Suggestion submitted:', suggestionForm)
    setShowSuggestionModal(false)
    setSuggestionForm({ question: '', email: '' })
    alert('Thank you for your suggestion! We\'ll review it and add it to our FAQ database.')
  }

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.color : 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              East London Home FAQs
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Your trusted guide to East London property
            </p>
            <p className="text-lg mb-8 opacity-80">
              Find answers to your East London housing questions
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  className="w-full px-6 py-4 text-gray-900 text-lg rounded-full border-0 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-2 top-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* Suggest Question Button */}
            <button
              onClick={() => setShowSuggestionModal(true)}
              className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Suggest a Question
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? `${category.color} text-white`
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading FAQs...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No FAQs found matching your criteria.</p>
            <button
              onClick={() => setShowSuggestionModal(true)}
              className="mt-4 bg-blue-900 text-white px-6 py-3 rounded-full hover:bg-blue-800 transition-colors"
            >
              Suggest a Question
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFaqs.map((faq) => (
              <Link
                key={faq._id}
                href={`/faqs/${faq.slug.current}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-blue-300"
              >
                <div className="flex items-center mb-3">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full ${getCategoryColor(faq.category)}`}>
                    {faq.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {faq.answer}
                </p>
                <div className="mt-4 text-blue-600 text-sm font-medium hover:text-blue-800">
                  Read more →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Suggestion Modal */}
      {showSuggestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Suggest a Question</h2>
            <form onSubmit={handleSuggestionSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Your Question
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="What would you like to know about East London property?"
                  value={suggestionForm.question}
                  onChange={(e) => setSuggestionForm({ ...suggestionForm, question: e.target.value })}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                  value={suggestionForm.email}
                  onChange={(e) => setSuggestionForm({ ...suggestionForm, email: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowSuggestionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}