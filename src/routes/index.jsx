
import React from 'react'

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";

import {
    HomePage,
    HomeContent,
    ProjectHighlight,

    IOWOReportIndex,
    Content
} from '../pages/index'


const router = createBrowserRouter([
    {
        path: "/profile",
        loader: () => ({ message: "Hello Data Router!" }),
        Component: HomePage,  
        children:[
            {
                path: "",
                element: <HomeContent/>
            },
            {
                path: "iowo",
                element: <Content/>
            },
        ]
    }
])

const Routes = () =>{
    return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

export default Routes;