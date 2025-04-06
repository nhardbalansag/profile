import React, { useState, useRef } from 'react';

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

import { useMediaQuery } from 'react-responsive'
import MediaQuery from 'react-responsive'

import { Link } from "react-router-dom";

import { IoIosCloseCircleOutline } from "react-icons/io";

import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import DOMPurify from "dompurify";

import EmptyImage  from  '../assets/images/glorijan/empty.jpg'

import Logo1 from '../assets/images/ten/logo.png'
import TenBG2 from '../assets/images/ten/tenBg2.png'
import test from '../assets/images/glorijan/glorijanmob.png'
import ForTestDisplay from '../assets/images/ten/forTestDisplay.jpg'
import ForTestDisplay2 from '../assets/images/ten/forTestDisplay2.jpg'
import ForTestDisplay3 from '../assets/images/ten/forTestDisplay3.jpg'
import Chengdu from '../assets/images/ten/Chengdu1.jpg'


const HomeContent = () =>{

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 601px)'
  })
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })
  
  const rawHTML = `<h2><strong>Discover Chengdu China with Club T.E.N.&nbsp;</strong></h2><p><br></p><h3><strong>Embark on a 5-day, 4-nightjourney to Chengdu, China. Experience the charm of giant pandas, savor authentic Sichuan hotpot, and explore historical sites like Dujiangyan and the Sanxingdui Museum. This trip promises unforgettable memories and cultural immersion.&nbsp;</strong></h3><p><br></p><p><br></p><p><strong>Day 1:&nbsp;</strong></p><p><br></p><ul><li>Begin your adventure in Chengdu China. </li><li>We will pick your party up from Chengdu Shuangliu Airport or Tianfu International Airport and transfer you to the amazing 5 stars luxury Intercontinental Century City Hotel by IHG. You can take a good rest or explore the city.</li></ul><p><br></p><p><strong style="color: oklch(0.278078 0.029596 256.848);">Day 2:&nbsp;</strong></p><ul><li>After breakfast at your hotel, we will go for a 2 hours traditional Shu Embroidery experience where you will be amazed by traditional chinese artistry. Then we will savor cultural heritage Guanghan food for lunch before embarking to the San Xing Dui Museum, one of the greatest archaelogical discoveries of the 20th century. In the evening, we will arrive at Du Jiang Yan to enjoy traditional Sichuan Hotpot for dinner.</li></ul><p><br></p><p><strong>Day 3:</strong> </p><ul><li>After breakfast, we will depart for the China Panda Base and volunteer to feed the Pandas up close and personal with amazing photo opportunities. After lunch, we will visit the historical shopping street called Kuanzhai Xiangzi. And during dinner, we will experience traditional Sichuan opera where you will be blown away by the Bianlian performance and Kungfu Tea Pouring Acrobatics show.</li></ul><p><br></p><p><strong>Day 4: </strong></p><ul><li>Free and Easy Day for you to explore the city on your own. We recommend you to explore places like the Chengdu Museum, Wuhou Temple, Yulin Road, Jiuyan Bridge, Du Fu Thatched Cottages. You can also visit Jinli or People’s Park and get a local feel of how the locals live their daily lifestyles playing chess and drinking tea as their pastimes. You can also try out ear-picking if you dare.</li></ul><p><br></p><p><strong>Day 5:</strong> </p><ul><li>Enjoy breakfast at the hotel at your own convenience in the morning. Check out from the hotel and according to your flight time, we will transfer you back to the airport, and take a flight back home.</li></ul><h2><br></h2><h2><strong>*Optional add on 4 Days 3 Nights to Jiu Zhai Gou UNESCO Heritage National Park. </strong></h2><h2><strong>Please contact us for details.</strong></h2>hook.js:377 <h2><strong>Discover Chengdu China with Club T.E.N.&nbsp;</strong></h2><p><br></p><h3><strong>Embark on a 5-day, 4-nightjourney to Chengdu, China. Experience the charm of giant pandas, savor authentic Sichuan hotpot, and explore historical sites like Dujiangyan and the Sanxingdui Museum. This trip promises unforgettable memories and cultural immersion.&nbsp;</strong></h3><p><br></p><p><br></p><p><strong>Day 1:&nbsp;</strong></p><p><br></p><ul><li>Begin your adventure in Chengdu China. </li><li>We will pick your party up from Chengdu Shuangliu Airport or Tianfu International Airport and transfer you to the amazing 5 stars luxury Intercontinental Century City Hotel by IHG. You can take a good rest or explore the city.</li></ul><p><br></p><p><strong style="color: oklch(0.278078 0.029596 256.848);">Day 2:&nbsp;</strong></p><ul><li>After breakfast at your hotel, we will go for a 2 hours traditional Shu Embroidery experience where you will be amazed by traditional chinese artistry. Then we will savor cultural heritage Guanghan food for lunch before embarking to the San Xing Dui Museum, one of the greatest archaelogical discoveries of the 20th century. In the evening, we will arrive at Du Jiang Yan to enjoy traditional Sichuan Hotpot for dinner.</li></ul><p><br></p><p><strong>Day 3:</strong> </p><ul><li>After breakfast, we will depart for the China Panda Base and volunteer to feed the Pandas up close and personal with amazing photo opportunities. After lunch, we will visit the historical shopping street called Kuanzhai Xiangzi. And during dinner, we will experience traditional Sichuan opera where you will be blown away by the Bianlian performance and Kungfu Tea Pouring Acrobatics show.</li></ul><p><br></p><p><strong>Day 4: </strong></p><ul><li>Free and Easy Day for you to explore the city on your own. We recommend you to explore places like the Chengdu Museum, Wuhou Temple, Yulin Road, Jiuyan Bridge, Du Fu Thatched Cottages. You can also visit Jinli or People’s Park and get a local feel of how the locals live their daily lifestyles playing chess and drinking tea as their pastimes. You can also try out ear-picking if you dare.</li></ul><p><br></p><p><strong>Day 5:</strong> </p><ul><li>Enjoy breakfast at the hotel at your own convenience in the morning. Check out from the hotel and according to your flight time, we will transfer you back to the airport, and take a flight back home.</li></ul><h2><br></h2><h2><strong>*Optional add on 4 Days 3 Nights to Jiu Zhai Gou UNESCO Heritage National Park. </strong></h2><h2><strong>Please contact us for details.</strong></h2>home-content.jsx:45 <h2><strong>Discover Chengdu China with Club T.E.N.&nbsp;</strong></h2><p><br></p><h3><strong>Embark on a 5-day, 4-nightjourney to Chengdu, China. Experience the charm of giant pandas, savor authentic Sichuan hotpot, and explore historical sites like Dujiangyan and the Sanxingdui Museum. This trip promises unforgettable memories and cultural immersion.&nbsp;</strong></h3><p><br></p><p><br></p><p><strong>Day 1:&nbsp;</strong></p><p><br></p><ul><li>Begin your adventure in Chengdu China. </li><li>We will pick your party up from Chengdu Shuangliu Airport or Tianfu International Airport and transfer you to the amazing 5 stars luxury Intercontinental Century City Hotel by IHG. You can take a good rest or explore the city.</li></ul><p><br></p><p><strong style="color: oklch(0.278078 0.029596 256.848);">Day 2:&nbsp;</strong></p><ul><li>After breakfast at your hotel, we will go for a 2 hours traditional Shu Embroidery experience where you will be amazed by traditional chinese artistry. Then we will savor cultural heritage Guanghan food for lunch before embarking to the San Xing Dui Museum, one of the greatest archaelogical discoveries of the 20th century. In the evening, we will arrive at Du Jiang Yan to enjoy traditional Sichuan Hotpot for dinner.</li></ul><p><br></p><p><strong>Day 3:</strong> </p><ul><li>After breakfast, we will depart for the China Panda Base and volunteer to feed the Pandas up close and personal with amazing photo opportunities. After lunch, we will visit the historical shopping street called Kuanzhai Xiangzi. And during dinner, we will experience traditional Sichuan opera where you will be blown away by the Bianlian performance and Kungfu Tea Pouring Acrobatics show.</li></ul><p><br></p><p><strong>Day 4: </strong></p><ul><li>Free and Easy Day for you to explore the city on your own. We recommend you to explore places like the Chengdu Museum, Wuhou Temple, Yulin Road, Jiuyan Bridge, Du Fu Thatched Cottages. You can also visit Jinli or People’s Park and get a local feel of how the locals live their daily lifestyles playing chess and drinking tea as their pastimes. You can also try out ear-picking if you dare.</li></ul><p><br></p><p><strong>Day 5:</strong> </p><ul><li>Enjoy breakfast at the hotel at your own convenience in the morning. Check out from the hotel and according to your flight time, we will transfer you back to the airport, and take a flight back home.</li></ul><h2><br></h2><h2><strong>*Optional add on 4 Days 3 Nights to Jiu Zhai Gou UNESCO Heritage National Park. </strong></h2><h2><strong>Please contact us for details.</strong></h2>hook.js:377 <h2><strong>Discover Chengdu China with Club T.E.N.&nbsp;</strong></h2><p><br></p><h3><strong>Embark on a 5-day, 4-nightjourney to Chengdu, China. Experience the charm of giant pandas, savor authentic Sichuan hotpot, and explore historical sites like Dujiangyan and the Sanxingdui Museum. This trip promises unforgettable memories and cultural immersion.&nbsp;</strong></h3><p><br></p><p><br></p><p><strong>Day 1:&nbsp;</strong></p><p><br></p><ul><li>Begin your adventure in Chengdu China. </li><li>We will pick your party up from Chengdu Shuangliu Airport or Tianfu International Airport and transfer you to the amazing 5 stars luxury Intercontinental Century City Hotel by IHG. You can take a good rest or explore the city.</li></ul><p><br></p><p><strong style="color: oklch(0.278078 0.029596 256.848);">Day 2:&nbsp;</strong></p><ul><li>After breakfast at your hotel, we will go for a 2 hours traditional Shu Embroidery experience where you will be amazed by traditional chinese artistry. Then we will savor cultural heritage Guanghan food for lunch before embarking to the San Xing Dui Museum, one of the greatest archaelogical discoveries of the 20th century. In the evening, we will arrive at Du Jiang Yan to enjoy traditional Sichuan Hotpot for dinner.</li></ul><p><br></p><p><strong>Day 3:</strong> </p><ul><li>After breakfast, we will depart for the China Panda Base and volunteer to feed the Pandas up close and personal with amazing photo opportunities. After lunch, we will visit the historical shopping street called Kuanzhai Xiangzi. And during dinner, we will experience traditional Sichuan opera where you will be blown away by the Bianlian performance and Kungfu Tea Pouring Acrobatics show.</li></ul><p><br></p><p><strong>Day 4: </strong></p><ul><li>Free and Easy Day for you to explore the city on your own. We recommend you to explore places like the Chengdu Museum, Wuhou Temple, Yulin Road, Jiuyan Bridge, Du Fu Thatched Cottages. You can also visit Jinli or People’s Park and get a local feel of how the locals live their daily lifestyles playing chess and drinking tea as their pastimes. You can also try out ear-picking if you dare.</li></ul><p><br></p><p><strong>Day 5:</strong> </p><ul><li>Enjoy breakfast at the hotel at your own convenience in the morning. Check out from the hotel and according to your flight time, we will transfer you back to the airport, and take a flight back home.</li></ul><h2><br></h2><h2><strong>*Optional add on 4 Days 3 Nights to Jiu Zhai Gou UNESCO Heritage National Park. </strong></h2><h2><strong>Please contact us for details.</strong></h2>`

  const sanitizedHTML = DOMPurify.sanitize(rawHTML);

  const [showBottomRegistration, setShowBottomRegistration] = useState(true);
  const [collapseDetails, setCollapseDetails] = useState(false);
  const [collapseBottomDetails, setCollapseBottomDetails] = useState(true);

  const [openBottomOffer, setOpenBottomOffer] = useState(false);

  const handleOpenBottomDetails = () => {
  };

  const handleCloseBottomDetails = () => {
  };
  
  const [count, setCount] = useState(2);

  const handleDecreaseFunc = () => {
    if (count > 0) setCount(count - 1);
  };

  const handleIncreaseFunc = () => {
    setCount(count + 1);
  };

  const [getBottomDetailsOpen, setBottomDetailsOpen] = useState(false);

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
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
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
              onSwiper={(swiper) => console.log(swiper)}
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
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCard 
                clickOffers={() => setOpenBottomOffer(true)}
                title='Chengdu China Cultural Experience'
                clickSeeDetails={() => isDesktopOrLaptop ? setBottomDetailsOpen(true) : setCollapseDetails(!collapseDetails)}
                details={sanitizedHTML}
                image={Chengdu} 
                location='China'
                collapseDetails={collapseDetails}
                isLiked/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCard image={ForTestDisplay3}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCard image={ForTestDisplay2}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center mb-10'>
                <HomeCard image={ForTestDisplay}/>
              </SwiperSlide>
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
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
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
               onSlideChange={() => console.log('slide change')}
               onSwiper={(swiper) => console.log(swiper)}
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
               onSlideChange={() => console.log('slide change')}
               onSwiper={(swiper) => console.log(swiper)}
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
               onSlideChange={() => console.log('slide change')}
               onSwiper={(swiper) => console.log(swiper)}
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
                <DestinationCard 
                clickOffers={() => {
                  setOpenBottomOffer(!openBottomOffer)
                  setBottomDetailsOpen(false)
                }}
                title='Chengdu China Cultural Experience'
                clickSeeDetails={() => setCollapseBottomDetails(!collapseBottomDetails)}
                details={sanitizedHTML}
                image={Chengdu} 
                location='China'
                collapseDetails={collapseBottomDetails}
                isLiked/>
              </div>
            </div>
          )
        }
        
        {
          openBottomOffer &&(
            <OffersBottomSheet
            handleClose={() => setOpenBottomOffer(!openBottomOffer)}
            handleIncrease={() => handleIncreaseFunc()}
            handleDecrease={() => handleDecreaseFunc()}
            count={count}
            activeTab={activeTab}
            // selectTab={() => setActiveTab()}
            tabData={pricingData}
            />
          )
        }
      </main>
    </div>
  )
}

export default HomeContent