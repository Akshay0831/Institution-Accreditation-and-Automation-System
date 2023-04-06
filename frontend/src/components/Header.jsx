import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
const SignOutBtn = lazy(() => import("./SignOutBtn"));

const Header = (props) => {
    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container-fluid">
                    <a style={{ marginLeft: "15px" }} className="navbar-brand" href="#">
                        {sessionStorage.getItem("userType")}
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
                                <a className="nav-link active" aria-current="page" href="#">
                                    Home
                                </a>
                            </li>
                            {
                                (props.links)
                                    ? props.links.map((entry) => {
                                        return <li key={entry[0]} className="nav-item">
                                            <Link to={entry[1]} className="nav-link">
                                                {entry[0]}
                                            </Link>
                                        </li>
                                    })
                                    : <></>
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
