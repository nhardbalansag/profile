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
import { FaDollarSign } from "react-icons/fa6";

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
const VITE_APP_PORTAL = env.VITE_APP_PORTAL

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

    total_direct_commission: 0,
    total_stars_commission: 0,

    AccountTransaction:[],
    sponsor: null
  });

  const [getLegacyCommissionTotal, setLegacyCommissionTotal] = useState(0)

  const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)  // null means main translation is used

  useEffect(() =>{
    if(auth_states.SelectedLanguage){
      selectedLanguage.current = parseInt(auth_states.SelectedLanguage.id)
    }
  },[auth_states])

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
  },[auth_states, getPaginationButtonNextPrev])
  //#endregion

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

  const getLegacyCommissionsTotalCommission = async() =>{
    setLoadingContent(true)
    await api_account.getLegacyCommissionsTotalCommission(auth_states.StateToken).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        // setWalletData(result.data.data)
        setLegacyCommissionTotal(result.data.data)
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
    getLegacyCommissionsTotalCommission()
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
          text: '',
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

  const _SlideComponent = () =>{
    return(
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={5}
        slidesPerView={1}
        navigation={true}
        onSlideChange={() => setCollapseDetails(false)}
      >

        {/* Travel Dollars */}
        <SwiperSlide className='flex justify-center py-5'>
          <div className="w-[90%] border rounded-2xl p-5 bg-white shadow-lg space-y-3 relative z-0">
            <p className="text-[18px] md:text-[25px] uppercase font-semibold">
              <span className='travel_dollars_label_id'>travel dollars</span>
            </p>
            <div>
              <p className="text-[15px] md:text-[18px] capitalize balance_label_id">balance</p>
              <p className="text-[20px] md:text-[40px] font-bold">{parseFloat(walletData.t_dollars)}</p>
            </div>
            <div className="my-5">
              <div className="flex items-center justify-start space-x-5">
                <button onClick={() => console.log()} className="bg-white shadow-sm btn rounded-xl">
                  <div className="bg-blue-600 p-2 flex justify-center text-xl w-[35px] h-[35px] font-bold text-white rounded-full">
                    <MdOutlineRedeem className="text-[20px] text-white" />
                  </div>
                  <p className="mt-1 text-sm capitalize">
                    <span className='redeem_label_id'>Redeem</span>
                  </p>
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* T-Points */}
        <SwiperSlide className='flex justify-center py-5'>
          <div className="w-[90%] border rounded-2xl p-5 bg-white shadow-lg space-y-3 relative z-0">
            <p className="text-[18px] md:text-[25px] uppercase font-semibold">
              <span className='tpoints_label_id'>t-points</span>
            </p>
            <div>
              <p className="text-[15px] md:text-[18px] capitalize balance_label_id">balance</p>
              <p className="text-[20px] md:text-[40px] font-bold">{parseFloat(walletData.t_points)}</p>
            </div>
            <div className="my-5">
              <div className="flex items-center justify-start space-x-5">
                <button onClick={() => validateTPointsTransfer()} className="bg-white shadow-sm btn rounded-xl">
                  <div className="bg-blue-600 p-2 flex justify-center text-xl w-[35px] h-[35px] font-bold text-white rounded-full">
                    <TbTransfer className="text-[20px] text-white" />
                  </div>
                  <p className="mt-1 text-sm capitalize">
                    <span className='transfer_label_id'>Transfer</span>
                  </p>
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* T-Bucks */}
        <SwiperSlide className='flex justify-center py-5'>
          <div className="w-[90%] border rounded-2xl p-5 bg-white shadow-lg space-y-3 relative z-0">
            <p className="text-[18px] md:text-[25px] uppercase font-semibold">
              <span className='tbucks_label_id'>t-bucks</span>
            </p>
            <div>
              <p className="text-[15px] md:text-[18px] capitalize balance_label_id">balance</p>
              <p className="text-[20px] md:text-[40px] font-bold">{parseFloat(walletData.t_bucks)}</p>
            </div>
            <div className="my-5">
              <div className="flex items-center justify-start space-x-5">

                {/* Transfer Button */}
                <button onClick={() => navigate('/t-bucks-transfer')} className="bg-white shadow-sm btn rounded-xl">
                  <div className="bg-blue-600 p-2 flex justify-center text-xl w-[35px] h-[35px] font-bold text-white rounded-full">
                    <TbTransfer className="text-[20px] text-white" />
                  </div>
                  <p className="mt-1 text-sm capitalize">
                    <span className='transfer_label_id'>Transfer</span>
                  </p>
                </button>

                {/* Withdraw Button */}
                <button onClick={() => navigate('/t-bucks-withdraw')} className="bg-white shadow-sm btn rounded-xl">
                  <div className="bg-blue-600 p-2 flex justify-center text-xl w-[35px] h-[35px] font-bold text-white rounded-full">
                    <PiBankBold className="text-[20px] text-white" />
                  </div>
                  <p className="mt-1 text-sm capitalize">
                    <span className='withdraw_label_id'>Withdraw</span>
                  </p>
                </button>

              </div>
            </div>
          </div>
        </SwiperSlide>

      </Swiper>
    )
  }

  const _WalletCard = (title, amount, buttons) =>{
    return(
      <div className="w-[90%] border rounded-2xl p-5 bg-white shadow-lg space-y-3 relative z-0">
        <p className="text-[18px] md:text-[25px] uppercase font-semibold">{title}</p>
        <div>
          <p className="text-[15px] md:text-[18px] capitalize balance_label_id">balance</p>
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
                    <p className="font-medium capitalize ">
                      {
                        item.account_transaction_type == "direct"
                        ? item.account_transaction_type + " commission"
                        : (
                            item.account_transaction_type == "star"
                            ? item.account_transaction_type + " commission"
                            : item.description
                          )
                      }
                    </p>
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
                        <span className='text-xs font-extralight t_bucks_uppercase_label_id'>T-BUCKS</span>
                      </span>
                    </p>
                    
                    <p className="font-thin uppercase ">
                      {
                        parseInt(item.t_points) !== 0 &&
                        <span>{`${item.is_debit ? "-" : (item.is_credit ? "+" : "-")}`}</span>
                      }
                      <span className='space-x-1'>
                        <span>{parseFloat(item.t_points).toFixed(2)}</span>
                        <span className='text-xs font-extralight t_points_uppercase_label_id'>T-POINTS</span>
                      </span>
                    </p>
                  </div>
                </div>
              ))
          }
        </div>
        <div className="pb-16 space-x-3">
          <button
            onClick={() => setPaginate(getPaginationButtonNextPrev.prev_page_url)}
            className="bg-white shadow-sm btn rounded-xl"
          >
            <p className="mt-1 text-sm capitalize">
              <span className="previous_label_id">Previous</span>
            </p>
          </button>

          <button
            onClick={() => setPaginate(getPaginationButtonNextPrev.next_page_url)}
            className="bg-white shadow-sm btn rounded-xl"
          >
            <p className="mt-1 text-sm capitalize">
              <span className="next_label_id">Next</span>
            </p>
          </button>
          {/* <_Buttons onPressAction={() => setPaginate(getPaginationButtonNextPrev.prev_page_url)} title={<span className='previous_label_id'>Previous</span>}/>
          <_Buttons onPressAction={() => setPaginate(getPaginationButtonNextPrev.next_page_url)} title={<span className='next_label_id'>Next</span>}/> */}
        </div>
      </div>
    )
  }

  const FinanceSummary = () => {
    return (
      <div className="w-[95%] grid grid-cols-2 gap-3">
        <button onClick={() => navigate('/connects')} className="flex flex-col w-[100%] gap-2 p-4 bg-white shadow-md rounded-xl border">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div>
              <LuHandshake size={18} className="text-gray-600" />
            </div>
            <p>
              <span className='direct_bonus_label_id'>Direct Bonus</span>
            </p>
          </div>
          <div className="text-[18px] md:text-2xl font-semibold text-black flex items-center space-x-2 justify-center">
            <span><FaDollarSign size={18} className="text-gray-600" /></span>
            <span>{parseFloat(walletData.total_direct_commission).toFixed(2)}</span>
          </div>
          <div className="px-2 py-1 text-sm font-medium text-green-600 bg-green-100 rounded w-fit">
            +0.0%
          </div>
        </button>

        <button  onClick={() => navigate('/commissions')}  className="flex flex-col w-[100%] gap-2 p-4 bg-white shadow-md rounded-xl border">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div>
              <FaRegStar size={18} className="text-gray-600" />
            </div>
            <p><span className='star_bonus_label_id'>Stars Bonus</span></p>
          </div>
          <div className="text-[18px] md:text-2xl font-semibold text-black flex items-center space-x-2 justify-center">
            <span><FaDollarSign size={18} className="text-gray-600" /></span>
            <span>{parseFloat(parseFloat(getLegacyCommissionTotal) + parseFloat(walletData.total_stars_commission)).toFixed(2)}</span>
          </div>
          <div className="px-2 py-1 text-sm font-medium text-green-600 bg-green-100 rounded w-fit">
            -0.0%
          </div>
        </button>

        <button className="flex flex-col w-[100%] gap-2 p-4 bg-white shadow-md rounded-xl border">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div>
              <TbWorldDollar size={18} className="text-gray-600" />
            </div>
            <p><span className='global_bonus_label_id'>Global Bonus</span></p>
          </div>
          <div className="text-[18px] md:text-2xl font-semibold text-black">0.00</div>
          <div className="px-2 py-1 text-sm font-medium text-green-600 bg-green-100 rounded w-fit">
            -0.0%
          </div>
        </button>

        <button className="flex flex-col w-[100%] gap-2 p-4 bg-white shadow-md rounded-xl border">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div>
              <BsBarChartLine size={18} className="text-gray-600" />
            </div>
            <p><span className='milestone_bonus_label_id'>Milestone Bonus</span></p>
          </div>
          <div className="text-[18px] md:text-2xl font-semibold text-black">0.00</div>
          <div className="px-2 py-1 text-sm font-medium text-green-600 bg-green-100 rounded w-fit">
            -0.0%
          </div>
        </button>
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
                  value={VITE_APP_PORTAL + "login?sponsor=" + auth_states.StateUserInformation.accounts_table.account_number}
                  size={150}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <button onClick={() => handleShare(auth_states.payload)} className="px-4 py-2 text-black ">
                <div className='flex items-center justify-center space-x-2'>
                  <p className='text-[18px] share_label_id'>Share</p>
                  <FaRegShareFromSquare size={18}/>
                </div>
              </button>
            </div>
          </div>
          <label className="modal-backdrop close_label_id" htmlFor="my_modal_7">Close</label>
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
                <h2 className="text-2xl font-extrabold leading-tight text-center text-black capitalize available_only_for_active_vip_members_label_id md:text-3xl">
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
                    <button onClick={() => navigate('/subscriptions')} className="upgrade_membership_label_id px-6 py-3 text-white transition-colors bg-[#031956] rounded-lg whitespace-nowrap">
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
            <p className="capitalize font-semibold text-[20px] your_wallet_label_id">your wallet</p>
          </div>

          <div className='my-3 space-y-5'>
            <div className="p-3 bg-blue-100 rounded-md shadow-md">
              <div className="flex items-end space-x-2">
                <p className="capitalize text-[15px] your_sponsor_label_id">Your Sponsor</p>
                <div>
                  {
                    loadingContent 
                    ? "--"
                    :
                      <p className="font-semibold capitalize text-[15px] space-x-1">
                        <span>
                        {
                          walletData.sponsor &&
                          walletData.sponsor.account_number
                        }
                        </span>
                        <span>
                        {
                          walletData.sponsor &&
                          walletData.sponsor?.users_table.nick_names
                        }
                        </span>
                      </p>
                  }
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <p className="capitalize text-[15px] phone_label_id">Phone</p>
                <div>
                  {
                    loadingContent 
                    ? "--"
                    :
                      <p className="font-semibold capitalize text-[15px]">
                        {
                          walletData.sponsor &&
                          walletData.sponsor?.users_table.mobile_number
                          ? walletData.sponsor?.users_table.mobile_number
                          : "--"
                        }
                      </p>
                  }
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <p className="capitalize text-[15px] email_label_id">Email</p>
                <div>
                  {
                    loadingContent 
                    ? "--"
                    :
                      <p className="font-semibold capitalize text-[15px]">
                        {
                          walletData.sponsor &&
                          walletData.sponsor?.users_table.email
                          ? walletData.sponsor?.users_table.email
                          : "--"
                        }
                      </p>
                  }
                </div>
              </div>
            </div>
          
            <div className="flex items-center justify-between px-3">
              <p className="capitalize text-[15px] md:text-[18px] account_number_label_id">account number</p>
              <p className="font-semibold capitalize text-[25px] md:text-[25px]">{auth_states.StateUserInformation.accounts_table.account_number}</p>
              <label htmlFor="my_modal_7">
                <LuQrCode size={40}/>
              </label>
            </div>
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
                _SlideComponent()
            }
          </div>

          {/* <div className='flex justify-center my-5'>
            <NavigationMenu/>
          </div> */}
          
          <div className="flex items-center justify-center my-5">
            {FinanceSummary()}
          </div>
        </div>
        <div className="px-3 space-y-5">
          <div className="flex items-center justify-between">
            <p className="capitalize font-semibold text-[20px] transaction_history_label_id">transaction history</p>
          </div>
          {_TransactionTable()}
        </div>
      </div>
      <ModalComp/>
      <ModalForUpgradeSubscriptionWhenVIP/>
    </div>
  ) 
}

export default AccountContent