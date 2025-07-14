'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FAQ {
  _id: string
  question: string
  slug: { current: string }
  summary?: string
  category?: string
  _createdAt: string
}

export default function HomePage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredFAQs, setFilteredFAQs] = useState<FAQ[]>([])

  useEffect(() => {
    setFaqs([
      {
        _id: '1',
        question: 'How do I get started with this FAQ system?',
        slug: { current: 'how-to-get-started' },
        summary: 'Learn the basics of getting started with our enhanced FAQ template system.',
        category: 'Getting Started',
        _createdAt: '2025-01-01'
      },
      {
        _id: '2', 
        question: 'What features are included in this template?',
        slug: { current: 'what-features-included' },
        summary: 'Discover all the powerful features including search, theming, and content management.',
        category: 'Features',
        _createdAt: '2025-01-02'
      },
      {
        _id: '3',
        question: 'How do I customize the design and themes?',
        slug: { current: 'customize-design' },
        summary: 'Learn how to customize themes, colors, layout, and branding for your site.',
        category: 'Customization',
        _createdAt: '2025-01-03'
      }
    ])
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.summary?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredFAQs(filtered)
    } else {
      setFilteredFAQs(faqs)
    }
  }, [searchQuery, faqs])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 50%, #ede9fe 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#1e293b',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          Enhanced FAQ Site
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#64748b',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Professional FAQ system with search and content management
        </p>

        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            style={{
              width: '100%',
              maxWidth: '600px',
              padding: '1rem',
              fontSize: '1.125rem',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              backgroundColor: 'white',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {filteredFAQs.map((faq) => (
            <Link
              key={faq._id}
              href={`/faqs/${faq.slug.current}`}
              style={{
                display: 'block',
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <span style={{
                  backgroundColor: '#ede9fe',
                  color: '#5b21b6',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {faq.category || 'General'}
                </span>
                <span style={{ color: '#9ca3af', fontSize: '20px' }}>→</span>
              </div>
              
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '8px',
                lineHeight: '1.4'
              }}>
                {faq.question}
              </h3>
              
              {faq.summary && (
                <p style={{
                  color: '#64748b',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {faq.summary}
                </p>
              )}
            </Link>
          ))}
        </div>

        <div style={{
          background: 'linear-gradient(90deg, #ede9fe 0%, #e0e7ff 100%)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          border: '1px solid #ddd6fe'
        }}>
          <h3 style={{
            fontWeight: '600',
            color: '#581c87',
            marginBottom: '1rem'
          }}>
            🚀 Enhanced Template Features
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            fontSize: '0.875rem',
            color: '#6b21a8'
          }}>
            <div>✅ Search System</div>
            <div>✅ Modern Design</div>
            <div>✅ Sanity Ready</div>
            <div>✅ Responsive</div>
          </div>
        </div>
      </div>
    </div>
  )
}
