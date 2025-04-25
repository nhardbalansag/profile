import React, {useState} from 'react'
import {useSelector} from 'react-redux';
import {
    Outlet,
} from "react-router";

import QRCode from "react-qr-code";
import { FiBell } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa"; 
import Logo2 from '../../assets/images/ten/logo2.png'

import { Link } from "react-router-dom";

const AccountPage = () => {

  const [getBottomDetailsOpen, setBottomDetailsOpen] = useState(false);

  const Header = ({onPressDropDown}) =>{
    return (
      <header className="flex items-center justify-between w-full px-10 py-2 text-white ">
        {/* Logo */}
        <div className="flex items-center space-x-2 ">
          <Link to={'/'}>
            <a href="#" className='flex items-center'>
              <img
                className="w-[60px] md:w-[100px]"
                alt="Tailwind CSS chat bubble component"
                src={Logo2} />
            </a>
          </Link>
        </div>
  
        {/* Right Section */}
        <div className="flex items-center space-x-4 ">
          <FiBell className="w-5 h-5 cursor-pointer hover:text-lime-400" />
          <div className="flex items-center space-x-10">
            <img
              src="https://i.pravatar.cc/150?img=47"
              alt="user"
              className="object-cover w-8 h-8 rounded-full"
            />
            <div className="hidden text-sm sm:block">
              <p className="text-xs text-gray-400">Welcome back!</p>
              <p className="font-medium">Bernard Balansag</p>
            </div>
            <button onClick={onPressDropDown}>
              <FaChevronDown className="text-xs" />
            </button>
          </div>
        </div>
      </header>
    )
  }

  const _BottomActionSheet = () =>{
    return(
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40">
        <div className="w-full md:w-[95%] p-[45px] md:px-[50px] py-10 transition-transform bg-white shadow-lg rounded-t-[50px] max-h-[75%] md:max-h-[90%] overflow-y-auto">
          <div className='flex flex-row items-start justify-center space-x-5'>
            <div className="flex flex-col items-center justify-center space-y-5">
              <div className="text-center">
                <p className="text-[18px] font-semibold uppercase">bernard balansag</p>
                <p className="text-[15px] font-thin">123456789102</p>
              </div>
              <div>
                <QRCode
                  value="asdfafda/lkja;sdflkadf asdfafl;kj asdf asdf asdfa asdf  adf asdf  asdfasd"
                  size={150}
                  viewBox={`0 0 256 256`}
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <AccountDetails/>
            </div>
          </div>
        </div>
      </div>
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
  
  const AccountDetails = () =>{
    return (
      <div className="">
        <div className="space-y-6">
          <nav className="flex flex-col space-y-2">
            <Link to={'/account'}>
              <a href="#" className="text-gray-600 underline hover:text-orange-600">Account</a>
            </Link>
            <Link to={'/details'}>
              <a href="#" className="text-gray-600 underline hover:text-orange-600">Personal information</a>
            </Link>
            <a href="#" className="text-gray-600 underline hover:text-orange-600">Subscription</a>
            <a href="#" className="text-gray-600 underline hover:text-orange-600">Order History</a>
            <a href="#" className="text-gray-600 underline hover:text-orange-600">Checkouts</a>
            <a href="#" className="text-gray-600 underline hover:text-orange-600">Logout</a>
            <a onClick={() => setBottomDetailsOpen(false)} href="#" className="text-gray-600 underline hover:text-orange-600">Close</a>
          </nav>
        </div>
      </div>
    )
  }

  return (
    <div className="h-svh bg-[#001d3d] flex flex-col items-center justify-end">
      <Header onPressDropDown={() => setBottomDetailsOpen(true)}/>
      {/* pages */}
      <div className="h-[90%] w-full bg-[#f7f8fa] rounded-t-[50px] py-14">
        <Outlet />
      </div>
      {/* pages */}
      {
        getBottomDetailsOpen &&
        <_BottomActionSheet/>
      }
    </div>
  )
}

export default AccountPage