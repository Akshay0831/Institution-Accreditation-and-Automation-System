import React, { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
const Header = lazy(() => import("../Header"));
const Sidebar = lazy(() => import("../Sidebar"));

const Admin = () => {
    return (
        <Suspense>
            <div className="container-fluid">
                <Header links={[['Marks', '/admin/updatemarks'], ['Students', '/admin/studentlist'], ['Documents', '/admin/documents'], ['Analytics', '/admin/analytics'], ['Mapping Table', '/admin/mapping'], ['DataTables', '/admin/collectionlist']]} />
                <Sidebar type="admin" />
                <ToastContainer/>
            </div>
        </Suspense>
    );
};

export default Admin;
