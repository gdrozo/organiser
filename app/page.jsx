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

export default async function Home() {
  const start = performance.now()

  console.log('------------------------------------------------')
  console.log('Start time')

  //redirect('/auth')

  const end = performance.now()

  console.log(`Total time: ${(end - start) / 1000} seconds`)
  console.log('------------------------------------------------')

  const categoriesEl = <Categories />

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
        <div className=' w-60 absolutes top-0 left-0 h-full hidden lg:block'>
          <h3 className='p-8 pb-2 text-xl font-bold'>Files</h3>
          {categoriesEl}
        </div>
          */}

        {/* tabs */}
        <Tabs defaultTab={0}>
          <Tab title='Write'>
            <div className='bg-transparent rounded-xl grow px-10 py-4 flex flex-col max-h-full overflow-hidden'>
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
            <>{categoriesEl}</>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}
