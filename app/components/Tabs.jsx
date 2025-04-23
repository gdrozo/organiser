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
    <>
      <div className='h-10 flex justify-start '>
        <div className='flex relative tabs tabs-container'>
          <div
            className='absolute bg-white rounded-t-lg -bottom-3 top-0 w-28 transition-all duration-300 ease-in-out'
            style={{ left: 7 * selectedTab + 'rem' }}
          >
            <div
              className={
                'absolute rounded-bl-[0.6rem] bottom-3 -right-4 h-4 w-4 bg-transparent' +
                ' ' +
                (selectedTab === children.length - 1
                  ? ''
                  : 'shadow-[-3px_3px_0px_3px_white]')
              }
            ></div>
            <div
              className={
                'absolute rounded-br-[0.6rem]  bottom-3 -left-4 h-4 w-4 bg-transparent transition-all duration-300 ease-in-out' +
                ' ' +
                (selectedTab === 0 ? '' : 'shadow-[3px_3px_0px_3px_white]')
              }
            ></div>
          </div>

          {children.map((child, index) => (
            <Button
              key={index}
              onClick={() => tabClicked(index)}
              className={
                'text-black shadow-none h-auto z-10 rounded-lg flex justify-center items-center w-28 rounded-b-none' +
                ' ' +
                (selectedTab === index ? 'active-tab' : 'inactive-tab') +
                ' ' +
                child.props.className
              }
            >
              {child.props.title}
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
            className={
              'w-full z-20 bg-white text-black h-full rounded-xl' +
              ' ' +
              (selectedTab === index ? 'block' : 'hidden')
            }
            key={index}
          >
            {c}
          </div>
        ))}
    </>
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
      {children && !children.length && children}
    </>
  )
}
