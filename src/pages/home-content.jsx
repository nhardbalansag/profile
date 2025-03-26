import React, { useState } from 'react';

import {
  HomeCard,
  BottomCreateAccountFloat,
  MechantCard,
  CategoryTitleAndArrow
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

import {
  Search,
  Calendar,
  CircledArrowRight
} from '../assets/icons/index'

import EmptyImage  from  '../assets/images/glorijan/empty.jpg'

import Logo1 from '../assets/images/ten/logo.png'

const HomeContent = () =>{

  const [startDate, setStartDate] = useState(new Date());


  return (
    <div>
      <main>
        <div className="flex flex-col items-center mx-auto text-center">
          <h1 className="text-[30px] font-extrabold text-[#063970] uppercase">WELCOME TO CLUB </h1>
            <img
            className="w-[40%]"
            alt="Tailwind CSS chat bubble component"
            src={Logo1} />
        </div>

        <div className='flex justify-center my-5 '>
          <div className='lg:flex lg:justify-center lg:items-center w-[75%] p-2 rounded-lg shadow-lg '>
            <div  className="flex items-center mx-2 my-1">
              <Search classes={'text-black mr-3'}/>
              <input type="text" placeholder="Where to?"  className='placeholder-black input w-full lg:w-[150px]'/>
            </div>
            <div className="mx-2 lg:w-[240px]  my-1">
              <div className='flex items-center justify-between lg:justify-start'>
                <div className='flex items-start lg:justify-end '>
                  <Calendar classes={'text-black mr-3'}/>
                  <p className='mr-2 text-black'>From</p>
                </div>
                <input type="date" className="p-2 w-[150px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="mx-2 lg:w-[240px]  my-1">
              <div className='flex items-center justify-between lg:justify-start'>
                <div className='flex items-start lg:justify-end'>
                  <Calendar classes={'text-black mr-3'}/>
                  <p className='mr-2 text-black'>To</p>
                </div>
                <input type="date" className="p-2 w-[150px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="mx-2 my-1 ">
              <button className='rounded bg-[#2596be] w-full text-white py-3 px-5 font-bold'>
                Search
              </button>
            </div>
          </div>
        </div>

        {/* contents */}
        <div className='flex justify-center my-5'>
          <div className='w-[75%] '>
            <CategoryTitleAndArrow title={"Travel Deals"}/>
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={100}
              slidesPerView={1}
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
              breakpoints={{
                300: { slidesPerView: 1, spaceBetween: 50 }, // 2 slides on tablets
                400: { slidesPerView: 1, spaceBetween: 10 }, // 2 slides on tablets
                500: { slidesPerView: 1, spaceBetween: 0 }, // 2 slides on tablets
                600: { slidesPerView: 2, spaceBetween: 10 }, // 2 slides on tablets
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
            </Swiper>
            
            <CategoryTitleAndArrow title={"Event Deals"}/>
            <Swiper
              spaceBetween={100}
              slidesPerView={1}
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
              breakpoints={{
                300: { slidesPerView: 1, spaceBetween: 50 }, // 2 slides on tablets
                400: { slidesPerView: 1, spaceBetween: 10 }, // 2 slides on tablets
                500: { slidesPerView: 1, spaceBetween: 0 }, // 2 slides on tablets
                600: { slidesPerView: 2, spaceBetween: 10 }, // 2 slides on tablets
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
            </Swiper>

            <CategoryTitleAndArrow title={"Merchants"}/>
            <Swiper
              spaceBetween={100}
              slidesPerView={1}
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
              breakpoints={{
                300: { slidesPerView: 1, spaceBetween: 50 }, // 2 slides on tablets
                400: { slidesPerView: 1, spaceBetween: 10 }, // 2 slides on tablets
                500: { slidesPerView: 1, spaceBetween: 0 }, // 2 slides on tablets
                600: { slidesPerView: 2, spaceBetween: 10 }, // 2 slides on tablets
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