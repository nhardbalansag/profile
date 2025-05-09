import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineAirplanemodeActive } from "react-icons/md";
import { MdOutlineStorefront } from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";
import { HiShoppingBag } from "react-icons/hi2";

import {
  Outlet,
} from "react-router";

const MallContent = () =>{

  return (
    <div>
      <div className='flex justify-center my-5'>
        <div className='md:w-[75%] w-[95%]'>
          <TopCategories/>
        </div>
      </div>
      <div className='flex justify-center my-5'>
        <div className='md:w-[75%] w-[95%]'>
          <p className='font-extrabold text-[#001d3d] text-[25px] capitalize'>discover next adventure</p>
        </div>
      </div>
      {/* content */}
      <div>
        <Outlet />
      </div>
      {/* content */}
    </div>  
  ) 
}

export default MallContent
