import type { Metadata } from 'next'
import './globals.css'
import ToastProvider from '@/components/providers/ToastProvider'

export const metadata: Metadata = {
  title: 'Educate.io - Entrepreneurship Education Platform',
  description: 'Revolutionizing education through world-class learning rooted in experience and real-life application. Empowering the next generation of entrepreneurs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}

