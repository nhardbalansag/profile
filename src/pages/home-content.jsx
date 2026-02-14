import React, { useState } from 'react';
import { BsFileImage } from "react-icons/bs";
import { FaPercent } from "react-icons/fa";
import { MdHeadsetMic, MdHeadset } from 'react-icons/md';
import { FaGlobe } from 'react-icons/fa';
import { MdVerified, MdCheckCircle } from 'react-icons/md';
import { LuTag } from "react-icons/lu";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FiCheckCircle } from "react-icons/fi";
import { FaWordpress, FaOpencart } from 'react-icons/fa';
import { GiShoppingBag } from "react-icons/gi";

import image1 from '../assets/351229fa-a5a1-4b7f-8297-5b5edc9e938c.jpg'
import image2 from '../assets/6c392137-602d-4807-a84c-3f1b793cb0f9.jpg'
import image3 from '../assets/b81e91ab-a989-46da-8120-d9220d7cd0ac.jpg'
import image4 from '../assets/25f36377-66db-4c4b-b754-4c6378fa8e5d.jpg'

const HomeContent = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activePlatform, setActivePlatform] = useState('bagisto');

  // Platform Data with BsFileImage icons
  const platforms = [
    {
      id: 'bagisto',
      name: 'Bagisto',
      icon: <GiShoppingBag className="w-8 h-8" style={{ color: '#f26522' }} />,
      color: '#f26522',
      description: 'Laravel-based eCommerce platform with multi-channel support',
      features: ['Multi-tenant', 'Multi-channel', 'Multi-lingual', 'Multi-currency'],
      video: 'https://www.youtube.com/embed/X7PJxUzZ5aA',
      image: image2,
      stats: { stores: '50k+', downloads: '1M+', rating: '4.8' }
    },
    {
      id: 'opencart',
      name: 'OpenCart',
      icon: <FaOpencart className="w-8 h-8" style={{ color: '#3b9c36' }} />,
      color: '#3b9c36',
      description: 'Powerful open-source eCommerce platform with extensive marketplace',
      features: ['Multi-store', 'Multi-language', 'Multi-currency', 'SEO friendly'],
      video: 'https://www.youtube.com/embed/q7P_kbDy3lY',
      image: image4,
      stats: { stores: '100k+', downloads: '2M+', rating: '4.7' }
    },
    // {
    //   id: 'wordpress',
    //   name: 'WordPress',
    //   icon: <FaWordpress className="w-8 h-8" style={{ color: '#21759b' }} />,
    //   color: '#21759b',
    //   description: 'World\'s most popular CMS with WooCommerce for eCommerce',
    //   features: ['Themes', 'Plugins', 'WooCommerce', 'SEO ready'],
    //   video: 'https://www.youtube.com/embed/UtUJwTgqP6Y',
    //   image: image3,
    //   stats: { sites: '500M+', plugins: '60k+', rating: '4.9' }
    // }
  ];

  const plans = [
    {
      name: 'Starter',
      description: "Best suited for freelancers, creatives, and individuals looking to launch or upgrade their online presence.",      
      monthlyPrice: "149.00",
      annuallyPrice: "1,609.2",
      savings: 'Save ₱178.8!',
      recommended: true,
      features: {
        websites: 'Unlimited web pages',
        support: 'Customer support',
        moneyback: 'Money Back Guarantee',
        domain: 'Free Domain',
        hosting: 'Free Hosting',
        maintenance: 'Free Maintenance and update',
        setup: 'Free Setup',
        consultation: 'Free Consultations',
      }
    },
    {
      name: 'Starter Pack E-commerce Platform',
      description: 'Reliable E-Commerce hosting services with full maintenance and dedicated support for the platform you chose. We take care of server monitoring, automatic updates, security patches, backups, and round-the-clock assistance — keeping your store fast, secure, and always online.',
      monthlyPrice: "199.00",
      annuallyPrice: "2,149.2",
      savings: 'Save ₱238.8!',
      recommended: true,
      features: {
        websites: 'E-Commerce Store Platform',
        support: 'Customer support',
        moneyback: 'Money Back Guarantee',
        domain: 'Free Domain',
        hosting: 'Free Hosting',
        maintenance: 'Free Maintenance and update',
        setup: 'Free Setup',
        consultation: 'Free IT Consultations',
      }
    },
  ];

  const billingCycles = [
    { id: 'monthly', label: 'Monthly', suffix: '/mo' },
    { id: 'annually', label: 'Annually', suffix: '/mo', save: 'Save 10%' }
  ];

  const getPrice = (plan) => {
    switch(billingCycle) {
      case 'monthly':
        return plan.monthlyPrice;
      case 'annually':
        return plan.annuallyPrice;
      default:
        return plan.monthlyPrice;
    }
  };

  const getCycleLabel = () => {
    switch(billingCycle) {
      case 'monthly':
        return 'Paid Monthly';
      case 'annually':
        return 'Paid Annually';
      default:
        return 'Paid Monthly';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Platform Icons */}
      <div className="text-white bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-4 mb-6">
                {platforms.map((platform) => (
                  <div 
                    key={platform.id}
                    className="flex items-center justify-center w-12 h-12 transition-colors bg-white cursor-pointer rounded-xl hover:bg-opacity-20"
                    style={{ color: platform.color }}
                  >
                    {platform.icon}
                  </div>
                ))}
              </div>
              <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
                Go Online <span className="text-blue-300">Risk-Free For Just</span> ₱149/month
              </h1>
              <p className="mb-8 text-xl text-blue-100 md:text-2xl">
                Whether you're a VA building your personal brand or a small business owner ready to sell online, we provide an affordable, all-in-one solution. Zero hassle, zero hidden fees.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full bg-opacity-10">
                  <FiCheckCircle className="w-4 h-4 text-green-400" />
                  <span>Free Domain</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full bg-opacity-10">
                  <FiCheckCircle className="w-4 h-4 text-green-400" />
                  <span>Free SSL</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full bg-opacity-10">
                  <FiCheckCircle className="w-4 h-4 text-green-400" />
                  <span>30-Day Money Back</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full bg-opacity-10">
                  <FiCheckCircle className="w-4 h-4 text-green-400" />
                  <span>Free IT Consultations</span>
                </div>
              </div>
            </div>
            
            {/* Platform Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <div 
                  key={platform.id} 
                  className="p-6 flex justify-center h-[200px] transition-all bg-white cursor-pointer bg-opacity-[.3] backdrop-blur-lg rounded-xl hover:bg-opacity-20"
                  onMouseEnter={() => setActivePlatform(platform.id)}
                  style={{
                    backgroundImage: `url(${platform.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    // opacity: '0.80'
                  }}
                >
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
 
      {/* Pricing Section */}
      <div className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Choose Your Perfect Plan
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Optimized hosting for all platforms with 30-day money-back guarantee
            </p>
          </div>
          {/* Billing Cycle Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex flex-wrap p-1 bg-white rounded-full shadow-sm">
              {billingCycles.map((cycle) => (
                <button
                  key={cycle.id}
                  onClick={() => setBillingCycle(cycle.id)}
                  className={`relative px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    billingCycle === cycle.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {cycle.label}
                  {cycle.save && (
                    <span className="absolute px-2 py-1 text-xs text-white bg-green-500 rounded-full -top-2 -right-2 whitespace-nowrap">
                      {cycle.save}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className='md:gap-10 md:justify-center md:flex'>
            {plans.map((plan) => {
              const price = getPrice(plan);
              return (
                <div
                  key={plan.name}
                  className={`relative mb-10 xs:mx-auto xs:w-full md:w-[350px]  bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 ${
                    plan.recommended ? 'ring-2 ring-blue-500 shadow-xl' : ''
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 right-0 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-bl-lg">
                      <LuTag className="inline w-4 h-4 mr-1" />
                      On Sale
                    </div>
                  )}
                  
                  <div className="p-8">
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="mb-6 text-sm text-gray-600">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">
                          ₱{price}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{getCycleLabel()}</p>
                      {billingCycle !== 'monthly' && (
                        <p className="mt-1 text-sm font-medium text-green-600">
                          Was ${plan.monthlyPrice}/mo • {plan.savings}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-8 space-y-4">
                      <div className="flex items-start gap-3">
                        <FaGlobe className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          <strong>{plan.features.websites}</strong>
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <MdHeadsetMic className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          <strong>{plan.features.support}</strong>
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <MdVerified className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          <strong>{plan.features.moneyback}</strong>
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <IoShieldCheckmarkOutline className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          <strong>{plan.features.domain}</strong>
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <IoShieldCheckmarkOutline className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          <strong>{plan.features.hosting}</strong>
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <IoShieldCheckmarkOutline className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          <strong>{plan.features.maintenance}</strong>
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <IoShieldCheckmarkOutline className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          <strong>{plan.features.setup}</strong>
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <IoShieldCheckmarkOutline className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          <strong>{plan.features.consultation}</strong>
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <span className="text-xs text-gray-500">
                        <IoShieldCheckmarkOutline className="inline w-3 h-3 mr-1 text-green-500" />
                        Free Domain • Free SSL • No Setup Fee
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Money Back Guarantee */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-green-50">
              <MdVerified className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">
                30-Day Money Back Guarantee - No questions asked!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 text-white bg-gradient-to-r from-blue-800 to-blue-900">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to Launch Your Online Idea?
          </h2>
          <p className="max-w-3xl mx-auto mb-10 text-xl text-blue-200">
            Choose your plan, pick a template, connect to us - we handle the rest
          </p>
          <p className="mt-8 text-sm text-blue-300">
            <FiCheckCircle className="inline w-3 h-3 mr-1" />
            No contract • Free domain • Free SSL • 30-day money-back guarantee • Free IT Consultations
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
