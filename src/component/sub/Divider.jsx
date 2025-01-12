import React from 'react'

import {
    Information,
} from '../../assets/icons/index'
  
function Divider({text = "", icon = <Information size={5}/>}) {
  return (
    <div className="flex flex-col w-full my-8">
        <div className="divider">
            <div className='flex items-start justify-start'> 
                {icon}
                <p className="mx-1 font-fo">
                    {text}
                </p>
            </div>
        </div>
    </div>
  )
}

export default Divider