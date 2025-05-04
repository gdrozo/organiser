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
    <div className='grow flex flex-col m-4 max-w-[97vw] max-h-full'>
      <div
        className='flex justify-center absolute sm:top-6  left-0 right-0
                   bottom-0 sm:bottom-auto
      '
      >
        <div
          className='flex relative tabs tabs-container bg-white drop-shadow-lg 
                    w-full rounded-b-none rounded-t-2xl justify-between px-2
                    sm:w-auto sm:rounded-full '
        >
          {/*  

          <div
            className='absolute bg-white/80 rounded-t-lg bottom-0 top-0 w-28 transition-all duration-300 ease-in-out'
            style={{ left: 7 * selectedTab + 'rem' }}
          >
            <div
              className={
                'absolute bottom-0 -right-3 bg-transparent' +
                ' ' +
                (selectedTab === children.length - 1 ? '' : '')
              }
            >
              <img
                src='border.svg'
                className='size-3 mr-px mt-px fill-white/80 opacity-80'
                alt='SVG Image'
              />
            </div>
            <div
              className={
                'absolute bottom-0 -left-3 bg-transparent transition-all duration-300 ease-in-out' +
                ' ' +
                (selectedTab === 0 ? 'opacity-0' : '')
              }
            >
              <img
                src='border.svg'
                className='size-3 mr-px mt-px fill-white/80 opacity-80 flip -scale-x-100'
                alt='SVG Image'
              />
            </div>
          </div>
        */}

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
            className={`w-full z-20 bg-white/80s bg-transparent text-black rounded-xl h-[calc(100%-2.5rem)] min-h-[calc(100%-2.5rem)] max-h-[calc(100%-2.5rem)] flex 
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
