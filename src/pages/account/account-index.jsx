import React, {useState} from 'react'
import {useSelector} from 'react-redux';
import {
    Outlet,
} from "react-router";

import {
  Header,
  Footer,
} from "../../component/index"

const AccountPage = () => {
  return (
    <div>
      {/* pages */}
      <Outlet />
      {/* pages */}
    </div>
  )
}

export default AccountPage