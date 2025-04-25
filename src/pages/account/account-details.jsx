import { useState } from "react";
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaLanguage, FaEnvelope } from 'react-icons/fa';

const AccountDetails = () =>{

  const InfoCard = ({ label, value, icon }) =>{
    return (
      <div className="flex items-start justify-between p-4 bg-white rounded-lg shadow ">
        <div className=" w-[100px]">
          <p className="mb-1 text-xs text-gray-500">{label}</p>
          <p className="text-sm font-medium w-[100px]">{value}</p>
        </div>
        <div className="text-lg text-orange-500 ">{icon}</div>
      </div>
    )
  }
  
  const _AccountDetails = () =>{
    return (
      <div>
        <div className="flex min-h-screen p-6 bg-gray-50">
          {/* Sidebar */}
          <aside className="w-64 p-4 mr-6 bg-white rounded-lg shadow">
            <div className="mb-6 text-center">
              <div className="w-20 h-20 mx-auto mb-2 bg-gray-200 rounded-full"></div>
              <h3 className="font-semibold">Irakli talavadze</h3>
              <p className="text-sm text-gray-500">ikakodesign@gmail.com</p>
            </div>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="font-medium text-orange-600">Personal information</a>
              <a href="#" className="text-gray-600 hover:text-orange-600">Billing & Payments</a>
              <a href="#" className="text-gray-600 hover:text-orange-600">Order History</a>
              <a href="#" className="text-gray-600 hover:text-orange-600">Gift Cards</a>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <p className="mb-4 text-sm text-gray-500">
              Manage your personal information, including phone numbers and email address where you can be contacted
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoCard label="Name" value="irakli talavadze" icon={<FaUser />} />
              <InfoCard label="Date of Birth" value="07 July 1993" icon={<FaCalendarAlt />} />
              <InfoCard label="Country Region" value="Georgia , Tbilisi" icon={<FaMapMarkerAlt />} />
              <InfoCard label="Language" value="English ( UK ) - English" icon={<FaLanguage />} />
              <InfoCard label="Contactable at" value="ikakodesign@gmail.com" icon={<FaEnvelope />} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <_AccountDetails/>
    </div>  
  ) 
}

export default AccountDetails