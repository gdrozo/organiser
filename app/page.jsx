import { GetCategories } from '@/logic/Categories'
import TextInput from './components/TextInput'
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import { SignedIn } from '@clerk/nextjs'

import Tabs, { Tab } from './components/Tabs'
import Ask from './components/Ask'

export default async function Home() {
  let categories = undefined

  try {
    categories = await GetCategories()
  } catch (e) {}

  return (
    <div className='h-screen w-screen relative flex flex-col bg-gradient-to-br from-[#F4EFFA] to-[#ecd3e3]'>
      <div className='w-screen flex justify-center items-center'>
        <header className='flex justify-between items-center py-2 px-4 grow bg-white m-4 rounded-xl'>
          <h1 className='text-3xl font-bold'>Organizer</h1>
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
      </div>
      <div className='flex justify-evenly items-stretch grow'>
        <div className=' w-60 absolutes top-0 left-0 h-full'>
          <h3 className='p-8 pb-2 text-xl font-bold'>Files</h3>
          {categories.map(category => (
            <div
              key={category}
              className='m-4 ml-0 pl-8 hover:text-gray-600 cursor-pointer text-base flex items-center'
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
                className='lucide lucide-library-big-icon lucide-library-big size-4 '
              >
                <rect width='8' height='18' x='3' y='3' rx='1' />
                <path d='M7 3v18' />
                <path d='M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z' />
              </svg>
              <div className=''>{category}</div>
            </div>
          ))}
        </div>
        <div className='grow flex flex-col m-4 '>
          {/* tabs */}
          <Tabs defaultTab={0}>
            <Tab title='Write'>
              <div className='bg-white rounded-xl grow p-10'>
                <header className='flex justify-center'>
                  <div className='container mx-auto'>
                    <h1 className='text-2xl font-bold text-center py-4'>
                      Text Classification
                    </h1>
                  </div>
                </header>
                <main className='flex flex-col justify-center items-center'>
                  <div className='w-screen max-w-3xl'>
                    <TextInput categories={categories} />
                  </div>
                </main>
              </div>
            </Tab>
            <Tab title='Ask'>
              <Ask />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
