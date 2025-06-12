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

  const getPaginatedOrders = async() =>{
    setLoadingContent(true)
    await api_orders.getPaginatedOrders(auth_states.StateToken, paginate).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        setPaginatedOrdersData(result.data.data)
        Object.keys(result.data.data).map((item, key) =>{
          setPaginationButtonNextPrev((prev) => ({
            ...prev,
            [item]: result.data.data[item]
          }));
        })
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

  const _Buttons = ({title, icon, hasBG=true, onPressAction}) =>{
    return(
      <button onClick={onPressAction} className={`${hasBG ? 'bg-white btn border shadow-sm rounded-xl' : "flex flex-col items-center justify-center h-[130px] bg-transparent"} `}>
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

  const OrdersPage = () => {
  
    const tabs = [
      "All Orders",
      "Pending",
      // "Confirmed",
      // "On It's Way",
      // "Delivered",
      // "Cancelled",
    ];
  
    return (
      <div className="min-h-screen p-2 text-gray-800 bg-white">
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
          <div className="md:col-span-3 space-y-5">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
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
                      getPaginationButtonNextPrev.data.map((item, key) =>(
                        <OrderSummaryCard content_data={item}/>
                      ))
                  )
              }
            </div>
            <div className="pb-16 space-x-3">
              <_Buttons onPressAction={() => setPaginate(getPaginationButtonNextPrev.prev_page_url)} title={'Previous'}/>
              <_Buttons onPressAction={() => setPaginate(getPaginationButtonNextPrev.next_page_url)} title={'Next'}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const OrderSummaryCard = ({content_data}) => {
    return (
      <div className="p-6 space-y-4 text-sm bg-white border rounded-lg shadow-md">
        {/* Order Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">
              {/* Order ID: <span className="text-blue-500">{content_data.params.reference}</span>{" "} */}
              <span className={`uppercase ${content_data.payment_status ? "text-green-600 " : "text-yellow-600 "} `} >{content_data.payment_status ? "paid" : "pending"}</span>
            </p>
            <p className="text-xs text-gray-500">
              {format(new Date(content_data.created_at), 'MMMM dd, yyyy HH:mm:ss a')}
            </p>
          </div>
          <div className="text-right uppercase">
            <p className="text-lg font-bold">{parseFloat(content_data.totalAmount).toFixed(2)  }</p>
            <p className="text-xs text-gray-500">Total Items</p>
          </div>
        </div>
  
        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="py-2"></th>
                <th className="py-2">T-Points</th>
                <th className="py-2">Price</th>
                <th className="py-2">Qty</th> 
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* {products.map((product, idx) => ( */}
                <tr className="border-b">
                  <td className="flex items-center py-4 font-medium w-[100px]">
                  {content_data.content_offer.content_table.content_title}
                  </td>
                  <td>{parseFloat(content_data.appliedTPoints).toFixed(2) }</td>
                  <td>{parseFloat(content_data.baseAmount).toFixed(2) }</td>
                  <td>{content_data.guest_count}</td>
                </tr>
              {/* ))} */}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  
  const _AccountDetails = () =>{
    return (
      <div className="flex-1 pb-10">
        <OrdersPage/>
      </div>
    )
  }

  useEffect(() =>{
    getPaginatedOrders()
  },[paginate])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight
      ) {
        console.log("Reached end of page scroll!");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <_AccountDetails/>
    </div>  
  ) 
}

export default AccountOrders
