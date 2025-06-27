import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import { Upload, User, X } from 'lucide-react';

import { CiUser } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { CiPhone } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import { FiAward } from "react-icons/fi";
import { IoIosTrendingUp } from "react-icons/io";
import { MapPin, Briefcase, Heart, Camera, Video, Globe, Plus, Edit2, Save, Trash2, Menu } from 'lucide-react';

import * as api_account from '../../services/account/account.api.js'

const env = import.meta.env;

const AccountCredentials = () =>{

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const auth_states = useSelector(state => state.AuthReducer);
  const [requestLoading, setRequestLoading] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);

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

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const GetUserDetails = async() =>{
    setRequestLoading(true)
    await api_account.GetUserDetails(auth_states.StateToken).then((result) =>{
      if(result.status){
        Object.keys(result.data.data).map((item, key) =>{
          setUserData((prev) => ({
            ...prev,
            [item]: result.data.data[item]
          }));
        })

        if(result.data.data.params){
          Object.keys(result.data.data.params).map((item, key) =>{
            setUserData((prev) => ({
              ...prev,
              [item]: result.data.data.params[item]
            }));
          })
        }
        
        if(result.data.data.user_profile){
          setCurrentPhoto(env.VITE_APP_BACKEND_STORAGE_URL + result.data.data.user_profile.upload_url);
        }
      }
      setRequestLoading(false)
    }).catch((err) =>{
      setRequestLoading(false)
    })
  }

  const UpdateUserInformation = async () => {
    const reqBody = {
      pin: userData.pin || undefined,
      password: userData.password || undefined,
    };

    setRequestLoading(true);

    try {
      const result = await api_account.UpdateUserInformation(auth_states.StateToken, reqBody);
      if (result.status) {
        toast.success("User information updated!");
        GetUserDetails(); // Refresh after update
        setIsEditing(false);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setRequestLoading(false);
    }
  }
  
  useEffect(() => {
    GetUserDetails()
  },[])

  const ProfileInfo = () =>{ 
    return(
       <div className="pb-10 space-y-6 lg:col-span-2">
        {/* Pin & Password */}
        <div className="p-6 space-y-3 bg-white border border-gray-200 rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Pin and Password</h3>
          {isEditing && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">PIN</label>
                <input
                  type="number"
                  value={userData.pin}
                  onChange={(e) => handleInputChange("pin", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={userData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
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
            <div className="mb-6 sm:mb-8">
              <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">Setup Credentials</h1>
              <p className="text-sm text-gray-600 sm:text-base">Manage your credentials</p>
            </div>
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
              <button
                onClick={() => {
                  if(isEditing){
                    UpdateUserInformation();
                  }
                  setIsEditing(!isEditing);
                }}
                className={`flex items-center space-x-2 py-2 rounded-lg ${
                  isEditing
                    ? ' text-black '
                    : ' text-black '
                }`}
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                <span>{isEditing ? 'Save' : 'Edit'}</span>
              </button>
            </div>
            {ProfileInfo()}
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

export default AccountCredentials
