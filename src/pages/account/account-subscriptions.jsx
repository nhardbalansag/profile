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
  const [getclientEbanxSecret, setclientEbanxSecret] = useState(null)
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

  const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)

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

  const handleCheckoutEbanx = async (selectedTab) =>{
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
    await api_subscription.createEbanxPayment(auth_states.StateToken, reqBody).then((result) =>{
      if(result.status){
        if(result.data.status === 'ERROR'){
          toast.success(result.data?.status_message);
          resetOnClose()
          CloseBottomPayment()
          return;
        }
        setLoadingRequest(false)
        resetOnClose()
        CloseBottomPayment()
        window.open(result.data.redirect_url, "_blank");
      }
    }).catch((err) =>{
      setLoadingRequest(false)
      resetOnClose()
      CloseBottomPayment()
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
      const pointsAllowed = Math.min(currentWalletAmount, finalPrice);
      const pointsToUse = Math.min(pointsAllowed, finalPrice);
      const remainingWalletBalance = currentWalletAmount - pointsToUse;
      const finalPriceNewValue = finalPrice - pointsToUse;
      setTotalPriceWithPoints(finalPriceNewValue);
      setWalletData(prev => ({...prev, t_bucks: remainingWalletBalance}))
      setTBucksCustom(pointsToUse);
    } else {
      setTotalPriceWithPoints(prev => prev + TBucksCustom);
      setWalletData(prev => ({...prev, t_bucks: walletTBucksRef.current}))
      setTBucksCustom(0);
    }
  }

  const resetOnClose = () =>{
    getTBucksAndTPoints()
    setTotalPriceWithPoints(0)
    setclientEbanxSecret(null)
    setTBucksCustom(0)
    setWalletData(prev => ({...prev, t_bucks: walletTBucksRef.current}))
    setUseTBucksWalletFullAmount(false)
  }

  const CloseBottomPayment = () =>{
    setOpenBottomPayment(false)
    GetUserAccountSubscriptionDetails()
    userSubscriptionCategories()
  }

  useEffect(()=>{
    GetUserAccountSubscriptionDetails()
    userSubscriptionCategories()
    getTBucksAndTPoints()
  },[])

  const SkeletonLoader = () => (
    <div className="space-y-3 animate-pulse">
      <div className="h-24 bg-gray-100 rounded-2xl"></div>
      <div className="h-24 bg-gray-100 rounded-2xl"></div>
    </div>
  )

  const TbucksWalletDetails = (SelectedSubscriptionCategoryContent) =>{
    return(
      <div>
      {
        walletTBucksRef.current > 0 &&
        <div className="p-4 mt-3 border rounded-2xl border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100">
                <LuDollarSign className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-amber-900 my_tbucks_wallet_label_id">My T-Bucks Wallet</span>
            </div>
            <span className="text-lg font-bold text-amber-800 tabular-nums">{parseFloat(walletData.t_bucks).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white border border-amber-200 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-800 redeem_full_t_bucks_amount">Redeem Full T-Bucks Amount</p>
              {TBucksCustom > 0 && (
                <p className="text-xs text-amber-600 mt-0.5">−${parseFloat(TBucksCustom).toFixed(2)} applied</p>
              )}
            </div>
            <input
              type="checkbox"
              disabled={
                parseFloat(parseFloat(totalPriceWithPoints).toFixed(2)) === 0
                ? (parseFloat(TBucksCustom) === 0 ? true : false)
                : false
              }
              checked={getUseTBucksWalletFullAmount}
              onChange={() => handleTbucks()}
              className="toggle toggle-sm toggle-warning"
            />
          </div>
        </div>
      }
      </div>
    )
  }

  const _PlanSelect = (dataList) => {
    return(
      <div className="space-y-3">
        {dataList.map((item, key) => (
          <div key={key}>
            <div
              className={`group relative rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden
                ${selectedPlan === item.id
                  ? "border-blue-500 shadow-lg shadow-blue-100"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
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
              {/* Selected indicator bar */}
              {selectedPlan === item.id && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl"></div>
              )}

              <div className="flex items-start justify-between gap-3 p-4">
                {/* Left: Plan info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-extrabold leading-tight text-gray-900 truncate sm:text-2xl">
                      {selectedLanguage.current == null
                        ? item.membership_type.type_title
                        : (
                            item.membership_type.translation.translation
                            ? (
                                item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                ? item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_title
                                : item.membership_type.type_title
                              )
                            : item.membership_type.type_title
                          )
                      }
                    </h3>
                    {selectedPlan === item.id && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 shrink-0">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {selectedLanguage.current == null
                      ? item.membership_type.type_description
                      : (
                          item.membership_type.translation.translation
                          ? (
                              item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                              ? item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_description
                              : item.membership_type.type_description
                            )
                          : item.membership_type.type_description
                        )
                    }
                  </p>
                </div>

                {/* Right: Pricing */}
                <div className="text-right shrink-0">
                  <div className="flex items-baseline justify-end gap-0.5">
                    <span className="text-xs font-medium text-gray-500">$</span>
                    <span className="text-2xl font-bold text-gray-900 tabular-nums">{item.subscription_price}</span>
                  </div>
                  <div className="flex items-center justify-end text-xs text-gray-400 gap-0.5">
                    <span>/</span>
                    <span>
                      {selectedLanguage.current == null
                        ? item.subscription_range.subscription_range_name
                        : (
                            item.subscription_range.params
                            ? (
                                item.subscription_range.params.translation
                                ? (
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
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    <span className="billed_after_label_id">Billed after </span>
                    {item.subscription_range.subscription_range_days_count}
                    <span className="days_label_id"> days</span>
                  </p>
                  {item.params?.renewal && (
                    <div className="mt-1 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-200">
                      <span className="text-xs font-semibold text-green-700">${item.params.renewal.subscription_renewal_price}</span>
                      <span className="text-xs text-green-500">/</span>
                      <span className="text-xs text-green-600 renewal_label_id">renewal</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* T-Bucks wallet (when plan selected and eligible) */}
            {selectedPlan === item.id &&
              AccountSubscriptionDetails.paidMembershipCount <= 0 &&
              item.subscription_range.subscription_range_days_count === 365
              ? TbucksWalletDetails(item)
              : null
            }

            {/* Action buttons */}
            {selectedPlan === item.id && (
              <div className="mt-3">
                {loadingRequest ? (
                  <div className="flex items-center gap-2 p-3">
                    <span className="text-blue-600 loading loading-spinner loading-sm"></span>
                    <span className="text-sm text-gray-500">Processing...</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => handleCheckout(item)}
                      className="flex items-center justify-center flex-1 gap-2 px-5 py-3 text-sm font-semibold text-white transition-all duration-150 shadow-md rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 shadow-blue-200"
                    >
                      <span className="subscribe_to_plan_label_id">Subscribe to plan</span>
                    </button>
                    {/* <button
                      onClick={() => handleCheckoutEbanx(item)}
                      className="flex items-center justify-center flex-1 gap-2 px-5 py-3 text-sm font-semibold text-white transition-all duration-150 shadow-md rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 active:scale-95 shadow-purple-200"
                    >
                      <span className="subscribe_to_plan_using_ebanx_label_id">Subscribe via Ebanx</span>
                    </button> */}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const MembershipStatus = () =>{
    return(
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
        {/* Header band */}
        <div className="w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>

        <div className="p-5 space-y-5 sm:p-6">
          <h3 className="text-xs text-base font-bold tracking-wide text-gray-500 text-gray-900 uppercase membership_status_label_id">
            Membership Status
          </h3>

          {loadingRequest ? (
            <SkeletonLoader />
          ) : (
            <div className="space-y-5">
              {/* Badge + plan name */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 shadow-lg rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-emerald-200">
                    <GoVerified className="w-8 h-8 text-white" />
                  </div>
                  <span className="absolute flex items-center justify-center w-5 h-5 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1">
                    <span className="block w-2 h-2 bg-white rounded-full"></span>
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-extrabold leading-tight text-gray-900">
                    {!loadingRequest &&
                      (selectedLanguage.current == null
                        ? AccountSubscriptionDetails.details.subscription_category.membership_type.type_title
                        : (
                            AccountSubscriptionDetails.details.subscription_category.membership_type.translation.translation
                            ? (
                                AccountSubscriptionDetails.details.subscription_category.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                ? AccountSubscriptionDetails.details.subscription_category.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_title
                                : AccountSubscriptionDetails.details.subscription_category.membership_type.type_title
                              )
                            : AccountSubscriptionDetails.details.subscription_category.membership_type.type_title
                          )
                      )
                    }
                  </h4>
                  <p className="text-sm text-gray-500">
                    {!loadingRequest &&
                      (selectedLanguage.current == null
                        ? AccountSubscriptionDetails.details.subscription_category.subscription_range.subscription_range_name
                        : (
                            AccountSubscriptionDetails.details.subscription_category.subscription_range.params
                            ? (
                                AccountSubscriptionDetails.details.subscription_category.subscription_range.params.translation
                                ? (
                                    AccountSubscriptionDetails.details.subscription_category.subscription_range.params.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                    ? AccountSubscriptionDetails.details.subscription_category.subscription_range.params.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).subscription_range_name
                                    : AccountSubscriptionDetails.details.subscription_category.subscription_range.subscription_range_name
                                  )
                                : AccountSubscriptionDetails.details.subscription_category.subscription_range.subscription_range_name
                              )
                            : AccountSubscriptionDetails.details.subscription_category.subscription_range.subscription_range_name
                          )
                      )
                    }
                  </p>
                </div>
              </div>

              {/* Progress & expiry */}
              {AccountSubscriptionDetails.paidMembershipCount > 0 && (
                <div className="p-4 space-y-3 border border-gray-100 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600 subscription_plan_expiration_label_id">Plan Expiration</span>
                    <span className="font-bold text-gray-900">
                      {!loadingRequest && AccountSubscriptionDetails.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-700 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${AccountSubscriptionDetails.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                    <span className="flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full ${AccountSubscriptionDetails.days_remaining < 0 ? 'bg-red-400' : 'bg-emerald-400'}`}
                      ></span>
                      <span className="font-semibold">{!loadingRequest && AccountSubscriptionDetails.days_remaining}</span>
                      {!loadingRequest && AccountSubscriptionDetails.days_remaining < 0
                        ? <span className="days_expired_label_id">days expired</span>
                        : <span className="days_left_before_expiry_label_id">days left before expiry</span>
                      }
                    </span>
                    <span className="text-gray-400">
                      {!loadingRequest && AccountSubscriptionDetails.details.subscription_category.membership_type.translation.membership.is_paid_account && (
                        <span>
                          <span className="expires_on_label_id">Expires </span>
                          <span className="font-medium text-gray-600">
                            {format(parseISO(AccountSubscriptionDetails.details.subscription_end), 'MMM d, yyyy')}
                          </span>
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Unsubscribe */}
          {!loadingRequest &&
            AccountSubscriptionDetails.details.subscription_category.membership_type.translation.membership.is_paid_account &&
            !AccountSubscriptionDetails.details.is_unsubscribe &&
            AccountSubscriptionDetails.details.params?.subscription && (
              <button
                onClick={() => ConfirmationModalAction()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 active:scale-95 transition-all duration-150"
              >
                <span>Unsubscribe</span>
              </button>
            )
          }
        </div>
      </div>
    )
  }

  const ConfirmationModal = () =>{
    return(
      <div>
        <dialog ref={modalSubscriptionRef} id="my_modal_2" className="modal">
          <div className="max-w-sm p-0 overflow-hidden modal-box rounded-2xl">
            {/* Top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 to-orange-400"></div>
            <div className="p-6 space-y-5">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex items-center justify-center w-16 h-16 border-2 border-yellow-200 rounded-2xl bg-yellow-50">
                  <img className="object-contain w-10 h-10" src={Logo2} alt="logo" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 are_you_sure_label_id">
                    Are you sure want to unsubscribe?
                  </h2>
                  <div className="px-3 py-2 mt-2 border border-yellow-200 rounded-lg bg-yellow-50">
                    <p className="text-xs font-semibold text-yellow-700 warning_label_id">⚠ Warning</p>
                    <p className="text-xs text-yellow-600 mt-0.5 warning_note_label_id">
                      By unsubscribing, your plan won't renew automatically.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => UnsubscribeToStripe()}
                  className="flex-1 proceed_label_id px-4 py-2.5 text-sm font-semibold text-white bg-[#031956] rounded-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  Proceed
                </button>
                <button
                  onClick={() => modalSubscriptionRef.current?.close()}
                  className="flex-1 cancel_label_id px-4 py-2.5 text-sm font-semibold text-white bg-[#df5555] rounded-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  Cancel
                </button>
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
    <div className="max-w-5xl px-4 py-6 pb-16 mx-auto sm:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Membership Status */}
        <div className="w-full">
          {MembershipStatus()}
        </div>

        {/* Right: Plans */}
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#001d3d] capitalize membership_plans_label_id">
              Membership Plans
            </h2>
            {loadingContent && (
              <span className="text-blue-500 loading loading-dots loading-sm"></span>
            )}
          </div>

          {loadingContent
            ? <SkeletonLoader />
            : _PlanSelect(subscriptionList)
          }
        </div>
      </div>

      {openBottomPayment &&
        <Checkout
          isEbanx={getclientEbanxSecret ? true : false}
          clientSecret={getclientEbanxSecret ? getclientEbanxSecret : getclientSecret}
          getLoading={loadingRequest}
          dataContent={paymentBContent.current}
          handleClose={() => CloseBottomPayment()}
        />
      }

      <ToastContainer position="bottom-right" />
      {ConfirmationModal()}
    </div>
  )
}

export default AccountSubscription