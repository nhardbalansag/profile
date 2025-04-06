import React, {useState} from 'react'

import {
    Outlet,
} from "react-router";

import {
  Header,
  Footer
} from "../../component/index"

const DestinationPage = () => {

  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className='mb-3'>
        <Header onPressAction={ () => setOpen(!open)} ActionState={open}/>
      </div>
      {/* pages */}
      <Outlet />
      {/* pages */}
    </div>
  )
}

export default DestinationPage