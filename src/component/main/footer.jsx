import React, { useState } from 'react';
import Logo1 from '../../assets/images/ten/logo.png';
import Logo2 from '../../assets/images/ten/logo2.png';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone } from 'lucide-react';
import { FaTiktok } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";

export default function FooterWrapper() {
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
      quick: ['About Us', 'Events', 'Blog', 'Contact Us'],
      legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
    },
    contact: {
      website: 'https://www.clubtenglobal.com/',
      phone: '+1 (000) 000-0000',
    },
  });

  const Footer = () => {
    return (
      <footer className="text-white bg-gray-900">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">{footerData.company.name}</h3>
              <p className="text-sm text-gray-300">{footerData.company.description}</p>
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
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
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
              <h3 className="text-lg font-semibold text-white">Legal</h3>
              <ul className="space-y-2">
                {footerData.links.legal.map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-sm text-gray-300 transition-colors hover:text-white">
                      {link}
                    </a>
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
                Copyright © {new Date().getFullYear()} - All right reserved
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
    );
  };

  return <Footer />;
}
