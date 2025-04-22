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
          <div className='absolute bg-white rounded-lg -bottom-10 top-1/2 left-0 right-0'></div>
          {children.map((child, index) => (
            <Button
              key={index}
              onClick={() => tabClicked(index)}
              className={
                'text-black shadow-none h-auto z-10 px-7 rounded-lg flex justify-center items-center ' +
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
