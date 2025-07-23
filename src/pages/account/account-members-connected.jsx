import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import { Check, X } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';

import * as api_account from '../../services/account/account.api.js'

const env = import.meta.env;

const DistributionList = () =>{

  const auth_states = useSelector(state => state.AuthReducer);
  const [requestLoading, setRequestLoading] = useState(false);
  
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
    path:null,
    to:0,
    data:[]
  })

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
  },[auth_states, getPaginationButtonNextPrev, paginate, requestLoading])

  const getNetworkDetails = async() =>{
    setRequestLoading(true)
    await api_account.getNetworkDetails(auth_states.StateToken, paginate).then((result) =>{
      if(result.status){
        // setData(result.data.data)
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

  useEffect(() => {
    getNetworkDetails()
  },[paginate])

  const ProfileCard = () =>{
    return (
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th className='name_label_id'>Name</th>
              <th className='account_number_label_id'>Account Number</th>
              <th className='membership_label_id'>Membership</th>
            </tr>
          </thead>
          <tbody>
            {
              getPaginationButtonNextPrev.data.map((member, key) => (
              <tr>
                <th>{member.account.users_table.first_name}</th>
                <td>{member.account.account_number}</td>
                <td>
                  {
                      member.account.subscription__sales__transactions_one 
                    ? member.account.subscription__sales__transactions_one.subscription_category.membership_type.type_title
                    : 'No Membership'
                  }
                </td>
              </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    )
  }

  const MyNetwork = () =>{
    return(
      <div className="p-4 bg-white rounded-lg sm:p-6">
        <div className="space-y-3">
          <div>
            {ProfileCard()}
          </div>
        </div>

        <div  className="flex items-center justify-center">
          {
            requestLoading &&
            <span className="loading loading-dots loading-md"></span>
          }
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setPaginate(getPaginationButtonNextPrev.prev_page_url)}
            disabled={getPaginationButtonNextPrev.current_page === 1}
            className="px-4 py-2 font-medium text-gray-700 transition-colors duration-200 bg-white rounded-lg previous_label_id hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center justify-center space-x-2">
            {Array.from({ length: getPaginationButtonNextPrev.last_page }, (_, i) => i + 1).map((page) =>  (
              <button
                key={page}
                onClick={() => setPaginate(getPaginationButtonNextPrev.path + "?page=" + page)}
                className={`w-8 h-8 rounded-lg font-medium transition-colors duration-200 ${
                  page === getPaginationButtonNextPrev.current_page
                    ? 'bg-white text-gray-900'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPaginate(getPaginationButtonNextPrev.next_page_url)}
            disabled={getPaginationButtonNextPrev.current_page === getPaginationButtonNextPrev.last_page}
            className="px-4 py-2 font-medium text-gray-700 transition-colors duration-200 bg-white rounded-lg next_label_id hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  const _AccountDetails = () =>{
    return (
      <div>
        <div className="p-3 ">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-2">
              <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl connections_label_id">Connections</h1>
              <p className="text-sm text-gray-600 sm:text-base my_sponsored_members_label_id">my sponsored members</p>
            </div>
            {
              requestLoading
              ? 
                <div className='flex justify-center'>
                  <span className="loading loading-dots loading-md"></span>
                </div>
              : MyNetwork()
            }
            
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <ToastContainer />
      {_AccountDetails()}
    </div>  
  ) 
}

export default DistributionList
