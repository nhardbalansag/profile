import React from 'react'

import Logo1 from '../../assets/images/ten/logo.png'
import Logo2 from '../../assets/images/ten/logo2.png'

export default function Footer() {
  return (
    <div id="contact">
      <footer className="footer footer-center bg-[#001d3d] text-primary-content p-10">
        <aside>
          <div className='flex items-center justify-center'>
            <p className="font-bold text-[25px] text-white">
              CLUB
            </p>
          </div>
          <img
          className="w-[30%]"
          alt="Tailwind CSS chat bubble component"
          src={Logo1} />
          <p className='text-[18px]  mt-5'>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
      </footer>
    </div>
  )
}
