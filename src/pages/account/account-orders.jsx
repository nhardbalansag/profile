import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaLanguage, FaEnvelope } from 'react-icons/fa';
import { FaBox, FaHeart } from "react-icons/fa";
import { format } from 'date-fns';
import { FaTruck, FaPlug, FaCogs, FaGasPump } from "react-icons/fa";
import { RiReceiptLine } from "react-icons/ri";

import * as api_orders from '../../services/account/orders.api.js'

const AccountOrders = () =>{

  const auth_states = useSelector(state => state.AuthReducer);

  const [selectedTab, setSelectedTab] = useState("All Orders");
  const [loadingContent, setLoadingContent] = useState(true);
  const [getPaginatedOrdersData, setPaginatedOrdersData] = useState([]);

  const getPaginatedOrders = async() =>{
    setLoadingContent(true)
    await api_orders.getPaginatedOrders(auth_states.StateToken).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        setPaginatedOrdersData(result.data.data)

        console.log(result.data.data)
      }
    }).catch((err) =>{
      console.log("getPaginatedOrders", err)
    })
  }

  const _EmptyDataComp = () =>{
    return(
      <div>
         {/* Empty State */}
         <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg shadow-sm bg-gray-50">
            {/* Placeholder icon instead of an illustration */}
            <FaBox className="mb-4 text-5xl text-blue-500" />
            <h2 className="mb-2 text-xl font-semibold">No Orders Placed Yet</h2>
            <p className="mb-4 text-gray-500">
              Don’t wait, & let’s make your first purchase now.
            </p>
            {/* <button className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
              Continue Browsing
            </button> */}
          </div>
      </div>
    )
  }

  const _LoadingComp = () =>{
    return(
      <main className="grid min-h-full px-6 py-24 bg-white place-items-center sm:py-32 lg:px-8">
        <div className="text-center">
          <span className="loading loading-ring loading-xl"></span>
          <p className="mt-6 text-base leading-7 text-gray-600 payment_form_loading_id">Loading orders, please wait...</p>
        </div>
      </main>
    )
  }

  const OrdersPage = () => {
  
    const tabs = [
      "All Orders",
      // "Pending",
      // "Confirmed",
      // "On It's Way",
      // "Delivered",
      // "Cancelled",
    ];
  
    return (
      <div className="min-h-screen p-6 text-gray-800 bg-white">
        {/* Page Title */}
        <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
  
        {/* Layout Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Sidebar */}
          <div className="space-y-4">
            <button className="flex items-center gap-2 font-medium text-blue-600">
              <FaBox /> Your Orders
            </button>
          </div>
  
          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedTab === tab
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className='space-y-3'>
              {
                loadingContent
                ? <_LoadingComp/>
                :
                  (
                    getPaginatedOrdersData.total <= 0
                    ? 
                      <_EmptyDataComp/>
                    : 
                      getPaginatedOrdersData.data.map((item, key) =>(
                        <OrderSummaryCard content_data={item}/>
                      ))
                  )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  const OrderSummaryCard = ({content_data}) => {
    const products = [
      {
        icon: <RiReceiptLine  className="text-2xl text-purple-600" />,
        name: "HD11 ADAPTER CABLE 655861690",
        price: "SAR 2000",
        qty: "2 items",
      },
    ]
  
    return (
      <div className="p-6 space-y-4 text-sm bg-white border rounded-lg shadow-md">
        {/* Order Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">
              Order ID: <span className="text-blue-500">{content_data.params.details.orderId}</span>{" "}
              {/* <span className="text-green-600 uppercase">{content_data.params.payment_status.payment_status}</span> */}
            </p>
            <p className="text-xs text-gray-500">
              {format(new Date(content_data.created_at), 'MMMM dd, yyyy HH:mm:ss a')}
            </p>
          </div>
          <div className="text-right uppercase">
            <p className="text-lg font-bold">{content_data.params.payment_status.currency} {content_data.params.payment_status.amount_total}</p>
            <p className="text-xs text-gray-500">Total Items</p>
          </div>
        </div>
  
        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="py-2">Product</th>
                <th className="py-2">Unit Price</th>
                <th className="py-2">Qty</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {products.map((product, idx) => (
                <tr key={idx} className="border-b">
                  <td className="flex items-center gap-2 py-4 font-medium">
                  {content_data.params.details.product_data_name}
                  </td>
                  <td>{content_data.baseAmount}</td>
                  <td>{content_data.guest_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  
  const _AccountDetails = () =>{
    return (
      <div className="flex-1">
        <OrdersPage/>
      </div>
    )
  }

  useEffect(() => {
    getPaginatedOrders()
  },[])

  return (
    <div>
      <_AccountDetails/>
    </div>  
  ) 
}

export default AccountOrders
