import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import {
    Header,
    LanguageBottomSheet
} from '../../component/index'

import Quill from 'quill';

import { FaUsers, FaShoppingBag, FaUser } from "react-icons/fa";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuTickets } from "react-icons/lu";
import { TiHomeOutline } from "react-icons/ti";

import * as api_content from '../../services/content/content.api'

const env = import.meta.env;

const DetailsPage = () =>{

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const auth_states = useSelector(state => state.AuthReducer);

    const [open, setOpen] = useState(false)
    const [getOpenLanguageSelection, setOpenLanguageSelection] = useState(false)
    const [getSelectedLanguage, setSelectedLanguage] = useState("")
  

  const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)  // null means main translation is used
 
  const [ResultGetHomeContents, ResultSetHomeContents] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);

  const ShowContent = async() =>{
    setLoadingContent(true)

    const id = searchParams.get('view')
    await api_content.ShowContent(id).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        ResultSetHomeContents(result.data.data)
        console.log(result)
      }
    }).catch((err) =>{
      console.log("ShowContent", err)
    })
  }

  useEffect(() =>{
    ShowContent()
  },[])

  useEffect(() =>{
    if(auth_states.SelectedLanguage){
      selectedLanguage.current = parseInt(auth_states.SelectedLanguage.id)
      ShowContent()
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

  // const TabItem = ({ icon, label, active, path }) =>{

  //   return (
  //     <Link to={path}>
  //       <div className={`flex flex-col items-center ${active ? "text-white" : "text-gray-400"} `}>
  //         <div className="mb-1 text-lg">{icon}</div>
  //         <span className="text-[14px]">{label}</span>
  //       </div>
  //     </Link>
  //   )
  // }

  const BottomTabNavigator = () =>{
    return (
      <div 
      style={{
        position: 'fixed',
        height: '70px',
        zIndex: 1000
      }}
      className="md:hidden bottom-4 left-1/2 transform -translate-x-1/2 bg-[#031956] text-white rounded-xl px-4 py-1 flex justify-between items-center w-[90%] space-x-6 shadow-lg">
        <Link to={'/'}>
          <div className={`flex flex-col items-center ${active ? "text-white" : "text-gray-400"} `}>
            <div className="mb-1 text-lg"><TiHomeOutline size={20}/></div>
            <span className="text-[14px] home_label_id">Home</span>
          </div>
        </Link>
        <Link to={'/event'}>
          <div className={`flex flex-col items-center ${active ? "text-white" : "text-gray-400"} `}>
            <div className="mb-1 text-lg"><LuTickets size={20}/></div>
            <span className="text-[14px] events_label_id">Events</span>
          </div>
        </Link>
        <Link to={'/account'}>
          <div className={`flex flex-col items-center ${active ? "text-white" : "text-gray-400"} `}>
            <div className="mb-1 text-lg"><HiMiniBuildingOffice2 size={20}/></div>
            <span className="text-[14px] office_label_id">Office</span>
          </div>
        </Link>
        <Link to={'/details'}>
          <div className={`flex flex-col items-center ${active ? "text-white" : "text-gray-400"} `}>
            <div className="mb-1 text-lg"><FaRegCircleUser size={20}/></div>
            <span className="text-[14px] profile_label_id">Profile</span>
          </div>
        </Link>
      </div>
    )
  }

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

  const editorRef = useRef(ResultGetHomeContents.content_description);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic'],
            ['link', 'image'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ]
        }
      });

      // Paste HTML directly
      quillRef.current.clipboard.dangerouslyPasteHTML(
        ResultGetHomeContents.content_description
      );
    }
  }, []);

    const EmbeddedVideoUrl = ({type, videoId}) => {
      return (
        <div  className=' w-[100%] h-[100%] '>
          <div className="w-full overflow-hidden rounded-lg aspect-video ">
            {
              type == "embed" 
              ? 
                (
                  <iframe
                    src={videoId + "&autoplay=0"}
                    title="Embedded video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                  />
                ) 
              : 
                ( 
                  type === "video"
                  ?
                      <video
                      src={env.VITE_APP_BACKEND_STORAGE_URL +  videoId }
                      controls
                      className="object-cover w-full h-full rounded-lg"
                      />  
                  : <></>
                )
            }
          </div>
        </div>
      )
  }
  return (
    <div>
        <div>
            <Header 
            handleLanguageVisibility={() => setOpenLanguageSelection(true)}
            onPressAction={() => setOpen(!open)} 
            ActionState={open}
            />
        </div>
      <main >

        {
          loadingContent
          ? 
            <div className='flex justify-center my-5'>
              <div className='md:w-[75%] w-[95%]'>
                <LoadComp/>
              </div>
            </div>
          :
          <div className='mb-[150px] flex justify-center'>
              <div className='flex justify-center w-[90%] md:w-[70%]'>
                  <div className='md:w-[75%] w-[95%] space-y-5'>
                      <p className='font-bold text-[#001d3d] text-[35px] capitalize'>
                        {
                          selectedLanguage.current == null 
                          ? ResultGetHomeContents.content_title
                          : 
                            ResultGetHomeContents.translation
                            ?
                              (
                                  ResultGetHomeContents.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                ? ResultGetHomeContents.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_title
                                : ResultGetHomeContents.content_title
                              )
                            : ResultGetHomeContents.content_title
                        }
                      </p>
                      {
                        ResultGetHomeContents.content_category.category_display_content.display.content_home_style.embed_video_url
                        ?
                          <EmbeddedVideoUrl 
                          type={ResultGetHomeContents.uploads_table_main_view.upload_type}
                          videoId={ResultGetHomeContents.uploads_table_main_view.upload_url}
                          />
                        :
                          <div className='flex justify-start'>
                            <img
                            src={
                                ResultGetHomeContents.uploads_table_main_view.upload_type === "url" 
                                ? ResultGetHomeContents.uploads_table_main_view.upload_url 
                                : env.VITE_APP_BACKEND_STORAGE_URL + ResultGetHomeContents.uploads_table_main_view.upload_url
                            }
                            alt=""  
                            className="object-contain w-full md:w-[500px] "
                            />
                          </div>
                      }

                      {
                        ResultGetHomeContents.content_date_from &&
                        ResultGetHomeContents.content_date_to &&
                        <div className='my-5 text-left'>
                          <p className='text-[#001d3d] capitalize'> 
                              <span className='font-bold from_id'>from </span> 
                              <span>{ResultGetHomeContents.content_date_from}</span>
                          </p>
                          <p className='text-[#001d3d] capitalize'>
                              <span className='font-bold to_id'>to </span> 
                              <span>{ResultGetHomeContents.content_date_to}</span>
                          </p>
                        </div>
                      }

                      {
                        ResultGetHomeContents.content_date_from &&
                        ResultGetHomeContents.content_date_to &&
                        <p className='text-[#001d3d] capitalize space-x-3 text-left my-5'>
                          <span className='font-bold duration_id'>Duration </span> 
                          <span className='days_id'>{ResultGetHomeContents.content_days_count} days</span>
                          <span className='nights_id'>{ResultGetHomeContents.content_night_count} nights</span>
                        </p>
                      }
                      
                    <div 
                      className="quill-content"
                      dangerouslySetInnerHTML={{
                      __html: selectedLanguage.current == null 
                              ? ResultGetHomeContents.content_description
                              : 
                                ResultGetHomeContents.translation
                                ?
                                  (
                                      ResultGetHomeContents.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                    ? ResultGetHomeContents.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_description
                                    : ResultGetHomeContents.content_description
                                  )
                                : ResultGetHomeContents.content_description
                      }} 

                    ></div>

                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                      {
                        ResultGetHomeContents.uploads_table.map((item) => (
                          item.upload_type === "url"
                          ?
                            <img
                            src={item.upload_url }
                            alt=""  
                            className="object-contain w-full"
                            />
                          :
                          (
                            item.upload_type === "image"
                            ?
                              <img
                              src={env.VITE_APP_BACKEND_STORAGE_URL + item.upload_url}
                              alt=""  
                              className="object-contain w-full h-[400px]"
                              />
                            :
                              <EmbeddedVideoUrl type={item.upload_type} videoId={item.upload_url}/>
                          )
                        ))
                      }
                    </div>

                  </div>
              </div>
          </div>
        }
      </main>

      {
        getOpenLanguageSelection
        && 
        <LanguageBottomSheet 
        selected={getSelectedLanguage}
        handleSelectContent={(event) => setSelectedLanguage(event)}
        handleClose={() => setOpenLanguageSelection(false)} 
        DataContent={auth_states.Languages}/>
      }

      <BottomTabNavigator/>
    </div>
  )
}

export default DetailsPage