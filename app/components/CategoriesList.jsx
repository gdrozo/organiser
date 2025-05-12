'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function getCacheCategories() {
  return window.categories
}

export default function CategoriesList() {
  const [fetchState, setFetchState] = useState('loading')
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      try {
        const serverResponse = await fetch('/api/categories')

        if (!serverResponse.ok) {
          debugger
          setFetchState(serverResponse.statusText)
          if (serverResponse.status === 401) router.push('/auth')
          return
        }

        const data = await serverResponse.json()
        if (window) window.categories = data
        setFetchState(data)
      } catch (error) {
        console.error(error)
        setFetchState(error.message)
      }
    })()
  }, [])

  return (
    <>
      {fetchState !== 'loading' && !Array.isArray(fetchState) && (
        <div>Error: {fetchState}</div>
      )}
      {fetchState === 'loading' && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='m-4 ml-8 animate-spin'
        >
          <path d='M21 12a9 9 0 1 1-6.219-8.56' />
        </svg>
      )}
      {Array.isArray(fetchState) &&
        fetchState?.map(category => (
          <Button
            key={category}
            className='gap-1 text-gray-800 ml-0 pl-0 hover:text-gray-600 cursor-pointer text-base flex items-center bg-transparent hover:bg-transparent shadow-none'
          >
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
              className='size-4'
            >
              <rect width='8' height='18' x='3' y='3' rx='1' />
              <path d='M7 3v18' />
              <path d='M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z' />
            </svg>
            <div className=''>{category}</div>
          </Button>
        ))}
    </>
  )
}
