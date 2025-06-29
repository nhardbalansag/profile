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

  const TabItem = ({ icon, label, active, path }) =>{

    return (
      <Link to={path}>
        <div className={`flex flex-col items-center ${active ? "text-white" : "text-gray-400"} `}>
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
        {/* <TabItem icon={<AiFillNotification size={20}/>} path={'/'} label="News" active /> */}
        <TabItem icon={<TiHomeOutline size={20}/>} path={'/'} label="Home" active />
        <TabItem icon={<LuTickets size={20}/>} path={'/event'} label="Events" />
        {/* <TabItem icon={<FaShoppingBag size={20}/>} path={'/mall'} label="Mall" /> */}
        <TabItem icon={<HiMiniBuildingOffice2 size={20}/>} path={'account'} label="Office" />
        <TabItem icon={<FaRegCircleUser size={20}/>} path={'details'} label="Profile" />
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
          <span className="text-[12px] md:text-[15px]">{label}</span>
        </div>
      </Link>
    )
  }

  const TopCategories = () =>{
    return(
      <div className="flex items-center justify-center space-x-2">
          <CategorizeButton icon={ <MdOutlineAirplanemodeActive />} path={"/travel"} label={"Travel"} active={(location.pathname.split("/")).includes('travel') ? true : false}/>
          <CategorizeButton icon={ <RiGraduationCapLine  />} path={"academy-index"} label={"Learn"} active={location.pathname.includes('academy') ? true : false}/>
          <CategorizeButton icon={ <LuCircleDollarSign />} label={"Earn"} active={false}/>
          <CategorizeButton icon={ <MdOutlineStorefront />} path={"merchant"} label={"Lifestyle"} active={(location.pathname.split("/")).includes('merchant') ? true : false}/>
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

      <TopCategories/>
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
        <BottomTabNavigator/>
      }
     
    </div>
  )
}

export default HomePage