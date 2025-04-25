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
        <body className={inter.className + ''}>
          <div
            id='h-container'
            className='h-dvh w-dvw overflow-hidden bg-gradient-primary'
          >
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
