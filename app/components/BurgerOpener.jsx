import React from 'react'
import './BurgerOpener.css'

function BurgerOpener({ className, ...props }) {
  return (
    <label className={`burger ${className}`} htmlFor='burger'>
      <input type='checkbox' id='burger' {...props} />
      <span></span>
      <span></span>
      <span></span>
    </label>
  )
}

export default BurgerOpener
