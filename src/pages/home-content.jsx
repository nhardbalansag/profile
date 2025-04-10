import React, { useState, useRef, useEffect } from 'react';

import { useDispatch } from "react-redux";
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  HomeCard,
  BottomCreateAccountFloat,
  MechantCard,
  CategoryTitleAndArrow,
  HomeCardCommunity,
  SearchFilterBar,
  HomeCardNews,
  HomeLearningCard,
  HomeCardEvent,
  DestinationCard,
  OffersBottomSheet
} from '../component/index'

import {
  Checkout
} from './index'

import { useMediaQuery } from 'react-responsive'
import MediaQuery from 'react-responsive'

import { IoIosCloseCircleOutline } from "react-icons/io";

import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import DOMPurify from "dompurify";

import EmptyImage  from  '../assets/images/glorijan/empty.jpg'

import Logo1 from '../assets/images/ten/logo.png'
import TenBG2 from '../assets/images/ten/tenBg2.png'
import ForTestDisplay from '../assets/images/ten/forTestDisplay.jpg'
import ForTestDisplay2 from '../assets/images/ten/forTestDisplay2.jpg'
import ForTestDisplay3 from '../assets/images/ten/forTestDisplay3.jpg'

import * as api_content from '../services/content/content.api'

const env = import.meta.env;

const HomeContent = () =>{

  //#region implementations
  const navigate = useNavigate();
  const auth_states = useSelector(state => state.AuthReducer);

  //#region useRefs
  const maxGuestCount = useRef(0)
  const walletRef = useRef(100)
  const paymentBContent = useRef({})
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
 //#endregion

  //#region methods
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 601px)'
  })
  
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

  const HandleSeeDetails = (item) =>{
    isDesktopOrLaptop ? setBottomDetailsOpen(true) : setCollapseDetails(!collapseDetails)
    ResultSetHomeContentsDetails(item)
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
        console.log("GetHomeContents", result)
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
    if(!auth_states.StateToken){
      setShowBottomRegistration(true)
    }
  },[])
  //#endregion

  //#endregion

  return (
    <div>
      <main >
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(${TenBG2})`,
            opacity: 0.3,  // Only affects the background
            zIndex: -1
          }}
        ></div>
        <div className="flex flex-col items-center mx-auto text-center">
            <h1 className="text-[30px] font-extrabold text-[#063970] uppercase relative ">WELCOME TO CLUB </h1>
            <img
            className="w-[40%]"
            alt="Tailwind CSS chat bubble component"
            src={Logo1} />
        </div>

        {/* contents */}
        <div className='flex justify-center my-5'>
          <div className='md:w-[75%] w-[100%]'>

            <div className='block sm:hidden'>
              <SearchFilterBar/>
            </div>

            <CategoryTitleAndArrow title={"Happenings"}/>
            <Swiper
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              effect={'coverflow'}
              grabCursor={true}
              pagination={{
                dynamicBullets: true,
                clickable: true,
              }}
              centeredSlides={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              // onAutoplayTimeLeft={onAutoplayTimeLeft}
              // navigation={true}
              modules={[Autoplay,EffectCoverflow, Pagination, Navigation]}
              spaceBetween={5}
              slidesPerView={2}
              // onSlideChange={() => console.log('slide change')}
              // onSwiper={(swiper) => console.log(swiper)}
              breakpoints={{
                300: { slidesPerView: 2, spaceBetween: 5 }, // 2 slides on tablets
                400: { slidesPerView: 1, spaceBetween: 5 }, // 2 slides on tablets
                500: { slidesPerView: 1, spaceBetween: 0 }, // 2 slides on tablets
                600: { slidesPerView: 2, spaceBetween: 60 }, // 2 slides on tablets
                700: { slidesPerView: 2, spaceBetween: 50 }, // 2 slides on tablets
                800: { slidesPerView: 2, spaceBetween: 10 }, // 2 slides on tablets
                1024: { slidesPerView: 3,  spaceBetween: 10} // 3 slides on desktops
                // 1024: { slidesPerView: 3, spaceBetween: 200 } // 3 slides on desktops
              }}
            >
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCardNews image={ForTestDisplay3} isLiked caption={'Planning a trip soon? join me'}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCardNews image={ForTestDisplay} caption={'join my community discussions'}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCardNews image={ForTestDisplay2} caption={"who's in?"}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCardNews image={EmptyImage} />
              </SwiperSlide>
            </Swiper>
            
            <div className='hidden sm:block'>
              <SearchFilterBar/>
            </div>
            {/* <ReactQuill theme="snow" value={text} onChange={setText} /> */}
            <CategoryTitleAndArrow title={"Destinations"} path={'destination'}/>
            <Swiper
              pagination={{
                dynamicBullets: true,
              }}
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={5}
              slidesPerView={1}
              onSlideChange={() => setCollapseDetails(false)}
              // onSwiper={(swiper) => console.log(swiper)}
              breakpoints={{
                300: { slidesPerView: 1, spaceBetween: 5 }, // 2 slides on tablets
                400: { slidesPerView: 1, spaceBetween: 5 }, // 2 slides on tablets
                500: { slidesPerView: 1, spaceBetween: 0 }, // 2 slides on tablets
                600: { slidesPerView: 2, spaceBetween: 60 }, // 2 slides on tablets
                700: { slidesPerView: 2, spaceBetween: 50 }, // 2 slides on tablets
                800: { slidesPerView: 2, spaceBetween: 10 }, // 2 slides on tablets
                1024: { slidesPerView: 2,  spaceBetween: 10}, // 3 slides on desktops
                1353: { slidesPerView: 3,  spaceBetween: 10} // 3 slides on desktops
                // 1024: { slidesPerView: 3, spaceBetween: 200 } // 3 slides on desktops
              }}
            >
              {
                ResultGetHomeContents.length > 0
                ?
                  ResultGetHomeContents.map((item, index) =>(
                    <SwiperSlide key={index} className='flex justify-center mb-10'>
                      <HomeCard 
                      loading={loadingContent}
                      clickOffers={() => HandleOfferDetails(item)}
                      title={item.content_title}
                      clickSeeDetails={() => HandleSeeDetails(item)}
                      details={DOMPurify.sanitize(item.content_description)}
                      image={env.VITE_APP_BACKEND_STORAGE_URL + item.uploads_table_main_view.upload_url} 
                      days={item.content_days_count}
                      nights={item.content_night_count}
                      location='--'
                      collapseDetails={collapseDetails}
                      isLiked={false}/>
                    </SwiperSlide>
                  ))
                : 
                  (
                    ResultGetHomeContents.length <= 0 &&
                    [1, 2, 3].map((item, index) =>(
                      <SwiperSlide key={index} className='flex justify-center mb-10'>
                        <HomeCard loading={true}/>
                      </SwiperSlide>
                    ))
                  )
              }
            </Swiper>

            <CategoryTitleAndArrow title={"Community"}/>
            <Swiper
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{
                dynamicBullets: true,
                clickable: true,
              }}
              centeredSlides={true}
              effect={'coverflow'}
              grabCursor={true}
              modules={[Navigation, EffectCoverflow, Pagination, Scrollbar, A11y]}
              spaceBetween={5}
              slidesPerView={1}
              // onSlideChange={() => console.log('slide change')}
              // onSwiper={(swiper) => console.log(swiper)}
              breakpoints={{
                300: { slidesPerView: 1, spaceBetween: 5 }, // 2 slides on tablets
                400: { slidesPerView: 1, spaceBetween: 5 }, // 2 slides on tablets
                500: { slidesPerView: 1, spaceBetween: 0 }, // 2 slides on tablets
                600: { slidesPerView: 2, spaceBetween: 60 }, // 2 slides on tablets
                700: { slidesPerView: 2, spaceBetween: 50 }, // 2 slides on tablets
                800: { slidesPerView: 2, spaceBetween: 10 }, // 2 slides on tablets
                1024: { slidesPerView: 3,  spaceBetween: 10} // 3 slides on desktops
                // 1024: { slidesPerView: 3, spaceBetween: 200 } // 3 slides on desktops
              }}
            >
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCardCommunity image={ForTestDisplay3} isLiked caption={'Planning a trip soon? join me'}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCardCommunity image={ForTestDisplay} caption={'join my community discussions'}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCardCommunity image={ForTestDisplay2} caption={"who's in?"}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCardCommunity image={EmptyImage} />
              </SwiperSlide>
            </Swiper>
            
            <CategoryTitleAndArrow title={"Event Deals"}/>
              <Swiper
              pagination={{
                dynamicBullets: true,
              }}
               modules={[Navigation, Pagination, Scrollbar, A11y]}
               spaceBetween={5}
               slidesPerView={1}
              //  onSlideChange={() => console.log('slide change')}
              //  onSwiper={(swiper) => console.log(swiper)}
               breakpoints={{
                300: { slidesPerView: 1, spaceBetween: 5 }, // 2 slides on tablets
                400: { slidesPerView: 1, spaceBetween: 5 }, // 2 slides on tablets
                500: { slidesPerView: 1, spaceBetween: 0 }, // 2 slides on tablets
                600: { slidesPerView: 2, spaceBetween: 60 }, // 2 slides on tablets
                700: { slidesPerView: 2, spaceBetween: 50 }, // 2 slides on tablets
                800: { slidesPerView: 2, spaceBetween: 10 }, // 2 slides on tablets
                1024: { slidesPerView: 3,  spaceBetween: 10} // 3 slides on desktops
                // 1024: { slidesPerView: 3, spaceBetween: 200 } // 3 slides on desktops
              }}
            >
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCardEvent image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCardEvent image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCardEvent image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCardEvent image={EmptyImage}/>
              </SwiperSlide>
            </Swiper>

            <CategoryTitleAndArrow title={"Learnings"}/>
            <Swiper
              pagination={{
                dynamicBullets: true,
              }}
               modules={[Navigation, Pagination, Scrollbar, A11y]}
               spaceBetween={5}
               slidesPerView={2}
              //  onSlideChange={() => console.log('slide change')}
              //  onSwiper={(swiper) => console.log(swiper)}
               breakpoints={{
                 300: { slidesPerView: 2, spaceBetween: 5 }, // 2 slides on tablets
                 400: { slidesPerView: 1, spaceBetween: 5 }, // 2 slides on tablets
                 500: { slidesPerView: 1, spaceBetween: 0 }, // 2 slides on tablets
                 600: { slidesPerView: 2, spaceBetween: 60 }, // 2 slides on tablets
                 700: { slidesPerView: 2, spaceBetween: 50 }, // 2 slides on tablets
                 800: { slidesPerView: 2, spaceBetween: 10 }, // 2 slides on tablets
                 1024: { slidesPerView: 3,  spaceBetween: 10} // 3 slides on desktops
                 // 1024: { slidesPerView: 3, spaceBetween: 200 } // 3 slides on desktops
               }}
            >
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeLearningCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeLearningCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeLearningCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeLearningCard image={EmptyImage}/>
              </SwiperSlide>
            </Swiper>

            <CategoryTitleAndArrow title={"Merchants"}/>
            <Swiper
              pagination={{
                dynamicBullets: true,
              }}
               modules={[Navigation, Pagination, Scrollbar, A11y]}
               spaceBetween={5}
               slidesPerView={1}
              //  onSlideChange={() => console.log('slide change')}
              //  onSwiper={(swiper) => console.log(swiper)}
               breakpoints={{
                 300: { slidesPerView: 1, spaceBetween: 5 }, // 2 slides on tablets
                 400: { slidesPerView: 1, spaceBetween: 5 }, // 2 slides on tablets
                 500: { slidesPerView: 1, spaceBetween: 0 }, // 2 slides on tablets
                 600: { slidesPerView: 2, spaceBetween: 60 }, // 2 slides on tablets
                 700: { slidesPerView: 2, spaceBetween: 50 }, // 2 slides on tablets
                 800: { slidesPerView: 2, spaceBetween: 10 }, // 2 slides on tablets
                 1024: { slidesPerView: 3,  spaceBetween: 10} // 3 slides on desktops
                 // 1024: { slidesPerView: 3, spaceBetween: 200 } // 3 slides on desktops
               }}
            >
              <SwiperSlide className='flex justify-center mb-10'>
                <MechantCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <MechantCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <MechantCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <MechantCard image={EmptyImage}/>
              </SwiperSlide>
            </Swiper>
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
        
        {
          getBottomDetailsOpen &&(
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40">
              <div className="w-[50%] md:p-4 p-2 transition-transform bg-white shadow-lg rounded-t-2xl max-h-[90%] overflow-y-auto">
                <div className='flex justify-end'>
                    <button onClick={() => setBottomDetailsOpen(false)} className='flex items-center justify-center p-1 mr-2'>
                      <IoIosCloseCircleOutline  className="text-[23px] text-[#ff4949]" />
                    </button>
                </div>
                <div className='flex justify-center'>
                  <DestinationCard 
                  clickOffers={() => {
                    setOpenBottomOffer(!openBottomOffer)
                    HandleOfferDetails(ResultGetHomeContentsDetails)
                    setBottomDetailsOpen(false)
                    setCollapseBottomDetails(false)
                  }}
                  title={ResultGetHomeContentsDetails.content_title}
                  clickSeeDetails={() => setCollapseBottomDetails(!collapseBottomDetails)}
                  details={DOMPurify.sanitize(ResultGetHomeContentsDetails.content_description)}
                  image={'http://clubten.localtest.me/storage/' + ResultGetHomeContentsDetails.uploads_table_main_view.upload_url} 
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
                        {item.offers_table.membership_type_table.type_title}
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
      </main>
    </div>
  )
}

export default HomeContent