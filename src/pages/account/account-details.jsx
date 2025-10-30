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
    {
      id: 'basic',
      label: <span className="basic_info_label_id">Basic Info</span>,
      icon: User
    },
    {
      id: 'social',
      label: <span className="social_media_label_id">Social Media</span>,
      icon: Globe
    },
    {
      id: 'interests',
      label: <span className="interests_label_id">Interests</span>,
      icon: Heart
    },
    {
      id: 'media',
      label: <span className="media_label_id">Media</span>,
      icon: Camera
    },
    {
      id: 'professional',
      label: <span className="professional_label_id">Professional</span>,
      icon: Briefcase
    }
  ]

  const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)  // null means main translation is used

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
  },[auth_states, requestLoading, activeTab, isEditing, isMobileMenuOpen])

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

  const ResendVerificationEmail = async() =>{
    setRequestLoading(true)
    await api_account.ResendVerificationEmail(auth_states.StateToken).then((result) =>{
      if(result.status){
        toast.success("Email Verification Sent.");
      }
      setRequestLoading(false)
    }).catch((err) =>{
      setRequestLoading(false)
      toast.error("Something went wrong");
    })
  }

  const UploadContentPhotos = async() =>{
    try {

      const requestBody = {
        file:  multipleUploads,
      }

      if(!multipleUploads){
        return;
      }

      const result = await api_account.ProfileMultipleDownload(auth_states.StateToken, requestBody);
      if (result.status) {
        toast.success("User information updated!");
        GetUserDetails(); // Refresh after update
        setIsEditing(false);

        setmultipleUploads(null)
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
      nick_names: userData.nick_names,
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
        // photos: multipleUploads,
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

      settoRemovePhoto([])
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
          {userData.first_name?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
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
              {userData.first_name?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
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

  const _AccountDetails = () =>{
    return (
      <div>
        <div className="p-3 ">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl profile_management_label_id">Profile Management</h1>
            <p className="text-sm text-gray-600 sm:text-base manage_your_comprehensive_personal_profile_label_id">Manage your comprehensive personal profile</p>
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
                  <p>{label}</p>
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
                    <p>{label}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                {activeTab === 'basic' && (
                  <span className="basic_information_label_id">Basic Information</span>
                )}
                {activeTab === 'social' && (
                  <span className="social_media_contact_label_id">Social Media & Contact</span>
                )}
                {activeTab === 'interests' && (
                  <span className="interests_bucket_list_label_id">Interests & Bucket List</span>
                )}
                {activeTab === 'media' && (
                  <span className="photos_videos_label_id">Photos & Videos</span>
                )}
                {activeTab === 'professional' && (
                  <span className="professional_information_label_id">Professional Information</span>
                )}
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
                <span className={isEditing ? 'save_label_id' : 'edit_label_id'}>
                  {isEditing ? 'Save' : 'Edit'}
                </span>
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
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 display_name_label_id">Display Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={userData.nick_names}
                          onChange={(e) => handleInputChange('nick_names', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">{userData.nick_names ? userData.nick_names : "--"}</h3>
                      )}
                    </div>
                    <p className="text-gray-600 break-all">{userData.email}</p>
                    <p className="break-all">
                      {
                        userData.email_verified_at 
                        ? <span className='text-green-600 verified_label_id'>Verified</span>
                        : <span className='text-red-600 unverified_label_id'>Unverified</span>
                      }
                    </p>
                    {
                      requestLoading
                      ?  <span className="loading loading-spinner loading-md"></span>
                      : 
                        <button onClick={() => ResendVerificationEmail()}>
                          <p className='text-blue-600 underline click_here_to_verify_label_id'>Click here to verify</p>
                        </button>
                    }
                    {
                      userData.occupation &&
                      userData.company &&
                      <p className="mt-1 space-x-1 text-sm text-gray-500">
                        <span>{userData.occupation} </span>
                        <span className='at_label_id'>at</span> 
                        <span>{userData.company}</span>
                      </p>
                    }
                  </div>
                </div>

                {/* Personal Introduction */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 personal_introduction_label_id">Personal Introduction</label>
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
                    <label className="block mb-2 text-sm font-medium text-gray-700 first_name_label_id">First Name</label>
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
                    <label className="block mb-2 text-sm font-medium text-gray-700 last_name_label_id">Last Name</label>
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
                    <label className="block mb-2 text-sm font-medium text-gray-700 mobile_number_label_id">Mobile Number</label>
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
                    <label className="block mb-2 text-sm font-medium text-gray-700 date_of_birth_label_id">Date of Birth</label>
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
                    <label className="block mb-2 text-sm font-medium text-gray-700 address_label_id">Address</label>
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
                    <label className="block mb-2 text-sm font-medium text-gray-700 city_label_id">City</label>
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
                  <label className="block mb-2 text-sm font-medium text-gray-700 occupation_label_id">Occupation</label>
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
                  <label className="block mb-2 text-sm font-medium text-gray-700 company_label_id">Company</label>
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
                  <label className="block mb-2 text-sm font-medium text-gray-700 business_description_label_id">Business Description</label>
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
            <p className="mb-4 text-sm text-gray-500 personal_info_management_label_id">
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

    const removePhoto = (photo) => {
      setUserData(prev => ({
        ...prev,
        user_uploads_table: prev.user_uploads_table.filter((item, index) => item.id !== photo.id)
      }));

      settoRemovePhoto(prev => [
        ...prev, 
        // userData.user_uploads_table.find((item, index) => item.id === photo.id)
        photo.id
      ])
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="font-medium text-gray-900 photo_gallery_label_id">Photo Gallery</h4>
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
            <p className="text-sm text-gray-600 drop_photos_here_or_click_to_upload_label_id">Drop photos here or click to upload</p>
            <p className="text-xs text-gray-400 png_jpg_up_to_5mb_each_label_id">PNG, JPG up to 5MB each</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-4">

          {
          userData.user_uploads_table.map((photo, index) => (
            <div key={index} className="relative border rounded-md shadow-lg group">
              <div className=''>
                <img
                  src={ 
                    photo.upload_url.includes('user_uploads')  
                    ? env.VITE_APP_BACKEND_STORAGE_URL + photo.upload_url
                    : photo.upload_url
                  }
                  // alt={photo.name}
                  className="object-cover w-full rounded-lg "
                />
              </div>
              {isEditing && (
                <button
                  onClick={() => removePhoto(photo)}
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
      <h4 className="font-medium text-gray-900 social_media_links_label_id">Social Media Links</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            <Facebook className="inline w-4 h-4 mr-1" /> 
            <span className='facebook_label_id'>Facebook</span>
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
            <Instagram className="inline w-4 h-4 mr-1" /> 
            <span className='instagram_label_id'>Instagram</span>
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
            <Twitter className="inline w-4 h-4 mr-1" /> 
            <span className='twitter_label_id'>Twitter</span>
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
            <Youtube className="inline w-4 h-4 mr-1" /> 
            <span className='youtube_label_id'>YouTube</span>
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
      <h4 className="font-medium text-gray-900 hobbies_and_interests_label_id">Hobbies & Interests</h4>
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
      <h4 className="font-medium text-gray-900 bucket_list_label_id">Bucket List Destinations</h4>
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
          <button onClick={addBucketListItem} className="px-4 py-2 text-white bg-blue-600 rounded-lg add_destination_label_id hover:bg-blue-700">
            Add Destination
          </button>
        </div>
      )}
    </div>
  );

  const YouTubeSection = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 youtube_videos_label_id">YouTube Videos</h4>
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
                  <p className="text-gray-500 invalid_youtube_url_label_id">Invalid YouTube URL</p>
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
