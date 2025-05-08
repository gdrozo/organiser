'use client'
import { useState } from 'react'
import BurgerOpener from './BurgerOpener'

import './SideBar.css'
import ChatList from './ChatList'

function SideBar({ categoriesEl }) {
  const [open, setOpen] = useState(false)

  function handleChatClick(chat) {
    setOpen(false)
  }

  return (
    <div
      className={`fixed lg:absolute lg:top-20 lg:left-8 z-40 bg-white rounded-4xl 
                 flex flex-col gap-2 transition-all duration-300 ease-in-out 
                 ${
                   open
                     ? 'justify-start  items-start  top-0 left-0 p-8 lg:large-open-animation small-open-animation'
                     : 'justify-center items-center top-5 left-7 h-10 w-10 '
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
        <ChatList onClick={handleChatClick} />
      </div>
    </div>
  )
}

export default SideBar
