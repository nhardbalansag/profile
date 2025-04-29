import { useState } from "react";
import { TbTransfer } from "react-icons/tb";
import { MdOutlineCardGiftcard } from "react-icons/md";
import { LuHandshake } from "react-icons/lu";
import { BsGraphUpArrow } from "react-icons/bs";
import { PiBankBold } from "react-icons/pi";
import { LuQrCode } from "react-icons/lu";

import QRCode from "react-qr-code";

import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const AccountContent = () =>{

  const _SlideComponent = ({children}) =>{
    return(
      <Swiper
      //#region swiper parameter
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={5}
        slidesPerView={1}
        onSlideChange={() => setCollapseDetails(false)}
      //#endregion
      >
        {
          [
            {
              title: 't-points',
              balance: 100.00,
              button:[
                {
                  title: 'Redeem',
                  icon: <MdOutlineCardGiftcard className="text-[20px] text-white" />
                },
                {
                  title: 'Transfer',
                  icon: <TbTransfer className="text-[20px] text-white" />
                }
              ]
            },
            {
              title: 't-bucks',
              balance: 100.00,
              button:[
                {
                  title: 'Redeem',
                  icon: <MdOutlineCardGiftcard className="text-[20px] text-white" />
                },
                {
                  title: 'withdraw',
                  icon: <PiBankBold className="text-[20px] text-white" />
                }
              ]
            }
          ].map((item, index) => (
            <SwiperSlide key={index} className='flex justify-center py-5'>
              <_WalletCard title={item.title} amount={item.balance} buttons={item.button}/>
            </SwiperSlide>
          ))
        }
      </Swiper>
    )
  }

  const _WalletCard = ({title, amount, buttons}) =>{
    return(
      <div className="w-[90%] border rounded-2xl p-5 bg-white shadow-lg space-y-3 relative z-0">
        <p className="text-[18px] md:text-[25px] uppercase font-semibold">{title}</p>
        <div>
          <p className="text-[15px] md:text-[18px] capitalize">balance</p>
          <p className="text-[20px] md:text-[40px] font-bold">{parseFloat(amount)}</p>
        </div>
        <div className="my-5">  
          <div className="flex items-center justify-start space-x-5">
            {
              buttons.map((item, index) => (
                <_Buttons icon={item.icon} title={item.title}/>
              ))
            }
          </div>
        </div>
      </div>
    )
  }

  const _Buttons = ({title, icon, hasBG=true}) =>{
    return(
      <button className={`${hasBG ? 'bg-white btn shadow-sm rounded-xl' : "flex flex-col items-center justify-center h-[130px] bg-transparent"} `}>
        {
          icon &&
          <div className={`bg-blue-600 p-2 flex justify-center text-xl w-[35px] h-[35px] font-bold text-white  rounded-full`}>
            {icon}
          </div>
        }
        <p className="mt-1 text-sm capitalize">{title}</p>
      </button>
    )
  }

  const _TransactionTable = () => {
    return(
      <div className="">
        <div className="space-x-3">
          <_Buttons title={'date'}/>
          <_Buttons title={'transaction type'}/>
          <_Buttons title={'amount'}/>
        </div>
        <div className="my-8 space-y-6">
          {
            [1,2, 3].map((item, index) => (
              <div className="flex justify-between">
                <div className="w-[200px]">
                  <p className="font-medium uppercase ">pca activation</p>
                  <p className="font-thin uppercase ">02/24/2025</p>
                </div>
                <div className="w-[200px] text-right">
                  <p className="space-x-2 font-medium uppercase">
                    <span>+</span>
                    <span>100</span>
                  </p>
                  <p className="font-thin uppercase ">150</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  const _BonusCard = ({icon, title, value, rate, rateStatus = true}) =>{
    return(
      <div className="flex flex-col w-[48%] gap-2 p-4 bg-white shadow-md rounded-xl">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="">
            {icon}
          </div>
          <p>{title}</p>
        </div>
        <div className="text-[18px] md:text-2xl font-semibold text-black">{value}</div>
        <div className="px-2 py-1 text-sm font-medium text-green-600 bg-green-100 rounded w-fit">
        {rateStatus ? '+' : '-'}{rate}%
        </div>
      </div>
    )
  }

  const FinanceSummary = () => {
    return (
      <div className="flex w-[90%] justify-between">
        <_BonusCard
          icon={<LuHandshake className="w-4 h-4 text-gray-600" />}
          title={'Direct Bonus'}
          value={100.00}
          rate={2.4}
          rateStatus={true}
        />
        
        <_BonusCard
          icon={<BsGraphUpArrow className="w-4 h-4 text-gray-600" />}
          title={'Market Bonus'}
          value={100.00}
          rate={1.2}
          rateStatus={false}
        />
      </div>
    )
  }

  const ModalComp = () =>{
    return(
      <div>
        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my_modal_7" className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <div className="flex flex-col items-center justify-center space-y-5">
              <div className="text-center">
                <p className="text-[18px] font-semibold uppercase">bernard balansag</p>
                <p className="text-[15px] font-thin">123456789102</p>
              </div>
              <div>
                <QRCode
                  value="asdfafda/lkja;sdflkadf asdfafl;kj asdf asdf asdfa asdf  adf asdf  asdfasd"
                  size={150}
                  viewBox={`0 0 256 256`}
                />
              </div>
            </div>
          </div>
          <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="">
          <div className="flex items-center justify-between px-10">
            <p className="capitalize text-[15px] md:text-[18px]">account number</p>
            <p className="font-semibold capitalize text-[18px] md:text-[20px]">123456789102</p>
            <label htmlFor="my_modal_7">
              <LuQrCode />
            </label>
          </div>

          <div className="flex items-center justify-center mb-5">
            <_SlideComponent/>
          </div>
          <div className="flex items-center justify-center my-5">
            <FinanceSummary/>
          </div>
        </div>
        <div className="px-5 space-y-5">
          <div className="flex items-center justify-between">
            <p className="capitalize font-semibold text-[20px]">transaction history</p>
          </div>
          <_TransactionTable/>
        </div>
      </div>
      <ModalComp/>
    </div>
  ) 
}

export default AccountContent