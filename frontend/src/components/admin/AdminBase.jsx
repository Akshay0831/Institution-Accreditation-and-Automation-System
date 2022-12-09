import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Header from "../Header";
import CollectionList from "./CollectionList";

const Admin = () => {
    let navigate = useNavigate();
    let handleClick = () => {
        let auth = getAuth();
        signOut(auth)
            .then(() => {
                console.log("Logged out!");
                sessionStorage.removeItem("uid");
                sessionStorage.removeItem("userType");
                navigate("/login");
            })
            .catch(() => {
                console.error("Couldn't log out");
            });
    };
    return (
        <div className="container-fluid">
            <Header/>
            <CollectionList collection="teacher" />
            <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
                <p>Admin</p>
                <button className="btn btn-danger" onClick={handleClick}>
                    Sign Out
                </button>
                <Link to="/home">go to home</Link>
            </div>
        </div>
    );
};

export default Admin;
