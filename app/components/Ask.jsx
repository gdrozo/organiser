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
    <div className=' w-full h-full flex justify-center items-end'>
      <div className='max-w-2xl m-4 w-[min(var(--container-2xl),100%)] gap-2 flex flex-col items-center mb-40'>
        {messages.map(message => (
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

        <form onSubmit={handleSubmit} className='w-full pt-5 flex gap-2'>
          <Input name='prompt' value={input} onChange={handleInputChange} />
          <Button className='px-8' type='submit'>
            Ask
          </Button>
        </form>
      </div>
    </div>
  )
}
