'use client'
import { SignIn } from '@clerk/nextjs'
import { useState } from 'react'

function page() {
  const [state, setState] = useState('')

  return (
    <div className='h-dvh w-screen overflow-hidden | bg-gradient-primary'>
      <div
        className={
          'h-screen w-screen flex  transition-all duration-500 ease-in-out' +
          ' ' +
          state
        }
      >
        <div className='h-screen w-screen min-h-screen min-w-screen flex flex-col justify-center items-center'>
          <h1 className='text-4xl font-bold text-blue-950'>
            Login to use the app
          </h1>
          <button
            onClick={() => setState('ml-[calc(100vw*-1)]')}
            className='px-12 py-3 rounded-2xl font-extrabold m-5 bg-black text-white cursor-pointer'
          >
            Sign in
          </button>
        </div>
        <div className='h-screen w-screen min-h-screen min-w-screen flex flex-col justify-center items-center'>
          <SignIn />
        </div>
      </div>
    </div>
  )
}

export default page
