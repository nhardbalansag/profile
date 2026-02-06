import React, { useState, useRef, useEffect, useMemo, useCallback  } from 'react';
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { MapPin, Compass } from "lucide-react";
import { CiSearch } from "react-icons/ci";
import { AiOutlineAlignRight } from "react-icons/ai";
import { LuSettings2 } from "react-icons/lu";
import { LuTags } from "react-icons/lu";
import { FiHeart } from "react-icons/fi";

import { Search, ChevronDown, ChevronUp, Grid, List, Heart, Users, Calendar, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from 'date-fns';

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

  const [currentEngagement, setCurrentEngagement] = useState([]);
  
  const [paginate, setPaginate] = useState(null)
  const [getPaginatedTripContents, setPaginatedTripContents] = useState({
    prev_page_url:  null,
    first_page_url:null,
    last_page_url:null,
    next_page_url:  null,
    current_page: null,
    last_page:null,
    total:0,
    from:0,
    to:0,
    data:[]
  })

  const [destinations, setDestinations] = useState([]);

  const [ResultGetHomeContents, ResultSetHomeContents] = useState([]);

  const [loadingContent, setLoadingContent] = useState(true);
  const [getLoading, setLoading] = useState(false)

  const [getPlatformLoading, setPlatformLoading] = useState({
    launchButton: false
  })

  const [subscriptionList, SetSubscriptionList] = useState([])
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const sortOptions = [
    { value: 'recent', label: 'Recently Added' },
    { value: 'duration_asc', label: 'Duration: Short to Long' },
    { value: 'duration_desc', label: 'Duration: Long to Short' },
    { value: 'alphabetical_asc', label: 'Alphabetical: A-Z' },
    { value: 'alphabetical_desc', label: 'Alphabetical: Z-A' },
  ];  

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState(sortOptions[0]);
  const dropdownRef = useRef(null);

  const [getSearchContent, setSearchContent] = useState({
    search: "",
  })

  const GetTravelBucketListContent = useCallback(async () => {
    setLoadingContent(true)

    let category_sort = (destinations || []).filter(item => item?.checked).map(item => item.id);

    const request = {
      search: getSearchContent.search,
      sort: sortOption.value,
      category: category_sort
    }

    await api_content.GetTravelBucketListContent(auth_states.StateToken, paginate, request).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        // ResultSetHomeContents(result.data.data)
        Object.keys(result.data.data).map((item, key) =>{
          setPaginatedTripContents((prevFormData) => ({
            ...prevFormData,
            [item]: result.data.data[item]
          }));
        })
      }
    }).catch((err) =>{
      console.log("GetTravelBucketListContent", err)
    })
  }, [getSearchContent, paginate, sortOption, auth_states.StateToken, destinations]);

  const GetAllBucketListCategory = async () =>{
    setLoading(true)
    await api_content.GetAllBucketListCategory(auth_states.StateToken).then((result) =>{
      if(result.status){
        const formatted = result.data.data.map((item) => ({
          id: item.id,
          name: item.category_title || 'Unnamed Category',
          translation: item.translation,
          count: item.contents_table_count || 0,
          checked: false,
        }));

        setDestinations(formatted);
      }
      setLoading(false)
    }).catch((err) =>{
      setLoading(false)
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
                      // alt="Tailwind CSS chat bubble component"
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
            <li className='space-x-1 text-xl leading-tight text-black capitalize md:text-md'>
              <span className='mr-3 font-bold 1_label_id'>1.</span> 
              <span className='enjoy_huge_savings_and_wholesale_discounts_on_hotels_worldwide_label_id'>
                Enjoy huge savings and wholesale
              discounts on hotels worldwide
              </span>
            </li>
             <li className='space-x-1 text-xl leading-tight text-black capitalize md:text-md'>
              <span className='mr-3 font-bold 2_label_id'>2.</span> 
              <span className='preferred_customers_earn_0_5_cashback_label_id'>
                Preferred customers earn 0.5%
              cashback
              </span>
            </li>
             <li className='text-xl leading-tight text-black capitalize md:text-md'>
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
                    // alt="Tailwind CSS chat bubble component"
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

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    
    setSearchContent((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const AddContentEngagement = async(content_id) =>{

    const request = {
      content_id: content_id
    }

    await api_content.AddContentEngagement(auth_states.StateToken, request).then((result) =>{
      setCurrentEngagement(result.data.data)
    }).catch((err) =>{
      console.log("AddContentEngagement", err)
    })
  }

  useEffect(()=>{
      userSubscriptionCategories()
  },[])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (getSearchContent.search?.trim() === "" || !getSearchContent.search) {
        GetTravelBucketListContent()
        return;
      }

      GetTravelBucketListContent();
    }, 1500)

    return () => clearTimeout(handler)
  }, [getSearchContent, paginate, sortOption, destinations])

  useEffect(() =>{
    GetAllBucketListCategory()
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
  },[auth_states, loadingContent, selectedCategory, paginate, getSearchContent, sortOption, destinations])

  const useMemoFilteredContents = useMemo(() => {
    return getPaginatedTripContents?.data.filter(
      (category) => category.id === selectedCategory
    );
  }, [getPaginatedTripContents, selectedCategory]);

  const toggleDestination = (id) => {
    setDestinations(destinations.map(dest => 
      dest.id === id ? { ...dest, checked: !dest.checked } : dest
    ))
  }

  const TripSortComp = () =>{

    const [showAllDestinations, setShowAllDestinations] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 11, max: 450 });
    const [durationRange, setDurationRange] = useState({ min: 0, max: 7 });

    const clearAllFilters = () => {
      setDestinations(destinations.map(dest => ({ ...dest, checked: false })));
      setPriceRange({ min: 11, max: 450 });
      setDurationRange({ min: 0, max: 7 });
    };

    const displayedDestinations = showAllDestinations ? destinations : destinations.slice(0, 5);

    return (
      <div className="h-screen p-6 mb-5 font-sans bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 filter_by_label_id">Filter By</h2>
          <button 
            onClick={clearAllFilters}
            className="text-sm font-medium text-orange-600 transition-colors hover:text-orange-800 clear_all_label_id"
          >
            Clear all
          </button>
        </div>

        {/* Destination Section */}
        <div className="mb-6">
          <h3 className="mb-3 font-medium text-gray-700 text-md destination_label_id">Destination</h3>
          <div className="space-y-2">
            {displayedDestinations.map((destination) => (
              <div key={destination.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={destination.checked}
                    onChange={() => toggleDestination(destination.id)}
                    className="checkbox checkbox-warning"
                  />

                  <label className="ml-2 text-sm text-gray-700">
                    {
                      selectedLanguage.current == null 
                      ?  destination.name 
                      : (
                            destination.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                          ? destination.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).display_title
                          :  destination.name
                        )
                    }
                  </label>
                </div>
                <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded">
                  {destination.count}
                </span>
              </div>
            ))}
          </div>
          
          {/* Show Less/More Toggle */}
          {destinations.length > 5 && (
            <button
              onClick={() => setShowAllDestinations(!showAllDestinations)}
              className="mt-3 text-sm font-medium text-orange-600 transition-colors hover:text-orange-800"
            >
              {
                showAllDestinations 
                ? <span className='show_less_label_id'>Show Less</span> 
                : <span className='show_more_label_id'>Show More</span>
              }
            </button>
          )}
        </div>

        {/* Duration Section */}
        {/* <div className="mb-2">
          <h3 className="mb-3 font-medium text-gray-700 text-md">Duration</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{durationRange.min} Days</span>
            <span className="text-sm text-gray-600">{durationRange.max} Days</span>
          </div>
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 flex justify-between">
              <input type="range" min={0} max="100" value="40" className="range range-sm range-warning"  />
            </div>
          </div>
        </div> */}
      </div>
    )
  }

  const TripCardComp = ({
    trip,
    featured = false
  }) =>{
    const [isFavorite, setIsFavorite] = useState(false);

    const limitText = (text, limit = 30) =>{
        if(text){
            return text.length > limit ? text.slice(0, limit) : text;
        }
    }
  
    return (
      <div 
      className="w-full transition-all duration-300 transform bg-white shadow-lg rounded-xl hover:shadow-2xl hover:-translate-y-2">
        <div className='p-4'>
          <div className='grid gap-4 xs:grid-cols-1 lg:grid-cols-2'>
            
            {/* image */}
            <div>
              <div className="relative">
                <div 
                style={{
                    backgroundImage: `url(${
                      trip.uploads_table_main_view?.upload_type == "url"
                      ? trip.uploads_table_main_view?.upload_url 
                      : env.VITE_APP_BACKEND_STORAGE_URL + trip.uploads_table_main_view?.upload_url
                    })`,
                }}
                className="relative w-full h-64 overflow-hidden rounded-b-none shadow-lg rounded-xl">
                    <img
                        src={
                          trip.uploads_table_main_view?.upload_type == "url"
                          ? trip.uploads_table_main_view?.upload_url 
                          : env.VITE_APP_BACKEND_STORAGE_URL + trip.uploads_table_main_view?.upload_url
                        }
                        alt=""  
                        className="absolute inset-0 object-contain w-full h-full"
                    />
                    <div className="relative z-10 flex flex-col justify-between h-full p-6 text-center text-white">
                      <div className=''>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h2 className="mb-2 text-3xl font-bold text-white drop-shadow-lg">
                            {
                              selectedLanguage.current == null 
                              ?  trip.content_category?.category_title 
                              : (
                                    trip.content_category.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                                  ? trip.content_category.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).display_title
                                  :  trip.content_category?.category_title 
                                )
                            }
                          </h2>
                          <p className="text-sm text-white/90 drop-shadow-sm discover_amazing_experiences_label_id">Discover amazing experiences</p>
                        </div>
                      </div>
                    </div>
                </div>
                
                <button
                  onClick={() => AddContentEngagement(trip?.id)}
                  className="absolute z-50 p-2 transition-colors rounded-full top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white"
                >
                  <Heart 
                  size={18} 
                  className={
                    currentEngagement &&
                    currentEngagement?.engagement &&
                    JSON.parse(currentEngagement?.engagement)?.reaction.length > 0
                    ?
                      JSON.parse(currentEngagement.engagement)?.reaction.find(item => item.user_id === auth_states.StateUserInformation.id) && 
                      "fill-orange-600 text-orange-600"
                    :
                      trip.engagement &&
                      JSON.parse(trip.engagement)?.reaction?.length > 0 &&
                      JSON.parse(trip.engagement)?.reaction.find(item => item.user_id === auth_states.StateUserInformation.id) && 
                      "fill-orange-600 text-orange-600"
                  } 
                  />
                </button>

                {featured && (
                  <span className="absolute px-3 py-1 text-xs font-semibold text-white bg-orange-400 rounded-full top-3 left-3">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <div className='grid xs:grid-cols-1 xl:grid-cols-2'>

              {/* descriptions */}
              <div>
                <div className="">
                  <h3 className="mb-2 text-lg font-bold text-foreground line-clamp-2">
                    {
                      selectedLanguage.current == null 
                        ? trip.content_title
                        : (
                              trip.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                            ? trip.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_title
                            : trip.content_title
                          )
                    }
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {
                      selectedLanguage.current == null 
                      ? trip.content_notes
                      : (
                            trip.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                          ? trip.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).content_notes
                          : trip.content_notes
                        )
                    }
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <MapPin size={18} className="text-orange-400" />
                    <span>
                      {
                        selectedLanguage.current == null 
                        ?  trip.content_category?.category_title 
                        : (
                              trip.content_category.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current)
                            ? trip.content_category.translation.find((filter_item) => filter_item.language_id == selectedLanguage.current).display_title
                            :  trip.content_category?.category_title
                          )
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <LuTags size={18} className="text-orange-400" />
                    <p className='space-x-2 capitalize'>
                      <span className='see_label_id'>see</span>
                      <span>
                        {
                            trip?.content_offers_table 
                            ? trip?.content_offers_table.length
                            : 0
                        }
                      </span>
                      <span className='offer_label_id'>offer</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <FiHeart size={18} className="text-orange-400" />
                    <p className='space-x-2 capitalize'>
                      <span>
                        {
                          currentEngagement &&
                          currentEngagement?.engagement &&
                          JSON.parse(currentEngagement?.engagement)?.reaction.length > 0
                          ?
                            JSON.parse(currentEngagement.engagement)?.reaction.length
                          :
                            trip.engagement &&
                            JSON.parse(trip.engagement)?.reaction?.length > 0 &&
                            JSON.parse(trip.engagement)?.reaction.find(item => item.user_id === auth_states.StateUserInformation.id) && 
                            JSON.parse(trip.engagement)?.reaction?.length
                        }
                      </span>
                      <span className='offer_label_id'>likes</span>
                    </p>
                  </div>

                </div>
              </div>

              {/* actions */}
              <div>
                <div>
                  <div className="flex items-center justify-between xs:border-t xs:border-border sm:border-0">
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground duration_id">Duration</p>
                      <p className="font-semibold text-foreground">
                        <p className="space-x-2 text-xs text-gray-600">
                          <span>{trip.content_days_count} </span>
                          <span className="days_id">Days</span>, 
                          <span>{trip.content_night_count} </span>
                          <span className="nights_id">Nights</span>
                        </p>
                        <p className="mt-1 text-xs text-gray-500">{format(new Date(trip.content_date_from), 'MMM dd, yyyy')} - {format(new Date(trip.content_date_to), 'MMM dd, yyyy')}</p>
                      </p>
                    </div>
                    {/* <div className="text-right">
                      <p className="text-2xl font-bold text-orange-700">${148}</p>
                    </div> */}
                  </div>
                  
                  <button 
                  onClick={() => navigate('/product-details?view=' + trip.id)} 
                  className="view_details_label_id w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    View Details
                  </button>
                  
                  <div className="mt-3">
                    <p className="mb-1 text-xs capitalize text-muted-foreground available_until">Available Until</p>
                    {
                      trip?.content_offers_table &&
                      trip?.content_offers_table.length > 0
                      ?
                          Object.entries(
                          trip?.content_offers_table.reduce((acc, item) => {
                            const date = item?.offers_table?.offers_end_effectivity_date;
                            const tierName =
                              selectedLanguage.current == null
                                ? item.offers_table?.tier_category_table.tier_category_name
                                : item.offers_table?.tier_category_table.translation
                                ? (
                                    item.offers_table?.tier_category_table.translation.find(
                                      (filter_item) =>
                                        filter_item.language_id == selectedLanguage.current
                                    )
                                      ? item.offers_table?.tier_category_table.translation.find(
                                          (filter_item) =>
                                            filter_item.language_id == selectedLanguage.current
                                        ).tier_category_name
                                      : item.offers_table?.tier_category_table.tier_category_name
                                  )
                                : item.offers_table?.tier_category_table.tier_category_name;

                            // group by date and collect tier names
                            if (!acc[date]) acc[date] = [];
                            if (!acc[date].includes(tierName)) acc[date].push(tierName);
                            return acc;
                          }, {})
                        ).map(([date, tiers], index) => (
                          <p key={index} className="flex items-center gap-1 space-x-1 text-sm text-foreground">
                            <span className="text-orange-400">✓</span> {date}
                            <span className="capitalize">
                              ({tiers.join(', ')})
                            </span>
                          </p>
                        ))
                      :
                      <p className="mb-1 text-xs text-red-400 capitalize unavailable_label_id">Unavailable</p>
                    }
                  </div>
                </div>
              </div>
              
            </div>

          </div>

          {/* availability */}
          <div>
            <div className="mt-5">
              <p className="mb-2 text-xs text-muted-foreground availability_label_id">Availability:</p>
              <div className="flex flex-wrap gap-1">
                {
                [
                  { data: "Jan", element: <span className="jan_label_id">Jan</span> },
                  { data: "Feb", element: <span className="feb_label_id">Feb</span> },
                  { data: "Mar", element: <span className="mar_label_id">Mar</span> },
                  { data: "Apr", element: <span className="apr_label_id">Apr</span> },
                  { data: "May", element: <span className="may_label_id">May</span> },
                  { data: "Jun", element: <span className="jun_label_id">Jun</span> },
                  { data: "Jul", element: <span className="jul_label_id">Jul</span> },
                  { data: "Aug", element: <span className="aug_label_id">Aug</span> },
                  { data: "Sep", element: <span className="sep_label_id">Sep</span> },
                  { data: "Oct", element: <span className="oct_label_id">Oct</span> },
                  { data: "Nov", element: <span className="nov_label_id">Nov</span> },
                  { data: "Dec", element: <span className="dec_label_id">Dec</span> },
                ].map((month, index) => (
                  <p
                    key={index}
                    className={`text-xs px-2 py-1 rounded ${
                      format(new Date(trip.content_date_from), 'MMM').includes(month.data)
                        ? "bg-orange-100 text-orange-500 font-medium"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {month.element}
                  </p>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    )
  }

  const TripSearchComp = () =>{

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionSelect = (option) => {
      setSortOption(option);
      setIsDropdownOpen(false);
    };

    return (
      <div className="bg-white border-b border-gray-200">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-y-0 left-0 flex items-center justify-center p-3 pointer-events-none ">
                <CiSearch size={25}/>
              </div>
              <input
                value={getSearchContent.search}
                onChange={(text) => handleChange(text)}
                name="search"
                type="text"
                placeholder="Search"
                className="block w-full py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Sort Dropdown and Results Count */}
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            {/* Custom Sort Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 transition-colors bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <span className="text-gray-700">Sort ({sortOption?.label})</span>
                <svg 
                  className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 z-10 w-56 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleOptionSelect(option)}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          sortOption?.value === option.value ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="my-3 space-x-3 font-normal text-gray-700">
          <span className='font-bold'>{getPaginatedTripContents.total}</span>
          <span className='item_found_label_id'>Item Found</span>
        </div>

      </div>
    )
  }

  const TripDrawerComp = () =>{
    return(
      <div style={{zIndex: 2000}} className="drawer">
        <input id="trip-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">

          {/* Header */}
          <label htmlFor="trip-drawer" className="w-[150px] btn btn-square justify-start btn-ghost drawer-button">
            <div className='flex items-center justify-center space-x-3'>
              <LuSettings2  color='black' size={25}/>
              <p className='font-medium apply_filters_label_id'>Apply Filters</p>
            </div>
          </label>
          
        </div> 
        <div className="z-50 h-screen drawer-side">
          <label htmlFor="trip-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <div class="h-screen w-[75%]">
              {/* <TripSortComp/> */}
              {TripSortComp()}
          </div>
        </div>
      </div>
    )
  }

  const LoadingComp = () =>{
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

      <div className='flex justify-center mt-5'>
        <div className='md:w-[75%] w-[95%]'>

          <div className='sm:flex sm:space-x-10 lg:bordered'>

            {/* desktop view filter */}
            <div className='w-[350px] hidden sm:block '>
              {/* <TripSortComp/> */}
              {TripSortComp()}
            </div>

            <div className='w-[100%]'>

              <div className=''>
                {/* mobile view filter */}
                <div className='xs:block sm:hidden'>
                  {/* <TripDrawerComp/> */}
                  {TripDrawerComp()}
                </div>
                {/* <TripSearchComp/> */}
                {TripSearchComp()}
              </div>

              <div className='flex justify-center'>
                <div className="grid grid-cols-1 gap-8 mt-10 w-[95%]">
                  {
                    loadingContent
                    ?
                      [1,2].map((item_content, index_content) =>(
                        <LoadingComp/>
                      ))
                    :
                      getPaginatedTripContents?.data.map((item, index) =>(
                          <TripCardComp 
                            key={index} 
                            trip={item} 
                          />
                      ))
                  }
                </div>
              </div>
            
              {/* pagination */}
              <div className='my-10 mb-[120px]'>
                <p className="text-sm font-semibold text-muted-foreground">
                  <span className='showing_label_id'>Showing</span>{' '}
                  <span>{getPaginatedTripContents.data.length}</span>{' '}
                  <span>of</span>{' '}
                  <span>{getPaginatedTripContents.total}</span>{' '}
                  <span className='contents_label_id'>contents</span>
                </p>
                <div className='w-[100%] mt-3'>
                  <div className="space-x-2 ">
                    {Array.from({ length: getPaginatedTripContents.last_page }, (_, i) => i + 1).map((page) =>  (
                      <button
                        key={page}
                        onClick={() => setPaginate(getPaginatedTripContents.path + "?page=" + page)}
                        className={`w-8 h-8 rounded-lg font-medium transition-colors duration-200 ${
                          page === getPaginatedTripContents.current_page
                            ? 'bg-orange-400 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <ModalForUpgradeSubscription/>
      <ModalForUpgradeSubscriptionWhenVIP/>
      <ToastContainer />
    </div>  
  ) 
}

export default MallTravel
