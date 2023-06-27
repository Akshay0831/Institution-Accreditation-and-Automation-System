import React, { useContext, lazy, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "../AuthContext";

const Header = lazy(() => import("../Header"));
const Sidebar = lazy(() => import("../Sidebar"));

const Teacher = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate(user.userType === "Admin" ? "/admin" : "/home");
        else navigate("/login");
    }, [user]);

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
