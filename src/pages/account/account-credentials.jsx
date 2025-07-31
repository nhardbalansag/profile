import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';

import { Edit2, Save} from 'lucide-react';

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

  const [getRetypePassword, setRetypePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
  },[auth_states, isEditing, requestLoading, showPassword])

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

  const UpdatePassword = async () => {

    if(getRetypePassword !== userData.password){
      toast.warning("Password Not Match");
      return;
    }

    const reqBody = {
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
          <h3 className="mb-4 text-lg font-semibold text-gray-900 pin_uppercase_label_id">PIN</h3>
          {isEditing && (
            <div className='space-y-5'>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 pin_uppercase_label_id">PIN</label>
                  <input
                    type="number"
                    value={userData.pin}
                    onChange={(e) => handleInputChange("pin", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
               {
                requestLoading
                ?
                  <span className="text-blue-500 loading loading-spinner loading-md"></span>
                :
                  <button 
                    onClick={() => UpdateUserInformation()}
                    className="px-6 py-2 font-bold text-white bg-blue-500 btn hover:bg-blue-600 rounded-xl">
                    <p className='update_pin_label_id'>Update Pin</p>
                  </button>
              }
            </div>
          )}
        </div>
      </div>
    )
  }

   const PasswordComponent = () =>{ 
    return(
       <div className="pb-10 space-y-6 lg:col-span-2">
        {/* Pin & Password */}
        <div className="p-6 space-y-3 bg-white border border-gray-200 rounded-lg shadow-md">
          <div className='space-y-2'>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 password_label_id">Password</h3>
            {
              isEditing &&
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-blue-600 focus:outline-none"
              >
                {showPassword ? <span className='hide_label_id'>Hide</span> : <span className='show_label_id'>Show</span>}
              </button>
            }
          </div>
          {isEditing && (
            <div className='space-y-5'>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 password_label_id">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={userData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 confirm_password_label_id">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={getRetypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {
                requestLoading
                ?
                  <span className="text-blue-500 loading loading-spinner loading-md"></span>
                :
                  <button 
                    onClick={() => UpdatePassword()}
                    className="px-6 py-2 font-bold text-white bg-blue-500 btn hover:bg-blue-600 rounded-xl">
                    <p className='update_password_label_id'>Update Password</p>
                  </button>
              }
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
              <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl setup_credentials_label_id">Setup Credentials</h1>
              <p className="text-sm text-gray-600 sm:text-base manage_your_wallet_label_id">Manage your credentials</p>
            </div>
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
              <button
                onClick={() => {
                  // if(isEditing){
                  //   UpdateUserInformation();
                  // }
                  setIsEditing(!isEditing);
                }}
                className={`flex items-center space-x-2 py-2 rounded-lg ${
                  isEditing
                    ? ' text-black '
                    : ' text-black '
                }`}
              >
                {isEditing ? <></> : <Edit2 className="w-4 h-4" />}
                <p>{isEditing ? <span className="done_label_id">Done</span> : <span className='edit_label_id'>Edit</span>}</p>
              </button>
            </div>
            {ProfileInfo()}
            {PasswordComponent()}
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
