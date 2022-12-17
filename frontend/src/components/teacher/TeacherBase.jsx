import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
const Header = lazy(() => import("../Header"));
const SignOutBtn = lazy(() => import("../SignOutBtn"));
import Sidebar from "../Sidebar";

const Teacher = () => {
    return (
        <Suspense>
            <div className="container-fluid">
                <Header links={[['About Us','#'],['Contact Us','#'],['Admin Dashboard','/admin']]}/>
                <Sidebar />
                
            </div>
        </Suspense>
        
    );
};

export default Teacher;
