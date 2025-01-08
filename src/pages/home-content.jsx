import React, { useState } from 'react';

import {
  Card,
  ProjectCardShort,
  ProjectCardLong
} from '../component/index'

import {
  WebDesign,
  Linkedin,
  Github,
  Information,
  Android,
  Web,
  Support
} from '../assets/icons/index'

import PhilricePresentation from '../assets/images/Product Presentation philrice.png'
import IOWOToolPresentation from '../assets/images/IOWOpresentation.jpg'
import Dashboard from '../assets/images/dashboard.png'
import IOWOEventToolPresentation from '../assets/images/iowoeventotoolpresentation.png'
import IOWOEventAdmin from '../assets/images/IOWOeventToolAdmin.png'
import ExQuizSeat from '../assets/images/ExQuizSeat.png'
import buyAndSellDashboard from '../assets/images/buyAndSellDashboard.png'
import IOWOEventToolDashboard from '../assets/images/IOWO Event Tool Dashboard.png'
import DCODEPOSDASHBOARD from '../assets/images/DCODE POS DASHBOARD.png'
import Bernard from '../assets/images/bernard.png'
import Kedica from '../assets/images/kedica.png'
import technology  from '../assets/images/technology.png'

const HomeContent = () =>{

  const [open, setOpen] = useState(false);

  return (
    <div>
      <main>
        <section>
          <div className="relative grid w-full bg-[#000814] h-96 lg:h-[32rem] place-items-center">
            <div className="flex flex-col items-center mx-auto text-center">
              <p className="mt-6 text-lg leading-5 text-[#ffc300]">See more details</p>
              <a href="#about" className="mt-8 cursor-pointer animate-bounce">
                <svg width="53" height="53" viewBox="0 0 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="27" cy="26" r="18" stroke="white" strokeWidth="2" />
                  <path d="M22.41 23.2875L27 27.8675L31.59 23.2875L33 24.6975L27 30.6975L21 24.6975L22.41 23.2875Z" fill="white" />
                </svg>
              </a>
              <div className="mockup-phone">
                <div className="camera"></div>
                <div className="display">
                  <div className="p-3 bg-white artboard artboard-demo phone-1">
                    <div className='flex items-end justify-center h-[70%]'>
                      <div className='text-start'>
                        <h1 className="text-4xl font-semibold text-[#003566] uppercase md:text-3xl">Hello,</h1>
                        <h1 className="text-4xl uppercase">
                          <span className='font-semibold text-[#003566] md:text-5xl'>I am </span> 
                          <span className='font-bold text-[#000814] md:text-6xl'>bernard</span> 
                        </h1>
                        <div className='mt-5'>
                          <a href="/public/gmrc.pdf" download>
                            <button className="bg-[#001d3d] p-2 rounded-md text-white font-bold">Download CV</button>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-end justify-center h-[30%]'>
                      <div class="flex w-full flex-col">
                        <div class="divider">
                          <div> 
                            <a 
                            href="https://www.linkedin.com/in/bernard-balansag-8148b71b6" 
                            target="_blank" 
                            rel="noopener noreferrer">
                              <Linkedin/>
                            </a>
                          </div>
                          <div>
                            <a 
                            href="https://github.com/nhardbalansag" 
                            target="_blank" 
                            rel="noopener noreferrer">
                              <Github isLight={true}/>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto pt-[400px] sm:pt-[400px] lg:pt-[250px] md:pt-[400px] lg:py-16" id="about">
          <div className="flex w-full flex-col my-8">
            <div className="divider">
              <div className='flex items-start justify-start'> 
                <Information size={5}/>
                <p className="mx-1 font-fo">About me</p>
              </div>
            </div>
          </div>
          <div className="lg:flex lg:items-center sm:flex sm:items-center lg:-mx-4 ">
            <div className="lg:w-1/2 lg:px-4 sm:w-1/2">
              <h3 className="text-xl font-medium text-gray-800 md:text-2xl lg:text-3xl">
                Full Stack Web And Mobile Application Developer
              </h3>

              <p className="mt-6 text-gray-500">
              I specialize in designing and developing web and mobile applications 
              that combine functionality, performance, and intuitive user experiences. 
              My work ranges from crafting responsive websites 
              to building scalable mobile apps for Android and iOS platforms. 
              Leveraging modern technologies, I ensure every project meets high standards of usability and innovation, tailored to suit diverse personal and business needs.
              </p>
            </div>

            <div className="w-full px-4 mt-8 sm:w-1/2 lg:w-1/2 lg:px-4 lg:mt-0">
              <img
                className="object-cover w-full rounded-xl h-100 lg:h-100"
                src={Bernard}
                alt="dashboard thumbnail"
              />
            </div>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-8">
          <div className="flex w-full flex-col my-8">
            <div className="divider">
              <div className='flex items-start justify-start'> 
                <Information size={5}/>
                <p className="mx-1 font-fo">What I Do</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 xl:gap-12 md:grid-cols-2 xl:grid-cols-3">
            {/* Card 1 */}
            <Card icon={<Android/>} cardTitle='mobile app development' sub='Experienced in mobile app development using React Native for cross-platform apps and Kotlin for native Android. Skilled in creating responsive, visually engaging apps with seamless API integration and platform-specific optimizations.'/>
            <Card icon={<Web/>} cardTitle='web application system' sub='Experienced in web app development with expertise in building responsive and scalable systems. Skilled in using modern frameworks like React or Vue.js for front-end development and Laravel or .NET for back-end services. Proficient in RESTful API integration, database management, and performance optimization to deliver efficient and user-friendly solutions.'/>
            <Card icon={<Support/>} cardTitle='maintenance and support' sub='Ensures smooth operation through bug fixes, performance optimization, updates, and security enhancements. Provides user support, issue resolution, and continuous improvements based on feedback.'/>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-16" id="projects">
          <h3 className="text-xl font-medium text-gray-800 md:text-2xl lg:text-3xl">Browse Some Of My Projects</h3>

          <div className="flex items-center py-6 mt-4 -mx-2 overflow-x-auto whitespace-nowrap">
            <button className="inline-flex px-4 mx-2 focus:outline-none items-center py-0.5 text-white bg-indigo-500 hover:bg-indigo-400 duration-300 transition-colors rounded-2xl">
              All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-2 lg:grid-cols-3">
            <ProjectCardLong imageSrc={PhilricePresentation}/>
            <ProjectCardShort imageSrc={DCODEPOSDASHBOARD}/>
            <ProjectCardShort imageSrc={IOWOEventToolDashboard}/>
            <ProjectCardLong imageSrc={IOWOEventToolPresentation}/>
            <ProjectCardLong imageSrc={ExQuizSeat}/>
            <ProjectCardShort imageSrc={IOWOToolPresentation}/>
            <ProjectCardLong imageSrc={buyAndSellDashboard}/>
            <ProjectCardShort imageSrc={Kedica}/>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomeContent