import React, {useState} from 'react'

import {
    Outlet,
} from "react-router";

import {
  Header,
  Footer
} from "../../component/index"

const LoginPage = () => {

  const [open, setOpen] = useState(false)

  return (
    <div>
      <div>
        <Header onPressAction={ () => setOpen(!open)} ActionState={open}/>
      </div>
      {/* pages */}
      <Outlet />
      {/* pages */}
    </div>
  )
}

export default LoginPage