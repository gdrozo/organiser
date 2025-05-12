'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChat } from '@ai-sdk/react'
import { useEffect, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import ACTextArea from './ACTextArea'

import './TextClasifier.css'
import { getCacheCategories } from './CategoriesList'

const options = {
  keys: ['name'], // Fields to search in the data
  threshold: 0.2, // Adjust this for more or less strict matches (0.0 = exact, 1.0 = very broad)
}

const API = '/api/ai/classify'

export default function TextInput() {
  const [categories, setCategories] = useState([])

  const formRef = useRef()

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/ai/classify', // Points to the updated server-side chat handler
  })

  const [submitted, setSubmitted] = useState(false)

  const [categoriesState, setCategoriesState] = useState(categories)

  const [category, setCategory] = useState('')

  const [fuse, setFuse] = useState(new Fuse(categoriesState, options))
  const [results, setResults] = useState([])

  const submitRef = useRef()

  useEffect(() => {
    document.getElementById('prompt').focus()
    searchCategory({ target: { value: category } })
  }, [])

  useEffect(() => {
    if (messages.length >= 2) {
      if (status !== 'ready') return
      setCategory(messages[1].content)
      setSubmitted(true)
    }
    return () => {}
  }, [messages, status])

  function interceptInputChange(event) {
    if (event.target.value === '') {
      submitRef.current.disabled = true
    } else {
      submitRef.current.disabled = false
    }
    handleInputChange(event)
  }

  function interceptSubmit(event) {
    event.preventDefault()
    handleSubmit(event)
    setSubmitted(true)
    const categories = getCacheCategories()
    setCategories(categories)
  }

  function searchCategory(event) {
    const query = event.target.value

    setCategory(query)

    if (!query) return setResults(categories) // Return all data if the query is empty

    const results = fuse.search(query)

    setResults(results || [])

    //return results.map(result => result.item)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && !event.shiftKey) {
      event.preventDefault()
      setResults([])
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      setResults([])
    }
  }

  function onClickCategory(category) {
    debugger
    setCategory(category)
    setResults([])
  }

  async function done() {
    // Send category to server

    await fetch('/api/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, text: messages[0].content }),
    })
    setSubmitted(false)
  }

  function handlePointerDown(event) {
    if (!formRef.current) return

    formRef.current.classList.remove('text-animation')
  }

  function handleBlur(event) {
    if (!formRef.current) return

    if (event.target.value !== '') return

    formRef.current.classList.add('text-animation')
  }

  return (
    <div className='grow flex'>
      {/* Show loading spinner or disable input */}
      {status === 'streaming' && <div>Loading...</div>}

      <div className='relative grow flex justify-center'>
        {/* User input form */}
        <form
          onSubmit={interceptSubmit}
          ref={formRef}
          className='flex flex-col gap-4 grow | text-animation'
        >
          <ACTextArea
            className='border-none rounded-md p-2 bg-transparent shadow-none text-base grow focus-visible:shadow-none focus-visible:border-none 
            focus-visible:ring-none '
            name='prompt' // Required for useChat
            value={input}
            onChange={interceptInputChange}
            onPointerDown={handlePointerDown}
            onBlur={handleBlur}
            disabled={status !== 'ready'}
            id='prompt'
          />
          <Button
            ref={submitRef}
            type='submit'
            className='py-2 px-4 rounded-md cursor-pointer h-9 max-h-9'
            disabled={true}
          >
            Classify
          </Button>
          {/* Text Animation */}
        </form>

        {submitted && (
          <div className='fixed top-0 left-0 right-0 bottom-0 backdrop-blur-xs rounded-lg flex flex-col items-center justify-center p-30 gap-2'>
            {status !== 'ready' && (
              <div className='grow flex items-center justify-center'>
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
                  className='lucide lucide-loader-circle-icon lucide-loader-circle animate-spin size-12'
                >
                  <path d='M21 12a9 9 0 1 1-6.219-8.56' />
                </svg>
              </div>
            )}

            {status === 'ready' && (
              <div className='max-w-md flex flex-col gap-2'>
                <div className='relative max-w-md flex justify-center items-center'>
                  <Input
                    placeholder='Enter your own category'
                    value={category}
                    onChange={searchCategory}
                    className='z-10 relative bg-white text-base'
                    onKeyDown={handleKeyDown}
                  />
                  <div className='absolute bg-white top-full right-0 left-0 -mt-1 pt-1 z-0 border rounded-b-md'>
                    {results?.map(result =>
                      result && result.item ? (
                        <div
                          key={result.item}
                          className='px-2 hover:bg-gray-200 cursor-pointer text-base'
                          onClick={() => onClickCategory(result.item)}
                        >
                          {result.item} caca
                        </div>
                      ) : !result.name ? (
                        <div
                          key={result}
                          className='px-2 hover:bg-gray-200 cursor-pointer text-base'
                          onClick={() => onClickCategory(result)}
                        >
                          {result} tt
                        </div>
                      ) : (
                        <div
                          key={result}
                          className='px-2 hover:bg-gray-200 cursor-pointer text-base'
                          onClick={() => onClickCategory(result.name)}
                        >
                          {result} zaza
                        </div>
                      )
                    )}
                  </div>
                </div>

                <Button className='max-w-md w-full' onClick={done}>
                  Done
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
