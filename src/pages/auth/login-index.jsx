import React, {useState} from 'react'
import {useSelector} from 'react-redux';
import {
    Outlet,
} from "react-router";

import {
  Header,
  Footer,
  LanguageBottomSheet
} from "../../component/index"

const LoginPage = () => {

  const auth_states = useSelector(state => state.AuthReducer);

  const [open, setOpen] = useState(false)
  const [getOpenLanguageSelection, setOpenLanguageSelection] = useState(false)
  const [getSelectedLanguage, setSelectedLanguage] = useState("")

  return (
    <div>
      <div className='mb-3'>
        <Header 
        handleLanguageVisibility={() => setOpenLanguageSelection(true)}
        onPressAction={() => setOpen(!open)} 
        ActionState={open}
        />
      </div>
      {/* pages */}
      <Outlet />
      {/* pages */}
      {
        getOpenLanguageSelection
        && 
        <LanguageBottomSheet 
        selected={getSelectedLanguage}
        handleSelectContent={(event) => setSelectedLanguage(event)}
        handleClose={() => setOpenLanguageSelection(false)} 
        DataContent={auth_states.Languages}/>
      }
    </div>
  )
}

export default LoginPage