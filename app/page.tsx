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
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            East London Home FAQs
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
            Your trusted guide to East London property
          </p>
        </div>
      </header>

      {/* Search Section */}
      <section className="container" style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
            Find answers to your East London housing questions
          </h2>
          <input
            type="text"
            placeholder="Search housing questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-box"
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setSelectedCategory('')}
            className={`btn ${!selectedCategory ? 'active' : 'inactive'}`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${selectedCategory === category ? 'active' : 'inactive'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ 
              width: '2rem', 
              height: '2rem', 
              border: '3px solid #f3f4f6', 
              borderTop: '3px solid #071939',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading FAQs...</p>
          </div>
        ) : (
          <div className="faq-grid">
            {filteredFAQs.map((faq) => (
              <Link
                key={faq._id}
                href={`/faqs/${faq.slug.current}`}
                className="faq-card"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="category-tag">
                    {faq.category}
                  </span>
                  {faq.priority <= 3 && (
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      backgroundColor: '#ef4444', 
                      borderRadius: '50%',
                      display: 'inline-block'
                    }}></span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                  {faq.question}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                  {faq.answer.length > 150 ? faq.answer.substring(0, 150) + '...' : faq.answer}
                </p>
                <div style={{ color: '#071939', fontSize: '0.875rem', fontWeight: '500' }}>
                  Read more →
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredFAQs.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: '#6b7280' }}>No FAQs found matching your search.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', marginTop: '4rem' }}>
        <div className="container" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>© 2024 East London Home FAQs. Part of the Upsum Network.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  )
}