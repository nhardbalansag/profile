import React, {useEffect} from 'react'
import {useSelector} from 'react-redux';

import Logo1 from '../../assets/images/ten/logo.png'
import Logo2 from '../../assets/images/ten/logo2.png'
import TenBG2 from '../../assets/images/ten/tenBg2.png'

const LoginContent = () =>{

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
    <div className=''>
      <main className=''>
        <div className="flex items-center justify-center bg-gray-100">
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
              <div>
                <img
                className="w-[100%]"
                alt="Tailwind CSS chat bubble component"
                src={TenBG2} />
              </div>
            </div>

            {/* Right Section */}
            <div className="p-4 space-y-6 bg-blue-600 md:p-10">
              {/* Login Form */}
              <div className="p-6 space-y-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold login_id">Log In</h2>
                <div className="grid grid-cols-1 space-y-3 md:space-y-0 md:space-x-3 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Email"
                    className="input input-bordered"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="input input-bordered"
                  />
                </div>
                <div className="flex items-center justify-between space-x-5">
                  <button className="text-white bg-blue-600 btn login_id">Login</button>
                  <a href="#" className="text-sm font-medium text-blue-500 forgot_your_password_id">
                    Forgot your password?
                  </a>
                </div>
              </div>

              {/* Signup Form */}
              <div className="p-6 space-y-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold">Sign Up</h2>
                <p className="text-sm font-medium text-gray-600 its_quick_and_easy_id">It’s quick and easy.</p>
                <div className="grid grid-cols-1 space-y-3 md:space-y-0 md:grid-cols-2 md:space-x-3">
                  <input
                    type="text"
                    placeholder="First name"
                    className="input input-bordered input-md"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    className="input input-bordered input-md"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Mobile number or Email"
                  className="w-full input input-bordered input-md"
                />
                <p className="text-sm text-gray-500 you_need_to_confirm_email_id">
                  You’ll need to confirm that email or phone belongs to you.
                </p>
                <div className="grid grid-cols-1 space-y-3 md:grid-cols-2 md:space-y-0 md:space-x-3">
                  <input
                    type="password"
                    placeholder="Password"
                    className=" input input-bordered input-md"
                  />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className=" input input-bordered input-md"
                  />
                </div>
                <p className="text-sm text-gray-500 use_more_character_id">
                  Use 8 or more characters with a mix of letters, numbers & symbols
                </p>
                <button className="text-white bg-blue-600 btn sign_in_id">Sign In</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginContent