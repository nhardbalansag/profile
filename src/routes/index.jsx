
import React from 'react'

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

    NotFound
} from '../pages/index'


const router = createBrowserRouter([
    {
        path: "/ReactTenFrontend",
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
        path: "/ReactTenFrontend",
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
        path: "/ReactTenFrontend",
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
    return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

export default Routes;