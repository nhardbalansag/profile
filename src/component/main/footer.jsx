import React from 'react'

import {
  Github,
  Linkedin
} from '../../assets/icons/index'

export default function Footer() {
  return (
    <div>
      <footer className="footer footer-center bg-[#001d3d] text-primary-content p-10">
        <aside>
          <p className="font-bold">
            Bernard Balansag
            <br />
            Software Developer
          </p>
          <p className="font-bold">
            Contact Number: 
            09091067604
          </p>
          <p className="font-bold">
            Email Address: 
            nhardbalansag@gmail.com
          </p>
          <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <a 
            href="https://www.linkedin.com/in/bernard-balansag-8148b71b6" 
            target="_blank" 
            rel="noopener noreferrer">
              <Linkedin isLight/>
            </a>
            <a 
              href="https://github.com/nhardbalansag" 
              target="_blank" 
              rel="noopener noreferrer">
              <Github/>
            </a>
          </div>
        </nav>
      </footer>
    </div>
  )
}
