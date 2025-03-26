import React from 'react'

function ThreeDot({size = 6, classes, color}) {
  return (
    <svg className={`w-${size} h-${size} ${classes}`} xmlns="http://www.w3.org/2000/svg" fill={`${color}`} viewBox="0 0 24 24" strokeWidth="1.5" stroke={`${color}`} >
         <path d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  )
}

export default ThreeDot
