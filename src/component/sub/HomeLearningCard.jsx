import React from 'react'

import {
    Calendar,
    Location,
    Hearth,
    Chat,
    ThreeDot
} from '../../assets/icons/index'

import Logo2 from '../../assets/images/ten/logo2.png'

const HomeLearningCard = ({classes, width = "350px", image, isLiked = false, caption}) => {

    const avatars = [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/men/2.jpg",
        "https://randomuser.me/api/portraits/women/1.jpg",
    ];
      
    return (
        <div className={`lg:flex lg:justify-center lg:items-center md:w-[${width}] w-[100%] md:p-2 md:m-3 md:rounded-lg pb-[15px] sm:shadow-lg ${classes} md:bg-white`}>
            <div>
                {/* <div className='flex justify-between py-1 mx-2'>
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
                </div> */}
                <div className={`bg-base-100 md:flex md:justify-center`}>
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
                            // alt="Tailwind CSS chat bubble component"
                            src={image} />
                        </div>
                        <div className={`p-2`}>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <div className='py-1'>
                                        <p className="font-bold text-[13px]">Card Title</p>
                                        <p className='text-[13px] py-1'>A card component a body part, and ...</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center justify-start'>
                                <div className='flex items-center justify-center p-1 mr-2 bg-white shadow-lg rounded-badge'>
                                    <Hearth color={isLiked ? 'red' : 'gray'} size={5} />
                                </div>
                                <div className='flex items-center'>
                                    <p className='text-[10px] font-semibold mr-1'>(100)</p>
                                    {/* <p className='text-[10px] underline'>Reacted</p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeLearningCard