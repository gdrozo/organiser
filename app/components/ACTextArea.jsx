'use client'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useRef, useState } from 'react'

export default function ACTextArea({
  className = '',
  onFocus = () => {},
  onBlur = () => {},
  onPointerDown = () => {},
  ...props
}) {
  const inputRef = useRef(null)
  const [ogHeight, setOgHeight] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setOgHeight(window.visualViewport.height)
    }, 50)
  }, [])

  useEffect(() => {
    if (!inputRef.current) return
  }, [inputRef])

  const focusHandler = e => {
    loopResize(0)
    onFocus(e)
  }

  function loopResize(i) {
    if (i >= 100 || ogHeight <= 100) return

    const height = window.visualViewport.height

    if (height <= 100) return

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

  const blurHandler = e => {
    if (ogHeight <= 100) return
    const container = document.getElementById('container')
    container.style.height = `${ogHeight}px`
    container.style.minHeight = `${ogHeight}px`
    container.style.maxHeight = `${ogHeight}px`

    onBlur(e)
  }

  function pointerDownHandler(e) {
    loopResize(0)
    onPointerDown(e)
  }

  return (
    <Textarea
      className={` ${className}`}
      ref={inputRef}
      onFocus={focusHandler}
      onBlur={blurHandler}
      onPointerDown={pointerDownHandler}
      {...props}
    />
  )
}
