import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";

import Swal from 'sweetalert2';

import Logo1 from '../../assets/images/ten/logo.png'
import Logo2 from '../../assets/images/ten/logo2.png'
import TenBG2 from '../../assets/images/ten/tenBg2.png'

import {
  setItem,
  clear
} from '../../store/store-index'

import { STORAGE_USER_INFORMATION, STORAGE_TOKEN } from '../../store/auth/authAction';
import * as auth_service_api from '../../services/auth/auth.api'
import * as AuthAction from '../../store/auth/authAction'

const LoginContent = () =>{

  //#region translation convertion
  const auth_states = useSelector(state => state.AuthReducer);

  const dispatch = useDispatch()

  const [isLoading, setLoading] = useState(false)
  const [isLoadingRegister, setLoadingRegister] = useState(false)
  const [getRequest, setRequest] = useState({
    email: "",
    password: ""
  })

  const [getRegisterForm, setRegisterForm] = useState({
    first_name  : "",
    last_name   : "",
    email       : "",
    password    : "",
  })


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

  
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    
    setRequest((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleChangeForRegister = (e) => {
    const { name, type, checked, value } = e.target;
    
    setRegisterForm((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const RegisterUser = async (event) =>{
    event.preventDefault();

    if (
      !getRegisterForm.email || 
      !getRegisterForm.password || 
      !getRegisterForm.first_name || 
      !getRegisterForm.last_name) {
      return;
    }
    
    setLoadingRegister(true)

    const requestBody = {
      "first_name": getRegisterForm.first_name,
      "last_name": getRegisterForm.last_name,
      "email": getRegisterForm.email,
      "password": getRegisterForm.password
    }

    await auth_service_api.RegisterUser(requestBody).then((result) =>{

      var token = result.data.token
      var userInformation = result.data.data

      setItem(STORAGE_TOKEN, token)
      setItem(STORAGE_USER_INFORMATION, JSON.stringify(userInformation))

      dispatch(AuthAction.LoginUser(token, userInformation))
      setLoadingRegister(false)
      
    }).catch((err) =>{
      setLoadingRegister(false)
      setToastVisibility(true)
      setToastMessage(err)
    })
  }
  
  const LoginUser = async (event) =>{
    event.preventDefault();

    if (!getRequest.email || !getRequest.password) {
      return;
    }
    
    setLoading(true)

    const requestBody = {
      "email": getRequest.email,
      "password": getRequest.password
    }

    await auth_service_api.LoginUser(requestBody).then((result) =>{

      var token = result.data.token
      var userInformation = result.data.data

      setItem(STORAGE_TOKEN, token)
      setItem(STORAGE_USER_INFORMATION, JSON.stringify(userInformation))

      dispatch(AuthAction.LoginUser(token, userInformation))
      setLoading(false)
      
    }).catch((err) =>{
      setLoading(false)
      setToastVisibility(true)
      setToastMessage(err)
    })
  }

  return (
    <div className=''>
      <main className=''>
        <div className="flex items-center justify-center bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Section */}
            <div className="flex flex-col items-center justify-center p-10 space-y-5 text-center">
              <div className="flex flex-col items-center mx-auto text-center">
                <h1 className="text-[30px] font-extrabold text-[#063970] uppercase relative welcome_to_club_ten_id">WELCOME TO CLUB </h1>
                <img
                className="w-[40%]"
                alt="Tailwind CSS chat bubble component"
                src={Logo1} />
              </div>
              <p className="mb-6 md:text-2xl md:w-[300px] connect_with_friends_caption_id">
                Connect with friends and create community in CLUB TEN
              </p>
              {/* <div>
                <img
                className="w-[100%]"
                alt="Tailwind CSS chat bubble component"
                src={TenBG2} />
              </div> */}
            </div>

            {/* Right Section */}
            <div className="p-4 space-y-6 bg-blue-600 md:p-10">
              {/* Login Form */}
              <form onSubmit={(event) => LoginUser(event)}>
                <div className="p-6 space-y-4 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-bold login_id">Log In</h2>
                  <div className="grid grid-cols-1 space-y-3 md:space-y-0 md:space-x-3 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Email"
                      className="input input-bordered"
                      name='email'
                      value={getRequest.email} 
                      onChange={handleChange}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="input input-bordered"
                      name='password'
                      value={getRequest.password} 
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-5">
                    <button className="flex items-center justify-center text-white bg-blue-600 btn login_id">
                      {
                        isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Log In"
                      }
                    </button>
                    <a href="#" className="text-sm font-medium text-blue-500 forgot_your_password_id">
                      Forgot your password?
                    </a>
                  </div>
                </div>
              </form>
              {/* Signup Form */}
              {/* <form onSubmit={(event) => RegisterUser(event)}>
                <div className="p-6 space-y-4 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-bold sign_in_id">Sign Up</h2>
                  <p className="text-sm font-medium text-gray-600 its_quick_and_easy_id">It’s quick and easy.</p>
                  <div className="grid grid-cols-1 space-y-3 md:space-y-0 md:grid-cols-2 md:space-x-3">
                    <input
                      type="text"
                      placeholder="First name"
                      className="input input-bordered input-md"
                      name='first_name'
                      value={getRegisterForm.first_name} 
                      onChange={handleChangeForRegister}
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      className="input input-bordered input-md"
                      name='last_name'
                      value={getRegisterForm.last_name} 
                      onChange={handleChangeForRegister}
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Mobile number or Email"
                    className="w-full input input-bordered input-md"
                    name='email'
                    value={getRegisterForm.email} 
                    onChange={handleChangeForRegister}
                  />
                  <p className="text-sm text-gray-500 you_need_to_confirm_email_id">
                    You’ll need to confirm that email or phone belongs to you.
                  </p>
                  <div className="grid grid-cols-1 space-y-3 md:grid-cols-2 md:space-y-0 md:space-x-3">
                    <input
                      type="password"
                      placeholder="Password"
                      className=" input input-bordered input-md"
                      name='password'
                      value={getRegisterForm.password} 
                      onChange={handleChangeForRegister}
                    />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      className=" input input-bordered input-md"
                      name='password'
                      value={getRegisterForm.password} 
                      onChange={handleChangeForRegister}
                    />
                  </div>
                  <p className="text-sm text-gray-500 use_more_character_id">
                    Use 8 or more characters with a mix of letters, numbers & symbols
                  </p>
                  
                  <button 
                  onClick={() => RegisterUser()} 
                  className="text-white bg-blue-600 btn sign_in_id">
                  {
                    isLoadingRegister ? <span className="loading loading-spinner loading-sm"></span> : "Sign In"
                  }
                  </button>
                  </div>
              </form> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginContent