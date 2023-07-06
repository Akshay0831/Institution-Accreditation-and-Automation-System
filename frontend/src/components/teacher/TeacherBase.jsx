import React, { useContext, useEffect, lazy, Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "../AuthContext";

const Header = lazy(() => import("../Header"));
const Sidebar = lazy(() => import("../Sidebar"));

const Teacher = () => {
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
    }, [user, navigate]);

    return (
        <Suspense>
            <div className="container-fluid">
                <Header links={[['Marks', '/home/updatemarks'], ['Documents', '/home/documents'], ['Analytics', '/home/analytics'], ['Mapping Table', '/home/mapping']]} />
                <Sidebar type="home" />
                <Outlet />
                <ToastContainer />
            </div>
        </Suspense>

    );
};

export default Teacher;
