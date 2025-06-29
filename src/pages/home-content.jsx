import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { Link } from "react-router-dom";

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
 //#endregion

  const HandleOfferDetails = (item) =>{
    ResultSetHomeContentsDetails(item)
    initialFinalPrice.current = item.content_offers_table[0].offers_table.offers_amount
    maxGuestCount.current = item.content_guest_count
  }

  const GetHomeContents = async() =>{
    setLoadingContent(true)
    await api_content.GetHomeContents().then((result) =>{
      if(result.status){
        setLoadingContent(false)
        ResultSetHomeContents(result.data.data)
      }
    }).catch((err) =>{
      console.log("GetHomeContents", err)
    })
  }

  const GetAuthHomeContents = async(token) =>{
    setLoadingContent(true)
    await api_account.GetHomeContents(token).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        ResultSetHomeContents(result.data.data)
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
      GetAuthHomeContents(token)
    }else{
      GetHomeContents()
    }
  }

  //#region useEffects
  useEffect(() =>{
    ResultSetHomeContents([])
    getTokenValidate()
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
  },[auth_states, loadingContent])
  //#endregion

  //#endregion

  const LoadComp = () =>{
    return(
      <div className=''>
        <div className="flex flex-col justify-center w-full gap-4 py-10">
          <div className="w-full h-32 skeleton"></div>
          <div className="h-4 skeleton w-28"></div>
          <div className="w-full h-4 skeleton"></div>
          <div className="w-full h-4 skeleton"></div>
        </div>
      </div>
    )
  }

  const EmbededVideoUrl = ({type, videoId, categoryConfig, title, details, clickSeeDetails, contentDetails }) => {
    return (
      <div  className=' w-[100%] h-[100%] '>
        <div className='flex justify-center'>
          <iframe
          className='rounded-lg'
            src={ type == "video" ? env.VITE_APP_BACKEND_STORAGE_URL +  videoId : videoId}
            // src={videoId}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube Video"
            style={{
              width: '100%',
              height: '200px',
            }}
          />
        </div>
        <div>
          {
              categoryConfig.show_bottom_title &&
              <Link 
                  to={{
                      pathname: "/content-details",
                      search: "?view=" + contentDetails.id,
                  }}
              >
                <p className="mt-1 text-lg font-semibold text-black line-clamp-2">
                {title}
                </p>
              </Link>
          }
          {
              categoryConfig.show_bottom_description &&
              <div onClick={clickSeeDetails}  className="mt-1 text-lg text-gray-700">
                <div dangerouslySetInnerHTML={{__html: collapseDetails ? details : limitText(details, 50)}} /> 
                {/* {!collapseDetails && details.length > 30 && <p className='text-lg see_more'>... see more</p>}  */}
              </div>
          }
        </div>
      </div>
    )
  }

  const SwiperLoading = () =>{
    return(
      <div>
        <div className='flex items-center justify-between'>
          <div className="w-[30%] h-4 skeleton"></div>
          <div className="h-4 skeleton w-[20%]"></div>
        </div>
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={5}
          slidesPerView={1}
          onSlideChange={() => setCollapseDetails(false)}
          // onSwiper={(swiper) => console.log(swiper)}
          breakpoints={{
            300: { slidesPerView: 1, spaceBetween: 5 }, // 2 slides on tablets
            400: { slidesPerView: 1, spaceBetween: 5 }, // 2 slides on tablets
            500: { slidesPerView: 1, spaceBetween: 0 }, // 2 slides on tablets
            600: { slidesPerView: 2, spaceBetween: 60 }, // 2 slides on tablets
            700: { slidesPerView: 2, spaceBetween: 50 }, // 2 slides on tablets
            800: { slidesPerView: 2, spaceBetween: 10 }, // 2 slides on tablets
            1024: { slidesPerView: 2,  spaceBetween: 10}, // 3 slides on desktops
            1353: { slidesPerView: 3,  spaceBetween: 10} // 3 slides on desktops
            // 1024: { slidesPerView: 3, spaceBetween: 200 } // 3 slides on desktops
          }}
        >
          {
            [1, 2, 3].map((item, index) =>(
              <SwiperSlide key={index} className='flex justify-center mb-10'>
                <HomeCard loading={true}/>
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
    )
  }

  const CategoryTitle = ({item, index}) =>{
    return(
      <CategoryTitleAndArrow 
        key={index}
        title={
          selectedLanguage.current == null 
          ? item.category_display_content.display.category.title
          : (
                item.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
              ? item.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).display_title 
              : item.category_display_content.display.category.title
            )
        } 
        path={item.category_display_content.path.path}
        redirect_title={
          selectedLanguage.current == null 
          ? item.category_display_content.display.redirect.title
          : (
                item.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
              ? item.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).redirect_title
              : item.category_display_content.display.redirect.title
            )
        }
        has_path={item.category_display_content.path.has_path}
        title_style={item.category_display_content.display.category.style}
        redirect_style={item.category_display_content.display.redirect.style}
      />
    )
  }

  const CardTypeHomeContent = ({item, item_content}) =>{
    return(
      <HomeCard 
        categoryConfig={item.category_display_content.display.content_home_style}
        contentDetails={item_content}
        loading={loadingContent}
        clickOffers={() => HandleOfferDetails(item_content)}
        title={
          selectedLanguage.current == null 
          ? item_content.content_title
          : (
                item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
              ? item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_title
              : item_content.content_title
            )
        }
        // clickSeeDetails={() => HandleSeeDetails(item_content)}
        details={
          selectedLanguage.current == null 
          ? item_content.content_description
          : (
                item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
              ? item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_description
              : item_content.content_description
            )
        }
        image={
            item_content.uploads_table_main_view.upload_type === "url" 
          ? item_content.uploads_table_main_view.upload_url 
          : env.VITE_APP_BACKEND_STORAGE_URL + item_content.uploads_table_main_view.upload_url
        } 
        days={item_content.content_days_count}
        nights={item_content.content_night_count}
        location='--'
        collapseDetails={ResultGetHomeContentsDetails.id == item_content.id ? collapseDetails : false} 
        isLiked={false}
      />
    )
  }

  const VideoEmbedURLContent = ({item_content, item}) =>{
    return(
      <EmbededVideoUrl 
        type={item_content.uploads_table_main_view.upload_type}
        // clickSeeDetails={() => HandleSeeDetails(item_content)}
        contentDetails={item_content}
        title={
          selectedLanguage.current == null 
          ? item_content.content_title
          : 
            (
              item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
              ? item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_title
              : item_content.content_title
            )
        }
        details={
          selectedLanguage.current == null 
          ? item_content.content_description
          : 
            (
              item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
              ? item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_description
              : item_content.content_description
            )
        }
        categoryConfig={item.category_display_content.display.content_home_style}
        videoId={item_content.uploads_table_main_view.upload_url}
      />
    )
  }
  
  return (
    <div>
      <main >
        <div className='flex justify-center my-5'>
          <div className='md:w-[75%] w-[95%]'>
            <p className='text-gray-500 text-[20px] font-semibold'>Hello {`${auth_states.StateToken ? auth_states.StateUserInformation.first_name : ","}`}</p>
            <p className='font-extrabold text-[#001d3d] text-[30px]'>
              {
                auth_states.StateToken 
                ? 'Welcome Home!'
                : "Welcome to Club TEN"
              }
            </p>
          </div>
        </div>
        {
          loadingContent
          ? 
            <div className='flex justify-center my-5 mb-[150px]'>
              <div className='md:w-[75%] w-[95%]'>
                <SwiperLoading/>
              </div>
            </div>
          :
            <div className='flex justify-center my-5 mb-[150px]'>
              <div className='md:w-[75%] w-[95%]'>
                {
                  ResultGetHomeContents.length > 0
                  ?
                    ResultGetHomeContents.map((item, index) =>(
                      <div>
                        <CategoryTitle item={item} index={index}/>
                        {
                          item.category_display_content.display.content_home_style.embed_video_url
                          ?
                            (
                              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 place-content-center'>
                                {
                                  item.contents_table.map((item_content, index_content) =>(
                                    loadingContent
                                    ? LoadComp()
                                    :
                                      (
                                        item_content.translation_dependent 
                                        ?
                                          (
                                            item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current) &&
                                            <VideoEmbedURLContent item_content={item_content} item={item} />
                                          )
                                        :
                                          (
                                            selectedLanguage.current == null &&
                                            <VideoEmbedURLContent item_content={item_content} item={item} />
                                          )
                                      )
                                  ))
                                }
                              </div>
                            )
                          :
                          <Swiper
                          //#region swiper parameter
                            key={index}
                            pagination={{
                              dynamicBullets: true,
                            }}
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            spaceBetween={10}
                            slidesPerView={item.category_display_content.display.content_home_style.mobile_view_render_count}
                            onSlideChange={() => setCollapseDetails(false)}
                            breakpoints={{
                              300: { slidesPerView: item.category_display_content.display.content_home_style.mobile_view_render_count, spaceBetween: 10 }, // 2 slides on tablets
                              400: { slidesPerView: item.category_display_content.display.content_home_style.mobile_view_render_count, spaceBetween: 10 }, // 2 slides on tablets
                              500: { slidesPerView: 2, spaceBetween: 5 }, // 2 slides on tablets
                              600: { slidesPerView: 2, spaceBetween: 5 }, // 2 slides on tablets
                              700: { slidesPerView: 2, spaceBetween: 5 }, // 2 slides on tablets
                              800: { slidesPerView: 3, spaceBetween: 5 }, // 2 slides on tablets
                              1024: { slidesPerView: 3,  spaceBetween: 10}, // 3 slides on desktops
                              1353: { slidesPerView: 4,  spaceBetween: 10} // 3 slides on desktops
                            }}
                          //#endregion
                          >
                            {
                              item.contents_table.length > 0
                              ?
                                item.contents_table.map((item_content, index_content) =>(
                                  item_content.translation_dependent
                                  ?
                                    (
                                      item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current) &&
                                      <SwiperSlide key={index_content} className='flex justify-center'>
                                      {
                                        item_content.uploads_table_main_view.upload_type == "video"
                                        ? <VideoEmbedURLContent item_content={item_content} item={item} />
                                        : 
                                          <CardTypeHomeContent item={item} item_content={item_content} />
                                      }
                                      </SwiperSlide>
                                    )
                                  : 
                                    (
                                      selectedLanguage.current == null
                                      ?
                                        <SwiperSlide key={index_content} className='flex justify-center'>
                                        {
                                          item_content.uploads_table_main_view.upload_type == "video"
                                          ? <VideoEmbedURLContent item_content={item_content} item={item} />
                                          : <CardTypeHomeContent item={item} item_content={item_content} />
                                        }
                                        </SwiperSlide>
                                      :
                                        <SwiperSlide key={index_content} className='flex justify-center'>
                                          <CardTypeHomeContent item={item} item_content={item_content} />
                                        </SwiperSlide>
                                    )
                                ))
                              :
                                (
                                  ResultGetHomeContents.length <= 0 &&
                                  [1, 2, 3].map((item, index) =>(
                                    <SwiperSlide key={index} className='flex justify-center mb-10'>
                                      <HomeCard loading={true}/>
                                    </SwiperSlide>  
                                  ))
                                )
                            }
                          </Swiper>
                        }
                      </div>  
                    ))
                  :
                  (
                    ResultGetHomeContents.length <= 0 &&
                    <div>
                      <SwiperLoading/>
                    </div>
                  )
                }
              </div>
            </div>
        }
      </main>
    </div>
  )
}

export default HomeContent