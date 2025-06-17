import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { MdOutlineCardGiftcard } from "react-icons/md";

import * as api_account from '../../services/account/account.api.js'

const AccountTransferTPoints = () =>{

  const navigate = useNavigate();

  const auth_states = useSelector(state => state.AuthReducer);

  const [loadingContent, setLoadingContent] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [getAccountDetailsToTransfer, setAccountDetailsToTransfer] = useState(null);
  const [walletData, setWalletData] = useState({
    t_points: 0,
    t_bucks: 0,
    AccountTransaction:[]
  });

  const [getFormData, setFormData] = useState({
    amount  : 0,
    account_number : ""
  })

  const processSequence = ['amount', 'account_number', 'review']

  const [currentActiveProcess, setCurrentActiveProcess] = useState(0);
  const [getProcess, setProcess] = useState({
    amount  : true,
    account_number : false,
    review : false,
  })

  const transfer = async() => {
    const reqBody = {
      account_number: getFormData.account_number,
      amount: getFormData.amount,
    }

    if (
      !getFormData.account_number || 
      !getFormData.amount) {
      return;
    }

    if(getFormData.amount > walletData.t_points){
      return;
    }

    setLoadingContent(true)
    await api_account.TransferTPoints(auth_states.StateToken, reqBody).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        setCurrentActiveProcess(0)
        navigate('/account')
      }
      
      setLoadingContent(false)

    }).catch((err) =>{
      setLoadingContent(false)
    })
  }

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  }

  const handleNext = () => {

    setProcess((prevFormData) => ({
      ...prevFormData,
      [processSequence[currentActiveProcess]]: false
    }))

    setProcess((prevFormData) => ({
      ...prevFormData,
      [processSequence[currentActiveProcess + 1]]: true
    }))

    setCurrentActiveProcess(prev => (prev + 1))
  }

  const handlePrevious = () => {

    setProcess((prevFormData) => ({
      ...prevFormData,
      [processSequence[currentActiveProcess]]: false
    }))

    setProcess((prevFormData) => ({
      ...prevFormData,
      [processSequence[currentActiveProcess - 1]]: true
    }))

    setCurrentActiveProcess(prev => (prev - 1))
  }

  const getTBucksAndTPoints = async() =>{
    setLoadingContent(true)
    await api_account.getTBucksAndTPoints(auth_states.StateToken).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        // setWalletData(result.data.data)
        Object.keys(result.data.data).map((item, key) =>{
          setWalletData((prev) => ({
            ...prev,
            [item]: result.data.data[item]
          }));
        })
      }
      
      setLoadingContent(false)

    }).catch((err) =>{
      setLoadingContent(false)
    })
  }

  const getAccountInformation = async() =>{

    const reqBody = {
      account_number: getFormData.account_number,
    }

    setLoadingContent(true)
    await api_account.getAccountToTransfer(auth_states.StateToken, reqBody).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        setAccountDetailsToTransfer(result.data.data)
      }
      
      setLoadingContent(false)

    }).catch((err) =>{
      setLoadingContent(false)
    })
  }

  const _Buttons = ({title, icon, hasBG=true, onPressAction}) =>{
    return(
      <button onClick={onPressAction} className={`${hasBG ? 'bg-white btn shadow-sm rounded-xl' : "flex flex-col items-center justify-center h-[130px] bg-transparent"} `}>
        {
          icon &&
          <div className={`bg-blue-600 p-2 flex justify-center text-xl w-[35px] h-[35px] font-bold text-white  rounded-full`}>
            {icon}
          </div>
        }
        <p className="mt-1 text-sm capitalize">{title}</p>
      </button>
    )
  }

  const _WalletCard = (title, amount, buttons = []) =>{
    return(
      <div className="w-[95%] border rounded-2xl p-5 bg-white shadow-lg space-y-3 relative z-0">
        <p className="text-[18px] md:text-[25px] uppercase font-semibold">{title}</p>
        <div>
          <p className="text-[15px] md:text-[18px] capitalize">balance</p>
          <p className="text-[20px] md:text-[40px] font-bold">{parseFloat(amount)}</p>
        </div>
        <div className="my-5">  
          <div className="flex items-center justify-start space-x-5">
            {
              buttons.map((item, index) => (
                <_Buttons 
                onPressAction={item.onPressAction}
                icon={item.icon} 
                title={item.title} />
              ))
            }
          </div>
        </div>
      </div>
    )
  }

  const TopUp = () => {
    return (
      <div className="w-full font-sans">
        <div className="flex items-center mb-4 space-x-3">
          <p className="text-gray-500">Balance:</p>
          <p className="text-xl font-bold">
            {
              (walletData.t_points - getFormData.amount)
            }
          </p>
        </div>

        <div className="mb-4 ">
          {/* <p className="my-2 text-3xl font-bold">{selectedAmount.toFixed(2)}</p> */}
          
          {
            getProcess.amount &&
            <div className='space-y-5'>
              <p className="font-semibold">Amount</p>
              <input
                type="number"
                placeholder="0"
                className="w-[100%] focus:outline-none focus:border-black border-b-[3px] border-gray font-bold text-[50px]"
                name='amount'
                value={getFormData.amount} 
                onChange={handleChange}
              />
            </div>
          }

          {
            getProcess.account_number &&
            <div className='space-y-5'>
              <p className="font-semibold">Account Number</p>
              <input
                type="text"
                placeholder="CTAxxxx"
                className="w-[100%] focus:outline-none focus:border-black border-b-[1px] border-gray text-[18px]"
                name='account_number'
                value={getFormData.account_number} 
                onChange={handleChange}
              />
            </div>
          }

          {
            getProcess.review &&
            <div className='space-y-5'>
              <p className="font-semibold">Transaction Details</p>
              {
                loadingContent
                ?
                  <div className='w-full'>
                    <div className="flex flex-col justify-center w-full gap-4 py-10">
                      <div className='grid grid-cols-2 gap-2'>
                        <div className="h-3 skeleton w-35"></div>
                        <div className="h-3 skeleton w-28"></div>

                        <div className="h-3 skeleton w-35"></div>
                        <div className="h-3 skeleton w-28"></div>

                        <div className="h-3 skeleton w-35"></div>
                        <div className="h-3 skeleton w-28"></div>

                        <div className="h-3 skeleton w-35"></div>
                        <div className="h-3 skeleton w-28"></div>
                      </div>
                    </div>
                  </div>
                :
              
                <div className='grid grid-cols-2 gap-2'>
                  <p className='text-gray-500 capitalize'>to account number</p>
                  <p className='uppercase'>{`${getAccountDetailsToTransfer ? getAccountDetailsToTransfer.account_number : "invalid account"}`}</p>

                  <p className='text-gray-500 capitalize'>to account name</p>
                  <p className='uppercase'>
                    {
                      `${getAccountDetailsToTransfer 
                      ? (getAccountDetailsToTransfer.users_table.first_name + " " + getAccountDetailsToTransfer.users_table.last_name) 
                      : "invalid account"}
                      `
                    }
                  </p>

                  <p className='text-gray-500 capitalize'>amount</p>
                  <p className='capitalize'>{getFormData.amount}</p>

                  <p className='text-gray-500 capitalize'>transaction type</p>
                  <p className='capitalize'>transfer</p>

                  <p className='text-gray-500 capitalize'>wallet type</p>
                  <p className='uppercase'>t-points</p>
                </div>
              }
            </div>
          }
          
        </div>
        <div className='space-y-3'>
          {
            currentActiveProcess > 0 &&
            <button 
              onClick={() => handlePrevious()}
              className="w-full py-3 text-white bg-blue-600 rounded-xl">
              Previous
            </button>
          }
          {
            processSequence.length - 1 == currentActiveProcess
            ?
              getAccountDetailsToTransfer &&
              <button 
                disabled={loadingContent}
                onClick={() => transfer()}
                className="w-full py-3 text-white bg-blue-600 rounded-xl">
                {
                  loadingContent
                  ? "Processing"
                  : "Transfer"
                }
                
              </button>
            :
              getFormData.amount 
              ?
                <button 
                  onClick={() => {
                    handleNext();
                    currentActiveProcess == 1 && getAccountInformation()
                  }}
                  className="w-full py-3 text-white bg-blue-600 rounded-xl">
                  Next
                </button>
              : <></>
          }
          
        </div>
      </div>
    )
  }

  useEffect(() => {
    getTBucksAndTPoints()
  },[])

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {TopUp()}

        <div className="flex items-center justify-center mb-5">
            {
            loadingContent
            ?
              <div className='w-full'>
                <div className="flex flex-col justify-center w-full gap-4 py-10">
                  <div className="w-full h-32 skeleton"></div>
                  <div className='flex items-center justify-between p-5'>
                    <div className="h-4 skeleton w-28"></div>
                    <div className="h-4 skeleton w-28"></div>
                  </div>
                </div>
              </div>
            :
              _WalletCard(
                "t-points",
                walletData.t_points,
                [
                  {
                    onPressAction: () => navigate('/t-points-transfer'),
                    title: 'Redeem',
                    icon: <MdOutlineCardGiftcard className="text-[20px] text-white" />
                  }
                ]
              )
          }
        </div>
      </div>
    </div>  
  ) 
}

export default AccountTransferTPoints
