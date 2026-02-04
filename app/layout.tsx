import React from "react"
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const openSans = Open_Sans({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'ISM Admissions - Portail de Candidature',
  description: 'Plateforme de digitalisation des admissions de l\'Institut Supérieur de Management (ISM)',
  generator: 'ISM',
  icons: {
    icon: '/ism-logo.jpg',
    apple: '/ism-logo.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${openSans.variable} font-sans antialiased bg-background text-foreground`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
