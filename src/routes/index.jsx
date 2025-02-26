
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
                Component: HomeContent,  
                children:[
                    
                ]
            },
            {
                path: "project",
                Component: ProjectHighlight,  
                children:[
                    
                ]
            },
        ]
    },
    {
        path: "/profile/iowo",
        loader: () => ({ message: "Hello Data Router!" }),
        Component: IOWOReportIndex,  
        children:[
            {
                path: "",
                element: <Content/>
            },
        ]
    },
    {
        path: "/project",
        loader: () => ({ message: "Hello Data Router!" }),
        Component: ProjectHighlight,  
    }
])

const Routes = () =>{
    return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

export default Routes;