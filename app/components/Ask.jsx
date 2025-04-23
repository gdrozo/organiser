'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChat } from '@ai-sdk/react'
import './Ask.css'

export default function Ask() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/ask',
  })

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <header className='flex justify-center'>
        <div className='container mx-auto'>
          <h1 className='text-2xl font-bold text-center pt-4'>Ask the AI</h1>
          <p className='text-center pb-4s px-6 pt-1'>
            Ask the AI anything you want about your files.
          </p>
        </div>
      </header>
      {messages?.length > 0 && (
        <div className='max-w-2xl m-4 w-[min(var(--container-2xl),100%)] gap-2 flex flex-col items-center grow smb-40'>
          {messages?.map(message => (
            <div
              key={message.id}
              className={
                'max-w-md' +
                ' ' +
                (message.role === 'user' ? 'user-message' : 'ai-message')
              }
            >
              {message.content}
            </div>
          ))}
        </div>
      )}
      <div className='max-w-2xl m-4 w-[min(var(--container-2xl),100%)] gap-2 flex flex-col items-center smb-40'>
        <form
          onSubmit={handleSubmit}
          className='w-full pt-5s flex justify-center px-6 gap-2'
        >
          <Input
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
