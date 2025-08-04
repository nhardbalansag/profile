import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { useSearchParams, useNavigate } from 'react-router-dom';

import {
    Outlet,
} from "react-router";

import {
  Header,
  Footer,
  LanguageBottomSheet
} from "../component/index"

import { FaUsers, FaShoppingBag, FaUser } from "react-icons/fa";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuTickets } from "react-icons/lu";
import { AiFillNotification } from "react-icons/ai";
import { TiHomeOutline } from "react-icons/ti";
import { LuCircleDollarSign } from "react-icons/lu";
import { IoFitnessOutline } from "react-icons/io5";
import { PiPottedPlantBold } from "react-icons/pi";
import { BiStore } from "react-icons/bi";
import { BiLike } from "react-icons/bi";

import { MdOutlineAirplanemodeActive } from "react-icons/md";
import { MdOutlineStorefront } from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";
import { HiShoppingBag } from "react-icons/hi2";

const HomePage = () => {

  const auth_states = useSelector(state => state.AuthReducer);
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false)
  const [getOpenLanguageSelection, setOpenLanguageSelection] = useState(false)
  const [getSelectedLanguage, setSelectedLanguage] = useState("")

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
  },[auth_states])

  const BottomTabNavigator = () =>{
    return (
      <div 
      style={{
        position: 'fixed',
        height: '70px',
        zIndex: 1000
      }}
      className="md:hidden bottom-4 left-1/2 transform -translate-x-1/2 bg-[#031956] text-white rounded-xl px-4 py-1 flex justify-between items-center w-[90%] space-x-6 shadow-lg">
        <Link to={'/'}>
          <div className={`flex flex-col items-center text-white`}>
            <div className="mb-1 text-lg"><TiHomeOutline size={20}/></div>
            <span className="text-[14px] home_label_id">Home</span>
          </div>
        </Link>
        <Link to={'/event'}>
          <div className={`flex flex-col items-center ${((location.pathname.split("/")).includes('event') ? true : false) ? "text-white" : "text-gray-400"} `}>
            <div className="mb-1 text-lg"><LuTickets size={20}/></div>
            <span className="text-[14px] events_label_id">Events</span>
          </div>
        </Link>
        <Link to={'/account'}>
          <div className={`flex flex-col items-center ${((location.pathname.split("/")).includes('account') ? true : false) ? "text-white" : "text-gray-400"} `}>
            <div className="mb-1 text-lg"><HiMiniBuildingOffice2 size={20}/></div>
            <span className="text-[14px] office_label_id">Office</span>
          </div>
        </Link>
        <Link to={'/details'}>
          <div className={`flex flex-col items-center ${((location.pathname.split("/")).includes('details') ? true : false) ? "text-white" : "text-gray-400"} `}>
            <div className="mb-1 text-lg"><FaRegCircleUser size={20}/></div>
            <span className="text-[14px] profile_label_id">Profile</span>
          </div>
        </Link>
      </div>
    )
  }

  const TopCategories = () =>{
    return(
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div
          onClick={() => navigate('/travel')}
          className={`cursor-pointer flex flex-col items-center p-3 md:shadow-md shadow-sm border rounded-xl w-[80px] md:w-[90px] ${
            location.pathname.includes('travel') ? "bg-[#031956] text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          <div className="mb-1 text-xl"><MdOutlineAirplanemodeActive /></div>
          <span className="text-[12px] md:text-[15px] travel_label_id">Travel</span>
        </div>

        <div
          onClick={() => navigate('/academy-index')}
          className={`cursor-pointer flex flex-col items-center p-3 md:shadow-md shadow-sm border rounded-xl w-[80px] md:w-[90px] ${
            location.pathname.includes('academy-index') || location.pathname.includes('academy') ? "bg-[#031956] text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          <div className="mb-1 text-xl"><RiGraduationCapLine /></div>
          <span className="text-[12px] md:text-[15px] academy_label_id">Learn</span>
        </div>

        <div
          onClick={() => navigate('/earn')}
          className={`cursor-pointer flex flex-col items-center p-3 md:shadow-md shadow-sm border rounded-xl w-[80px] md:w-[90px] ${
            location.pathname.includes('earn') ? "bg-[#031956] text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          <div className="mb-1 text-xl"><LuCircleDollarSign /></div>
          <span className="text-[12px] md:text-[15px] earn_label_id">Earn</span>
        </div>

        <div
          onClick={() => navigate('/grow')}
          className={`cursor-pointer flex flex-col items-center p-3 md:shadow-md shadow-sm border rounded-xl w-[80px] md:w-[90px] ${
            location.pathname.includes('grow') ? "bg-[#031956] text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          <div className="mb-1 text-xl"><PiPottedPlantBold /></div>
          <span className="text-[12px] md:text-[15px] grow_label_id">Grow</span>
        </div>

        <div
          onClick={() => navigate('/shop')}
          className={`cursor-pointer flex flex-col items-center p-3 md:shadow-md shadow-sm border rounded-xl w-[80px] md:w-[90px] ${
            location.pathname.includes('shop') ? "bg-[#031956] text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          <div className="mb-1 text-xl"><BiStore /></div>
          <span className="text-[12px] md:text-[15px] shop_label_id">Shop</span>
        </div>

        <div
          onClick={() => navigate('/lifestyle')}
          className={`cursor-pointer flex flex-col items-center p-3 md:shadow-md shadow-sm border rounded-xl w-[80px] md:w-[90px] ${
            location.pathname.includes('lifestyle') ? "bg-[#031956] text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          <div className="mb-1 text-xl"><IoFitnessOutline /></div>
          <span className="text-[12px] md:text-[15px] lifestyle_label_id">Lifestyle</span>
        </div>

        <div
          onClick={() => navigate('/social')}
          className={`cursor-pointer flex flex-col items-center p-3 md:shadow-md shadow-sm border rounded-xl w-[80px] md:w-[90px] ${
            location.pathname.includes('social') ? "bg-[#031956] text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          <div className="mb-1 text-xl"><BiLike /></div>
          <span className="text-[12px] md:text-[15px] social_label_id">Social</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className=''>
        <Header 
        handleLanguageVisibility={() => setOpenLanguageSelection(true)}
        onPressAction={() => setOpen(!open)} 
        ActionState={open}
        />
      </div>

      {TopCategories()}

      {/* pages */}
      <Outlet />
      {/* pages */}
      <div>
        <Footer/>
      </div>
      {
        getOpenLanguageSelection
        && 
        <LanguageBottomSheet 
        selected={getSelectedLanguage}
        handleSelectContent={(event) => setSelectedLanguage(event)}
        handleClose={() => setOpenLanguageSelection(false)} 
        DataContent={auth_states.Languages}/>
      }

      {
        auth_states.StateToken &&
        BottomTabNavigator()
      }
     
    </div>
  )
}

export default HomePage