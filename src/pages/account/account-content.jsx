import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { TbTransfer } from "react-icons/tb";
import { MdOutlineCardGiftcard } from "react-icons/md";
import { LuHandshake } from "react-icons/lu";
import { BsGraphUpArrow } from "react-icons/bs";
import { PiBankBold } from "react-icons/pi";
import { LuQrCode } from "react-icons/lu";
import { TbWorldDollar } from "react-icons/tb";
import { BsBarChartLine } from "react-icons/bs";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { DollarSign, Users, Play, Megaphone } from 'lucide-react';
import { LuListVideo } from "react-icons/lu";
import { MdOutlineRedeem } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";

import { format } from 'date-fns';

import QRCode from "react-qr-code";
import { MdAttachMoney } from "react-icons/md";
import { MdVideoLibrary } from "react-icons/md";

import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { EffectCards } from 'swiper/modules';
import Logo2 from '../../assets/images/ten/logo2.png'

import * as api_orders from '../../services/account/orders.api.js'
import * as api_account from '../../services/account/account.api.js'
import * as api_subscription from '../../services/account/subscription.api.js'

const env = import.meta.env;

const AccountContent = () =>{

  const navigate = useNavigate();

  const auth_states = useSelector(state => state.AuthReducer);
  const modalSubscriptionRef = useRef(null);

  const [paginate, setPaginate] = useState(null)

  const [getPaginationButtonNextPrev, setPaginationButtonNextPrev] = useState({
    prev_page_url:  null,
    first_page_url:null,
    last_page_url:null,
    next_page_url:  null,
    current_page: null,
    last_page:null,
    total:0,
    from:0,
    to:0,
    data:[]
  })

  const [AccountSubscriptionDetails, SetAccountSubscriptionDetails] = useState([])

  const [loadingContent, setLoadingContent] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [walletData, setWalletData] = useState({
    t_points: 0,
    t_bucks: 0,
    t_dollars: 0,
    direct: 0,
    AccountTransaction:[]
  });

  const getTBucksAndTPoints = async() =>{
    setLoadingContent(true)
    await api_account.getTBucksAndTPoints(auth_states.StateToken).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        // setWalletData(result.data.data)
        Object.keys(result.data.data).map((item, key) =>{
          setWalletData((prev) => ({
            ...prev,
            [item]: result.data.data[item]
          }));
        })
      }
      
      setLoadingContent(false)

    }).catch((err) =>{
      setLoadingContent(false)
    })
  }

  const getPaginatedContent = async() =>{
    setRequestLoading(true)
    await api_account.getAccountTransaction(auth_states.StateToken, paginate).then((result) =>{
      if(result.status){
        Object.keys(result.data.data).map((item, key) =>{
          setPaginationButtonNextPrev((prev) => ({
            ...prev,
            [item]: result.data.data[item]
          }));
        })
      }

      setRequestLoading(false)
    }).catch((err) =>{
      setRequestLoading(false)
    })
  }

  const GetUserAccountSubscriptionDetails = async () =>{
    setRequestLoading(true)
    await api_subscription.GetUserAccountSubscriptionDetails(auth_states.StateToken).then((result) =>{
      SetAccountSubscriptionDetails(result.data.data)
      setRequestLoading(false)
    }).catch((err) =>{
      setRequestLoading(false)
    })
  }

  const validateTPointsTransfer = () =>{

    const account_membership_is_paid = AccountSubscriptionDetails.details.subscription_category.membership_type.translation.membership.is_paid_account

    if(!account_membership_is_paid){
      setTimeout(() => {
        modalSubscriptionRef.current?.showModal();
      }, 0)
    }else{
      navigate('/t-points-transfer')
    }
  }

  useEffect(() => {
    getTBucksAndTPoints()
    GetUserAccountSubscriptionDetails()
  },[])

  useEffect(() =>{
    getPaginatedContent()
  },[paginate])

  const handleShare = async (dataToShare) => {
    const shareUrl = `${env.VITE_APP_PORTAL}login?sponsor=${dataToShare}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CLUB TEN Referral',
          text: 'Start your journey with CLUB TEN',
          url: shareUrl,
        });
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Share link copied to clipboard!');
      } catch (error) {
        console.error('Clipboard copy failed:', error);
        alert('Unable to copy link. Please copy it manually:\n' + shareUrl);
      }
    }
  }

  const _SlideComponent = ({children}) =>{

    const wallet_details = [
      {
        title: 'travel dollars',
        balance: walletData.t_dollars,
        button:[
          {
            onPressAction: () => console.log(),
            title: 'Redeem',
            icon: <MdOutlineRedeem className="text-[20px] text-white" />
          }
        ]
      },
      {
        title: 't-points',
        balance: walletData.t_points,
        button:[
          {
            onPressAction: () => validateTPointsTransfer(),
            title: 'Transfer',
            icon: <TbTransfer className="text-[20px] text-white" />
          }
        ]
      },
      {
        title: 't-bucks',
        balance: walletData.t_bucks,
        button:[
          {
            onPressAction: () => navigate('/t-bucks-transfer'),
            title: 'Transfer',
            icon: <TbTransfer className="text-[20px] text-white" />
          },
          {
            onPressAction: () => navigate('/t-bucks-withdraw'),
            title: 'withdraw',
            icon: <PiBankBold className="text-[20px] text-white" />
          }
        ]
      }
    ]

    return(
      <Swiper
      //#region swiper parameter

      // effect={'cards'}
      //   grabCursor={true}
      //   modules={[EffectCards]}

        pagination={{
          dynamicBullets: true,
        }}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={5}
        slidesPerView={1}
        navigation={true}

        onSlideChange={() => setCollapseDetails(false)}
      //#endregion
      >
        {
          wallet_details.map((item, index) => (
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
                <_Buttons 
                onPressAction={item.onPressAction}
                icon={item.icon} 
                title={item.title} />
              ))
            }
          </div>
        </div>
      </div>
    )
  }

  const _Buttons = ({title, icon, hasBG=true, onPressAction}) =>{
    return(
      <button onClick={onPressAction} className={`${hasBG ? 'bg-white btn shadow-sm rounded-xl' : "flex flex-col items-center justify-center h-[130px] bg-transparent"} `}>
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
        {/* <div className="space-x-3">
          <_Buttons title={'date'}/>
          <_Buttons title={'transaction type'}/>
          <_Buttons title={'amount'}/>
        </div> */}
        <div className="my-8 space-y-6">
          
          {
            loadingContent 
            ?
              <div className=''>
                <div className="flex flex-col justify-center w-full gap-4 py-10">
                  {/* <div className="w-full h-32 skeleton"></div> */}
                  <div className="h-4 skeleton w-28"></div>
                  <div className="w-full h-4 skeleton"></div>
                  <div className="w-full h-4 skeleton"></div>
                </div>
              </div>
            :
              getPaginationButtonNextPrev.data.map((item, index) => (
                requestLoading
                ?
                  <div key={index} className="flex flex-row items-center justify-between w-full">
                    <div className="w-[50%] h-4 skeleton"></div>
                    <div className="w-[30%] h-4 skeleton"></div>
                  </div>
                :
                <div key={index} className="flex justify-between">
                  <div className="w-[200px]">
                    <p className="font-medium uppercase ">{item.description}</p>
                    <p className="text-xs font-thin uppercase ">{format(new Date(item.created_at), 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="w-[200px] text-right">
                    <p className="font-medium uppercase">
                      {
                        parseInt(item.t_bucks) !== 0 &&
                        <span>{`${item.is_debit ? "-" : (item.is_credit ? "+" : "-")}`}</span>
                      }
                      <span className='space-x-1'>
                        <span>{parseFloat(item.t_bucks).toFixed(2)}</span>
                        <span className='text-xs font-extralight '>T-BUCKS</span>
                      </span>
                    </p>
                    
                    <p className="font-thin uppercase ">
                      {
                        parseInt(item.t_points) !== 0 &&
                        <span>{`${item.is_debit ? "-" : (item.is_credit ? "+" : "-")}`}</span>
                      }
                      <span className='space-x-1'>
                        <span>{parseFloat(item.t_points).toFixed(2)}</span>
                        <span className='text-xs font-extralight '>T-POINTS</span>
                      </span>
                    </p>
                  </div>
                </div>
              ))
          }
        </div>
        <div className="pb-16 space-x-3">
          <_Buttons onPressAction={() => setPaginate(getPaginationButtonNextPrev.prev_page_url)} title={'Previous'}/>
          <_Buttons onPressAction={() => setPaginate(getPaginationButtonNextPrev.next_page_url)} title={'Next'}/>
        </div>
      </div>
    )
  }

  const _BonusCard = ({icon, title, value, rate, rateStatus = true, onPressAction}) =>{
    return(
      <button onClick={onPressAction} className="flex flex-col w-[100%] gap-2 p-4 bg-white shadow-md rounded-xl border">
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
      </button>
    )
  }

  const FinanceSummary = () => {
    return (
      <div className="w-[95%] grid grid-cols-2 gap-3">
        <_BonusCard
          onPressAction={() => navigate('/connects')}
          icon={<LuHandshake size={18} className="text-gray-600" />}
          title={'Direct Bonus'}
          value={walletData.direct}
          rate={0.0}
          rateStatus={true}
        />
        
        <_BonusCard
          icon={<FaRegStar size={18} className="text-gray-600" />}
          title={'Stars Bonus'}
          value={0.00}
          rate={0.0}
          rateStatus={false}
        />

        <_BonusCard
          icon={<TbWorldDollar size={18} className="text-gray-600" />}
          title={'Global Bonus'}
          value={0.00}
          rate={0.0}
          rateStatus={false}
        />

        <_BonusCard
          icon={<BsBarChartLine size={18} className="text-gray-600" />}
          title={'Milestone Bonus'}
          value={0.00}
          rate={0.0}
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
                <p className="text-[18px] font-semibold uppercase">{`${auth_states.StateUserInformation.first_name} ${auth_states.StateUserInformation.last_name}`}</p>
                <p className="text-[15px] font-thin">{auth_states.StateUserInformation.accounts_table.account_number}</p>
              </div>
              <div>
                <QRCode
                  value={auth_states.StateUserInformation.accounts_table.account_number}
                  size={150}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <button onClick={() => handleShare(auth_states.payload)} className="px-4 py-2 text-black ">
                <div className='flex items-center justify-center space-x-2'>
                  <p className='text-[18px]'>Share</p>
                  <FaRegShareFromSquare size={18}/>
                </div>
              </button>
            </div>
          </div>
          <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
        </div>
      </div>
    )
  }

  const ModalForUpgradeSubscriptionWhenVIP = () =>{
    return(
      <div>
        <dialog ref={modalSubscriptionRef} id="my_modal_2" className="modal">
          <div className="modal-box">
            <div className="flex-1 mt-5 space-y-1 md:space-y-8">
                <h2 className="text-2xl font-extrabold leading-tight text-center text-black capitalize md:text-3xl">
                available only for active VIP members.
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

                  <div className='flex justify-center'>
                    <button onClick={() => navigate('/subscriptions')} className="px-6 py-3 text-white transition-colors bg-[#031956] rounded-lg whitespace-nowrap">
                    Upgrade Membership
                    </button>
                  </div>
                </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
              <button>close</button>
          </form>
        </dialog>
      </div>
    )
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="">
        <div className="flex items-center justify-between">
            <p className="capitalize font-semibold text-[20px]">your wallet</p>
          </div>
          <div className="flex items-center justify-between px-3">
            <p className="capitalize text-[15px] md:text-[18px]">account number</p>
            <p className="font-semibold capitalize text-[25px] md:text-[25px]">{auth_states.StateUserInformation.accounts_table.account_number}</p>
            <label htmlFor="my_modal_7">
              <LuQrCode size={40}/>
            </label>
          </div>

          

          <div className="flex items-center justify-center mb-5">
            {
              loadingContent
              ?
                <div className='w-full'>
                  <div className="flex flex-col justify-center w-full gap-4 py-10">
                    <div className="w-full h-32 skeleton"></div>
                    <div className='flex items-center justify-between p-5'>
                      <div className="h-4 skeleton w-28"></div>
                      <div className="h-4 skeleton w-28"></div>
                    </div>
                  </div>
                </div>
              :
                <_SlideComponent/>
            }
          </div>

          {/* <div className='flex justify-center my-5'>
            <NavigationMenu/>
          </div> */}
          
          <div className="flex items-center justify-center my-5">
            <FinanceSummary/>
          </div>
        </div>
        <div className="px-3 space-y-5">
          <div className="flex items-center justify-between">
            <p className="capitalize font-semibold text-[20px]">transaction history</p>
          </div>
          <_TransactionTable/>
        </div>
      </div>
      <ModalComp/>
      <ModalForUpgradeSubscriptionWhenVIP/>
    </div>
  ) 
}

export default AccountContent