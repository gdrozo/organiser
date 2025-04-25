'use client'

import { Button } from '@/components/ui/button'
import { useChat } from '@ai-sdk/react'
import './Ask.css'
import AutoCenterInput from './AutoCenterInput'

export default function Ask() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/ask',
  })

  return (
    <div className='w-full h-full min-h-full max-h-full flex flex-col justify-center items-center'>
      <div
        className={`shrink max-h-[calc(100%-2.25rem)] flex flex-col justify-center items-center ${
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
        </div>
      </div>

      <div className=' max-w-2xl m-4 w-[min(var(--container-2xl),100%)] gap-2 flex flex-col items-center smb-40 h-9 max-h-9 min-h-9'>
        <form
          onSubmit={handleSubmit}
          className='w-full pt-5s flex justify-center px-6 gap-2'
        >
          <AutoCenterInput
            name='prompt'
            value={input}
            onChange={handleInputChange}
            className='max-w-md'
          />
          <Button className='px-8' type='submit'>
            Ask
          </Button>
        </form>
      </div>
    </div>
  )
}
