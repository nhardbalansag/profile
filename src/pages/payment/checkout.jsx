
import React, { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {useSelector} from 'react-redux';
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
    closeButtonMessage,
    clientSecret,
    getLoading,
    handleClose,
    stripePublicKey = env.VITE_APP_STRIPE_PUBLIC_KEY,

    isEbanx = false,
}) {

    const stripePromise = loadStripe(stripePublicKey);

    //#region translation convertion
    const auth_states = useSelector(state => state.AuthReducer);
  
    useEffect(() =>{
      auth_states.PageLanguages.map((item, key) =>{
        const translation = item.translation
        
        if(translation.length > 0 && auth_states.SelectedLanguage){
          const filteredTranslation = translation.find(translation_item => translation_item.language_id == auth_states.SelectedLanguage.id)
          const targetElement = document.getElementsByClassName(item.page_config_id)
          if (targetElement) {
            if (targetElement.length > 0 && filteredTranslation) {
              Array.from(targetElement).forEach((el) => {
                el.textContent = filteredTranslation.page_config_title;
              })
            } else if (targetElement.length > 0) {
              Array.from(targetElement).forEach((el) => {
                el.textContent = item.page_config_title;
              })
            }
          }
        }
      })

    },[auth_states, getLoading])
    //#endregion

    return (
        <div 
         style={{
            zIndex: 5000
        }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40">
            <div className="w-full md:max-w-[70%] md:p-4 p-2 transition-transform bg-white shadow-lg rounded-t-2xl max-h-[95%] overflow-y-auto">
                <div className='flex justify-end'>
                    <button onClick={handleClose} className='flex items-center justify-center p-1 mr-2'>
                        {
                          closeButtonMessage
                          ? 
                            <p className="text-lg font-semibold">
                              {closeButtonMessage}
                            </p>
                          : <IoIosCloseCircleOutline  className="text-[23px] text-[#ff4949]" />
                        }
                    </button>
                </div>
                {
                    !getLoading
                    ? 
                        isEbanx
                        ?
                          <div>
                            <iframe
                              src={clientSecret}
                              title="EBANX Checkout"
                              width="100%"
                              height="1000"
                            />
                          </div>
                        :
                          <div id="checkout">
                              <EmbeddedCheckoutProvider
                              stripe={stripePromise}
                              options={{clientSecret: clientSecret }}
                              >
                                  <EmbeddedCheckout />
                              </EmbeddedCheckoutProvider>
                          </div>
                    :
                        <main className="grid min-h-full px-6 py-24 bg-white place-items-center sm:py-32 lg:px-8">
                            <div className="text-center">
                                <span className="loading loading-ring loading-xl"></span>
                                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl initializing_secure_payment_id">Initializing secure payment</h1>
                                <p className="mt-6 text-base leading-7 text-gray-600 loading_payment_form_please_wait_label_id">Loading payment form, please wait...</p>
                            </div>
                        </main>
                }   
            </div>
        </div>
    )
}

export default Checkout