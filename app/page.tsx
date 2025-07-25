'use client'

import { client, getImageUrl } from '@/lib/sanity'
import { groq } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import PWADownloadButton from '@/components/PWADownloadButton'

// Type definitions
interface FAQ {
  _id: string;
  question: string;
  slug: { current: string };
  summaryForAI?: string;
  keywords?: string[];
  category?: { 
    title: string;
    slug: { current: string };
    color?: string;
  };
  image?: {
    asset?: {
      url: string;
    };
    alt?: string;
  };
  publishedAt?: string;
}

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  color?: string;
  orderIndex?: number;
}

interface SearchBoxProps {
  faqs: FAQ[];
  onSuggestQuestion: (question?: string) => void;
  theme?: 'blue' | 'orange';
}

// Skeleton Components
const CategorySkeleton = () => (
  <div className="flex flex-wrap gap-2 justify-center">
    {/* All Categories skeleton */}
    <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
    {/* Category buttons skeleton */}
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"></div>
    ))}
  </div>
)

const FAQCardSkeleton = () => (
  <article className="bg-white rounded-3xl shadow-lg overflow-hidden">
    {/* Image skeleton */}
    <div className="relative h-64 md:h-72 bg-gray-200 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
        {/* Badge skeleton */}
        <div className="mb-3">
          <div className="h-6 w-24 bg-white/20 rounded-full"></div>
        </div>
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-white/20 rounded w-3/4"></div>
          <div className="h-6 bg-white/20 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    {/* Content skeleton */}
    <div className="p-6 md:p-8">
      {/* Summary skeleton */}
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </div>

      {/* Read more skeleton */}
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </article>
)

const FAQGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
    {Array.from({ length: 6 }).map((_, i) => (
      <FAQCardSkeleton key={i} />
    ))}
  </div>
)

// Search Component - Blue themed for East London
const SearchBox = ({ faqs, onSuggestQuestion, theme = 'blue', initialQuery = '' }: SearchBoxProps & { initialQuery?: string }) => {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);

  // Update query when initialQuery changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const themeColors = {
    blue: {
      accent: 'blue',
      ring: 'focus:ring-blue-500',
      border: 'focus:border-blue-500',
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      hover: 'hover:bg-blue-50'
    },
    orange: {
      accent: 'orange', 
      ring: 'focus:ring-orange-500',
      border: 'focus:border-orange-500',
      text: 'text-orange-600',
      bg: 'bg-orange-50',
      hover: 'hover:bg-orange-50'
    }
  };

  const colors = themeColors[theme];

  // Search logic
  const searchResults = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    return faqs.filter(faq => 
      faq.question?.toLowerCase().includes(searchTerm) ||
      (faq.summaryForAI && faq.summaryForAI.toLowerCase().includes(searchTerm))
    ).slice(0, 5); // Show max 5 results
  }, [query, faqs]);

  // Highlight search terms
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() 
        ? <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
        : part
    );
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full pl-12 pr-4 py-4 text-lg border border-slate-300 rounded-xl ${colors.ring} ${colors.border} bg-white shadow-lg transition-all duration-200`}
          placeholder="Search property questions..."
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-700">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {/* Results List */}
              <div className="py-2">
                {searchResults.map((faq) => (
                  <Link
                    key={faq._id}
                    href={`/faqs/${faq.slug.current}`}
                    className={`block px-4 py-3 ${colors.hover} transition-colors duration-150`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 ${colors.bg} rounded-full mt-2 flex-shrink-0`}></div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-slate-800 leading-snug mb-1">
                          {highlightText(faq.question, query.trim())}
                        </h4>
                        {faq.summaryForAI && (
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {highlightText(faq.summaryForAI, query.trim())}
                          </p>
                        )}
                      </div>
                      <svg className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            /* No Results */
            <div className="px-4 py-8 text-center">
              <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <svg className={`w-6 h-6 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.347 0-4.518.641-6.397 1.759" />
                </svg>
              </div>
              <h4 className="font-medium text-slate-800 mb-2">No results found</h4>
              <p className="text-sm text-slate-600 mb-4">
                We couldn't find any property FAQs matching "{query}"
              </p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onSuggestQuestion(query);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Suggest this question
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// Suggest Question Modal Component - Blue themed
interface SuggestQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'blue' | 'orange';
  siteName?: string;
  siteUrl?: string;
  prefillQuestion?: string;
}

const SuggestQuestionModal = ({ 
  isOpen, 
  onClose, 
  theme = 'blue', 
  siteName = 'East London Home FAQs', 
  siteUrl = 'https://eastlondonhomefaqs.com', 
  prefillQuestion = '' 
}: SuggestQuestionModalProps) => {
  const [formData, setFormData] = useState({
    question: '',
    email: '',
    context: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rateLimitError, setRateLimitError] = useState('');

  // Pre-fill question when modal opens
  useEffect(() => {
    if (isOpen && prefillQuestion) {
      setFormData(prev => ({
        ...prev,
        question: prefillQuestion
      }));
    }
  }, [isOpen, prefillQuestion]);

  const themeColors = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      button: 'bg-blue-600 hover:bg-blue-700',
      text: 'text-blue-600'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      button: 'bg-orange-600 hover:bg-orange-700',
      text: 'text-orange-600'
    }
  };

  const colors = themeColors[theme];

  // Check rate limiting
  const checkRateLimit = () => {
    if (typeof window === 'undefined') return null;
    
    const lastSubmission = localStorage.getItem('lastQuestionSubmission');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (lastSubmission && (now - parseInt(lastSubmission)) < oneDay) {
      const timeLeft = oneDay - (now - parseInt(lastSubmission));
      const hoursLeft = Math.ceil(timeLeft / (60 * 60 * 1000));
      return `Please wait ${hoursLeft} hours before suggesting another question.`;
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    const rateLimitMsg = checkRateLimit();
    if (rateLimitMsg) {
      setRateLimitError(rateLimitMsg);
      return;
    }

    // Validate inputs
    if (!formData.question.trim() || formData.question.length > 500) {
      return;
    }
    if (!formData.email.trim()) {
      return;
    }
    if (formData.context.length > 1000) {
      return;
    }

    setIsSubmitting(true);
    setRateLimitError('');

    // Create mailto link with clear site identification
    const subject = encodeURIComponent(`New Question Suggestion for ${siteName}`);
    const body = encodeURIComponent(`
Question: ${formData.question.trim()}

Additional Context: ${formData.context.trim() || 'None provided'}

User Email: ${formData.email.trim()}

---
Submitted from: ${siteName}
Site URL: ${siteUrl}
Timestamp: ${new Date().toISOString()}
    `);
    
    window.location.href = `mailto:studio@harpoon.productions?subject=${subject}&body=${body}`;
    
    // Set rate limiting
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastQuestionSubmission', Date.now().toString());
    }
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Close modal after 2.5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setFormData({ question: '', email: '', context: '' });
      setRateLimitError('');
    }, 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`${colors.bg} ${colors.border} border-b px-6 py-4 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Suggest a Property Question</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-slate-600 text-sm mt-1">
            Help us improve by suggesting questions about East London property
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <svg className={`w-8 h-8 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Thank you!</h3>
              <p className="text-slate-600">Your property question suggestion has been sent. We'll review it and may add it to our FAQ collection.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Rate limit error */}
              {rateLimitError && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-sm">{rateLimitError}</p>
                </div>
              )}

              {/* Question Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Property Question *
                </label>
                <textarea
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="What would you like to know about East London property?"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.question.length}/500 characters
                </p>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Required for spam prevention and follow-up
                </p>
              </div>

              {/* Context Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Context (optional)
                </label>
                <textarea
                  name="context"
                  value={formData.context}
                  onChange={handleChange}
                  rows={2}
                  maxLength={1000}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Any background info that might help us provide a better answer..."
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.context.length}/1000 characters
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!formData.question.trim() || !formData.email.trim() || isSubmitting || !!rateLimitError}
                  className={`flex-1 px-4 py-2 ${colors.button} text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Suggestion'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefillQuestion, setPrefillQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle URL parameters for category filtering and search
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      const searchParam = urlParams.get('search');
      
      if (categoryParam) {
        setSelectedCategory(categoryParam);
      }
      
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch FAQs
        const faqQuery = groq`*[_type == "faq" && defined(slug.current)] | order(publishedAt desc, _createdAt desc)[0...10] {
          _id,
          question,
          slug,
          summaryForAI,
          keywords,
          category->{
            title,
            slug,
            color
          },
          image {
            asset->{
              _id,
              url
            },
            alt
          },
          publishedAt
        }`;

        // Fetch Categories - Fixed query
        const categoryQuery = groq`*[_type == "category"] | order(coalesce(orderIndex, 999) asc, title asc) {
          _id,
          title,
          slug,
          color,
          orderIndex
        }`;
        
        const [faqResult, categoryResult] = await Promise.all([
          client.fetch(faqQuery),
          client.fetch(categoryQuery)
        ]);

        console.log('FAQs loaded:', faqResult.length);
        console.log('Categories loaded:', categoryResult.length);

        setFaqs(faqResult);
        setCategories(categoryResult);
        setLoading(false);
      } catch (error) {
        console.error('❌ Fetch error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter FAQs when category, faqs, or search changes
  useEffect(() => {
    let filtered = faqs;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => 
        faq.category?.slug?.current === selectedCategory
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question?.toLowerCase().includes(searchTerm) ||
        faq.summaryForAI?.toLowerCase().includes(searchTerm) ||
        faq.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredFaqs(filtered);
  }, [faqs, selectedCategory, searchQuery]);

  const handleSuggestQuestion = (questionText = '') => {
    setPrefillQuestion(questionText);
    setIsModalOpen(true);
  };

  const getCategoryColor = (colorName?: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      teal: 'bg-teal-500',
      pink: 'bg-pink-500',
      indigo: 'bg-indigo-500',
      cyan: 'bg-cyan-500',
      lime: 'bg-lime-500',
      amber: 'bg-amber-500'
    };
    return colorMap[colorName || 'blue'] || 'bg-blue-500';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://eastlondonhomefaqs.com/#website",
            "url": "https://eastlondonhomefaqs.com",
            "name": "East London Home FAQs",
            "description": "Questions and answers about buying, renting and living in East London",
            "inLanguage": "en-US"
          })
        }}
      />

      {/* Main Content */}
      <div className="flex-grow">
        {/* Header Section */}
        <div className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto text-center" style={{ maxWidth: '1600px' }}>
            <Link href="/" className="inline-block">
              <Image
                src="/eastlondonhomefaqs.png"
                alt="East London Home FAQs"
                width={400}
                height={120}
                className="mx-auto mb-6"
              />
            </Link>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8">
              Questions and answers about buying, renting and living in East London
            </p>
            
            {/* Search Box */}
            <div className="mb-8">
              <SearchBox 
                faqs={faqs}
                onSuggestQuestion={handleSuggestQuestion}
                theme="blue"
                initialQuery={searchQuery}
              />
            </div>

            {/* Suggest Question CTA */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-slate-300 flex-1 max-w-24"></div>
              <span className="text-slate-500 text-sm">or</span>
              <div className="h-px bg-slate-300 flex-1 max-w-24"></div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
              <button
                onClick={() => handleSuggestQuestion()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Suggest a Property Question
              </button>
              
              <PWADownloadButton />
            </div>
            <p className="text-slate-500 text-sm mt-3">
              Can't find what you're looking for? Let us know!
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: '1600px' }}>
          {loading ? (
            <CategorySkeleton />
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              {/* All Categories Button */}
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-slate-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Categories
              </button>
              
              {/* Dynamic Category Buttons */}
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category.slug.current)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug.current
                      ? `${getCategoryColor(category.color)} text-white`
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Articles Grid */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-16" style={{ maxWidth: '1600px' }}>
          {loading ? (
            <FAQGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredFaqs.map((faq) => {
                const imageUrl = getImageUrl(faq.image, 500, 300)

                return (
                  <article
                    key={faq._id}
                    className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  >
                    {/* Clickable Image Container with Overlay */}
                    <Link
                      href={`/faqs/${faq.slug.current}`}
                      className="block relative overflow-hidden group"
                    >
                      <div className="relative h-64 md:h-72 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={faq.image?.alt || faq.question}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        
                        {/* Dark gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Text overlay */}
                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                          {/* Category Badge */}
                          <div className="mb-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                              {faq.category?.title || 'Property Question'}
                            </span>
                          </div>
                          
                          {/* Question Title */}
                          <h2 className="text-xl md:text-2xl font-bold text-white leading-tight group-hover:text-blue-200 transition-colors duration-300">
                            {faq.question}
                          </h2>
                        </div>
                        
                        {/* Hover indicator */}
                        <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    </Link>

                    {/* Content Section */}
                    <div className="p-6 md:p-8">
                      {/* Summary */}
                      {faq.summaryForAI && (
                        <p className="text-slate-600 leading-relaxed line-clamp-3 mb-6">
                          {faq.summaryForAI}
                        </p>
                      )}

                      {/* Read More Link */}
                      <Link
                        href={`/faqs/${faq.slug.current}`}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm group/link transition-colors duration-200"
                      >
                        Read full answer
                        <svg 
                          className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>

                    {/* Subtle border effect */}
                    <div className="absolute inset-0 rounded-3xl ring-1 ring-slate-200/50 group-hover:ring-blue-300/50 transition-colors duration-300 pointer-events-none" />
                  </article>
                )
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredFaqs.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                {selectedCategory === 'all' ? 'No Property FAQs found' : `No FAQs found in this category`}
              </h3>
              <p className="text-slate-500 mb-4">
                {selectedCategory === 'all' 
                  ? 'Check back later for new questions and answers about East London property!' 
                  : 'Try selecting a different category or suggest a new question.'
                }
              </p>
              <button
                onClick={() => handleSuggestQuestion()}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                {selectedCategory === 'all' 
                  ? 'Be the first to suggest a property question →'
                  : 'Suggest a question for this category →'
                }
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Standardized Footer with "Powered by Upsum" */}
      <footer className="bg-blue-50 border-t border-blue-200 py-6 mt-auto">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ maxWidth: '1600px' }}>
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-2">
            <span>Powered by</span>
            <Image
              src="/upsum.png"
              alt="Upsum"
              width={60}
              height={24}
              className="opacity-70"
            />
          </div>
          <p className="text-xs text-slate-400">
            Upsum is a trademark of{' '}
            <a 
              href="https://harpoon.productions" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-slate-600 transition-colors duration-200"
            >
              Harpoon Productions
            </a>
          </p>
        </div>
      </footer>

      {/* Suggest Question Modal */}
      <SuggestQuestionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        theme="blue"
        siteName="East London Home FAQs"
        siteUrl="https://eastlondonhomefaqs.com"
        prefillQuestion={prefillQuestion}
      />
    </div>
  )
}