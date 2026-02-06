// MaintenancePage.jsx
import React, {useState, useEffect } from 'react'
import { FaTools, FaClock, FaEnvelope } from 'react-icons/fa';

import Logo2 from '../../assets/images/ten/logo2.png'

const MaintenancePage = () => {

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (window.Tawk_API) return;

        var Tawk_API = window.Tawk_API || {};
        var Tawk_LoadStart = new Date();

        const s1 = document.createElement("script");
        const s0 = document.getElementsByTagName("script")[0];

        s1.async = true;
        s1.src = "https://embed.tawk.to/6981181a16f76a1c388d4033/1jgg4ca3r";
        s1.charset = "UTF-8";
        s1.setAttribute("crossorigin", "*");

        s0.parentNode.insertBefore(s1, s0);

        window.Tawk_API = Tawk_API;
        window.Tawk_LoadStart = Tawk_LoadStart;
    }, [])

    const toggleChat = () => {
        if (!window.Tawk_API) return;

        if (visible) {
            window.Tawk_API.hideWidget();
        } else {
            window.Tawk_API.showWidget();
        }

        setVisible(!visible);
    }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 text-white bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-blue-500 rounded-full">
            <img
            className="w-[70px] md:w-[100px]"
            src={Logo2} />
          </div>
          <h1 className="mb-4 text-4xl font-bold">Under Maintenance</h1>
          <div className="flex items-center justify-center gap-2 mb-6 text-blue-300">
            <FaClock />
            <p className="text-lg">We'll be back soon!</p>
          </div>
        </div>

        <div className="p-8 mb-8 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-2xl">
          <h2 className="mb-4 text-2xl font-semibold">Scheduled Maintenance</h2>
          <p className="mb-6 text-gray-300">
            We're currently performing scheduled maintenance to improve your experience. 
            Our team is working hard to bring everything back online as quickly as possible.
          </p>
          
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
            <div className="p-4 bg-gray-700/30 rounded-xl">
              <h3 className="mb-2 font-semibold text-blue-300">Estimated Time</h3>
              <p className="text-xl font-bold">1 - 2 Hours</p>
              <p className="mt-1 text-sm text-gray-400">May vary depending on updates</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-gray-400">
            <FaEnvelope />
            <span>Need immediate assistance?</span>
          </div>
          <button
            // onClick={() => toggleChat()} 
            className="px-6 py-3 font-medium transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Contact support from here
          </button>
        </div>

        <div className="pt-6 mt-8 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            Thank you for your patience. We appreciate your understanding while we work to 
            provide you with a better experience.
          </p>
        </div>
      </div> 
    </div>
  )
}

export default MaintenancePage;