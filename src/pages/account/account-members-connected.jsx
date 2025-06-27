import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import { Check, X } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';

import * as api_account from '../../services/account/account.api.js'

const vipMembers = [
  {
    id: '1',
    code: '322',
    name: 'JAYA D/O LINGAM',
    country: 'SG',
    vipType: 'VIP',
    joinDate: '2024-06-30',
    rank: 11,
    isActive: false,
    hasAvatar: false
  },
  {
    id: '2',
    code: '148',
    name: 'CN001',
    country: 'CN',
    vipType: 'VIP',
    joinDate: '2024-06-14',
    rank: 10,
    isActive: true,
    hasAvatar: false
  },
  {
    id: '3',
    code: '137',
    name: 'NORA MARTINEZ',
    country: 'US',
    vipType: 'VIP',
    joinDate: '2024-06-12',
    rank: 8,
    isActive: false,
    hasAvatar: false
  },
  {
    id: '4',
    code: '110',
    name: 'FOO CHEE FOOK',
    country: 'SG',
    vipType: 'VIP',
    joinDate: '2024-06-04',
    rank: 8,
    isActive: true,
    hasAvatar: true
  },
  {
    id: '5',
    code: '102',
    name: 'JOEL GENERAL POH',
    country: 'SG',
    vipType: 'VIP',
    joinDate: '2024-06-03',
    rank: 8,
    isActive: false,
    hasAvatar: true
  },
  {
    id: '6',
    code: '95',
    name: 'LUCAS GOH',
    country: 'SG',
    vipType: 'VIP',
    joinDate: '2024-05-24',
    rank: 8,
    isActive: true,
    hasAvatar: false
  },
  {
    id: '7',
    code: '94',
    name: 'EUNICE LIM',
    country: 'SG',
    vipType: 'VIP',
    joinDate: '2024-05-23',
    rank: 8,
    isActive: true,
    hasAvatar: true
  },
  {
    id: '8',
    code: '90',
    name: 'TA CHOO YIN MAUREEN',
    country: 'SG',
    vipType: 'VIP',
    joinDate: '2024-05-23',
    rank: 8,
    isActive: true,
    hasAvatar: false
  },
  {
    id: '9',
    code: '88',
    name: 'INSPIRED ESCAPES',
    country: 'SG',
    vipType: 'VIP',
    joinDate: '2024-05-22',
    rank: 8,
    isActive: true,
    hasAvatar: false
  }
]

const env = import.meta.env;

const DistributionList = () =>{

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const auth_states = useSelector(state => state.AuthReducer);
  const [requestLoading, setRequestLoading] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [getConnections, setConnections] = useState(vipMembers);

  const [userData, setUserData] = useState({
    id: null,
    first_name: "",
    last_name: "",
    middle_name: "",
    nick_names: "",
    mobile_number: "",
    date_of_birth: "",
    gender: "",
    civil_status: "",
    nationality: "",
    current_address: "",
    city: "",
    postal_code: "",
    country_id: null,
    email: "",
    email_verified_at: null,
    users_is_deleted: false,
    users_is_active: true,
    pin: "",
    password: "",
    created_at: null,
    updated_at: null,
    user_profile:{
      upload_url:null
    }
  })

  const [paginate, setPaginate] = useState(null)
  
  const [loadingContent, setLoadingContent] = useState(true);
  const [getData, setData] = useState([]);

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

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const limitText = (text, limit = 30) =>{
    if(text){
        return text.length > limit ? text.slice(0, limit) : text;
    }
  }

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
              <th>Name</th>
              <th>Account Number</th>
              <th>Membership</th>
            </tr>
          </thead>
          <tbody>
            {
              getPaginationButtonNextPrev.data.map((member, key) => (
              <tr>
                <th>{member.account.users_table.first_name}</th>
                <td>{member.account.account_number}</td>
                <td>{member.account.subscription__sales__transactions_one.subscription_category.membership_type.type_title}</td>
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
            <ProfileCard />
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
            className="px-4 py-2 font-medium text-gray-700 transition-colors duration-200 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="px-4 py-2 font-medium text-gray-700 transition-colors duration-200 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">Connections</h1>
              <p className="text-sm text-gray-600 sm:text-base">my sponsored members</p>
            </div>
            {
              requestLoading
              ? 
                <div className='flex justify-center'>
                  <span className="loading loading-dots loading-md"></span>
                </div>
              : <MyNetwork/>
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
