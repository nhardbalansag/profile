import { useState } from "react";
import {useSelector} from 'react-redux';

import { CiUser } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { CiPhone } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import { FiAward } from "react-icons/fi";
import { IoIosTrendingUp } from "react-icons/io";

const AccountDetails = () =>{

  const auth_states = useSelector(state => state.AuthReducer);

  console.log(auth_states.StateUserInformation)

   const achievements = [
    { title: 'Top Referral', description: 'Sponsored -- members this quarter', icon: FiAward, color: 'text-yellow-600' },
    { title: 'Sales Champion', description: 'Exceeded monthly sales target by --%', icon: IoIosTrendingUp, color: 'text-green-600' },
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: auth_states.StateUserInformation.first_name,
    email: auth_states.StateUserInformation.email,
    phone: auth_states.StateUserInformation.mobile_number ? auth_states.StateUserInformation.mobile_number : "--",
    address:  auth_states.StateUserInformation.current_address ? auth_states.StateUserInformation.current_address :  "--",
    joinDate: "",
    rank: 'Gold',
    nextRank: 'Platinum',
    bio: 'Passionate about health and wellness, helping others achieve their goals through quality products and mentorship.'
  });

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


  const ProfileInfo = () =>{ 
    return(
       <div className="pb-10 space-y-6 lg:col-span-2">
          {/* Basic Information */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="flex items-center mb-6 space-x-6">
              <div className="flex items-center justify-center w-[50px] h-[50px] text-2xl font-bold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                {profileData.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                <p className="text-gray-600">{profileData.email}</p>
                <div className="flex items-center mt-2 space-x-2">
                  {/* <span className="px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">
                    {profileData.rank} Member
                  </span> */}
                  <span className="text-sm text-gray-500">
                    {/* Member since {new Date(profileData.joinDate).toLocaleDateString()} */}
                    Member since --
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-900">
                    <CiUser className="w-4 h-4 text-gray-500"/>

                    <span>{profileData.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-900">
                    <CiMail className="w-4 h-4 text-gray-500" />
                    <span>{profileData.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-900">
                    <CiPhone className="w-4 h-4 text-gray-500" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-900">
                    <FiMapPin className="w-4 h-4 text-gray-500" />
                    <span>{profileData.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Bio</label>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-700">{profileData.bio}</p>
              )}
            </div> */}
          </div>

          {/* Achievements */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Achievements</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center p-3 space-x-3 rounded-lg bg-gray-50">
                  <div className={`p-2 bg-white rounded-lg ${achievement.color}`}>
                    <achievement.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    )
  }
  
  const _AccountDetails = () =>{
    return (
      <div>
        <div className="p-3 ">
          {/* Main Content */}
          <div className="flex-1">
            <p className="mb-4 text-sm text-gray-500">
              Manage your personal information, including phone numbers and email address where you can be contacted
            </p>
            <ProfileInfo/>
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
