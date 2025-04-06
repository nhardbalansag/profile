import React, { useState, useRef } from 'react';

import {
  BottomCreateAccountFloat,
  DestinationCard
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


const DestinationContent = () =>{

  const rawHTML = `<h2><strong>Discover Chengdu China with Club T.E.N.&nbsp;</strong></h2><p><br></p><h3><strong>Embark on a 5-day, 4-nightjourney to Chengdu, China. Experience the charm of giant pandas, savor authentic Sichuan hotpot, and explore historical sites like Dujiangyan and the Sanxingdui Museum. This trip promises unforgettable memories and cultural immersion.&nbsp;</strong></h3><p><br></p><p><br></p><p><strong>Day 1:&nbsp;</strong></p><p><br></p><ul><li>Begin your adventure in Chengdu China. </li><li>We will pick your party up from Chengdu Shuangliu Airport or Tianfu International Airport and transfer you to the amazing 5 stars luxury Intercontinental Century City Hotel by IHG. You can take a good rest or explore the city.</li></ul><p><br></p><p><strong style="color: oklch(0.278078 0.029596 256.848);">Day 2:&nbsp;</strong></p><ul><li>After breakfast at your hotel, we will go for a 2 hours traditional Shu Embroidery experience where you will be amazed by traditional chinese artistry. Then we will savor cultural heritage Guanghan food for lunch before embarking to the San Xing Dui Museum, one of the greatest archaelogical discoveries of the 20th century. In the evening, we will arrive at Du Jiang Yan to enjoy traditional Sichuan Hotpot for dinner.</li></ul><p><br></p><p><strong>Day 3:</strong> </p><ul><li>After breakfast, we will depart for the China Panda Base and volunteer to feed the Pandas up close and personal with amazing photo opportunities. After lunch, we will visit the historical shopping street called Kuanzhai Xiangzi. And during dinner, we will experience traditional Sichuan opera where you will be blown away by the Bianlian performance and Kungfu Tea Pouring Acrobatics show.</li></ul><p><br></p><p><strong>Day 4: </strong></p><ul><li>Free and Easy Day for you to explore the city on your own. We recommend you to explore places like the Chengdu Museum, Wuhou Temple, Yulin Road, Jiuyan Bridge, Du Fu Thatched Cottages. You can also visit Jinli or People’s Park and get a local feel of how the locals live their daily lifestyles playing chess and drinking tea as their pastimes. You can also try out ear-picking if you dare.</li></ul><p><br></p><p><strong>Day 5:</strong> </p><ul><li>Enjoy breakfast at the hotel at your own convenience in the morning. Check out from the hotel and according to your flight time, we will transfer you back to the airport, and take a flight back home.</li></ul><h2><br></h2><h2><strong>*Optional add on 4 Days 3 Nights to Jiu Zhai Gou UNESCO Heritage National Park. </strong></h2><h2><strong>Please contact us for details.</strong></h2>hook.js:377 <h2><strong>Discover Chengdu China with Club T.E.N.&nbsp;</strong></h2><p><br></p><h3><strong>Embark on a 5-day, 4-nightjourney to Chengdu, China. Experience the charm of giant pandas, savor authentic Sichuan hotpot, and explore historical sites like Dujiangyan and the Sanxingdui Museum. This trip promises unforgettable memories and cultural immersion.&nbsp;</strong></h3><p><br></p><p><br></p><p><strong>Day 1:&nbsp;</strong></p><p><br></p><ul><li>Begin your adventure in Chengdu China. </li><li>We will pick your party up from Chengdu Shuangliu Airport or Tianfu International Airport and transfer you to the amazing 5 stars luxury Intercontinental Century City Hotel by IHG. You can take a good rest or explore the city.</li></ul><p><br></p><p><strong style="color: oklch(0.278078 0.029596 256.848);">Day 2:&nbsp;</strong></p><ul><li>After breakfast at your hotel, we will go for a 2 hours traditional Shu Embroidery experience where you will be amazed by traditional chinese artistry. Then we will savor cultural heritage Guanghan food for lunch before embarking to the San Xing Dui Museum, one of the greatest archaelogical discoveries of the 20th century. In the evening, we will arrive at Du Jiang Yan to enjoy traditional Sichuan Hotpot for dinner.</li></ul><p><br></p><p><strong>Day 3:</strong> </p><ul><li>After breakfast, we will depart for the China Panda Base and volunteer to feed the Pandas up close and personal with amazing photo opportunities. After lunch, we will visit the historical shopping street called Kuanzhai Xiangzi. And during dinner, we will experience traditional Sichuan opera where you will be blown away by the Bianlian performance and Kungfu Tea Pouring Acrobatics show.</li></ul><p><br></p><p><strong>Day 4: </strong></p><ul><li>Free and Easy Day for you to explore the city on your own. We recommend you to explore places like the Chengdu Museum, Wuhou Temple, Yulin Road, Jiuyan Bridge, Du Fu Thatched Cottages. You can also visit Jinli or People’s Park and get a local feel of how the locals live their daily lifestyles playing chess and drinking tea as their pastimes. You can also try out ear-picking if you dare.</li></ul><p><br></p><p><strong>Day 5:</strong> </p><ul><li>Enjoy breakfast at the hotel at your own convenience in the morning. Check out from the hotel and according to your flight time, we will transfer you back to the airport, and take a flight back home.</li></ul><h2><br></h2><h2><strong>*Optional add on 4 Days 3 Nights to Jiu Zhai Gou UNESCO Heritage National Park. </strong></h2><h2><strong>Please contact us for details.</strong></h2>home-content.jsx:45 <h2><strong>Discover Chengdu China with Club T.E.N.&nbsp;</strong></h2><p><br></p><h3><strong>Embark on a 5-day, 4-nightjourney to Chengdu, China. Experience the charm of giant pandas, savor authentic Sichuan hotpot, and explore historical sites like Dujiangyan and the Sanxingdui Museum. This trip promises unforgettable memories and cultural immersion.&nbsp;</strong></h3><p><br></p><p><br></p><p><strong>Day 1:&nbsp;</strong></p><p><br></p><ul><li>Begin your adventure in Chengdu China. </li><li>We will pick your party up from Chengdu Shuangliu Airport or Tianfu International Airport and transfer you to the amazing 5 stars luxury Intercontinental Century City Hotel by IHG. You can take a good rest or explore the city.</li></ul><p><br></p><p><strong style="color: oklch(0.278078 0.029596 256.848);">Day 2:&nbsp;</strong></p><ul><li>After breakfast at your hotel, we will go for a 2 hours traditional Shu Embroidery experience where you will be amazed by traditional chinese artistry. Then we will savor cultural heritage Guanghan food for lunch before embarking to the San Xing Dui Museum, one of the greatest archaelogical discoveries of the 20th century. In the evening, we will arrive at Du Jiang Yan to enjoy traditional Sichuan Hotpot for dinner.</li></ul><p><br></p><p><strong>Day 3:</strong> </p><ul><li>After breakfast, we will depart for the China Panda Base and volunteer to feed the Pandas up close and personal with amazing photo opportunities. After lunch, we will visit the historical shopping street called Kuanzhai Xiangzi. And during dinner, we will experience traditional Sichuan opera where you will be blown away by the Bianlian performance and Kungfu Tea Pouring Acrobatics show.</li></ul><p><br></p><p><strong>Day 4: </strong></p><ul><li>Free and Easy Day for you to explore the city on your own. We recommend you to explore places like the Chengdu Museum, Wuhou Temple, Yulin Road, Jiuyan Bridge, Du Fu Thatched Cottages. You can also visit Jinli or People’s Park and get a local feel of how the locals live their daily lifestyles playing chess and drinking tea as their pastimes. You can also try out ear-picking if you dare.</li></ul><p><br></p><p><strong>Day 5:</strong> </p><ul><li>Enjoy breakfast at the hotel at your own convenience in the morning. Check out from the hotel and according to your flight time, we will transfer you back to the airport, and take a flight back home.</li></ul><h2><br></h2><h2><strong>*Optional add on 4 Days 3 Nights to Jiu Zhai Gou UNESCO Heritage National Park. </strong></h2><h2><strong>Please contact us for details.</strong></h2>hook.js:377 <h2><strong>Discover Chengdu China with Club T.E.N.&nbsp;</strong></h2><p><br></p><h3><strong>Embark on a 5-day, 4-nightjourney to Chengdu, China. Experience the charm of giant pandas, savor authentic Sichuan hotpot, and explore historical sites like Dujiangyan and the Sanxingdui Museum. This trip promises unforgettable memories and cultural immersion.&nbsp;</strong></h3><p><br></p><p><br></p><p><strong>Day 1:&nbsp;</strong></p><p><br></p><ul><li>Begin your adventure in Chengdu China. </li><li>We will pick your party up from Chengdu Shuangliu Airport or Tianfu International Airport and transfer you to the amazing 5 stars luxury Intercontinental Century City Hotel by IHG. You can take a good rest or explore the city.</li></ul><p><br></p><p><strong style="color: oklch(0.278078 0.029596 256.848);">Day 2:&nbsp;</strong></p><ul><li>After breakfast at your hotel, we will go for a 2 hours traditional Shu Embroidery experience where you will be amazed by traditional chinese artistry. Then we will savor cultural heritage Guanghan food for lunch before embarking to the San Xing Dui Museum, one of the greatest archaelogical discoveries of the 20th century. In the evening, we will arrive at Du Jiang Yan to enjoy traditional Sichuan Hotpot for dinner.</li></ul><p><br></p><p><strong>Day 3:</strong> </p><ul><li>After breakfast, we will depart for the China Panda Base and volunteer to feed the Pandas up close and personal with amazing photo opportunities. After lunch, we will visit the historical shopping street called Kuanzhai Xiangzi. And during dinner, we will experience traditional Sichuan opera where you will be blown away by the Bianlian performance and Kungfu Tea Pouring Acrobatics show.</li></ul><p><br></p><p><strong>Day 4: </strong></p><ul><li>Free and Easy Day for you to explore the city on your own. We recommend you to explore places like the Chengdu Museum, Wuhou Temple, Yulin Road, Jiuyan Bridge, Du Fu Thatched Cottages. You can also visit Jinli or People’s Park and get a local feel of how the locals live their daily lifestyles playing chess and drinking tea as their pastimes. You can also try out ear-picking if you dare.</li></ul><p><br></p><p><strong>Day 5:</strong> </p><ul><li>Enjoy breakfast at the hotel at your own convenience in the morning. Check out from the hotel and according to your flight time, we will transfer you back to the airport, and take a flight back home.</li></ul><h2><br></h2><h2><strong>*Optional add on 4 Days 3 Nights to Jiu Zhai Gou UNESCO Heritage National Park. </strong></h2><h2><strong>Please contact us for details.</strong></h2>`

  const sanitizedHTML = DOMPurify.sanitize(rawHTML);

  const [showBottomRegistration, setShowBottomRegistration] = useState(true);
  const [collapseDetails, setCollapseDetails] = useState(false);

  const [open, setOpen] = useState(false);

  const [count, setCount] = useState(2);

  const handleDecrease = () => {
    if (count > 0) setCount(count - 1);
  };

  const handleIncrease = () => {
    setCount(count + 1);
  };

  const [activeTab, setActiveTab] = useState("standard");
  
  const pricingData = {
    standard: {
      title: "STANDARD",
      subtitle: "2 Guests Per Room",
      price: "$1088",
      note: "TP not applicable",
    },
    vip: {
      title: "VIP",
      subtitle: "2 Guests Per Room",
      price: "$1288",
      note: "Includes TP",
    },
    pca: {
      title: "PCA",
      subtitle: "Private Room",
      price: "$1588",
      note: "All-inclusive package",
    },
  }  

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
            <DestinationCard 
            clickOffers={() => setOpen(true)}
            title='Chengdu China Cultural Experience'
            clickSeeDetails={() => setCollapseDetails(!collapseDetails)}
            details={sanitizedHTML}
            image={Chengdu} 
            location='China'
            collapseDetails={collapseDetails}
            isLiked/>

            <DestinationCard 
            clickOffers={() => setOpen(true)}
            title='Chengdu China Cultural Experience'
            clickSeeDetails={() => setCollapseDetails(!collapseDetails)}
            details={sanitizedHTML}
            image={Chengdu} 
            location='China'
            collapseDetails={collapseDetails}
            isLiked/>
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

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md md:p-4 p-2 transition-transform bg-white shadow-lg rounded-t-2xl max-h-[90%] overflow-y-auto">
            <div className='flex justify-end'>
              <button onClick={() => setOpen(false)} className='flex items-center justify-center p-1 mr-2'>
                <IoIosCloseCircleOutline  className="text-[23px] text-[#ff4949]" />
              </button>
            </div>

            <div role="tablist" className="flex justify-center mb-4 tabs tabs-lift">
              {Object.keys(pricingData).map((key) => (
                <a
                  key={key}
                  role="tab"
                  className={`tab text-[20px] ${activeTab === key ? "tab-active text-[#282727] font-extrabold" : ""}`}
                  // onClick={() => setActiveTab(key)}
                >
                  {pricingData[key].title}
                </a>
              ))}
            </div>
        
            <div className="max-w-md p-5 mx-auto space-y-6 bg-white border shadow-lg md:p-6 rounded-2xl ">
              <div className='space-y-6'>
                <div className='mt-3 space-y-2'>
                  <div className="flex items-center justify-start space-x-3">
                    <div className="flex items-center space-x-2">
                      <IoPartlySunnyOutline  className="text-[15px] text-[#FF5722]" />
                      <label className="text-black text-[12px]">3 Days</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IoCloudyNightOutline   className="text-[15px] text-[#FF5722]" />
                      <label className="text-black text-[12px]">3 Nights</label>
                    </div>
                  </div>
                </div>
                
                <div className='mt-3 space-y-2'>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BsCalendar2Check className="text-[15px] text-[#FF5722]" />
                      <label className="text-gray-500 text-[12px]">Date</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p  className="text-[12px]">Feb 01, 2024 - Feb 01, 2024 </p>
                    </div>
                  </div>
                </div>

                <div className='mt-3 space-y-2'>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <LuCalendarClock  className="text-[15px] text-[#FF5722]" />
                      <label className="text-gray-500 text-[12px]">Registration End</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p  className="text-[12px]">Feb 01, 2024</p>
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HiOutlineUsers    className="text-[18px] text-[#FF5722]" />
                      <label className="text-gray-500 text-[12px]">Guest</label>
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
                    <p className='text-[12px] text-gray-500'>(note: maximum guest is 2)</p>
                  </div>
                </div>
              </div> 

              <div className="flex items-center justify-between p-4 border border-blue-500 rounded-lg bg-blue-50">
                <div>
                  <p className="font-medium">Twin Sharing</p>
                  <p className="text-sm text-gray-500">2 guest per room</p>
                  {/* <button className="mt-1 text-sm font-medium text-blue-600">Select offer</button> */}
                </div>
                <div className="text-lg font-bold text-center"> 
                  <p>$1800</p>
                </div>
              </div>
        
              <div className="space-y-4 border-b-[1px] pb-3">
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <RiCoinsLine   className="text-[25px] text-[#FF5722]" />
                    <p className='text-[12px] ml-2 text-black'>Redeem T-Points</p>
                  </div>
                  <p className='text-[15px] ml-2 text-black font-semibold'>10</p>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <FiHelpCircle className="text-[15px] text-[#FF5722]" />
                    <p className='text-[10.5px] ml-2 text-black'><strong>1 T-Point</strong> is equal to <strong> $1 USD</strong></p>
                  </div>
                  <p className='text-[11px] ml-2 text-black font-semibold'>$10 USD</p>
                </div>
                <div className='flex items-center'>
                  <p className='text-[12px] text-gray-500'>(Tip: Redeem your T-Points for instant discounts!)</p>
                </div>
              </div>

              <div className="pb-3 text-right border-b"> 
                <div className='flex items-center justify-between'>
                  <p className="text-[11px]">Price</p>
                  <p className="text-lg font-semibold">$1800.00</p>
                </div>
                <div className='flex items-center justify-between'>
                  <p className="text-[11px]">Applied T-Points</p>
                  <p className="text-lg font-semibold border-b-2 border-black"> - $10.00</p>
                </div>
                <div className='flex items-center justify-between'>
                  <p className="text-[11px]">Total Price</p>
                  <p className="text-lg text-[24px] font-bold">$1790.00</p>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <SlWallet   className="text-[15px] text-[#FF5722]" />
                  <p className='text-[12px] ml-2 text-black'>My T-Points Wallet</p>
                </div>
                <p className='text-[12px] ml-2 text-black font-semibold'>100</p>
              </div>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="upload_is_link" className="toggle toggle-sm" /> 
                <p className='text-[12px]'>Redeem Full T-Points Amount</p>
              </label>
              
              <div className="flex items-end justify-center space-x-2">
                <button onClick={handleDecrease } className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                  <CiCircleMinus   className="text-[25px] text-[#FF5722]" />
                </button>
                <div className='flex items-center justify-center text-center'>
                  <div>
                    <label className="label text-[12px]">T-Points Amount</label>
                    <input type="number" name="content_days_count" placeholder="0" value={count} className="w-[80px] input input-bordered input-md" />
                  </div>
                </div>
                <button onClick={handleIncrease} className='flex items-center justify-center p-1 bg-white border shadow-lg rounded-badge'>
                  <CiCirclePlus   className="text-[25px] text-[#FF5722]" />
                </button>
              </div>
      
              <div className="space-y-3">
                <div className="flex items-center justify-end pt-4">
                  <div className="flex gap-3">
                    <button  onClick={() => setOpen(false)} className="px-2 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100">Cancel</button>
                    <button className="px-2 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Checkout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DestinationContent