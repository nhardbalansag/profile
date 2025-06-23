import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';
import { Upload, User, X } from 'lucide-react';

import { CiUser } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { CiPhone } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import { FiAward } from "react-icons/fi";
import { IoIosTrendingUp } from "react-icons/io";

import * as api_account from '../../services/account/account.api.js'

const env = import.meta.env;

const AccountDetails = () =>{

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
      user_id: userData.id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      mobile_number: userData.mobile_number,
      current_address: userData.current_address,
      email: userData.email,
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


  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [firstName, setFirstName] = useState(''); // Optional: load from props or auth
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // Load profile photo from localStorage on component mount
  // useEffect(() => {
  //   const savedPhoto = localStorage.getItem('profilePhoto');
  //   if (savedPhoto) {
  //     setCurrentPhoto(savedPhoto);
  //   }
  // }, []);

  const UploadPhoto = () =>{

    const handleFileSelect = (file) => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          handlePhotoChange(result);
          // Save to localStorage for persistence
          localStorage.setItem('profilePhoto', result);
        };
        reader.readAsDataURL(file);
        UploadFile(file)
      }
    };

    const UploadFile = async(file) =>{
      const requestBody = {
        file:  file,
      }

      await api_account.UploadFile(requestBody, auth_states.StateToken).then((result) =>{

      }).catch((err) =>{
        toast.error("Something went wrong");
      })
    }

    const handlePhotoChange = async(photoUrl) => {
      setCurrentPhoto(photoUrl)
    }

    const handleDragOver = (e) => {
      e.preventDefault()
      setIsDragging(true)
    }

    const handleDragLeave = (e) => {
      e.preventDefault()
      setIsDragging(false)
    }

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0])
      }
    }

    const handleFileInput = (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0])
      }
    }

    const handleRemovePhoto = () => {
      onPhotoChange(null);
      localStorage.removeItem('profilePhoto');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const openFileDialog = (event) => {
      fileInputRef.current?.click();
    };

    if (!isEditing && !currentPhoto) {
      // Display default avatar when not editing and no photo
      return (
        <div className="flex items-center justify-center w-[80px] h-[80px] text-2xl font-bold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
          {firstName?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
        </div>
      );
    }

    if (!isEditing && currentPhoto) {
      // Display current photo when not editing
      return (
        <div className="relative w-[80px] h-[80px] rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src={currentPhoto}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
      );
    }

    return(
      <div className="flex flex-col items-center space-y-4">
        {/* Current Photo Display */}
        <div className="relative">
          {currentPhoto ? (
            <div className="relative w-[80px] h-[80px] rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={currentPhoto}
                alt="Profile"
                className="object-cover w-full h-full"
              />
              <button
                onClick={handleRemovePhoto}
                className="absolute p-1 text-white transition-colors bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-[80px] h-[80px] text-2xl font-bold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
              {firstName?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
          onDragOver={() => handleDragOver()}
          onDragLeave={() =>handleDragLeave()}
          onDrop={() =>handleDrop()}
          onClick={() =>openFileDialog()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="mb-1 text-sm text-gray-600">
            Drop photo here or click to upload
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG up to 5MB
          </p>
        </div>

        <button
          type="button"
          variant="outline"
          onClick={() =>openFileDialog()}
          className=" btn btn-outline"
        >
          Choose Photo
        </button>
      </div>
    )
  }
  
  const ProfileInfo = () =>{ 
    return(
       <div className="pb-10 space-y-6 lg:col-span-2">
        {/* Basic Info */}
        <div className="p-6 space-y-3 bg-white border border-gray-200 rounded-lg shadow-md">
          <div className="flex items-start justify-between">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h3>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="grid items-center grid-cols-1 gap-5 mb-6 md:grid-cols-2">
            {UploadPhoto()}
            {/* <div className="flex items-center justify-center w-[50px] h-[50px] text-2xl font-bold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
              {userData.first_name?.charAt(0)}
            </div> */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {userData.first_name} {userData.last_name}
              </h2>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* First Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <CiUser className="w-4 h-4 text-gray-500" />
                  <span>{userData.first_name}</span>
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <CiUser className="w-4 h-4 text-gray-500" />
                  <span>{userData.last_name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <div className="flex items-center space-x-2 text-gray-900">
                <CiMail className="w-4 h-4 text-gray-500" />
                <span>{userData.email}</span>
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Mobile</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={userData.mobile_number}
                  onChange={(e) => handleInputChange("mobile_number", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <CiPhone className="w-4 h-4 text-gray-500" />
                  <span>{userData.mobile_number}</span>
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.current_address}
                  onChange={(e) => handleInputChange("current_address", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <FiMapPin className="w-4 h-4 text-gray-500" />
                  <span>{userData.current_address}</span>
                </div>
              )}
            </div>
          </div>
          {
            isEditing &&(
              <button disabled={requestLoading} onClick={() => UpdateUserInformation()} className="w-[200px] py-3 mt-6 text-white bg-blue-600 rounded-xl">
              {
                requestLoading
                ? <div className='flex items-center justify-center space-x-2'> <span>Please Wait</span><span className="loading loading-dots loading-lg"></span></div>
                : "Update Information"
              }
              </button>
            )
          }
          
        </div>

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

          {
            isEditing &&(
              <button  disabled={requestLoading}  onClick={() => UpdateUserInformation()} className="w-[200px] py-3 mt-6 text-white bg-blue-600 rounded-xl">
                {
                  requestLoading
                  ? <div className='flex items-center justify-center space-x-2'> <span>Please Wait</span><span className="loading loading-dots loading-lg"></span></div>
                  : "Update Credentials"
                }
              </button>
            )
          }
          
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
            <p className="mb-4 text-sm text-gray-500">
              Manage your personal information, including phone numbers and email address where you can be contacted
            </p>
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

export default AccountDetails
