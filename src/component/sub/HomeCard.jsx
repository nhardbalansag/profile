import React, {useEffect } from 'react'
import {useSelector} from 'react-redux';
import DOMPurify from 'dompurify';
import {
    Hearth,
} from '../../assets/icons/index'

import { IoPartlySunnyOutline } from "react-icons/io5";
import { IoCloudyNightOutline } from "react-icons/io5";
import { FaTags } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";

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
    reactionCount = 0,
    communityCount = 0,
    title = "Card Title",
    details = "A card component a body part, and ...",
    duration = "5 Days 4 Nights",
    location = "Singapore",
    clickSeeDetails = () => alert("no details yet"),
    collapseDetails = false,
    clickOffers,
    days = 0,
    nights = 0,
    loading = true
}) => {

    const limitText = (text, limit = 100) =>{
        return text.length > limit ? text.slice(0, limit) : text;
    }

    //#region translation convertion
    const auth_states = useSelector(state => state.AuthReducer);

    useEffect(() =>{
        auth_states.PageLanguages.map((item, key) =>{
            const translation = item.translation
            
            if(translation.length > 0 && auth_states.SelectedLanguage){
                const filteredTranslation = translation.find(translation_item => translation_item.language_id == auth_states.SelectedLanguage.id)
                const targetElement = document.getElementsByClassName(item.page_config_id)
                if (targetElement && filteredTranslation) {
                    if (targetElement.length > 0 && filteredTranslation) {
                        Array.from(targetElement).forEach((el) => {
                            el.textContent = filteredTranslation.page_config_title;
                        });
                    } else if (targetElement.length > 0) {
                        Array.from(targetElement).forEach((el) => {
                            el.textContent = item.page_config_title;
                        });
                    }
                }
            }
        })
    },[auth_states, loading])
    //#endregion

    return (
        <div className={`flex justify-center lg:items-center md:w-[${width}] w-[100%] md:p-2 md:m-3 md:rounded-lg pb-[15px] shadow-lg ${classes} md:bg-white`}>
            {
                loading
                ?
                    <div className='flex justify-center w-[90%]'>
                        <div className="flex flex-col justify-center w-full gap-4 py-10">
                            <div className="w-full h-32 skeleton"></div>
                            <div className="h-4 skeleton w-28"></div>
                            <div className="w-full h-4 skeleton"></div>
                            <div className="w-full h-4 skeleton"></div>
                        </div>
                    </div>
                :
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
                                <div  onClick={clickSeeDetails}  dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(collapseDetails ? details : limitText(details))}} /> 
                                {!collapseDetails && <p className='see_more'>... see more</p>} 
                            </div>
                            <div className='p-4 px-2 bg-white border rounded-lg shadow-md'>
                                <div className='flex items-center justify-between'>
                                    <div className="flex items-center justify-start space-x-3">
                                        <div className="flex items-center space-x-2">
                                            <IoPartlySunnyOutline  className="text-[15px] text-[#FF5722]" />
                                            <label className="text-black text-[12px]">{days} <span className="days_id">Days</span> </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <IoCloudyNightOutline   className="text-[15px] text-[#FF5722]" />
                                            <label className="text-black text-[12px]">{nights} <span className="nights_id">Nights</span></label>
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
            }
        </div>
    )
}

export default HomeCard