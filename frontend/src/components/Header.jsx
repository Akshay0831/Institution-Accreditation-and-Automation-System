import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const Header = (props) => {
    let navigate = useNavigate();
    let logOutHandler = () => {
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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded-bottom">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">{sessionStorage.getItem('userType')}</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Contact Us</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">About Us</a>
                    </li>
                    <li className="nav-item">
                        <Link to="/home" className="nav-link">Go To Home</Link>
                    </li>
                </ul>
                    <button className="btn btn-danger" onClick={logOutHandler}>Sign Out</button>
                </div>
            </div>
        </nav>
    );
};

export default Header;
