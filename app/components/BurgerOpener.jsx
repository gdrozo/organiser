import React from 'react'
import './BurgerOpener.css'

function BurgerOpener({ className, checked, onClick, ...props }) {
  return (
    <label className={`burger ${className}`} htmlFor='burger'>
      <input
        type='checkbox'
        id='burger'
        {...props}
        checked={checked}
        onChange={onClick}
      />
      <span></span>
      <span></span>
      <span></span>
    </label>
  )
}

export default BurgerOpener
