import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useDispatch } from "react-redux";
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns';

import {
    OffersBottomSheet,
    Header,
    LanguageBottomSheet
} from '../../component/index'

import {
  Checkout
} from '../index'

import Quill from 'quill';

import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuTickets } from "react-icons/lu";
import { TiHomeOutline } from "react-icons/ti";
import { FaRegCalendar } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { LuCalendarClock } from "react-icons/lu";
import { MdOutlineVerified } from "react-icons/md";
import { MdOutlineLocalHotel } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

import * as api_content from '../../services/content/content.api'
import * as api_subscription from '../../services/account/subscription.api.js'
import * as api_account from '../../services/account/account.api.js'

import Logo2 from '../../assets/images/ten/logo2.png'

const env = import.meta.env;

const ProductDetails = () =>{

    //#region implementations
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const auth_states = useSelector(state => state.AuthReducer);
    const modalSubscriptionRef = useRef(null);

    //#region useRefs
    const maxGuestCount = useRef(0)

    const walletRef = useRef(0)
    const walletTBucksRef = useRef(0)
    const walletTDollarsRef = useRef(0)

    const paymentBContent = useRef({})
    const initialFinalPrice = useRef(0)

    const [open, setOpen] = useState(false)
    const [getOpenLanguageSelection, setOpenLanguageSelection] = useState(false)
    const [getSelectedLanguage, setSelectedLanguage] = useState("")

    const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)  // null means main translation is used

    const [selectedLanguageLocale, setSelectedLanguageLocale] = useState(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.language_locale : null);

    const [openBottomOffer, setOpenBottomOffer] = useState(false);
    const [openBottomPayment, setOpenBottomPayment] = useState(false);
    const [ResultGetHomeContents, ResultSetHomeContents] = useState(null);
    const [ResultGetHomeContentsDetails, ResultSetHomeContentsDetails] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [count, setCount] = useState(1);
    const [totalPriceWithPoints, setTotalPriceWithPoints] = useState(0);
    const [TPointsWallet, setTPointsWallet] = useState(walletRef.current);
    const [TPointsCustom, setTPointsCustom] = useState(0);
    const [TBucksCustom, setTBucksCustom] = useState(0);
    const [TDollarsCustom, setTDollarsCustom] = useState(0);

    const [UseTPointsWalletFullAmount, setUseTPointsWalletFullAmount] = useState(false);
    const [getUseTBucksWalletFullAmount, setUseTBucksWalletFullAmount] = useState(false);
    const [getUseTDollarsWalletFullAmount, setUseTDollarsWalletFullAmount] = useState(false);

    const [getConfirmCheckoutStatus, setConfirmCheckoutStatus] = useState(false);

    const [loadingContent, setLoadingContent] = useState(true);
    const [getclientSecret, setclientSecret] = useState(null)
    const [getLoading, setLoading] = useState(false)

    const [walletData, setWalletData] = useState({
        t_points: 0,
        t_bucks: 0,
        t_dollars: 0,
        AccountTransaction:[]
    });

    const [getGuestInformation, setGuestInformation] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        <span className='choose_booking_offers_label_id'>Choose Booking Offers</span>,
        <span className='adjust_label_id'>Adjust</span>,
        <span className='info_label_id'>Info</span>,
        <span className='pay_label_id'>Pay</span>,
    ];

    const editorRef = useRef(ResultGetHomeContents && ResultGetHomeContents.content_description);
    const quillRef = useRef(null);

    const handleEbanxCheckout = async (selectedTab, AllContentData) =>{
        if(!auth_states.StateToken){
            navigate('login');
        }else{
    
            const content_title = selectedLanguage.current == null 
            ? AllContentData.content_title
            : 
                AllContentData.translation
                ?
                    (
                        AllContentData.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                        ? AllContentData.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_title
                        : AllContentData.content_title
                    )
                : AllContentData.content_title
        
            const membership_type = selectedLanguage.current == null 
            ? selectedTab.offers_table.membership_type_table.type_title
            : 
                selectedTab.offers_table.membership_type_table.translation.translation
                ?
                    (
                        selectedTab.offers_table.membership_type_table.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                        ? selectedTab.offers_table.membership_type_table.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_title
                        : selectedTab.offers_table.membership_type_table.type_title
                    )
                : selectedTab.offers_table.membership_type_table.type_title
        
            const room_type_name = selectedLanguage.current == null 
            ? selectedTab.offers_table.supplier_table.room_type.room_type_name
            : 
                selectedTab.offers_table.supplier_table.room_type.translation
                ?
                    (
                        selectedTab.offers_table.supplier_table.room_type.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                        ? selectedTab.offers_table.supplier_table.room_type.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).room_type_name
                        : selectedTab.offers_table.supplier_table.room_type.room_type_name
                    )
                : selectedTab.offers_table.supplier_table.room_type.room_type_name
        
            const tier_category_name = selectedLanguage.current == null 
            ? selectedTab.offers_table.tier_category_table.tier_category_name
            :
                    selectedTab.offers_table.tier_category_table.translation
                    ?
                        (
                            selectedTab.offers_table.tier_category_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                            ? selectedTab.offers_table.tier_category_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).tier_category_name
                            : selectedTab.offers_table.tier_category_table.tier_category_name
                        )
                    : selectedTab.offers_table.tier_category_table.tier_category_name
          
            const reqBody = {
                content_offers_id: selectedTab.id,
                offers_id: selectedTab.offers_id,
                guest_count: count,
                finalAmount: totalPriceWithPoints,
                content_title: content_title,
                content_days_count: AllContentData.content_days_count,
                content_night_count: AllContentData.content_night_count,
                membership_type: membership_type,
                room_type_name: room_type_name,
                tier_category_name: tier_category_name,
                content_date_from: AllContentData.content_date_from,
                content_date_to: AllContentData.content_date_to,
        
                points_applied: parseFloat(TPointsCustom) || 0,
                points_allowed: selectedTab.offers_table.offers_points_amount,
                points_wallet_before: walletRef.current,
                points_wallet_after: TPointsWallet,
        
                bucks_applied: parseFloat(TBucksCustom) || 0,
                bucks_wallet_before: walletTBucksRef.current,
                bucks_wallet_after: walletData.t_bucks,
        
                travel_dollars_applied: parseFloat(TDollarsCustom) || 0,
                travel_dollars_wallet_before: walletTDollarsRef.current,
                travel_dollars_wallet_after: walletData.t_dollars,

                guestDetails: getGuestInformation,
            }
        
            paymentBContent.current = reqBody
            setOpenBottomPayment(true)
            
            setLoading(true)
            await api_content.createEBanxTripPaymentIntent(auth_states.StateToken, paymentBContent.current).then((result) =>{
                if(result.status){
        
                    if(result.data.isWalletPayment){
                        setLoading(false)
                        setOpenBottomPayment(false)
                        setOpenBottomOffer(!openBottomOffer)
                        resetOnClose()
                        toast.success("Payment succeed");
                        navigate('/orders');
                        return;
                    }

                    if(result.data.status === 'ERROR'){
                        setLoading(false)
                        setOpenBottomPayment(false)
                        toast.success(result.data?.status_message);
                        resetOnClose()
                        return;
                    }
                    
                    
                    window.open(result.data.redirect_url, "_blank");

                    setLoading(false)
                    setOpenBottomPayment(false)
                    resetOnClose()
                    navigate('/orders');
            
                    // setclientSecret(result.data.clientSecret)
                    // setLoading(false)
                }
            }).catch((err) =>{
                toast.warning("There was a problem processing your payment");
            })
        }
    }

    const handleCheckout = async (selectedTab, AllContentData) =>{
        if(!auth_states.StateToken){
            navigate('login');
        }else{
    
            const content_title = selectedLanguage.current == null 
            ? AllContentData.content_title
            : 
                AllContentData.translation
                ?
                    (
                        AllContentData.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                        ? AllContentData.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_title
                        : AllContentData.content_title
                    )
                : AllContentData.content_title
        
            const membership_type = selectedLanguage.current == null 
            ? selectedTab.offers_table.membership_type_table.type_title
            : 
                selectedTab.offers_table.membership_type_table.translation.translation
                ?
                    (
                        selectedTab.offers_table.membership_type_table.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                        ? selectedTab.offers_table.membership_type_table.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_title
                        : selectedTab.offers_table.membership_type_table.type_title
                    )
                : selectedTab.offers_table.membership_type_table.type_title
        
            const room_type_name = selectedLanguage.current == null 
            ? selectedTab.offers_table.supplier_table.room_type.room_type_name
            : 
                selectedTab.offers_table.supplier_table.room_type.translation
                ?
                    (
                        selectedTab.offers_table.supplier_table.room_type.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                        ? selectedTab.offers_table.supplier_table.room_type.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).room_type_name
                        : selectedTab.offers_table.supplier_table.room_type.room_type_name
                    )
                : selectedTab.offers_table.supplier_table.room_type.room_type_name
        
            const tier_category_name = selectedLanguage.current == null 
            ? selectedTab.offers_table.tier_category_table.tier_category_name
            :
                    selectedTab.offers_table.tier_category_table.translation
                    ?
                        (
                            selectedTab.offers_table.tier_category_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                            ? selectedTab.offers_table.tier_category_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).tier_category_name
                            : selectedTab.offers_table.tier_category_table.tier_category_name
                        )
                    : selectedTab.offers_table.tier_category_table.tier_category_name
          
            const reqBody = {
                content_offers_id: selectedTab.id,
                offers_id: selectedTab.offers_id,
                guest_count: count,
                finalAmount: totalPriceWithPoints,
                content_title: content_title,
                content_days_count: AllContentData.content_days_count,
                content_night_count: AllContentData.content_night_count,
                membership_type: membership_type,
                room_type_name: room_type_name,
                tier_category_name: tier_category_name,
                content_date_from: AllContentData.content_date_from,
                content_date_to: AllContentData.content_date_to,
        
                points_applied: parseFloat(TPointsCustom) || 0,
                points_allowed: selectedTab.offers_table.offers_points_amount,
                points_wallet_before: walletRef.current,
                points_wallet_after: TPointsWallet,
        
                bucks_applied: parseFloat(TBucksCustom) || 0,
                bucks_wallet_before: walletTBucksRef.current,
                bucks_wallet_after: walletData.t_bucks,
        
                travel_dollars_applied: parseFloat(TDollarsCustom) || 0,
                travel_dollars_wallet_before: walletTDollarsRef.current,
                travel_dollars_wallet_after: walletData.t_dollars,

                guestDetails: getGuestInformation,
            }
        
            paymentBContent.current = reqBody
            setOpenBottomPayment(true)
            
            setLoading(true)
            await api_content.GetClientSecret(auth_states.StateToken, paymentBContent.current).then((result) =>{
                if(result.status){
        
                    if(result.data.isWalletPayment){
                        setLoading(false)
                        setOpenBottomPayment(false)
                        setOpenBottomOffer(!openBottomOffer)
                        resetOnClose()
                        toast.success("Payment succeed");
                        navigate('/orders');
                        return;
                    }
            
                    setclientSecret(result.data.clientSecret)
                    setLoading(false)
                }
            }).catch((err) =>{
                toast.warning("There was a problem processing your payment");
            })
        }
    }
    
    const handleTpoints = (item) => {
        const toggledUseFullAmount = !UseTPointsWalletFullAmount;
        setUseTPointsWalletFullAmount(toggledUseFullAmount);

        const currentWalletAmount = walletRef.current;
        const maxPointsAllowed = parseFloat(item.offers_table.offers_points_amount);
        const finalPrice = totalPriceWithPoints + TPointsCustom;

        if (toggledUseFullAmount) {
            // Calculate the actual points allowed and usable
            const pointsAllowed = Math.min(currentWalletAmount, (maxPointsAllowed * count));
            const pointsToUse = Math.min(pointsAllowed, finalPrice);

            // Derived values
            const remainingWalletBalance = currentWalletAmount - pointsToUse;
            const finalPriceNewValue = finalPrice - pointsToUse;

            // Set new state values
            setTotalPriceWithPoints(finalPriceNewValue);
            setTPointsWallet(remainingWalletBalance);
            setTPointsCustom(pointsToUse);
        } else {
            // Revert values when toggle is off
            setTotalPriceWithPoints(prev => prev + TPointsCustom);
            setTPointsWallet(walletRef.current);
            setTPointsCustom(0);
        }
    }
    
    const handleTbucks = (item) => {
        const toggledUseFullAmount = !getUseTBucksWalletFullAmount;
        setUseTBucksWalletFullAmount(toggledUseFullAmount);

        const currentWalletAmount = walletTBucksRef.current;
        const finalPrice = totalPriceWithPoints + TBucksCustom;

        if (toggledUseFullAmount) {
            // Calculate the actual points allowed and usable
            const pointsAllowed = Math.min(currentWalletAmount, finalPrice);
            const pointsToUse = Math.min(pointsAllowed, finalPrice);

            // Derived values
            const remainingWalletBalance = currentWalletAmount - pointsToUse;
            const finalPriceNewValue = finalPrice - pointsToUse;

            // Set new state values
            setTotalPriceWithPoints(finalPriceNewValue);
            setWalletData(prev => ({...prev, t_bucks: remainingWalletBalance}))
            setTBucksCustom(pointsToUse);
        } else {
            // Revert values when toggle is off
            setTotalPriceWithPoints(prev => prev + TBucksCustom);
            setWalletData(prev => ({...prev, t_bucks: walletTBucksRef.current}))
            setTBucksCustom(0);
        }
    }
    
    const handleTDollars = (item) => {
        const toggledUseFullAmount = !getUseTDollarsWalletFullAmount;
        setUseTDollarsWalletFullAmount(toggledUseFullAmount);

        const currentWalletAmount = walletTDollarsRef.current;
        const finalPrice = totalPriceWithPoints + TDollarsCustom;

        if (toggledUseFullAmount) {
            // Calculate the actual points allowed and usable
            const pointsAllowed = Math.min(currentWalletAmount, finalPrice);
            const pointsToUse = Math.min(pointsAllowed, finalPrice);

            // Derived values
            const remainingWalletBalance = currentWalletAmount - pointsToUse;
            const finalPriceNewValue = finalPrice - pointsToUse;

            // Set new state values
            setTotalPriceWithPoints(finalPriceNewValue);
            setWalletData(prev => ({...prev, t_dollars: remainingWalletBalance}))
            setTDollarsCustom(pointsToUse);
        } else {
            // Revert values when toggle is off
            setTotalPriceWithPoints(prev => prev + TDollarsCustom);
            setWalletData(prev => ({...prev, t_dollars: walletTDollarsRef.current}))
            setTDollarsCustom(0);
        }
    }
    
    const handleCustomPoints = (event, item) => {

        const currentWalletAmount = walletRef.current;
        const maxPointsAllowed = parseFloat(item.offers_table.offers_points_amount);
        const finalPrice = totalPriceWithPoints + TPointsCustom;

        const { name, type, checked, value } = event.target;
        const validatedNaNInput = (Number.isNaN(value) ? parseInt(0) : parseInt(value))

        if(Number.isNaN(validatedNaNInput)){
            setTotalPriceWithPoints(prev => prev + TPointsCustom);
            setTPointsWallet(prev => prev + TPointsCustom);
            setTPointsCustom(value !== "" ? 0 : value);
            return;
        } 
        
        if(!UseTPointsWalletFullAmount){
            
            // Calculate the actual points allowed and usable
            const safeInput = Math.max(0, validatedNaNInput); // prevents negative values
            const pointsAllowed = Math.min(safeInput, maxPointsAllowed);
            const pointsToUse = Math.min(pointsAllowed, finalPrice);

            // Derived values
            const remainingWalletBalance = currentWalletAmount - pointsToUse;
            const finalPriceNewValue = finalPrice - pointsToUse;

            // Set new state values
            setTotalPriceWithPoints(finalPriceNewValue);
            setTPointsWallet(remainingWalletBalance);
            setTPointsCustom(pointsToUse);
        }
    };
    
    const handleCustomBucks = (event, item) => {

        const currentWalletAmount = walletTBucksRef.current;
        const finalPrice = totalPriceWithPoints + TBucksCustom;

        const { name, type, checked, value } = event.target;
        const validatedNaNInput = (Number.isNaN(value) ? parseInt(0) : parseInt(value))

        if(Number.isNaN(validatedNaNInput)){
            setTotalPriceWithPoints(prev => prev + TBucksCustom);
            setWalletData(prev => ({...prev, t_bucks: prev.t_bucks + TBucksCustom}))
            setTBucksCustom(value !== "" ? 0 : value);
            return;
        } 

        if(!getUseTBucksWalletFullAmount){
            // Calculate the actual points allowed and usable
            const safeInput = Math.max(0, validatedNaNInput); // prevents negative values
            const tBucksLimit = Math.min(safeInput, currentWalletAmount);
            const pointsAllowed = Math.min(tBucksLimit, finalPrice);
            const pointsToUse = Math.min(pointsAllowed, finalPrice);

            // Derived values
            const remainingWalletBalance = currentWalletAmount - pointsToUse;
            const finalPriceNewValue = finalPrice - pointsToUse;

            // Set new state values
            setTotalPriceWithPoints(finalPriceNewValue);
            setWalletData(prev => ({...prev, t_bucks: remainingWalletBalance}))
            setTBucksCustom(pointsToUse);
        }
    
    }
    
    const handleCustomTravelDollars = (event, item) => {

        const currentWalletAmount = walletTDollarsRef.current;
        const finalPrice = totalPriceWithPoints + TDollarsCustom;

        const { name, type, checked, value } = event.target;
        const validatedNaNInput = (Number.isNaN(value) ? parseInt(0) : parseInt(value))

        if(Number.isNaN(validatedNaNInput)){
            setTotalPriceWithPoints(prev => prev + TDollarsCustom);
            setWalletData(prev => ({...prev, t_dollars: prev.t_dollars + TDollarsCustom}))
            setTDollarsCustom(value !== "" ? 0 : value);
            return;
        } 

        if(!getUseTDollarsWalletFullAmount){
            // Calculate the actual points allowed and usable
            const safeInput = Math.max(0, validatedNaNInput); // prevents negative values
            const tBucksLimit = Math.min(safeInput, currentWalletAmount);
            const pointsAllowed = Math.min(tBucksLimit, finalPrice);
            const pointsToUse = Math.min(pointsAllowed, finalPrice);

            // Derived values
            const remainingWalletBalance = currentWalletAmount - pointsToUse;
            const finalPriceNewValue = finalPrice - pointsToUse;

            // Set new state values
            setTotalPriceWithPoints(finalPriceNewValue);
            setWalletData(prev => ({...prev, t_dollars: remainingWalletBalance}))
            setTDollarsCustom(pointsToUse);
        }
    
    }

    const handleDecreaseCustomBucks = (item) => {
        // check if full points toggle is enabled
        if (!getUseTBucksWalletFullAmount) {
            const nextCustomValue = TBucksCustom - 1;

            // Prevent going below 0
            if (nextCustomValue < 0) {
                return;
            }

            // Apply decrement
            setTBucksCustom(nextCustomValue);
            setWalletData(prev => ({...prev, t_bucks: prev.t_bucks + 1}))
            setTotalPriceWithPoints(prev => prev + 1);
        }
    };
    
    const handleIncreaseCustomBucks = (item) => {

        const currentWalletAmount = walletTBucksRef.current;
        const finalPrice = totalPriceWithPoints;

        // check if full points toggle is enabled
        if(!getUseTBucksWalletFullAmount){

            const nextCustomValue = TBucksCustom + 1;

            // Prevent exceeding limits
            if (
                finalPrice == 0 &&
                (
                    nextCustomValue > currentWalletAmount || // exceeds wallet balance
                    nextCustomValue > finalPrice // exceeds price
                )
            ) {
                return; // Don't apply if limit reached
            }

            // Apply increment
            setTBucksCustom(nextCustomValue);
            setWalletData(prev => ({...prev, t_bucks: prev.t_bucks - 1}))
            setTotalPriceWithPoints(prev => prev - 1);
        }
    };

    const handleDecreaseCustomTravelDollars = (item) => {
        // check if full points toggle is enabled
        if (!getUseTDollarsWalletFullAmount) {
            const nextCustomValue = TDollarsCustom - 1;

            // Prevent going below 0
            if (nextCustomValue < 0) {
                return;
            }

            // Apply decrement
            setTDollarsCustom(nextCustomValue);
            setWalletData(prev => ({...prev, t_dollars: prev.t_dollars + 1}))
            setTotalPriceWithPoints(prev => prev + 1);
        }
    };
    
    const handleIncreaseCustomTravelDollars = (item) => {

        const currentWalletAmount = walletTDollarsRef.current;
        const finalPrice = totalPriceWithPoints;

        // check if full points toggle is enabled
        if(!getUseTDollarsWalletFullAmount){

            const nextCustomValue = TDollarsCustom + 1;

            // Prevent exceeding limits
            if (
                finalPrice == 0 &&
                (
                    nextCustomValue > currentWalletAmount || // exceeds wallet balance
                    nextCustomValue > finalPrice // exceeds price
                )
            ) {
                return; // Don't apply if limit reached
            }

            // Apply increment
            setTDollarsCustom(nextCustomValue);
            setWalletData(prev => ({...prev, t_dollars: prev.t_dollars - 1}))
            setTotalPriceWithPoints(prev => prev - 1);
        }
    };
    
    const handleDecreaseCustomPoints = (item) => {

        // check if full points toggle is enabled
        if (!UseTPointsWalletFullAmount) {
            const nextCustomValue = TPointsCustom - 1;

            // Prevent going below 0
            if (nextCustomValue < 0) {
                return;
            }

            // Apply decrement
            setTPointsCustom(nextCustomValue);
            setTPointsWallet(prev => prev + 1);
            setTotalPriceWithPoints(prev => prev + 1);
        }

    };
    
    const handleIncreaseCustomPoints = (item) =>{
        const currentWalletAmount = walletRef.current;
        const finalPrice = totalPriceWithPoints;
        const maxPointsAllowed = parseFloat(item.offers_table.offers_points_amount);
    
        // check if full points toggle is enabled
        if(!UseTPointsWalletFullAmount){
    
            const nextCustomValue = TPointsCustom + 1;
        
            // Prevent exceeding limits
            if (
                finalPrice == 0 &&
                (
                    nextCustomValue > maxPointsAllowed || // exceeds what offer allows
                    nextCustomValue > currentWalletAmount || // exceeds wallet balance
                    nextCustomValue > finalPrice // exceeds price
                )
            ) {
                return; // Don't apply if limit reached
            }
        
            // Apply increment
            setTPointsCustom(nextCustomValue);
            setTPointsWallet(prev => prev - 1);
            setTotalPriceWithPoints(prev => prev - 1);
        }
    }
      
    const handleDecreaseFunc = () => {
        resetOnGuestCountChange()
        if (count > 1){
            setCount(prev => {
                const newCount = prev - 1;

                const offers_amount = parseFloat(initialFinalPrice.current);
                setTotalPriceWithPoints(offers_amount * newCount);

                return newCount;
            })
        } 
    }
    
    const handleIncreaseFunc = () => {
        resetOnGuestCountChange()
        if (count < maxGuestCount.current){
            setCount(prev => {
                const newCount = prev + 1;

                const offers_amount = parseFloat(initialFinalPrice.current);
                setTotalPriceWithPoints(offers_amount * newCount);

                return newCount;
            })
        } 
    }
    
    const HandleOfferTabSelection = (item) =>{

        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));

        resetOnGuestCountChange()
        setConfirmCheckoutStatus(false)
        setActiveTab(item)
        setCount(item.offers_table.supplier_table.room_type.room_type_guest_count)
        setTotalPriceWithPoints(item.offers_table.offers_amount * item.offers_table.supplier_table.room_type.room_type_guest_count)

        initialFinalPrice.current = item.offers_table.offers_amount
        maxGuestCount.current = item.offers_table.supplier_table.room_type.room_type_guest_count
    }
    
    const HandleOfferDetails = (item) =>{
        getTBucksAndTPoints()
        ResultSetHomeContentsDetails(item)
        setTotalPriceWithPoints(0)
        setOpenBottomOffer(true)
        setLoadingContent(false)
    }
 
    const resetOnClose = () =>{

        setCurrentStep(0);

        setActiveTab(null)

        setConfirmCheckoutStatus(false)

        getTBucksAndTPoints()
        setTotalPriceWithPoints(0)

        setTPointsCustom(0)
        setTBucksCustom(0)
        setTDollarsCustom(0)

        setTPointsWallet(walletRef.current)
        setWalletData(prev => ({...prev, t_bucks: walletTBucksRef.current}))
        setWalletData(prev => ({...prev, t_dollars: walletTDollarsRef.current}))

        setUseTBucksWalletFullAmount(false)
        setUseTPointsWalletFullAmount(false)
        setUseTDollarsWalletFullAmount(false)
    }
    
    const resetOnGuestCountChange = () =>{
        getTBucksAndTPoints()

        setConfirmCheckoutStatus(false)

        setTPointsCustom(0)
        setTBucksCustom(0)
        setTDollarsCustom(0)

        setTPointsWallet(walletRef.current)
        setWalletData(prev => ({...prev, t_bucks: walletTBucksRef.current}))
        setWalletData(prev => ({...prev, t_dollars: walletTDollarsRef.current}))

        setUseTBucksWalletFullAmount(false)
        setUseTPointsWalletFullAmount(false)
        setUseTDollarsWalletFullAmount(false)
    }

    const getTBucksAndTPoints = async() =>{
        setLoadingContent(true)
        await api_account.getTBucksAndTPoints(auth_states.StateToken).then((result) =>{
            if(result.status){
                setLoadingContent(false)
                // setWalletData(result.data.data)
                Object.keys(result.data.data).map((item, key) =>{
                    setWalletData((prev) => ({
                        ...prev,
                        [item]: result.data.data[item]
                    }));
                })

                walletRef.current = result.data.data.t_points
                walletTBucksRef.current = result.data.data.t_bucks
                walletTDollarsRef.current = result.data.data.t_dollars

                setTPointsWallet(result.data.data.t_points)
            }
          
            setLoadingContent(false)
    
        }).catch((err) =>{
            setLoadingContent(false)
        })
    }

    const GetTravelProductContent = async() =>{
        setLoadingContent(true)

        const id = searchParams.get('view')
        await api_content.GetTravelProductContent(id, auth_states.StateToken).then((result) =>{
            if(result.status){
                HandleOfferDetails(result.data.data)
            }
        }).catch((err) =>{
            setLoadingContent(false)
            console.log("GetTravelProductContent", err)
        })
    }
      
    const ShowContent = async() =>{
        setLoadingContent(true)

        const id = searchParams.get('view')
        await api_content.ShowContent(id).then((result) =>{
            if(result.status){
                setLoadingContent(false)
                ResultSetHomeContents(result.data.data)
            }
        }).catch((err) =>{
            console.log("ShowContent", err)
        })
    }

    useEffect(()=>{
        ShowContent()
    },[])

    useEffect(() =>{
        if(auth_states.SelectedLanguage){
            selectedLanguage.current = parseInt(auth_states.SelectedLanguage.id)
            ShowContent()
        }
    },[auth_states])

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
    },[auth_states, loadingContent, getGuestInformation, openBottomOffer, count])

    useEffect(() => {
        if (editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic'],
                        ['link', 'image'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ]
                }
            });

            // Paste HTML directly
            quillRef.current.clipboard.dangerouslyPasteHTML(
                ResultGetHomeContents.content_description
            );
        }
    }, []);

    const EnableOffersButton = () =>{
        return(
            <div className='flex items-center justify-start my-2'>
                <div>
                    <button 
                onClick={() => GetTravelProductContent()} 
                className="book_now_label_id flex-1 px-9 h-14 font-semibold rounded-lg bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600 text-white text-3xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
                    Book Now
                </button>
                </div>
            </div>
        )
    }

    const ModalForUpgradeSubscriptionWhenVIP = () =>{
        return(
            <div>
                <dialog ref={modalSubscriptionRef} id="my_modal_2" className="modal">
                    <div className="modal-box">
                        <div className="flex-1 mt-5 space-y-1 md:space-y-8">
                            <h2 className="text-2xl font-extrabold leading-tight text-center text-black capitalize md:text-3xl available_only_for_vip_members_id">
                            available only for VIP members.
                            </h2>

                            <div className="flex flex-col items-center space-y-3 ">
                                <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-full">
                                    <img
                                    className="w-[60px] md:w-[100px]"
                                    // alt="Tailwind CSS chat bubble component"
                                    src={Logo2} />
                                </div>
                                {/* Text Content */}
                                <div className="flex-1 text-center">
                                    <p className="text-sm font-semibold earn_more_points_id">Earn more points</p>
                                    <p className="text-xs text-gray-600 members_could_save_id">
                                        Paid Memberships could save time and money finding great deals.
                                    </p>
                                </div>

                                <div className='flex justify-center'>
                                    <button onClick={() => navigate('/subscriptions')} className="px-6 py-3 text-white transition-colors bg-[#031956] rounded-lg whitespace-nowrap upgrade_membership_id">
                                    Upgrade Membership
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button className='close_label_id'>close</button>
                    </form>
                </dialog>
            </div>
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
                <Link to={'/'}>
                    <div className={`flex flex-col items-center text-white `}>
                        <div className="mb-1 text-lg"><TiHomeOutline size={20}/></div>
                        <span className="text-[14px] home_label_id">Home</span>
                    </div>
                </Link>
                <Link to={'/event'}>
                    <div className={`flex flex-col items-center ${((location.pathname.split("/")).includes('event') ? true : false) ? "text-white" : "text-gray-400"} `}>
                        <div className="mb-1 text-lg"><LuTickets size={20}/></div>
                        <span className="text-[14px] events_label_id">Events</span>
                    </div>
                </Link>
                <Link to={'/account'}>
                    <div className={`flex flex-col items-center ${((location.pathname.split("/")).includes('account') ? true : false) ? "text-white" : "text-gray-400"} `}>
                        <div className="mb-1 text-lg"><HiMiniBuildingOffice2 size={20}/></div>
                        <span className="text-[14px] office_label_id">Office</span>
                    </div>
                </Link>
                <Link to={'/details'}>
                    <div className={`flex flex-col items-center ${((location.pathname.split("/")).includes('details') ? true : false) ? "text-white" : "text-gray-400"} `}>
                        <div className="mb-1 text-lg"><FaRegCircleUser size={20}/></div>
                        <span className="text-[14px] profile_label_id">Profile</span>
                    </div>
                </Link>
            </div>
        )
    }

    const LoadComp = () =>{
        return(
            <div className=''>
                <div className="flex flex-col justify-center w-full gap-4 py-10">
                    <div className="w-full h-32 skeleton"></div>
                    <div className="h-4 skeleton w-28"></div>
                    <div className="w-full h-4 skeleton"></div>
                    <div className="w-full h-4 skeleton"></div>
                </div>
            </div>
        )
    }

    const EmbeddedVideoUrl = ({type, videoId}) => {
        return (
          <div  className=' w-[100%] h-[100%] '>
            <div className="w-full overflow-hidden rounded-lg aspect-video ">
              {
                type == "embed" 
                ? 
                  (
                    <iframe
                      src={videoId + "&autoplay=0"}
                      title="Embedded video"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      frameBorder="0"
                    />
                  ) 
                : 
                  ( 
                    type === "video"
                    ?
                        <video
                        src={env.VITE_APP_BACKEND_STORAGE_URL +  videoId }
                        controls
                        className="object-cover w-full h-full rounded-lg"
                        />  
                    : <></>
                  )
              }
            </div>
          </div>
        )
    }

    const [formData, setFormData] = useState({
        passportName: '',
        passportNumber: '',
        birthdate: '',
        contactNumber: '',
        contactEmail: '',
        gender: ''
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
            setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.passportName.trim()) {
            newErrors.passportName = 'Passport name is required';
        }

        if (!formData.passportNumber.trim()) {
            newErrors.passportNumber = 'Passport number is required';
        }

        if (!formData.birthdate) {
            newErrors.birthdate = 'Birthdate is required';
        }

        if (!formData.contactNumber.trim()) {
            newErrors.contactNumber = 'Contact number is required';
        }

        if (!formData.contactEmail.trim()) {
            newErrors.contactEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
            newErrors.contactEmail = 'Email format is invalid';
        }

        if (!formData.gender) {
            newErrors.gender = 'Gender is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const AddToList = () =>{
        if (validateForm()){
            setGuestInformation(prev => [...prev, {
                passportName: formData.passportName,
                passportNumber: formData.passportNumber,
                birthdate: formData.birthdate,
                contactNumber: formData.contactNumber,
                contactEmail: formData.contactEmail,
                gender: formData.gender
            }])

            setFormData({
                passportName: '',
                passportNumber: '',
                birthdate: '',
                contactNumber: '',
                contactEmail: '',
                gender: ''
            })
        }
    }

    const removeGuest = (indexToRemove) => {
        setGuestInformation(prev =>
            prev.filter((_, index) => index !== indexToRemove)
        )
    }

    const GuestDetailsForm = () =>{
        return(
            <div className="flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
                <div className="w-full max-w-2xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-4xl font-bold text-foreground complete_your_booking_label_id">Complete Your Booking</h1>
                        <p className="text-lg text-muted-foreground please_provide_details_label_id">Please provide your details to proceed with checkout</p>
                    </div>

                    {/* Form Card */}
                    <div className="p-8 space-y-6 border shadow-2xl bg-card rounded-2xl border-border">
                        {
                            getGuestInformation.length <  count &&
                            <div className="space-y-6">
                                {/* Passport Name */}
                                <div className="space-y-2">
                                    <label htmlFor="passportName" className="block text-sm font-semibold passport_name_label_id text-foreground">
                                    Passport Name *
                                    </label>
                                    <input
                                    type="text"
                                    id="passportName"
                                    name="passportName"
                                    value={formData.passportName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg passport_name_label_id border transition-all duration-300 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                                        errors.passportName ? 'border-destructive' : 'border-border'
                                    }`}
                                    placeholder="Enter your full name as on passport"
                                    />
                                    {/* {errors.passportName && (
                                    <p className="mt-1 text-sm text-destructive">{errors.passportName}</p>
                                    )} */}
                                </div>

                                {/* Passport Number */}
                                <div className="space-y-2">
                                    <label htmlFor="passportNumber" className="block text-sm font-semibold passport_number_label_id text-foreground">
                                    Passport Number *
                                    </label>
                                    <input
                                    type="text"
                                    id="passportNumber"
                                    name="passportNumber"
                                    value={formData.passportNumber}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 passport_number_label_id rounded-lg border transition-all duration-300 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                                        errors.passportNumber ? 'border-destructive' : 'border-border'
                                    }`}
                                    placeholder="Enter passport number"
                                    />
                                    {/* {errors.passportNumber && (
                                    <p className="mt-1 text-sm text-destructive">{errors.passportNumber}</p>
                                    )} */}
                                </div>

                                {/* Birthdate and Gender Row */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Birthdate */}
                                    <div className="space-y-2">
                                    <label htmlFor="birthdate" className="block text-sm font-semibold date_of_birth_label_id text-foreground">
                                        Date of Birth *
                                    </label>
                                    <input
                                    type="text"
                                    id="birthdate"
                                    name="birthdate"
                                    placeholder="MM/DD/YYYY"
                                    maxLength={10}
                                    value={formData.birthdate}
                                    onChange={(e) => {
                                        let value = e.target.value;

                                        // Remove all non-digit characters
                                        value = value.replace(/\D/g, '');

                                        // Auto-insert slashes as user types
                                        if (value.length >= 3 && value.length <= 4) {
                                        value = value.slice(0, 2) + '/' + value.slice(2);
                                        } else if (value.length >= 5) {
                                        value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
                                        }

                                        setFormData((prev) => ({ ...prev, birthdate: value }));

                                        // Validate full format when length is 10
                                        const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;

                                        if (value.length === 10 && !dateRegex.test(value)) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            birthdate: 'Invalid date format. Use MM/DD/YYYY.',
                                        }));
                                        } else {
                                        setErrors((prev) => ({ ...prev, birthdate: '' }));
                                        }
                                    }}
                                    className={`w-full px-4 py-3 rounded-lg border date_of_birth_label_id transition-all duration-300 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                                        errors.birthdate ? 'border-destructive' : 'border-border'
                                    }`}
                                    />
                                    </div>

                                    {/* Gender */}
                                    <div className="space-y-2">
                                    <label htmlFor="gender" className="block text-sm font-semibold gender_label_id text-foreground">
                                        Gender *
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                                        errors.gender ? 'border-destructive' : 'border-border'
                                        }`}
                                    >
                                        <option value=""><span className='select_gender_label_id'>Select gender</span></option>
                                        <option value="male"><span className='male_label_id'>Male</span></option>
                                        <option value="female"><span className='female_label_id'>Female</span></option>
                                        <option value="other"><span className='other_label_id'>Other</span></option>
                                        <option value="prefer-not-to-say"><span className='prefer_not_to_say_label_id'>Prefer not to say</span></option>
                                    </select>
                                    {/* {errors.gender && (
                                        <p className="mt-1 text-sm text-destructive">{errors.gender}</p>
                                    )} */}
                                    </div>
                                </div>

                                <div className='flex flex-wrap justify-start gap-5'>
                                    {/* Contact Number */}
                                    <div className="space-y-2">
                                        <label htmlFor="contactNumber" className="block text-sm font-semibold contact_number_label_id text-foreground">
                                        Contact Number *
                                        </label>
                                        <input
                                        type="tel"
                                        id="contactNumber"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 contact_number_label_id rounded-lg border transition-all duration-300 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                                            errors.contactNumber ? 'border-destructive' : 'border-border'
                                        }`}
                                        placeholder="Enter your phone number"
                                        />
                                        {/* {errors.contactNumber && (
                                        <p className="mt-1 text-sm text-destructive">{errors.contactNumber}</p>
                                        )} */}
                                    </div>

                                    {/* Contact Email */}
                                    <div className="space-y-2">
                                        <label htmlFor="contactEmail" className="block text-sm font-semibold email_address_label_id text-foreground">
                                        Email Address *
                                        </label>
                                        <input
                                        type="email"
                                        id="contactEmail"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 email_address_label_id rounded-lg border transition-all duration-300 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                                            errors.contactEmail ? 'border-destructive' : 'border-border'
                                        }`}
                                        placeholder="Enter your email address"
                                        />
                                        {/* {errors.contactEmail && (
                                        <p className="mt-1 text-sm text-destructive">{errors.contactEmail}</p>
                                        )} */}
                                    </div>
                                </div>

                                <button 
                                onClick={() => AddToList()} 
                                className="save_label_id flex-1 h-12 px-3 rounded-lg bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600 text-white text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
                                    Save
                                </button>
                            </div>
                        }

                        <div className='flex flex-wrap gap-5'>
                            {getGuestInformation.length > 0 && getGuestInformation.map((guest, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 mb-4 border border-blue-100 bg-blue-50 rounded-xl"
                                >
                                    <div  className='space-y-5'>
                                        <div>
                                            <div className="flex items-center space-x-3">
                                                <label className="block text-sm font-semibold text-foreground passport_name_label_id">
                                                Passport Name
                                                </label>
                                                <span>:</span>
                                                <p>{guest.passportName}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <label className="block text-sm font-semibold text-foreground passport_number_label_id">
                                                Passport Number
                                                </label>
                                                <span>:</span>
                                                <p>{guest.passportNumber}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <label className="block text-sm font-semibold text-foreground date_of_birth_label_id">
                                                Date of Birth
                                                </label>
                                                <span>:</span>
                                                <p>{guest.birthdate}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <label className="block text-sm font-semibold text-foreground gender_label_id">
                                                Gender
                                                </label>
                                                <span>:</span>
                                                <p>{guest.gender}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <label className="block text-sm font-semibold text-foreground contact_number_label_id">
                                                Contact Number
                                                </label>
                                                <span>:</span>
                                                <p>{guest.contactNumber}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <label className="block text-sm font-semibold text-foreground email_address_label_id">
                                                Email Address
                                                </label>
                                                <span>:</span>
                                                <p>{guest.contactEmail}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => removeGuest(index)}>
                                            <div className='flex items-center justify-center space-x-2'>
                                                <IoIosCloseCircleOutline  className="text-[23px] text-red-700" />
                                                <p className='font-bold text-red-700 remove_label_id'>Remove</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        
                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4">
                            <button  
                            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))} 
                            className="px-2 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 back_to_previous_label_id"
                            >Back To Previous
                            </button>
                            {
                                getGuestInformation.length === count &&
                                <button
                                onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
                                type="submit"
                                className="complete_booking_label_id w-[80%] bg-gradient-to-r from-orange-500 via-orange-600 hover:shadow-lg text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                >
                                Complete Booking & Checkout
                                </button>
                            }
                        </div>

                        {/* Additional Info */}
                        <div className="pt-4 text-center">
                            <p className="text-sm text-muted-foreground your_information_is_secure_label_id">
                            Your information is secure and encrypted. We respect your privacy.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground need_help_contact_support_label_id">
                        Need help? Contact our support team for assistance.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const Stepper = () => {
        return (
            <div className="flex justify-center">
                <ul className="steps">
                    <li className={`step ${0 <= currentStep ? 'step-primary' : ''}`}>
                        <span className="choose_booking_offers_label_id">Choose Booking Offers</span>
                    </li>
                    <li className={`step ${1 <= currentStep ? 'step-primary' : ''}`}>
                        <span className="adjust_label_id">Adjust</span>
                    </li>
                    <li className={`step ${2 <= currentStep ? 'step-primary' : ''}`}>
                        <span className="info_label_id">Info</span>
                    </li>
                    <li className={`step ${3 <= currentStep ? 'step-primary' : ''}`}>
                        <span className="pay_label_id">Pay</span>
                    </li>
                </ul>
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
                logoutNavigate={() => navigate('/login')}
                />
            </div>

            <main >

            {
                loadingContent
                ? 
                    <div className='flex justify-center my-5'>
                        <div className='md:w-[75%] w-[95%]'>
                            <LoadComp/>
                        </div>
                    </div>
                :
                    <div className='mb-[150px] flex justify-center'>
                        <div className='flex justify-center w-[90%] md:w-[70%]'>
                            <div className='md:w-[75%] w-[95%] space-y-5'>

                                <button onClick={() => navigate(-1)}>
                                    <div className='flex items-center p-5 space-x-1'>
                                        <IoIosArrowBack size={30} className='text-black'/>
                                        <p className='text-black back_label_id'>Back</p>
                                    </div>
                                </button>
                                
                                <p className='font-bold text-[#001d3d] text-[35px] capitalize'>
                                    {
                                    selectedLanguage.current == null 
                                    ? ResultGetHomeContents.content_title
                                    : 
                                        ResultGetHomeContents.translation
                                        ?
                                            (
                                                ResultGetHomeContents.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                                ? ResultGetHomeContents.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_title
                                                : ResultGetHomeContents.content_title
                                            )
                                        : ResultGetHomeContents.translation
                                    }
                                </p>
                                {
                                    ResultGetHomeContents.content_category.category_display_content.display.content_home_style.embed_video_url
                                    ?
                                        <EmbeddedVideoUrl 
                                        type={ResultGetHomeContents.uploads_table_main_view.upload_type}
                                        videoId={ResultGetHomeContents.uploads_table_main_view.upload_url}
                                        />
                                    :
                                    <div className='flex justify-start'>
                                        <img
                                        src={
                                            ResultGetHomeContents.uploads_table_main_view.upload_type === "url" 
                                            ? ResultGetHomeContents.uploads_table_main_view.upload_url 
                                            : env.VITE_APP_BACKEND_STORAGE_URL + ResultGetHomeContents.uploads_table_main_view.upload_url
                                        }
                                        alt=""  
                                        className="object-contain w-full md:w-[500px] "
                                        />
                                    </div>
                                }

                                {EnableOffersButton()}

                                {
                                    ResultGetHomeContents.content_date_from &&
                                    ResultGetHomeContents.content_date_to &&
                                    <div className='my-5 text-left'>
                                    <p className='text-[#001d3d] capitalize'> 
                                        <span className='font-bold from_id'>from </span> 
                                        <span>{ResultGetHomeContents.content_date_from}</span>
                                    </p>
                                    <p className='text-[#001d3d] capitalize'>
                                        <span className='font-bold to_id'>to </span> 
                                        <span>{ResultGetHomeContents.content_date_to}</span>
                                    </p>
                                    </div>
                                }

                                {
                                    ResultGetHomeContents.content_date_from &&
                                    ResultGetHomeContents.content_date_to &&
                                    <div className='flex items-center justify-start space-x-3'>
                                        <p className='text-[#001d3d] capitalize space-x-3 text-left my-5'>
                                            <span className='font-bold duration_id'>Duration </span> 
                                        </p>
                                        <div className='flex items-start justify-start space-x-2'>
                                            <p className='text-[#001d3d] capitalize space-x-3 text-left my-5 justify-start items-center'>
                                                <span className=''>{ResultGetHomeContents.content_days_count}</span>
                                                <span className='days_id'>days</span>
                                            </p>
                                            <p className='text-[#001d3d] capitalize space-x-3 text-left my-5 justify-start items-center'>
                                                <span className=''>{ResultGetHomeContents.content_night_count}</span>
                                                <span className='nights_id'>nights</span>
                                            </p>
                                        </div>
                                    </div>
                                }
                                
                                <div 
                                className="quill-content"
                                dangerouslySetInnerHTML={{
                                __html: selectedLanguage.current == null 
                                        ? ResultGetHomeContents.content_description
                                        : 
                                            ResultGetHomeContents.translation
                                            ?
                                                (
                                                    ResultGetHomeContents.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                                    ? ResultGetHomeContents.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_description
                                                    : ResultGetHomeContents.content_description
                                                )
                                            : ResultGetHomeContents.content_description
                                }} 

                                ></div>

                                <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                                {
                                    ResultGetHomeContents.uploads_table.map((item) => (
                                        item.upload_type === "url"
                                        ?
                                            <img
                                            src={item.upload_url }
                                            alt=""  
                                            className="object-contain w-full"
                                            />
                                        :
                                        (
                                            item.upload_type === "image"
                                            ?
                                                <img
                                                src={env.VITE_APP_BACKEND_STORAGE_URL + item.upload_url}
                                                alt=""  
                                                className="object-contain w-full h-[400px]"
                                                />
                                            :
                                                <EmbeddedVideoUrl type={item.upload_type} videoId={item.upload_url}/>
                                        )
                                    ))
                                }
                                </div>

                                {EnableOffersButton()}
                                
                            </div>
                        </div>
                    </div>
            }
               
            </main>

            {
                openBottomOffer &&
                (
                    <OffersBottomSheet
                    handleCheckout={() => handleCheckout(activeTab, ResultGetHomeContentsDetails)}
                    handleEbanxCheckout={() => handleEbanxCheckout(activeTab, ResultGetHomeContentsDetails)}
                    handleClose={() => {
                            setOpenBottomOffer(!openBottomOffer)
                            resetOnClose()
                        }
                    }
                    handleIncrease={() => handleIncreaseFunc()}
                    handleDecrease={() => handleDecreaseFunc()}
                    handleCustomTPoints={(text) => handleCustomPoints(text, activeTab)}

                    defaultTBucks={walletTBucksRef.current}
                    defaultTPoints={walletRef.current}
                    defaultTDollars={walletTDollarsRef.current}
            
                    handleRedeemFullTPoints={() => handleTpoints(activeTab)}
                    handleRedeemFullTBucks={() => handleTbucks(activeTab)}
                    handleRedeemFullTDollars={() => handleTDollars(activeTab)}
            
                    handleDecreaseCustomPoints={() => handleDecreaseCustomPoints(activeTab)}
                    handleIncreaseCustomPoints={() => handleIncreaseCustomPoints(activeTab)}
            
                    handleDecreaseCustomBucks={() => handleDecreaseCustomBucks(activeTab)}
                    handleIncreaseCustomBucks={() => handleIncreaseCustomBucks(activeTab)}
            
                    handleDecreaseCustomTravelDollars={() => handleDecreaseCustomTravelDollars(activeTab)}
                    handleIncreaseCustomTravelDollars={() => handleIncreaseCustomTravelDollars(activeTab)}
                    
                    isRedeemFull={UseTPointsWalletFullAmount}
                    isRedeemFullTBucks={getUseTBucksWalletFullAmount}
                    isRedeemFullTDollars={getUseTDollarsWalletFullAmount}
            
                    confirmCheckoutStatus={getConfirmCheckoutStatus}
            
                    count={count}

                    backOnPricingOption={() => {
                        setConfirmCheckoutStatus(false)
                    }}
                    backOnPricingTabOption={() => {
                        setActiveTab(null)
                        setCurrentStep(0)
                    }}
            
                    customTPoints={TPointsCustom}
                    customTBucks={TBucksCustom}
                    customTDollars={TDollarsCustom}
            
                    handleCustomTBucks={(text) => handleCustomBucks(text, activeTab)}
            
                    handleCustomTravelDollars={(text) => handleCustomTravelDollars(text, activeTab)}
            
                    tabData={activeTab}

                    guestDetails={GuestDetailsForm()}
                    // guestDetails={<GuestDetailsForm/>}
                    // stepperDetails={<Stepper/>}
                    stepperDetails={Stepper()}
                    handleNextStep={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
                    handlePrevStep={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
                    currentStep={currentStep}
            
                    wallet={parseFloat(TPointsWallet).toFixed(2)}
                    tBucksWallet={parseFloat(walletData.t_bucks).toFixed(2)}
                    tDollarsWallet={parseFloat(walletData.t_dollars).toFixed(2)}
            
                    finalAmount={parseFloat(totalPriceWithPoints).toFixed(2)}
                    offersData={ResultGetHomeContentsDetails}
                    >
                        <div className="flex flex-wrap justify-center gap-5">
                        {
                            ResultGetHomeContentsDetails.content_offers_table.map((item, key) =>(
            
                                item.offers_table &&
                                item.offers_table.membership_type_table &&
                                <button 
                                onClick={() => {
                                    HandleOfferTabSelection(item)
                                }} 
                                key={key} 
                                className={`${ activeTab && activeTab.offers_id == item.offers_id ? 'bg-yellow-400 text-black ' : ''} border h-auto rounded-lg shadow-sm p-5 w-[300px]`}>
                                    <div className={`${activeTab && activeTab.offers_id == item.offers_id ? 'font-extrabold' : 'font-normal'}  text-[18px] uppercase space-y-2`}>
                                        <div className=''>
                                            <div className='flex-col space-y-2'>

                                                <div className='flex items-center pb-2 space-x-2 border-b'>
                                                    <LuCalendarClock className="flex-shrink-0 w-5 h-5" />
                                                    <p className='flex justify-center space-x-1'>
                                                        <span className='font-semibold'>
                                                            {     
                                                            selectedLanguage.current == null 
                                                            ? item.offers_table.tier_category_table.tier_category_name
                                                            : 
                                                                item.offers_table.tier_category_table.translation
                                                                ?
                                                                    (
                                                                        item.offers_table.tier_category_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                                                        ? item.offers_table.tier_category_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).tier_category_name
                                                                        : item.offers_table.tier_category_table.tier_category_name
                                                                    )
                                                                : item.offers_table.tier_category_table.tier_category_name
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className='flex items-center pb-2 space-x-2 border-b'>
                                                    <MdOutlineVerified className="flex-shrink-0 w-5 h-5" />
                                                    <p className='flex justify-center space-x-1'>
                                                        <span className='font-semibold'>
                                                        {
                                                            selectedLanguage.current == null 
                                                            ? item.offers_table.membership_type_table.type_title
                                                            : 
                                                                item.offers_table.membership_type_table.translation
                                                                ?
                                                                    (
                                                                        item.offers_table.membership_type_table.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                                                        ? item.offers_table.membership_type_table.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_title
                                                                        : item.offers_table.membership_type_table.type_title
                                                                    )
                                                                :   item.offers_table.membership_type_table.type_title
                                                        }
                                                        </span>
                                                    </p>
                                                </div>
                                                
                                                <div className='flex items-center pb-2 space-x-2 '>
                                                    <MdOutlineLocalHotel className="flex-shrink-0 w-5 h-5" />
                                                    <p className='text-[15px] font-normal capitalize'>
                                                        {
                                                            selectedLanguage.current == null 
                                                            ? item.offers_table.supplier_table.supplier_description
                                                            : 
                                                                item.offers_table.supplier_table.translation
                                                                ?
                                                                    (
                                                                        item.offers_table.supplier_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                                                        ? item.offers_table.supplier_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).supplier_description
                                                                        : item.offers_table.supplier_table.supplier_description
                                                                    )
                                                                :   item.offers_table.supplier_table.supplier_description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-3 p-3 border border-green-100 bg-green-50 rounded-xl">
                                            <FaRegCalendar  className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="space-x-1 text-sm font-medium text-gray-900 capitalize">
                                                    <span className='registration_id'>Registration</span>
                                                </p>
                                                <p className="text-xs text-gray-600 ends_id">Ends {item.offers_table.offers_end_daily_period}</p>
                                                <p className="mt-1 text-xs text-gray-500">{format(new Date(item.offers_table.offers_end_effectivity_date), 'M/d/yyyy')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))
                        }
                        </div>
                    </OffersBottomSheet>
                )
            }

            {
                openBottomPayment && 
                <Checkout 
                clientSecret={getclientSecret} 
                getLoading={getLoading} 
                dataContent={paymentBContent.current} 
                handleClose={() => {
                    setOpenBottomPayment(false)
                    // resetOnClose()
                }}
                />
            }

            {
                getOpenLanguageSelection
                && 
                <LanguageBottomSheet 
                selected={getSelectedLanguage}
                handleSelectContent={(event) => setSelectedLanguage(event)}
                handleClose={() => setOpenLanguageSelection(false)} 
                DataContent={auth_states.Languages}
                />
            }

            <BottomTabNavigator/>
            <ModalForUpgradeSubscriptionWhenVIP/>
            <ToastContainer />
        </div>
    )
}

export default ProductDetails