import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import * as api_content from '../../services/content/content.api'
import * as api_subscription from '../../services/account/subscription.api.js'

import Logo2 from '../../assets/images/ten/logo2.png'

const MallGrow = () => {

  const modalSubscriptionRef = useRef(null);
  const navigate = useNavigate();

  const auth_states = useSelector(state => state.AuthReducer);

  const [loadingContent, setLoadingContent] = useState(true);
  
  const [ResultGetHomeContents, ResultSetHomeContents] = useState(null);
  const [AccountSubscriptionDetails, SetAccountSubscriptionDetails] = useState([])
  const [requestLoading, setRequestLoading] = useState(false);

  const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)  // null means main translation is used

  const GetUserAccountSubscriptionDetails = async () =>{
    setRequestLoading(true)
    await api_subscription.GetUserAccountSubscriptionDetails(auth_states.StateToken).then((result) =>{
      SetAccountSubscriptionDetails(result.data.data)
      setRequestLoading(false)
    }).catch((err) =>{
      setRequestLoading(false)
    })
  }
  
  const validateAccess = () =>{

    const account_membership_is_paid = AccountSubscriptionDetails.details.subscription_category.membership_type.translation.membership.is_paid_account

    if(!account_membership_is_paid){
      setTimeout(() => {
        modalSubscriptionRef.current?.showModal();
      }, 0)
    }else{
      navigate('/grow-paid-content')
    }
  }

  const ShowContent = async() =>{
    setLoadingContent(true)

    await api_content.GetGrowPageContent(auth_states.StateToken).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        if (result.data.data) {
          ResultSetHomeContents(result.data.data)
        }
      }
    }).catch((err) =>{
      console.log("ShowContent", err)
    })
  }

  useEffect(()=>{
    ShowContent()
    GetUserAccountSubscriptionDetails()
  },[])

  useEffect(() =>{
    if(auth_states.SelectedLanguage){
      selectedLanguage.current = parseInt(auth_states.SelectedLanguage.id)
      ShowContent()
    }
  },[auth_states])
  
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
            });
          } else if (targetElement.length > 0) {
            Array.from(targetElement).forEach((el) => {
                el.textContent = item.page_config_title;
            });
          }
        }
      }
    })
  },[auth_states, loadingContent])
  
  const LoadComp = () =>{
    return(
      <div className=''>
        <div className="flex flex-col justify-center w-full gap-4 py-10">
          <div className="w-full h-32 skeleton"></div>
          <div className="h-4 skeleton w-28"></div>
          <div className="w-full h-4 skeleton"></div>
          <div className="w-full h-4 skeleton"></div>
        </div>
      </div>
    )
  }

  const ModalForUpgradeSubscriptionWhenVIP = () =>{
    return(
      <div>
        <dialog ref={modalSubscriptionRef} id="my_modal_2" className="modal">
          <div className="modal-box">
            <div className="flex-1 mt-5 space-y-1 md:space-y-8">
                <h2 className="text-2xl font-extrabold leading-tight text-center text-black capitalize available_only_for_active_vip_members_label_id md:text-3xl">
                available only for active VIP members.
                </h2>

                <div className="flex flex-col items-center space-y-3 ">
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-full">
                    <img
                    className="w-[60px] md:w-[100px]"
                    // alt="Tailwind CSS chat bubble component"
                    src={Logo2} />
                  </div>
                  {/* Text Content */}
                  <div className="flex-1 text-center">
                    <p className="text-sm font-semibold earn_more_points_id">Earn more points</p>
                    <p className="text-xs text-gray-600 members_could_save_id">
                      Paid Memberships could save time and money finding great deals.
                    </p>
                  </div>

                  <div className='flex justify-center'>
                    <button onClick={() => navigate('/subscriptions')} className="upgrade_membership_label_id px-6 py-3 text-white transition-colors bg-[#031956] rounded-lg whitespace-nowrap">
                    Upgrade Membership
                    </button>
                  </div>
                </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
              <button>close</button>
          </form>
        </dialog>
      </div>
    )
  }

  return (
    <div className='mb-[150px] flex justify-center'>
      <div className=' w-[90%] md:w-[70%] my-10'>
        {
          !loadingContent &&
          <div className='flex justify-center'>
            <button 
              onClick={() => validateAccess()}
              className="px-6 py-2 font-bold text-white bg-orange-300 btn hover:bg-orange-600 rounded-xl">
              <p className='text-lg stocks_picks_button_label_id'>VIP content area</p>
            </button>
          </div>
        }
        
        {
          loadingContent
          ? 
            <div className='w-full'>
              <LoadComp/>
            </div>
          :
            ResultGetHomeContents &&
            <div 
            className="quill-content"
            dangerouslySetInnerHTML={{
            __html: selectedLanguage.current == null 
                    ? ResultGetHomeContents.content_description
                    : 
                        JSON.parse(ResultGetHomeContents.translations)
                        ?
                            (
                                JSON.parse(ResultGetHomeContents.translations).find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                ? JSON.parse(ResultGetHomeContents.translations).find((filter_item) => filter_item.language_id == selectedLanguage.current).content_description
                                : ResultGetHomeContents.content_description
                            )
                        : ResultGetHomeContents.content_description
            }} 
            ></div>
        }
      </div>
      {ModalForUpgradeSubscriptionWhenVIP()}
    </div>
  );
};

export default MallGrow;

