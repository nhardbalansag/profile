import React from 'react'

import {
    Linkedin,
    Github,
} from '../../assets/icons/index'

function Phone() {
  return (
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
                            <a href="/profile/BernardBalansagResume.pdf" download>
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
  )
}

export default Phone