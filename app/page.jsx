import { GetCategories } from '@/logic/Categories'
import TextInput from './components/TextClasifier'
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import { SignedIn } from '@clerk/nextjs'

import Tabs, { Tab } from './components/Tabs'
import Ask from './components/Ask'
import Categories from './components/Categories'
import Image from 'next/image'
import BurgerOpener from './components/BurgerOpener'
import SideBar from './components/SideBar'
import ChatList from './components/ChatList'

export default async function Home() {
  const start = performance.now()

  console.log('------------------------------------------------')
  console.log('Start time')

  //redirect('/auth')

  const end = performance.now()

  console.log(`Total time: ${(end - start) / 1000} seconds`)
  console.log('------------------------------------------------')

  const categoriesEl = <Categories />
  const chatsEl = <ChatList />

  return (
    <div
      id='container'
      className='h-dvh w-dvw overflow-hidden relative flex flex-col bg-transparent transition-all duration-300 ease-in-out'
    >
      {/* Header */}
      <div className='w-screen flex justify-center items-center h-20 min-h-20'>
        <header className='flex justify-between items-center py-2 px-4 grow bg-white/70s bg-transparent m-4 rounded-xl'>
          <div className='flex items-center'>
            <Image src='/icon.png' width={40} height={40} alt='Organizer' />
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

      <div className='flex justify-evenly items-stretch h-[calc(100%-5rem)] min-h-[calc(100%-5rem)] max-h-[calc(100%-5rem)] '>
        {/* */}
        {/* Left sidebar
         */}
        <SideBar categoriesEl={categoriesEl} />

        {/* tabs */}
        <Tabs defaultTab={0}>
          <Tab title='Write'>
            <div className='bg-transparent rounded-xl grow px-10 py-4 flex flex-col max-h-full overflow-hidden mb-14'>
              <header className='flex justify-center'>
                <div className='container mx-auto'>
                  <h1 className='text-2xl font-bold text-center sm:pt-4'>
                    Text Classification
                  </h1>
                  <p className='text-center pb-4 pt-1 text-black/70'>
                    Input your text and have it categorize by the AI.
                  </p>
                </div>
              </header>
              <main className=' flex grow shrink justify-center'>
                <div className='max-w-3xl grow flex'>
                  <TextInput />
                </div>
              </main>
            </div>
          </Tab>
          <Tab title='Ask'>
            <Ask />
          </Tab>
          <Tab title='Categories' className='block lg:hidden'>
            <div className='flex flex-col h-full pl-6'>
              <h3 className={`text-xl font-bold`}>Categories</h3>
              <div className={`overflow-hidden`}>{categoriesEl}</div>
              <h3 className={`text-xl font-bold overflow-hidden pt-5 `}>
                Questions
              </h3>
              <div className={`overflow-hidden `}>{chatsEl}</div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}
