'use client'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useRef, useState } from 'react'

export default function ACTextArea({ className = '', ...props }) {
  const inputRef = useRef(null)
  const [ogHeight, setOgHeight] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setOgHeight(window.visualViewport.height)
      if (inputRef.current) loopResize(0)
    }, 50)
  }, [])

  const onFocusIn = () => {
    loopResize(0)
  }

  function loopResize(i) {
    if (i >= 100) {
      alert('done')
      return
    }

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
    <Textarea
      className={` ${className}`}
      ref={inputRef}
      onFocus={onFocusIn}
      onBlur={onFocusOut}
      {...props}
    />
  )
}
