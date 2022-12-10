import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { GlobalContext } from "../context/contextProvider";

const ProtectedRoute = () => {
    const { globalContext, setGlobalContext } = useContext(GlobalContext);

    return globalContext?.uid ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
