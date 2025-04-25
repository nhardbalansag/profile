import { useState } from "react";
import { FiSearch, FiBell } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { TbTransfer } from "react-icons/tb";
import { MdOutlineCardGiftcard } from "react-icons/md";
import { TbViewportTall } from "react-icons/tb";
import { LuHandshake } from "react-icons/lu";
import { BsGraphUpArrow } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { PiBankBold } from "react-icons/pi";
import { AiOutlineLogout } from "react-icons/ai";
import { FaEdit } from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";

import QRCode from "react-qr-code";

import Logo2 from '../../assets/images/ten/logo2.png'

import { Link } from "react-router-dom";

import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { parse } from "date-fns";

const AccountContent = () =>{

  const [getBottomDetailsOpen, setBottomDetailsOpen] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Mila Meloni',
    email: 'milameloni@mail.com',
    password: '*********'
  });

  const _SlideComponent = ({children}) =>{
    return(
      <Swiper
      //#region swiper parameter
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={5}
        slidesPerView={1}
        onSlideChange={() => setCollapseDetails(false)}
      //#endregion
      >
        {
          [
            {
              title: 't-points',
              balance: 100.00,
              button:[
                {
                  title: 'Redeem',
                  icon: <MdOutlineCardGiftcard className="text-[20px] text-white" />
                },
                {
                  title: 'Transfer',
                  icon: <TbTransfer className="text-[20px] text-white" />
                }
              ]
            },
            {
              title: 't-bucks',
              balance: 100.00,
              button:[
                {
                  title: 'Redeem',
                  icon: <MdOutlineCardGiftcard className="text-[20px] text-white" />
                },
                {
                  title: 'withdraw',
                  icon: <PiBankBold className="text-[20px] text-white" />
                }
              ]
            }
          ].map((item, index) => (
            <SwiperSlide key={index} className='flex justify-center py-5'>
              <_WalletCard title={item.title} amount={item.balance} buttons={item.button}/>
            </SwiperSlide>
          ))
        }
      </Swiper>
    )
  }

  const Header = ({onPressDropDown}) =>{
    const [active, setActive] = useState("Home");
  
    const menuItems = ["Wallet", "Transaction"];
  
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
          <nav className="hidden ml-4 space-x-2 md:flex">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`px-4 py-3 rounded-full font-medium ${
                  active === item ? "bg-lime-400 text-black" : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
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

  const _WalletCard = ({title, amount, buttons}) =>{
    return(
      <div className="w-[90%] border rounded-2xl p-5 bg-white shadow-lg space-y-3">
        <p className="text-[18px] md:text-[25px] uppercase font-semibold">{title}</p>
        <div>
          <p className="text-[15px] md:text-[18px] capitalize">balance</p>
          <p className="text-[20px] md:text-[40px] font-bold">{parseFloat(amount)}</p>
        </div>
        <div className="my-5">  
          <div className="flex items-center justify-start space-x-5">
            {
              buttons.map((item, index) => (
                <_Buttons icon={item.icon} title={item.title}/>
              ))
            }
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

  const _TransactionTable = () => {
    return(
      <div className="">
        <div className="space-x-3">
          <_Buttons title={'date'}/>
          <_Buttons title={'transaction type'}/>
          <_Buttons title={'amount'}/>
        </div>
        <div className="my-8 space-y-6">
          {
            [1,2, 3].map((item, index) => (
              <div className="flex justify-between">
                <div className="w-[200px]">
                  <p className="font-medium uppercase ">pca activation</p>
                  <p className="font-thin uppercase ">02/24/2025</p>
                </div>
                <div className="w-[200px] text-right">
                  <p className="space-x-2 font-medium uppercase">
                    <span>+</span>
                    <span>100</span>
                  </p>
                  <p className="font-thin uppercase ">150</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  const _BonusCard = ({icon, title, value, rate, rateStatus = true}) =>{
    return(
      <div className="flex flex-col w-[48%] gap-2 p-4 bg-white shadow-md rounded-xl">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="">
            {icon}
          </div>
          <p>{title}</p>
        </div>
        <div className="text-[18px] md:text-2xl font-semibold text-black">{value}</div>
        <div className="px-2 py-1 text-sm font-medium text-green-600 bg-green-100 rounded w-fit">
        {rateStatus ? '+' : '-'}{rate}%
        </div>
      </div>
    )
  }

  const FinanceSummary = () => {
    return (
      <div className="flex w-[90%] justify-between">
        <_BonusCard
          icon={<LuHandshake className="w-4 h-4 text-gray-600" />}
          title={'Direct Bonus'}
          value={100.00}
          rate={2.4}
          rateStatus={true}
        />
        
        <_BonusCard
          icon={<BsGraphUpArrow className="w-4 h-4 text-gray-600" />}
          title={'Market Bonus'}
          value={100.00}
          rate={1.2}
          rateStatus={false}
        />
      </div>
    )
  }

  const _BottomActionSheet = () =>{
    return(
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40">
        <div className="w-full md:w-[95%] p-[45px] md:px-[50px] py-10 transition-transform bg-white shadow-lg rounded-t-[50px] max-h-[75%] md:max-h-[90%] overflow-y-auto">
          <div className='flex justify-end'>
              <button onClick={() => setBottomDetailsOpen(false)} className='flex items-center justify-center text-[#ff4949] p-1 mr-2'>
                <span>Close</span>
                <IoMdClose  className="text-[23px] " />
              </button>
          </div>
          <div className='flex flex-col items-center justify-between md:justify-center md:gap-10 md:flex-row'>
            <div className="flex flex-col items-center justify-center space-y-5">
              <div className='flex items-center'>
                <img
                  className="w-[60px] md:w-[100px]"
                  alt="Tailwind CSS chat bubble component"
                  src={Logo2} />
              </div>
              <div className="text-center">
                <p className="text-[18px] font-semibold uppercase">bernard balansag</p>
                <p className="text-[15px] font-thin">123456789102</p>
              </div>
              <div>
                <QRCode
                  value="asdfafda/lkja;sdflkadf asdfafl;kj asdf asdf asdfa asdf  adf asdf  asdfasd"
                  size={260}
                  viewBox={`0 0 256 256`}
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-row items-center justify-center w-full space-x-10 md:justify-end">
                <_Buttons icon={<CiUser />} title={'Account'} hasBG={false}/>
                <_Buttons icon={<AiOutlineLogout />} title={'Logout'} hasBG={false}/>
              </div>
              <AccountDetails/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const AccountDetails = () =>{
    return (
      <div className="">
      {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2"> */}
        {/* Profile Details */}
        {/* <div className="space-y-6">
          <h2 className="text-2xl font-bold">Account details</h2>
          <div>
            <label className="block mb-1 text-sm font-semibold">Full name</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={profile.name}
                readOnly
                className="w-full input input-bordered"
              />
              <FaEdit className="text-gray-500 cursor-pointer" />
            </div>
          </div>
  
          <div>
            <label className="block mb-1 text-sm font-semibold">Email address</label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full input input-bordered"
              />
              <FaEdit className="text-gray-500 cursor-pointer" />
            </div>
          </div>
  
          <div>
            <label className="block mb-1 text-sm font-semibold">Password</label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={profile.password}
                readOnly
                className="w-full input input-bordered"
              />
              <FaEdit className="text-gray-500 cursor-pointer" />
            </div>
          </div>
        </div> */}
  
        {/* Plan Section */}
        <div className="space-y-6">
          <div className="p-4 border rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-orange-600">VIP (Yearly)</span>
              <span className="text-white badge badge-warning">$29.99/year</span>
            </div>
            <p className="text-sm">Next billing date</p>
            <p className="mb-2 font-semibold">April 25, 2026</p>
            <button className="w-full btn btn-outline btn-error">Cancel Subscription</button>
          </div>
  
          <div className="p-4 border rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">VIP (Monthly)</h3>
            <p className="my-2 text-sm">Discounts and T-Points are limited to one month for this subscription.</p>
            <button className="w-full btn btn-outline">DOWNGRADE</button>
          </div>
        </div>
      </div>
    )
  }
  

  return (
    <div className="h-svh bg-[#001d3d] flex flex-col items-center justify-end">
      {/* account header contents here */}
      <Header onPressDropDown={() => setBottomDetailsOpen(true)}/>
      <div className="h-[90%] w-full bg-[#f7f8fa] rounded-t-[50px] py-14">
        {/* account contents here */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="">
            <div className="flex items-center justify-between px-10">
              <p className="capitalize text-[15px] md:text-[18px]">account number</p>
              <p className="font-semibold capitalize text-[18px] md:text-[20px]">123456789102</p>
            </div>
            <div className="flex items-center justify-center mb-5">
              <_SlideComponent/>
            </div>
            <div className="flex items-center justify-center my-5">
              <FinanceSummary/>
            </div>
          </div>
          <div className="px-5 space-y-5">
            <div className="flex items-center justify-between">
              <p className="capitalize font-semibold text-[20px]">transaction history</p>
            </div>
            <_TransactionTable/>
          </div>
        </div>
      </div>
      {
        getBottomDetailsOpen &&
        <_BottomActionSheet/>
      }
    </div>
  ) 
}

export default AccountContent