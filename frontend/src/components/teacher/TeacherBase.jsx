import React from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import SignOut from "../SignOut";

const Teacher = () => {
    return (
        <div className="container-fluid">
            <Header />
            <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
                <p>Admin</p>
                <SignOut />
                <Link to="/admin">go to home</Link>
            </div>
        </div>
    );
};

export default Teacher;
