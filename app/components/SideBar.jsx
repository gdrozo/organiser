'use client'
import { useState } from 'react'
import BurgerOpener from './BurgerOpener'

import './SideBar.css'
import ChatList from './ChatList'
import CategoriesList from './CategoriesList'
import { Button } from '@/components/ui/button'

function SideBar() {
  const [open, setOpen] = useState(false)
  const [toggleEdit, setToggleEdit] = useState(false)

  function toggle() {
    setOpen(!open)
  }

  return (
    <div className='side-bar'>
      <div
        className={`fixed lg:absolute lg:top-20 lg:left-8 z-40 bg-[#ebd0e3] rounded-2xl
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
        <div className='flex items-center'>
          <h3 className={`text-xl font-bold overflow-hidden p-0 inline`}>
            Questions
          </h3>
          <Button
            variant='ghost'
            className='px-2 py-1 hover:bg-transparent hover:text-black/60'
            onClick={() => setToggleEdit(!toggleEdit)}
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
              className='size-4'
            >
              <path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' />
              <path d='m15 5 4 4' />
            </svg>
          </Button>
        </div>
        <div className={`overflow-hidden`}>
          <ChatList onClick={toggle} toggleEdit={toggleEdit} />
        </div>
      </div>
    </div>
  )
}

export default SideBar
