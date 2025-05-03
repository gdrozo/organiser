'use client'
import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState } from 'react'

const AutoCenterInput = ({ className = '', ...props }) => {
  const inputRef = useRef(null)
  const [ogHeight, setOgHeight] = useState(0)

  useEffect(() => {
    setOgHeight(window.visualViewport.height)
  }, [])

  const onFocusIn = () => {
    setTimeout(() => {
      const height = window.visualViewport.height
      //const height = '400'

      const container = document.getElementById('container')
      container.style.height = `${height}px`
      container.style.minHeight = `${height}px`
      container.style.maxHeight = `${height}px`
    }, 250)
  }

  const onFocusOut = () => {
    const container = document.getElementById('container')
    container.style.height = `${ogHeight}px`
    container.style.minHeight = `${ogHeight}px`
    container.style.maxHeight = `${ogHeight}px`
  }

  return (
    <Input
      placeholder='Type your message here'
      className={` ${className}`}
      ref={inputRef}
      onFocus={onFocusIn}
      onBlur={onFocusOut}
      {...props}
    />
  )
}

export default AutoCenterInput
