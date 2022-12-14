import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
const Header = lazy(() => import("../Header"));
const SignOutBtn = lazy(() => import("../SignOutBtn"));
const CollectionList = lazy(() => import("./CollectionList"));

const Admin = () => {
    return (
        <Suspense>
            <div className="container-fluid">
                <Header />
                <CollectionList collection="Teacher" />
                <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
                    <p>Admin</p>
                    <SignOutBtn />
                    <Link to="/home">go to home</Link>
                </div>
            </div>
        </Suspense>
    );
};

export default Admin;
