import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
    Outlet,
} from "react-router";
import { Link } from "react-router-dom";
import {
  Header,
  Footer,
  LanguageBottomSheet
} from "../../component/index"

import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaRegCircleUser } from "react-icons/fa6";
import { TiHomeOutline } from "react-icons/ti";

import { LuTickets } from "react-icons/lu";

const EventPage = () => {

  const auth_states = useSelector(state => state.AuthReducer);

  const location = useLocation();

  const [open, setOpen] = useState(false)
  const [getOpenLanguageSelection, setOpenLanguageSelection] = useState(false)
  const [getSelectedLanguage, setSelectedLanguage] = useState("")

  // const TabItem = ({ icon, label, active, path }) =>{
  //   return (
  //     <Link to={path}>
  //       <div className={`flex flex-col items-center ${active  ? "text-white" : "text-gray-400"} `}>
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
          <div className={`flex flex-col items-center text-gray-400`}>
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
  //         <span className="text-[14px] md:text-[15px]">{label}</span>
  //       </div>
  //     </Link>
  //   )
  // }

  // const TopCategories = () =>{
  //   return(
  //     <div className="flex items-center justify-center space-x-2">
  //         <CategorizeButton icon={ <MdOutlineAirplanemodeActive />} path={"/mall"} label={"Travel"} active={("/mall").includes(location.pathname) ? true : false}/>
  //         <CategorizeButton icon={ <MdOutlineStorefront />} path={"merchant"} label={"Merchants"} active={(location.pathname.split("/")).includes('merchant') ? true : false}/>
  //         <CategorizeButton icon={ <RiGraduationCapLine  />} label={"Academy"} active={false}/>
  //         <CategorizeButton icon={ <HiShoppingBag />} label={"Shopping"} active={false}/>
  //     </div>
  //   )
  // }

  return (
    <div>
      <div className='mb-3'>
        <Header 
        handleLanguageVisibility={() => setOpenLanguageSelection(true)}
        onPressAction={() => setOpen(!open)} 
        ActionState={open}
        />
      </div>
      <div className='flex justify-center my-5'>
        <div className='md:w-[75%] w-[95%]'>
          <p className='font-extrabold text-[#001d3d] text-[25px] capitalize'>Events Near you</p>
        </div>
      </div>
      {/* pages */}
      <Outlet />
      {/* pages */}
      {
        getOpenLanguageSelection
        && 
        <LanguageBottomSheet 
        selected={getSelectedLanguage}
        handleSelectContent={(event) => setSelectedLanguage(event)}
        handleClose={() => setOpenLanguageSelection(false)} 
        DataContent={auth_states.Languages}/>
      }

      <BottomTabNavigator/>
    </div>
  )
}

export default EventPage