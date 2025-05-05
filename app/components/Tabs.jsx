'use client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import './tabs.css'

function Tabs({ children, defaultTab }) {
  const [selectedTab, setSelectedTab] = useState(defaultTab)

  function tabClicked(index) {
    setSelectedTab(index)
  }

  return (
    <div className='grow flex flex-col max-w-[97vw] max-h-full'>
      <div
        className='flex justify-center absolute sm:top-6  left-0 right-0
                   bottom-0 sm:bottom-auto z-30
      '
      >
        <div
          className='flex relative tabs tabs-container bg-white drop-shadow-lg 
                    w-full rounded-b-none rounded-t-2xl justify-between px-2
                    sm:w-auto sm:rounded-full sm:bg-white/70'
        >
          <div
            className='absolute bg-white rounded-full bottom-0 top-0 w-28 transition-all duration-300 ease-in-out shadow hidden sm:block '
            style={{ left: 7 * selectedTab + 'rem' }}
          ></div>

          {children.map((child, index) => (
            <Button
              key={index}
              onClick={() => tabClicked(index)}
              className={
                'text-black shadow-none h-auto z-10 rounded-lg flex justify-center items-center w-26 py-4 rounded-b-none' +
                ' ' +
                (selectedTab === index ? 'active-tab' : 'inactive-tab') +
                ' ' +
                child.props?.className
              }
            >
              {child?.props?.title}
              {!child.props && child}
            </Button>
          ))}
        </div>
      </div>
      {children &&
        children.length &&
        children.length > 0 &&
        children.map &&
        children.map((c, index) => (
          <div
            className={`w-full z-20 bg-transparent text-black rounded-xl h-full flex 
              ${selectedTab === index ? 'block' : 'hidden'} ${
              index === 0 ? 'unround' : ''
            }`}
            key={index}
          >
            {c}
          </div>
        ))}
    </div>
  )
}

export default Tabs

export function Tab({ children, title }) {
  return (
    <>
      {children &&
        children.length &&
        children.length > 0 &&
        children.map &&
        children.map((child, index) => <div key={index}>{child}</div>)}
      {children && !children.length && <>{children}</>}
    </>
  )
}
