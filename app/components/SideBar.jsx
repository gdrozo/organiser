'use client'
import { useState } from 'react'
import BurgerOpener from './BurgerOpener'

import './SideBar.css'
import ChatList from './ChatList'

function SideBar({ categoriesEl }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`absolute top-20 left-8 hidden z-30 bg-white rounded-4xl 
                 flex-col gap-2 lg:flex transition-all duration-300 ease-in-out 
                 ${
                   open
                     ? 'justify-start  items-start  bottom-20   p-8 open-animation'
                     : 'justify-center items-center bottom-auto py-3 px-4'
                 }`}
    >
      <BurgerOpener
        className={`${
          open ? '-ml-3 -mt-3 mb-2' : ''
        } transition-all duration-300 ease-in-out`}
        onClick={() => setOpen(!open)}
      />
      <h3
        className={`text-xl font-bold overflow-hidden  ${
          open ? 'w-auto h-auto' : 'w-0 h-0 hidden'
        }`}
      >
        Categories
      </h3>
      <div
        className={`overflow-hidden ${
          open ? 'w-auto h-auto' : 'w-0 h-0 hidden'
        }`}
      >
        {categoriesEl}
      </div>
      <h3
        className={`text-xl font-bold overflow-hidden pt-5 ${
          open ? 'w-auto h-auto' : 'w-0 h-0 hidden'
        }`}
      >
        Questions
      </h3>
      <div
        className={`overflow-hidden ${
          open ? 'w-auto h-auto' : 'w-0 h-0 hidden'
        }`}
      >
        <ChatList />
      </div>
    </div>
  )
}

export default SideBar
