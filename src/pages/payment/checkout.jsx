
import React, { useCallback, useState, useEffect } from "react";

import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

import { IoIosCloseCircleOutline } from "react-icons/io";

import * as api_content from '../../services/content/content.api'

const env = import.meta.env;

function Checkout({
    token,
    totalAmount = 0,
    statusMessage,
    dataContent,
    handleClose,
    stripePublicKey = env.VITE_APP_STRIPE_PUBLIC_KEY
}) {

    const [getclientSecret, setclientSecret] = useState(null)
    const [getLoading, setLoading] = useState(false)
    
    const stripePromise = loadStripe(stripePublicKey);

    const fetchClientSecret = async() => {
        setLoading(true)
        await api_content.GetClientSecret(token, dataContent).then((result) =>{
            if(result.status){
                setclientSecret(result.data.clientSecret)
            }
            setLoading(false)
        }).catch((err) =>{
            console.log("fetchClientSecret", err)
        })
    };
    
    useEffect(() =>{
        fetchClientSecret()
    },[])

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40">
            <div className="w-full md:max-w-[70%] md:p-4 p-2 transition-transform bg-white shadow-lg rounded-t-2xl max-h-[95%] overflow-y-auto">
                <div className='flex justify-end'>
                    <button onClick={handleClose} className='flex items-center justify-center p-1 mr-2'>
                        <IoIosCloseCircleOutline  className="text-[23px] text-[#ff4949]" />
                    </button>
                </div>
                {
                    !getLoading
                    ?
                        <div id="checkout">
                            <EmbeddedCheckoutProvider
                            stripe={stripePromise}
                            options={{clientSecret: getclientSecret }}
                            >
                                <EmbeddedCheckout />
                            </EmbeddedCheckoutProvider>
                        </div>
                    :
                        <main className="grid min-h-full px-6 py-24 bg-white place-items-center sm:py-32 lg:px-8">
                            <div className="text-center">
                                <span className="loading loading-ring loading-xl"></span>
                                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Initializing secure payment</h1>
                                <p className="mt-6 text-base leading-7 text-gray-600">Loading payment form, please wait...</p>
                            </div>
                        </main>
                }   
            </div>
        </div>
    )
}

export default Checkout