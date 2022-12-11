import React from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import SignOut from "../SignOut";
import CollectionList from "./CollectionList";

const Admin = () => {
    return (
        <div className="container-fluid">
            <Header />
            <CollectionList collection="teacher" />
            <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
                <p>Admin</p>
                <SignOut />
                <Link to="/home">go to home</Link>
            </div>
        </div>
    );
};

export default Admin;
