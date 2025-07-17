'use client'

import { client, getImageUrl } from '@/lib/sanity'
import { groq } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'

interface Author {
  _id: string
  name: string
  slug: { current: string }
  jobTitle?: string
  expertise?: string[]
  socialMedia?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
  image?: {
    asset?: { url: string }
    alt?: string
  }
}

interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  color?: string
}

interface Faq {
  _id: string
  question: string
  answer: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  slug: { current: string }
  summaryForAI?: string
  alternateQuestions?: string[]
  keywords?: string[]
  category: Category
  relatedFAQs?: Faq[]
  publishedAt: string
  updatedAt?: string
  author: Author
  image?: {
    asset?: { url: string }
    alt?: string
    caption?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
  customSchemaMarkup?: string
}

// Enhanced queries with proper image asset references
const faqQuery = groq`*[_type == "faq" && slug.current == $slug][0] {
  _id,
  question,
  answer,
  slug,
  summaryForAI,
  alternateQuestions,
  keywords,
  category->{
    _id,
    title,
    slug,
    description,
    color
  },
  relatedFAQs[]->{
    _id,
    question,
    slug,
    summaryForAI,
    image {
      asset->{
        _id,
        url
      },
      alt,
      caption
    },
    category->{
      title,
      slug,
      color
    }
  },
  publishedAt,
  updatedAt,
  author->{
    _id,
    name,
    slug,
    jobTitle,
    expertise,
    socialMedia,
    image {
      asset->{
        _id,
        url
      },
      alt
    }
  },
  image {
    asset->{
      _id,
      url
    },
    alt,
    caption
  },
  seo,
  customSchemaMarkup
}`

const relatedQuery = groq`*[_type == "faq" && _id != $currentId && (
  category._ref == $categoryRef ||
  count((keywords[])[@ in $keywords]) > 0
)] | order(
  (category._ref == $categoryRef => 3) +
  (count((keywords[])[@ in $keywords]) * 2)
) desc [0...6] {
  _id,
  question,
  slug,
  summaryForAI,
  keywords,
  image {
    asset->{
      _id,
      url
    },
    alt,
    caption
  },
  category->{
    title,
    slug,
    color
  }
}`

// Search FAQs query for the search box
const searchFAQsQuery = groq`*[_type == "faq" && defined(slug.current) && defined(question)] {
  _id,
  question,
  slug,
  summaryForAI
}`

// Search Component - Blue themed for East London
interface SearchFAQ {
  _id: string;
  question: string;
  slug: { current: string };
  summaryForAI?: string;
}

const FAQPageSearch = ({ searchFAQs }: { searchFAQs: SearchFAQ[] }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Search logic with null safety
  const searchResults = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    
    // Filter out FAQs with null/invalid slugs BEFORE searching
    const validFaqs = searchFAQs.filter(faq => 
      faq && 
      faq.slug && 
      faq.slug.current && 
      faq.question
    );
    
    return validFaqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.summaryForAI?.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // Show max 5 results
  }, [query, searchFAQs]);

  // Highlight search terms
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() 
        ? <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
        : part
    );
  };

  return (
    <div className="relative max-w-xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="w-full pl-10 pr-4 py-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
          placeholder="Search other property questions..."
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-4 w-4 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-80 overflow-y-auto">
          {searchResults.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-medium text-slate-700">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {/* Results List */}
              <div className="py-1">
                {searchResults
                  .filter(faq => faq && faq.slug && faq.slug.current && faq.question)
                  .map((faq) => (
                  <Link
                    key={faq._id}
                    href={`/faqs/${faq.slug.current}`}
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150"
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-100 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-slate-800 leading-snug mb-1 text-sm">
                          {highlightText(faq.question, query.trim())}
                        </h4>
                        {faq.summaryForAI && (
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {highlightText(faq.summaryForAI, query.trim())}
                          </p>
                        )}
                      </div>
                      <svg className="w-3 h-3 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            /* No Results */
            <div className="px-4 py-6 text-center">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.347 0-4.518.641-6.397 1.759" />
                </svg>
              </div>
              <h4 className="font-medium text-slate-800 mb-1 text-sm">No results found</h4>
              <p className="text-xs text-slate-600">
                No property FAQs match &quot;{query}&quot;
              </p>
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

// Citation Box Component with Copy Functionality
interface CitationBoxProps {
  question: string;
  url: string;
  theme?: 'blue' | 'orange' | 'purple';
}

const CitationBox = ({ question, url, theme = 'blue' }: CitationBoxProps) => {
  const [copied, setCopied] = useState(false);

  const themeColors = {
    blue: {
      bg: 'from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      titleText: 'text-blue-900',
      linkText: 'text-blue-600 hover:text-blue-700'
    },
    orange: {
      bg: 'from-orange-50 to-red-50',
      border: 'border-orange-200',
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-600',
      titleText: 'text-orange-900',
      linkText: 'text-orange-600 hover:text-orange-700'
    },
    purple: {
      bg: 'from-purple-50 to-indigo-50',
      border: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      titleText: 'text-purple-900',
      linkText: 'text-purple-600 hover:text-purple-700'
    }
  };

  const colors = themeColors[theme];

  const citationText = `"${question}." East London Home FAQs. Available at: ${url}`;

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(citationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy citation:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = citationText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div 
      className={`bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-2xl p-6 cursor-pointer hover:shadow-md transition-all duration-200 transform hover:scale-[1.01] relative group`}
      onClick={handleCopyClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCopyClick();
        }
      }}
    >
      <div className="flex items-start gap-4">
        <div className={`w-8 h-8 ${colors.iconBg} rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-200`}>
          {copied ? (
            <svg className={`w-4 h-4 ${colors.iconText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className={`w-4 h-4 ${colors.iconText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${colors.titleText} mb-2 text-lg flex items-center gap-2`}>
            {copied ? 'Citation copied!' : 'How to cite this page'}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-normal text-slate-500">
              (click to copy)
            </span>
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            &quot;{question}.&quot; <em className="font-medium">East London Home FAQs</em>. Available at:{' '}
            <span className={`${colors.linkText} underline decoration-2 underline-offset-2 transition-colors duration-200 break-all`}>
              {url}
            </span>
          </p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      
      {/* Success animation overlay */}
      {copied && (
        <div className="absolute inset-0 rounded-2xl bg-green-100/50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

interface FaqPageProps {
  params: Promise<{ slug: string }>;
}

export default function FaqPage({ params }: FaqPageProps) {
  const [slug, setSlug] = useState<string>('');
  const [faq, setFaq] = useState<Faq | null>(null);
  const [relatedFaqs, setRelatedFaqs] = useState<Faq[]>([]);
  const [searchFAQs, setSearchFAQs] = useState<SearchFAQ[]>([]);
  const [loading, setLoading] = useState(true);

  // Resolve params and fetch data
  useEffect(() => {
    params.then(resolvedParams => {
      setSlug(resolvedParams.slug);
      fetchFaqData(resolvedParams.slug);
    });
  }, [params]);

  const fetchFaqData = async (faqSlug: string) => {
    try {
      // Fetch FAQ and search FAQs
      const [faqData, searchFAQsData] = await Promise.allSettled([
        client.fetch(faqQuery, { slug: faqSlug }),
        client.fetch(searchFAQsQuery)
      ]);

      if (faqData.status !== 'fulfilled' || !faqData.value) {
        notFound();
        return;
      }
      
      const faqResult = faqData.value;
      setFaq(faqResult);
      setSearchFAQs(searchFAQsData.status === 'fulfilled' ? searchFAQsData.value || [] : []);
      
      // Enhanced related FAQ logic
      let related: Faq[] = [];
      
      // If manual related FAQs are set, use those
      if (faqResult.relatedFAQs?.length > 0) {
        related = faqResult.relatedFAQs.slice(0, 3);
      } else {
        // Otherwise, use automatic related FAQ detection
        try {
          const autoRelated: Faq[] = await client.fetch(relatedQuery, { 
            currentId: faqResult._id,
            categoryRef: faqResult.category?._id,
            keywords: faqResult.keywords || []
          });
          
          related = autoRelated.slice(0, 3);
        } catch (error) {
          console.error('Error fetching related FAQs:', error);
          related = [];
        }
      }
      
      setRelatedFaqs(related);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      setLoading(false);
    }
  };

  const getCategoryColor = (colorName?: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      green: 'bg-green-100 text-green-700 hover:bg-green-200',
      purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      red: 'bg-red-100 text-red-700 hover:bg-red-200',
      yellow: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      teal: 'bg-teal-100 text-teal-700 hover:bg-teal-200',
      pink: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
      indigo: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
      cyan: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
      lime: 'bg-lime-100 text-lime-700 hover:bg-lime-200',
      amber: 'bg-amber-100 text-amber-700 hover:bg-amber-200'
    };
    return colorMap[colorName || 'blue'] || 'bg-blue-100 text-blue-700 hover:bg-blue-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!faq) {
    notFound();
    return null;
  }

  const faqUrl = `https://eastlondonhomefaqs.com/faqs/${slug}`;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Enhanced JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "QAPage",
            "@id": faqUrl,
            "url": faqUrl,
            "name": faq.question,
            "description": faq.summaryForAI || `Find the answer to: ${faq.question}`,
            "inLanguage": "en-US",
            "datePublished": faq.publishedAt || new Date().toISOString(),
            "dateModified": faq.updatedAt || new Date().toISOString(),
            "isPartOf": {
              "@type": "WebSite",
              "@id": "https://eastlondonhomefaqs.com/#website",
              "url": "https://eastlondonhomefaqs.com",
              "name": "East London Home FAQs",
              "description": "Questions and answers about buying, renting and living in East London",
              "publisher": {
                "@type": "Organization",
                "@id": "https://eastlondonhomefaqs.com/#organization",
                "name": "Harpoon Productions Ltd",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://eastlondonhomefaqs.com/eastlondonhomefaqs.png"
                }
              }
            },
            "mainEntity": {
              "@type": "Question",
              "@id": `${faqUrl}#question`,
              "name": faq.question,
              "text": faq.question,
              "answerCount": 1,
              "acceptedAnswer": {
                "@type": "Answer",
                "@id": `${faqUrl}#answer`,
                "text": faq.summaryForAI || "Detailed answer provided on the page.",
                "dateCreated": faq.publishedAt || new Date().toISOString(),
                "upvoteCount": 0,
                "author": {
                  "@type": "Organization",
                  "@id": "https://eastlondonhomefaqs.com/#organization",
                  "name": "East London Home FAQs"
                }
              }
            }
          })
        }}
      />

      {/* Header Section - Logo Version */}
      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
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
          <div className="mb-6">
            <FAQPageSearch searchFAQs={searchFAQs} />
          </div>
        </div>
      </div>

      {/* Navigation - Updated with proper breadcrumbs */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 mb-8" style={{ maxWidth: '1600px' }}>
        <div className="flex items-center gap-4 text-sm">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 group font-medium"
          >
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to hub
          </Link>
          <span className="text-slate-400">•</span>
          <Link 
            href="/faqs" 
            className="text-slate-600 hover:text-slate-800 transition-colors duration-200 font-medium"
          >
            All FAQs
          </Link>
        </div>
      </div>

      {/* Main Content - Flex grow to push footer down */}
      <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-8 pb-16" style={{ maxWidth: '1600px' }}>
        <article className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-12">
          {/* Hero Image with Question Overlay */}
          {faq.image?.asset?.url && (
            <div className="relative h-80 md:h-96 overflow-hidden">
              <Image
                src={getImageUrl(faq.image, 1200, 600)}
                alt={faq.image.alt || faq.question}
                fill
                className="object-cover"
              />
              
              {/* Dark gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Question overlay */}
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                {/* Category Badge */}
                {faq.category && (
                  <div className="mb-4">
                    <Link
                      href={`/?category=${faq.category.slug.current}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      {faq.category.title}
                    </Link>
                  </div>
                )}
                <h1 className="faq-question text-3xl md:text-5xl font-bold text-white leading-tight max-w-4xl">
                  {faq.question}
                </h1>
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="p-8 md:p-12">
            {/* If no image, show question as heading with category */}
            {!faq.image?.asset?.url && (
              <div className="mb-8">
                {faq.category && (
                  <div className="mb-4">
                    <Link
                      href={`/?category=${faq.category.slug.current}`}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${getCategoryColor(faq.category.color)}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {faq.category.title}
                    </Link>
                  </div>
                )}
                <h1 className="faq-question text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                  {faq.question}
                </h1>
              </div>
            )}

            {/* Author and Metadata */}
            {faq.author && (
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                <div className="flex items-center gap-2">
                  {faq.author.image?.asset?.url && (
                    <Image
                      src={getImageUrl(faq.author.image, 32, 32)}
                      alt={faq.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span>By {faq.author.name}</span>
                  {faq.author.jobTitle && (
                    <span className="text-slate-400">• {faq.author.jobTitle}</span>
                  )}
                </div>
                <span>•</span>
                <time dateTime={faq.publishedAt}>
                  {new Date(faq.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            )}

            {/* AI Summary */}
            {faq.summaryForAI && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                <p className="text-blue-900 font-medium">Quick Answer:</p>
                <p className="text-blue-800">{faq.summaryForAI}</p>
              </div>
            )}

            {/* Answer Content */}
            <div className="faq-answer prose prose-lg prose-slate max-w-none mb-8">
              <PortableText value={faq.answer} />
            </div>

            {/* Keywords/Tags */}
            {faq.keywords && faq.keywords.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Topics:</h3>
                <div className="flex flex-wrap gap-2">
                  {faq.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Clickable Citation Box - Blue theme for East London */}
            <CitationBox 
              question={faq.question}
              url={faqUrl}
              theme="blue"
            />
          </div>
        </article>

        {/* Related Questions - Enhanced with better related logic */}
        {relatedFaqs?.length > 0 && (
          <section>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Related Property Questions</h3>
              <p className="text-slate-600 text-lg">Explore more topics about East London housing</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {relatedFaqs.map((related) => {
                const imageUrl = getImageUrl(related.image, 500, 300);

                return (
                  <Link
                    key={related._id}
                    href={`/faqs/${related.slug.current}`}
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
                  >
                    {/* Image with overlay - matching front page style */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={related.question}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                      />
                      
                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Text overlay */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className="mb-3">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            {related.category?.title || 'Related'}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white leading-tight group-hover:text-blue-200 transition-colors duration-300">
                          {related.question}
                        </h4>
                      </div>
                      
                      {/* Hover indicator */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {related.summaryForAI && (
                        <p className="text-slate-600 leading-relaxed line-clamp-3 mb-4">
                          {related.summaryForAI}
                        </p>
                      )}
                      <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-200">
                        Read answer
                        <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer with "Powered by Upsum" - Now sticky to bottom */}
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
    </div>
  )
}