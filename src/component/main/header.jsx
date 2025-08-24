import React, {useEffect} from 'react'
import { useDispatch } from "react-redux";
import {useSelector} from 'react-redux';

import { useLocation, Link } from 'react-router-dom';
import { useSearchParams, useNavigate } from 'react-router-dom';

import Logo2 from '../../assets/images/ten/logo2.png'
import { AiOutlineAlignRight } from "react-icons/ai";
import { IoLanguageOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { AiOutlineLogout } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa6";
import { LuTickets } from "react-icons/lu";
import { FaRegEnvelopeOpen } from "react-icons/fa";
import { GrShieldSecurity } from "react-icons/gr";
import { TiHomeOutline } from "react-icons/ti";
import { MdOutlineTravelExplore } from "react-icons/md";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";

import { LuCircleDollarSign } from "react-icons/lu";
import { IoFitnessOutline } from "react-icons/io5";
import { PiPottedPlantBold } from "react-icons/pi";
import { BiStore } from "react-icons/bi";
import { BiLike } from "react-icons/bi";

import { MdOutlineAirplanemodeActive } from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";

import {
  clear
} from '../../store/store-index'

import * as AuthAction from '../../store/auth/authAction'

const Header = ({
  handleLanguageVisibility,
  onPressAction, 
  ActionState,
  logoutNavigate
}) => {

  const dispatch = useDispatch()

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

  const LogoutUser = async () =>{
    await clear().then((result) =>{
      dispatch(AuthAction.LogoutUser())
      logoutNavigate()
    }).catch((err) =>{
      console.log(err.message)
    })
  }

  const Header = () =>{
    return (
      <div className="flex justify-center my-3 ">
        {/* Right Section */}
        <div className=" md:w-[75%] w-[95%]">
          <div className="flex items-center justify-between ">
            <div>
              
              <Link to={auth_states.StateToken ? "/" : '/login'}>
                <a href="#">
                  <img
                    className="w-[60px] md:w-[100px]"
                    alt="Tailwind CSS chat bubble component"
                    src={Logo2} />
                </a>
              </Link>
            </div>
            <div className='flex items-center '>
              <div className='hidden md:block'>
                <nav className="container relative flex items-center justify-between px-6 mx-auto text-white">
                  <div
                    className={` place-content-center grid grid-cols-1 absolute inset-x-0 z-30 w-full px-6 py-8 mt-4 space-y-6 transition-all duration-300 ease-in-out bg-[#2596be]  
                      top-16 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:space-y-0 md:-mx-6 md:flex md:items-center ${
                      ActionState ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full' 
                    }`}
                  >
                    {
                      auth_states.StateToken &&
                      <button onClick={handleLanguageVisibility}>
                        <a href="#" class={`${("account").includes(location.pathname) ? 'bg-gray-100' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                          <IoLanguageOutline  size={20}/>
                          <p className='language_id text-[#001d3d] capitalize ml-2 '>Language</p>
                        </a>
                      </button>
                    }

                    <div className='flex items-center justify-start space-x-3 md:px-10'>
                      {
                        auth_states.StateToken
                        ?
                          <button onClick={() => {
                            LogoutUser()
                          }}>
                            <a href="#" class={`${("account").includes(location.pathname) ? 'bg-gray-100' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                              <AiOutlineLogout  size={20}/>
                              <p className='logout_id text-[#001d3d] capitalize ml-2 '>Logout</p>
                            </a>
                          </button>
                        :
                          <Link to={'/login'}>
                            <a href="#" class={`${("account").includes(location.pathname) ? 'bg-gray-100' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                              <FaRegCircleUser  size={20}/>
                              <p className='login_id text-[#001d3d] capitalize ml-2 '>Login</p>
                            </a>
                          </Link>
                      }
                      
                    </div>
                  </div>
                </nav>
              </div>
              {
                auth_states.StateToken &&
                <label htmlFor="my-drawer" className="btn btn-square btn-ghost drawer-button">
                  <AiOutlineAlignRight  color='black' size={25}/>
                </label>
              }

              {
                !auth_states.StateToken &&
                <button onClick={handleLanguageVisibility}>
                  <a href="#" class={`${("account").includes(location.pathname) ? 'bg-gray-100' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                    <IoLanguageOutline  size={20}/>
                    <p className='language_id text-[#001d3d] capitalize ml-2 '>Language</p>
                  </a>
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  const DrawerComp = () =>{
    return(
      <div style={{zIndex: 2000}} className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {Header()}
        </div> 
        <div className="z-50 drawer-side">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <div class="flex h-screen ">
            <aside class="  ">
              <nav class="space-y-2 w-64 p-4 border-r border-gray-200  bg-white flex flex-col">
                {
                  auth_states.StateToken &&
                  <Link to={'/'}>
                    <a href="#" class={`${("mall").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                      <TiHomeOutline  size={20}/>
                      <p className='home_label_id text-[#001d3d] capitalize ml-2 '>Home</p>
                    </a>
                  </Link>
                }
                {
                  auth_states.StateToken &&
                  <Link to={'/travel'}>
                    <a href="#" class={`${("mall").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                      <MdOutlineTravelExplore  size={20}/>
                      <p className='travel_label_id text-[#001d3d] capitalize ml-2 '>Travel</p>
                    </a>
                  </Link>
                }
                {
                  auth_states.StateToken &&
                  <Link to={'/academy-index'}>
                    <a href="#" class={`${("mall").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                      <RiGraduationCapLine  size={20}/>
                      <p className='learn_label_id text-[#001d3d] capitalize ml-2 '>Learn</p>
                    </a>
                  </Link>
                }

                {
                  auth_states.StateToken &&
                  <Link to={'/earn'}>
                    <a href="#" class={`${("mall").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                      <LuCircleDollarSign  size={20}/>
                      <p className='earn_label_id text-[#001d3d] capitalize ml-2 '>Earn</p>
                    </a>
                  </Link>
                }

                {
                  auth_states.StateToken &&
                  <Link to={'/grow'}>
                    <a href="#" class={`${("mall").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                      <PiPottedPlantBold  size={20}/>
                      <p className='grow_label_id text-[#001d3d] capitalize ml-2 '>Grow</p>
                    </a>
                  </Link>
                }

                {
                  auth_states.StateToken &&
                  <Link to={'/shop'}>
                    <a href="#" class={`${("mall").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                      <BiStore  size={20}/>
                      <p className='shop_label_id text-[#001d3d] capitalize ml-2 '>Shop</p>
                    </a>
                  </Link>
                }

                {
                  auth_states.StateToken &&
                  <Link to={'/lifestyle'}>
                    <a href="#" class={`${("mall").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                      <IoFitnessOutline  size={20}/>
                      <p className='lifestyle_label_id text-[#001d3d] capitalize ml-2 '>Lifestyle</p>
                    </a>
                  </Link>
                }

                {
                  auth_states.StateToken &&
                  <Link to={'/social'}>
                    <a href="#" class={`${("mall").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                      <BiLike  size={20}/>
                      <p className='social_label_id text-[#001d3d] capitalize ml-2 '>Social</p>
                    </a>
                  </Link>
                }
               
                {
                  auth_states.StateToken &&
                  <Link to={'/event'}>
                    <a href="#" class={`${("mall").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                      <LuTickets  size={20}/>
                      <p className='events_label_id text-[#001d3d] capitalize ml-2 '>events</p>
                    </a>
                  </Link>
                }
                {
                  auth_states.StateToken &&
                  <Link to={'/account'}>
                    <a href="#" class={`${("account").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                      <MdOutlineAccountBalanceWallet  size={20}/>
                      <p className='office_id text-[#001d3d] capitalize ml-2 '>office</p>
                    </a>
                  </Link>
                }
                {
                  auth_states.StateToken &&
                  <Link to={'/details'}>
                    <a href="#" class={`${("details").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                      <FaRegUser  size={20}/>
                      <p className='profile_id text-[#001d3d] capitalize ml-2 '>profile</p>
                    </a>
                  </Link>
                }

                {
                  auth_states.StateToken &&
                  <Link to={'/subscriptions'}>
                    <a href="#" class={`${("mall").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                      <FaRegEnvelopeOpen  size={20}/>
                      <p className='subscription_id text-[#001d3d] capitalize ml-2 '>subscription</p>
                    </a>
                  </Link>
                }
                
                {
                  auth_states.StateToken &&
                  <Link to={'/orders'}>
                    <a href="#" class={`${("mall").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                      <HiOutlineShoppingBag  size={20}/>
                      <p className='orders_id text-[#001d3d] capitalize ml-2 '>orders</p>
                    </a>
                  </Link>
                }

                {
                  auth_states.StateToken &&
                  <Link to={'/security'}>
                    <a href="#" class={`${("mall").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                      <GrShieldSecurity  size={20}/>
                      <p className='security_id text-[#001d3d] capitalize ml-2 '>security</p>
                    </a>
                  </Link>
                }

                <button onClick={handleLanguageVisibility}>
                  <a href="#" class={`${("account").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                    <IoLanguageOutline  size={20}/>
                    <p className='language_id text-[#001d3d] capitalize ml-2 '>Language</p>
                  </a>
                </button>

                {
                  auth_states.StateToken
                  ?
                    <button onClick={() => LogoutUser()}>
                      <a href="#" class={`${("account").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                        <AiOutlineLogout  size={20}/>
                        <p className='logout_id text-[#001d3d] capitalize ml-2 '>Logout</p>
                      </a>
                    </button>
                  :
                    <Link to={'/login'}>
                      <a href="#" class={`${("account").includes(location.pathname) ? '  text-[#001d3d]' : 'hover:bg-gray-100 '} text-gray-600 flex items-center p-2 rounded-lg`}>
                        <FaRegCircleUser  size={20}/>
                        <p className='login_id text-[#001d3d] capitalize ml-2 '>Login</p>
                      </a>
                    </Link>
                }

              </nav>
            </aside>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {DrawerComp()}
    </div>
  )
}

export default Header;
