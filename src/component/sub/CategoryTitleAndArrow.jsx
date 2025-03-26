import React from 'react'

import {
  CircledArrowRight
} from '../../assets/icons/index'

function CategoryTitleAndArrow({title}) {
  return (
    <div className='flex items-center justify-between'>
        <h2 h2 className='font-bold text-[30px] text-[#063970] my-5'>{title}</h2>
        <button className='flex items-center justify-center'>
            <p className='mr-3 font-semibold'>Explore</p>
            <CircledArrowRight />
        </button>
    </div>
  )
}

export default CategoryTitleAndArrow