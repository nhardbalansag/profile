
import React, {useEffect, useState, useRef } from 'react'

import { useDispatch } from "react-redux";
import {useSelector} from 'react-redux';
import { Navigate } from "react-router-dom";
import { useRouteError } from "react-router-dom";
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link } from "react-router-dom";

import MaintenancePage from '../pages/support/maintenance-page'

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

    // EventDetailsPage,

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

    MallGrowPaidContent,

    Verification

    // AccountSponsorProfile
} from '../pages/index'

import {
    getItem
} from '../store/store-index'

import { STORAGE_TOKEN, STORAGE_USER_INFORMATION, REDUX_PAYLOAD_INFORMATION } from "../store/auth/authAction";

import * as AuthAction from '../store/auth/authAction'
import * as api_page_config from '../services/page/page.api'

const ErrorPage = () =>{
    const error = useRouteError();

    const CreateFrontendErrorLogs = async () => {
        if (!error) return;

        const requestBody = {
            message: error.message || "Unknown message",
            statusText: error.statusText || "Unknown statusText",
            pathname: window.location.pathname,
            userAgent: navigator.userAgent,
            error: JSON.stringify(error, Object.getOwnPropertyNames(error))
        };

        try {
            await api_page_config.CreateFrontendErrorLogs(requestBody);
        } catch (err) {
            console.error("Failed to send error log", err);
        } 
    };

    useEffect(() => {

        CreateFrontendErrorLogs()
        
        // Delay to let user briefly see the error
        const timer = setTimeout(() => {
            window.location.reload(); // Hard refresh
        }, 2000); // 2 seconds

        return () => clearTimeout(timer);
    }, []);

  return (
    <div>
        <p>{error.message}</p>
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

// Create a wrapper component for maintenance mode check
const MaintenanceWrapper = ({ children }) => {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {

    //     const checkMaintenanceMode = async () => {
    //         try {
    //             // Call your API endpoint to check maintenance status
    //             const response = await api_page_config.getCurrentConfiguration();
    //             if (response.status && response.data?.data.maintenance.enabled) {
    //                 setIsMaintenance(true);
    //             } else {
    //                 setIsMaintenance(false);
    //             }
    //         } catch (error) {
    //             console.error("Error checking maintenance mode:", error);
    //             // Fallback to not showing maintenance page on error
    //             setIsMaintenance(false);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     checkMaintenanceMode();
        
    //     // Optional: Poll for maintenance status every 30 seconds
    //     const intervalId = setInterval(checkMaintenanceMode, 30000);
        
    //     return () => clearInterval(intervalId);
    // }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                    <p className="text-gray-300">Checking system status...</p>
                </div>
            </div>
        );
    }

    if (isMaintenance && !isLoading) {
        return <MaintenancePage />;
    }else if(!isMaintenance && !isLoading){
        const auth_states = useSelector(state => state.AuthReducer);
        const dispatch = useDispatch()

        const validateAccess = async() =>{
            var token = await getItem(STORAGE_TOKEN)
            token = JSON.parse(token)
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

            if(!auth_states.StateToken){
                validateAccess()
            }

            GetAllLanguages()
            getAllActivePageConfig()
        },[])
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

// Wrap your entire router with MaintenanceWrapper
const AppRouter = () => {
    return (
        <MaintenanceWrapper>
            <RouterProvider 
                router={router} 
                fallbackElement={
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                    </div>
                } 
            />
        </MaintenanceWrapper>
    )
}

const Routes = () =>{
    // Return AppRouter instead of directly returning RouterProvider
    return <AppRouter/>
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
                path: "grow-paid-content",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <MallGrowPaidContent />
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
            {
                path: "2factor",
                element: ( 
                    <GuestRoute route={'/'}>
                        <Verification />
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
    {
                path: "social",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <MallSocial />
                    </AuthenticatedUsers> 
                ),
                errorElement: <ErrorPage />
            },
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
    // {
    //     path: "event-details",
    //     element: (
    //         <EventDetailsPage />
    //     ),
    //     errorElement: <ErrorPage />,
    // },
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

export default Routes;