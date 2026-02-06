import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { Link } from "react-router-dom";

import { Heart, MessageCircle, Share2, MapPin, Calendar, ExternalLink, Play } from "lucide-react";
import { formatDistanceToNow } from 'date-fns'

import {
  HomeCard,
  CategoryTitleAndArrow,
} from '../component/index'

import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import * as api_content from '../services/content/content.api'
import * as api_account from '../services/account/account.api.js'

import { STORAGE_TOKEN } from "../store/auth/authAction";

import {
    getItem
} from '../store/store-index'

import Logo2 from '../assets/images/ten/logo2.png'

const env = import.meta.env;

const HomeContent = () =>{

  const auth_states = useSelector(state => state.AuthReducer);

  //#region useRefs
  const maxGuestCount = useRef(0)
  const initialFinalPrice = useRef(0)
  const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)  // null means main translation is used
  //#endregion 

  //#region states
  const [collapseDetails, setCollapseDetails] = useState(false);
  const [ResultGetHomeContents, ResultSetHomeContents] = useState([]);
  const [ResultGetHomeContentsDetails, ResultSetHomeContentsDetails] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [currentEngagement, setCurrentEngagement] = useState([]);
  const [paginate, setPaginate] = useState(null)
  const [getPaginatedHomeContents, setPaginatedHomeContents] = useState({
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
 //#endregion

  const AddContentEngagement = async(content_id) =>{

    setCurrentEngagement(prev =>
      prev.includes(content_id)
        ? prev.filter(id => id !== content_id) // remove
        : [...prev, content_id] // add
    );

    const request = {
      content_id: content_id
    }

    await api_content.AddContentEngagement(auth_states.StateToken, request).then((result) =>{
      
    }).catch((err) =>{
      console.log("AddContentEngagement", err)
    })
  }

  const GetAuthHomeContents = async(token) =>{
    setLoadingContent(true)
    await api_account.GetHomeContents(token, paginate).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        // ResultSetHomeContents(result.data.data)
        Object.keys(result.data.data).map((item, key) =>{
          setPaginatedHomeContents((prevFormData) => ({
            ...prevFormData,
            [item]: result.data.data[item]
          }));
        })
      }
    }).catch((err) =>{
      console.log("GetHomeContents", err)
    })
  }

  const limitText = (text, limit = 30) =>{
    if(text){
        return text.length > limit ? text.slice(0, limit) : text;
    }
  }
  //#endregion

  const getTokenValidate = async() =>{
    var token = await getItem(STORAGE_TOKEN)
    if(token){
      GetAuthHomeContents(JSON.parse(token))
      setCurrentEngagement([])
    }
  }

  //#region useEffects
  useEffect(() =>{
    getTokenValidate()
  },[auth_states.StateToken, paginate])

  useEffect(() =>{
    ResultSetHomeContents([])
  },[auth_states.StateToken])

  useEffect(() =>{
    if(auth_states.SelectedLanguage){
      selectedLanguage.current = parseInt(auth_states.SelectedLanguage.id)
      getTokenValidate()
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
  },[auth_states, loadingContent, paginate])
  //#endregion

  const HomeSocialContentComp = () =>{
    return (
      <div className="min-h-screen py-10 bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="container flex items-center justify-between h-16 max-w-4xl px-4 mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-accent">
                <span className="text-xl font-bold text-white">
                  {auth_states.StateUserInformation?.first_name.charAt(0)}
                </span>
              </div>
              <h1 className="text-xl font-bold text-foreground">
                <span className='welcome_home_label_id'>Welcome Home!</span>
              </h1>
              <p className='text-gray-500 text-[20px] font-semibold'>
                <span>{auth_states.StateUserInformation.nick_names ? auth_states.StateUserInformation.nick_names : auth_states.StateUserInformation.first_name}</span>
              </p>
            </div>
          </div>
        </header>
        {/* Main Feed */}
        <main className="container max-w-4xl px-4 py-6 mx-auto">
          <div className="space-y-6 mb-[100px]">
            {
              getPaginatedHomeContents.data.map((post) => (
                <div key={post?.id} className="overflow-hidden transition-shadow duration-300 border rounded-lg shadow-sm border-border bg-card text-card-foreground hover:shadow-lg">
                  {/* Post Header */}
                  <div className="flex items-start justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex w-12 h-12 overflow-hidden border-2 border-orange-200 rounded-full shrink-0">
                        <img src={Logo2} alt={'clubTen'} className="w-full h-full aspect-square" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">Club Ten</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(post?.created_at), { addSuffix: true })}</p>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <div 
                    dangerouslySetInnerHTML={{ 
                      __html: selectedLanguage.current == null 
                              ? post?.content_description
                              : (
                                    post?.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                  ? post?.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_description
                                  : post?.content_description
                                )
                    }}/>
                  </div>

                  {post?.uploads_table?.length > 0 && (
                    <div
                      className={`grid gap-1 ${
                        post.uploads_table.length === 1
                          ? "grid-cols-1"
                          : post.uploads_table.length === 2
                          ? "grid-cols-2"
                          : post.uploads_table.length === 3
                          ? "grid-cols-3"
                          : "grid-cols-2"
                      }`}
                    >
                      {post.uploads_table.map((upload, index) => {
                        const src =
                          upload.upload_type === "url"
                            ? upload.upload_url
                            : `${env.VITE_APP_BACKEND_STORAGE_URL}${upload.upload_url}`;

                        switch (upload.upload_type) {
                          case "url":
                            return (
                              <div
                                key={index}
                                className="relative overflow-hidden aspect-square bg-muted"
                              >
                                <img
                                  src={src}
                                  alt={`Post image ${index + 1}`}
                                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                                />
                              </div>
                            );
                          case "image":
                            return (
                              <div
                                key={index}
                                className="relative overflow-hidden aspect-square bg-muted"
                              >
                                <img
                                  src={src}
                                  alt={`Post image ${index + 1}`}
                                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                                />
                              </div>
                            );

                          case "embed":
                            return (
                              <div key={index} className="relative bg-black aspect-video">
                                <iframe
                                  src={upload?.upload_url + "?autoplay=0"}
                                  title="Embedded video"
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  frameBorder="0"
                                />
                              </div>
                            );

                          case "video":
                            return (
                              <div key={index} className="relative bg-black aspect-video group">
                                <video
                                  src={`${env.VITE_APP_BACKEND_STORAGE_URL}${upload?.upload_url}`}
                                  controls
                                  className="w-full h-full"
                                  type="video/mp4"
                                />
                              </div>
                            );

                          default:
                            return null;
                        }
                      })}
                    </div>
                  )}

                  {/* Engagement Bar */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                      <span>
                        {
                          JSON.parse(post?.engagement)
                          ? JSON.parse(post?.engagement).length
                          : 0
                        } 
                      </span>
                      <span>likes</span>
                      {/* <div className="flex gap-3">
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                      </div> */}
                    </div>
                    
                    <div className="flex items-center justify-around pt-2 border-t border-border">
                      <button onClick={() => AddContentEngagement(post?.id)} className="flex items-center gap-2 px-4 py-2 transition-colors rounded-lg hover:bg-muted group">
                        <Heart
                          className={`${
                              JSON.parse(post?.engagement) !== null
                              ?
                                JSON.parse(post?.engagement).find(item => item.user_id === auth_states.StateUserInformation.id)
                                ? "text-orange-400"
                                : (currentEngagement.find(item => item === post?.id) && "text-orange-400")
                              : (currentEngagement.find(item => item === post?.id) && "text-orange-400")
                          } w-5 h-5 text-gray-400 transition-colors group-hover:text-orange-400`}
                        />                        
                        <span className="font-medium text-foreground">Like</span>
                      </button>
                      {/* <button className="flex items-center gap-2 px-4 py-2 transition-colors rounded-lg hover:bg-muted group">
                        <MessageCircle className="w-5 h-5 transition-colors text-muted-foreground group-hover:text-primary" />
                        <span className="font-medium text-foreground">Comment</span>
                      </button> */}
                      {/* <button className="flex items-center gap-2 px-4 py-2 transition-colors rounded-lg hover:bg-muted group">
                        <Share2 className="w-5 h-5 transition-colors text-muted-foreground group-hover:text-primary" />
                        <span className="font-medium text-foreground">Share</span>
                      </button> */}
                    </div>
                  </div>
                </div>
              ))
            }

            {/* Load More */}
            {
              loadingContent &&
              <div className="pb-8 mt-8 text-center">
                <span className="loading loading-dots loading-xl"></span>
              </div>
            }

            {/* pagination */}
            <div className='my-5'>
              <p className="text-sm font-semibold text-muted-foreground">
                <span className='showing_label_id'>Showing</span>{' '}
                <span>{getPaginatedHomeContents.data.length}</span>{' '}
                <span>of</span>{' '}
                <span>{getPaginatedHomeContents.total}</span>{' '}
                <span className='contents_label_id'>contents</span>
              </p>
              <div className='w-[100%] mt-3'>
                <div className="space-x-2 ">
                  {Array.from({ length: getPaginatedHomeContents.last_page }, (_, i) => i + 1).map((page) =>  (
                    <button
                      key={page}
                      onClick={() => setPaginate(getPaginatedHomeContents.path + "?page=" + page)}
                      className={`w-8 h-8 rounded-lg font-medium transition-colors duration-200 ${
                        page === getPaginatedHomeContents.current_page
                          ? 'bg-orange-400 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  } 
  
  return (
    <div>
      <HomeSocialContentComp/>
    </div>
  )
}

export default HomeContent