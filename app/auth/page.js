'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [fileName, setFileName] = useState('')
  const [content, setContent] = useState('')

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
    <div style={{ padding: '20px' }}>
      <h1>Google Drive Editor</h1>
      <Button onClick={handleAuth}>Authorize Google Drive</Button>
    </div>
  )
}
