import React, { useState, useRef } from 'react';

import Logo1 from '../../assets/images/ten/logo.png'
import Logo2 from '../../assets/images/ten/logo2.png'
import TenBG2 from '../../assets/images/ten/tenBg2.png'

const LoginContent = () =>{

  return (
    <div className=''>
      <main className=''>
        <div className="flex items-center justify-center bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Section */}
            <div className="flex flex-col items-center justify-center p-10 space-y-5 text-center">
              <div className="flex flex-col items-center mx-auto text-center">
                <h1 className="text-[30px] font-extrabold text-[#063970] uppercase relative ">WELCOME TO CLUB </h1>
                <img
                className="w-[40%]"
                alt="Tailwind CSS chat bubble component"
                src={Logo1} />
              </div>
              <p className="mb-6 md:text-2xl md:w-[300px]">
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
                <h2 className="text-xl font-bold">Log In</h2>
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
                  <button className="text-white bg-blue-600 btn">Login</button>
                  <a href="#" className="text-sm font-medium text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              {/* Signup Form */}
              <div className="p-6 space-y-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold">Sign Up</h2>
                <p className="text-sm font-medium text-gray-600">It’s quick and easy.</p>
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
                <p className="text-sm text-gray-500">
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
                <p className="text-sm text-gray-500">
                  Use 8 or more characters with a mix of letters, numbers & symbols
                </p>
                <button className="text-white bg-blue-600 btn">Sign In</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginContent