import React, { useState, useRef, useEffect  } from 'react';
import { useDispatch } from "react-redux";
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  BottomCreateAccountFloat,
  DestinationCard,
  OffersBottomSheet
} from '../../component/index'

import {
  Checkout
} from '../index'

import DOMPurify from "dompurify";

import EmptyImage  from  '../../assets/images/glorijan/empty.jpg'

import Logo1 from '../../assets/images/ten/logo.png'

import {
  Search,
  Calendar,
} from '../../assets/icons/index'

import * as api_content from '../../services/content/content.api'

const env = import.meta.env;

const DestinationContent = () =>{

  //#region implementations
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const auth_states = useSelector(state => state.AuthReducer);

  //#region useRefs
  const maxGuestCount = useRef(0)
  const walletRef = useRef(100)
  const paymentBContent = useRef({})
  const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)  // null means main translation is used
  //#endregion 

  //#region states
  const [showBottomRegistration, setShowBottomRegistration] = useState(false);
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
  const [TPointsCustom, setTPointsCustom] = useState(walletRef.current);
  const [UseTPointsWalletFullAmount, setUseTPointsWalletFullAmount] = useState(false);
  const [loadingContent, setLoadingContent] = useState(true);
  const [getcollapseSpecific, setcollapseSpecific] = useState(null);
  //#endregion

  //#region methods

  const handleCheckout = (selectedTab, AllContentData) =>{
    if(!auth_states.StateToken){
      setShowBottomRegistration(true)
      navigate('login');
    }else{

      const reqBody = {
        content_id: selectedTab.content_id,
        offers_id: selectedTab.offers_id,
        finalAmount: totalPriceWithPoints,
        content_title: AllContentData.content_title,
        content_days_count: AllContentData.content_days_count,
        content_night_count: AllContentData.content_night_count,
        membership_type: selectedTab.offers_table.membership_type_table.type_title,
        room_type_name: selectedTab.offers_table.supplier_table.room_type.room_type_name,
        tier_category_name: selectedTab.offers_table.tier_category_table.tier_category_name,
        content_date_from: AllContentData.content_date_from,
        content_date_to: AllContentData.content_date_to,

        points_applied: TPointsCustom,
        points_allowed: selectedTab.offers_table.offers_points_amount,
        points_wallet_before: walletRef.current,
        points_wallet_after: TPointsWallet
      }

      paymentBContent.current = reqBody

      setOpenBottomPayment(true)
    }
  }
  
  const handleTpoints = (item) => {
    setUseTPointsWalletFullAmount(!UseTPointsWalletFullAmount)

    const offers_amount = parseFloat(item.offers_table.offers_amount)
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
      setTotalPriceWithPoints(offers_amount)
      setTPointsWallet(walletRef.current)
      setTPointsCustom(0)
    }
  };

  const handleCustomPoints = (event, item) => {

    const offers_amount = parseFloat(item.offers_table.offers_amount)
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

    const offers_amount = parseFloat(item.offers_table.offers_amount)

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

    const offers_amount = parseFloat(item.offers_table.offers_amount)
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
  };

  const handleIncreaseFunc = () => {
    if (count < maxGuestCount.current) setCount(count + 1)
  };

  const HandleOfferTabSelection = (item) =>{
    setActiveTab(item)
  }

  const HandleOfferDetails = (item) =>{
    setOpenBottomOffer(true)
    ResultSetHomeContentsDetails(item)
    setActiveTab(item.content_offers_table[0])
    setTotalPriceWithPoints(item.content_offers_table[0].offers_table.offers_amount)
    setCount(item.content_guest_count)
    maxGuestCount.current = item.content_guest_count
  }

  const GetHomeContents = async() =>{
    setLoadingContent(true)
    await api_content.GetHomeContents().then((result) =>{
      if(result.status){
        setLoadingContent(false)
        ResultSetHomeContents(result.data.data)
      }
    }).catch((err) =>{
      console.log("GetHomeContents", err)
    })
  }
  //#endregion

  //#region useEffects  
  useEffect(() =>{
    GetHomeContents()
  },[])

  useEffect(() =>{
    if(auth_states.SelectedLanguage){
      selectedLanguage.current = parseInt(auth_states.SelectedLanguage.id)
      GetHomeContents()
    }
  },[auth_states])

  useEffect(() =>{
    if(!auth_states.StateToken){
      setShowBottomRegistration(true)
    }
  },[])

  //#region translation convertion
  
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
              })
            } else if (targetElement.length > 0) {
              Array.from(targetElement).forEach((el) => {
                el.textContent = item.page_config_title;
              })
            }
          }
        }
      })
    },[auth_states])
    //#endregion
  //#endregion

  return (
    <div className='w-full md:fixed'>
      <main className='md:max-h-[80vh] md:overflow-y-auto'>
        {/* contents */}
        <div className='md:w-[30%] md:fixed hidden md:block'>
          <div className="h-screen p-4 border-r w-80">
            <div className='my-5'>
              <img
              className="w-[40%]"
              alt="Tailwind CSS chat bubble component"
              src={Logo1} />
            </div>
            <div>
              <div  className="flex items-center mx-2 my-1">
                  <Search classes={'text-black mr-3'}/>
                  <input type="text" placeholder="Where to?"  className='w-full placeholder-black border-gray-400 input'/>
              </div>
            </div>
            <div className="mx-2 my-1">
              <div className='flex items-center justify-between lg:justify-start'>
                  <div className='flex items-start lg:justify-end '>
                      <Calendar classes={'text-black mr-3'}/>
                      <p className='mr-2 text-black from_id'>From</p>
                  </div>
                  <input type="date" className="p-2 w-[150px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="mx-2 my-1">
              <div className='flex items-center justify-between lg:justify-start'>
                <div className='flex items-start lg:justify-end'>
                  <Calendar classes={'text-black mr-3'}/>
                  <p className='mr-2 text-black to_id'>To</p>
                </div>
                <input type="date" className="p-2 w-[150px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="mx-2 my-3">
              <button className='rounded bg-[#2596be] w-full text-white py-3 px-5 font-bold search_id'>
              Search
              </button>
            </div>
          </div>
        </div>
        <div className='md:flex'>
          <div className='md:w-[30%]'>
            
          </div>
          <div className='md:w-[70%] '>
            <div>
              {
                ResultGetHomeContents.length > 0
                ?
                  ResultGetHomeContents.map((item, index) =>(

                    item.contents_table.length > 0
                    &&
                      item.contents_table.map((contents_table_item, contents_table_index) =>(
                        <DestinationCard 
                        contentDetails={contents_table_item}
                        key={contents_table_index}
                        clickOffers={() => {
                          setOpenBottomOffer(!openBottomOffer)
                          HandleOfferDetails(contents_table_item)
                          setBottomDetailsOpen(false)
                          setCollapseBottomDetails(false)
                        }}
                        title={
                          selectedLanguage.current == null 
                          ? contents_table_item.content_title
                          : (
                                contents_table_item.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                              ? contents_table_item.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_title
                              : contents_table_item.content_title
                            )
                        }
                        clickSeeDetails={() => setcollapseSpecific(contents_table_index)}
                        details={DOMPurify.sanitize(
                          selectedLanguage.current == null 
                          ? contents_table_item.content_description
                          : (
                                contents_table_item.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                              ? contents_table_item.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_description
                              : contents_table_item.content_description
                            )
                        )}
                        image={
                            contents_table_item.uploads_table_main_view.upload_is_link 
                          ? contents_table_item.uploads_table_main_view.upload_url
                          : env.VITE_APP_BACKEND_STORAGE_URL + contents_table_item.uploads_table_main_view.upload_url
                        } 
                        location='--'
                        collapseDetails={getcollapseSpecific == contents_table_index ? true : false}
                        loading={loadingContent}
                        isLiked={false}/>
                      ))
                  ))
                : 
                  (
                    ResultGetHomeContents.length <= 0 &&
                    [1, 2, 3].map((item, index) =>(
                      <DestinationCard key={index} loading={true}/>
                    ))
                  )
              }
            </div>
          </div>
        </div>
        
        {/* end contents */}

        {
          showBottomRegistration
          &&
          <div className='flex justify-center'>
            <BottomCreateAccountFloat noThanks={() => setShowBottomRegistration(false)}/>
          </div>
        }
      </main>

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
        openBottomPayment && <Checkout dataContent={paymentBContent.current} handleClose={() => setOpenBottomPayment(false)}/>
      }
    </div>
  )
}

export default DestinationContent