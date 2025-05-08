'use client'
import { useEffect, useState } from 'react'
import Ask from './Ask'
import Tabs, { Tab } from './Tabs'
import TextInput from './TextClasifier'
import { onChatClick } from './ChatList'

function TabComponent() {
  const [tab, setTab] = useState(0)

  useEffect(() => {
    onChatClick(chat => {
      setTab(1)
    })
  }, [])

  return (
    <Tabs defaultTab={0} tabState={tab} tabStateSetter={setTab}>
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
    </Tabs>
  )
}

export default TabComponent
