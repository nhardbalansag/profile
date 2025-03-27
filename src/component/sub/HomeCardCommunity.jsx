import React from 'react'

import {
    Calendar,
    Location,
    Hearth,
    Chat,
    ThreeDot
} from '../../assets/icons/index'

import Logo2 from '../../assets/images/ten/logo2.png'

const HomeCardCommunity = ({classes, width = "350px", image, isLiked = false, caption}) => {

    const avatars = [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/men/2.jpg",
        "https://randomuser.me/api/portraits/women/1.jpg",
    ];
      
    return (
        <div className={`lg:flex lg:justify-center lg:items-center md:w-[${width}] w-[100%] md:p-2 md:m-3 md:rounded-lg pb-[15px] shadow-lg ${classes} md:bg-white`}>
            <div>
                <div className='flex justify-between py-1 mx-2'>
                    <div className='flex items-center justify-start'>
                        <div className="w-8 h-8 overflow-hidden border-2 border-[#facc15] rounded-full mr-2">
                            <img src={avatars[0]} alt={`Avatar`} className="object-cover w-full h-full" />
                        </div>
                        <div>
                            <p className='font-semibold text-[15px] text-black'>Bernard Balansag</p>
                        </div>
                    </div>
                    <div>
                        <button>
                            <ThreeDot color={'gray'} size={8} />
                        </button>
                    </div>
                </div>
                <div className='pb-1 mx-2'>
                    <p>{caption}</p>
                </div>
                <div className={`bg-base-100 md:flex md:justify-center`}>
                    <div>
                        <div className='flex justify-center hidden sm:block'>
                            <div className='border-[0.5px] border-[#9f9f9b] border-b-transparent rounded-b-none rounded-lg w-[95%] sm:w-[100%]'>
                                <div className='flex items-center justify-start p-2 px-5 '>
                                    <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                                        <img src={Logo2} alt={`Avatar`} className="object-cover w-full h-full" />
                                    </div>
                                    <div>
                                        <p className='font-semibold text-[15px] text-black'>Club TEN</p>
                                    </div>
                                </div>
                                <div className='px-6 py-2'>
                                    <p className="font-semibold text-[17px]">Card Title</p>
                                    <p className='text-[16px] py-1'>A card component a body part, and ...</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center'>
                            <div 
                                style={{
                                    backgroundImage: `url(${image})`,
                                    backgroundSize: "cover", 
                                    backgroundPosition: "center"
                                }}
                                className={`h-[150px] rounded-lg w-[100%] hidden md:block rounded-t-none`}
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
                        <div className='flex justify-center block sm:hidden'>
                            <div className='border-[0.5px] border-[#9f9f9b] border-b-transparent rounded-b-none rounded-lg w-[95%]'>
                                <div className='flex items-center justify-start p-2 px-5'>
                                    <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                                        <img src={Logo2} alt={`Avatar`} className="object-cover w-full h-full" />
                                    </div>
                                    <div>
                                        <p className='font-semibold text-[15px] text-black'>Club TEN</p>
                                    </div>
                                </div>
                                <div className='px-6 py-2'>
                                    <p className="font-semibold text-[17px]">Card Title</p>
                                    <p className='text-[16px] py-1'>A card component a body part, and ...</p>
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
                                <div>
                                    <div className='block py-1 md:hidden'>
                                        <p className="font-bold card-title">My Community Group</p>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <button onClick={() => alert("liked")} className='mb-3'>
                                            <div className='flex items-center justify-center'>
                                                <div className='flex items-center justify-center p-1 mr-2 '>
                                                    <Chat color={'gray'} size={6} />
                                                </div>
                                                <p className='ml-2 underline text-[15px]'>Discussion</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <button onClick={() => alert("liked")} className='pr-3 mb-3 md:hidden'>
                                    <div className='flex items-center justify-center p-1 bg-white shadow-lg rounded-badge'>
                                        <Hearth color={isLiked ? 'red' : 'gray'} size={8} />
                                    </div>
                                </button>
                            </div>
                            <div className="flex items-center">
                                {avatars.map((src, index) => (
                                    <div
                                    key={index}
                                    className="w-10 h-10 -ml-3 overflow-hidden border-2 border-white rounded-full first:ml-0"
                                    >
                                        <img src={src} alt={`Avatar ${index}`} className="object-cover w-full h-full" />
                                    </div>
                                ))}

                                {/* Add More Button */}
                                <div className="flex items-center justify-center w-10 h-10 -ml-3 text-lg font-bold text-white bg-black border-2 border-white rounded-full">
                                    +
                                </div>
                                <div className='flex items-center justify-start'>
                                    <p className='mx-1 font-bold text-[16px]'>2k</p>
                                    <p className='text-[16px]'>members</p>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeCardCommunity