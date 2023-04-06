import React, { lazy, Suspense } from "react";
const Header = lazy(() => import("../Header"));
const Sidebar = lazy(() => import("../Sidebar"));

const Admin = () => {
    return (
        <Suspense>
            <div className="container-fluid">
                <Header links={[['About Us', '#'], ['Contact Us', '#'], ['Teacher Dashboard', '/home']]} />
                <Sidebar type="admin" />
            </div>
        </Suspense>
    );
};

export default Admin;
