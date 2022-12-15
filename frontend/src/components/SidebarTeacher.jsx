import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { getAuth, signOut } from "firebase/auth";
import "../../public/css/styles.css"
import { useNavigate, Link } from "react-router-dom";

function SidebarTeacher (){

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
        <div>
            <nav id="sidebarMenu" className="collapse d-lg-block sidebar collapse bg-white">
        <div className="position-sticky">
        <div className="list-group list-group-flush mx-3 mt-4">
        <Link to="/home" style={{ textDecoration: 'none' }}>
        <span
            className="list-group-item list-group-item-action py-2 ripple active"
            aria-current="true"
        >
        <i className="fas fa-tachometer-alt fa-fw me-3"></i><span>Main dashboard</span>
        </span>
        </Link>
        <Link to="/home/updatemarks" style={{ textDecoration: 'none' }}>
        <span
            className="list-group-item list-group-item-action py-2 ripple">
        <i className="fas fa-chart-area fa-fw me-3"></i><span>Update Marks</span>
        </span>
        </Link>
        <Link to= "/home/documents" style={{ textDecoration: 'none' }}>
        <span
            className="list-group-item list-group-item-action py-2 ripple"><i className="fas fa-lock fa-fw me-3"></i><span>Documents</span></span>
        </Link>
        <Link to= "/home/analytics" style={{ textDecoration: 'none' }}>
        <span
            className="list-group-item list-group-item-action py-2 ripple"><i className="fas fa-chart-line fa-fw me-3"></i><span>Analytics</span></span>
        </Link>
    </div>
    </div>
    </nav>
    <nav
    id="main-navbar"
    className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div className="container-fluid">
    {/* <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
        <i className="fas fa-bars"></i>
    </button> */}
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
    </button>

    <a className="navbar-brand" href="#">
        <img
            src=""
            height="25"
            alt="logo"
            loading="lazy"
            />
    </a>

    <ul className="navbar-nav ms-auto d-flex flex-row">
        <li className="nav-item">
        <a className="nav-link me-3 me-lg-0" href="#">
            <p>Profile</p>
        </a>
        </li>
        <li className="nav-item me-3 me-lg-0">
        <button className="btn btn-danger" onClick={handleClick}>
                Sign Out
            </button>
        </li>
        </ul>
    </div>
    </nav>
    </div>
    )
}

export default SidebarTeacher;