import React from 'react'

import {
    Calendar,
    Location,
    Hearth
} from '../../assets/icons/index'

import Logo2 from '../../assets/images/ten/logo2.png'

const HomeCardCommunity = ({classes, width = "350px", image}) => {

    const avatars = [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/men/2.jpg",
        "https://randomuser.me/api/portraits/women/1.jpg",
    ];
      
  return (
    <div className={`lg:flex lg:justify-center lg:items-center w-[${width}] p-2 m-3 rounded-lg shadow-lg ${classes} bg-white`}>
        <div className={`bg-base-100 flex justify-center`}>
            <div>
                <figure>
                    <div 
                        style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: "contain", 
                            backgroundPosition: "center"
                        }}
                        className={`h-[150px] rounded-lg w-[230px]`}
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
                <div className={`p-2`}>
                    <div className='py-1'>
                        <p className="font-bold text-[15px]">Card Title</p>
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