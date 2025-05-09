import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useDispatch } from "react-redux";
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import {
    HomeCard,
    BottomCreateAccountFloat,
    CategoryTitleAndArrow,
    DestinationCard,
    OffersBottomSheet,
    Header,
    Footer,
    LanguageBottomSheet
} from '../../component/index'

import {
  Checkout
} from '../index'

import { useMediaQuery } from 'react-responsive'

import { IoIosCloseCircleOutline } from "react-icons/io";

import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { FaUsers, FaShoppingBag, FaUser } from "react-icons/fa";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuTickets } from "react-icons/lu";
import { AiFillNotification } from "react-icons/ai";

import * as api_content from '../../services/content/content.api'

const env = import.meta.env;

const DetailsPage = () =>{

  //#region implementations
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const auth_states = useSelector(state => state.AuthReducer);

    const [open, setOpen] = useState(false)
    const [getOpenLanguageSelection, setOpenLanguageSelection] = useState(false)
    const [getSelectedLanguage, setSelectedLanguage] = useState("")
  

  //#region useRefs
  const maxGuestCount = useRef(0)
  const walletRef = useRef(100)
  const paymentBContent = useRef({})
  const initialFinalPrice = useRef(0)
  const countRef = useRef(0)
  const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)  // null means main translation is used
  //#endregion 

  //#region states
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
 //#endregion

  //#region methods
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 400px)'
  })
  
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
            selectedTab.offers_table.membership_type_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
          ? selectedTab.offers_table.membership_type_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_title
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
    setCount(item.content_guest_count)
    maxGuestCount.current = item.content_guest_count
  }

  const ShowContent = async() =>{
    setLoadingContent(true)

    const id = searchParams.get('view')
    await api_content.ShowContent(id).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        ResultSetHomeContents(result.data.data)
        console.log(result)
      }
    }).catch((err) =>{
      console.log("ShowContent", err)
    })
  }

  const limitText = (text, limit = 30) =>{
    if(text){
        return text.length > limit ? text.slice(0, limit) : text;
    }
  }
  //#endregion

  //#region useEffects
  useEffect(() =>{
    ShowContent()
  },[])

  useEffect(() =>{
    if(auth_states.SelectedLanguage){
      selectedLanguage.current = parseInt(auth_states.SelectedLanguage.id)
      ShowContent()
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

  //#endregion

  const TabItem = ({ icon, label, active, path }) =>{

    return (
      <Link to={path}>
        <div className={`flex flex-col items-center ${active ? "text-white" : "text-gray-400"} `}>
          <div className="mb-1 text-lg">{icon}</div>
          <span className="text-[14px]">{label}</span>
        </div>
      </Link>
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
        <TabItem icon={<AiFillNotification size={20}/>} path={'/'} label="News" active />
        <TabItem icon={<LuTickets size={20}/>} path={'/event'} label="Events" />
        <TabItem icon={<FaShoppingBag size={20}/>} path={'/mall'} label="Mall" />
        <TabItem icon={<HiMiniBuildingOffice2 size={20}/>} path={'/account'} label="Office" />
        <TabItem icon={<FaRegCircleUser size={20}/>} path={'/details'} label="Profile" />
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

    const EmbededVideoUrl = ({ videoId, title, details, clickSeeDetails, contentDetails }) => {
    return (
      <div  className=' w-[100%] h-[100%] '>
        <div className='flex justify-center'>
          <iframe
          className='rounded-lg'
            src={`https://www.youtube.com/embed/${videoId}`}
            // src={videoId}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube Video"
            style={{
              width: '100%',
              height: '200px',
            }}
          />
        </div>
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
          <div className='mb-[150px]'>
              <div className='flex justify-center my-5'>
                  <div className='md:w-[75%] w-[95%]'>
                      <p className='font-bold text-[#001d3d] text-[35px] capitalize'>{ResultGetHomeContents.content_title}</p>
                      <img
                      src={
                          ResultGetHomeContents.uploads_table_main_view.upload_is_link 
                          ? ResultGetHomeContents.uploads_table_main_view.upload_url 
                          : env.VITE_APP_BACKEND_STORAGE_URL + ResultGetHomeContents.uploads_table_main_view.upload_url
                      }
                      alt=""  
                      className="object-contain w-full "
                      />
                      <div className='my-5 text-left'>
                          <p className='text-[#001d3d] capitalize'> 
                              <span className='font-bold'>from </span> 
                              <span>{ResultGetHomeContents.content_date_from}</span>
                          </p>
                          <p className='text-[#001d3d] capitalize'>
                              <span className='font-bold'>to </span> 
                              <span>{ResultGetHomeContents.content_date_to}</span>
                          </p>
                      </div>

                      <p className='text-[#001d3d] capitalize space-x-3 text-left my-5'>
                          <span className='font-bold'>Duration </span> 
                          <span>{ResultGetHomeContents.content_days_count} days</span>
                          <span>{ResultGetHomeContents.content_night_count} nights</span>
                      </p>

                    <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(ResultGetHomeContents.content_description)}} /> 
                  </div>
              </div>
          </div>
        }
        {
          showBottomRegistration &&
          <div className='flex justify-center'>
            <BottomCreateAccountFloat onPressAction={ () => navigate("/login")} noThanks={() => setShowBottomRegistration(false)}/>
          </div>
        }
        
        {
          getBottomDetailsOpen &&(
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40">
              <div className="w-full md:w-[50%] md:p-4 p-2 transition-transform bg-white shadow-lg rounded-t-2xl max-h-[90%] overflow-y-auto">
                <div className='flex justify-end'>
                    <button onClick={() => setBottomDetailsOpen(false)} className='flex items-center justify-center p-1 mr-2'>
                      <IoIosCloseCircleOutline  className="text-[23px] text-[#ff4949]" />
                    </button>
                </div>
                <div className='flex justify-center'>
                  <DestinationCard 
                  contentDetails={ResultGetHomeContentsDetails}
                  clickOffers={() => {
                    setOpenBottomOffer(!openBottomOffer)
                    HandleOfferDetails(ResultGetHomeContentsDetails)
                    setBottomDetailsOpen(false)
                    setCollapseBottomDetails(false)
                  }}
                  title={
                    selectedLanguage.current == null 
                    ? ResultGetHomeContentsDetails.content_title
                    : (
                          ResultGetHomeContentsDetails.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                        ? ResultGetHomeContentsDetails.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_title
                        : ResultGetHomeContentsDetails.content_title
                      )
                  }
                  clickSeeDetails={() => setCollapseBottomDetails(!collapseBottomDetails)}
                  details={
                    DOMPurify.sanitize(
                      selectedLanguage.current == null 
                      ? ResultGetHomeContentsDetails.content_description
                      : (
                            ResultGetHomeContentsDetails.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                          ? ResultGetHomeContentsDetails.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_description
                          : ResultGetHomeContentsDetails.content_description
                        )
                    )
                  }
                  image={
                      ResultGetHomeContentsDetails.uploads_table_main_view.upload_is_link 
                    ? ResultGetHomeContentsDetails.uploads_table_main_view.upload_url
                    : env.VITE_APP_BACKEND_STORAGE_URL + ResultGetHomeContentsDetails.uploads_table_main_view.upload_url
                  } 
                  location='--'
                  collapseDetails={collapseBottomDetails}
                  loading={loadingContent}
                  isLiked={false}/>
                </div>
              </div>
            </div>
          )
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
              <div className="flex justify-center mb-4 space-x-5">
                {
                  ResultGetHomeContentsDetails.content_offers_table.map((item, key) =>(
                    <button onClick={() => HandleOfferTabSelection(item)} key={key} className=''>
                      <p className={`${activeTab.offers_id == item.offers_id ? 'font-extrabold' : 'font-normal'}  text-[25px] uppercase`}>
                        {
                          selectedLanguage.current == null 
                          ? item.offers_table.membership_type_table.type_title
                          : (
                                item.offers_table.membership_type_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                              ? item.offers_table.membership_type_table.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_title
                              : item.offers_table.membership_type_table.type_title
                            )
                        }
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
      </main>
      <BottomTabNavigator/>
    </div>
  )
}

export default DetailsPage