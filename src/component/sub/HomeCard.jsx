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
    categoryConfig,
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
    loading = true,
    contentDetails
}) => {

    const limitText = (text, limit = 30) =>{
        if(text){
            return text.length > limit ? text.slice(0, limit) : text;
        }
    }

    //#region translation convertion
    const auth_states = useSelector(state => state.AuthReducer);

    useEffect(() =>{
        auth_states.PageLanguages.map((item, key) =>{
            const translation = item.translation
            
            if(translation.length > 0 && auth_states.SelectedLanguage){
                const filteredTranslation = translation.find(translation_item => translation_item.language_id == auth_states.SelectedLanguage.id)
                const targetElement = document.getElementsByClassName(item.page_config_id)
                if (targetElement) {
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

    const _SocialComp = () =>{
        return(
            <div className='flex items-start justify-between'>
                {
                    contentDetails.content_allow_reaction && categoryConfig.show_reaction &&
                    <div className='flex items-center justify-start p-2'>
                        <button className='flex items-center justify-center p-1 mr-2 bg-white border shadow-lg rounded-badge'>
                            <Hearth color={isLiked ? 'red' : 'gray'}  size={6} />
                        </button>
                        <div className='flex items-center'>
                            <p className='text-[15px] text-gray-500 mr-1'>{reactionCount}</p>
                        </div>
                    </div>
                }
                {
                    contentDetails.content_allow_community && categoryConfig.show_community &&
                    <div className='flex items-center justify-start p-2'>
                        <button className='flex items-center justify-center p-1 mr-2 bg-white border shadow-lg rounded-badge'>
                            <FaUsers  className="text-[23px] text-blue-500" />
                        </button>
                        <div className='flex items-center'>
                            <p className='text-[15px] text-gray-500 mr-1'>{communityCount}</p>
                        </div>
                    </div>
                }
            </div>
        )
    }

    const _DateRangeComp = () =>{
        return(
            <div className="flex items-center justify-start my-2 space-x-3">
                <div className="flex items-center space-x-2">
                    <IoPartlySunnyOutline  className="text-[18px] text-[#FF5722]" />
                    <label className="text-black text-[15px]">{days} <span className="days_id">Days</span> </label>
                </div>
                <div className="flex items-center space-x-2">
                    <IoCloudyNightOutline   className="text-[18px] text-[#FF5722]" />
                    <label className="text-black text-[15px]">{nights} <span className="nights_id">Nights</span></label>
                </div>
            </div>
        )
    }

    const _OfferTag = () =>{
        return(
            <div className='flex items-center justify-start p-2'>
                <button onClick={clickOffers} className='flex items-center justify-center p-1 mr-2 bg-white border shadow-lg rounded-badge'>
                    <FaTags className="text-[23px] text-[#FF5722]" />
                </button>
            </div>
        )
    }

    const _Card1 = () =>{
        return(
            <div className="w-full overflow-hidden bg-white rounded-xl">
                <div className="relative">
                    <img
                    src={image}
                    alt=""
                    className="object-fill w-full h-[200px]"
                    />
                </div>
                <div className="p-3 bg-white">
                    <div className='flex items-start justify-between '>
                        {_SocialComp()}
                        {
                            contentDetails.content_offers_table.length > 0 &&
                            _OfferTag()
                        }
                    </div>
                    {
                        contentDetails.content_date_from && contentDetails.content_date_to &&
                        _DateRangeComp()
                    }
                    <div className="mt-1 text-sm font-semibold text-black line-clamp-2">
                    {title}
                    </div>
            
                    <div onClick={clickSeeDetails}  className="mt-1 text-sm text-gray-700">
                        <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(collapseDetails ? details : limitText(details))}} /> 
                        {!collapseDetails && <p className='see_more'>... see more</p>} 
                    </div>
                </div> 
            </div>
        )
    }

    const _Card2 = () => {
        return (
            <div className='flex flex-col'>
                <div 
                style={{
                    backgroundImage: `url(${image})`,
                    // opacity: 0.3,  // Only affects the background
                    // zIndex: -1
                }}
                className="relative w-full h-64 max-w-xl overflow-hidden shadow-lg rounded-xl">
                    <img
                    src={image}
                    alt=""  
                    className="absolute inset-0 object-contain w-full h-full"
                    />
                    {/* Overlay */}
                    {
                        categoryConfig.has_gradient &&
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent" />
                    }
                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
                        {
                            categoryConfig.is_details_on_card &&
                            <div>
                                <h2 className="mb-2 text-xl font-bold">{limitText(title)}</h2>
                                <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(collapseDetails ? details : limitText(details))}} /> 
                            </div>
                        }
                        {
                            categoryConfig.link_on_card_button &&
                            <button 
                            onClick={() => window.location.href = (categoryConfig.allow_redirect_to_external_link && contentDetails.content_external_link)} 
                            className="px-4 py-2 mt-4 font-medium text-black bg-white rounded-md w-fit hover:bg-gray-100">
                            See Details
                            </button>
                        }
                    </div>
                </div>
                <div className="">
                    <div className='flex items-start justify-between '>
                        {_SocialComp()}
                        {
                            contentDetails.content_offers_table.length > 0 && categoryConfig.show_offers &&
                            _OfferTag()
                        }
                    </div>
                    {
                        contentDetails.content_date_from && contentDetails.content_date_to && categoryConfig.show_date_range &&
                        _DateRangeComp()
                    }
                    {
                       categoryConfig.show_bottom_title &&
                       <div className="mt-1 text-lg font-semibold text-black line-clamp-2">
                        {title}
                        </div>
                    }
                    {
                        categoryConfig.show_bottom_description &&
                        <div onClick={clickSeeDetails}  className="mt-1 text-lg text-gray-700">
                            <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(collapseDetails ? details : limitText(details))}} /> 
                            {!collapseDetails && <p className='see_more text-lg'>... see more</p>} 
                        </div>
                    }
                </div> 
            </div>
        )
    }

    const LoadComp = () =>{
        return(
            <div className='flex justify-center w-[90%]'>
                <div className="flex flex-col justify-center w-full gap-4 py-10">
                    <div className="w-full h-32 skeleton"></div>
                    <div className="h-4 skeleton w-28"></div>
                    <div className="w-full h-4 skeleton"></div>
                    <div className="w-full h-4 skeleton"></div>
                </div>
            </div>
        )
    }

    return (
        <div className={` lg:items-start md:w-[${width}] w-[100%] md:rounded-lg ${classes} md:bg-white`}>
            {
                loading
                ? LoadComp()
                : _Card2()
            }
        </div>
    )
}

export default HomeCard