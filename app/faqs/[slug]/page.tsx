interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function FAQPage({ params }: PageProps) {
  const { slug } = await params
  
  // Mock FAQ data for demonstration
  const mockFAQs: Record<string, any> = {
    'sample-question': {
      question: 'Sample FAQ Question',
      answer: 'This is a sample answer. The FAQ system is ready for Sanity CMS integration!',
      category: 'General'
    },
    'test-question': {
      question: 'Test Question',
      answer: 'This FAQ system is working perfectly and ready for real content.',
      category: 'Technical'
    }
  }
  
  const faq = mockFAQs[slug]
  
  if (!faq) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">FAQ Not Found</h1>
        <p className="text-gray-600 mb-4">
          <strong>Requested:</strong> {slug}
        </p>
        <p className="mb-4">Available sample FAQs:</p>
        <ul className="list-disc list-inside space-y-2 text-blue-600">
          <li><a href="/faqs/sample-question" className="hover:underline">sample-question</a></li>
          <li><a href="/faqs/test-question" className="hover:underline">test-question</a></li>
        </ul>
        <p className="text-sm text-gray-500 mt-6">
          🚀 This FAQ system is ready for Sanity CMS integration!
        </p>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{faq.question}</h1>
      <div className="prose prose-lg mb-6">
        <p>{faq.answer}</p>
      </div>
      <div className="mt-8">
        <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
          {faq.category}
        </span>
      </div>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">✨ Template Features Ready:</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>✅ Dynamic FAQ pages</li>
          <li>✅ URL slug routing</li>
          <li>✅ Responsive design</li>
          <li>✅ Ready for Sanity CMS</li>
        </ul>
      </div>
    </div>
  )
}
