import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
const Header = lazy(() => import("../Header"));
const SignOutBtn = lazy(() => import("../SignOutBtn"));

const Teacher = () => {
    return (
        <Suspense>
            <div className="container-fluid">
                <Header />
                <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
                    <p>Admin</p>
                    <SignOutBtn />
                    <Link to="/admin">go to admin</Link>
                </div>
            </div>
        </Suspense>
    );
};

export default Teacher;
