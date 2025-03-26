import React, { useState } from 'react';

import {
  HomeCard,
  BottomCreateAccountFloat,
  MechantCard,
  CategoryTitleAndArrow,
  HomeCardCommunity,
  SearchFilterBar
} from '../component/index'

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import EmptyImage  from  '../assets/images/glorijan/empty.jpg'

import Logo1 from '../assets/images/ten/logo.png'
import TenBG2 from '../assets/images/ten/tenBg2.png'

const HomeContent = () =>{

  const [startDate, setStartDate] = useState(new Date());

  return (
    <div>
      <main>
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

        <SearchFilterBar/>

        {/* contents */}
        <div className='flex justify-center my-5'>
          <div className='w-[75%] '>

          <CategoryTitleAndArrow title={"Community"}/>
            <Swiper
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
              <SwiperSlide className='flex justify-center'>
                <HomeCardCommunity image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <HomeCardCommunity image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <HomeCardCommunity image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <HomeCardCommunity image={EmptyImage}/>
              </SwiperSlide>
            </Swiper>

            <CategoryTitleAndArrow title={"Travel Deals"}/>
            <Swiper
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
              <SwiperSlide className='flex justify-center'>
                <HomeCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <HomeCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <HomeCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <HomeCard image={EmptyImage}/>
              </SwiperSlide>
            </Swiper>
            
            <CategoryTitleAndArrow title={"Event Deals"}/>
            <Swiper
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
              <SwiperSlide className='flex justify-center'>
                <HomeCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <HomeCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <HomeCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <HomeCard image={EmptyImage}/>
              </SwiperSlide>
            </Swiper>

            <CategoryTitleAndArrow title={"Learnings"}/>
            <Swiper
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
              <SwiperSlide className='flex justify-center'>
                <HomeCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <HomeCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <HomeCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <HomeCard image={EmptyImage}/>
              </SwiperSlide>
            </Swiper>

            <CategoryTitleAndArrow title={"Merchants"}/>
            <Swiper
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
              <SwiperSlide className='flex justify-center'>
                <MechantCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <MechantCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <MechantCard image={EmptyImage}/>
              </SwiperSlide>
              <SwiperSlide className='flex justify-center'>
                <MechantCard image={EmptyImage}/>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        {/* end contents */}
        <div className='flex justify-center'>
          <BottomCreateAccountFloat/>
        </div>
        
      </main>
    </div>
  )
}

export default HomeContent