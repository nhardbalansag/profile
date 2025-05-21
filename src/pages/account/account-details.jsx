import { useState } from "react";
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaLanguage, FaEnvelope } from 'react-icons/fa';
import {useSelector} from 'react-redux';

const AccountDetails = () =>{

  const auth_states = useSelector(state => state.AuthReducer);

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
          {/* Main Content */}
          <div className="flex-1">
            <p className="mb-4 text-sm text-gray-500">
              Manage your personal information, including phone numbers and email address where you can be contacted
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* <InfoCard label="Name" value={`${auth_states.StateUserInformation.first_name} ${auth_states.StateUserInformation.last_name}`} icon={<FaUser />} /> */}
              {/* <InfoCard label="Date of Birth" value="07 July 1993" icon={<FaCalendarAlt />} />
              <InfoCard label="Country Region" value="Georgia , Tbilisi" icon={<FaMapMarkerAlt />} />
              <InfoCard label="Language" value="English ( UK ) - English" icon={<FaLanguage />} />
              <InfoCard label="Contactable at" value="ikakodesign@gmail.com" icon={<FaEnvelope />} /> */}
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
