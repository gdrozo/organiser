'use client'
import { useRef, useState } from 'react'
import BurgerOpener from './BurgerOpener'

import './SideBar.css'
import ChatList from './ChatList'
import CategoriesList from './CategoriesList'

function SideBar() {
  const [open, setOpen] = useState(false)

  function toggle() {
    setOpen(!open)
  }

  return (
    <div className='side-bar'>
      <div
        className={`fixed lg:absolute lg:top-20 lg:left-8 z-40 bg-white rounded-2xl
                 flex flex-col ease-in-out justify-start items-start close-animation 
                 ${
                   open
                     ? 'top-0 left-0 lg:large-open-animation small-open-animation'
                     : 'top-5 left-7 p-3 '
                 }`}
      >
        <BurgerOpener
          className={`${open ? 'move-burger-open -ml-3 -mt-3 mb-2' : ''}   `}
          onClick={toggle}
          checked={open}
        />
        <h3
          className={`text-xl font-bold overflow-hidden {
            open ? '' : ''
          }`}
        >
          Categories
        </h3>
        <div className={`overflow-hidden`}>
          <CategoriesList />
        </div>
        <h3
          className={`text-xl font-bold overflow-hidden ${
            open ? 'pt-5' : 'p-0'
          }`}
        >
          Questions
        </h3>
        <div className={`overflow-hidden`}>
          <ChatList onClick={toggle} />
        </div>
      </div>
    </div>
  )
}

export default SideBar
