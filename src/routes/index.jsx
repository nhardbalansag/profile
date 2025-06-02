
import React, {useEffect} from 'react'

import { useDispatch } from "react-redux";
import {useSelector} from 'react-redux';
import { Navigate } from "react-router-dom";

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

    DetailsPage
} from '../pages/index'

import {
    getItem
} from '../store/store-index'

import { STORAGE_TOKEN, STORAGE_USER_INFORMATION, REDUX_PAYLOAD_INFORMATION } from "../store/auth/authAction";

import * as AuthAction from '../store/auth/authAction'

import * as api_page_config from '../services/page/page.api'

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
        children:[
            {
                path: "",
                element: <HomeContent/>
            },
        ]
    },
    {
        path: "/",
        loader: () => ({ message: "Hello Data Router!" }),
        Component: DestinationPage,  
        children:[
            {
                path: "destination",
                element: <DestinationContent/>
            },
        ]
    },
    {
        path: "/",
        loader: () => ({ message: "Hello Data Router!" }),
        Component: LoginPage,  
        children:[
            {
                path: "login",
                element: ( 
                    <GuestRoute route={'/'}>
                        <LoginContent />
                    </GuestRoute> 
                )
            },
        ]
    },
    {
        path: "/",
        loader: () => ({ message: "Hello Data Router!" }),
        Component: AccountPage,  
        children:[
            {
                path: "account",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <AccountContent />
                    </AuthenticatedUsers> 
                )
            },
            {
                path: "details",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <AccountDetails />
                    </AuthenticatedUsers> 
                )
            },
            {
                path: "orders",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <AccountOrders />
                    </AuthenticatedUsers> 
                )
            },
        ]
    },
    {
        path: "mall",
        Component: MallPage,  
        children:[
            {
                path: "",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <MallTravel />
                    </AuthenticatedUsers> 
                )
            },
            {
                path: "merchant",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <MallMerchant />
                    </AuthenticatedUsers> 
                )
            },
        ]
    },
    {
        path: "event",
        Component: EventPage,  
        children:[
            {
                path: "",
                element: ( 
                    <AuthenticatedUsers route={'/login'}>
                        <EventContent />
                    </AuthenticatedUsers> 
                )
            },
        ]
    },
    {
        path: "content-details",
        element: ( 
            <DetailsPage />
        )
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