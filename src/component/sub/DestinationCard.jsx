import React, {useEffect} from 'react'
import {useSelector} from 'react-redux';
import {
    Hearth,
} from '../../assets/icons/index'

import { FaTags } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

import Logo2 from '../../assets/images/ten/logo2.png'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/free-mode';

const DestinationCard = ({
    classes, 
    width = "500px", 
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
    clickOffers,
    loading = true
}) => {

    const limitText = (text, limit = 200) =>{
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
    },[auth_states])
    //#endregion

    return (
        <div className={`lg:flex lg:justify-center lg:items-center md:w-[${width}] w-[100%] md:p-2 md:m-3 md:rounded-lg pb-[15px] shadow-lg ${classes} md:bg-white`}>
            {
                loading
                ?
                    <div className='flex justify-center'>
                        <div className="flex flex-col justify-center gap-4 py-10 md:w-[500px] w-[100%] p-5 ">
                            <div className="w-full h-32 skeleton"></div>
                            <div className="h-4 skeleton w-28"></div>
                            <div className="w-full h-4 skeleton"></div>
                            <div className="w-full h-4 skeleton"></div>
                        </div>
                    </div>
                :
                <div className="bg-base-100">
                    <div className='flex justify-center'>
                        <div className='border rounded-b-none rounded-lg md:w-[500px] w-[100%]'>
                            <div className='flex items-center justify-start p-2 px-5 '>
                                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                                    <img src={Logo2} alt={`Avatar`} className="object-cover w-full h-full" />
                                </div>
                                <div>
                                    <p className='font-semibold text-[15px] text-black'>Club TEN</p>
                                </div>
                            </div>
                            <div className='px-6 py-2'>
                                <p className="font-semibold text-[17px]">{title}</p>
                                <div className='text-[16px] py-1 md:w-[450px]'  onClick={clickSeeDetails} dangerouslySetInnerHTML={{ __html: (collapseDetails ? details : limitText(details)) }} />
                                {!collapseDetails && <p className='see_more'>... see more</p>} 
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
                    
                    <div className='flex justify-center'>
                        <img
                        className="w-[100%] md:w-[500px]"
                        alt="Tailwind CSS chat bubble component"
                        src={image} />
                    </div>
                </div>
            }
        </div>
    )
}

export default DestinationCard