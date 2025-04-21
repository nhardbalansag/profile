
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

    Checkout
} from '../pages/index'

import {
    getItem
} from '../store/store-index'

import { STORAGE_TOKEN, STORAGE_USER_INFORMATION } from "../store/auth/authAction";

import * as AuthAction from '../store/auth/authAction'

import * as api_page_config from '../services/page/page.api'

const GuestRoute = ({ children }) => {
    const auth_states = useSelector(state => state.AuthReducer);
    var token = getItem(STORAGE_TOKEN)

    if (auth_states.StateToken) {
        return <Navigate to="/" replace />;
    }

    return children;
};

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
    // {
    //     path: "/checkout",
    //     loader: () => ({ message: "Hello Data Router!" }),
    //     Component: Checkout,  
    // },
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
                    <GuestRoute>
                        <LoginContent />
                    </GuestRoute> 
                )
            },
        ]
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
        if(token && userInformation){
            dispatch(AuthAction.LoginUser(token, userInformation))
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