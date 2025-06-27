import React, {useState} from 'react'
import {useSelector} from 'react-redux';
import { useDispatch } from "react-redux";

import {
    Outlet,
} from "react-router";
import { useLocation } from 'react-router-dom';

import { FiBell } from "react-icons/fi";
import { FaChevronRight } from "react-icons/fa"; 
import { FiUser } from "react-icons/fi";
import { FaRegEnvelopeOpen } from "react-icons/fa";
import { GrDocumentUser } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { BiBasket } from "react-icons/bi";
import { TfiReceipt } from "react-icons/tfi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { TiHomeOutline } from "react-icons/ti";
import { GrShieldSecurity } from "react-icons/gr";

import { FaUsers, FaShoppingBag, FaUser } from "react-icons/fa";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuTickets } from "react-icons/lu";
import { AiFillNotification } from "react-icons/ai";
import { FiAlignLeft } from "react-icons/fi";

import Logo2 from '../../assets/images/ten/logo2.png'

import { Link } from "react-router-dom";

import * as AuthAction from '../../store/auth/authAction'

import {
  clear
} from '../../store/store-index'

const AccountPage = () => {

  const dispatch = useDispatch()

  const auth_states = useSelector(state => state.AuthReducer);

  const [getBottomDetailsOpen, setBottomDetailsOpen] = useState(false);

  const location = useLocation();

  const LogoutUser = async () =>{
    await clear().then((result) =>{
      dispatch(AuthAction.LogoutUser())
    }).catch((err) =>{
      console.log(err.message)
    })
  }

  const Header = ({onPressDropDown}) =>{
    return (
      <header className="flex items-center justify-between w-full px-3 py-2 mb-8 text-white">
        {/* Right Section */}
        <div className="flex items-center space-x-4 ">
          <label htmlFor="my-drawer" className="btn btn-square btn-ghost drawer-button">
            <FiAlignLeft size={25} color='black'/>
          </label>
          <div className="text-sm ">
            <p className="text-xs text-gray-400">Welcome back!</p>
            <p className="font-medium text-black">
              {`${auth_states.StateToken ? auth_states.StateUserInformation.first_name : ","}`}
            </p>
          </div>
        </div>
        {/* <div>
          <FiBell className="w-5 h-5 cursor-pointer hover:text-lime-400" color='black'/>
        </div> */}
      </header>
    )
  }

  const _Buttons = ({title, icon, hasBG=true}) =>{
    return(
      <button className={`${hasBG ? 'bg-white btn shadow-sm rounded-xl' : "flex flex-col items-center justify-center h-[130px] bg-transparent"} `}>
        {
          icon &&
          <div className={`bg-blue-600 p-2 flex justify-center text-xl w-[35px] h-[35px] font-bold text-white  rounded-full`}>
            {icon}
          </div>
        }
        <p className="mt-1 text-sm capitalize">{title}</p>
      </button>
    )
  }
  
  const _link = (route, itemTitle) =>{
    return(
      <Link to={route}>
          <p className='ml-2 capitalize'>
              {itemTitle}
          </p>
      </Link>
    )
  }

  const DrawerComp = () =>{
    return(
      <div 
      className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <Header onPressDropDown={() => setBottomDetailsOpen(true)}/>
        {/* navigation pages */}
        <div className=''>
          <div className='w-11/12 mx-auto'>
            <Outlet />
          </div>
        </div>
      </div> 
      <div className="z-50 drawer-side">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div class="flex h-screen">
          <aside class="w-64 bg-white border-r border-gray-200 p-4">
            <div class="flex items-center space-x-2 my-6">
              <FiUser />
              <span class="text-sm text-gray-700">
                {`${auth_states.StateUserInformation.first_name} ${auth_states.StateUserInformation.last_name}`}
              </span>
            </div>
            <nav class="space-y-2">
              <a href="#" class={`${("h-1/3").includes(location.pathname) ? 'bg-gray-100  text-indigo-600' : 'hover:bg-gray-100 text-gray-600'} flex items-center p-2 rounded-lg`}>
                <TiHomeOutline size={20}/>
                {_link("/", "Home")}
              </a>
              <a href="#" class={`${("account").includes(location.pathname) ? 'bg-gray-100  text-indigo-600' : 'hover:bg-gray-100 text-gray-600'} flex items-center p-2 rounded-lg`}>
                <MdOutlineAccountBalanceWallet size={20}/>
                {_link("/account", "My Office")}
              </a>
              <a href="#" class={`${("/content/add-content").includes(location.pathname) ? 'bg-gray-100  text-indigo-600' : 'hover:bg-gray-100 text-gray-600'} flex items-center p-2 rounded-lg`}>
                <FaRegEnvelopeOpen />
                {_link("/subscriptions", "Subscription")}
              </a>
              <a href="#" class={`${("orders").includes(location.pathname) ? 'bg-gray-100  text-indigo-600' : 'hover:bg-gray-100 text-gray-600'} flex items-center p-2 rounded-lg`}>
                <TfiReceipt />
                {_link("/orders", "Orders")}
              </a>
              {/* <a href="#" class={`${("/content/add-content").includes(location.pathname) ? 'bg-gray-100  text-indigo-600' : 'hover:bg-gray-100 text-gray-600'} flex items-center p-2 rounded-lg`}>
                <FaHistory  />
                {_link("/content/", "Transaction History")}
              </a> */}
              <a href="#" class={`${("details").includes(location.pathname) ? 'bg-gray-100  text-indigo-600' : 'hover:bg-gray-100 text-gray-600'} flex items-center p-2 rounded-lg`}>
                <FaRegUser />
                {_link("/details", "Profile")}
              </a>
              <a href="#" class={`${("details").includes(location.pathname) ? 'bg-gray-100  text-indigo-600' : 'hover:bg-gray-100 text-gray-600'} flex items-center p-2 rounded-lg`}>
                <GrShieldSecurity />
                {_link("/security", "Security")}
              </a>
              <button onClick={() => LogoutUser()}>
                <a href="#" class={`text-gray-600 flex items-center p-2 rounded-lg`}>
                  <AiOutlineLogout  size={20}/>
                  <p className='logout_id text-[#001d3d] capitalize ml-2 '>Logout</p>
                </a>
              </button>
            </nav>
          </aside>
        </div>
      </div>
    </div>
    )
  }

  const TabItem = ({ icon, label, active, path }) =>{
    return (
      <Link to={path}>
        <div className={`flex flex-col items-center ${(location.pathname.split('/')).includes(path)  ? "text-white" : "text-gray-400"} `}>
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
        <TabItem icon={<AiFillNotification size={20}/>} path={'/'} label="Social" active />
        <TabItem icon={<LuTickets size={20}/>} path={'/event'} label="Events" />
        <TabItem icon={<FaShoppingBag size={20}/>} path={'/mall'} label="Mall" />
        <TabItem icon={<HiMiniBuildingOffice2 size={20}/>} path={'account'} label="Office" />
        <TabItem icon={<FaRegCircleUser size={20}/>} path={'details'} label="Profile" />
      </div>
    )
  }

  return (
    <div className="h-[90%] bg-[#001d3d] flex flex-col items-center justify-end">
      {/* Logo */}
      {/* <div className="flex items-center justify-between w-full px-3 py-2 text-white">
        <div className="">
          <Link to={'/'}>
            <a href="#" className='flex items-center'>
              <img
                className="w-[60px] md:w-[100px]"
                alt="Tailwind CSS chat bubble component"
                src={Logo2} />
            </a>
          </Link>
        </div>
      </div> */}
      
      {/* <div className="h-[100%] w-full bg-white rounded-t-[50px] py-14"> */}
      <div className="h-[100%] w-full bg-white pb-16 pt-5">
        {/* <Outlet /> */}
        <DrawerComp/>
      </div>
      {/* pages */}

      <BottomTabNavigator/>
    </div>
  )
}

export default AccountPage