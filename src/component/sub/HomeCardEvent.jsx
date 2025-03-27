import React from 'react'

import {
    Calendar,
    Location,
    Hearth,
    Group
} from '../../assets/icons/index'

import Logo2 from '../../assets/images/ten/logo2.png'

const HomeCardEvent = ({classes, width = "350px", image, isLiked = false}) => {
  return (
    <div className={`lg:flex lg:justify-center lg:items-center md:w-[${width}] w-[100%] md:p-2 md:m-3 md:rounded-lg pb-[15px] shadow-lg ${classes} md:bg-white`}>
        <div className="bg-base-100">
            <figure className='flex justify-center'>
                <div 
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: "cover", 
                        backgroundPosition: "center"
                    }}
                    className={`h-[150px] rounded-lg w-[230px] hidden md:block`}
                >
                    <div className='flex items-center justify-end py-2'>
                        <button onClick={() => alert("liked")} className='mr-2'>
                            <div className='flex items-center justify-center p-1 bg-white shadow-lg rounded-badge'>
                                <Hearth color={isLiked ? 'red' : 'gray'} size={8} />
                            </div>
                        </button>
                    </div>
                </div>
            </figure>
            <div className=''>
                <img
                className="w-[100%] md:w-[50px] md:hidden block"
                alt="Tailwind CSS chat bubble component"
                src={image} />
            </div>
            <div className='flex items-center justify-start px-4 mt-2'>
                <div className='flex items-center justify-center p-1 mr-2 bg-white shadow-lg rounded-badge'>
                    <Hearth color={'gray'} size={6} />
                </div>
                <div className='flex items-center'>
                    <p className='text-[15px] font-semibold mr-1'>100</p>
                    <p className='text-[15px] underline'>Reacted</p>
                </div>
            </div>
            <div className="p-2 px-5">
                
                <div className='flex items-center justify-start'>
                    <Calendar size={5}/>
                    <p className=' text-[15px] ml-2'>June 2 - June 6</p>
                </div>
                <div className='py-1'>
                    <p className="font-bold card-title">Card Title</p>
                    {/* <p className='text-[18px] py-1'>A card component a body part, and ...</p> */}
                </div>
                <div className='flex items-center justify-start my-1'>
                    <Location size={5} classes={'text-[#949393]'}/>
                    <p className='text-[15px] ml-2 text-[#949393]'>Singapore</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HomeCardEvent