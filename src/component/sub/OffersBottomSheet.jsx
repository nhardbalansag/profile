import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { format } from 'date-fns';

import { IoIosCloseCircleOutline } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import { SlWallet } from "react-icons/sl";
import { FaRegClock } from "react-icons/fa6";
import { FaRegCalendar } from "react-icons/fa";
import { LuUsersRound } from "react-icons/lu";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoWalletSharp } from "react-icons/io5";
import { MdOutlineModeOfTravel } from "react-icons/md";
import { LuCircleDollarSign } from "react-icons/lu";
import { RiCoinsLine } from "react-icons/ri";
import { LuDollarSign } from "react-icons/lu";
import { TbTag } from "react-icons/tb";

const env = import.meta.env;

const OffersBottomSheet = ({
    handleClose,
    handleDecrease,
    handleIncrease,
    handleCheckout,
    handleEbanxCheckout,
    count,
    activeTab,
    selectTab,
    tabData,
    offersData,
    finalAmount,

    defaultTBucks,
    defaultTPoints,
    defaultTDollars,

    wallet,

    tBucksWallet,

    tDollarsWallet,

    handleRedeemFullTPoints,
    handleRedeemFullTBucks,
    handleRedeemFullTDollars,

    isRedeemFull,
    isRedeemFullTBucks,
    isRedeemFullTDollars,

    customTPoints,
    customTBucks,
    customTDollars,

    handleCustomTPoints,
    handleCustomTBucks,
    handleCustomTravelDollars,

    handleDecreaseCustomPoints,
    handleIncreaseCustomPoints,

    handleDecreaseCustomBucks,
    handleIncreaseCustomBucks,

    handleDecreaseCustomTravelDollars,
    handleIncreaseCustomTravelDollars,

    children,

    backOnPricingOption,
    backOnPricingTabOption,

    confirmCheckoutStatus,

    guestDetails = <></>,
    stepperDetails = <></>,

    handleNextStep,
    handlePrevStep,
    currentStep
}) => {

    // //#region translation convertion
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

                        Array.from(targetElement).forEach((el) => {
                            el.setAttribute(
                                'placeholder',
                                filteredTranslation?.page_config_title || item.page_config_title
                            );
                        });

                    } else if (targetElement.length > 0) {
                        Array.from(targetElement).forEach((el) => {
                            el.textContent = item.page_config_title;
                        });

                        Array.from(targetElement).forEach((el) => {
                            el.setAttribute(
                                'placeholder',
                                item.page_config_title
                            );
                        });
                    }
                }
            }
        })
    },[auth_states, currentStep])
    //#endregion

    const CheckoutDetails = () =>{
        return(
            <div className="flex flex-wrap justify-center gap-5 space-y-6 md:p-6 ">
                <div className='space-y-6 '>
                    <div>
                        <p className="capitalize label font-extrabold text-[30px] text-red-500 step_4_label_id">Step 4 </p>
                        <span className="text-red-500 label booking_details_and_payment_processing_label_id">Booking details and payment processing</span>
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-shrink-0">
                            <img
                            src={
                                offersData.uploads_table_main_view.upload_type == "url"
                                ? offersData.uploads_table_main_view.upload_url 
                                : env.VITE_APP_BACKEND_STORAGE_URL + offersData.uploads_table_main_view.upload_url
                            }
                            alt={offersData.content_title}
                            className="object-cover w-20 h-20 rounded-xl"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">

                                {
                                    auth_states.SelectedLanguage == null
                                    ? offersData.content_title
                                    : 
                                        offersData.translation
                                        ?
                                            (
                                                offersData.translation.find((filter_item) => filter_item.language_id == auth_states.SelectedLanguage.id)
                                                ? offersData.translation.find((filter_item) => filter_item.language_id == auth_states.SelectedLanguage.id).content_title 
                                                : offersData.content_title
                                            )
                                        : offersData.content_title
                                }
                            </h3>
                            <div className="flex items-center justify-between mt-2">
                                <span className="space-x-1 text-sm text-gray-500">
                                    <span className='qty_label_id'>Qty</span>
                                    <span>:</span>
                                    <span>{count}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {
                            offersData.content_category.category_display_content.display.content_home_style.render_to_bucket_list &&
                            <div className="flex items-start gap-3 p-3 border border-blue-100 bg-blue-50 rounded-xl">
                                <FaRegClock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 duration_id">Duration</p>
                                    <p className="text-xs text-gray-600">
                                        {offersData.content_days_count} 
                                        <span className="days_id">Days</span>, 
                                        {offersData.content_night_count} 
                                        <span className="nights_id">Nights</span>
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">{format(new Date(offersData.content_date_from), 'M/d/yyyy')} - {format(new Date(offersData.content_date_to), 'M/d/yyyy')}</p>
                                </div>
                            </div>
                        }
                        {
                            tabData &&
                            <div className="flex items-start gap-3 p-3 border border-green-100 bg-green-50 rounded-xl">
                                <FaRegCalendar  className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 registration_id">Registration</p>
                                    <p className="text-xs text-gray-600 end_id">
                                        <span className='ends_id'>Ends</span> 
                                        <span>{tabData.offers_table.offers_end_daily_period}</span>
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">{format(new Date(tabData.offers_table.offers_end_effectivity_date), 'M/d/yyyy')}</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>  
                <div className='w-[450px] place-content-center'>
                    <div className='p-4 space-y-6 '>
                        {
                            tabData &&
                            <div className="p-4 space-y-3 bg-gray-50 rounded-xl">
                                <div className="flex justify-between text-base">
                                    <span className="text-gray-700 base_price_label_id">Base Price</span>
                                    <span className="font-semibold text-gray-900">${(parseFloat(tabData.offers_table.offers_amount) * count)}</span>
                                </div>

                                {
                                    customTPoints > 0 ?
                                    <div className="flex justify-between text-base text-red-600 border-b">
                                        <span className='applied_t_points_label_id'>Applied T-Points</span>
                                        <span className="font-semibold">{customTPoints > 0 ? " - " : ""}${customTPoints}</span>
                                    </div>
                                    : <></>
                                }
                                
                                {
                                    customTBucks > 0 ?   
                                    <div className="flex justify-between text-base text-red-600 border-b">
                                        <span className='applied_t_bucks_label_id'>Applied T-Bucks</span>
                                        <span className="font-semibold"> {customTBucks > 0 ? " - " : ""} ${customTBucks}</span>
                                    </div>
                                    : <></>
                                }

                                {
                                    customTDollars > 0 ?   
                                    <div className="flex justify-between text-base text-red-600 border-b">
                                        <span className='applied_travel_dollars_label_id'>Applied Travel Dollars</span>
                                        <span className="font-semibold"> {customTDollars > 0 ? " - " : ""} ${customTDollars}</span>
                                    </div>
                                    : <></>
                                }
                                
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-gray-900 total_price_label_id">Total Price</span>
                                    <span className="text-green-600">${finalAmount}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold">
                                    <span className="text-gray-900 total_wallet_label_id">Total Redeemed</span>
                                    <span className="text-red-600">${parseFloat((parseFloat(customTPoints) + parseFloat(customTBucks) + parseFloat(customTDollars))).toFixed(2)}</span>
                                </div>
                            </div>
                        }

                        <div className="flex gap-3 ">
                            <button  
                            onClick={handlePrevStep} 
                            className="px-2 py-2 text-gray-600 border border-gray-300 rounded-md go_back_label_id hover:bg-gray-100 cancel_id"
                            >Go Back
                            </button>

                            {
                                offersData?.content_has_payment &&  
                                <div className="flex flex-wrap space-x-5">
                                    {
                                        tabData &&
                                        <button 
                                        onClick={handleCheckout} 
                                        className="flex-1 h-12 px-3 rounded-lg bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] checkout_id">
                                            {/* {
                                                confirmCheckoutStatus
                                                ? <span>Pay</span>
                                                : <span>Checkout</span>
                                            } */}
                                            <span className='pay_label_id'>Pay</span>
                                        </button>
                                    }

                                    {
                                        tabData &&
                                        <button 
                                        onClick={handleEbanxCheckout} 
                                        className="h-12 px-3 rounded-lg bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] checkout_id">
                                            {/* {
                                                confirmCheckoutStatus
                                                ? <span>Pay</span>
                                                : <span>Checkout</span>
                                            } */}
                                            <span className='pay_label_id'>EBanx Pay</span>
                                        </button>
                                    }
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div 
        style={{
            zIndex: 4000
        }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40 ">
            <div className="w-full md:p-4 p-2 transition-transform bg-white shadow-lg rounded-t-2xl md:h-[98%] h-[90%] overflow-y-auto">
                <div className='flex justify-end gap-5 my-5'>
                    
                    {
                        tabData &&
                        <button  
                        onClick={backOnPricingTabOption} 
                        className="px-2 py-2 text-gray-600 border border-gray-300 rounded-md back_to_step_1_label_id hover:bg-gray-100 cancel_id"
                        >Back To Step 1
                        </button>
                    }

                    <button 
                    onClick={handleClose} 
                    className='h-12 px-3 rounded-lg bg-red-600  text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]'
                    >
                        <div className='flex items-center justify-center space-x-2'>
                            <IoIosCloseCircleOutline  className="text-[23px] text-white" />
                            <p className='font-bold text-white close_label_id'>Close</p>

                        </div>
                    </button>
                </div>
                
                {stepperDetails}

                <div className=''>

                    {
                        !tabData &&
                        <div>
                            {/* <label className="capitalize label font-bold  text-[20px]">pricing options </label> */}
                            <p className="capitalize label font-extrabold text-[30px] text-red-500 step_1_label_id">Step 1 </p>
                            <span className="text-red-500 label select_tab_offers_to_see_price_details_id">Select tab offers to see price details</span>

                            {children}
                        </div>
                    }

                    {
                        currentStep === 2
                        ? guestDetails
                        :
                            (
                                currentStep === 3
                                ? 
                                    CheckoutDetails()
                                :
                                    tabData &&
                                    <div className="flex flex-wrap justify-center gap-5 p-6 bg-white ">
                                        <div className='space-y-6 md:w-[450px]'>
                                            <div>
                                                <p className="capitalize label font-extrabold text-red-500 text-[30px] step_2_label_id">Step 2 </p>
                                                <span className="text-red-500 label manually_adjust_booking_label_id">Manually adjust your booking by adding your e-wallet and the number of guests</span>
                                            </div>
                                            <div className='space-y-6'>
                                                
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    {
                                                        offersData.content_category.category_display_content.display.content_home_style.render_to_bucket_list &&
                                                        <div className="flex items-start gap-3 p-3 border border-blue-100 bg-blue-50 rounded-xl">
                                                            <FaRegClock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 duration_id">Duration</p>
                                                                <p className="text-xs text-gray-600">{offersData.content_days_count} <span className="days_id">Days</span>, {offersData.content_night_count} <span className="days_id">Nights</span></p>
                                                                <p className="mt-1 text-xs text-gray-500">{format(new Date(offersData.content_date_from), 'M/d/yyyy')} - {format(new Date(offersData.content_date_to), 'M/d/yyyy')}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        tabData &&
                                                        <div className="flex items-start gap-3 p-3 border border-green-100 bg-green-50 rounded-xl">
                                                            <FaRegCalendar  className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                            <div className="min-w-0">
                                                                <p className="space-x-1 text-sm font-medium text-gray-900 capitalize">
                                                                    <span>
                                                                    {
                                                                        auth_states.SelectedLanguage == null 
                                                                        ? tabData.offers_table.tier_category_table.tier_category_name
                                                                        : 
                                                                            tabData.offers_table.tier_category_table.translation
                                                                            ?
                                                                                (
                                                                                    tabData.offers_table.tier_category_table.translation.find((filter_item) => filter_item.language_id == auth_states.SelectedLanguage.id)
                                                                                    ? tabData.offers_table.tier_category_table.translation.find((filter_item) => filter_item.language_id == auth_states.SelectedLanguage.id).tier_category_name
                                                                                    : tabData.offers_table.tier_category_table.tier_category_name
                                                                                )
                                                                            :   tabData.offers_table.tier_category_table.tier_category_name
                                                                    }
                                                                    </span>
                                                                    <span className='registration_id'>Registration</span>
                                                                </p>
                                                                <p className="text-xs text-gray-600 ends_id">Ends {tabData.offers_table.offers_end_daily_period}</p>
                                                                <p className="mt-1 text-xs text-gray-500">{format(new Date(tabData.offers_table.offers_end_effectivity_date), 'M/d/yyyy')}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div> 
                                            
                                            {
                                                tabData &&
                                                <div className="flex flex-wrap items-center justify-between p-4 border border-blue-500 rounded-lg bg-blue-50">
                                                    <div>
                                                        <p className="font-normal capitalize">{
                                                            auth_states.SelectedLanguage == null
                                                            ? tabData.offers_table.supplier_table.supplier_description
                                                            : 
                                                                tabData.offers_table.supplier_table.translation
                                                                ?
                                                                    (
                                                                        tabData.offers_table.supplier_table.translation.find((filter_item) => filter_item.language_id == auth_states.SelectedLanguage.id)
                                                                        ? tabData.offers_table.supplier_table.translation.find((filter_item) => filter_item.language_id == auth_states.SelectedLanguage.id).supplier_description 
                                                                        : tabData.offers_table.supplier_table.supplier_description
                                                                    )
                                                                :   tabData.offers_table.supplier_table.supplier_description
                                                        }</p>
                                                        <p className="text-sm text-gray-500">
                                                            {
                                                                tabData.offers_table.supplier_table.room_type.room_type_guest_count
                                                            } 
                                                        <span className='ml-1 guest_per_room'>guest per room</span></p>
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
                                                            <RiCoinsLine className="w-5 h-5 text-orange-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className="font-semibold text-orange-900 redeemable_t_points">Redeemable T-Points Per Guest</span>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-lg font-bold text-orange-600">{tabData.offers_table.offers_points_amount}</span>
                                                                <span className="text-xs text-orange-700 available_label_id">available</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 p-3 border border-orange-200 rounded-lg bg-white/50">
                                                        <IoMdInformationCircleOutline className="flex-shrink-0 w-4 h-4 text-orange-600" />
                                                        <div className="text-sm">
                                                            <span className="font-medium text-orange-800 t_point_equivalent_label_id">1 T-Point = $1 USD</span>
                                                            <span className="ml-2 text-orange-600">
                                                                (${tabData.offers_table.offers_points_amount} 
                                                                <span className='usd_total_label_id'>USD total</span>)
                                                            </span>
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
                                        <div className='space-y-6 md:flex md:flex-wrap md:justify-center '>
                                            <div className='space-y-6 md:p-6 md:w-[450px]'>
                                                {
                                                    tabData &&
                                                    count ?
                                                    <div className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                                <LuUsersRound className="w-5 h-5 text-orange-600" />
                                                            </div>
                                                            <div>
                                                                <span className="font-semibold text-gray-900 guest_label_id">Guests</span>
                                                                <p className="text-xs text-gray-500"> 
                                                                    <span className='max_label_id'>Max</span> 
                                                                    <span> {`${tabData.offers_table.supplier_table.room_type.room_type_guest_count}`} </span>
                                                                    <span className='guest_label_id'>guests</span>
                                                                </p>
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

                                                {
                                                    tabData &&
                                                    count < tabData.offers_table.supplier_table.room_type.room_type_guest_count &&
                                                    <div>
                                                        <p className="p-2 space-x-2 text-sm italic font-medium text-red-700 rounded-lg bg-white/30 redeem_notes_label_id">
                                                            <span className='note_select_guest_label_id'>
                                                                Note: 
                                                                If you select 1 guest for a 
                                                            </span>
                                                            <span>
                                                                {
                                                                    auth_states.SelectedLanguage == null
                                                                    ? tabData.offers_table.supplier_table.room_type.room_type_name
                                                                    : 
                                                                        tabData.offers_table.supplier_table.room_type.translation
                                                                        ?
                                                                            (
                                                                                tabData.offers_table.supplier_table.room_type.translation.find((filter_item) => filter_item.language_id == auth_states.SelectedLanguage.id)
                                                                                ? tabData.offers_table.supplier_table.room_type.translation.find((filter_item) => filter_item.language_id == auth_states.SelectedLanguage.id).room_type_name 
                                                                                : tabData.offers_table.supplier_table.room_type.room_type_name
                                                                            )
                                                                        : tabData.offers_table.supplier_table.room_type.room_type_name
                                                                }
                                                            </span>, 
                                                            <span className='responsible_securing_roommate_label_id'>
                                                                you are responsible for securing a second paying guest to share the room with you. If a roommate is not provided or found, a single room supplement will be applied, and you will be charged the difference for a single occupancy room.
                                                            </span>
                                                        </p>
                                                    </div>
                                                }
                                                
                                                {
                                                    tabData &&
                                                    tabData.offers_table.offers_points_amount > 0 &&
                                                    defaultTPoints > 0 &&
                                                    <div className="p-5 space-y-4 border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <RiCoinsLine className="w-5 h-5 text-gray-600" />
                                                                <span className="font-semibold text-gray-900 my_t_points_wallet_label_id">My T-Points Wallet</span>
                                                            </div>
                                                            <span className="text-xl font-bold text-gray-900">{wallet}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                                            <span className="text-sm font-medium text-gray-700 redeem_full_t_points_label_id">Redeem Full T-Points Amount</span>
                                                            <input 
                                                            type="checkbox" 
                                                            disabled={parseFloat(finalAmount) === 0 ? (parseFloat(customTPoints) === 0 ? true : false) : false}
                                                            checked={isRedeemFull} 
                                                            onChange={handleRedeemFullTPoints} 
                                                            className="toggle toggle-sm " /> 
                                                        </div>
                                                        {
                                                            !isRedeemFull && 
                                                            parseFloat(customTPoints) === 0 &&
                                                            parseFloat(finalAmount) === 0
                                                            ?   <></> 
                                                            : 
                                                                parseFloat(customTPoints) === 0 &&
                                                                parseFloat(finalAmount) === 0
                                                                ?   <></> 
                                                                :
                                                                    !isRedeemFull &&
                                                                    (
                                                                        <div className="space-y-4">
                                                                            <span className="text-sm font-semibold text-gray-900 tpoints_amount_label_id">T-Points Amount</span>
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
                                                                                <div className="text-xs text-orange-600 usd_equivalent_label_id">USD equivalent</div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                        }
                                                    </div>
                                                }
                                                {
                                                    tabData &&
                                                    defaultTBucks > 0 &&
                                                    <div className="p-5 space-y-4 border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <LuDollarSign className="w-5 h-5 text-gray-600" />
                                                                <span className="font-semibold text-gray-900 my_tbucks_wallet_label_id">My T-Bucks Wallet</span>
                                                            </div>
                                                            <span className="text-xl font-bold text-gray-900">{tBucksWallet}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                                            <span className="text-sm font-medium text-gray-700 redeem_full_t_bucks_amount">Redeem Full T-Bucks Amount</span>
                                                            <input 
                                                            type="checkbox" 
                                                            disabled={parseFloat(finalAmount) === 0 ? (parseFloat(customTBucks) === 0 ? true : false) : false}
                                                            checked={isRedeemFullTBucks} 
                                                            onChange={handleRedeemFullTBucks}
                                                            className="toggle toggle-sm " /> 
                                                        </div>
                                                        {
                                                            !isRedeemFullTBucks && 
                                                            parseFloat(customTBucks) === 0 &&
                                                            parseFloat(finalAmount) === 0
                                                            ?   <></> 
                                                            :
                                                                parseFloat(customTBucks) === 0 &&
                                                                parseFloat(finalAmount) === 0
                                                                ?   <></> 
                                                                :
                                                                    !isRedeemFullTBucks && 
                                                                    (
                                                                        <div className="space-y-4">
                                                                            <span className="text-sm font-semibold text-gray-900 tbucks_amount_label_id">T-Bucks Amount</span>
                                                                            <div className="flex items-end justify-center space-x-2">
                                                                                <button onClick={handleDecreaseCustomBucks } className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                                                                                    <CiCircleMinus   className="text-[25px] text-[#FF5722]" />
                                                                                </button>
                                                                                <div className='flex items-center justify-center text-center'>
                                                                                    <div>
                                                                                        <input 
                                                                                        type="number" 
                                                                                        placeholder="0" 
                                                                                        name='customTBucks' 
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
                                                                                <div className="text-xs text-orange-600 usd_equivalent_label_id">USD equivalent</div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                        }
                                                    </div>
                                                }
                                                {
                                                    tabData &&
                                                    defaultTDollars > 0 &&
                                                    <div className="p-5 space-y-4 border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <MdOutlineModeOfTravel className="w-5 h-5 text-gray-600" />
                                                                <span className="font-semibold text-gray-900 my_t_travel_dollars_wallet_label_id">My Travel Dollars Wallet</span>
                                                            </div>
                                                            <span className="text-xl font-bold text-gray-900">{tDollarsWallet}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                                            <span className="text-sm font-medium text-gray-700 redeem_full_travel_dollars_amount">Redeem Full Travel Dollars Amount</span>
                                                            <input 
                                                            type="checkbox" 
                                                            disabled={parseFloat(finalAmount) === 0 ? (parseFloat(customTDollars) === 0 ? true : false) : false}
                                                            checked={isRedeemFullTDollars} 
                                                            onChange={handleRedeemFullTDollars}
                                                            className="toggle toggle-sm " /> 
                                                        </div>
                                                        {
                                                            !isRedeemFullTDollars &&
                                                            parseFloat(customTDollars) === 0 &&
                                                            parseFloat(finalAmount) === 0
                                                            ?   <></> 
                                                            : 
                                                                parseFloat(customTDollars) === 0 &&
                                                                parseFloat(finalAmount) === 0
                                                                ?   <></> 
                                                                : 
                                                                    !isRedeemFullTDollars &&
                                                                    (
                                                                        <div className="space-y-4">
                                                                            <span className="text-sm font-semibold text-gray-900 travel_dollars_amount_label_id">Travel Dollars Amount</span>
                                                                            <div className="flex items-end justify-center space-x-2">
                                                                                <button onClick={handleDecreaseCustomTravelDollars } className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                                                                                    <CiCircleMinus   className="text-[25px] text-[#FF5722]" />
                                                                                </button>
                                                                                <div className='flex items-center justify-center text-center'>
                                                                                    <div>
                                                                                        <input 
                                                                                        type="number" 
                                                                                        placeholder="0" 
                                                                                        name='customTDollars' 
                                                                                        value={customTDollars} 
                                                                                        onChange={handleCustomTravelDollars} 
                                                                                        className="w-[80px] input input-bordered input-md" />
                                                                                    </div>
                                                                                </div>
                                                                                <button onClick={handleIncreaseCustomTravelDollars} className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                                                                                    <CiCirclePlus   className="text-[25px] text-[#FF5722]" />
                                                                                </button>
                                                                            </div>

                                                                            <div className="p-3 text-center bg-green-100 rounded-lg">
                                                                                <div className="text-2xl font-bold text-orange-700">${customTDollars}</div>
                                                                                <div className="text-xs text-orange-600 usd_equivalent_label_id">USD equivalent</div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                        }
                                                    </div>
                                                }
                                            </div>

                                            <div className=' space-y-6 md:w-[450px]'>
                                                {
                                                    tabData &&
                                                    <div className="p-4 space-y-3 bg-gray-50 rounded-xl">
                                                        <div className="flex justify-between text-base">
                                                            <span className="text-gray-700 base_price_label_id">Base Price</span>
                                                            <span className="font-semibold text-gray-900">${(parseFloat(tabData.offers_table.offers_amount) * count)}</span>
                                                        </div>

                                                        {
                                                            customTPoints > 0 ?
                                                            <div className="flex justify-between text-base text-red-600 border-b">
                                                                <span className='applied_t_points_label_id'>Applied T-Points</span>
                                                                <span className="font-semibold">{customTPoints > 0 ? " - " : ""}${customTPoints}</span>
                                                            </div>
                                                            : <></>
                                                        }
                                                        
                                                        {
                                                            customTBucks > 0 ?   
                                                            <div className="flex justify-between text-base text-red-600 border-b">
                                                                <span className='applied_t_bucks_label_id'>Applied T-Bucks</span>
                                                                <span className="font-semibold"> {customTBucks > 0 ? " - " : ""} ${customTBucks}</span>
                                                            </div>
                                                            : <></>
                                                        }

                                                        {
                                                            customTDollars > 0 ?   
                                                            <div className="flex justify-between text-base text-red-600 border-b">
                                                                <span className='applied_t_dollars_label_id'>Applied Travel Dollars</span>
                                                                <span className="font-semibold"> {customTDollars > 0 ? " - " : ""} ${customTDollars}</span>
                                                            </div>
                                                            : <></>
                                                        }
                                                        
                                                        <div className="flex justify-between text-xl font-bold">
                                                            <span className="text-gray-900 total_price_label_id">Total Price</span>
                                                            <span className="text-green-600">${finalAmount}</span>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="capitalize label font-extrabold text-red-500 text-[30px] step_3_label_id">Step 3 </p>
                                                        <span className="text-red-500 label proceed_setting_guest_information_label_id">Proceed to setting up guest information and review the final details of your booking</span>
                                                    </div>
                                                    <div className="flex items-center justify-between ">
                                                        <div>
                                                            <p className="text-lg text-[24px] font-bold underline">
                                                                ${finalAmount} 
                                                                <span className='usd_id'>USD</span>
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <button  
                                                            onClick={backOnPricingTabOption} 
                                                            className="px-2 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 back_label_id"
                                                            >Back
                                                            </button>
                                                            
                                                            {
                                                                tabData &&
                                                                <button 
                                                                onClick={handleNextStep} 
                                                                className="flex-1 h-12 px-3 rounded-lg bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] next_label_id">
                                                                    Next
                                                                </button>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export default OffersBottomSheet