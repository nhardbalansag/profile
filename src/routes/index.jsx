
import React from 'react'

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";

import {
    HomePage,
    HomeContent
} from '../pages/index'


const router = createBrowserRouter([
    {
        path: "/profile",
        loader: () => ({ message: "Hello Data Router!" }),
        Component: HomePage,  
        children:[
            {
                path: "",
                Component: HomeContent,  
                children:[
                    
                ]
            }
        ]
    }
])

const Routes = () =>{
    return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

export default Routes;