import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

import {
  HomeCard,
} from '../../component/index'

import * as api_content from '../../services/content/content.api'
import * as auth_service_api from '../../services/auth/auth.api'
import * as api_account from '../../services/account/account.api.js'

import Logo2 from '../../assets/images/ten/logo2.png'

const env = import.meta.env;

const MallTravel = () =>{

  const navigate = useNavigate();

  const auth_states = useSelector(state => state.AuthReducer);
  const modalSubscriptionRef = useRef(null);
  const modalRef = useRef(null);
  const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)  // null means main translation is used

  const [ResultGetHomeContents, ResultSetHomeContents] = useState([]);

  const [loadingContent, setLoadingContent] = useState(true);
  const [getLoading, setLoading] = useState(false)

  const [getPlatformLoading, setPlatformLoading] = useState({
    launchButton: false
  })

  const [subscriptionList, SetSubscriptionList] = useState([])
  const [selectedPlan, setSelectedPlan] = useState("");

  const GetTravelBucketListContent = async() =>{
    setLoadingContent(true)
    await api_content.GetTravelBucketListContent(auth_states.StateToken).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        ResultSetHomeContents(result.data.data)
      }
    }).catch((err) =>{
      console.log("GetTravelBucketListContent", err)
    })
  }

  const userSubscriptionCategories = async (event) =>{
    setLoading(true)
    await auth_service_api.userSubscriptionCategories().then((result) =>{
      SetSubscriptionList(result.data.data)
      setLoading(false)
    }).catch((err) =>{
      setLoading(false)
      // setToastVisibility(true)
      // setToastMessage(err)
    })
  }

  const xeniRegisterApi = async () =>{

    setPlatformLoading(prev => ({
      ...prev,
      launchButton: true
    }));

    const requestBody = {
      "first_name": auth_states.StateUserInformation.first_name,
      "last_name": auth_states.StateUserInformation.last_name,
      "email": auth_states.StateUserInformation.email,
      "agencyCustomDNS": "https://ota.clubten.app",
      "agencyName": "Club TEN Global by Planet Empire FZCO"
    }

    await api_account.xeniRegisterApi(requestBody).then((result) =>{

      setPlatformLoading(prev => ({
        ...prev,
        launchButton: false
      }));

      UpdateAccountXeniPlatformAccess()
       
    }).catch((err) =>{
      setPlatformLoading(prev => ({
        ...prev,
        launchButton: false
      }));

      if(!err.response.data.status){
        if(err.response.data.message.includes("duplicate")){
          UpdateAccountXeniPlatformAccess()
        }
      }
    })
  }

  const UpdateAccountXeniPlatformAccess = async () =>{

    setPlatformLoading(prev => ({
      ...prev,
      launchButton: true
    }));

    await api_account.UpdateAccountXeniPlatformAccess(auth_states.StateToken).then((result) =>{

      setPlatformLoading(prev => ({
        ...prev,
        launchButton: false
      }));

      if(result.status){
        requestToken()
      }

    }).catch((err) =>{
      setPlatformLoading(prev => ({
        ...prev,
        launchButton: false
      }));
    })
  }

  const requestToken = async () =>{

    setPlatformLoading(prev => ({
      ...prev,
      launchButton: true
    }));

    await api_account.requestToken(auth_states.StateToken).then((result) =>{

      setPlatformLoading(prev => ({
        ...prev,
        launchButton: false
      }));

      if(!result.data.hasAccess){
        setTimeout(() => {
          modalRef.current?.showModal();
        }, 0); // Delay to ensure DOM is ready
      }
      else{
        if(result.data.registered_to_xeni){
          // window.open(result.data.redirectUrl, '_blank');
          window.location.href = result.data.redirectUrl;
        }else{
          xeniRegisterApi()
        }
      }

    }).catch((err) =>{
      setPlatformLoading(prev => ({
        ...prev,
        launchButton: false
      }));
    })
  }

  const _PlanSelect = ({dataList}) => {
    return(
      <div className="w-full p-6 ">
        <h2 className="mb-2 text-2xl font-bold text-center select_membership_label_id">Select Membership</h2>
        <p className="mb-6 text-sm text-center text-gray-600 select_membership_that_matches_your_goals_id">
          Select the membership that matches your goals
        </p>
        <div className="space-y-4">
          {dataList.map((item, key) => (
            <div
              key={key}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                // selectedPlan === item.subscription_earning_table.id
                selectedPlan === item.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              // onClick={() => setSelectedPlan(item.subscription_earning_table.id)}
              onClick={() => {
                setSelectedPlan(item.id);
                navigate('/subscriptions')
              }}
            >
              <div>
                <h3 className="text-lg font-semibold">
                  {
                    selectedLanguage.current == null 
                    ? item.membership_type.type_title
                    : (
                        item.membership_type.translation.translation
                        ?
                          (
                              item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                            ? item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_title 
                            : item.membership_type.type_title
                          )
                        : item.membership_type.type_title
                      )
                  }
                </h3>
                <p className="text-sm text-gray-500">
                  {
                    selectedLanguage.current == null 
                    ? item.membership_type.type_description
                    : (
                        item.membership_type.translation.translation
                        ?
                          (
                              item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                            ? item.membership_type.translation.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).type_description 
                            : item.membership_type.type_description
                          )
                        : item.membership_type.type_description
                      )
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="space-x-2 text-lg font-semibold">
                  <span>${item.subscription_price} </span>
                  <span>/</span>
                  <span className="text-sm font-normal">
                    {
                      selectedLanguage.current == null 
                      ? item.subscription_range.subscription_range_name
                      : (
                          item.subscription_range.params 
                          ?
                            (
                              item.subscription_range.params.translation
                              ?
                                (
                                    item.subscription_range.params.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                  ? item.subscription_range.params.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).subscription_range_name 
                                  : item.subscription_range.subscription_range_name
                                )
                              : item.subscription_range.subscription_range_name
                            )
                          : item.subscription_range.subscription_range_name
                        )
                    }
                  </span>
                </p>
                <p className="space-x-1 text-xs text-gray-400">
                  <span className='billed_after_label_id'>Billed after </span>
                  <span>{item.subscription_range.subscription_range_days_count}</span> 
                  <span className='days_id'>days</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const ModalForUpgradeSubscription = () =>{
    return(
      <div>
        <dialog ref={modalRef} id="my_modal_2" className="modal">
          <div className="modal-box">
            <div className="flex-1">
              <img
                src="https://www.xeni.com/wp-content/uploads/2024/11/Search-Result-5-1.png" // Replace with actual image path
                alt="Travel App Preview"
                className="w-full shadow-lg rounded-2xl"
              />
            </div>
            <div className="flex-1 mt-5 space-y-1 md:space-y-8">
              <h2 className="text-2xl font-extrabold leading-tight text-center text-black capitalize md:text-3xl available_only_for_paid_and_active_memberships_label_id">
                available only for paid and active memberships.
              </h2>

              <div className="flex flex-col items-center space-y-3 ">
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-full">
                      <img
                      className="w-[60px] md:w-[100px]"
                      alt="Tailwind CSS chat bubble component"
                      src={Logo2} />
                  </div>
                  {/* Text Content */}
                  <div className="flex-1 text-center">
                      <p className="text-sm font-semibold earn_more_points_label_id">Earn more points</p>
                      <p className="text-xs text-gray-600 paid_memberships_could_save_time_and_money_finding_great_deals_label_id">
                          Paid Memberships could save time and money finding great deals.
                      </p>
                  </div>
              </div>
              {
                getLoading
                ?
                  <div className=''>
                    <div className="flex flex-col justify-center w-full gap-4 py-10">
                      <div className="w-full h-32 skeleton"></div>
                      <div className="h-4 skeleton w-28"></div>
                      <div className="w-full h-4 skeleton"></div>
                    </div>
                  </div>
                :
                <_PlanSelect dataList={subscriptionList}/>
              }
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button className='close_label_id'>close</button>
          </form>
        </dialog>
      </div>
    )
  }
  
  const NoCodePromo = () =>{
    return (
      <div className="flex flex-col items-center gap-8 p-6 mx-auto text-white bg-white border shadow-lg md:p-10 rounded-2xl md:flex-row">
        {/* Left: App Preview (Image) */}
        <div className="flex-1">
          <img
            src="https://www.xeni.com/wp-content/uploads/2024/11/Search-Result-5-1.png" // Replace with actual image path
            alt="Travel App Preview"
            className="w-full shadow-lg rounded-2xl"
          />
        </div>
    
        {/* Right: Text Content */}
        <div className="flex-1 space-y-1 md:space-y-8">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-black bg-yellow-400 rounded-full w-fit new_label_id">
            NEW
          </span>
          <ol className='space-y-2'>
            <li className='space-x-1 text-2xl leading-tight text-black capitalize md:text-3xl'>
              <span className='mr-3 font-bold 1_label_id'>1.</span> 
              <span className='enjoy_huge_savings_and_wholesale_discounts_on_hotels_worldwide_label_id'>
                Enjoy huge savings and wholesale
              discounts on hotels worldwide
              </span>
            </li>
             <li className='space-x-1 text-2xl leading-tight text-black capitalize md:text-3xl'>
              <span className='mr-3 font-bold 2_label_id'>2.</span> 
              <span className='preferred_customers_earn_0_5_cashback_label_id'>
                Preferred customers earn 0.5%
              cashback
              </span>
            </li>
             <li className='text-2xl leading-tight text-black capitalize md:text-3xl'>
              <span className='mr-3 font-bold 3_label_id'>3.</span> 
              <span className='vip_members_earn_1_cashback_label_id'>VIP members earn 1% cashback</span>
            </li>
          </ol>
  
          <div className="flex gap-4 pt-4">
            {
              getLoading
              ?
                <span className="text-black loading loading-spinner loading-sm"></span>
              :
                getPlatformLoading.launchButton 
                ? <span className="text-black loading loading-spinner loading-sm"></span>
                :
                <button 
                  disabled={getPlatformLoading.launchButton}
                  onClick={() => requestToken()}
                  className="px-6 py-2 font-bold text-white bg-orange-500 btn hover:bg-orange-600 rounded-xl">
                  <p className='launch_now_label_id'>LAUNCH NOW</p>
                </button>
            }
          </div>
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
                <h2 className="text-2xl font-extrabold leading-tight text-center text-black capitalize md:text-3xl available_only_for_vip_members_label_id">
                available only for VIP members.
                </h2>

                <div className="flex flex-col items-center space-y-3 ">
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-full">
                    <img
                    className="w-[60px] md:w-[100px]"
                    alt="Tailwind CSS chat bubble component"
                    src={Logo2} />
                  </div>
                  {/* Text Content */}
                  <div className="flex-1 text-center">
                    <p className="text-sm font-semibold earn_more_points_label_id">Earn more points</p>
                    <p className="text-xs text-gray-600 paid_memberships_could_save_time_and_money_finding_great_deals_label_id">
                      Paid Memberships could save time and money finding great deals.
                    </p>
                  </div>

                  <div className='flex justify-center'>
                    <button onClick={() => navigate('/subscriptions')} className="px-6 py-3 text-white transition-colors bg-[#031956] rounded-lg whitespace-nowrap upgrade_membership_label_id">
                    Upgrade Membership
                    </button>
                  </div>
                </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
              <button className='close_label_id'>close</button>
          </form>
        </dialog>
      </div>
    )
  }

  useEffect(()=>{
      userSubscriptionCategories()
      GetTravelBucketListContent()
  },[])

  useEffect(() =>{
    if(auth_states.SelectedLanguage){
      selectedLanguage.current = parseInt(auth_states.SelectedLanguage.id)
      GetTravelBucketListContent()
      userSubscriptionCategories()
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
  
  return (
    <div className=''>
      <div className='flex justify-center my-5'>
        <div className='md:w-[75%] w-[95%]'>
          <p className='font-extrabold text-[#001d3d] text-[25px] text-center capitalize travel_the_world_with_club_ten_label_id'>
            Travel the world with Club TEN
          </p>
        </div>
      </div>
      <div className='flex justify-center mb-[50px]'>
        <div className='md:w-[75%] w-[95%]'>
          {NoCodePromo()}
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='md:w-[75%] w-[95%]'>
          <p className='font-extrabold text-[#001d3d] text-[25px] capitalize upcoming_bucket_list_experiences_label_id'>Upcoming Bucket List Experiences</p>
        </div>
      </div>
      <div className='flex justify-center my-5 mb-[150px]'>
        <div className='md:w-[75%] w-[95%] gap-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'>
          {
             ResultGetHomeContents.length > 0
             ?
              ResultGetHomeContents.map((item, index) =>(
                item.contents_table.length > 0
                ?
                  item.contents_table.map((item_content, index_content) =>(
                    <HomeCard 
                    categoryConfig={item.category_display_content.display.content_home_style}
                    contentDetails={item_content}
                    loading={loadingContent}
                    // clickOffers={() => HandleOfferDetails(item_content)}
                    title={
                      selectedLanguage.current == null 
                      ? item_content.content_title
                      : (
                            item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                          ? item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_title
                          : item_content.content_title
                        )
                    }
                    // clickSeeDetails={() => HandleSeeDetails(item_content)}
                    details={
                      selectedLanguage.current == null 
                      ? item_content.content_description
                      : (
                            item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                          ? item_content.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_description
                          : item_content.content_description
                        )
                    }
                    image={
                        item_content.uploads_table_main_view.upload_type == "url"
                      ? item_content.uploads_table_main_view.upload_url 
                      : env.VITE_APP_BACKEND_STORAGE_URL + item_content.uploads_table_main_view.upload_url
                    } 
                    days={item_content.content_days_count}
                    nights={item_content.content_night_count}
                    location='--'
                    // collapseDetails={ResultGetHomeContentsDetails.id == item_content.id ? collapseDetails : false} 
                    isLiked={false}
                    />
                  ))
                :
                  (
                    ResultGetHomeContents.length <= 0 &&
                    [1,2,3,4].map((item_content, index_content) =>(
                      <HomeCard loading={true}/>
                    ))
                  )
              ))
             :
              (
                  ResultGetHomeContents.length <= 0 &&
                  [1,2,3,4].map((item_content, index_content) =>(
                    <HomeCard loading={true}/>
                  ))
                )
          }
        </div>
      </div>
      
      <ModalForUpgradeSubscription/>
      <ModalForUpgradeSubscriptionWhenVIP/>
      <ToastContainer />
    </div>  
  ) 
}

export default MallTravel
