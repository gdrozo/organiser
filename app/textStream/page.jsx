'use client'
import { useEffect, useState } from 'react'
import { fetchStream } from '@/utils/apiClient'

const LiveUpdateComponent = () => {
  const [status, setStatus] = useState('')
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchStream(
      '/api/status',
      update => setStatus(update),
      finalData => {
        setData(finalData)
        setStatus('completed')
      },
      () => setStatus('error')
    )
  }, [])

  return (
    <div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'processing' && <p>Processing...</p>}
      {status === 'error' && <p>Error fetching data.</p>}
      {status === 'completed' && <p>Data: {data}</p>}
    </div>
  )
}

export default LiveUpdateComponent
