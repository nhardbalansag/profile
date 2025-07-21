import React, {useEffect } from 'react'
import {useSelector} from 'react-redux';
import DOMPurify from 'dompurify';
import {
    Hearth,
} from '../../assets/icons/index'

import { Link } from "react-router-dom";
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import { IoPartlySunnyOutline } from "react-icons/io5";
import { IoCloudyNightOutline } from "react-icons/io5";
import { FaTags } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { FaRegClock } from "react-icons/fa6";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/free-mode';

const HomeCard = ({
    inlineRendering = false,
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

    const navigate = useNavigate();

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
                {
                    days > 0 &&
                    <div className="flex items-center space-x-2">
                        <IoPartlySunnyOutline  className="text-[18px] text-[#FF5722]" />
                        <label className="text-black text-[15px]">{days} <span className="days_id">Days</span> </label>
                    </div>
                }
                {
                    nights > 0 &&
                    <div className="flex items-center space-x-2">
                        <IoCloudyNightOutline   className="text-[18px] text-[#FF5722]" />
                        <label className="text-black text-[15px]">{nights} <span className="nights_id">Nights</span></label>
                    </div>
                }
            </div>
        )
    }

    const _OfferTag = () =>{
        return(
            <div className='flex items-center justify-center my-2'>
                <button 
                onClick={() => navigate('/product-details?view=' + contentDetails.id)} 
                className="view_details_label_id flex-1 h-10 px-2 font-semibold rounded-lg bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600 text-white text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
                    View Details
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
                        <div dangerouslySetInnerHTML={{__html: collapseDetails ? details : limitText(details)}} /> 
                        {!collapseDetails && <p className='see_more'>... see more</p>} 
                    </div>
                </div> 
            </div>
        )
    }

    const _Card2 = () => {
        return (
            
            <div className={`flex ${inlineRendering ? 'flex-row space-x-5' : 'flex-col'} rounded-xl  w-full bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}>
                    <div 
                    style={{
                        backgroundImage: `url(${image})`,
                    }}
                    className="relative w-full h-64 overflow-hidden rounded-b-none shadow-lg rounded-xl">
                        <img
                            src={image}
                            alt=""  
                            className="absolute inset-0 object-contain w-full h-full"
                        />
                        <div className="relative z-10 flex flex-col justify-between h-full p-6 text-center text-white">
                            {
                                categoryConfig.is_details_on_card &&
                                <div className=''>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h2 className="mb-2 text-3xl font-bold text-white drop-shadow-lg">{limitText(title)}</h2>
                                        <p className="text-sm text-white/90 drop-shadow-sm">Discover amazing experiences</p>
                                    </div>
                                </div>
                            }
                            {
                                categoryConfig.link_on_card_button &&
                                <button 
                                onClick={() => window.location.href = (categoryConfig.allow_redirect_to_external_link && contentDetails.content_external_link)} 
                                className="px-4 py-2 mt-4 font-medium text-white bg-[#001d3d] rounded-md w-fit hover:bg-gray-100 hover:text-[#001d3d] ">
                                <p className='see_details_button_id'>See Details</p>
                                </button>
                            }
                        </div>
                    </div>
                <div className="p-3">
                    
                    <div className='flex items-start justify-between '>
                        {_SocialComp()}
                    </div>
                    {/* {
                        contentDetails.content_date_from && contentDetails.content_date_to && categoryConfig.show_date_range &&
                        _DateRangeComp()
                    } */}

                    {
                        categoryConfig.show_bottom_title &&
                        contentDetails.content_has_payment
                        ?
                            <Link 
                                to={{
                                    pathname: "/content-details",
                                    search: "?view=" + contentDetails.id,
                                }}
                            >
                                    <p className="mt-1 font-semibold text-black text-md line-clamp-2">
                                    {title }
                                    </p>
                            </Link>
                        :
                            <p className="mt-1 font-semibold text-black text-md line-clamp-2">
                            {title }
                            </p>
                    }

                    {
                        categoryConfig.show_bottom_description &&
                        <div onClick={clickSeeDetails}  className="mt-1 text-sm text-gray-700">
                            <div dangerouslySetInnerHTML={{__html: collapseDetails ? details : limitText(details)}} /> 
                            {/* {!collapseDetails && details.length > 30 && <p className='text-lg see_more'>... see more</p>}  */}
                        </div>
                    }

                    {
                        categoryConfig.show_date_range &&
                        <div className="flex items-start gap-3 p-3 my-2 border border-blue-100 bg-blue-50 rounded-xl">
                            <FaRegClock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 duration_id">Duration</p>
                                <p className="text-xs text-gray-600">{contentDetails.content_days_count} <span className="days_id">Days</span>, {contentDetails.content_night_count} <span className="days_id">Nights</span></p>
                                <p className="mt-1 text-xs text-gray-500">{format(new Date(contentDetails.content_date_from), 'MMM dd, yyyy')} - {format(new Date(contentDetails.content_date_to), 'MMM dd, yyyy')}</p>
                            </div>
                        </div>
                    }
                    {/* {
                        contentDetails.content_offers_table.length > 0 && categoryConfig.show_offers && contentDetails.content_has_payment && 
                        _OfferTag()
                    } */}

                    {
                        // contentDetails.content_date_from && 
                        // contentDetails.content_date_to && 
                        categoryConfig.show_offers &&
                        _OfferTag()
                    }
                </div> 
            </div>
        )
    }

    const LoadComp = () =>{
        return(
            <div className=''>
                <div className="flex flex-col justify-center w-full gap-4 py-10">
                    <div className="w-full h-32 skeleton"></div>
                    <div className="h-4 skeleton w-28"></div>
                    <div className="w-full h-4 skeleton"></div>
                    <div className="w-full h-4 skeleton"></div>
                </div>
            </div>
        )
    }

    const EventsCard = () => {
        return (
            <div className="relative max-w-sm m-3 overflow-hidden transition-all duration-300 transform bg-white shadow-lg group hover:shadow-2xl hover:-translate-y-2">
                {/* Background Image */}
                <div className="relative h-64 overflow-hidden">
                    <img 
                    src={image}
                    alt="Hot air balloons floating over a scenic landscape"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="mb-2 text-3xl font-bold text-white drop-shadow-lg">Events</h2>
                        <p className="text-sm text-white/90 drop-shadow-sm">Discover amazing experiences</p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full">
                            Live Events
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-600">
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <span className="text-sm">Next Event: Dec 15, 2024</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-gray-600">
                            <MapPin className="w-4 h-4 text-orange-500" />
                            <span className="text-sm">Cappadocia, Turkey</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-gray-600">
                            <Users className="w-4 h-4 text-orange-500" />
                            <span className="text-sm">50+ Participants</span>
                        </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-gray-700">
                    Join us for breathtaking hot air balloon adventures and unforgettable experiences in stunning locations around the world.
                    </p>

                    <div className="mt-6">
                        <button className="flex items-center justify-center w-full gap-2 px-4 py-3 font-semibold text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 group">
                            View All Events
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>

                {/* Animated Border */}
                <div className="absolute inset-0 transition-colors duration-300 border-2 border-transparent rounded-lg pointer-events-none group-hover:border-orange-200" />
            </div>
        )
    }

    return (
        <div className={` lg:items-start md:w-[${width}] w-[100%]  md:rounded-lg ${classes} `}>
            {
                loading
                ? LoadComp()
                : 
                    <div className='flex justify-center '>
                        {_Card2()}
                        {/* <EventsCard/> */}
                    </div>
            }
        </div>
    )
}

export default HomeCard