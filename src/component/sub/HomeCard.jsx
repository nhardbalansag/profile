import React from 'react'

import {
    Calendar,
    Location,
    Hearth
} from '../../assets/icons/index'

import Logo2 from '../../assets/images/ten/logo2.png'

const HomeCard = ({classes, width = "350px", image}) => {
  return (
    <div className={`lg:flex lg:justify-center lg:items-center w-[${width}] p-2 m-3 rounded-lg shadow-lg ${classes}`}>
        <div className="bg-base-100">
            <figure className='flex justify-center'>
                <div 
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: "contain", 
                        backgroundPosition: "center"
                    }}
                    className='h-[150px] rounded-lg w-[230px]'
                >
                    <div className='flex items-center justify-between py-2'>
                        <img
                        className="w-[40px] md:w-[50px]"
                        alt="Tailwind CSS chat bubble component"
                        src={Logo2} />
                        <div className='pr-2 '>
                            <button onClick={() => alert("liked")}>
                                <Hearth color={'gray'} size={8} />
                            </button>
                        </div>
                    </div>
                </div>
            </figure>
            <div className="p-2">
                <div className='py-1'>
                    <p className="font-bold text-[15px]">Card Title</p>
                    <p className='text-[13px]'>A card component a body part, and ...</p>
                </div>
                <div className='px-2 border rounded-lg'>
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