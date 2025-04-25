'use client'
import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState } from 'react'

const AutoCenterInput = ({ className = '', ...props }) => {
  const inputRef = useRef(null)
  const [kh, setKh] = useState('')
  const [st, setSt] = useState('')
  const [resized, setResized] = useState('')
  const [ogHeight, setOgHeight] = useState(0)

  useEffect(() => {
    setOgHeight(window.visualViewport.height)
    setKh('Original height: ' + window.visualViewport.height)

    const onResize = () => {}

    window.addEventListener('resize', onResize)

    return window.removeEventListener('resize', onResize)
  }, [])

  const onFocusIn = () => {
    setTimeout(() => {
      setSt(st + '\nDelta: ' + window.visualViewport.height)

      const height = window.visualViewport.height
      //const height = '400'

      const container = document.getElementById('container')
      container.style.height = `${height}px`
      container.style.minHeight = `${height}px`
      container.style.maxHeight = `${height}px`

      setResized(resized + '\nRes: ' + container.style.maxHeight)
    }, 250)
  }

  const onFocusOut = () => {
    const container = document.getElementById('container')
    container.style.height = `${ogHeight}px`
    container.style.minHeight = `${ogHeight}px`
    container.style.maxHeight = `${ogHeight}px`

    setKh('Restored: ' + ogHeight)
  }

  return (
    <>
      <div className='fixed top-0 bg-white p-4 hidden'>
        <div>{st}</div>
        <div>{kh}</div>
        <div>{resized}</div>
      </div>
      <Input
        placeholder='Type your message here'
        className={` ${className}`}
        ref={inputRef}
        onFocus={onFocusIn}
        onBlur={onFocusOut}
        {...props}
      />
    </>
  )
}

export default AutoCenterInput
