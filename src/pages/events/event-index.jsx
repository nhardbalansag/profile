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

import { FaUsers, FaShoppingBag, FaUser } from "react-icons/fa";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaRegCircleUser } from "react-icons/fa6";

import { MdOutlineAirplanemodeActive } from "react-icons/md";
import { MdOutlineStorefront } from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";
import { HiShoppingBag } from "react-icons/hi2";
import { LuTickets } from "react-icons/lu";
import { AiFillNotification } from "react-icons/ai";

const EventPage = () => {

  const auth_states = useSelector(state => state.AuthReducer);

  const location = useLocation();

  const [open, setOpen] = useState(false)
  const [getOpenLanguageSelection, setOpenLanguageSelection] = useState(false)
  const [getSelectedLanguage, setSelectedLanguage] = useState("")

  const TabItem = ({ icon, label, active, path }) =>{
    return (
      <Link to={path}>
        <div className={`flex flex-col items-center ${active  ? "text-white" : "text-gray-400"} `}>
          <div className="mb-1 text-lg">{icon}</div>
          <span className="text-[14px]">{label}</span>
        </div>
      </Link>
    )
  }

  const BottomTabNavigator = () =>{
    return (
      <div 
      style={{
        position: 'fixed',
        height: '70px',
        zIndex: 1000
      }}
      className="md:hidden bottom-4 left-1/2 transform -translate-x-1/2 bg-[#031956] text-white rounded-xl px-4 py-1 flex justify-between items-center w-[90%] space-x-6 shadow-lg">
        <TabItem icon={<AiFillNotification size={20}/>} path={'/'} label="Social" />
        <TabItem icon={<LuTickets size={20}/>} path={'/event'} label="Events"  active={(location.pathname.split('/')).includes("event")}/>
        <TabItem icon={<FaShoppingBag size={20}/>} path={'/mall'} label="Mall"/>
        <TabItem icon={<HiMiniBuildingOffice2 size={20}/>} path={'/account'} label="Office" />
        <TabItem icon={<FaRegCircleUser size={20}/>} path={'/details'} label="Profile" />
      </div>
    )
  }

  const CategorizeButton  = ({icon, label, active, path}) =>{
    return(
      <Link to={path}>
        <div
          className={`flex flex-col items-center p-3 md:shadow-md shadow-sm border rounded-xl w-[80px] md:w-[90px] ${
            active ? "bg-[#031956] text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          <div className="mb-1 text-xl">{icon}</div>
          <span className="text-[14px] md:text-[15px]">{label}</span>
        </div>
      </Link>
    )
  }

  const TopCategories = () =>{
    return(
      <div className="flex items-center justify-center space-x-2">
          <CategorizeButton icon={ <MdOutlineAirplanemodeActive />} path={"/mall"} label={"Travel"} active={("/mall").includes(location.pathname) ? true : false}/>
          <CategorizeButton icon={ <MdOutlineStorefront />} path={"merchant"} label={"Merchants"} active={(location.pathname.split("/")).includes('merchant') ? true : false}/>
          <CategorizeButton icon={ <RiGraduationCapLine  />} label={"Academy"} active={false}/>
          <CategorizeButton icon={ <HiShoppingBag />} label={"Shopping"} active={false}/>
      </div>
    )
  }

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