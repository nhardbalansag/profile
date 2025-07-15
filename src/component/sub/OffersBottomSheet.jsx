import React, {useEffect} from 'react'
import {useSelector} from 'react-redux';
import { format } from 'date-fns';

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
import { FaRegClock } from "react-icons/fa6";
import { FaRegCalendar } from "react-icons/fa";
import { LuUsersRound } from "react-icons/lu";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoWalletSharp } from "react-icons/io5";

const OffersBottomSheet = ({
    handleClose,
    handleDecrease,
    handleIncrease,
    handleCheckout,
    count,
    activeTab,
    selectTab,
    tabData,
    offersData,
    finalAmount,
    wallet,
    tBucksWallet,

    handleRedeemFullTPoints,
    handleRedeemFullTBucks,

    isRedeemFull,
    isRedeemFullTBucks,

    customTPoints,
    customTBucks,

    handleCustomTPoints,
    handleCustomTBucks,

    handleDecreaseCustomPoints,
    handleIncreaseCustomPoints,

    handleDecreaseCustomBucks,
    handleIncreaseCustomBucks,

    children,
}) => {

    //#region translation convertion
    const auth_states = useSelector(state => state.AuthReducer);

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
    //#endregion

    return (
        <div 
        style={{
            zIndex: 4000
        }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40">
            <div className="w-full md:p-4 p-2 transition-transform bg-white shadow-lg rounded-t-2xl max-h-[90%] overflow-y-auto">
                <div className='flex justify-end'>
                    <button onClick={handleClose} className='flex items-center justify-center p-1 mr-2'>
                        <IoIosCloseCircleOutline  className="text-[23px] text-[#ff4949]" />
                    </button>
                </div>
                <div className='grid grid-cols-1 md:space-x-5 md:grid-cols-2'>
                    <div>
                        <label className="capitalize label font-bold text-[20px]">pricing options </label>

                        {children}
                    </div>
                    <div className="grid grid-cols-1 p-5 space-y-6 bg-white border shadow-lg md:p-6 rounded-2xl ">
                        <div className='space-y-6'>
                            <div className='space-y-6'>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex items-start gap-3 p-3 border border-blue-100 bg-blue-50 rounded-xl">
                                        <FaRegClock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 duration_id">Duration</p>
                                            <p className="text-xs text-gray-600">{offersData.content_days_count} <span className="days_id">Days</span>, {offersData.content_night_count} <span className="days_id">Nights</span></p>
                                            <p className="mt-1 text-xs text-gray-500">{format(new Date(offersData.content_date_from), 'MMM dd, yyyy')} - {format(new Date(offersData.content_date_to), 'MMM dd, yyyy')}</p>
                                        </div>
                                    </div>
                                    {
                                        tabData &&
                                        <div className="flex items-start gap-3 p-3 border border-green-100 bg-green-50 rounded-xl">
                                            <FaRegCalendar  className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 registration_end_id">Registration</p>
                                                <p className="text-xs text-gray-600 end_id">Ends {tabData.offers_table.offers_end_daily_period}</p>
                                                <p className="mt-1 text-xs text-gray-500">{format(new Date(tabData.offers_table.offers_end_effectivity_date), 'MMM dd, yyyy')}</p>
                                            </div>
                                        </div>
                                    }
                                </div>

                                {
                                    count ?
                                    <div className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                <LuUsersRound className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-900 guest_label_id">Guests</span>
                                                <p className="text-xs text-gray-500"> <span className='max_label_id'>Max</span> {`${offersData.content_guest_count}`} <span className='guest_label_id'>guests</span></p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <button onClick={handleDecrease } className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                                                    <CiCircleMinus className="w-8 h-8 text-orange-600" />
                                                </button>
                                                <p className="text-xl font-bold text-gray-900">
                                                {count}
                                                </p>
                                                <button onClick={handleIncrease} className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                                                    <CiCirclePlus className="w-8 h-8 text-orange-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    :<></>
                                }
                            </div> 
                            
                            
                            {
                                tabData &&
                                <div className="flex items-center justify-between p-4 border border-blue-500 rounded-lg bg-blue-50">
                                    <div>
                                        <p className="font-medium capitalize">{
                                            auth_states.SelectedLanguage == null
                                            ? tabData.offers_table.supplier_table.room_type.room_type_name
                                            : (
                                                tabData.offers_table.supplier_table.room_type.translation.find((filter_item) => filter_item.language_id == auth_states.SelectedLanguage.id)
                                                ? tabData.offers_table.supplier_table.room_type.translation.find((filter_item) => filter_item.language_id == auth_states.SelectedLanguage.id).room_type_name 
                                                : tabData.offers_table.supplier_table.room_type.room_type_name
                                            )
                                        }</p>
                                        <p className="text-sm text-gray-500">{tabData.offers_table.supplier_table.room_type.room_type_guest_count} <span className='guest_per_room'>guest per room</span></p>
                                    </div>
                                    <div className="text-lg font-bold text-center"> 
                                        <p>{tabData.offers_table.currency_table.currency_symbol}{tabData.offers_table.offers_amount}</p>
                                    </div>
                                </div>
                            }
                            
                            {
                                tabData &&
                                <div className="p-5 space-y-4 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <SlWallet className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-semibold text-orange-900">Redeemable T-Points</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-lg font-bold text-orange-600">{tabData.offers_table.offers_points_amount}</span>
                                                <span className="text-xs text-orange-700">available</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 p-3 border border-orange-200 rounded-lg bg-white/50">
                                        <IoMdInformationCircleOutline className="flex-shrink-0 w-4 h-4 text-orange-600" />
                                        <div className="text-sm">
                                            <span className="font-medium text-orange-800">1 T-Point = $1 USD</span>
                                            <span className="ml-2 text-orange-600">(${tabData.offers_table.offers_points_amount} <span className='usd_total_label_id'>USD total</span>)</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center'>
                                        <span>💡</span>
                                        <p className="p-2 text-xs italic font-medium text-orange-700 rounded-lg bg-white/30 redeem_notes_label_id">
                                        Tip: Redeem your T-Points for instant discounts!
                                        </p>
                                    </div>
                                </div>
                            }
                        </div>
                       
                        <div className="p-5 space-y-4 border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <SlWallet className="w-5 h-5 text-gray-600" />
                                    <span className="font-semibold text-gray-900">My T-Points Wallet</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">{wallet}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Redeem Full T-Points Amount</span>
                                <input 
                                type="checkbox" 
                                checked={isRedeemFull} 
                                onChange={handleRedeemFullTPoints} 
                                className="toggle toggle-sm " /> 
                            </div>
                            {
                                !isRedeemFull && (
                                    <div className="space-y-4">
                                        <span className="text-sm font-semibold text-gray-900">T-Points Amount</span>
                                        <div className="flex items-end justify-center space-x-2">
                                            <button onClick={handleDecreaseCustomPoints } className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                                                <CiCircleMinus   className="text-[25px] text-[#FF5722]" />
                                            </button>
                                            <div className='flex items-center justify-center text-center'>
                                                <div>
                                                    <input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    name='customTPoints' 
                                                    value={customTPoints} 
                                                    onChange={handleCustomTPoints} 
                                                    className="w-[80px] input input-bordered input-md" />
                                                </div>
                                            </div>
                                            <button onClick={handleIncreaseCustomPoints} className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                                                <CiCirclePlus   className="text-[25px] text-[#FF5722]" />
                                            </button>
                                        </div>

                                        <div className="p-3 text-center bg-orange-100 rounded-lg">
                                            <div className="text-2xl font-bold text-orange-700">${customTPoints}</div>
                                            <div className="text-xs text-orange-600">USD equivalent</div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    
                        <div className="p-5 space-y-4 border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <IoWalletSharp className="w-5 h-5 text-gray-600" />
                                    <span className="font-semibold text-gray-900">My T-Bucks Wallet</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">{tBucksWallet}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Redeem Full T-Bucks Amount</span>
                                <input 
                                type="checkbox" 
                                checked={isRedeemFullTBucks} 
                                onChange={handleRedeemFullTBucks}
                                className="toggle toggle-sm " /> 
                            </div>
                            {
                                !isRedeemFullTBucks && (
                                    <div className="space-y-4">
                                        <span className="text-sm font-semibold text-gray-900">T-Bucks Amount</span>
                                        <div className="flex items-end justify-center space-x-2">
                                            <button onClick={handleDecreaseCustomBucks } className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                                                <CiCircleMinus   className="text-[25px] text-[#FF5722]" />
                                            </button>
                                            <div className='flex items-center justify-center text-center'>
                                                <div>
                                                    <input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    name='customTPoints' 
                                                    value={customTBucks} 
                                                    onChange={handleCustomTBucks} 
                                                    className="w-[80px] input input-bordered input-md" />
                                                </div>
                                            </div>
                                            <button onClick={handleIncreaseCustomBucks} className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                                                <CiCirclePlus   className="text-[25px] text-[#FF5722]" />
                                            </button>
                                        </div>

                                        <div className="p-3 text-center bg-blue-100 rounded-lg">
                                            <div className="text-2xl font-bold text-orange-700">${customTBucks}</div>
                                            <div className="text-xs text-orange-600">USD equivalent</div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        {
                            tabData &&
                            <div className="p-4 space-y-3 bg-gray-50 rounded-xl">
                                <div className="flex justify-between text-base">
                                    <span className="text-gray-700">Base Price</span>
                                    <span className="font-semibold text-gray-900">${(parseFloat(tabData.offers_table.offers_amount) * count)}</span>
                                </div>

                                {
                                    customTPoints > 0 ?
                                    <div className="flex justify-between text-base text-red-600 border-b">
                                        <span>Applied T-Points</span>
                                        <span className="font-semibold">{customTPoints > 0 ? " - " : ""}${customTPoints}</span>
                                    </div>
                                    : <></>
                                }
                                
                                {
                                    customTBucks > 0 ?   
                                    <div className="flex justify-between text-base text-red-600 border-b">
                                        <span>Applied T-Bucks</span>
                                        <span className="font-semibold"> {customTBucks > 0 ? " - " : ""} ${customTBucks}</span>
                                    </div>
                                    : <></>
                                }
                                
                                <div className="flex justify-between text-xl font-bold">
                                    <span className="text-gray-900">Total Price</span>
                                    <span className="text-green-600">${finalAmount}</span>
                                </div>
                            </div>
                        }

                        <div className='space-y-6'>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between pt-4">
                                    <div>
                                        <p className="text-lg text-[24px] font-bold underline">${finalAmount} <span className='usd_id'>USD</span></p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button  
                                        onClick={handleClose} 
                                        className="px-2 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 cancel_id"
                                        >Cancel
                                        </button>
                                        
                                        {
                                            tabData &&
                                            <button 
                                            onClick={handleCheckout} 
                                            className="flex-1 h-12 px-3 rounded-lg bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] checkout_id">
                                                Checkout
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OffersBottomSheet