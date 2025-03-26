import React from 'react'

import {
    Calendar,
    Location
} from '../../assets/icons/index'

const HomeCard = ({classes, width = "300px", image}) => {
  return (
    <div className={`lg:flex lg:justify-center lg:items-center w-[${width}] p-2 m-3 rounded-lg shadow-lg ${classes}`}>
        <div className="bg-base-100">
            <figure>
                <img
                className={`w-[${width}] rounded-lg`}
                alt="Tailwind CSS chat bubble component"
                src={image} />
            </figure>
            <div className="p-2">
                <div className='py-1'>
                    <p className="font-bold text-[15px]">Card Title</p>
                    <p className='text-[13px]'>A card component a body part, and ...</p>
                </div>
                <div className='p-3 border rounded-lg'>
                    <p className='font-semibold text-[15px] my-1'>5 Days 4 Nights</p>
                    <div className='flex items-center justify-start'>
                        <Calendar size={5}/>
                        <p className='font-semibold text-[12px] ml-2 my-1'>June 2 - June 6</p>
                    </div>
                    <div className='flex items-center justify-start my-1'>
                        <Location size={5}/>
                        <p className='text-[12px] ml-2'>Singapore</p>
                    </div>
                </div>
            </div>
            <button className='rounded bg-[#063970] w-full text-white py-2 px-5 font-bold'>
                See Details
            </button>
        </div>
    </div>
  )
}

export default HomeCard