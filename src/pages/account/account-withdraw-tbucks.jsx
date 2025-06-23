import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { TbTransfer } from "react-icons/tb";
import { FiSearch } from 'react-icons/fi';

import * as api_account from '../../services/account/account.api.js'

import bankImage from '../../assets/images/ten/bank.png';
import gCashImage from '../../assets/images/ten/GCash.png';
import paypalImage from '../../assets/images/ten/PayPal New 2023.png';
import payNowImage from '../../assets/images/ten/PayNow.png';

const options = [
  { id: "bank", primary_label: "Bank Details", label: "Bank Transfer", img: bankImage },
  { id: "gcash", primary_label: "Gcash Mobile Number", label: "GCash", img: gCashImage },
  { id: "paynow", primary_label: "Mobile Number", label: "PayNow", img: payNowImage },
  { id: "paypal", primary_label: "Email Address", label: "PayPal", img: paypalImage },
];

const bankData = [
  {
    country: 'Philippines',
    banks: [
      'BDO Unibank',
      'Bank of the Philippine Islands (BPI)',
      'Metrobank',
      'Landbank',
      'Development Bank of the Philippines',
      'UnionBank',
      'Security Bank',
      'Rizal Commercial Banking Corp (RCBC)',
      'Philippine National Bank (PNB)',
      'Maya Bank',
      'Tonik Bank',
      'GoTyme Bank',
      'UNO Digital Bank',
      'CIMB Bank Philippines',
      'East West Bank',
      'Citibank Philippines',
      'Asia United Bank (AUB)',
      'HSBC Philippines',
    ],
  },
  {
    country: 'Australia',
    banks: [
      'Commonwealth Bank',
      'Westpac',
      'ANZ',
      'National Australia Bank (NAB)',
      'Macquarie Bank',
      'Bankwest',
      'Suncorp Bank',
      'Bank of Queensland',
      'Bendigo & Adelaide Bank',
      'ING Australia',
      'UBank',
    ],
  },
  {
    country: 'South Africa',
    banks: [
      'Absa Bank',
      'Capitec Bank',
      'First National Bank (FNB)',
      'Nedbank',
      'Standard Bank',
      'TymeBank',
      'Discovery Bank',
      'African Bank',
      'Investec',
    ],
  },
  {
    country: 'Canada',
    banks: [
      'Royal Bank of Canada (RBC)',
      'Toronto-Dominion Bank (TD)',
      'Bank of Montreal (BMO)',
      'Scotiabank',
      'Canadian Imperial Bank of Commerce (CIBC)',
      'National Bank of Canada',
      'Laurentian Bank',
      'EQ Bank',
      'Simplii Financial',
    ],
  },
  {
    country: 'Malaysia',
    banks: [
      'Maybank',
      'CIMB Bank',
      'Public Bank',
      'RHB Bank',
      'Hong Leong Bank',
      'AmBank',
      'UOB Malaysia',
      'OCBC Bank (Malaysia)',
      'HSBC Malaysia',
      'Bank Islam Malaysia',
    ],
  },
  {
    country: 'United Kingdom',
    banks: [
      'HSBC',
      'Barclays',
      'Lloyds Bank',
      'NatWest',
      'Royal Bank of Scotland (RBS)',
      'Standard Chartered',
      'Santander UK',
      'Halifax',
      'TSB Bank',
      'Monzo',
      'Revolut',
      'Starling Bank',
    ],
  },
  {
    country: 'United States',
    banks: [
      'JPMorgan Chase',
      'Bank of America',
      'Wells Fargo',
      'Citibank',
      'Goldman Sachs',
      'Morgan Stanley',
      'U.S. Bank',
      'PNC Bank',
      'Capital One',
      'TD Bank',
      'Charles Schwab Bank',
      'Ally Bank',
      'Chime',
    ],
  },
  {
    country: 'India',
    banks: [
      'State Bank of India (SBI)',
      'HDFC Bank',
      'ICICI Bank',
      'Axis Bank',
      'Punjab National Bank (PNB)',
      'Bank of Baroda',
      'Kotak Mahindra Bank',
      'Canara Bank',
      'Union Bank of India',
      'Yes Bank',
    ],
  },
  {
    country: 'Germany',
    banks: [
      'Deutsche Bank',
      'Commerzbank',
      'DZ Bank',
      'KfW Bank',
      'UniCredit Bank AG (HypoVereinsbank)',
      'Postbank',
      'N26',
      'ING-DiBa',
    ],
  },
  {
    country: 'Brazil',
    banks: [
      'Banco do Brasil',
      'Bradesco',
      'Itaú Unibanco',
      'Caixa Econômica Federal',
      'Santander Brasil',
      'Banco Safra',
      'Banco Inter',
      'Nubank',
    ],
  },
  {
    country: 'United Arab Emirates',
    banks: [
      'First Abu Dhabi Bank (FAB)',
      'Emirates NBD',
      'Dubai Islamic Bank',
      'Abu Dhabi Commercial Bank (ADCB)',
      'Mashreq Bank',
      'RAKBANK',
      'Noor Bank',
    ],
  },
]

const AccountWithdrawTBucks = () =>{

  const navigate = useNavigate();

  const auth_states = useSelector(state => state.AuthReducer);

  const inputsRef = useRef([]);

  const setDigits = useRef(["", "", "", ""]);
  const setPin = useRef("");

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [selected, setSelected] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [getAccountDetailsToTransfer, setAccountDetailsToTransfer] = useState(null);
  const [walletData, setWalletData] = useState({
    t_points: 0,
    t_bucks: 0,
    AccountTransaction:[]
  });

  const initialFormData = {
    amount: 0,
    account_number: "",
    pin: "",
    bank: "",
    branch: "",
    address: "",
    account_name: "",
    swift_code: "",
  }

  const [getFormData, setFormData] = useState(initialFormData)

  const processSequence = ['withdrawal_option', 'amount',  'account_number', 'review', 'pin']

  const [currentActiveProcess, setCurrentActiveProcess] = useState(0);
  const [getProcess, setProcess] = useState({
    withdrawal_option : true,
    amount  : false,
    account_number : false,
    review : false,
    pin : false,
  })

  const transfer = async() => {

    const params = {
      reference:{
        type: "withdraw",
        wallet_type: "t-bucks",
        amount: getFormData.amount,
        account_number: getFormData.account_number,
        account_name: getFormData.account_name,
        bank: selectedBank ? selectedBank : selected,
        branch: getFormData.branch,
        address: getFormData.address,
        swift_code: getFormData.swift_code
      }
    }

    const reqBody = {
      account_number: getFormData.account_number,
      amount: getFormData.amount,
      pin: setPin.current,
      params: params
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
    await api_account.WithdrawTBucks(auth_states.StateToken, reqBody).then((result) =>{
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

  const BankSearchDropdown = () => {

    // Flatten and filter all banks
    const filteredBanks = bankData
    .flatMap(({ country, banks }) =>
      banks
        .filter((bank) =>
          bank.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((bank) => ({ country, bank }))
    )

    return (
      <div className="">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Search for your bank
        </label>

        <div className="relative">
          <FiSearch className="absolute text-gray-400 top-3 left-3" />
          <input
            type="text"
            placeholder="Type bank name..."
            className="w-full py-2 pl-10 pr-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {searchTerm && (
          <ul className="mt-2 overflow-y-auto bg-white border rounded-lg shadow max-h-60">
            {filteredBanks.length === 0 ? (
              <li className="p-2 text-sm text-gray-500">No results found.</li>
            ) : (
              filteredBanks.map(({ country, bank }) => (
                <li
                  key={`${country}-${bank}`}
                  className="p-2 text-sm cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setSelectedBank(`${bank} (${country})`);
                    setSearchTerm('');
                  }}
                >
                  <span className="font-medium">{bank}</span>
                  <span className="ml-2 text-xs text-gray-500">({country})</span>
                </li>
              ))
            )}
          </ul>
        )}

        {selectedBank && (
          <p className="mt-4 font-semibold text-green-600">
            Selected Bank: {selectedBank}
          </p>
        )}
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
              (walletData.t_bucks - getFormData.amount)
            }
          </p>
        </div>

        <div className="mb-4 ">
          {/* <p className="my-2 text-3xl font-bold">{selectedAmount.toFixed(2)}</p> */}

          {
            getProcess.pin &&
            <div className='space-y-5'>
              <p className="font-semibold">PIN</p>
              {PinInput()}
            </div>
          }
          
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
            getProcess.withdrawal_option &&
            <div className='space-y-5'>
              <p className="font-semibold">Withdrawal Option</p>
              <div>
                <div className="grid grid-cols-2 gap-4">
                  {options.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setSelected(option.id)}
                      className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center 
                        ${selected === option.id ? "border-blue-500 shadow-lg" : "border-gray-200"}`}
                    >
                      <img src={option.img} alt={option.label} />
                      <span className="text-sm">{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }

          {
            getProcess.account_number &&
            <div className='space-y-5'>
              <p className="font-semibold">
                {
                  options.find(item => selected ===item.id)?.primary_label || "Account Details"
                }
              </p>

              {
                selected === "bank" &&
                <div className='space-y-3'>
                  {BankSearchDropdown()}
                  
                  <label className="block text-sm font-medium text-gray-700">
                    Branch
                  </label>
                  <input
                    type="text"
                    className="w-[100%] focus:outline-none focus:border-black border-b-[1px] border-gray text-[18px]"
                    name='branch'
                    value={getFormData.branch} 
                    onChange={handleChange}
                  />

                  <label className="block text-sm font-medium text-gray-700">
                    Bank Address
                  </label>
                  <input
                    type="text"
                    className="w-[100%] focus:outline-none focus:border-black border-b-[1px] border-gray text-[18px]"
                    name='address'
                    value={getFormData.address} 
                    onChange={handleChange}
                  />
                  
                  <label className="block text-sm font-medium text-gray-700">
                    Account Number
                  </label>
                  <input
                    type="text"
                    className="w-[100%] focus:outline-none focus:border-black border-b-[1px] border-gray text-[18px]"
                    name='account_number'
                    value={getFormData.account_number} 
                    onChange={handleChange}
                  />

                  <label className="block text-sm font-medium text-gray-700">
                    SWIFT Code
                  </label>
                  <input
                    type="text"
                    className="w-[100%] focus:outline-none focus:border-black border-b-[1px] border-gray text-[18px]"
                    name='swift_code'
                    value={getFormData.swift_code} 
                    onChange={handleChange}
                  />
                </div>
              }
              
              {
                selected !== "bank" &&
                <input
                  type="text"
                  placeholder=""
                  className="w-[100%] focus:outline-none focus:border-black border-b-[1px] border-gray text-[18px]"
                  name='account_number'
                  value={getFormData.account_number} 
                  onChange={handleChange}
                />
              }

              <label className="block text-sm font-medium text-gray-700">
                Account Name
              </label>
              <input
                type="text"
                className="w-[100%] focus:outline-none focus:border-black border-b-[1px] border-gray text-[18px]"
                name='account_name'
                value={getFormData.account_name} 
                onChange={handleChange}
              />
              
            </div>
          }

          {
            getProcess.review &&
            <div className='space-y-5'>
              <p className="font-semibold">Transaction Details</p>
                <div className='grid grid-cols-2 gap-2'>

                  <p className='text-gray-500 capitalize'>transaction type</p>
                  <p className='capitalize'>withdraw</p>

                  <p className='text-gray-500 capitalize'>wallet type</p>
                  <p className='uppercase'>t-bucks</p>

                  <p className='text-gray-500 capitalize'>amount</p>
                  <p className='capitalize'>{getFormData.amount}</p>

                  <p className='text-gray-500 capitalize'>account number</p>
                  <p className='uppercase'>{`${getFormData.account_number}`}</p>

                  <p className='text-gray-500 capitalize'>account name</p>
                  <p className='uppercase'>
                  <p className='uppercase'>{`${getFormData.account_name}`}</p>
                  </p>
                </div>

                {
                  selected == "bank" &&
                  <div className='grid grid-cols-2 gap-2'>
                    <p className='text-gray-500 capitalize'>bank</p>
                    <p className='uppercase'>{`${selectedBank}`}</p>
                  </div>
                }

                {
                  selected == "bank" &&
                  <div className='grid grid-cols-2 gap-2'>
                    <p className='text-gray-500 capitalize'>branch</p>
                    <p className='uppercase'>{`${getFormData.branch}`}</p>
                  </div>
                }

                {
                  selected == "bank" &&
                  <div className='grid grid-cols-2 gap-2'>
                    <p className='text-gray-500 capitalize'>address</p>
                    <p className='uppercase'>{`${getFormData.address}`}</p>
                  </div>
                }

                {
                  selected == "bank" &&
                  <div className='grid grid-cols-2 gap-2'>
                    <p className='text-gray-500 capitalize'>SWIFT Code</p>
                    <p className='uppercase'>{`${getFormData.swift_code}`}</p>
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
              <button 
                disabled={loadingContent}
                onClick={() => transfer()}
                className="w-full py-3 text-white bg-blue-600 rounded-xl">
                {
                  loadingContent
                  ? "Processing"
                  : "Submit Request"
                }
              </button>
            :
              <button 
                onClick={() => {
                  handleNext();
                }}
                className="w-full py-3 text-white bg-blue-600 rounded-xl">
                Next
              </button>
          }
          
        </div>
      </div>
    )
  }

  const PinInput = () => {

    const handlePinInputChange = (e, index) => {
      const value = e.target.value;
      if (!/^\d?$/.test(value)) return; // only digits allowed

      const updatedDigits = [...setDigits.current];
      updatedDigits[index] = value;
      setDigits.current = updatedDigits;

      e.target.value = value;
      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }

      // Check if all inputs are filled
      if (updatedDigits.every((digit) => digit !== "")) {
        setPin.current = updatedDigits.join("");
      }
    }

    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }

    return (
      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <input
            key={i}
            type="number"
            maxLength="1"
            className="w-12 h-12 text-xl text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handlePinInputChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            ref={(el) => (inputsRef.current[i] = el)}
          />
        ))}
      </div>
    )
  }

  useEffect(() => {
    getTBucksAndTPoints()
  },[])

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [getProcess.pin])

  useEffect(() => {
    if((walletData.t_bucks - getFormData.amount) < 0 || getFormData.amount < 0){
      setFormData((prevFormData) => ({
        ...prevFormData,
        ['amount']: 0
      }))
    }
  }, [getFormData.amount]);

  useEffect(() => {
    setFormData(initialFormData);
  }, [selected]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 mb-10 md:grid-cols-2">
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
                "t-bucks",
                walletData.t_bucks,
                [
                  {
                    onPressAction: () => navigate('/t-bucks-transfer'),
                    title: 'Transfer',
                    icon: <TbTransfer className="text-[20px] text-white" />
                  }
                ]
              )
          }
        </div>
      </div>
    </div>  
  ) 
}

export default AccountWithdrawTBucks
