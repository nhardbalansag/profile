import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';

import {
  HomeCard,
  OffersBottomSheet,
} from '../../component/index'

import {
  Checkout
} from '../index'

import * as api_content from '../../services/content/content.api'
import * as auth_service_api from '../../services/auth/auth.api'
import * as api_account from '../../services/account/account.api.js'
import * as api_subscription from '../../services/account/subscription.api.js'

import Logo2 from '../../assets/images/ten/logo2.png'

const env = import.meta.env;

const MallTravel = () =>{

  const navigate = useNavigate();

  const auth_states = useSelector(state => state.AuthReducer);
  const modalSubscriptionRef = useRef(null);

  //#region useRefs
  const maxGuestCount = useRef(0)

  const walletRef = useRef(0)
  const walletTBucksRef = useRef(0)
  const walletTDollarsRef = useRef(0)

  const paymentBContent = useRef({})
  const initialFinalPrice = useRef(0)
  const countRef = useRef(0)

  const modalRef = useRef(null);

  const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)  // null means main translation is used

  const [showBottomRegistration, setShowBottomRegistration] = useState(auth_states.StateToken ? false : true);
  const [collapseDetails, setCollapseDetails] = useState(false);
  const [collapseBottomDetails, setCollapseBottomDetails] = useState(true);
  const [openBottomOffer, setOpenBottomOffer] = useState(false);
  const [openBottomPayment, setOpenBottomPayment] = useState(false);
  const [ResultGetHomeContents, ResultSetHomeContents] = useState([]);
  const [ResultGetHomeContentsDetails, ResultSetHomeContentsDetails] = useState([]);
  const [getBottomDetailsOpen, setBottomDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [count, setCount] = useState(1);
  const [totalPriceWithPoints, setTotalPriceWithPoints] = useState(0);
  const [TPointsWallet, setTPointsWallet] = useState(walletRef.current);
  const [TPointsCustom, setTPointsCustom] = useState(0);
  const [TBucksCustom, setTBucksCustom] = useState(0);
  const [TDollarsCustom, setTDollarsCustom] = useState(0);

  const [AccountSubscriptionDetails, SetAccountSubscriptionDetails] = useState([])

  const [UseTPointsWalletFullAmount, setUseTPointsWalletFullAmount] = useState(false);
  const [getUseTBucksWalletFullAmount, setUseTBucksWalletFullAmount] = useState(false);
  const [getUseTDollarsWalletFullAmount, setUseTDollarsWalletFullAmount] = useState(false);

  const [loadingContent, setLoadingContent] = useState(true);
  const [getclientSecret, setclientSecret] = useState(null)
  const [getLoading, setLoading] = useState(false)
  const [getPaymentIntentSession, setPaymentIntentSession] = useState(null)

  const [getPlatformLoading, setPlatformLoading] = useState({
    launchButton: false
  })

  const [walletData, setWalletData] = useState({
    t_points: 0,
    t_bucks: 0,
    t_dollars: 0,
    AccountTransaction:[]
  });

  const [subscriptionList, SetSubscriptionList] = useState([])
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleCheckout = async (selectedTab, AllContentData) =>{
    if(!auth_states.StateToken){
      setShowBottomRegistration(true)
      navigate('login');
    }else{

      const content_title = selectedLanguage.current == null 
      ? AllContentData.content_title
      : (
            AllContentData.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
          ? AllContentData.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_title
          : AllContentData.content_title
        )

      const membership_type = selectedLanguage.current == null 
      ? selectedTab.offers_table.membership_type_table.type_title
      : (
            selectedTab.offers_table.membership_type_table.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
          ? selectedTab.offers_table.membership_type_table.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_title
          : selectedTab.offers_table.membership_type_table.type_title
        )

      const room_type_name = selectedLanguage.current == null 
      ? selectedTab.offers_table.supplier_table.room_type.room_type_name
      : (
            selectedTab.offers_table.supplier_table.room_type.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
          ? selectedTab.offers_table.supplier_table.room_type.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).room_type_name
          : selectedTab.offers_table.supplier_table.room_type.room_type_name
        )

      const tier_category_name = selectedLanguage.current == null 
      ? selectedTab.offers_table.tier_category_table.tier_category_name
      : (
            selectedTab.offers_table.tier_category_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
          ? selectedTab.offers_table.tier_category_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).tier_category_name
          : selectedTab.offers_table.tier_category_table.tier_category_name
        )
      
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
      }

      paymentBContent.current = reqBody
      setOpenBottomPayment(true)
      
      setLoading(true)
      await api_content.GetClientSecret(auth_states.StateToken, paymentBContent.current).then((result) =>{
        if(result.status){
          setclientSecret(result.data.clientSecret)
          setPaymentIntentSession(result.data.sessionId)
          setLoading(false)
        }
      }).catch((err) =>{
          console.log("fetchClientSecret", err)
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
      const pointsAllowed = Math.min(currentWalletAmount, maxPointsAllowed);
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
        nextCustomValue > currentWalletAmount || // exceeds wallet balance
        nextCustomValue > finalPrice // exceeds price
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
        nextCustomValue > currentWalletAmount || // exceeds wallet balance
        nextCustomValue > finalPrice // exceeds price
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
        nextCustomValue > maxPointsAllowed || // exceeds what offer allows
        nextCustomValue > currentWalletAmount || // exceeds wallet balance
        nextCustomValue > finalPrice // exceeds price
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

    // if(count > 1){
    //   const offers_amount = parseFloat(initialFinalPrice.current )
    //   // setTotalPriceWithPoints(((totalPriceWithPoints !== 0 ? totalPriceWithPoints : initialFinalPrice.current)) - offers_amount)
    //   setTotalPriceWithPoints(offers_amount * count)
    // }
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

    // if(count < maxGuestCount.current){
    //   const offers_amount = parseFloat(initialFinalPrice.current )
    //   // setTotalPriceWithPoints(((totalPriceWithPoints !== 0 ? totalPriceWithPoints : initialFinalPrice.current)) + offers_amount)
    //   setTotalPriceWithPoints(offers_amount * count)
    // }
   
  }

  const HandleOfferTabSelection = (item) =>{
    setActiveTab(item)
    setCount(item.offers_table.supplier_table.room_type.room_type_guest_count)
    setTotalPriceWithPoints(item.offers_table.offers_amount * item.offers_table.supplier_table.room_type.room_type_guest_count)

    initialFinalPrice.current = item.offers_table.offers_amount
    maxGuestCount.current = item.offers_table.supplier_table.room_type.room_type_guest_count
  }

  const HandleSeeDetails = (item) =>{
    isDesktopOrLaptop ? setBottomDetailsOpen(true) : setCollapseDetails(!collapseDetails)
    ResultSetHomeContentsDetails(item)
  }

  const HandleOfferDetails = (item) =>{
    getTBucksAndTPoints()
    setOpenBottomOffer(true)
    ResultSetHomeContentsDetails(item)
    setTotalPriceWithPoints(0)

    // initialFinalPrice.current = item.content_offers_table[0].offers_table.offers_amount
    // setCount(item.content_offers_table[0].offers_table.supplier_table.room_type.room_type_guest_count)
    // maxGuestCount.current = item.content_offers_table[0].offers_table.supplier_table.room_type.room_type_guest_count
  }

  const GetTravelBucketListContent = async() =>{
    setLoadingContent(true)
    await api_content.GetTravelBucketListContent(auth_states.StateToken).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        ResultSetHomeContents(result.data.data)
      }
    }).catch((err) =>{
      console.log("GetTravelBucketListContent", err)
    })
  }

  const GetUserAccountSubscriptionDetails = async () =>{
    setLoadingContent(true)
    await api_subscription.GetUserAccountSubscriptionDetails(auth_states.StateToken).then((result) =>{
      SetAccountSubscriptionDetails(result.data.data)
      setLoadingContent(false)
    }).catch((err) =>{
      setLoadingContent(false)
    })
  }

  const resetOnClose = () =>{
    setActiveTab(null)

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

  useEffect(()=>{
      GetUserAccountSubscriptionDetails()
  },[])

  //#region useEffects
  useEffect(() =>{
    GetTravelBucketListContent()
  },[])

  useEffect(() =>{
    if(auth_states.SelectedLanguage){
      selectedLanguage.current = parseInt(auth_states.SelectedLanguage.id)
      GetTravelBucketListContent()
      userSubscriptionCategories()
    }
  },[auth_states])

  useEffect(() =>{
    setShowBottomRegistration(auth_states.StateToken ? false : true)
  },[auth_states.StateToken])

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
  },[auth_states, loadingContent])
  //#endregion

  const userSubscriptionCategories = async (event) =>{
    setLoading(true)
    await auth_service_api.userSubscriptionCategories().then((result) =>{
      SetSubscriptionList(result.data.data)
      setLoading(false)
    }).catch((err) =>{
      setLoading(false)
      // setToastVisibility(true)
      // setToastMessage(err)
    })
  }

  const xeniRegisterApi = async () =>{

    setPlatformLoading(prev => ({
      ...prev,
      launchButton: true
    }));

    const requestBody = {
      "first_name": auth_states.StateUserInformation.first_name,
      "last_name": auth_states.StateUserInformation.last_name,
      "email": auth_states.StateUserInformation.email,
      "agencyCustomDNS": "https://ota.clubten.app",
      "agencyName": "Club TEN Global by Planet Empire FZCO"
    }

    await api_account.xeniRegisterApi(requestBody).then((result) =>{

      setPlatformLoading(prev => ({
        ...prev,
        launchButton: false
      }));

      UpdateAccountXeniPlatformAccess()
       
    }).catch((err) =>{
      setPlatformLoading(prev => ({
        ...prev,
        launchButton: false
      }));

      if(!err.response.data.status){
        if(err.response.data.message.includes("duplicate")){
          UpdateAccountXeniPlatformAccess()
        }
      }
    })
  }

  const UpdateAccountXeniPlatformAccess = async () =>{

    setPlatformLoading(prev => ({
      ...prev,
      launchButton: true
    }));

    await api_account.UpdateAccountXeniPlatformAccess(auth_states.StateToken).then((result) =>{

      setPlatformLoading(prev => ({
        ...prev,
        launchButton: false
      }));

      if(result.status){
        requestToken()
      }

    }).catch((err) =>{
      setPlatformLoading(prev => ({
        ...prev,
        launchButton: false
      }));
    })
  }

  const requestToken = async () =>{

    setPlatformLoading(prev => ({
      ...prev,
      launchButton: true
    }));

    await api_account.requestToken(auth_states.StateToken).then((result) =>{

      setPlatformLoading(prev => ({
        ...prev,
        launchButton: false
      }));

      if(!result.data.hasAccess){
        setTimeout(() => {
          modalRef.current?.showModal();
        }, 0); // Delay to ensure DOM is ready
      }
      else{
        if(result.data.registered_to_xeni){
          // window.open(result.data.redirectUrl, '_blank');
          window.location.href = result.data.redirectUrl;
        }else{
          xeniRegisterApi()
        }
      }

    }).catch((err) =>{
      setPlatformLoading(prev => ({
        ...prev,
        launchButton: false
      }));
    })
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
  
  useEffect(() => {
    userSubscriptionCategories()
  }, [])

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

  const _PlanSelect = ({dataList}) => {
    return(
      <div className="w-full p-6 ">
        <h2 className="mb-2 text-2xl font-bold text-center">Select Membership</h2>
        <p className="mb-6 text-sm text-center text-gray-600">
          Select the membership that matches your goals
        </p>
        <div className="space-y-4">
          {dataList.map((item, key) => (
            <div
              key={key}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                // selectedPlan === item.subscription_earning_table.id
                selectedPlan === item.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              // onClick={() => setSelectedPlan(item.subscription_earning_table.id)}
              onClick={() => {
                setSelectedPlan(item.id);
                navigate('/subscriptions')
              }}
            >
              <div>
                <h3 className="text-lg font-semibold">
                  {
                    selectedLanguage.current == null 
                    ? item.membership_type.type_title
                    : (
                        item.membership_type.translation.translation
                        ?
                          (
                              item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                            ? item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_title 
                            : item.membership_type.type_title
                          )
                        : item.membership_type.type_title
                      )
                  }
                </h3>
                <p className="text-sm text-gray-500">
                  {
                    selectedLanguage.current == null 
                    ? item.membership_type.type_description
                    : (
                        item.membership_type.translation.translation
                        ?
                          (
                              item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                            ? item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_description 
                            : item.membership_type.type_description
                          )
                        : item.membership_type.type_description
                      )
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="space-x-2 text-lg font-semibold">
                  <span>${item.subscription_price} </span>
                  <span>/</span>
                  <span className="text-sm font-normal">
                    {
                      selectedLanguage.current == null 
                      ? item.subscription_range.subscription_range_name
                      : (
                          item.subscription_range.params 
                          ?
                            (
                              item.subscription_range.params.translation
                              ?
                                (
                                    item.subscription_range.params.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                  ? item.subscription_range.params.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).subscription_range_name 
                                  : item.subscription_range.subscription_range_name
                                )
                              : item.subscription_range.subscription_range_name
                            )
                          : item.subscription_range.subscription_range_name
                        )
                    }
                  </span>
                </p>
                <p className="text-xs text-gray-400">Billed after {item.subscription_range.subscription_range_days_count} days</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const ModalForUpgradeSubscription = () =>{
    return(
      <div>
        <dialog ref={modalRef} id="my_modal_2" className="modal">
          <div className="modal-box">
            <div className="flex-1">
              <img
                src="https://www.xeni.com/wp-content/uploads/2024/11/Search-Result-5-1.png" // Replace with actual image path
                alt="Travel App Preview"
                className="w-full shadow-lg rounded-2xl"
              />
            </div>
            <div className="flex-1 mt-5 space-y-1 md:space-y-8">
              <h2 className="text-2xl font-extrabold leading-tight text-center text-black capitalize md:text-3xl">
                available only for paid and active memberships.
              </h2>

              <div className="flex flex-col items-center space-y-3 ">
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-full">
                      <img
                      className="w-[60px] md:w-[100px]"
                      alt="Tailwind CSS chat bubble component"
                      src={Logo2} />
                  </div>
                  {/* Text Content */}
                  <div className="flex-1 text-center">
                      <p className="text-sm font-semibold earn_more_points_id">Earn more points</p>
                      <p className="text-xs text-gray-600 members_could_save_id">
                          Paid Memberships could save time and money finding great deals.
                      </p>
                  </div>
              </div>
              {
                getLoading
                ?
                  <div className=''>
                    <div className="flex flex-col justify-center w-full gap-4 py-10">
                      <div className="w-full h-32 skeleton"></div>
                      <div className="h-4 skeleton w-28"></div>
                      <div className="w-full h-4 skeleton"></div>
                    </div>
                  </div>
                :
                <_PlanSelect dataList={subscriptionList}/>
              }
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    )
  }
  
  const NoCodePromo = () =>{
    return (
      <div className="flex flex-col items-center gap-8 p-6 mx-auto text-white bg-white border shadow-lg md:p-10 rounded-2xl md:flex-row">
        {/* Left: App Preview (Image) */}
        <div className="flex-1">
          <img
            src="https://www.xeni.com/wp-content/uploads/2024/11/Search-Result-5-1.png" // Replace with actual image path
            alt="Travel App Preview"
            className="w-full shadow-lg rounded-2xl"
          />
        </div>
    
        {/* Right: Text Content */}
        <div className="flex-1 space-y-1 md:space-y-8">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-black bg-yellow-400 rounded-full w-fit">
            NEW
          </span>
          <ol className='space-y-2'>
            <li className='text-2xl leading-tight text-black capitalize md:text-3xl'>
              <span className='mr-3 font-bold'>1.</span> 
              Enjoy huge savings and wholesale
              discounts on hotels worldwide
            </li>
             <li className='text-2xl leading-tight text-black capitalize md:text-3xl'>
              <span className='mr-3 font-bold'>2.</span> 
              Preferred customers earn 0.5%
              cashback
            </li>
             <li className='text-2xl leading-tight text-black capitalize md:text-3xl'>
              <span className='mr-3 font-bold'>3.</span> 
              VIP members earn 1% cashback
            </li>
          </ol>
  
          <div className="flex gap-4 pt-4">
            {
              getLoading
              ?
                <span className="text-black loading loading-spinner loading-sm"></span>
              :
                getPlatformLoading.launchButton 
                ? <span className="text-black loading loading-spinner loading-sm"></span>
                :
                <button 
                  disabled={getPlatformLoading.launchButton}
                  onClick={() => requestToken()}
                  className="px-6 py-2 font-bold text-white bg-orange-500 btn hover:bg-orange-600 rounded-xl">
                  <div>LAUNCH NOW</div>
                </button>
            }
          </div>
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
                <h2 className="text-2xl font-extrabold leading-tight text-center text-black capitalize md:text-3xl">
                available only for VIP members.
                </h2>

                <div className="flex flex-col items-center space-y-3 ">
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-full">
                    <img
                    className="w-[60px] md:w-[100px]"
                    alt="Tailwind CSS chat bubble component"
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
                    <button onClick={() => navigate('/subscriptions')} className="px-6 py-3 text-white transition-colors bg-[#031956] rounded-lg whitespace-nowrap">
                    Upgrade Membership
                    </button>
                  </div>
                </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
              <button>close</button>
          </form>
        </dialog>
      </div>
    )
  }
  
  return (
    <div className=''>
      <div className='flex justify-center my-5'>
        <div className='md:w-[75%] w-[95%]'>
          <p className='font-extrabold text-[#001d3d] text-[25px] text-center capitalize'>Travel the world with Club TEN</p>
        </div>
      </div>
      <div className='flex justify-center mb-[50px]'>
        <div className='md:w-[75%] w-[95%]'>
          <NoCodePromo/>
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='md:w-[75%] w-[95%]'>
          <p className='font-extrabold text-[#001d3d] text-[25px] capitalize'>Upcoming Bucket List Experiences</p>
        </div>
      </div>
      <div className='flex justify-center my-5 mb-[150px]'>
        <div className='md:w-[75%] w-[95%] gap-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'>
          {
             ResultGetHomeContents.length > 0
             ?
              ResultGetHomeContents.map((item, index) =>(
                item.contents_table.length > 0
                ?
                  item.contents_table.map((item_content, index_content) =>(
                    <HomeCard 
                    categoryConfig={item.category_display_content.display.content_home_style}
                    contentDetails={item_content}
                    loading={loadingContent}
                    clickOffers={() => HandleOfferDetails(item_content)}
                    title={
                      selectedLanguage.current == null 
                      ? item_content.content_title
                      : (
                            item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                          ? item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_title
                          : item_content.content_title
                        )
                    }
                    clickSeeDetails={() => HandleSeeDetails(item_content)}
                    details={
                      selectedLanguage.current == null 
                      ? item_content.content_description
                      : (
                            item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                          ? item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_description
                          : item_content.content_description
                        )
                    }
                    image={
                        item_content.uploads_table_main_view.upload_type == "url"
                      ? item_content.uploads_table_main_view.upload_url 
                      : env.VITE_APP_BACKEND_STORAGE_URL + item_content.uploads_table_main_view.upload_url
                    } 
                    days={item_content.content_days_count}
                    nights={item_content.content_night_count}
                    location='--'
                    collapseDetails={ResultGetHomeContentsDetails.id == item_content.id ? collapseDetails : false} 
                    isLiked={false}
                    />
                  ))
                :
                  (
                    ResultGetHomeContents.length <= 0 &&
                    [1,2,3,4].map((item_content, index_content) =>(
                      <HomeCard loading={true}/>
                    ))
                  )
              ))
             :
              (
                  ResultGetHomeContents.length <= 0 &&
                  [1,2,3,4].map((item_content, index_content) =>(
                    <HomeCard loading={true}/>
                  ))
                )
          }
        </div>
      </div>
      
      {
        openBottomOffer &&(
          <OffersBottomSheet
          handleCheckout={() => handleCheckout(activeTab, ResultGetHomeContentsDetails)}
          handleClose={() => {
              setOpenBottomOffer(!openBottomOffer)
              resetOnClose()
            }
          }
          handleIncrease={() => handleIncreaseFunc()}
          handleDecrease={() => handleDecreaseFunc()}
          handleCustomTPoints={(text) => handleCustomPoints(text, activeTab)}

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

          count={count}

          customTPoints={TPointsCustom}
          customTBucks={TBucksCustom}
          customTDollars={TDollarsCustom}

          handleCustomTBucks={(text) => handleCustomBucks(text, activeTab)}

          handleCustomTravelDollars={(text) => handleCustomTravelDollars(text, activeTab)}

          tabData={activeTab}

          wallet={parseFloat(TPointsWallet).toFixed(2)}
          tBucksWallet={parseFloat(walletData.t_bucks).toFixed(2)}
          tDollarsWallet={parseFloat(walletData.t_dollars).toFixed(2)}

          finalAmount={parseFloat(totalPriceWithPoints).toFixed(2)}
          offersData={ResultGetHomeContentsDetails}
          >
            <div className="grid grid-cols-2 gap-5 my-5">
              {
                ResultGetHomeContentsDetails.content_offers_table.map((item, key) =>(

                  item.offers_table.membership_type_table &&
                  <button 
                  onClick={() => {

                    var is_paid_membership = item.offers_table.membership_type_table.translation.membership.is_paid_account
                    const account_membership_is_paid = AccountSubscriptionDetails.details.subscription_category.membership_type.translation.membership.is_paid_account

                    if(is_paid_membership && !account_membership_is_paid){
                      setTimeout(() => {
                        modalSubscriptionRef.current?.showModal();
                      }, 0)
                    }else{
                      HandleOfferTabSelection(item)
                    }
                  }} 
                  key={key} 
                  className={`${ activeTab && activeTab.offers_id == item.offers_id ? 'bg-yellow-400 text-black ' : ''} border h-auto rounded-lg shadow-sm p-5`}>
                    <p className={`${activeTab && activeTab.offers_id == item.offers_id ? 'font-extrabold' : 'font-normal'}  text-[18px] uppercase`}>
                      <div className='flex items-center justify-between'>
                        <span>
                          {
                            selectedLanguage.current == null 
                            ? item.offers_table.membership_type_table.type_title
                            : (
                                  item.offers_table.membership_type_table.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                ? item.offers_table.membership_type_table.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_title
                                : item.offers_table.membership_type_table.type_title
                              )
                          }
                        </span>
                        <div className='flex flex-col'>
                          <span className='font-semibold'>
                            {     
                              selectedLanguage.current == null 
                              ? item.offers_table.tier_category_table.tier_category_name
                              : (
                                    item.offers_table.tier_category_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                  ? item.offers_table.tier_category_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).tier_category_name
                                  : item.offers_table.tier_category_table.tier_category_name
                                )
                            }
                          </span>
                          <span className='text-[15px] font-normal capitalize'>
                            (
                              {
                                selectedLanguage.current == null 
                                ? item.offers_table.supplier_table.room_type.room_type_name
                                : (
                                      item.offers_table.supplier_table.room_type.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                    ? item.offers_table.supplier_table.room_type.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).room_type_name
                                    : item.offers_table.supplier_table.room_type.room_type_name
                                  )
                              }
                            )
                          </span>
                        </div>
                      </div>
                    </p>
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
          resetOnClose()
        }}
        />
      }
      
      <ModalForUpgradeSubscription/>
      <ModalForUpgradeSubscriptionWhenVIP/>
    </div>  
  ) 
}

export default MallTravel
