import React from 'react'

import { RiCoinsLine } from "react-icons/ri";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import { BsCalendar2Check } from "react-icons/bs";
import { LuCalendarClock } from "react-icons/lu";
import { IoPartlySunnyOutline } from "react-icons/io5";
import { IoCloudyNightOutline } from "react-icons/io5";
import { SlWallet } from "react-icons/sl";
import { FiHelpCircle } from "react-icons/fi";

const pricingData = {
    standard: {
        title: "STANDARD",
        subtitle: "2 Guests Per Room",
        price: "$1088",
        note: "TP not applicable",
    },
    vip: {
        title: "VIP",
        subtitle: "2 Guests Per Room",
        price: "$1288",
        note: "Includes TP",
    },
    pca: {
        title: "PCA",
        subtitle: "Private Room",
        price: "$1588",
        note: "All-inclusive package",
    },
}  

const OffersBottomSheet = ({
    handleClose,
    handleDecrease,
    handleIncrease,
    count,
    activeTab,
    selectTab,
    tabData
}) => {

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40">
        <div className="w-full max-w-md md:p-4 p-2 transition-transform bg-white shadow-lg rounded-t-2xl max-h-[90%] overflow-y-auto">
            <div className='flex justify-end'>
                <button onClick={handleClose} className='flex items-center justify-center p-1 mr-2'>
                <IoIosCloseCircleOutline  className="text-[23px] text-[#ff4949]" />
                </button>
            </div>

            <div role="tablist" className="flex justify-center mb-4 tabs tabs-lift">
                {Object.keys(tabData).map((key) => (
                <a
                    key={key}
                    role="tab"
                    className={`tab text-[20px] ${activeTab === key ? "tab-active text-[#282727] font-extrabold" : ""}`}
                    onClick={selectTab}
                >
                    {pricingData[key].title}
                </a>
                ))}
            </div>
        
            <div className="max-w-md p-5 mx-auto space-y-6 bg-white border shadow-lg md:p-6 rounded-2xl ">
                <div className='space-y-6'>
                <div className='mt-3 space-y-2'>
                    <div className="flex items-center justify-start space-x-3">
                    <div className="flex items-center space-x-2">
                        <IoPartlySunnyOutline  className="text-[15px] text-[#FF5722]" />
                        <label className="text-black text-[12px]">3 Days</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <IoCloudyNightOutline   className="text-[15px] text-[#FF5722]" />
                        <label className="text-black text-[12px]">3 Nights</label>
                    </div>
                    </div>
                </div>
                
                <div className='mt-3 space-y-2'>
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <BsCalendar2Check className="text-[15px] text-[#FF5722]" />
                        <label className="text-gray-500 text-[12px]">Date</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <p  className="text-[12px]">Feb 01, 2024 - Feb 01, 2024 </p>
                    </div>
                    </div>
                </div>

                <div className='mt-3 space-y-2'>
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <LuCalendarClock  className="text-[15px] text-[#FF5722]" />
                        <label className="text-gray-500 text-[12px]">Registration End</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <p  className="text-[12px]">Feb 01, 2024</p>
                    </div>
                    </div>
                </div>

                <div className='space-y-2'>
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <HiOutlineUsers    className="text-[18px] text-[#FF5722]" />
                        <label className="text-gray-500 text-[12px]">Guest</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleDecrease } className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                        <CiCircleMinus   className="text-[18px] text-blue-600" />
                        </button>
                        <div className="flex items-center justify-center w-10 h-7 text-[13px]  text-black border rounded">
                        {count}
                        </div>
                        <button onClick={handleIncrease} className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                        <CiCirclePlus   className="text-[18px] text-blue-600" />
                        </button>
                    </div>
                    </div>

                    <div className='flex items-center justify-end'>
                    <p className='text-[12px] text-gray-500'>(note: maximum guest is 2)</p>
                    </div>
                </div>
                </div> 

                <div className="flex items-center justify-between p-4 border border-blue-500 rounded-lg bg-blue-50">
                <div>
                    <p className="font-medium">Twin Sharing</p>
                    <p className="text-sm text-gray-500">2 guest per room</p>
                    {/* <button className="mt-1 text-sm font-medium text-blue-600">Select offer</button> */}
                </div>
                <div className="text-lg font-bold text-center"> 
                    <p>$1800</p>
                </div>
                </div>
        
                <div className="space-y-4 border-b-[1px] pb-3">
                <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                    <RiCoinsLine   className="text-[25px] text-[#FF5722]" />
                    <p className='text-[12px] ml-2 text-black'>Redeem T-Points</p>
                    </div>
                    <p className='text-[15px] ml-2 text-black font-semibold'>10</p>
                </div>

                <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                    <FiHelpCircle className="text-[15px] text-[#FF5722]" />
                    <p className='text-[10.5px] ml-2 text-black'><strong>1 T-Point</strong> is equal to <strong> $1 USD</strong></p>
                    </div>
                    <p className='text-[11px] ml-2 text-black font-semibold'>$10 USD</p>
                </div>
                <div className='flex items-center'>
                    <p className='text-[12px] text-gray-500'>(Tip: Redeem your T-Points for instant discounts!)</p>
                </div>
                </div>

                <div className="pb-3 text-right border-b"> 
                <div className='flex items-center justify-between'>
                    <p className="text-[11px]">Price</p>
                    <p className="text-lg font-semibold">$1800.00</p>
                </div>
                <div className='flex items-center justify-between'>
                    <p className="text-[11px]">Applied T-Points</p>
                    <p className="text-lg font-semibold border-b-2 border-black"> - $10.00</p>
                </div>
                <div className='flex items-center justify-between'>
                    <p className="text-[11px]">Total Price</p>
                    <p className="text-lg text-[24px] font-bold">$1790.00</p>
                </div>
                </div>

                <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                    <SlWallet   className="text-[15px] text-[#FF5722]" />
                    <p className='text-[12px] ml-2 text-black'>My T-Points Wallet</p>
                </div>
                <p className='text-[12px] ml-2 text-black font-semibold'>100</p>
                </div>

                <label className="flex items-center gap-2">
                <input type="checkbox" name="upload_is_link" className="toggle toggle-sm" /> 
                <p className='text-[12px]'>Redeem Full T-Points Amount</p>
                </label>
                
                <div className="flex items-end justify-center space-x-2">
                <button onClick={handleDecrease } className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                    <CiCircleMinus   className="text-[25px] text-[#FF5722]" />
                </button>
                <div className='flex items-center justify-center text-center'>
                    <div>
                    <label className="label text-[12px]">T-Points Amount</label>
                    <input type="number" name="content_days_count" placeholder="0" value={count} className="w-[80px] input input-bordered input-md" />
                    </div>
                </div>
                <button onClick={handleIncrease} className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                    <CiCirclePlus   className="text-[25px] text-[#FF5722]" />
                </button>
                </div>
        
                <div className="space-y-3">
                <div className="flex items-center justify-end pt-4">
                    <div className="flex gap-3">
                    <button  onClick={handleClose} className="px-2 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100">Cancel</button>
                    <button className="px-2 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Checkout</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OffersBottomSheet