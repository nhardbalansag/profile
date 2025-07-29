import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';

import * as api_content from '../../services/content/content.api'

const MallGrow = () => {

  const auth_states = useSelector(state => state.AuthReducer);

  const [loadingContent, setLoadingContent] = useState(true);
  
  const [ResultGetHomeContents, ResultSetHomeContents] = useState(null);

  const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)  // null means main translation is used

  const ShowContent = async() =>{
    setLoadingContent(true)

    await api_content.GetGrowPageContent(auth_states.StateToken).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        if (result.data.data) {
          ResultSetHomeContents(result.data.data)
        }
      }
    }).catch((err) =>{
      console.log("ShowContent", err)
    })
  }

  useEffect(()=>{
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

  return (
    <div className='mb-[150px] flex justify-center'>
      <div className='flex justify-center w-[90%] md:w-[70%] my-10'>
        {
          loadingContent
          ? 
            <div className='w-full'>
              <LoadComp/>
            </div>
          :
            ResultGetHomeContents &&
            <div 
            className="quill-content"
            dangerouslySetInnerHTML={{
            __html: selectedLanguage.current == null 
                    ? ResultGetHomeContents.content_description
                    : 
                        JSON.parse(ResultGetHomeContents.translations)
                        ?
                            (
                                JSON.parse(ResultGetHomeContents.translations).find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                ? JSON.parse(ResultGetHomeContents.translations).find((filter_item) => filter_item.language_id == selectedLanguage.current).content_description
                                : ResultGetHomeContents.content_description
                            )
                        : ResultGetHomeContents.content_description
            }} 
            ></div>
        }
      </div>
    </div>
  );
};

export default MallGrow;

