import React, { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
const Header = lazy(() => import("../Header"));
const Sidebar = lazy(() => import("../Sidebar"));

const Teacher = () => {
    return (
        <Suspense>
            <div className="container-fluid">
                <Header links={[['Marks', '/admin/updatemarks'], ['Documents', '/admin/documents'], ['Analytics', '/admin/analytics'], ['Mapping Table', '/admin/mapping']]} />
                <Sidebar type="home" />
                <ToastContainer/>
            </div>
        </Suspense>

    );
};

export default Teacher;
