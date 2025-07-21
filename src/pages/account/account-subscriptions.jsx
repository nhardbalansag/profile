import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';

import { GoVerified } from "react-icons/go";
import { ToastContainer, toast } from 'react-toastify';

import {
  Checkout
} from '../index.jsx'

import * as api_orders from '../../services/account/orders.api.js'
import * as api_subscription from '../../services/account/subscription.api.js'

const AccountSubscription = () =>{

  const auth_states = useSelector(state => state.AuthReducer);

  // refs
  const paymentBContent = useRef({})

  // loading states
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(true);

  const [subscriptionList, SetSubscriptionList] = useState([])
  const [AccountSubscriptionDetails, SetAccountSubscriptionDetails] = useState([])
  const [getclientSecret, setclientSecret] = useState(null)
  const [getPaymentIntentSession, setPaymentIntentSession] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState("");
  const [SelectedSubscriptionCategoryId, SetSelectedSubscriptionCategoryId] = useState(null);

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
      subscription_categories_id: selectedTab.id
    }

    SetSelectedSubscriptionCategoryId(selectedTab.id)

    paymentBContent.current = reqBody

    setOpenBottomPayment(true)
    
    setLoadingRequest(true)
    await api_subscription.GetClientSecret(auth_states.StateToken, reqBody).then((result) =>{
      if(result.status){
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
      
    }).catch((err) =>{
      toast.error("Something went wrong");
      setLoadingRequest(false)
    })
  }


  const CloseBottomPayment = () =>{
    setOpenBottomPayment(false)

    // CheckSubscriptionPaymentIntentStatus()
    GetUserAccountSubscriptionDetails()
  }

  useEffect(()=>{
    GetUserAccountSubscriptionDetails()
    userSubscriptionCategories()
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
                onClick={() => setSelectedPlan(item.id)}
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
              </div>
            </div>
        }
        {
          !loadingRequest &&
          AccountSubscriptionDetails.details.subscription_category.membership_type.translation.membership.is_paid_account &&
          !AccountSubscriptionDetails.details.is_unsubscribe  &&
          AccountSubscriptionDetails.paidMembershipCount > 1 &&
          <ButtonComp onPress={() => UnsubscribeToStripe()} className='btn-error' title='Unsubscribe'/>
        }
      </div>
    )
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
    </div>  
  ) 
}

export default AccountSubscription
