import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
const Header = lazy(() => import("../Header"));
const SignOutBtn = lazy(() => import("../SignOutBtn"));
const CollectionList = lazy(() => import("./CollectionList"));
const Sidebar = lazy(() => import("../Sidebar"));

const Admin = () => {
    return (
        <Suspense>
            <div className="container-fluid">
                <Header links={[['About Us','#'],['Contact Us','#'],['Teacher Dashboard','/home']]}/>
                {/* <CollectionList collection="Teacher" /> */}
                <Sidebar type="admin"/>
            </div>
        </Suspense>
    );
};

export default Admin;
