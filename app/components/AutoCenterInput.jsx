'use client'
import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState } from 'react'

const AutoCenterInput = ({ className = '', ...props }) => {
  const inputRef = useRef(null)
  const [ogHeight, setOgHeight] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setOgHeight(window.visualViewport.height)
    }, 50)
  }, [])

  const onFocusIn = () => {
    loopResize(0)
  }

  function loopResize(i) {
    if (i >= 100) return

    const height = window.visualViewport.height

    if (height >= ogHeight - 100 && height <= ogHeight + 100) {
      i++
      setTimeout(() => loopResize(i), 25)
      return
    }

    const container = document.getElementById('container')
    container.style.height = `${height}px`
    container.style.minHeight = `${height}px`
    container.style.maxHeight = `${height}px`
    //alert(`resized og:${ogHeight} new:${height}`)
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
