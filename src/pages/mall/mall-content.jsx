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
          <p className='font-extrabold text-[#001d3d] text-[25px] capitalize discover_next_adventure_label_id'>
            discover next adventure
          </p>
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
