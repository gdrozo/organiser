'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [isAuthorized, setIsAuthorized] = useState(false)

  const handleAuth = async () => {
    const response = await fetch('/api/auth/url')
    const { authUrl } = await response.json()
    window.location.href = authUrl // Redirect the user to Google's authorization page
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
      <h1 className='text-4xl font-bold text-blue-950'>
        Connect Your Google Drive Account
      </h1>
      <button
        className='px-12 py-3 rounded-2xl font-extrabold m-5 bg-black text-white cursor-pointer'
        onClick={handleAuth}
      >
        Authorize Google Drive
      </button>
    </div>
  )
}
