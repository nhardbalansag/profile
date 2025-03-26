import React from 'react'

import {
    Calendar,
    Location,
    Hearth,
    Chat
} from '../../assets/icons/index'

import Logo2 from '../../assets/images/ten/logo2.png'

const HomeCardCommunity = ({classes, width = "350px", image, isLiked = false}) => {

    const avatars = [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/men/2.jpg",
        "https://randomuser.me/api/portraits/women/1.jpg",
    ];
      
    return (
        <div className={`lg:flex lg:justify-center lg:items-center md:w-[${width}] w-[100%] md:p-2 md:m-3 md:rounded-lg pb-[15px] shadow-lg ${classes} md:bg-[#eee9e9]`}>
            <div className={`bg-base-100 md:flex md:justify-center`}>
                <div>
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
                    <div className=''>
                        <img
                        className="w-[100%] md:w-[50px] md:hidden block"
                        alt="Tailwind CSS chat bubble component"
                        src={image} />
                    </div>
                    <div className={`p-2`}>
                        <div className='py-1'>
                            <p className="font-bold text-[15px]">Card Title</p>
                        </div>
                        <div className='flex items-center justify-between'>
                            <button onClick={() => alert("liked")} className='mb-3'>
                                <div className='flex items-center justify-center'>
                                    <Chat color={'gray'} size={5} />
                                    <p className='ml-2 underline text-[15px]'>Discussion</p>
                                </div>
                            </button>
                            <button onClick={() => alert("liked")} className='pr-3 mb-3'>
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
                                <p className='mx-1 font-bold'>2k</p>
                                <p>members</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeCardCommunity