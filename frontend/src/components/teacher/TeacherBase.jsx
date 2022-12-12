import React from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import SignOutBtn from "../SignOutBtn";

const Teacher = () => {
    return (
        <div className="container-fluid">
            <Header />
            <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
                <p>Admin</p>
                <SignOutBtn />
                <Link to="/admin">go to admin</Link>
            </div>
        </div>
    );
};

export default Teacher;
