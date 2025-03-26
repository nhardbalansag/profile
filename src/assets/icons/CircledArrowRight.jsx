import React from 'react'

function CircledArrowRight({size = 6, classes}) {
  return (
    <svg className={`w-${size} h-${size} ${classes}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
     <path d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

export default CircledArrowRight
