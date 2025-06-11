import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';

import { GoVerified } from "react-icons/go";

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

  const CheckSubscriptionPaymentIntentStatus = async () =>{
    const reqBody = {
      session_id: getPaymentIntentSession,
      subscription_categories_id: SelectedSubscriptionCategoryId
    }
    
    setLoadingContent(true)
    await api_subscription.CheckSubscriptionPaymentIntentStatus(auth_states.StateToken, reqBody).then((result) =>{
      setPaymentIntentSession(null)
      setLoadingContent(false)
      SetSelectedSubscriptionCategoryId(null)
    }).catch((err) =>{
      setPaymentIntentSession(null)
      setLoadingContent(false)
    })
  }

  const CloseBottomPayment = () =>{
    setOpenBottomPayment(false)

    CheckSubscriptionPaymentIntentStatus()
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
      <button onClick={onPress} className={`btn btn-active ${className} capitalize text-white`}>{title}</button>
    )
  }

  const _PlanSelect = ({dataList}) => {

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
                      item.membership_type.type_title
                    }
                  </h3>
                  {/* <p className="text-sm text-gray-500">
                    {
                      item.membership_type.type_description
                    }
                  </p> */}
                </div>
                <div className="text-right">
                  <p className="flex items-center justify-end text-lg font-semibold">
                    <span>${item.subscription_price} </span>
                    <span>/</span>
                    <span className="text-sm font-normal">
                      {
                        item.subscription_range.subscription_range_name
                      }
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">Billed after {item.subscription_range.subscription_range_days_count} days</p>
                  {
                    item.params ?
                      item.params.renewal &&
                      <p className="flex items-center justify-end text-sm font-extralight">
                        <span>${item.params.renewal.subscription_renewal_price} </span>
                        <span>/</span>
                        <span className="text-sm font-normal">Renewal</span>
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
                      <ButtonComp onPress={() => handleCheckout(item)} title='Subscribe to plan'/>
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
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Membership Status</h3>
        {
          loadingRequest
          ? <_LoadingComp/>
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
                    AccountSubscriptionDetails.details.commission_earnings.subscription_category.membership_type.type_title
                  }
                </h4>
                <p className="text-sm text-gray-600">
                  {
                    !loadingRequest &&
                    AccountSubscriptionDetails.details.commission_earnings.subscription_category.subscription_range.subscription_range_name
                  }
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subscription Plan Expiration</span>
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
                    days left before expiry
                  </span>
                </p>
              </div>
            </div>
        }
      </div>
    )
  }

  return (
    <div>
      <div className='grid grid-cols-1 pb-10 space-y-5 md:space-x-5 md:grid-cols-2'>
        <div>
          <MembershipStatus/>
        </div>
        <div className='space-y-3'>
          <div className='flex justify-start'>
            <div className='md:w-[75%] w-[95%]'>
              <p className='font-bold text-[#001d3d] text-[18px] capitalize'>Membership Plans</p>
            </div>
          </div>
          {
            loadingContent 
            ? <_LoadingComp/>
            : <_PlanSelect dataList={subscriptionList}/>
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
    </div>  
  ) 
}

export default AccountSubscription
