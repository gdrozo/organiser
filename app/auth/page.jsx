'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth = async () => {
    setIsLoading(true)
    fetch('/api/auth/url').then(async response => {
      debugger
      console.log('response', response)
      if (!response.ok) {
        setIsLoading(false)
        return
      }
      const { authUrl, REDIRECT_URI } = await response.json()
      alert(REDIRECT_URI)
      window.location.href = authUrl // Redirect the user to Google's authorization page
    })
  }

  useEffect(() => {
    // Check authorization status from query params or server
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('authorized') === 'true') {
      setIsAuthorized(true)
    }
  }, [])

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center | bg-gradient-primary'>
      <h1 className='text-4xl font-bold text-blue-950 text-center px-4'>
        Connect Your Google Drive Account
      </h1>
      <button
        className='px-12 py-3 rounded-2xl font-extrabold m-5 bg-black text-white cursor-pointer flex justify-center'
        onClick={handleAuth}
      >
        {isLoading ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='animate-spin size-6'
          >
            <path d='M21 12a9 9 0 1 1-6.219-8.56' />
          </svg>
        ) : (
          'Authorize Google Drive'
        )}
      </button>
    </div>
  )
}
