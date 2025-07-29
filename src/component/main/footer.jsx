import React, { useState, useEffect } from 'react';
import {useSelector} from 'react-redux';

import { FaTiktok } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { Link } from "react-router-dom";

const Footer = () => {

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

  const [footerData] = useState({
    company: {
      name: 'Club TEN',
      description: 'Connect with friends and create community in CLUB TEN.',
      socials: [
        { icon: <FaFacebookF size={20} />, href: 'https://www.facebook.com/clubtenglobal' },
        { icon: <FaTiktok size={20} />, href: 'https://www.tiktok.com/@clubtenglobal' },
        { icon: <FaInstagram size={20} />, href: 'https://instagram.com/clubtenglobal' },
        { icon: <IoLogoYoutube size={20} />, href: 'https://www.youtube.com/@ClubTENglobal' },
      ],
    },
    links: {
      quick: [
        <span className="about_us_label_id">About Us</span>,
        <span className="events_label_id">Events</span>,
        <span className="blog_label_id">Blog</span>,
        <span className="contact_us_label_id">Contact Us</span>
      ],
      legal: [
        <span className="privacy_policy_label_id">Privacy Policy</span>,
        <span className="terms_of_service_label_id">Terms of Service</span>,
        <span className="cookie_policy_label_id">Cookie Policy</span>
      ]
    },
    contact: {
      website: 'https://www.clubtenglobal.com/',
      phone: '+1 (000) 000-0000',
    },
  });

  return (
    <footer className="text-white bg-gray-900">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white company_name_label_id">{footerData.company.name}</h3>
            <p className="text-sm text-gray-300 company_description_label_id">{footerData.company.description}</p>
            <div className="flex space-x-4">
              {footerData.company.socials.map((social, index) => (
                <a key={index} href={social.href} className="text-gray-300 transition-colors hover:text-blue-400">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white quick_links_label_id">Quick Links</h3>
            <ul className="space-y-2">
              {footerData.links.quick.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-300 transition-colors hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white legal_label_id">Legal</h3>
            <ul className="space-y-2">
              {footerData.links.legal.map((link, index) => (
                <li key={index}>
                  <Link to={'/policy'}>
                  <a href="#" className="text-sm text-gray-300 transition-colors hover:text-white">
                    {link}
                  </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          {/* <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-gray-400" />
                <span className="text-sm text-gray-300">{footerData.contact.website}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-gray-400" />
                <span className="text-sm text-gray-300">{footerData.contact.phone}</span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 mt-8 border-t border-gray-800">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="text-sm text-gray-400">
              <span className='copyright_label_id'>Copyright</span>
              <span>© </span>
              <span>{new Date().getFullYear()} </span>
              <span>-</span>
              <span className='all_rights_reserved_label_id'>All right reserved</span>
            </div>
            <div className="flex space-x-6">
              {footerData.links.legal.slice(0, 2).map((link, index) => (
                <a key={index} href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )

}

export default Footer;
