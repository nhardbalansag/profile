import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, MapPin, Calendar, ExternalLink, Play, MoreVertical, Bookmark, Send, Smile, X } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { TbMessageCircleUser } from "react-icons/tb";

import {
  HomeCard,
  CategoryTitleAndArrow,
} from '../component/index';

import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import * as api_content from '../services/content/content.api';
import * as api_account from '../services/account/account.api.js';

import { STORAGE_TOKEN } from "../store/auth/authAction";
import { getItem } from '../store/store-index';

import Logo2 from '../assets/images/ten/logo2.png';

const env = import.meta.env;

const HomeContent = () => {
  const auth_states = useSelector(state => state.AuthReducer);

  //#region useRefs
  const maxGuestCount = useRef(0);
  const initialFinalPrice = useRef(0);
  const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null);
  const commentInputRef = useRef(null);
  //#endregion

  //#region states
  const [collapseDetails, setCollapseDetails] = useState(false);
  const [ResultGetHomeContents, ResultSetHomeContents] = useState([]);
  const [ResultGetHomeContentsDetails, ResultSetHomeContentsDetails] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [currentEngagement, setCurrentEngagement] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [paginate, setPaginate] = useState(null);
  const [getPaginatedHomeContents, setPaginatedHomeContents] = useState({
    prev_page_url: null,
    first_page_url: null,
    last_page_url: null,
    next_page_url: null,
    current_page: null,
    last_page: null,
    total: 0,
    from: 0,
    to: 0,
    data: []
  });
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const [comments, setComments] = useState({});
  const [currentEngagementComment, setCurrentEngagementComment] = useState('');
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [loadingComments, setLoadingComments] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  //#endregion

  const openChat = async () => {
    setChatLoading(true)
    await api_content.ChatLogin(auth_states.StateToken).then((result) => {
      if (result.status) {
        // result
        window.location.href = result.data.redirect_url;
      }
    }).catch((err) => {
      // error handling
      console.log(err)
    });
  }

  const AddContentEngagement = async (content_id) => {
    const request = { content_id: content_id };
    await api_content.AddContentEngagement(auth_states.StateToken, request).then((result) => {
      if (result.status) {
        // Optionally update local state based on response
        setCurrentEngagement(result.data.data)
      }
    }).catch((err) => {
      console.log("AddContentEngagement", err);
    });
  };

  const AddContentEngagementComment = async (content_id, comment) => {
    const request = { content_id: content_id, comment: comment };
    await api_content.AddContentEngagement(auth_states.StateToken, request).then((result) => {
      if (result.status) {
        // Optionally update local state based on response
        setCurrentEngagement(result.data.data)
      }
    }).catch((err) => {
      console.log("AddContentEngagement", err);
    });
  };

  // const AddContentEngagementCommentLike = async (content_id, comment) => {
  //   const request = { content_id: content_id, comment: comment };
  //   await api_content.AddContentEngagement(auth_states.StateToken, request).then((result) => {
  //     if (result.status) {
  //       // Optionally update local state based on response
  //       setCurrentEngagement(result.data.data)
  //     }
  //   }).catch((err) => {
  //     console.log("AddContentEngagement", err);
  //   });
  // };


  const toggleSavePost = (postId) => {
    setSavedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const fetchComments = async (postId) => {
    if (!comments[postId] || comments[postId].length === 0) {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      // Simulate API call - replace with actual API
      setTimeout(() => {
        const mockComments = [
          {
            id: 1,
            user_id: 1,
            user_name: "Alex Johnson",
            user_avatar: "https://i.pravatar.cc/150?img=1",
            comment: "Great post! Really enjoyed this content.",
            created_at: new Date(Date.now() - 1000000).toISOString(),
            likes: 3
          },
          {
            id: 2,
            user_id: 2,
            user_name: "Sam Wilson",
            user_avatar: "https://i.pravatar.cc/150?img=2",
            comment: "This is amazing! Thanks for sharing.",
            created_at: new Date(Date.now() - 2000000).toISOString(),
            likes: 1
          },
          {
            id: 3,
            user_id: 3,
            user_name: "Taylor Swift",
            user_avatar: "https://i.pravatar.cc/150?img=3",
            comment: "Can't wait to see more like this!",
            created_at: new Date(Date.now() - 3000000).toISOString(),
            likes: 5
          }
        ];
        
        setComments(prev => ({ ...prev, [postId]: mockComments }));
        setLoadingComments(prev => ({ ...prev, [postId]: false }));
      }, 500);
    }
  };

  const handleCommentClick = (postId) => {
    if (activeComment === postId) {
      setActiveComment(null);
      setCommentingPostId(null);
      setCurrentEngagementComment('');
    } else {
      setActiveComment(postId);
      // fetchComments(postId);
      setCommentingPostId(postId);
      setTimeout(() => {
        if (commentInputRef.current) {
          commentInputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleAddComment = async (postId) => {
    if (!currentEngagementComment.trim()) return;

    const newComment = {
      id: Date.now(),
      user_id: auth_states.StateUserInformation?.id || 0,
      user_name: auth_states.StateUserInformation?.first_name || "You",
      user_avatar: null,
      comment: currentEngagementComment,
      created_at: new Date().toISOString(),
      likes: auth_states.StateUserInformation?.email
    };

    // Add to local state immediately for optimistic update
    setComments(prev => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])]
    }));

    AddContentEngagementComment(postId, currentEngagementComment);

    setCurrentEngagementComment('');
  };

  const handleKeyPress = (e, postId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment(postId);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setCurrentEngagementComment(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const toggleCommentLike = (postId, commentId) => {
    AddContentEngagementCommentLike(postId, commentId)
  };

  const GetAuthHomeContents = async (token) => {
    setLoadingContent(true);
    await api_account.GetHomeContents(token, paginate).then((result) => {
      if (result.status) {
        setLoadingContent(false);
        Object.keys(result.data.data).forEach((item) => {
          setPaginatedHomeContents((prevFormData) => ({
            ...prevFormData,
            [item]: result.data.data[item]
          }));
        });
      }
    }).catch((err) => {
      console.log("GetHomeContents", err);
    });
  };

  const limitText = (text, limit = 30) => {
    return text && text.length > limit ? `${text.slice(0, limit)}...` : text;
  };

  const getTokenValidate = async () => {
    const token = await getItem(STORAGE_TOKEN);
    if (token) {
      GetAuthHomeContents(JSON.parse(token));
      setCurrentEngagement([]);
      setComments({});
    }
  };

  //#region useEffects
  useEffect(() => {
    getTokenValidate();
  }, [auth_states.StateToken, paginate]);

  useEffect(() => {
    ResultSetHomeContents([]);
  }, [auth_states.StateToken]);

  useEffect(() => {
    if (auth_states.SelectedLanguage) {
      selectedLanguage.current = parseInt(auth_states.SelectedLanguage.id);
      getTokenValidate();
    }
  }, [auth_states]);

  useEffect(() => {
    auth_states.PageLanguages.forEach((item) => {
      const translation = item.translation;
      if (translation.length > 0 && auth_states.SelectedLanguage) {
        const filteredTranslation = translation.find(translation_item =>
          translation_item.language_id == auth_states.SelectedLanguage.id
        );
        const targetElement = document.getElementsByClassName(item.page_config_id);
        if (targetElement && targetElement.length > 0) {
          Array.from(targetElement).forEach((el) => {
            el.textContent = filteredTranslation ? filteredTranslation.page_config_title : item.page_config_title;
          });
        }
      }
    });
  }, [auth_states, loadingContent, paginate]);
  //#endregion

  const EmojiPicker = ({ onSelect, onClose }) => {
    const emojis = ['😊', '👍', '❤️', '🎉', '🔥', '👏', '😍', '😂', '😎', '🙏'];

    return (
      <div className="absolute right-0 z-50 p-3 mb-2 bg-white border border-gray-200 shadow-lg bottom-full rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Quick Emojis</span>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => onSelect(emoji)}
              className="flex items-center justify-center w-8 h-8 text-lg transition-colors rounded-lg hover:bg-gray-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const HomeSocialContentComp = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-50/30">
        {/* Enhanced Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 shadow-sm">
          <div className="container flex items-center justify-between h-16 max-w-4xl px-4 mx-auto">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 shadow-md bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500 rounded-xl">
                  <span className="text-xl font-bold text-white">
                    {auth_states.StateUserInformation?.first_name.charAt(0)}
                  </span>
                </div>
                <div className="absolute w-3 h-3 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"></div>
              </div>
              <div>
                <h1 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <span className='welcome_home_label_id'>Welcome Home!</span>
                  <span className="px-2 py-1 text-sm font-normal text-orange-600 rounded-full bg-orange-50">
                    {auth_states.StateUserInformation.nick_names || auth_states.StateUserInformation.first_name}
                  </span>
                </h1>
                <p className="text-sm text-gray-500">Your personalized feed</p>
              </div>
            </div>
            {/* <button onClick={() => openChat()}>
              <a href="#" className={`${("account").includes(location.pathname) ? 'bg-gray-100' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                <TbMessageCircleUser className='' size={20}/>
                {
                  chatLoading
                  ? <span className="mx-2 loading loading-spinner loading-sm"></span>
                  : <p className='mx-2 capitalize language_id '>Chat</p>
                }
              </a>
            </button> */}
          </div>
        </header>

        {/* Main Feed */}
        <main className="container max-w-4xl px-4 pt-6 pb-20 mx-auto">
          <div className="space-y-6">
            {getPaginatedHomeContents.data.map((post) => {

              const engagementData =
              currentEngagement &&
              currentEngagement?.id === post.id
              ? currentEngagement?.engagement ? JSON.parse(currentEngagement.engagement) : []
              : post?.engagement ? JSON.parse(post.engagement) : [];
                
              const isLiked = engagementData &&
                              engagementData?.reaction 
                              ? engagementData?.reaction.find(item => item.user_id === auth_states.StateUserInformation.id) 
                              : false
              
              const postComments  = engagementData &&
                                    engagementData?.comments 
                                    ? engagementData?.comments.filter(item => item.content_id === post?.id) 
                                    : []

              return (
                <div key={post?.id} className="overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl">
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 overflow-hidden border-2 border-white rounded-full shadow-sm bg-gradient-to-br from-orange-400 to-amber-300">
                          <img src={Logo2} alt={'clubTen'} className="object-cover w-full h-full" />
                        </div>
                        <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"></div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">Club Ten</h3>
                          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">
                            {formatDistanceToNow(new Date(post?.created_at), { addSuffix: true })}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500">Public</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-4">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: selectedLanguage.current == null 
                                ? post?.content_description
                                : (post?.translation?.find((filter_item) => filter_item.language_id == selectedLanguage.current)?.content_description 
                                   || post?.content_description)
                      }}
                      className="prose-sm prose text-gray-700 max-w-none"
                    />
                  </div>

                  {/* Media Gallery */}
                  {post?.uploads_table?.length > 0 && (
                    <div className={`
                      ${post.uploads_table.length === 1 ? "px-0" : "px-1"}
                      ${post.uploads_table.length >= 3 ? "pb-1" : "pb-0"}
                    `}>
                      <div className={`
                        grid gap-1 overflow-hidden rounded-lg
                        ${post.uploads_table.length === 1 ? "grid-cols-1" : ""}
                        ${post.uploads_table.length === 2 ? "grid-cols-2" : ""}
                        ${post.uploads_table.length === 3 ? "grid-cols-2" : ""}
                        ${post.uploads_table.length >= 4 ? "grid-cols-2" : ""}
                      `}>
                        {post.uploads_table.slice(0, 4).map((upload, index) => {
                          const src = upload.upload_type === "url"
                            ? upload.upload_url
                            : `${env.VITE_APP_BACKEND_STORAGE_URL}${upload.upload_url}`;
                          const isVideo = upload.upload_type === "video" || upload.upload_type === "embed";
                          const isLastInGrid = index === 3 && post.uploads_table.length > 4;

                          return (
                            <div
                              key={index}
                              className={`
                                relative overflow-hidden bg-gray-100
                                ${post.uploads_table.length === 3 && index === 2 ? "col-span-2" : ""}
                              `}
                            >
                              {isVideo ? (
                                upload.upload_type === "embed" ? (
                                  <div className="relative w-full h-full bg-black">
                                    {/* <iframe
                                      src={upload?.upload_url + "?autoplay=0"}
                                      className="absolute inset-0 w-full h-full"
                                      allowFullScreen
                                    /> */}

                                    <iframe
                                      src={upload?.upload_url + "?autoplay=0"}
                                      title="Embedded video"
                                      className="w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      frameBorder="0"
                                    />
                                  </div>
                                ) : (
                                  <video
                                    src={src}
                                    controls
                                    className="object-cover w-full h-full"
                                  />
                                )
                              ) : (
                                <img
                                  src={src}
                                  alt={`Post content ${index + 1}`}
                                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                                />
                              )}
                              
                              {isLastInGrid && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                  <span className="text-2xl font-bold text-white">
                                    +{post.uploads_table.length - 4}
                                  </span>
                                </div>
                              )}
                              
                              {/* {isVideo && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm">
                                    <Play className="w-6 h-6 ml-1 text-white" />
                                  </div>
                                </div>
                              )} */}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Engagement Stats */}
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <div className="flex -space-x-2">
                            {/* <div className="w-6 h-6 border border-white rounded-full bg-gradient-to-br from-pink-400 to-rose-500"></div>
                            <div className="w-6 h-6 border border-white rounded-full bg-gradient-to-br from-blue-400 to-cyan-500"></div>
                            <div className="w-6 h-6 border border-white rounded-full bg-gradient-to-br from-green-400 to-emerald-500"></div> */}
                            <Heart className={`w-5 h-5 transition-all text-rose-300 fill-rose-300 group-hover:text-rose-500'}`} />
                          </div>
                          <span className="text-gray-600">
                            {

                              engagementData
                              ?
                                (
                                  engagementData?.reaction 
                                  ? engagementData?.reaction?.length
                                  : 0 
                                )
                                + 
                                (isLiked && !engagementData?.reaction.find(item => item.user_id === auth_states.StateUserInformation.id) ? 1 : 0)
                              : 
                                0
                            }
                          </span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <button 
                          onClick={() => handleCommentClick(post?.id)}
                          className="text-gray-600 transition-colors hover:text-orange-500"
                        >
                          {postComments ? postComments.length : 0} comments
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 py-2 border-t border-gray-100">
                    <div className="flex items-center justify-around">
                      <button 
                        onClick={() => AddContentEngagement(post?.id)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all hover:bg-orange-50 group flex-1 justify-center"
                      >
                        <Heart className={`w-5 h-5 transition-all ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-gray-400 group-hover:text-rose-500'}`} />
                        <span className={`font-medium transition-colors ${isLiked ? 'text-rose-500' : 'text-gray-600 group-hover:text-rose-500'}`}>
                          Like
                        </span>
                      </button>
                      
                      <button 
                        onClick={() => handleCommentClick(post?.id)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all hover:bg-blue-50 group flex-1 justify-center"
                      >
                        <MessageCircle className={`w-5 h-5 transition-colors ${activeComment === post?.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'}`} />
                        <span className={`font-medium transition-colors ${activeComment === post?.id ? 'text-blue-500' : 'text-gray-600 group-hover:text-blue-500'}`}>
                          Comment
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {activeComment === post?.id && (
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 animate-fadeIn">
                      {/* Comments List */}
                      <div className="pr-2 mb-4 space-y-4 overflow-y-auto max-h-64">
                        {loadingComments[post?.id] ? (
                          <div className="flex flex-col items-center py-4">
                            <div className="w-8 h-8 border-2 border-gray-200 rounded-full border-t-blue-500 animate-spin"></div>
                            <p className="mt-2 text-sm text-gray-500">Loading comments...</p>
                          </div>
                        ) : postComments.length > 0 ? (
                          postComments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 group">
                              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400">
                                {comment?.user_email?.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="p-3 transition-shadow bg-white shadow-sm rounded-2xl group-hover:shadow">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-900">
                                        {(() => {
                                          if (comment.user_email) {
                                            const firstLetter = comment.user_email.charAt(0).toUpperCase();
                                            return `${firstLetter}***`;
                                          }
                                          return `${comment.user_id}`;
                                        })()}
                                        {comment.user_id === auth_states.StateUserInformation?.id && (
                                          <span className="ml-1 text-xs font-normal text-blue-500">(You)</span>
                                        )}
                                      </h4>
                                      <p className="mt-1 text-sm text-gray-700">{comment.comment}</p>
                                    </div>
                                    {/* <button 
                                      onClick={() => AddContentEngagementCommentLike(post?.id, comment)}
                                      className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-rose-500"
                                    >
                                      <Heart className={`w-3 h-3 ${comment.likes.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                                      <span>{comment.likes.length}</span>
                                    </button> */}
                                  </div>
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className="text-xs text-gray-400">
                                      {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                                    </span>
                                    {/* <button className="text-xs text-gray-500 transition-colors hover:text-gray-700">
                                      Reply
                                    </button> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-4 text-center">
                            <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
                          </div>
                        )}
                      </div>

                      {/* Add Comment Input */}
                      <div className="relative">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-300">
                            {auth_states.StateUserInformation?.first_name && (
                              <div className="flex items-center justify-center w-full h-full font-bold text-white rounded-full">
                                {auth_states.StateUserInformation.first_name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="relative flex-1">
                            <input
                              ref={commentingPostId === post?.id ? commentInputRef : null}
                              value={commentingPostId === post?.id ? currentEngagementComment : ''}
                              onChange={(e) => setCurrentEngagementComment(e.target.value)}
                              onKeyPress={(e) => handleKeyPress(e, post?.id)}
                              type="text"
                              placeholder="Write a comment..."
                              className="w-full py-2.5 pl-4 pr-12 text-sm bg-white rounded-full border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                            <div className="absolute flex items-center gap-1 transform -translate-y-1/2 right-2 top-1/2">
                              <button 
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <Smile className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                              </button>
                              <button 
                                onClick={() => handleAddComment(post?.id)}
                                disabled={!currentEngagementComment.trim()}
                                className="p-1.5 hover:bg-blue-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Send className="w-5 h-5 text-blue-500" />
                              </button>
                            </div>
                            
                            {/* Emoji Picker */}
                            {showEmojiPicker && commentingPostId === post?.id && (
                              <EmojiPicker 
                                onSelect={handleEmojiSelect}
                                onClose={() => setShowEmojiPicker(false)}
                              />
                            )}
                          </div>
                        </div>
                        
                        {/* Comment Hint */}
                        <div className="mt-2 text-xs text-center text-gray-400">
                          Press Enter to send
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loadingContent && (
              <div className="py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-gray-200 rounded-full border-t-orange-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-300"></div>
                    </div>
                  </div>
                  <p className="font-medium text-gray-500">Loading fresh content...</p>
                </div>
              </div>
            )}

            {/* Pagination */}
            <div className="p-6 my-8 bg-white border border-gray-100 shadow-sm rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-700">
                  <span className='showing_label_id'>Showing</span>{' '}
                  <span className="font-bold text-gray-900">{getPaginatedHomeContents.data.length}</span>{' '}
                  <span>of</span>{' '}
                  <span className="font-bold text-gray-900">{getPaginatedHomeContents.total}</span>{' '}
                  <span className='contents_label_id'>contents</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPaginate(getPaginatedHomeContents.prev_page_url)}
                    disabled={!getPaginatedHomeContents.prev_page_url}
                    className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPaginate(getPaginatedHomeContents.next_page_url)}
                    disabled={!getPaginatedHomeContents.next_page_url}
                    className="px-4 py-2 text-sm font-medium text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: getPaginatedHomeContents.last_page }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setPaginate(getPaginatedHomeContents.path + "?page=" + page)}
                    className={`
                      w-10 h-10 rounded-lg font-medium transition-all duration-200 flex items-center justify-center
                      ${page === getPaginatedHomeContents.current_page
                        ? 'bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-md'
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50 border border-gray-200 hover:border-orange-200'
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>

            {/* End of Feed */}
            <div className="py-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-orange-400 to-amber-300 animate-pulse"></div>
                <p className="text-sm font-medium text-gray-600">
                  You're all caught up! Check back later for more content.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  return (
    <div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {HomeSocialContentComp()}
    </div>
  );
};

export default HomeContent;