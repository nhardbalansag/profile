import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';
import {User, X } from 'lucide-react';

import { MapPin, Briefcase, Heart, Camera, Globe, Menu } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import * as api_account from '../../services/account/account.api.js'

const env = import.meta.env;

const AccountSponsorProfile = () =>{

  const auth_states = useSelector(state => state.AuthReducer);
  const [requestLoading, setRequestLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
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
  },[auth_states, requestLoading, activeTab, isMobileMenuOpen])

  const GetUserSponsorDetails = async() =>{
    setRequestLoading(true)
    await api_account.GetUserSponsorDetails(auth_states.StateToken).then((result) =>{
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
  
  useEffect(() => {
    GetUserSponsorDetails()
  },[])

  const UploadPhoto = () =>{

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
            </div>
          ) : (
            <div className="flex items-center justify-center w-[80px] h-[80px] text-2xl font-bold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
              {userData.first_name?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
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
            </div>
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* Profile Photo and Basic Info */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6">
                  <div className="self-center flex-shrink-0 sm:self-start">
                     {UploadPhoto()}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 display_name_label_id">Display Name</label>
                        <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">{userData.nick_names ? userData.nick_names : userData.first_name}</h3>
                    </div>
                    <p className="text-gray-600 break-all">{userData.email}</p>
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
                    <p className="p-4 text-gray-900 rounded-lg bg-gray-50">{userData.personal_introduction}</p>
                </div>

                {/* Basic Information Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 first_name_label_id">First Name</label>
                      <p className="text-gray-900">{userData.first_name}</p>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 last_name_label_id">Last Name</label>
                      <p className="text-gray-900">{userData.last_name}</p>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 mobile_number_label_id">Mobile Number</label>
                      <p className="text-gray-900">{userData.mobile_number}</p>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 date_of_birth_label_id">Date of Birth</label>
                      <p className="text-gray-900">{userData.date_of_birth}</p>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 address_label_id">Address</label>
                      <div className="flex items-center space-x-2">
                        <MapPin className="flex-shrink-0 w-4 h-4 text-gray-500" />
                        <p className="text-gray-900">{userData.current_address}</p>
                      </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 city_label_id">City</label>
                      <p className="text-gray-900">{userData.city}</p>
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
                    <div className="flex items-center space-x-2">
                      <Briefcase className="flex-shrink-0 w-4 h-4 text-gray-500" />
                      <p className="text-gray-900">{userData.occupation}</p>
                    </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 company_label_id">Company</label>
                    <p className="text-gray-900">{userData.company}</p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 business_description_label_id">Business Description</label>
                    <p className="p-4 text-gray-900 rounded-lg bg-gray-50">{userData.business_description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const extractYoutubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const PhotoUpload = () => {

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="font-medium text-gray-900 photo_gallery_label_id">Photo Gallery</h4>
          <span className="text-sm text-gray-500">
            {/* {userData.user_uploads_table.length}/{photoLimit} photos ({userPlan} Plan) */}
          </span>
        </div>
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
            <a href={userData.social_media.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all hover:underline">
              {userData.social_media.facebook}
            </a>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            <Instagram className="inline w-4 h-4 mr-1" /> 
            <span className='instagram_label_id'>Instagram</span>
          </label>
            <a href={userData.social_media.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all hover:underline">
              {userData.social_media.instagram}
            </a>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            <Twitter className="inline w-4 h-4 mr-1" /> 
            <span className='twitter_label_id'>Twitter</span>
          </label>
            <a href={userData.social_media.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all hover:underline">
              {userData.social_media.twitter}
            </a>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            <Youtube className="inline w-4 h-4 mr-1" /> 
            <span className='youtube_label_id'>YouTube</span>
          </label>
            <a href={userData.social_media.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all hover:underline">
              {userData.social_media.youtube}
            </a>
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
          </span>
        ))}
      </div>
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
            </div>
          </div>
        ))}
      </div>
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
            </div>
          );
        })}
      </div>
    </div>
  );
  
  return (
    <div>
      <ToastContainer />
      {_AccountDetails()}
    </div>  
  ) 
}

export default AccountSponsorProfile
