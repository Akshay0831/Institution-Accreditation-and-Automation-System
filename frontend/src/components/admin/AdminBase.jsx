import React, { useContext, useEffect, lazy, Suspense } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "../AuthContext";

const Header = lazy(() => import("../Header"));
const Sidebar = lazy(() => import("../Sidebar"));

const AdminBase = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            if (user.userType === "Admin") {
                if (!location.pathname.startsWith("/admin")) {
                    navigate("/admin");
                }
            } else {
                if (!location.pathname.startsWith("/home")) {
                    navigate("/home");
                }
            }
        } else if (location.pathname !== "/login")
            navigate("/login");
    }, [user]);

    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <div className="container-fluid">
                <Header links={[['Marks', '/admin/updatemarks'], ['Students', '/admin/studentlist'], ['Documents', '/admin/documents'], ['Analytics', '/admin/analytics'], ['Mapping Table', '/admin/mapping'], ['DataTables', '/admin/collectionlist']]} />
                <Sidebar type="admin" />
                <Outlet />
                <ToastContainer />
            </div>
        </Suspense>
    );
};

export default AdminBase;
