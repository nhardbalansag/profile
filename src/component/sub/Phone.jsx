import React from 'react'

import BGlorijan  from '../../assets/images/glorijan/glorijanmob.png'

function Phone() {
  return (
    <div className="mockup-phone"  >
        <div className="camera"></div>
        <div className="display">
            <div className="p-2 bg-white artboard artboard-demo phone-1"
                style={{
                    backgroundImage: `url(${BGlorijan})`,
                    backgroundSize: "cover", 
                    backgroundPosition: "center"
                }}>
                <div className='flex items-end justify-center h-[70%]'>
                    <div className='text-start'>
                        <h1 className="text-[29px] font-bold text-[#FF4E03] uppercase">Glorijan</h1>
                        <h3 className="text-[29px] font-extrabold text-[white] uppercase">Construction Supply </h3>
                        <p className='text-white'>
                        Glorijan Construction & Supply delivers quality materials and reliable services for durable, high-standard projects.
                        </p>
                        <div className='grid grid-cols-1 mt-5'> 
                            <button onClick={() => window.open('https://m.me/100381302855923', '_blank')} className="bg-[#FF4E03] mb-3 w-[200px] p-2 rounded-[100px] text-white font-bold">Connect With Us</button>
                            <button className="bg-transparent w-[200px] mb-3  p-2 rounded-[100px] border border-[white] text-white font-bold">
                                <a href="tel:+639989917208">
                                +639989917208
                                </a>
                            </button>
                            <button className="bg-transparent w-[200px] mb-3  p-2 rounded-[100px] border border-[white] text-white font-bold">
                                <a href="tel:+639266931264">
                                +639266931264
                                </a>
                            </button>
                            <button className="bg-transparent w-[250px]  p-2 rounded-[100px] border border-[white] text-white font-bold">
                                <a href="mailto:glorijan2018@gmail.com">
                                glorijan2018@gmail.com
                                </a>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Phone