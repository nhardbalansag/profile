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
    handleRedeemFullTPoints,
    isRedeemFull,
    customTPoints,
    handleCustomTPoints,
    handleDecreaseCustomPoints,
    handleIncreaseCustomPoints,
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40">
            <div className="w-full max-w-md md:p-4 p-2 transition-transform bg-white shadow-lg rounded-t-2xl max-h-[90%] overflow-y-auto">
                <div className='flex justify-end'>
                    <button onClick={handleClose} className='flex items-center justify-center p-1 mr-2'>
                        <IoIosCloseCircleOutline  className="text-[23px] text-[#ff4949]" />
                    </button>
                </div>

                {children}
            
                <div className="max-w-md p-5 mx-auto space-y-6 bg-white border shadow-lg md:p-6 rounded-2xl ">
                    <div className='space-y-6'>
                        <div className='mt-3 space-y-2'>
                            <div className="flex items-center justify-start space-x-3">
                                <div className="flex items-center space-x-2">
                                    <IoPartlySunnyOutline  className="text-[15px] text-[#FF5722]" />
                                    <label className="text-black text-[12px]">{offersData.content_days_count} <span className="days_id">Days</span></label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <IoCloudyNightOutline   className="text-[15px] text-[#FF5722]" />
                                    <label className="text-black text-[12px]">{offersData.content_night_count} <span className="days_id">Nights</span></label>
                                </div>
                            </div>
                        </div>
                        
                        <div className='mt-3 space-y-2'>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <BsCalendar2Check className="text-[15px] text-[#FF5722]" />
                                    <label className="text-gray-500 text-[12px] date_id">Date</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <p  className="text-[12px]">{format(new Date(offersData.content_date_from), 'MMM dd, yyyy')} - {format(new Date(offersData.content_date_to), 'MMM dd, yyyy')} </p>
                                </div>
                            </div>
                        </div>

                        <div className='mt-3 space-y-2'>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <LuCalendarClock  className="text-[15px] text-[#FF5722]" />
                                    <label className="text-gray-500 text-[12px] registration_end_id">Registration End</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <p  className="text-[12px]">
                                        {format(new Date(tabData.offers_table.offers_end_effectivity_date), 'MMM dd, yyyy')}
                                    </p>
                                    <p  className="text-[12px]">
                                        {tabData.offers_table.offers_end_daily_period}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <HiOutlineUsers    className="text-[18px] text-[#FF5722]" />
                                    <label className="text-gray-500 text-[12px] guest_id">Guest</label>
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
                                <p className='text-[12px] text-gray-500'><span className='note_maximum_guest_id'>note: maximum guest is </span> ({`${offersData.content_guest_count}`})</p>
                            </div>
                        </div>
                    </div> 

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
                            {/* <button className="mt-1 text-sm font-medium text-blue-600">Select offer</button> */}
                        </div>
                        <div className="text-lg font-bold text-center"> 
                            <p>{tabData.offers_table.currency_table.currency_symbol}{tabData.offers_table.offers_amount}</p>
                        </div>
                    </div>
            
                    <div className="space-y-4 border-b-[1px] pb-3">
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <RiCoinsLine   className="text-[25px] text-[#FF5722]" />
                                <p className='text-[12px] ml-2 text-black redeem_t_points_id'>Redeem T-Points</p>
                            </div>
                            <p className='text-[15px] ml-2 text-black font-semibold'>{tabData.offers_table.offers_points_amount}</p>
                        </div>

                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <FiHelpCircle className="text-[15px] text-[#FF5722]" />
                                <p className='text-[10.5px] ml-2 text-black'>
                                    <strong className='1_t-point_id'>1 T-Point</strong> 
                                    <span className='is_equal_to_id'>is equal to</span> 
                                    <strong className='$1_usd_id'> $1 USD</strong>
                                </p>
                            </div>
                            <p className='text-[11px] ml-2 text-black font-semibold'>${tabData.offers_table.offers_points_amount} <span className='usd_id'>USD</span></p>
                        </div>
                        <div className='flex items-center'>
                            <p className='text-[12px] text-gray-500'>(<span className='tip_redeem_id'>Tip: Redeem your T-Points for instant discounts!</span>)</p>
                        </div>
                    </div>

                    <div className="pb-3 text-right border-b"> 
                        <div className='flex items-center justify-between'>
                            <p className="text-[11px] price_id">Price</p>
                            <p className="text-lg font-semibold">{tabData.offers_table.currency_table.currency_symbol}{(parseFloat(tabData.offers_table.offers_amount) * count)}</p>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className="text-[11px] applied_t_point_id">Applied T-Points</p>
                            <p className="text-lg font-semibold border-b-2 border-black"> - ${tabData.offers_table.offers_points_amount}</p>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className="text-[11px] total_price">Total Price</p>
                            <p className="text-lg text-[24px] font-bold">${(parseFloat(tabData.offers_table.offers_amount) * count) - parseFloat(tabData.offers_table.offers_points_amount)}</p>
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <SlWallet   className="text-[15px] text-[#FF5722]" />
                            <p className='text-[12px] ml-2 text-black my_t_point_wallet_id'>My T-Points Wallet</p>
                        </div>
                        <p className='text-[12px] ml-2 text-black font-semibold'>{wallet}</p>
                    </div>

                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={isRedeemFull} onChange={handleRedeemFullTPoints} className="toggle toggle-sm" /> 
                        <p className='text-[12px] redeem_full_t_point_amount_id'>Redeem Full T-Points Amount</p>
                    </label>
                    
                    <div className="flex items-end justify-center space-x-2">
                        <button onClick={handleDecreaseCustomPoints } className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                            <CiCircleMinus   className="text-[25px] text-[#FF5722]" />
                        </button>
                        <div className='flex items-center justify-center text-center'>
                            <div>
                                <label className="label text-[12px] t_points_amount">T-Points Amount</label>
                                <input type="number" placeholder="0" name='customTPoints' value={customTPoints} onChange={handleCustomTPoints} className="w-[80px] input input-bordered input-md" />
                            </div>
                        </div>
                        <button onClick={handleIncreaseCustomPoints} className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                            <CiCirclePlus   className="text-[25px] text-[#FF5722]" />
                        </button>
                    </div>
            
                    <div className="space-y-3">
                        <div className="flex items-center justify-between pt-4">
                            <div>
                                <p className="text-lg text-[24px] font-bold underline">${finalAmount} <span className='usd_id'>USD</span></p>
                            </div>
                            <div className="flex gap-3">
                                <button  onClick={handleClose} className="px-2 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 cancel_id">Cancel</button>
                                <button onClick={handleCheckout} className="px-2 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 checkout_id">Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OffersBottomSheet