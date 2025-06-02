import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { useMediaQuery } from 'react-responsive'
import DOMPurify from 'dompurify';

import { FaArrowUpRightFromSquare } from "react-icons/fa6";

import {
  HomeCard,
  BottomCreateAccountFloat,
  CategoryTitleAndArrow,
  DestinationCard,
  OffersBottomSheet,
} from '../../component/index'

import {
  Checkout
} from '../index'

import * as api_content from '../../services/content/content.api'
import * as auth_service_api from '../../services/auth/auth.api'
import * as api_account from '../../services/account/account.api.js'

import Logo2 from '../../assets/images/ten/logo2.png'

const env = import.meta.env;

const MallTravel = () =>{

  const navigate = useNavigate();

  const auth_states = useSelector(state => state.AuthReducer);

  //#region useRefs
  const maxGuestCount = useRef(0)
  const walletRef = useRef(100)
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
  const [activeTab, setActiveTab] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPriceWithPoints, setTotalPriceWithPoints] = useState(0);
  const [TPointsWallet, setTPointsWallet] = useState(walletRef.current);
  const [TPointsCustom, setTPointsCustom] = useState(0);
  const [UseTPointsWalletFullAmount, setUseTPointsWalletFullAmount] = useState(false);
  const [loadingContent, setLoadingContent] = useState(true);
  const [getclientSecret, setclientSecret] = useState(null)
  const [getLoading, setLoading] = useState(false)

  const [getPlatformLoading, setPlatformLoading] = useState({
    launchButton: false
  })

  const [getPlatformAccess, setPlatformAccess] = useState([])

  const [subscriptionList, SetSubscriptionList] = useState([])
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleCheckout = async (selectedTab, AllContentData) =>{
    if(!auth_states.StateToken){
      setShowBottomRegistration(true)
      navigate('login');
    }else{

      console.log('selectedTab', selectedTab)
      console.log('AllContentData', AllContentData)

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
        content_id: selectedTab.content_id,
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

        points_applied: TPointsCustom,
        points_allowed: selectedTab.offers_table.offers_points_amount,
        points_wallet_before: walletRef.current,
        points_wallet_after: TPointsWallet
      }

      paymentBContent.current = reqBody
      setOpenBottomPayment(true)
      
      setLoading(true)
      await api_content.GetClientSecret(auth_states.StateToken, paymentBContent.current).then((result) =>{
        if(result.status){
          setclientSecret(result.data.clientSecret)
          setLoading(false)
        }
      }).catch((err) =>{
          console.log("fetchClientSecret", err)
      })
    }
  }

  const handleTpoints = (item) => {
    setUseTPointsWalletFullAmount(!UseTPointsWalletFullAmount)

    const offers_amount = parseFloat(item.offers_table.offers_amount) * count
    const offers_points_amount = parseFloat(item.offers_table.offers_points_amount)

    if(!UseTPointsWalletFullAmount){
      if(walletRef.current > offers_points_amount){
        const lessToWallet = walletRef.current - offers_points_amount
        setTPointsWallet(lessToWallet)
        setTotalPriceWithPoints(offers_amount - offers_points_amount)
        setTPointsCustom(offers_points_amount)
      }else if(walletRef.current < offers_points_amount){
        const lessToWallet = walletRef.current - walletRef.current
        setTPointsWallet(lessToWallet)
        setTotalPriceWithPoints(offers_amount - walletRef.current)
        setTPointsCustom(walletRef.current)
      }
    }else{
      setTotalPriceWithPoints(offers_amount )
      setTPointsWallet(walletRef.current)
      setTPointsCustom(0)
    }
  };

  const handleCustomPoints = (event, item) => {

    const offers_amount = parseFloat(item.offers_table.offers_amount)  * count
    const offers_points_amount = parseFloat(item.offers_table.offers_points_amount)

    const { name, type, checked, value } = event.target;

    const validatedNaNInput = (Number.isNaN(value) ? parseInt(0) : parseInt(value))

    if(!UseTPointsWalletFullAmount){
      if(validatedNaNInput > walletRef.current ){
        setTPointsCustom(walletRef.current)
        const lessToWallet = walletRef.current - walletRef.current
        setTPointsWallet(lessToWallet)
        setTotalPriceWithPoints(offers_amount - walletRef.current)
      }else if(validatedNaNInput < walletRef.current ){
        if(validatedNaNInput > offers_points_amount){
          setTPointsCustom(offers_points_amount)

          const lessToWallet = walletRef.current - (parseInt(offers_points_amount))
          setTPointsWallet(lessToWallet)
          setTotalPriceWithPoints(offers_amount - offers_points_amount)

        }else{
          const lessToWallet = walletRef.current - (parseInt(validatedNaNInput < 0 ? 0 : validatedNaNInput))
          setTPointsWallet(lessToWallet)
          setTPointsCustom(validatedNaNInput < 0 ? 0 : validatedNaNInput)
          setTotalPriceWithPoints(offers_amount - validatedNaNInput)
        }
      }else if(Number.isNaN(validatedNaNInput)){
        const lessToWallet = walletRef.current - 0
        setTPointsWallet(lessToWallet)
        setTPointsCustom(value)
        setTotalPriceWithPoints(offers_amount - 0)
      }
    }
  };

  const handleDecreaseCustomPoints = (item) => {

    const offers_amount = parseFloat(item.offers_table.offers_amount)  * count

    if(!UseTPointsWalletFullAmount){
      setTPointsCustom(prev => {
        if(parseInt(prev) <= 0){
          return 0
        }else{
          const lessToWallet =(walletRef.current - (parseInt(prev) - 1))
          setTPointsWallet(lessToWallet)
          setTotalPriceWithPoints(offers_amount - (parseInt(prev) - 1))
          return (parseInt(prev) - 1)
        }
      })
    }
  };

  const handleIncreaseCustomPoints = (item) => {

    const offers_amount = parseFloat(item.offers_table.offers_amount) * count
    const offers_points_amount = parseFloat(item.offers_table.offers_points_amount)
    
    if(!UseTPointsWalletFullAmount){
      setTPointsCustom(prev => {
        if(parseInt(prev + 1) >= walletRef.current){

          if(offers_points_amount > walletRef.current){
            const lessToWallet = (walletRef.current - walletRef.current)
            setTPointsWallet(lessToWallet)
            setTotalPriceWithPoints(offers_amount - walletRef.current)

            return walletRef.current
          }else{
            const lessToWallet = (walletRef.current - offers_points_amount)
            setTPointsWallet(lessToWallet)
            setTotalPriceWithPoints(offers_amount - offers_points_amount)

            return offers_points_amount
          }

        }else{
          if(parseInt(prev + 1) > offers_points_amount){
            const lessToWallet = (walletRef.current - offers_points_amount)
            setTPointsWallet(lessToWallet)
            setTotalPriceWithPoints(offers_amount - offers_points_amount)
            return offers_points_amount
          }else if(parseInt(prev) < offers_points_amount){
            const lessToWallet = (walletRef.current - parseInt(prev + 1))
            setTPointsWallet(lessToWallet)
            setTotalPriceWithPoints(offers_amount - parseInt(prev + 1))
            return parseInt(prev + 1)
          }
        }
      })
    }
  };
  
  const handleDecreaseFunc = () => {
    if (count > 0) setCount(count - 1);

    setTotalPriceWithPoints((initialFinalPrice.current * (count - 1)) - TPointsCustom)
  }

  const handleIncreaseFunc = () => {
    if (count < maxGuestCount.current) setCount(count + 1)
    
    setTotalPriceWithPoints((initialFinalPrice.current * (count + 1)) - TPointsCustom)
  }

  const HandleOfferTabSelection = (item) =>{
    setActiveTab(item)
    setCount(item.offers_table.supplier_table.room_type.room_type_guest_count)
    maxGuestCount.current = item.offers_table.supplier_table.room_type.room_type_guest_count
  }

  const HandleSeeDetails = (item) =>{
    isDesktopOrLaptop ? setBottomDetailsOpen(true) : setCollapseDetails(!collapseDetails)
    ResultSetHomeContentsDetails(item)
  }

  const HandleOfferDetails = (item) =>{

    setOpenBottomOffer(true)
    ResultSetHomeContentsDetails(item)
    setActiveTab(item.content_offers_table[0])
    setTotalPriceWithPoints(parseFloat(item.content_offers_table[0].offers_table.offers_amount) * item.content_guest_count)
    initialFinalPrice.current = item.content_offers_table[0].offers_table.offers_amount
    // setCount(item.content_guest_count)
    setCount(item.content_offers_table[0].offers_table.supplier_table.room_type.room_type_guest_count)
    // maxGuestCount.current = item.content_guest_count
    maxGuestCount.current = item.content_offers_table[0].offers_table.supplier_table.room_type.room_type_guest_count
  }

  const GetTravelBucketListContent = async() =>{
    setLoadingContent(true)
    await api_content.GetTravelBucketListContent().then((result) =>{
      if(result.status){
        setLoadingContent(false)
        ResultSetHomeContents(result.data.data)
      }
    }).catch((err) =>{
      console.log("GetTravelBucketListContent", err)
    })
  }

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

  const requestToken = async (event) =>{

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
      }else{
        window.open(result.data.redirectUrl, '_blank');
      }

    }).catch((err) =>{
      setPlatformLoading(prev => ({
        ...prev,
        launchButton: false
      }));
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
              onClick={() => setSelectedPlan(item.id)}
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
          <span className="inline-block px-3 py-1 text-xs font-semibold text-black bg-white rounded-full w-fit">
            NEW
          </span>
  
          <h2 className="text-2xl font-semibold leading-tight text-black capitalize md:text-3xl">
            Launch Club Ten travel platform.
          </h2>
  
          <div className="flex gap-4 pt-4">
            {/* <a 
              target="_blank"
              rel="noopener noreferrer"
              href='https://clubten.booking.xeni.com/' className="px-6 py-2 font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl">
              LAUNCH
            </a> */}
            {
              getLoading
              ?
                <></>
              :
                <button 
                  disabled={getPlatformLoading.launchButton}
                  onClick={() => requestToken()}
                  className="px-6 py-2 font-bold text-white bg-orange-500 btn hover:bg-orange-600 rounded-xl">
                  <div>
                    {
                      getPlatformLoading.launchButton
                      ? <span className="loading loading-spinner loading-sm"></span>
                      : "LAUNCH ACCOUNT"
                    }
                  </div>
                </button>
            }
            <a 
              target="_blank"
              rel="noopener noreferrer"
              href='https://clubten.booking.xeni.com/' className="flex items-center gap-1 font-medium text-orange-500 hover:underline">
              <div className='flex items-center space-x-3'>
                <p>Explore</p>
                <FaArrowUpRightFromSquare />
              </div>
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className=''>
      <div className='flex justify-center mb-[50px]'>
        <div className='md:w-[75%] w-[95%]'>
          <NoCodePromo/>
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='md:w-[75%] w-[95%]'>
          <p className='font-extrabold text-[#001d3d] text-[25px] capitalize'>club ten bucket list</p>
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
        showBottomRegistration &&
        <div className='flex justify-center'>
          <BottomCreateAccountFloat onPressAction={ () => navigate("/login")} noThanks={() => setShowBottomRegistration(false)}/>
        </div>
      }

      {
        openBottomOffer &&(
          <OffersBottomSheet
          handleCheckout={() => handleCheckout(activeTab, ResultGetHomeContentsDetails)}
          handleClose={() => setOpenBottomOffer(!openBottomOffer)}
          handleIncrease={() => handleIncreaseFunc()}
          handleDecrease={() => handleDecreaseFunc()}
          handleCustomTPoints={(text) => handleCustomPoints(text, activeTab)}
          handleRedeemFullTPoints={() => handleTpoints(activeTab)}
          handleDecreaseCustomPoints={() => handleDecreaseCustomPoints(activeTab)}
          handleIncreaseCustomPoints={() => handleIncreaseCustomPoints(activeTab)}
          isRedeemFull={UseTPointsWalletFullAmount}
          count={count}
          customTPoints={TPointsCustom}
          tabData={activeTab}
          wallet={TPointsWallet}
          finalAmount={totalPriceWithPoints}
          offersData={ResultGetHomeContentsDetails}
          >
            <div className="grid grid-cols-2 gap-5 my-5">
              {
                ResultGetHomeContentsDetails.content_offers_table.map((item, key) =>(
                  <button onClick={() => HandleOfferTabSelection(item)} key={key} className={`${activeTab.offers_id == item.offers_id ? 'bg-blue-400 text-white border-blue-800' : ''} border p-2  rounded-lg shadow-sm`}>
                    <p className={`${activeTab.offers_id == item.offers_id ? 'font-extrabold' : 'font-normal'}  text-[25px] uppercase flex flex-col items-center`}>
                      <span className='mr-1'>
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
                      <span className='text-[18px] font-normal'>
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
                    </p>
                  </button>
                ))
              }
            </div>
          </OffersBottomSheet>
        )
      }

      {
        openBottomPayment && <Checkout clientSecret={getclientSecret} getLoading={getLoading} dataContent={paymentBContent.current} handleClose={() => setOpenBottomPayment(false)}/>
      }

      <ModalForUpgradeSubscription/>
    </div>  
  ) 
}

export default MallTravel
