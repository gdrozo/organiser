'use client'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import './tabs.css'

function Tabs({ children, defaultTab, onTabClick, tabState, tabStateSetter }) {
  const [state, stateSetter] = useState()

  if (tabState === undefined || tabStateSetter === undefined) {
    tabStateSetter = stateSetter
    tabState = state
  }

  useEffect(() => {
    //Get the last selected tab

    const lastSelectedTab = parseInt(localStorage.getItem('selectedTab'))
    if (lastSelectedTab) tabStateSetter(lastSelectedTab)
    else tabStateSetter(defaultTab)
  }, [])

  useEffect(() => {
    //Save the last selected tab
    if (tabState === -1) return
    localStorage.setItem('selectedTab', tabState)
  }, [tabState])

  function tabClicked(index) {
    tabStateSetter(index)
    onTabClick && onTabClick(children[index]?.props?.title)
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
                    w-full rounded-b-none rounded-t-2xl justify-around px-2
                    sm:w-auto sm:rounded-full sm:bg-white/70 sm:absolute'
        >
          <div
            className={`absolute bg-white rounded-full bottom-0 top-0 w-28 transition-all duration-300 ease-in-out shadow hidden ${
              tabState === undefined ? 'sm:hidden' : 'sm:block '
            }`}
            style={{ left: 7 * tabState + 'rem' }}
          ></div>

          {children.map((child, index) => (
            <Button
              key={index}
              onClick={() => tabClicked(index)}
              className={
                'text-black shadow-none h-auto z-10 rounded-lg flex justify-center items-center w-26 py-3 rounded-b-none' +
                ' ' +
                (tabState === index ? 'active-tab' : 'inactive-tab') +
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
              ${tabState === index ? 'block' : 'hidden'} ${
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
