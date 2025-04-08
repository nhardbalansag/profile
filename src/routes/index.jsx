
import React from 'react'

import { useDispatch } from "react-redux";
import {useSelector} from 'react-redux';

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
                element: <LoginContent/>
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

    const data = useSelector(state => state.AuthReducer);
    const dispatch = useDispatch()

    const validateAccess = async() =>{
        var token = await getItem(STORAGE_TOKEN)
        var userInformation = await getItem(STORAGE_USER_INFORMATION)

        if(token && userInformation){
            dispatch(AuthAction.LoginUser(token, userInformation))
        }
    }

    // useEffect(() =>{
    //     // if(!data.StateToken){
    //     //     validateAccess()
    //     // }
    // })

    return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

export default Routes;