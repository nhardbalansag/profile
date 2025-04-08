import React, { useState, useRef, useEffect  } from 'react';

import {
  BottomCreateAccountFloat,
  DestinationCard,
  OffersBottomSheet
} from '../../component/index'

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

import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import DOMPurify from "dompurify";

import { FiHelpCircle } from "react-icons/fi";

import EmptyImage  from  '../../assets/images/glorijan/empty.jpg'

import Logo1 from '../../assets/images/ten/logo.png'
import TenBG2 from '../../assets/images/ten/tenBg2.png'
import test from '../../assets/images/glorijan/glorijanmob.png'
import ForTestDisplay from '../../assets/images/ten/forTestDisplay.jpg'
import ForTestDisplay2 from '../../assets/images/ten/forTestDisplay2.jpg'
import ForTestDisplay3 from '../../assets/images/ten/forTestDisplay3.jpg'
import Chengdu from '../../assets/images/ten/Chengdu1.jpg'

import {
  Search,
  Calendar,
  SettingsFilter
} from '../../assets/icons/index'

import * as api_content from '../../services/content/content.api'

const DestinationContent = () =>{

    const maxGuestCount = useRef(0)
    const walletRef = useRef(25)
    
    const [showBottomRegistration, setShowBottomRegistration] = useState(true);
    const [collapseDetails, setCollapseDetails] = useState(false);
    const [collapseBottomDetails, setCollapseBottomDetails] = useState(true);
    const [openBottomOffer, setOpenBottomOffer] = useState(false);
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

  const [open, setOpen] = useState(false);


  const handleTpoints = (item) => {
    setUseTPointsWalletFullAmount(!UseTPointsWalletFullAmount)

    const offers_amount = parseFloat(item.offers_table.offers_amount)
    const offers_points_amount = parseFloat(item.offers_table.offers_points_amount)
    const total = offers_amount - offers_points_amount

    if(!UseTPointsWalletFullAmount){
      const lessToWallet = ((walletRef.current - offers_points_amount) < 0 ? 0 : (walletRef.current - offers_points_amount))
      setTPointsWallet(lessToWallet)
      setTotalPriceWithPoints(offers_amount - (walletRef.current > offers_points_amount ? offers_points_amount : walletRef.current))
      setTPointsCustom(0)
    }else{
      setTotalPriceWithPoints(offers_amount)
      setTPointsWallet(walletRef.current)
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

  useEffect(() =>{
    GetHomeContents()
  },[])

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
                      <p className='mr-2 text-black'>From</p>
                  </div>
                  <input type="date" className="p-2 w-[150px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="mx-2 my-1">
              <div className='flex items-center justify-between lg:justify-start'>
                <div className='flex items-start lg:justify-end'>
                  <Calendar classes={'text-black mr-3'}/>
                  <p className='mr-2 text-black'>To</p>
                </div>
                <input type="date" className="p-2 w-[150px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="mx-2 my-3">
              <button className='rounded bg-[#2596be] w-full text-white py-3 px-5 font-bold'>
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
                  <DestinationCard 
                  clickOffers={() => {
                    setOpenBottomOffer(!openBottomOffer)
                    HandleOfferDetails(item)
                    setBottomDetailsOpen(false)
                    setCollapseBottomDetails(false)
                  }}
                  title={item.content_title}
                  clickSeeDetails={() => setCollapseBottomDetails(!collapseBottomDetails)}
                  details={DOMPurify.sanitize(item.content_description)}
                  image={'http://clubten.localtest.me/storage/' + item.uploads_table_main_view.upload_url} 
                  location='--'
                  collapseDetails={collapseBottomDetails}
                  loading={loadingContent}
                  isLiked={false}/>
                ))
              : 
                [1, 2].map((item, index) =>(
                  <DestinationCard loading={loadingContent}/>
                ))
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
    </div>
  )
}

export default DestinationContent