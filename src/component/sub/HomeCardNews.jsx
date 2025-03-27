import React from 'react'

import {
    Calendar,
    Location,
    Hearth,
    Chat,
    ThreeDot,
    Group
} from '../../assets/icons/index'

import Logo2 from '../../assets/images/ten/logo2.png'

const HomeCardNews = ({classes, width = "350px", image, isLiked = false, caption}) => {

    const avatars = [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/men/2.jpg",
        "https://randomuser.me/api/portraits/women/1.jpg",
    ];
      
    return (
        <div className={`lg:flex bg-base-100 lg:justify-center rounded-lg lg:items-center md:w-[${width}] w-[100%] md:p-2 md:m-3 md:rounded-lg pb-[15px] shadow-lg ${classes} md:bg-white`}>
            <div>
                <div className={` md:flex md:justify-center`}>
                    <div>
                        <div className='flex justify-center'>
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
                        </div>
                        <div className=''>
                            <img
                            className="w-[100%] md:w-[50px] md:hidden block"
                            alt="Tailwind CSS chat bubble component"
                            src={image} />
                        </div>
                        <div className={`p-2 px-5`}>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <div className="w-8 h-8 overflow-hidden border-2 border-[#facc15] rounded-full mr-2">
                                        <img src={Logo2} alt={`Avatar`} className="object-cover w-full h-full" />
                                    </div>
                                    <div className='py-1 '>
                                        <p className="font-bold card-title text-[15px]">Card Title</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center justify-start my-1'>
                                <div className='flex items-center justify-start mr-3'>
                                    <div className='flex items-center justify-center p-1 bg-white shadow-lg rounded-badge'>
                                        <Hearth color={isLiked ? 'red' : 'gray'} size={6} />
                                    </div>
                                    
                                    <div className='flex items-center ml-2'>
                                        <p className='text-[15px] font-semibold mr-1'>100</p>
                                        <p className='md:text-[15px] text-[13px] underline '>Reacted</p>
                                    </div>
                                </div>
                                {/* <div className='flex items-center justify-start'>
                                    <Chat color={'gray'} size={6} />
                                    <div className='flex items-center ml-2'>
                                        <p className='text-[15px] font-semibold mr-1'>5</p>
                                        <p className='text-[15px] underline'>Discussion</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeCardNews