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

  const handleSubmit = async e => {
    e.preventDefault()

    const response = await fetch('/api/googleDrive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, content }),
    })

    const result = await response.json()
    if (response.ok) {
      alert(`File successfully updated. File ID: ${result.fileId}`)
    } else {
      alert(`Error: ${result.error}`)
    }
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
      {!isAuthorized ? (
        <Button onClick={handleAuth}>Authorize Google Drive</Button>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>File Name:</label>
            <input
              type='text'
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Content:</label>
            <textarea
              rows='5'
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
          </div>
          <button type='submit'>Update File</button>
        </form>
      )}
    </div>
  )
}
