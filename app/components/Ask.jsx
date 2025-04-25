'use client'

import { Button } from '@/components/ui/button'
import './Ask.css'
import AutoCenterInput from './AutoCenterInput'
import { useEffect, useState } from 'react'
import { fetchStream } from '@/utils/apiClient'

const API = '/api/ask'

export default function Ask() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('waiting for server')
  const [response, setResponse] = useState()

  useEffect(() => {
    if (!response) return
    setMessages([...messages, { ...response, id: `${messages.length + 1}` }])
  }, [response])

  const handleInputChange = async event => {
    setInput(event.target.value)
  }

  async function processIncomingMessage(message) {
    console.log('message:', message)

    const STATUS = 'status:'
    const RESPONSE = 'response:'

    if (message.startsWith(STATUS)) {
      const status = message.replace(STATUS, '')
      setTimeout(() => {
        setStatus(status)
      }, 500)
    } else if (message.startsWith(RESPONSE)) {
      const response = message.replace(RESPONSE, '')

      setResponse({
        role: 'assistant',
        content: response,
      })
      console.log('response:', response)
      setStatus()
    }
  }

  const handleSubmit = async () => {
    const updatedMessages = [...messages]
    updatedMessages.push({
      role: 'user',
      content: input,
      id: `${messages.length + 1}`,
    })

    setMessages(updatedMessages)
    fetchStream(
      API,
      { messages: updatedMessages },
      update => processIncomingMessage(update),
      finalData => processIncomingMessage(finalData),
      () => setStatus('error')
    )

    setInput('')
  }

  return (
    <div className='w-full h-full min-h-full max-h-full flex flex-col justify-center items-center'>
      <div
        className={`shrink max-h-[calc(100%-2.25rem)] flex flex-col items-center ${
          messages?.length > 0 ? 'grow-animation' : ''
        }`}
      >
        <header className='flex justify-center min-h-30 h-30 max-h-30 xsm:min-h-24'>
          <div className='container mx-auto'>
            <h1 className='text-2xl font-bold text-center pt-4'>Ask the AI</h1>
            <p className='text-center pb-4s px-6 pt-1'>
              Ask the AI anything you want about your files.
            </p>
          </div>
        </header>
        <div className='max-w-2xl w-[min(var(--container-2xl),90%)] gap-4 flex flex-col items-center  smb-40 grow '>
          {messages?.map(message => (
            <div
              key={message.id}
              className={
                'max-w-md text-sm' +
                ' ' +
                (message.role === 'user' ? 'user-message' : 'ai-message')
              }
            >
              {message.content}
            </div>
          ))}
          {status && messages.length > 0 && (
            <div className='self-start flex items-center justify-center text-black/70 text-sm info-animation'>
              {status}
              <div className='pt-0.5 pl-1'>
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
                  className='size-4 animate-spin'
                >
                  <path d='M21 12a9 9 0 1 1-6.219-8.56' />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className=' max-w-2xl m-4 w-[min(var(--container-2xl),100%)] gap-2 flex flex-col items-center smb-40 h-9 max-h-9 min-h-9'>
        <div className='w-full pt-5s flex justify-center px-6 gap-2'>
          <AutoCenterInput
            name='prompt'
            value={input}
            onChange={handleInputChange}
            className='max-w-md'
          />
          <Button className='px-8' type='submit' onClick={handleSubmit}>
            Ask
          </Button>
        </div>
      </div>
    </div>
  )
}
