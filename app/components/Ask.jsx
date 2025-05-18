'use client'

import { Button } from '@/components/ui/button'
import './Ask.css'
import AutoCenterInput from './AutoCenterInput'
import { useEffect, useState } from 'react'
import { fetchStream } from '@/utils/apiClient'
import { onChatClick } from './ChatList'
import { toast } from 'sonner'

const API = '/api/ai/ask'

const listeners = []
export function onChatCreated(listenerParam) {
  listeners.push(listenerParam)
}

export default function Ask({ def_messages }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('waiting for server')
  const [response, setResponse] = useState()
  const [chatId, setChatId] = useState()

  useEffect(() => {
    onChatClick(chat => {
      setMessages(chat.messages)
      setChatId(chat.id)
      setInput('')
      setStatus()
    })
  }, [])

  useEffect(() => {
    if (!response) return
    setMessages([...messages, { ...response, id: `${messages.length + 1}` }])
  }, [response])

  const handleInputChange = async event => {
    setInput(event.target.value)
  }

  async function processIncomingMessage(message) {
    const STATUS = 'status:'

    if (message.startsWith(STATUS)) {
      const status = message.replace(STATUS, '')
      setTimeout(() => {
        setStatus(status)
      }, 500)
    }
  }

  function setFinalData(result) {
    const RESPONSE = 'response:'

    const response = result.replace(RESPONSE, '')

    setResponse({
      role: 'assistant',
      content: response,
    })
    setStatus()
  }

  const handleSubmit = async () => {
    if (!input || input.trim() === '') return

    const updatedMessages = [...messages]
    updatedMessages.push({
      role: 'user',
      content: input,
      id: `${messages.length + 1}`,
    })

    // Notify listeners that a new chat has been created
    listeners.forEach(listener => listener(updatedMessages[0]))

    setMessages(updatedMessages)

    const body = {
      messages: updatedMessages,
    }

    if (chatId) body.id = chatId

    fetchStream(
      API,
      body,
      update => processIncomingMessage(update),
      finalData => setFinalData(finalData),
      error => setStatus('error: ' + error)
    )

    setInput('')
  }

  function copyMessage(message) {
    navigator.clipboard.writeText(message)
    toast('Message copied to clipboard')
  }

  function closeChat() {
    setMessages([])
    setInput('')
    setStatus()
    setChatId()
  }

  return (
    <div
      className={`w-full flex flex-col justify-center items-center absolute bottom-14 top-14 mt-6 ${
        messages?.length > 0 ? 'grow-animation' : ''
      }`}
    >
      <div className={`flex flex-col items-center`}>
        <header className='flex justify-center'>
          <div className='container mx-auto'>
            <h1 className='text-2xl font-bold text-center pt-4sd'>
              Ask the AI
            </h1>
            <p className='text-center pb-4s px-6 pt-1'>
              Ask the AI anything you want about your files.
            </p>
          </div>
        </header>
        {messages?.length > 0 && (
          <div className='max-w-2xl w-[min(var(--container-2xl),90%)] gap-4 flex flex-col items-center  smb-40 grow '>
            {messages?.map(message => (
              <div
                id='hello'
                key={message.id}
                className={`${
                  message.role === 'user' ? 'user-message' : 'ai-message'
                }`}
              >
                <div
                  className={`max-w-md text-sm text-black rounded-md px-4 py-3 cursor-pointer relative`}
                >
                  <Button
                    onClick={() => copyMessage(message.content)}
                    className='message-options hidden absolute top-1 m-0 py-2 px-2.5  rounded-full text-black hover:opacity-60'
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
                      className=''
                    >
                      <rect width='14' height='14' x='8' y='8' rx='2' ry='2' />
                      <path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
                    </svg>
                  </Button>
                  {message.content}
                </div>
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
            <div className='py-6'></div>
          </div>
        )}
      </div>

      <div className=' max-w-2xl pt-4 w-[min(var(--container-2xl),100%)] gap-2 flex flex-col items-center min-h-9 '>
        <div className='w-fulls pt-5s flex justify-center px-4 py-2 gap-2 bg-white rounded-full shadow-lg relative'>
          <AutoCenterInput
            name='prompt'
            value={input}
            onChange={handleInputChange}
            className='max-w-mds border-none shadow-none w-[min(20rem,70vw)]'
          />
          <Button
            className=' rounded-full h-9 w-9 flex items-center justify-center p-0'
            type='submit'
            onClick={handleSubmit}
          >
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='size-5'
            >
              <path d='m5 12 7-7 7 7' />
              <path d='M12 19V5' />
            </svg>
          </Button>

          <Button
            className={`rounded-full size-9 text-white absolute bottom-full right-4 mb-1 ${
              messages?.length > 0 ? '' : 'hidden'
            }`}
            onClick={closeChat}
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
              className='size-5'
            >
              <path d='M5 12h14' />
              <path d='M12 5v14' />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
