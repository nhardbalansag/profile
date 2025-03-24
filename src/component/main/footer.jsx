import React from 'react'

export default function Footer() {
  return (
    <div id="contact">
      <footer className="footer footer-center bg-[#001d3d] text-primary-content p-10">
        <aside>
          <p className="font-bold text-[25px] text-[#FF4E03]">
            GLORIJAN CONSTRUCTION & SUPPLY
          </p>
          <p className="font-semibold text-[18px] mt-5">
            Contact Number: 
          </p>
          <p className="font-semibold text-[18px]">
            +639989917208 | +639266931264
          </p>
          <p className="font-semibold text-[18px] mt-5">
            Email Address: 
          </p>
          <p className="font-semibold text-[18px]">
            glorijan2018@gmail.com
          </p>
          <p className='text-[18px]  mt-5'>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
      </footer>
    </div>
  )
}
