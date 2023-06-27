import React, { lazy, Suspense, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const SignOutBtn = lazy(() => import("./SignOutBtn"));

const Header = (props) => {
    const { user } = useContext(AuthContext);

    return (user &&
        <Suspense fallback={<h1>Loading...</h1>}>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand ms-3" href="#">
                        {user.userType}
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to={"/" + (user.userType)} className="nav-link active">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a href="https://ksit.ac.in/about.html" className="nav-link">
                                    About Us
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="https://ksit.ac.in/contact.html" className="nav-link">
                                    Contact Us
                                </a>
                            </li>
                            {
                                props.links && props.links.map((entry) => {
                                    return <li key={entry[0]} className="nav-item">
                                        <Link to={entry[1]} className="nav-link">
                                            {entry[0]}
                                        </Link>
                                    </li>
                                })
                            }
                        </ul>
                        <SignOutBtn />
                    </div>
                </div>
            </nav>
        </Suspense>
    );
};

export default Header;
