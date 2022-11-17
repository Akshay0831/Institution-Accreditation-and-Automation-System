import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, Navigate, Link } from "react-router-dom";

function Home() {
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

    console.log(`uid: ${sessionStorage.getItem("uid")}`);
    return sessionStorage.getItem("uid") ? (
        <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
            <p>Home</p>
            <button className="btn btn-danger" onClick={handleClick}>
                Sign Out
            </button>
            <Link to="/admin">go to admin</Link>
        </div>
    ) : (
        <Navigate to="/login" />
    );
}

export default Home;
