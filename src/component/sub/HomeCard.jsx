import React, {useState} from 'react'

import {
    Calendar,
    Location,
    Hearth,
    Group
} from '../../assets/icons/index'

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
    collapseDetails = false
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
                    <p className='font-bold text-[15px] my-1'>{duration}</p>
                    <div className='flex justify-between'>
                        <div className='flex items-center justify-start'>
                            <Calendar size={6}/>
                            <p className=' text-[16px] ml-2 my-1'>{duration}</p>
                        </div>
                        <div className='flex items-center justify-start my-1'>
                            <Location size={6}/>
                            <p className='text-[16px] ml-2'>{location}</p>
                        </div>
                    </div>
                </div>
                {
                    collapseDetails
                    &&
                    <>
                        <div className='p-4 px-2 my-2 bg-white border rounded-lg shadow-md'>
                            <p className='font-bold text-[15px] my-1'>Early Bird Price</p>
                            <div className='flex justify-between'>
                                <div className='flex items-center justify-start'>
                                    <p className=' text-[16px] ml-2 my-1'>Until 18/4/2025 </p>
                                </div>
                                <div className='flex items-center justify-start my-1'>
                                    <p className='text-[16px] ml-2'>Midnight</p>
                                </div>
                            </div>
                        </div>
                        <div className='p-4 px-2 my-2 bg-white border rounded-lg shadow-md'>
                            <p className='font-bold text-[15px] my-1'>Regular Price</p>
                            <div className='flex justify-between'>
                                <div className=''>
                                    <p className=' text-[16px] ml-2 my-1'> from: 19/4/2025 </p>
                                    <p className=' text-[16px] ml-2 my-1'> to: 1/5/2025</p>
                                </div>
                            </div>
                        </div>

                         {/* Tabs */}
                        <div role="tablist" className="flex justify-center mb-4 tabs tabs-lift">
                            {Object.keys(pricingData).map((key) => (
                            <a
                                key={key}
                                role="tab"
                                className={`tab text-[20px] ${activeTab === key ? "tab-active font-extrabold" : ""}`}
                                onClick={() => setActiveTab(key)}
                            >
                                {pricingData[key].title}
                            </a>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {/* <div className="p-6 text-center bg-white border rounded-lg shadow-lg">
                            <h3 className="gap-2 text-xl font-bold capitalize">
                            early bird
                            </h3>
                            <p className='font-thin text-[16px] capitalize'>twin sharing</p>
                            <p className="text-gray-500">{pricingData[activeTab].subtitle}</p>
                            <p className="my-3 text-3xl font-bold text-blue-600">{pricingData[activeTab].price}</p>
                            <p className="text-sm text-gray-400">{pricingData[activeTab].note}</p>
                        </div> */}
                        <PricingCard offerTitle='early bird' accommodationType='twin sharing' guestCount={2} amount={1088} hasTP={false} pointsAmount={0}/>
                        <PricingCard offerTitle='early bird' membershipType='regular' accommodationType='twin sharing' guestCount={2} amount={1088} hasTP={false} pointsAmount={0}/>

                        <div className='px-2 my-2 border border-[#f67e7e] rounded-lg'>
                            <p className='font-bold text-[15px] my-1 text-[#f67e7e]'>Registration Closing Date</p>
                            <div className='flex justify-between'>
                                <div className=''>
                                    <p className=' text-[16px] ml-2 my-1 text-[#f67e7e]'> 2/5/2025 </p>
                                    <p className=' text-[16px] ml-2 my-1'><strong>Note:</strong> After this date, we will not accept any more event
                                        registrations.</p>
                                </div>
                            </div>
                        </div>
                    </>
                }
                
            </div>
            {
                collapseDetails
                &&
                <div className='block my-5 md:hidden'>
                    <Swiper
                        pagination={{
                            type: 'fraction',
                        }}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        className="mySwiper"
                    >
                        <SwiperSlide>
                            <img
                            className="w-[100%] md:w-[50px] md:hidden block"
                            alt="Tailwind CSS chat bubble component"
                            src={image} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                            className="w-[100%] md:w-[50px] md:hidden block"
                            alt="Tailwind CSS chat bubble component"
                            src={image} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                            className="w-[100%] md:w-[50px] md:hidden block"
                            alt="Tailwind CSS chat bubble component"
                            src={image} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                            className="w-[100%] md:w-[50px] md:hidden block"
                            alt="Tailwind CSS chat bubble component"
                            src={image} />
                        </SwiperSlide>
                    </Swiper>
                </div>
                
            }
            <div className='flex items-center justify-start mx-5'>
                <div className='flex items-center justify-start p-2'>
                    <div className='flex items-center justify-center p-1 mr-2 bg-white shadow-lg rounded-badge'>
                        <Hearth color={isLiked ? 'red' : 'gray'}  size={6} />
                    </div>
                    <div className='flex items-center'>
                        <p className='text-[15px] font-semibold mr-1'>{reactionCount}</p>
                        <p className='text-[15px] underline'>Reacted</p>
                    </div>
                </div>
                <div className='flex items-center justify-start p-2'>
                    <div className='flex items-center justify-center p-1 mr-2 bg-white shadow-lg rounded-badge'>
                        <Group color={'gray'} size={6} />
                    </div>
                    <div className='flex items-center'>
                        <p className='text-[15px] font-semibold mr-1'>{communityCount}</p>
                        <p className='text-[15px] underline'>Communities</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HomeCard