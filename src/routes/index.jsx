
import React, {useEffect} from 'react'

import { useDispatch } from "react-redux";
import {useSelector} from 'react-redux';
import { Navigate } from "react-router-dom";
import { useRouteError } from "react-router-dom";
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link } from "react-router-dom";

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";

import {
    HomePage,
    HomeContent,

    DestinationContent,
    DestinationPage,

    LoginPage,
    LoginContent,

    NotFound,

    Checkout,

    AccountContent,
    AccountPage,

    AccountDetails,

    AccountOrders,

    MallContent,
    MallPage,
    MallTravel,
    MallMerchant,

    EventPage,
    EventContent,

    DetailsPage,

    AccountSubscription,

    AccountTransferTPoints,
    AccountTransferTBucks,
    AccountWithdrawTBucks,

    AccountCredentials,

    DistributionList,
    MallAcademy,
    AcademyIndex,
    PrivacyPolicy,
    MallLifeStyle,
    MallEarn,

    ProductDetails,

    LegacyCommissionList,

    MallGrow,
    MallShop,
    MallSocial,

    AccountSponsorProfile
} from '../pages/index'

import {
    getItem
} from '../store/store-index'

import { STORAGE_TOKEN, STORAGE_USER_INFORMATION, REDUX_PAYLOAD_INFORMATION } from "../store/auth/authAction";

import * as AuthAction from '../store/auth/authAction'
import * as api_page_config from '../services/page/page.api'

const ErrorPage = () =>{
  const error = useRouteError();
  return (
    <div>
      <h1>Oops!</h1>
      <p>{error.statusText || error.message}</p>
      {/* <p>{error}</p> */}

        <div className="flex items-center justify-center p-4">
            <div className="">
                <div className='text-center'>
                    <div className="flex justify-center mb-4">
                    <FaExclamationTriangle className="text-6xl text-orange-500" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-blue-700 uppercase">Something went wrong</h1>
                    <p className="mb-6 text-gray-600">
                    We’re sorry, but an unexpected error has occurred. Please try again or return to the homepage.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}

const GuestRoute = ({ children, route }) => {
    const auth_states = useSelector(state => state.AuthReducer);

    if (auth_states.StateToken) {
        return <Navigate to={route} replace />;
    }

    return children;
}

const AuthenticatedUsers = ({ children, route }) => {
    const auth_states = useSelector(state => state.AuthReducer);
    
    if (auth_states.StateToken) {
        return children;
    }

    return <Navigate to={route} replace />
}

const router = createBrowserRouter([
    {
        path: "/",
        loader: () => ({ message: "Hello Data Router!" }),
        Component: HomePage,  
        errorElement: <ErrorPage />,
        children:[
            {
                path: "",
                element: (
                    <AuthenticatedUsers route={'/login'}>
                        <HomeContent/>
                    </AuthenticatedUsers>
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "travel",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <MallTravel />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "merchant",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <MallMerchant />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "academy",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <MallAcademy />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "academy-index",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <AcademyIndex />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "lifestyle",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <MallLifeStyle />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "earn",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <MallEarn />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "grow",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <MallGrow />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "shop",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <MallShop />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "social",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <MallSocial />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
        ]
    },
    {
        path: "/",
        loader: () => ({ message: "Hello Data Router!" }),
        Component: DestinationPage,  
        errorElement: <ErrorPage />,
        children:[
            {
                path: "destination",
                element: <DestinationContent/>,
                errorElement: <ErrorPage />
            },
        ]
    },
    {
        path: "/",
        loader: () => ({ message: "Hello Data Router!" }),
        Component: LoginPage,  
        errorElement: <ErrorPage />,
        children:[
            {
                path: "login",
                element: ( 
                    <GuestRoute route={'/'}>
                        <LoginContent />
                    </GuestRoute> 
                ),
                errorElement: <ErrorPage />
            },
        ]
    },
    {
        path: "/",
        loader: () => ({ message: "Hello Data Router!" }),
        Component: AccountPage,  
        errorElement: <ErrorPage />,
        children:[
            {
                path: "account",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <AccountContent />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "details",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <AccountDetails />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "sponsor-details",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <AccountSponsorProfile />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "orders",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <AccountOrders />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "subscriptions",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <AccountSubscription />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "t-points-transfer",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <AccountTransferTPoints />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "t-bucks-transfer",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <AccountTransferTBucks />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "t-bucks-withdraw",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <AccountWithdrawTBucks />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "security",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <AccountCredentials />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "connects",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <DistributionList />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
            {
                path: "commissions",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <LegacyCommissionList />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
        ]
    },
    // {
    //     path: "mall",
    //     Component: MallPage,  
    //     errorElement: <ErrorPage />,
    //     children:[
    //         {
    //             path: "",
    //             element: ( 
    //                 <AuthenticatedUsers route={'/login'}>
    //                     <MallTravel />
    //                 </AuthenticatedUsers> 
    //             ),
    //             errorElement: <ErrorPage />
    //         },
    //         {
    //             path: "merchant",
    //             element: ( 
    //                 <AuthenticatedUsers route={'/login'}>
    //                     <MallMerchant />
    //                 </AuthenticatedUsers> 
    //             ),
    //             errorElement: <ErrorPage />
    //         },
    //         {
    //             path: "academy",
    //             element: ( 
    //                 <AuthenticatedUsers route={'/login'}>
    //                     <MallAcademy />
    //                 </AuthenticatedUsers> 
    //             ),
    //             errorElement: <ErrorPage />
    //         },
    //         {
    //             path: "academy-index",
    //             element: ( 
    //                 <AuthenticatedUsers route={'/login'}>
    //                     <AcademyIndex />
    //                 </AuthenticatedUsers> 
    //             ),
    //             errorElement: <ErrorPage />
    //         },
    //     ]
    // },
    {
        path: "event",
        Component: EventPage,  
        errorElement: <ErrorPage />,
        children:[
            {
                path: "",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <EventContent />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
        ]
    },
    {
        path: "product-details",
        element: ( 
            <ProductDetails />
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "content-details",
        element: ( 
            <DetailsPage />
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "policy",
        element: ( 
            <PrivacyPolicy />
        ),
        errorElement: <ErrorPage />,
    },
    {
        path:"*",
        loader: () => ({ message: "Route not found!" }),
        Component: NotFound,
    },
])

const Routes = () =>{

    const auth_states = useSelector(state => state.AuthReducer);
    const dispatch = useDispatch()

    const validateAccess = async() =>{
        var token = await getItem(STORAGE_TOKEN)
        var userInformation = await getItem(STORAGE_USER_INFORMATION)
        var payload = await getItem(REDUX_PAYLOAD_INFORMATION)

        if(token && userInformation){
            dispatch(AuthAction.LoginUser(token, JSON.parse(userInformation), payload))
        }
    }

    const GetAllLanguages = async() =>{
        await api_page_config.GetAllLanguages().then((result) =>{
            if(result.status){
                dispatch(AuthAction.GetAllLanguages(result.data.data))
            }
        }).catch((err) =>{
            console.error("GetAllLanguages error:", err);
        })
    }

    const getAllActivePageConfig = async() =>{
        await api_page_config.getAllActivePageConfig().then((result) =>{
            if(result.status){
                dispatch(AuthAction.GetPageLanguageTranslation(result.data.data))
            }
        }).catch((err) =>{
            console.error("getAllActivePageConfig error:", err);
        })
    }

    useEffect(() =>{
        GetAllLanguages()
        getAllActivePageConfig()
    },[])

    useEffect(() =>{
        if(!auth_states.StateToken){
            validateAccess()
        }
    },[])

    return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

export default Routes;