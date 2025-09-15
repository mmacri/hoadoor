import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HOAdoor - Transparent HOA Reviews & Community Management',
  description: 'Find and review Homeowners Associations. Connect with your HOA community through private portals with reviews, forums, documents, and events.',
  keywords: ['HOA', 'Homeowners Association', 'reviews', 'community', 'property management'],
  authors: [{ name: 'HOAdoor Team' }],
  openGraph: {
    title: 'HOAdoor - Transparent HOA Reviews',
    description: 'The platform for transparent HOA reviews and community management.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
