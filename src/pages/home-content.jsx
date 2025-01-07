import React, { useState } from 'react';

import {
  Card
} from '../component/index'

import {
  WebDesign
} from '../assets/icons/index'

const HomeContent = () =>{

  const [open, setOpen] = useState(false);

  return (
    <div>
      <main>
        <section>
          <div className="relative grid w-full bg-[#001d3d] h-96 lg:h-[32rem] place-items-center">
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
                  <div className="artboard artboard-demo phone-1 bg-white p-3">
                    <div className='text-start'>
                      <h1 className="text-4xl font-semibold text-[#003566] uppercase md:text-3xl">Hello,</h1>
                      <h1 className="text-4xl uppercase">
                        <span className='font-semibold text-[#003566] md:text-5xl'>I am </span> 
                        <span className='font-bold text-black md:text-6xl'>bernard</span> 
                      </h1>
                      <div className='mt-5'>
                        <a href="/public/gmrc.pdf" download>
                          <button className="bg-[#001d3d] p-2 rounded-md text-white font-bold">Download CV</button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:pt-40 lg:py-16 bordered" id="about">
          <div className="lg:flex lg:items-center lg:-mx-4">
            <div className="lg:w-1/2 lg:px-4">
              <h3 className="text-xl font-medium text-gray-800 md:text-2xl lg:text-3xl">
                Web And Mobile Applications?
              </h3>

              <p className="mt-6 text-gray-500">
              I specialize in designing and developing web and mobile applications 
  that combine functionality, performance, and intuitive user experiences. 
  My work ranges from crafting responsive websites 
  to building scalable mobile apps for Android and iOS platforms. 
  Leveraging modern technologies, I ensure every project meets high standards of usability and innovation, tailored to suit diverse personal and business needs.
              </p>

              <button className="flex items-center mt-8 -mx-2 text-indigo-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 mx-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mx-1 font-semibold">PLAY VIDEO</p>
              </button>
            </div>

            <div className="mt-8 lg:w-1/2 lg:px-4 lg:mt-0">
              <img
                className="object-cover w-full rounded-xl h-96"
                src="https://images.unsplash.com/photo-1516131206008-dd041a9764fd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                alt="Video thumbnail"
              />
            </div>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-16">
          <div className="grid grid-cols-1 gap-8 xl:gap-12 md:grid-cols-2 xl:grid-cols-3">
            {/* Card 1 */}
            <Card icon={<WebDesign/>} cardTitle='web design' sub='Research, user experience testing, mockups, and prototypes'/>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-16">
          <h3 className="text-xl font-medium text-gray-800 md:text-2xl lg:text-3xl">Browse Our Projects</h3>

          <div className="flex items-center py-6 mt-4 -mx-2 overflow-x-auto whitespace-nowrap">
            <button className="inline-flex px-4 mx-2 focus:outline-none items-center py-0.5 text-white bg-indigo-500 hover:bg-indigo-400 duration-300 transition-colors rounded-2xl">
              All
            </button>
            <button className="inline-flex px-4 mx-2 duration-300 transition-colors hover:bg-indigo-500/70 hover:text-white text-gray-500 focus:outline-none py-0.5 cursor-pointer rounded-2xl">
              Web Design
            </button>
            <button className="inline-flex px-4 mx-2 duration-300 transition-colors hover:bg-indigo-500/70 hover:text-white text-gray-500 focus:outline-none py-0.5 cursor-pointer rounded-2xl">
              Development
            </button>
            <button className="inline-flex px-4 mx-2 duration-300 transition-colors hover:bg-indigo-500/70 hover:text-white text-gray-500 focus:outline-none py-0.5 cursor-pointer rounded-2xl">
              Research
            </button>
          </div>

          <div className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-2 lg:grid-cols-3">
            <a href="#" className="transition-all duration-500 lg:col-span-2 hover:scale-105">
              <img
                className="object-cover object-top w-full rounded-lg shadow-md shadow-gray-200 h-80 xl:h-96"
                src="https://cdn.dribbble.com/users/1644453/screenshots/17056773/media/00509f74e765da294440886db976943a.png?compress=1&resize=1000x750&vertical=top"
                alt=""
              />
            </a>
            <a href="#" className="transition-all duration-500 hover:scale-105">
              <img
                className="object-cover object-top w-full rounded-lg shadow-md shadow-gray-200 h-80 xl:h-96"
                src="https://cdn.dribbble.com/userupload/3233220/file/original-e80767b5947df65a0f1ab4dab4964679.png?compress=1&resize=1024x768"
                alt=""
              />
            </a>
            <a href="#" className="transition-all duration-500 hover:scale-105">
              <img
                className="object-cover object-top w-full rounded-lg shadow-md shadow-gray-200 h-80 xl:h-96"
                src="https://cdn.dribbble.com/users/1644453/screenshots/14748860/media/25f53296059b741ac1c083be9f41745b.png?compress=1&resize=1000x750&vertical=top"
                alt=""
              />
            </a>
            <a href="#" className="transition-all duration-500 lg:col-span-2 hover:scale-105">
              <img
                className="object-cover object-top w-full rounded-lg shadow-md shadow-gray-200 h-80 xl:h-96"
                src="https://cdn.dribbble.com/users/878428/screenshots/17307425/media/01782a518148ce7ef2e790473c888b1f.png?compress=1&resize=1000x750&vertical=top"
                alt=""
              />
            </a>
            <a href="#" className="transition-all duration-500 lg:col-span-2 hover:scale-105">
              <img
                className="object-cover object-top w-full rounded-lg shadow-md shadow-gray-200 h-80 xl:h-96"
                src="https://cdn.dribbble.com/users/1930709/screenshots/11466872/media/e50b0f02160a77397eb4a76782d23966.png?compress=1&resize=1000x750&vertical=top"
                alt=""
              />
            </a>
            <a href="#" className="transition-all duration-500 hover:scale-105">
              <img
                className="object-cover object-top w-full rounded-lg shadow-md shadow-gray-200 h-80 xl:h-96"
                src="https://cdn.dribbble.com/users/1644453/screenshots/14403641/media/21e305eb9c8255b6e3367f0ca52c6668.png?compress=1&resize=1000x750&vertical=top"
                alt=""
              />
            </a>
          </div>
        </section>

        <section className="container px-6 py-8 mx-auto lg:py-16">
          <h3 className="text-xl font-medium text-gray-800 md:text-2xl lg:text-3xl">Recent Blog Posts</h3>

          <div className="grid grid-cols-1 gap-8 mt-8 md:mt-10 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <div className="relative">
                <img
                  className="object-cover object-center w-full h-64 rounded-lg lg:h-80"
                  src="https://images.unsplash.com/photo-1624996379697-f01d168b1a52?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt=""
                />
                <div className="absolute bottom-0 flex p-3 bg-white">
                  <img
                    className="object-cover object-center w-10 h-10 rounded-full"
                    src="https://cdn.dribbble.com/users/1436669/screenshots/15006128/media/5f91264b3b56cc452cb2bba2535bccdd.png?compress=1&resize=1000x750&vertical=top"
                    alt=""
                  />
                  <div className="mx-4">
                    <h1 className="text-sm text-gray-700">Tom Hank</h1>
                    <p className="text-sm text-gray-500">Creative Director</p>
                  </div>
                </div>
              </div>
              <h1 className="mt-6 text-xl font-semibold text-gray-800">
                What do you want to know about UI
              </h1>
              <hr className="w-32 my-6 text-indigo-500" />
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis fugit dolorum amet dolores praesentium,
                alias nam? Tempore
              </p>
              <a href="#" className="inline-block mt-4 text-indigo-500 underline hover:text-indigo-400">
                Read more
              </a>
            </div>

            <div>
              <div className="relative">
                <img
                  className="object-cover object-center w-full h-64 rounded-lg lg:h-80"
                  src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt=""
                />
                <div className="absolute bottom-0 flex p-3 bg-white">
                  <img
                    className="object-cover object-center w-10 h-10 rounded-full"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                    alt=""
                  />
                  <div className="mx-4">
                    <h1 className="text-sm text-gray-700">arthur melo</h1>
                    <p className="text-sm text-gray-500">Creative Director</p>
                  </div>
                </div>
              </div>
              <h1 className="mt-6 text-xl font-semibold text-gray-800">
                All the features you want to know
              </h1>
              <hr className="w-32 my-6 text-indigo-500" />
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis fugit dolorum amet dolores praesentium,
                alias nam? Tempore
              </p>
              <a href="#" className="inline-block mt-4 text-indigo-500 underline hover:text-indigo-400">
                Read more
              </a>
            </div>

            <div>
              <div className="relative">
                <img
                  className="object-cover object-center w-full h-64 rounded-lg lg:h-80"
                  src="https://images.unsplash.com/photo-1597534458220-9fb4969f2df5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
                  alt=""
                />
                <div className="absolute bottom-0 flex p-3 bg-white">
                  <img
                    className="object-cover object-center w-10 h-10 rounded-full"
                    src="https://images.unsplash.com/photo-1531590878845-12627191e687?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
                    alt=""
                  />
                  <div className="mx-4">
                    <h1 className="text-sm text-gray-700">Amelia. Anderson</h1>
                    <p className="text-sm text-gray-500">Lead Developer</p>
                  </div>
                </div>
              </div>
              <h1 className="mt-6 text-xl font-semibold text-gray-800">
                Which services you get from Meraki UI
              </h1>
              <hr className="w-32 my-6 text-indigo-500" />
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis fugit dolorum amet dolores praesentium,
                alias nam? Tempore
              </p>
              <a href="#" className="inline-block mt-4 text-indigo-500 underline hover:text-indigo-400">
                Read more
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomeContent