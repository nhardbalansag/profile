import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaLanguage, FaEnvelope } from 'react-icons/fa';
import { FaBox, FaHeart } from "react-icons/fa";
import { format } from 'date-fns';
import { FaTruck, FaPlug, FaCogs, FaGasPump } from "react-icons/fa";
import { RiReceiptLine } from "react-icons/ri";
import { MdOutlineModeOfTravel } from "react-icons/md";
import { RiCoinsLine } from "react-icons/ri";
import { LuDollarSign } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa6";
import { FaRegCalendar } from "react-icons/fa";
const env = import.meta.env;

import * as api_orders from '../../services/account/orders.api.js'

const AccountOrders = () =>{

  const auth_states = useSelector(state => state.AuthReducer);

  const [selectedTab, setSelectedTab] = useState("All Orders");
  const [loadingContent, setLoadingContent] = useState(true);
  const [getPaginatedOrdersData, setPaginatedOrdersData] = useState([]);

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

  const [getAppendedOrders, setAppendedOrders] = useState([])

  const getPaginatedOrders = async() =>{
    setLoadingContent(true)
    await api_orders.getPaginatedOrders(auth_states.StateToken, paginate).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        Object.keys(result.data.data).map((item, key) =>{
          setPaginationButtonNextPrev((prev) => ({
            ...prev,
            [item]: result.data.data[item]
          }));
        })

        setAppendedOrders(prev => [...prev, ...result.data.data.data]);
        
      }
    }).catch((err) =>{
      console.log("getPaginatedOrders", err)
    })
  }

  const _LoadingComp = () =>{
    return(
      <main className="grid min-h-full px-6 py-24 place-items-center sm:py-32 lg:px-8">
        <div className="text-center">
          <span className="loading loading-ring loading-xl"></span>
          <p className="mt-6 text-base leading-7 text-gray-600 payment_form_loading_id">Loading orders, please wait...</p>
        </div>
      </main>
    )
  }

  const OrdersList = () =>{

    const getStatusColor = (status) => {
      switch (status) {
        case true:
          return 'bg-green-100 text-green-800 border-green-200';
        case false:
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const getStatusLabel = (status) => {
      switch (status) {
        case true:
          return 'Paid';
        case false:
          return 'Pending';
        default:
          return 'Refunded';
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price);
    };

    const RewardCard = ({ type, value, bgColor, textColor }) => (
      <div className={`${bgColor} rounded-lg p-3 border border-opacity-20 transition-all duration-200 hover:shadow-md`}>
        <div className="flex items-center space-x-2">
          <div>
            <p className={`text-lg font-bold ${textColor}`}>
              {type === 'points' ? value : `$${value}`}
            </p>
            <p className={`text-xs ${textColor} opacity-80`}>
              {type === 'points' ? 'T-Points' : type === 'bucks' ? 'T-Bucks' : 'T-Dollars'}
            </p>
          </div>
        </div>
      </div>
    )

    return(
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header Section */}
        <div className="bg-white border-b shadow-sm">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-gray-900">My Travel Orders</h1>
                <p className="text-gray-600">Manage and track your travel bookings</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    Total Orders: <span className="font-semibold text-gray-900">{getPaginatedOrdersData.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="px-4 py-8 mx-auto space-y-5 max-w-7xl sm:px-6 lg:px-8">
          {
            // loadingContent
            // ? <_LoadingComp/>
            // :
              (
                getPaginatedOrdersData.total <= 0
                ? 
                  <div className="py-12 text-center">
                    <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-gray-900">No orders found</h3>
                    <p className="text-gray-500">You haven't made any travel bookings yet.</p>
                  </div>
                : 
                  getAppendedOrders.map((item, key) =>(
                    <div
                      key={key}
                      className="overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl hover:border-gray-200"
                    >
                      <div className="p-6">
                        <div className="flex flex-col space-y-4">

                          {/* Image and Basic Info */}
                          <div className="flex space-x-4">
                            <div className="flex-shrink-0">
                              <img
                                src={
                                  item.content_offer.content_table.uploads_table_main_view.upload_type == "url"
                                  ? item.content_offer.content_table.uploads_table_main_view.upload_url 
                                  : env.VITE_APP_BACKEND_STORAGE_URL + item.content_offer.content_table.uploads_table_main_view.upload_url
                                }
                                alt={item.content_offer.content_table.content_title}
                                className="object-cover w-20 h-20 rounded-xl"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {item.content_offer.content_table.content_title}
                              </h3>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-gray-500">Qty: {item.guest_count}</span>
                                <span className={`
                                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border 
                                  ${getStatusColor(item.payment_status)}`
                                }>
                                  {getStatusLabel(item.payment_status)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Rewards Section for Mobile */}
                          <div className="p-4 border border-indigo-100 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="flex items-center text-sm font-semibold text-gray-800">
                                Wallet Applied
                              </h4>
                              <p className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full">
                                Save ${parseFloat((parseFloat(item.appliedTBucks) + parseFloat(item.appliedTDollars) + parseFloat(item.appliedTPoints))).toFixed(2)}
                              </p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <RewardCard
                                type="points"
                                value={parseFloat(item.appliedTPoints).toFixed(2)}
                                bgColor="bg-orange-100"
                                textColor="text-black"
                              />
                              <RewardCard
                                type="bucks"
                                value={parseFloat(item.appliedTBucks).toFixed(2)}
                                bgColor="bg-blue-100"
                                textColor="text-black"
                              />
                              <RewardCard
                                type="dollars"
                                value={parseFloat(item.appliedTDollars).toFixed(2)}
                                bgColor="bg-green-100"
                                textColor="text-black"
                              />
                            </div>
                          </div>

                          {/* Pricing */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Price:</span>
                              <span className="font-medium">{formatPrice(item.baseAmount)}</span>
                            </div>
                            <div className="flex items-center justify-between text-lg font-bold">
                              <span className="text-gray-900">Total:</span>
                              <span className="text-blue-600">{formatPrice(item.totalAmount)}</span>
                            </div>
                          </div>

                          {/* Reference and Date */}
                          <div className="flex flex-col pt-4 space-y-2 border-t border-gray-100">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Reference:</span>
                              <span className="font-mono text-gray-700">{`CT-${item.id}-${item.accounts_id}-${item.content_offers_id}-${item.offers_id}`}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Trip Date:</span>
                              <span className="text-gray-700">{formatDate(item.content_offer.content_table.content_date_from)}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div className="flex items-start gap-3 p-3 border border-blue-100 bg-blue-50 rounded-xl">
                                <FaRegClock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 duration_id">Duration</p>
                                  <p className="text-xs text-gray-600">
                                    {item.content_offer.content_table.content_days_count} 
                                    <span className="days_id">Days</span>, {
                                    item.content_offer.content_table.content_night_count} 
                                    <span className="days_id">Nights</span>
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500">
                                    {format(new Date(item.content_offer.content_table.content_date_from), 'MMM dd, yyyy')} 
                                    - 
                                    {format(new Date(item.content_offer.content_table.content_date_to), 'MMM dd, yyyy')}
                                  </p>
                                </div>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              )
          }
          {loadingContent &&<_LoadingComp/>}
        </div>
      </div>
    )
  }

  useEffect(() => {
      getPaginatedOrders(); // Call API only if next page exists
  }, [paginate]);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      // Only trigger if there is a next page
      if (isBottom && getPaginationButtonNextPrev.next_page_url) {
        console.log("Reached end of page scroll!");
        setPaginate(getPaginationButtonNextPrev.next_page_url);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [getPaginationButtonNextPrev]); // Re-run effect when next_page_url changes

  return (
    <div>
      {/* <_AccountDetails/> */}
      {OrdersList()}
    </div>  
  ) 
}

export default AccountOrders
