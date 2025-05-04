import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Text Classification App',
  description: 'Classify text and store in Google Docs',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <head>
          {/* Add this link tag */}
          <link rel='icon' href='/favicon.png' type='image/png' sizes='32x32' />
        </head>
        <body className={`${inter.className} bg-gradient-primary`}>
          <div
            id='h-container'
            className='h-dvh w-dvw overflow-hidden bg-pattern-primary'
          >
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
