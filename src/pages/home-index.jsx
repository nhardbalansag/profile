import React, {useState} from 'react'
import {useSelector} from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
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

import { MdOutlineAirplanemodeActive } from "react-icons/md";
import { MdOutlineStorefront } from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";
import { HiShoppingBag } from "react-icons/hi2";

const HomePage = () => {

  const auth_states = useSelector(state => state.AuthReducer);
  const location = useLocation();

  const [open, setOpen] = useState(false)
  const [getOpenLanguageSelection, setOpenLanguageSelection] = useState(false)
  const [getSelectedLanguage, setSelectedLanguage] = useState("")

  // const TabItem = ({ icon, label, active, path }) =>{

  //   return (
  //     <Link to={path}>
  //       <div className={`flex flex-col items-center ${active ? "text-white" : "text-gray-400"} `}>
  //         <div className="mb-1 text-lg">{icon}</div>
  //         <span className="text-[14px]">{label}</span>
  //       </div>
  //     </Link>
  //   )
  // }

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

  // const CategorizeButton  = ({icon, label, active, path}) =>{
  //   return(
  //     <Link to={path}>
  //       <div
  //         className={`flex flex-col items-center p-3 md:shadow-md shadow-sm border rounded-xl w-[80px] md:w-[90px] ${
  //           active ? "bg-[#031956] text-white" : "bg-gray-200 text-gray-500"
  //         }`}
  //       >
  //         <div className="mb-1 text-xl">{icon}</div>
  //         <span className="text-[12px] md:text-[15px]">{label}</span>
  //       </div>
  //     </Link>
  //   )
  // }

  const TopCategories = () =>{
    return(
      <div className="flex items-center justify-center space-x-2">
          <Link to={'/travel'}>
            <div
              className={`flex flex-col items-center p-3 md:shadow-md shadow-sm border rounded-xl w-[80px] md:w-[90px] ${
                ((location.pathname.split("/")).includes('travel') ? true : false) ? "bg-[#031956] text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              <div className="mb-1 text-xl"><MdOutlineAirplanemodeActive /></div>
              <span className="text-[12px] md:text-[15px] travel_label_id">Travel</span>
            </div>
          </Link>
          
          <Link to={'academy-index'}>
            <div
              className={`flex flex-col items-center p-3 md:shadow-md shadow-sm border rounded-xl w-[80px] md:w-[90px] ${
                ((location.pathname.split("/")).includes('academy-index') ? true : false) ? "bg-[#031956] text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              <div className="mb-1 text-xl"><RiGraduationCapLine /></div>
              <span className="text-[12px] md:text-[15px] academy_label_id">Academy</span>
            </div>
          </Link>

          <Link to={'/earn'}>
            <div
              className={`flex flex-col items-center p-3 md:shadow-md shadow-sm border rounded-xl w-[80px] md:w-[90px] ${
                ((location.pathname.split("/")).includes('earn') ? true : false) ? "bg-[#031956] text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              <div className="mb-1 text-xl"><LuCircleDollarSign /></div>
              <span className="text-[12px] md:text-[15px] earn_label_id">Earn</span>
            </div>
          </Link>

          <Link to={'/lifestyle'}>
            <div
              className={`flex flex-col items-center p-3 md:shadow-md shadow-sm border rounded-xl w-[80px] md:w-[90px] ${
                ((location.pathname.split("/")).includes('lifestyle') ? true : false) ? "bg-[#031956] text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              <div className="mb-1 text-xl"><IoFitnessOutline /></div>
              <span className="text-[12px] md:text-[15px] lifestyle_label_id">Lifestyle</span>
            </div>
          </Link>
      </div>
    )
  }

  return (
    <div>
      <div>
        <Header 
        handleLanguageVisibility={() => setOpenLanguageSelection(true)}
        onPressAction={() => setOpen(!open)} 
        ActionState={open}
        />
      </div>

      {/* <TopCategories/> */}
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