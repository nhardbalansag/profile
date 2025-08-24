import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { format, parseISO } from 'date-fns';

import { GoVerified } from "react-icons/go";
import { ToastContainer, toast } from 'react-toastify';

import { LuDollarSign } from "react-icons/lu";
import { CiCircleMinus } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";

import {
  Checkout
} from '../index.jsx'

import * as api_orders from '../../services/account/orders.api.js'
import * as api_subscription from '../../services/account/subscription.api.js'
import * as api_account from '../../services/account/account.api.js'

import Logo2 from '../../assets/images/ten/logo2.png'

const AccountSubscription = () =>{

  const auth_states = useSelector(state => state.AuthReducer);

  // refs
  const paymentBContent = useRef({})
  const modalSubscriptionRef = useRef(null);

  const walletRef = useRef(0)
  const walletTBucksRef = useRef(0)
  const walletTDollarsRef = useRef(0)
  

  // loading states
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(true);

  const [subscriptionList, SetSubscriptionList] = useState([])
  const [AccountSubscriptionDetails, SetAccountSubscriptionDetails] = useState([])
  const [getclientSecret, setclientSecret] = useState(null)
  const [getPaymentIntentSession, setPaymentIntentSession] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState("");
  const [SelectedSubscriptionCategoryId, SetSelectedSubscriptionCategoryId] = useState(null);

  const [totalPriceWithPoints, setTotalPriceWithPoints] = useState(0);
  const [getUseTBucksWalletFullAmount, setUseTBucksWalletFullAmount] = useState(false);
  const [TBucksCustom, setTBucksCustom] = useState(0);
  const [walletData, setWalletData] = useState({
      t_points: 0,
      t_bucks: 0,
      t_dollars: 0,
      AccountTransaction:[]
  });

  // behaviour
  const [openBottomPayment, setOpenBottomPayment] = useState(false);

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
  },[auth_states, loadingRequest, selectedPlan])

  const userSubscriptionCategories = async () =>{
    setLoadingContent(true)
    await api_subscription.AllUserSubscriptionCategories(auth_states.StateToken).then((result) =>{
      SetSubscriptionList(result.data.data)
      setLoadingContent(false)
    }).catch((err) =>{
      setLoadingContent(false)
    })
  }

  const GetUserAccountSubscriptionDetails = async () =>{
    setLoadingRequest(true)
    await api_subscription.GetUserAccountSubscriptionDetails(auth_states.StateToken).then((result) =>{
      SetAccountSubscriptionDetails(result.data.data)
      setLoadingRequest(false)
    }).catch((err) =>{
      setLoadingRequest(false)
    })
  }

  const handleCheckout = async (selectedTab) =>{
    const reqBody = {
      subscription_categories_id: selectedTab.id,
      final_amount_with_points: parseFloat(totalPriceWithPoints),

      bucks_applied: parseFloat(TBucksCustom) || 0,
      bucks_wallet_before: walletTBucksRef.current,
      bucks_wallet_after: walletData.t_bucks,
    }

    SetSelectedSubscriptionCategoryId(selectedTab.id)

    paymentBContent.current = reqBody

    setOpenBottomPayment(true)
    
    setLoadingRequest(true)
    await api_subscription.GetClientSecret(auth_states.StateToken, reqBody).then((result) =>{
      if(result.status){

        if(result.data.isWalletPayment){
          toast.success("Payment succeed");

          setLoadingRequest(false)
          resetOnClose()
          CloseBottomPayment()
          return;
        }

        setclientSecret(result.data.clientSecret)
        setPaymentIntentSession(result.data.sessionId)
        setLoadingRequest(false)
      }
    }).catch((err) =>{
      setLoadingRequest(false)
    })
  }

  const UnsubscribeToStripe = async () =>{
    setLoadingRequest(true)
    await api_subscription.UnsubscribeToStripe(auth_states.StateToken).then((result) =>{
     
      setLoadingRequest(false)

      if(!result.status){
        toast.error("Something went wrong");
      }

      toast.success("You are successfully unsubscribed");

      GetUserAccountSubscriptionDetails()
      userSubscriptionCategories()
      
    }).catch((err) =>{
      toast.error("Something went wrong");
      setLoadingRequest(false)
    })
  }

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

              walletRef.current = result.data.data.t_points
              walletTBucksRef.current = result.data.data.t_bucks
              walletTDollarsRef.current = result.data.data.t_dollars
          }
        
          setLoadingContent(false)
  
      }).catch((err) =>{
          setLoadingContent(false)
      })
  }

  const handleTbucks = () => {
    const toggledUseFullAmount = !getUseTBucksWalletFullAmount;
    setUseTBucksWalletFullAmount(toggledUseFullAmount);

    const currentWalletAmount = walletTBucksRef.current;
    const finalPrice = parseFloat(totalPriceWithPoints) + parseFloat(TBucksCustom);

    if (toggledUseFullAmount) {
        // Calculate the actual points allowed and usable
      const pointsAllowed = Math.min(currentWalletAmount, finalPrice);
      const pointsToUse = Math.min(pointsAllowed, finalPrice);

      // Derived values
      const remainingWalletBalance = currentWalletAmount - pointsToUse;
      const finalPriceNewValue = finalPrice - pointsToUse;

      // Set new state values
      setTotalPriceWithPoints(finalPriceNewValue);
      setWalletData(prev => ({...prev, t_bucks: remainingWalletBalance}))
      setTBucksCustom(pointsToUse);
    } else {
      // Revert values when toggle is off
      setTotalPriceWithPoints(prev => prev + TBucksCustom);
      setWalletData(prev => ({...prev, t_bucks: walletTBucksRef.current}))
      setTBucksCustom(0);
    }
  }

  const resetOnClose = () =>{

    getTBucksAndTPoints()
    setTotalPriceWithPoints(0)

    setTBucksCustom(0)

    setWalletData(prev => ({...prev, t_bucks: walletTBucksRef.current}))

    setUseTBucksWalletFullAmount(false)
  }

  const CloseBottomPayment = () =>{
    setOpenBottomPayment(false)

    // CheckSubscriptionPaymentIntentStatus()
    GetUserAccountSubscriptionDetails()
    userSubscriptionCategories()
  }

  useEffect(()=>{
    GetUserAccountSubscriptionDetails()
    userSubscriptionCategories()
    getTBucksAndTPoints()
  },[])

  const _LoadingComp = () =>{
    return(
      <div className='w-full'>
        <div className="flex flex-col justify-center w-full gap-4 py-5">
          <div className="w-full h-20 skeleton"></div>
          <div className="w-full h-20 skeleton"></div>
        </div>
      </div>
    )
  }

  const ButtonComp = ({onPress, title = "button", className = "btn-primary"}) =>{
    return (
      <button onClick={onPress} className={`btn btn-active ${className} capitalize text-white`}>
        {loadingRequest && <span className="loading loading-ring loading-sm"></span>}
        {title}
      </button>
    )
  }

  const TbucksWalletDetails = (SelectedSubscriptionCategoryContent) =>{
    return(
      <div>
      {
        walletTBucksRef.current > 0 &&
        <div className="max-w-xl p-5 space-y-4 border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <LuDollarSign className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900 my_tbucks_wallet_label_id">My T-Bucks Wallet</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{parseFloat(walletData.t_bucks).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <span className="text-sm font-medium text-gray-700 redeem_full_t_bucks_amount">Redeem Full T-Bucks Amount</span>
                <input 
                type="checkbox" 
                disabled={
                  parseFloat(parseFloat(totalPriceWithPoints).toFixed(2)) === 0 
                  ? (parseFloat(TBucksCustom) === 0 ? true : false) 
                  : false
                }
                checked={getUseTBucksWalletFullAmount} 
                onChange={() => handleTbucks()}
                className="toggle toggle-sm " /> 
            </div>
        </div>
      }
      </div>
    )
  }

  const _PlanSelect = (dataList) => {

    return(
      <div className="">
        <div className="grid grid-cols-1 gap-3">
          {dataList.map((item, key) => (
            <div key={key} className='space-y-3'>
              <div
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  // selectedPlan === item.subscription_earning_table.id
                  selectedPlan === item.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                // onClick={() => setSelectedPlan(item.subscription_earning_table.id)}
                onClick={() => {
                  resetOnClose()
                  setSelectedPlan(item.id);
                  setTotalPriceWithPoints(
                    AccountSubscriptionDetails.paidMembershipCount > 0
                    ? item.params.renewal.subscription_renewal_price
                    : item.subscription_price
                  )
                }}
              >
                <div>
                  <h3 className="text-3xl font-extrabold">
                    {
                      selectedLanguage.current == null 
                      ? item.membership_type.type_title
                      : (
                          item.membership_type.translation.translation
                          ?
                            (
                                item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                              ? item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_title 
                              : item.membership_type.type_title
                            )
                          : item.membership_type.type_title
                        )
                    }
                  </h3>
                  <p className="text-sm text-gray-500">
                    {
                      selectedLanguage.current == null 
                      ? item.membership_type.type_description
                      : (
                          item.membership_type.translation.translation
                          ?
                            (
                                item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                              ? item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_description 
                              : item.membership_type.type_description
                            )
                          : item.membership_type.type_description
                        )
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="flex items-center justify-end text-lg font-semibold">
                    <span>${item.subscription_price} </span>
                    <span>/</span>
                    <span className="text-sm font-normal">
                      {
                        selectedLanguage.current == null 
                        ? item.subscription_range.subscription_range_name
                        : (
                            item.subscription_range.params 
                            ?
                              (
                                item.subscription_range.params.translation
                                ?
                                  (
                                      item.subscription_range.params.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                    ? item.subscription_range.params.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).subscription_range_name 
                                    : item.subscription_range.subscription_range_name
                                  )
                                : item.subscription_range.subscription_range_name
                              )
                            : item.subscription_range.subscription_range_name
                          )
                      }
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    <span className='billed_after_label_id'>Billed after </span>
                    {item.subscription_range.subscription_range_days_count} 
                    <span className='days_label_id'>days</span>
                  </p>
                  {
                    item.params ?
                      item.params.renewal &&
                      <p className="flex items-center justify-end text-sm font-extralight">
                        <span>${item.params.renewal.subscription_renewal_price} </span>
                        <span>/</span>
                        <span className="text-sm font-normal renewal_label_id">Renewal</span>
                      </p>
                    : <span className="text-sm font-normal">--</span>
                  }
                </div>
              </div>

              <div>
                {
                  selectedPlan === item.id &&
                  AccountSubscriptionDetails.paidMembershipCount <= 0 &&
                  item.subscription_range.subscription_range_days_count === 365
                  ? TbucksWalletDetails(item)
                  : <></>
                }
              </div>
              {
                selectedPlan === item.id 
                ?
                  loadingRequest
                  ? <span className="loading loading-ring loading-xl"></span>
                  :
                    <div>
                      <button onClick={() => handleCheckout(item)} className={`btn btn-active btn-primary selection:capitalize text-white`}>
                        {loadingRequest && <span className="loading loading-ring loading-sm"></span>}
                        <span className='subscribe_to_plan_label_id'>Subscribe to plan</span>
                      </button>
                    </div>
                : <></>
              }
            </div>
          ))}
        </div>
      </div>
    )
  }

  const MembershipStatus = () =>{
    return(
      <div className="p-6 space-y-5 bg-white border border-gray-200 rounded-lg shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 membership_status_label_id">
          Membership Status
        </h3>
        {
          loadingRequest
          ? _LoadingComp()
          :
            <div>
              <div className="mb-4 text-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-r from-green-400 to-green-600">
                  {/* <Award className="w-8 h-8 text-white" /> */}
                  <GoVerified className="w-8 h-8 text-white"/>

                </div>
                <h4 className="font-extrabold text-gray-900">
                  {
                    !loadingRequest &&
                    selectedLanguage.current == null 
                    ? AccountSubscriptionDetails.details.subscription_category.membership_type.type_title
                    : (
                        AccountSubscriptionDetails.details.subscription_category.membership_type.translation.translation
                        ?
                          (
                              AccountSubscriptionDetails.details.subscription_category.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                            ? AccountSubscriptionDetails.details.subscription_category.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_title 
                            : AccountSubscriptionDetails.details.subscription_category.membership_type.type_title
                          )
                        : AccountSubscriptionDetails.details.subscription_category.membership_type.type_title
                      )
                  }
                </h4>
                <p className="text-sm text-gray-600">
                  {
                    !loadingRequest &&
                    selectedLanguage.current == null 
                    ? AccountSubscriptionDetails.details.subscription_category.subscription_range.subscription_range_name
                    : (
                        AccountSubscriptionDetails.details.subscription_category.subscription_range.params 
                        ?
                          (
                            AccountSubscriptionDetails.details.subscription_category.subscription_range.params.translation
                            ?
                              (
                                  AccountSubscriptionDetails.details.subscription_category.subscription_range.params.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                ? AccountSubscriptionDetails.details.subscription_category.subscription_range.params.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).subscription_range_name 
                                : AccountSubscriptionDetails.details.subscription_category.subscription_range.subscription_range_name
                              )
                            : AccountSubscriptionDetails.details.subscription_category.subscription_range.subscription_range_name
                          )
                        : AccountSubscriptionDetails.details.subscription_category.subscription_range.subscription_range_name
                      )
                  }
                </p>
              </div>
              {
                AccountSubscriptionDetails.paidMembershipCount > 0 && 
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 subscription_plan_expiration_label_id">Subscription Plan Expiration</span>
                    <span className="font-medium">
                      {
                        !loadingRequest &&
                        AccountSubscriptionDetails.percentage
                      }
                      %
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" 
                    style={{ width: `${AccountSubscriptionDetails.percentage}%` }}
                    >

                    </div>
                  </div>
                  <p className="space-x-2 text-xs text-gray-500">
                    <span>
                    {
                      !loadingRequest &&
                      AccountSubscriptionDetails.days_remaining
                    }
                    </span>
                    
                    <span>
                      {
                        !loadingRequest &&
                        AccountSubscriptionDetails.days_remaining < 0 
                        ? <span className='days_expired_label_id'>days expired</span>
                        : <span className='days_left_before_expiry_label_id'>days left before expiry</span>
                      }
                      
                    </span>
                  </p>
                  <p className="space-x-2 text-xs text-gray-500">
                    <span>
                      {
                        !loadingRequest &&
                        AccountSubscriptionDetails.details.subscription_category.membership_type.translation.membership.is_paid_account &&
                        <span className='expires_on_label_id'>Expires on</span>
                      }
                      
                    </span>
                    <span>
                    {
                      !loadingRequest &&
                      format(parseISO(AccountSubscriptionDetails.details.subscription_end), 'MMMM d, yyyy')
                    }
                    </span>
                  </p>
                </div>
               }
            </div>
        }
        {
          !loadingRequest &&
          AccountSubscriptionDetails.details.subscription_category.membership_type.translation.membership.is_paid_account &&
          !AccountSubscriptionDetails.details.is_unsubscribe  &&
          // AccountSubscriptionDetails.paidMembershipCount > 0 && 
          AccountSubscriptionDetails.details.params?.subscription &&
          <ButtonComp onPress={() => ConfirmationModalAction()} className='btn-error' title='Unsubscribe'/>
        }
      </div>
    )
  }

  const ConfirmationModal = () =>{
    return(
      <div>
        <dialog ref={modalSubscriptionRef} id="my_modal_2" className="modal">
          <div className="modal-box">
            <div className="flex-1 mt-5 space-y-1 md:space-y-8">
                <h2 className="text-2xl font-extrabold leading-tight text-center text-black capitalize are_you_sure_label_id md:text-3xl">
                Are you sure want to unsubscribe?
                </h2>

                <div className="flex flex-col items-center space-y-3 ">
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-full">
                    <img
                    className="w-[60px] md:w-[100px]"
                    alt="Tailwind CSS chat bubble component"
                    src={Logo2} />
                  </div>

                  <div className="flex-1 text-center">
                    <p className="text-sm font-semibold text-yellow-600 warning_label_id">Warning</p>
                    <p className="text-xs text-yellow-600 warning_note_label_id">
                      By unsubscribing, your plan won’t renew automatically.
                    </p>
                  </div>

                  <div className='flex justify-center space-x-3'>
                    <button onClick={() => UnsubscribeToStripe()} className="proceed_label_id px-6 py-3 text-white transition-colors bg-[#031956] rounded-lg whitespace-nowrap">
                    Proceed
                    </button>
                    <button onClick={() => modalSubscriptionRef.current?.close()} className="cancel_label_id px-6 py-3 text-white transition-colors bg-[#df5555] rounded-lg whitespace-nowrap">
                    Cancel
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
  
  const ConfirmationModalAction = () =>{
    setTimeout(() => {
      modalSubscriptionRef.current?.showModal();
    }, 0)
  }

  return (
    <div>
      <div className='grid grid-cols-1 pb-10 space-y-5 md:space-x-5 md:grid-cols-2'>
        <div>
          {MembershipStatus()}
        </div>
        <div className='space-y-3'>
          <div className='flex justify-start'>
            <div className='md:w-[75%] w-[95%]'>
              <p className='font-bold text-[#001d3d] text-[18px] capitalize membership_plans_label_id'>
                Membership Plans
              </p>
            </div>
          </div>
          {
            loadingContent 
            ? _LoadingComp()
            : _PlanSelect(subscriptionList)
          }
        </div>
      </div>

      {
        openBottomPayment && 
        <Checkout 
        clientSecret={getclientSecret} 
        getLoading={loadingRequest} 
        dataContent={paymentBContent.current} 
        handleClose={() => CloseBottomPayment()}
        />
      }

      <ToastContainer />
      {ConfirmationModal()}

    </div>  
  ) 
}

export default AccountSubscription
