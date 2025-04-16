import React, {useEffect} from 'react'
import {useSelector} from 'react-redux';
import Logo2 from '../../assets/images/ten/logo2.png'

import { Link } from "react-router-dom";

import {
  Globe,
  UserCicle
} from '../../assets/icons/index'

const Header = ({
  handleLanguageVisibility,
  onPressAction, 
  ActionState
}) => {

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
            })
          } else if (targetElement.length > 0) {
            Array.from(targetElement).forEach((el) => {
              el.textContent = item.page_config_title;
            })
          }
        }
      }
    })
  },[auth_states])
  //#endregion

  return (
    <div>
      <header className="bg-[#001d3d]">
        <nav className="container relative flex items-center justify-between px-6 mx-auto text-white">
          <Link to={'/'}>
            <a href="#" className='flex items-center'>
              <img
                className="w-[60px] md:w-[100px]"
                alt="Tailwind CSS chat bubble component"
                src={Logo2} />
            </a>
          </Link>

          <button onClick={onPressAction} className="md:hidden">
            {!ActionState ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <div
            className={`place-content-center grid grid-cols-1 absolute inset-x-0 z-30 w-full px-6 py-8 mt-4 space-y-6 transition-all duration-300 ease-in-out bg-[#2596be]  top-16 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:space-y-0 md:-mx-6 md:flex md:items-center ${
              ActionState ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full'
            }`}
          >
            <button onClick={handleLanguageVisibility}>
              <div className='flex items-center justify-center'>
                <Globe/>
                <p className='ml-2 language_id'>Language</p>
              </div>
            </button>
            <div className='flex items-center justify-center md:px-10 '>
              <UserCicle/>
              <Link to={'login'}>
                <a href="#" className="block ml-2 text-white transition-colors duration-300 login_id hover:text-indigo-300">Login</a>
              </Link>
            </div>
            <div className='flex items-center justify-center md:px-10 '>
              <Link to={'login'}>
                <a href="#"  className="px-5 py-2 text-sm font-semibold border rounded-lg create_account">Create account</a>
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default Header;
