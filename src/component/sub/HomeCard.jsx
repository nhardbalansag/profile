import React, {useState} from 'react'

// import {
//     Calendar,
//     Location,
//     Hearth,
//     Group
// } from '../../assets/icons/index'

import {
    Calendar,
    Location,
    Hearth,
    Group,
    PriceTag
} from '../../assets/icons/index'

import { IoPartlySunnyOutline } from "react-icons/io5";
import { IoCloudyNightOutline } from "react-icons/io5";
import { FaTags } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";

import {
  PricingCard,
} from '../../component/index'

import Logo2 from '../../assets/images/ten/logo2.png'

import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/free-mode';

const HomeCard = ({
    classes, 
    width = "350px", 
    image, 
    isLiked = false,
    reactionCount = 100,
    communityCount = 5,
    title = "Card Title",
    details = "A card component a body part, and ...",
    duration = "5 Days 4 Nights",
    location = "Singapore",
    clickSeeDetails = () => alert("no details yet"),
    collapseDetails = false,
    clickOffers
}) => {

    const [activeTab, setActiveTab] = useState("standard");

    const pricingData = {
      standard: {
        title: "STANDARD",
        subtitle: "2 Guests Per Room",
        price: "$1088",
        note: "TP not applicable",
      },
      vip: {
        title: "VIP",
        subtitle: "2 Guests Per Room",
        price: "$1288",
        note: "Includes TP",
      },
      pca: {
        title: "PCA",
        subtitle: "Private Room",
        price: "$1588",
        note: "All-inclusive package",
      },
    }  

    const limitText = (text, limit = 35) =>{
        return text.length > limit ? text.slice(0, limit) + "... see more" : text;
    }

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
            <div className="p-2 px-5">
                <div className='py-1'>
                    <p className="font-bold card-title">{title}</p>
                    <div onClick={clickSeeDetails} dangerouslySetInnerHTML={{ __html: (collapseDetails ? details : limitText(details)) }} />
                    {/* <p className='text-[18px] py-1'>{collapseDetails ? details : limitText(details)}</p> */}
                </div>
                <div className='p-4 px-2 bg-white border rounded-lg shadow-md'>
                    <div className='flex items-center justify-between'>
                        <div className="flex items-center justify-start space-x-3">
                            <div className="flex items-center space-x-2">
                                <IoPartlySunnyOutline  className="text-[15px] text-[#FF5722]" />
                                <label className="text-black text-[12px]">3 Days</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <IoCloudyNightOutline   className="text-[15px] text-[#FF5722]" />
                                <label className="text-black text-[12px]">3 Nights</label>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CiLocationOn className="text-[15px] text-[#FF5722]" />
                            <p className='text-[12px]'>{location}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='flex items-center justify-between mx-5'>
                <div className='flex items-center justify-start p-2'>
                    <button className='flex items-center justify-center p-1 mr-2 bg-white border shadow-lg rounded-badge'>
                        <Hearth color={isLiked ? 'red' : 'gray'}  size={6} />
                    </button>
                    <div className='flex items-center'>
                        <p className='text-[15px] text-gray-500 mr-1'>{reactionCount}</p>
                    </div>
                </div>
                <div className='flex items-center justify-start p-2'>
                    <button className='flex items-center justify-center p-1 mr-2 bg-white border shadow-lg rounded-badge'>
                        <FaUsers  className="text-[23px] text-blue-500" />
                    </button>
                    <div className='flex items-center'>
                        <p className='text-[15px] text-gray-500 mr-1'>{communityCount}</p>
                    </div>
                </div>
                <div className='flex items-center justify-start p-2'>
                    <button onClick={clickOffers} className='flex items-center justify-center p-1 mr-2 bg-white border shadow-lg rounded-badge'>
                        <FaTags className="text-[23px] text-[#FF5722]" />
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HomeCard