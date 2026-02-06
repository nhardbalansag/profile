import React, {useState} from 'react'
import {useSelector} from 'react-redux';
import {
    Outlet,
} from "react-router";

import QRCode from "react-qr-code";

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

      {/* <div className="flex flex-col items-center p-6">
<h2 className="mb-4 text-xl font-semibold">Scan this QR Code</h2>

<QRCode 
value={"otpauth://totp/Laravel:admin%40example.com?secret=A5UDGORJWRYNY5HJJ7D4YXP72BTAIQIG&issuer=Laravel&algorithm=SHA1&digits=6&period=30"} 
size={200} 
includeMargin={true} />

<p className="mt-4 text-sm text-center text-gray-600">
Use Google Authenticator, Authy, or any TOTP app to scan the QR code.
</p>
</div> */}

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