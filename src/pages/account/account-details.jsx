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

import { MapPin, Briefcase, Heart, Camera, Video, Globe, Plus, Edit2, Save, Trash2, Menu } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import * as api_account from '../../services/account/account.api.js'
import * as api_subscription from '../../services/account/subscription.api.js'

const env = import.meta.env;

const AccountDetails = () =>{

  const auth_states = useSelector(state => state.AuthReducer);
  const [requestLoading, setRequestLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [toRemovePhoto, settoRemovePhoto] = useState([]);
  const [AccountSubscriptionDetails, SetAccountSubscriptionDetails] = useState([])

  // User plan for photo limits
  const [userPlan, setUserPlan] = useState(null); // 'PCA' or 'VIP'
  const photoLimit = userPlan === 'vip' ? 100 : 10;
  
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
    },
    // Extended profile data
    personal_introduction: "",
    occupation: "",
    company: "",
    business_description: "",
    hobbies: [],
    bucket_list: [
      // { destination: "Tokyo, Japan", description: "Experience the blend of traditional and modern culture" },
      // { destination: "Machu Picchu, Peru", description: "Explore ancient Incan ruins" },
      // { destination: "Northern Lights, Iceland", description: "Witness the aurora borealis" }
    ],
    social_media: {
      // facebook: "https://facebook.com/johndoe",
      // instagram: "https://instagram.com/johndoe",
      // twitter: "https://twitter.com/johndoe",
      // youtube: "https://youtube.com/@johndoe",
      // tiktok: "https://tiktok.com/@johndoe",
      // wechat: "johndoe123"
    },
    user_uploads_table: [],
    youtube_videos: []
  })

  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [firstName, setFirstName] = useState(''); // Optional: load from props or auth
  const [isDragging, setIsDragging] = useState(false);
  const [newHobby, setNewHobby] = useState('');
  const [newDestination, setNewDestination] = useState({ destination: '', description: '' });
  const [newYoutubeVideo, setNewYoutubeVideo] = useState('');
  const [multipleUploads, setmultipleUploads] = useState(null);

  const fileInputRef = useRef(null);

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'interests', label: 'Interests', icon: Heart },
    { id: 'media', label: 'Media', icon: Camera },
    { id: 'professional', label: 'Professional', icon: Briefcase }
  ];

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

  const UploadContentPhotos = async() =>{
    try {

      const requestBody = {
        file:  multipleUploads,
      }

      const result = await api_account.ProfileMultipleDownload(auth_states.StateToken, requestBody);
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
      city: userData.city,
      params: {
        personal_introduction: userData.personal_introduction,
        occupation: userData.occupation,
        company: userData.company,
        business_description: userData.business_description,
        hobbies: userData.hobbies,
        bucket_list: userData.bucket_list,
        social_media: userData.social_media,
        photos: multipleUploads,
        youtube_videos: userData.youtube_videos
      },
      remove_photos: toRemovePhoto
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

  const GetUserAccountSubscriptionDetails = async () =>{
    await api_subscription.GetUserAccountSubscriptionDetails(auth_states.StateToken).then((result) =>{
      SetAccountSubscriptionDetails(result.data.data)

      if(result.data.status){
        let membership = result.data.data.details.subscription_category.membership_type.type_title
        setUserPlan(membership.toString().toLowerCase())
      }

    }).catch((err) =>{
      toast.error("Something went wrong");
    })
  }
  
  useEffect(() => {
    GetUserDetails()
    GetUserAccountSubscriptionDetails()
  },[])

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
      </div>
    )
  }
  
  const _AccountDetails = () =>{
    return (
      <div>
        <div className="p-3 ">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">Profile Management</h1>
            <p className="text-sm text-gray-600 sm:text-base">Manage your comprehensive personal profile</p>
          </div>

          {/* Mobile Menu Button */}
          <div className="mb-4 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center px-4 py-2 space-x-2 bg-white border border-gray-200 rounded-lg"
            >
              <Menu className="w-4 h-4" />
              <span className="text-sm font-medium">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </span>
            </button>
          </div>

           {/* Navigation Tabs */}
          <div className="mb-6 sm:mb-8">
            {/* Desktop Navigation */}
            <nav className="hidden space-x-8 border-b border-gray-200 lg:flex">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="py-2 mt-2 bg-white border border-gray-200 rounded-lg lg:hidden">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-4 py-2 text-left ${
                      activeTab === id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                {activeTab === 'basic' && 'Basic Information'}
                {activeTab === 'social' && 'Social Media & Contact'}
                {activeTab === 'interests' && 'Interests & Bucket List'}
                {activeTab === 'media' && 'Photos & Videos'}
                {activeTab === 'professional' && 'Professional Information'}
              </h2>
              <button
                onClick={() => {
                  if(isEditing){
                    UpdateUserInformation();
                    UploadContentPhotos()
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
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* Profile Photo and Basic Info */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6">
                  <div className="self-center flex-shrink-0 sm:self-start">
                    {/* {currentPhoto ? (
                      <img src={currentPhoto} alt="Profile" className="object-cover w-20 h-20 border-4 border-white rounded-full shadow-lg sm:w-24 sm:h-24" />
                    ) : (
                      <div className="flex items-center justify-center w-20 h-20 text-xl font-bold text-white rounded-full sm:w-24 sm:h-24 bg-gradient-to-r from-blue-600 to-purple-600 sm:text-2xl">
                        {userData.first_name?.charAt(0)}
                      </div>
                    )} */}

                     {UploadPhoto()}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">{userData.first_name} {userData.last_name}</h3>
                    <p className="text-gray-600 break-all">{userData.email}</p>
                    {
                      userData.occupation &&
                      userData.company &&
                      <p className="mt-1 text-sm text-gray-500">{userData.occupation} at {userData.company}</p>
                    }
                  </div>
                </div>

                {/* Personal Introduction */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Personal Introduction</label>
                  {isEditing ? (
                    <textarea
                      value={userData.personal_introduction}
                      onChange={(e) => handleInputChange('personal_introduction', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="p-4 text-gray-900 rounded-lg bg-gray-50">{userData.personal_introduction}</p>
                  )}
                </div>

                {/* Basic Information Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{userData.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{userData.last_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Mobile Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={userData.mobile_number}
                        onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{userData.mobile_number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={userData.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{userData.date_of_birth}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userData.current_address}
                        onChange={(e) => handleInputChange('current_address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <MapPin className="flex-shrink-0 w-4 h-4 text-gray-500" />
                        <p className="text-gray-900">{userData.current_address}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{userData.city}</p>
                    )}
                  </div>
                </div>

                {/* Google Maps Integration */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Location Map</label>
                  <div className="flex items-center justify-center w-full h-48 bg-gray-200 rounded-lg sm:h-64">
                    <div className="text-center">
                      <MapPin className="w-6 h-6 mx-auto mb-2 text-gray-400 sm:w-8 sm:h-8" />
                      <p className="text-sm text-gray-500 sm:text-base">Google Maps will display here</p>
                      <p className="text-xs text-gray-400 sm:text-sm">coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          

          {activeTab === 'social' && SocialMediaSection()}
          
          {activeTab === 'interests' && (
            <div className="space-y-8">
              {HobbiesSection()}
              {BucketListSection()}
            </div>
          )}
          
          {activeTab === 'media' && (
            <div className="space-y-8">
              {PhotoUpload()}
              {YouTubeSection()}
            </div>
          )}

          {activeTab === 'professional' && (
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Occupation</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Briefcase className="flex-shrink-0 w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{userData.occupation}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Company</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{userData.company}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Business Description</label>
                {isEditing ? (
                  <textarea
                    value={userData.business_description}
                    onChange={(e) => handleInputChange('business_description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your business or company..."
                  />
                ) : (
                  <p className="p-4 text-gray-900 rounded-lg bg-gray-50">{userData.business_description}</p>
                )}
              </div>
            </div>
          )}

          </div>

          {/* Main Content */}
          <div className="flex-1">
            <p className="mb-4 text-sm text-gray-500">
              Manage your personal information, including phone numbers and email address where you can be contacted
            </p>
            {/* {ProfileInfo()} */}
          </div>
        </div>
      </div>
    )
  }

   const handleSocialMediaChange = (platform, value) => {
    setUserData((prev) => ({
      ...prev,
      social_media: { ...prev.social_media, [platform]: value }
    }));
  };

  const addHobby = () => {
    if (newHobby.trim()) {
      setUserData((prev) => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby.trim()]
      }));
      setNewHobby('');
    }
  };

  const removeHobby = (index) => {
    setUserData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index)
    }));
  };

  const addBucketListItem = () => {
    if (newDestination.destination.trim()) {
      setUserData((prev) => ({
        ...prev,
        bucket_list: [...prev.bucket_list, newDestination]
      }));
      setNewDestination({ destination: '', description: '' });
    }
  };

  const removeBucketListItem = (index) => {
    setUserData((prev) => ({
      ...prev,
      bucket_list: prev.bucket_list.filter((_, i) => i !== index)
    }));
  };

  const addYoutubeVideo = () => {
    if (newYoutubeVideo.trim()) {
      setUserData((prev) => ({
        ...prev,
        youtube_videos: [...prev.youtube_videos, newYoutubeVideo.trim()]
      }));
      setNewYoutubeVideo('');
    }
  };

  const removeYoutubeVideo = (index) => {
    setUserData((prev) => ({
      ...prev,
      youtube_videos: prev.youtube_videos.filter((_, i) => i !== index)
    }));
  };

  const extractYoutubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const PhotoUpload = () => {
    const handleFileSelect = (files) => {
      if (userData.user_uploads_table.length + files.length > photoLimit) {
        toast.error(`Photo limit exceeded. ${userPlan} users can upload up to ${photoLimit} photos.`);
        return;
      }

      setmultipleUploads(files)

      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setUserData(prev => ({
                ...prev,
                user_uploads_table: [...prev.user_uploads_table, { upload_url: e.target.result }]
              }));
            }
          };
          reader.readAsDataURL(file);
        }
      });
      
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files);
      }
    };

    const removePhoto = (index) => {
      setUserData(prev => ({
        ...prev,
        user_uploads_table: prev.user_uploads_table.filter((_, i) => i !== index)
      }));

      settoRemovePhoto(prev => [
        ...prev, 
        userData.user_uploads_table.find((_, i) => i === index)
      ])
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="font-medium text-gray-900">Photo Gallery</h4>
          <span className="text-sm text-gray-500">
            {/* {userData.user_uploads_table.length}/{photoLimit} photos ({userPlan} Plan) */}
          </span>
        </div>

        {isEditing && (
          <div
            className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors cursor-pointer ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              className="hidden"
            />
            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400 sm:w-8 sm:h-8" />
            <p className="text-sm text-gray-600">Drop photos here or click to upload</p>
            <p className="text-xs text-gray-400">PNG, JPG up to 5MB each</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-4">

          {
          userData.user_uploads_table.map((photo, index) => (
            <div key={index} className="relative border rounded-md shadow-lg group">
              <div className=''>
                <img
                  src={ isEditing ? photo.upload_url : env.VITE_APP_BACKEND_STORAGE_URL + photo.upload_url}
                  // alt={photo.name}
                  className="object-cover w-full rounded-lg "
                />
              </div>
              {isEditing && (
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 -top-2 -right-2 group-hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SocialMediaSection = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Social Media Links</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            <Facebook className="inline w-4 h-4 mr-1" /> Facebook
          </label>
          {isEditing ? (
            <input
              type="url"
              value={userData.social_media.facebook}
              onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://facebook.com/username"
            />
          ) : (
            <a href={userData.social_media.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all hover:underline">
              {userData.social_media.facebook}
            </a>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            <Instagram className="inline w-4 h-4 mr-1" /> Instagram
          </label>
          {isEditing ? (
            <input
              type="url"
              value={userData.social_media.instagram}
              onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://instagram.com/username"
            />
          ) : (
            <a href={userData.social_media.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all hover:underline">
              {userData.social_media.instagram}
            </a>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            <Twitter className="inline w-4 h-4 mr-1" /> Twitter
          </label>
          {isEditing ? (
            <input
              type="url"
              value={userData.social_media.twitter}
              onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://twitter.com/username"
            />
          ) : (
            <a href={userData.social_media.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all hover:underline">
              {userData.social_media.twitter}
            </a>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            <Youtube className="inline w-4 h-4 mr-1" /> YouTube
          </label>
          {isEditing ? (
            <input
              type="url"
              value={userData.social_media.youtube}
              onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://youtube.com/@username"
            />
          ) : (
            <a href={userData.social_media.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all hover:underline">
              {userData.social_media.youtube}
            </a>
          )}
        </div>
      </div>
    </div>
  );

  const HobbiesSection = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Hobbies & Interests</h4>
      <div className="flex flex-wrap gap-2">
        {userData.hobbies.map((hobby, index) => (
          <span key={index} className="inline-flex items-center px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
            <Heart className="w-3 h-3 mr-1" />
            {hobby}
            {isEditing && (
              <button onClick={() => removeHobby(index)} className="ml-2 text-red-500 hover:text-red-700">
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
      </div>
      {isEditing && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            placeholder="Add a new hobby"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && addHobby()}
          />
          <button onClick={addHobby} className="flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  const BucketListSection = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Bucket List Destinations</h4>
      <div className="space-y-3">
        {userData.bucket_list.map((item, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h5 className="flex items-center font-medium text-gray-900">
                  <Globe className="flex-shrink-0 w-4 h-4 mr-2" />
                  {item.destination}
                </h5>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </div>
              {isEditing && (
                <button onClick={() => removeBucketListItem(index)} className="self-start text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {isEditing && (
        <div className="space-y-2">
          <input
            type="text"
            value={newDestination.destination}
            onChange={(e) => setNewDestination(prev => ({ ...prev, destination: e.target.value }))}
            placeholder="Destination name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={newDestination.description}
            onChange={(e) => setNewDestination(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Why do you want to visit this place?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <button onClick={addBucketListItem} className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Add Destination
          </button>
        </div>
      )}
    </div>
  );

  const YouTubeSection = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">YouTube Videos</h4>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {userData.youtube_videos.map((video, index) => {
          const videoId = extractYoutubeId(video);
          return (
            <div key={index} className="relative">
              {videoId ? (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`YouTube video ${index + 1}`}
                    className="w-full h-full rounded-lg"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="flex items-center justify-center bg-gray-200 rounded-lg aspect-video">
                  <p className="text-gray-500">Invalid YouTube URL</p>
                </div>
              )}
              {isEditing && (
                <button
                  onClick={() => removeYoutubeVideo(index)}
                  className="absolute p-1 text-white bg-red-500 rounded-full -top-2 -right-2"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      {isEditing && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            value={newYoutubeVideo}
            onChange={(e) => setNewYoutubeVideo(e.target.value)}
            placeholder="YouTube video URL"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={addYoutubeVideo} className="flex items-center justify-center px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
            <Video className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
  
  return (
    <div>
      <ToastContainer />
      {_AccountDetails()}
    </div>  
  ) 
}

export default AccountDetails
