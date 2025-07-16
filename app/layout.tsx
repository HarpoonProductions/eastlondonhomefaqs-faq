import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'East London Home FAQs - Your trusted guide to East London property',
  description: 'Your complete guide to buying, renting, and living in East London',
  keywords: 'East London, property, housing, buying, renting, FAQs, Hackney, Canary Wharf, Stratford, Bethnal Green',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}