'use client'

import { useState, useEffect } from 'react'
import { getFAQs } from '@/lib/sanity'
import Link from 'next/link'

interface FAQ {
  _id: string
  question: string
  answer: string
  category: string
  slug: { current: string }
  tags?: string[]
  priority: number
}

export default function Home() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)

  const categories = [
    'buying', 'renting', 'areas', 'transport', 'schools', 
    'legal', 'costs', 'moving', 'investment', 'lifestyle', 'safety'
  ]

  useEffect(() => {
    async function loadFAQs() {
      try {
        const data = await getFAQs()
        setFaqs(data)
      } catch (error) {
        console.error('Error loading FAQs:', error)
      } finally {
        setLoading(false)
      }
    }
    loadFAQs()
  }, [])

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#071939] mb-2">
              East London Home FAQs
            </h1>
            <p className="text-xl text-gray-600">
              Your trusted guide to East London property
            </p>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Find answers to your East London housing questions
          </h2>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search housing questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071939] focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory 
                ? 'bg-[#071939] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                selectedCategory === category 
                  ? 'bg-[#071939] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#071939] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading FAQs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFAQs.map((faq) => (
              <Link
                key={faq._id}
                href={`/faqs/${faq.slug.current}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-[#071939] text-xs font-semibold rounded-full capitalize">
                    {faq.category}
                  </span>
                  {faq.priority <= 3 && (
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {faq.answer}
                </p>
                <div className="mt-4 text-[#071939] text-sm font-medium">
                  Read more →
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredFAQs.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">No FAQs found matching your search.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 East London Home FAQs. Part of the Upsum Network.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}