import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'ApecGlobal - Kiến Tạo Giá Trị, Làm Chủ Tương Lai',
  description: 'Tập Đoàn Kinh Tế ApecGlobal - Hệ sinh thái công nghệ, thương mại và cộng đồng. Chuyển đổi số, AI, Blockchain, Cloud Computing.',
  keywords: ['ApecGlobal', 'Chuyển đổi số', 'AI', 'Blockchain', 'Cloud Computing', 'Công nghệ', 'Thương mại', 'Kinh tế tuần hoàn'],
  authors: [{ name: 'ApecGlobal' }],
  openGraph: {
    title: 'ApecGlobal - Kiến Tạo Giá Trị, Làm Chủ Tương Lai',
    description: 'Hệ sinh thái công nghệ, thương mại và cộng đồng',
    type: 'website',
  }
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
