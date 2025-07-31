import React, {useState, useEffect} from 'react'
import { useDispatch } from "react-redux";
import {useSelector} from 'react-redux';
import { IoIosCloseCircleOutline } from "react-icons/io";

import * as AuthAction from '../../store/auth/authAction'

const LanguageBottomSheet = ({
    handleClose,
    selected,
    handleSelectContent,
    DataContent = []
}) => {

    const dispatch = useDispatch()

    const [getSelectItem, selectItem] = useState("")

    const SelectContent = (item) => {
        selectItem(item)
        handleSelectContent(item)
        // if(item.id == 1){
        //     window.location.reload();
        // }
        dispatch(AuthAction.AddSelectedLanguage(item))
    }

    useEffect(() =>{
        selectItem(selected)
        handleSelectContent(selected)
    },[])

    //#region translation convertion
    const auth_states = useSelector(state => state.AuthReducer);

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
    },[auth_states])
    //#endregion
      
    return (
        <div 
        style={{zIndex: 3000}}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40">
            <div className="w-full md:max-w-[80%] md:p-4 p-2 transition-transform bg-white shadow-lg rounded-t-2xl max-h-[90%] overflow-y-auto">
                <div className='flex justify-end'>
                    <button onClick={handleClose} className='flex items-center justify-center p-1 mr-2'>
                        <IoIosCloseCircleOutline  className="text-[23px] text-[#ff4949]" />
                    </button>
                </div>
                <div>
                    <p className='font-bold text-[20px] md:text-[30px] choose_language_id'>Choose language</p>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4">
                {DataContent.map((item_content, item_key) => {
                    return (
                        <button
                            key={item_key}
                            onClick={() => SelectContent(item_content)}
                            className={`text-left border rounded-lg p-2 transition-all duration-200 
                                ${
                                    getSelectItem.id == item_content.id
                                    ?   'border-black bg-gray-100 font-semibold'
                                    :   'border-transparent hover:bg-gray-50'
                                }
                            `}
                        >
                            <p>{item_content.language_name}</p>
                            <p className="text-sm text-gray-500">{item_content.language_locale}</p>
                        </button>
                    )
                })}
                </div>
            </div>
        </div>
    )
}

export default LanguageBottomSheet