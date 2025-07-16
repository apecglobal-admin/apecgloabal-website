import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',

  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload main logo for faster splash page loading */}
        <link rel="preload" href="/main-logo.png" as="image" />
      </head>
      <body className="bg-white text-black">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
