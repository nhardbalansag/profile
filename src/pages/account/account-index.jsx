import React, {useState} from 'react'
import {useSelector} from 'react-redux';
import {
    Outlet,
} from "react-router";

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

import Logo2 from '../../assets/images/ten/logo2.png'

import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaLanguage, FaEnvelope } from 'react-icons/fa';

import { Link } from "react-router-dom";

const AccountPage = () => {

  const [getBottomDetailsOpen, setBottomDetailsOpen] = useState(false);

  const Header = ({onPressDropDown}) =>{
    return (
      <header className="flex items-center justify-between w-full px-10 py-2 mb-8 text-white">
        {/* Right Section */}
        <div className="flex items-center space-x-4 ">
          <div className="flex items-center space-x-10">
            <div className="text-sm ">
              <p className="text-xs text-gray-400">Welcome back!</p>
              <p className="font-medium text-black">Bernard Balansag</p>
            </div>
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost drawer-button">
              <FaChevronRight className="text-xs" color='black'/>
            </label>
          </div>
        </div>
        <div>
          <FiBell className="w-5 h-5 cursor-pointer hover:text-lime-400" color='black'/>
        </div>
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
      <div className="drawer">
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
              <span class="text-sm text-gray-700">Bernard Balansag</span>
            </div>
            <nav class="space-y-2">
              <a href="#" class={`${("account").includes(location.pathname) ? 'bg-gray-100  text-indigo-600' : 'hover:bg-gray-100 text-gray-600'} flex items-center p-2 rounded-lg`}>
                <MdOutlineAccountBalanceWallet size={20}/>
                {_link("/account", "My Account")}
              </a>
              <a href="#" class={`${("/content/add-content").includes(location.pathname) ? 'bg-gray-100  text-indigo-600' : 'hover:bg-gray-100 text-gray-600'} flex items-center p-2 rounded-lg`}>
                <FaRegEnvelopeOpen />
                {_link("/content/", "Subscription")}
              </a>
              <a href="#" class={`${("orders").includes(location.pathname) ? 'bg-gray-100  text-indigo-600' : 'hover:bg-gray-100 text-gray-600'} flex items-center p-2 rounded-lg`}>
                <TfiReceipt />
                {_link("/orders", "Orders")}
              </a>
              <a href="#" class={`${("/content/add-content").includes(location.pathname) ? 'bg-gray-100  text-indigo-600' : 'hover:bg-gray-100 text-gray-600'} flex items-center p-2 rounded-lg`}>
                <FaHistory  />
                {_link("/content/", "Transaction History")}
              </a>
              <a href="#" class={`${("details").includes(location.pathname) ? 'bg-gray-100  text-indigo-600' : 'hover:bg-gray-100 text-gray-600'} flex items-center p-2 rounded-lg`}>
                <FaRegUser />
                {_link("/details", "User Profile")}
              </a>
            </nav>
          </aside>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="h-[90%] bg-[#001d3d] flex flex-col items-center justify-end">
      {/* Logo */}
      <div className="flex items-center justify-between w-full px-10 py-2 text-white">
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
      </div>
      
      <div className="h-[90%] w-full bg-[#f7f8fa] bg-white rounded-t-[50px] py-14">
        {/* <Outlet /> */}
        <DrawerComp/>
       
      </div>
      {/* pages */}
    </div>
  )
}

export default AccountPage