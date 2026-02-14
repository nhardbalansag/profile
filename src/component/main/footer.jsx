import React from 'react';
import { 
  FaFacebook, FaTwitter, FaLinkedin, FaInstagram, 
  FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, 
  FaClock, FaGlobe, FaArrowUp
} from 'react-icons/fa';

import companylogo from "../../assets/628210679_911109021849665_4676745845885491336_n.png"

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Websites', href: '/websites' },
    { name: 'Contact', href: '/contact' }
  ];

  const services = [
    { name: 'Web Development', href: '#' },
    { name: 'E-commerce Solutions', href: '#' },
    { name: 'Hosting Services', href: '#' },
    { name: 'IT Consulting', href: '#' },
    { name: 'Technical Support', href: '#' }
  ];

  const socialLinks = [
    { icon: <FaFacebook className="w-5 h-5" />, href: 'https://www.facebook.com/profile.php?id=100086326330214', label: 'Facebook' },
    // { icon: <FaTwitter className="w-5 h-5" />, href: 'https://twitter.com/coresite', label: 'Twitter' },
    // { icon: <FaLinkedin className="w-5 h-5" />, href: 'https://linkedin.com/company/coresite', label: 'LinkedIn' },
    // { icon: <FaInstagram className="w-5 h-5" />, href: 'https://instagram.com/coresite', label: 'Instagram' },
    // { icon: <FaYoutube className="w-5 h-5" />, href: 'https://youtube.com/coresite', label: 'YouTube' }
  ];

  return (
    <footer id="contact" className="bg-[#001d3d] text-gray-300">
      {/* Main Footer */}
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          
          {/* Company Info */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src={companylogo} 
                alt="DCODE IT Solutions Logo" 
                className="object-contain w-12 h-12"
              />
              <div>
                <h3 className="text-2xl font-bold text-white">DCODE</h3>
                <p className="text-xs tracking-wider text-blue-400">IT SOLUTIONS</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-400">
              <span className="font-semibold text-white">DCODE Information Technology Solutions Inc.</span> provides innovative technology solutions for businesses of all sizes.
            </p>
            
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <FaPhone className="flex-shrink-0 w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">+63 921 440 8767</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="flex-shrink-0 w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">support@coresite.pro</span>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="flex-shrink-0 w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Mon-Fri: 9:00 AM - 6:00 PM (PHT)</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4 lg:col-span-1">
            <h3 className="text-lg font-bold text-white">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a 
                    href={service.href}
                    className="inline-flex items-center text-sm text-gray-400 transition-colors duration-200 hover:text-blue-400 hover:translate-x-1"
                  >
                    <span className="mr-2 text-blue-400">›</span>
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CoreSite & Social */}
          <div className="space-y-4 lg:col-span-1">
            <div className="p-5 rounded-lg bg-[#002856]">
              <h3 className="mb-2 text-lg font-bold text-white">CoreSite</h3>
              <p className="mb-3 text-sm text-gray-400">Your trusted hosting partner powered by DCODE's technical expertise.</p>
              <a 
                href="https://coresite.pro" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 text-sm font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Visit CoreSite.pro
              </a>
            </div>

            <div className="pt-4">
              <h4 className="mb-3 text-sm font-semibold text-white">Connect With Us</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 transition-colors bg-[#002856] rounded-lg hover:bg-blue-600 hover:text-white"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800"></div>

      {/* Bottom Footer */}
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-center text-gray-400 md:text-left">
            Copyright © {currentYear} <span className="font-semibold text-white">DCODE Information Technology Solutions Inc.</span> All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">Powered by</span>
            <a 
              href="https://coresite.pro" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-white transition-colors hover:text-blue-400"
            >
              CoreSite<span className="text-blue-400">.pro</span>
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed z-50 p-3 text-white transition-all bg-blue-600 rounded-full shadow-lg bottom-6 right-6 hover:bg-blue-700 hover:-translate-y-1 group"
        aria-label="Back to top"
      >
        <FaArrowUp className="w-5 h-5 group-hover:animate-bounce" />
      </button>
    </footer>
  );
}