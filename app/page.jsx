import {
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import { SignedIn } from '@clerk/nextjs'
import Image from 'next/image'
import SideBar from './components/SideBar'
import TabComponent from './components/TabComponent'

export default async function Home() {
  return (
    <div
      id='container'
      className='h-dvh w-dvw overflow-hidden relative flex flex-col bg-transparent transition-all duration-300 ease-in-out'
    >
      {/* Header */}
      <div className='w-screen flex justify-center items-center h-20 min-h-20'>
        <header className='flex justify-between items-center py-2 px-4 grow bg-white/70s bg-transparent m-4 rounded-xl'>
          <div className='flex items-center'>
            <Image
              src='/icon.png'
              width={40}
              height={40}
              alt='Organizer'
              className='pr-1'
            />
            <Image
              src='/text_logo.png'
              width={150}
              height={35}
              alt='Organizer'
            />
          </div>
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
      </div>

      <div className='flex justify-center items-stretch h-[calc(100%-5rem)] min-h-[calc(100%-5rem)] max-h-[calc(100%-5rem)] '>
        {/* */}
        {/* Left sidebar
         */}
        <SideBar />

        {/* tabs */}
        <TabComponent />
      </div>
    </div>
  )
}
