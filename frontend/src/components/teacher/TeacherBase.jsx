import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { GlobalContext } from "../../context/contextProvider";
import Header from "../Header";

const Teacher = () => {
    const { globalContext, setGlobalContext } = useContext(GlobalContext);
    console.log("TeacherBase: context: " + JSON.stringify(globalContext));
    let navigate = useNavigate();
    let handleClick = () => {
        let auth = getAuth();
        signOut(auth)
            .then(() => {
                console.log("Logged out!");
                // sessionStorage.removeItem("uid");
                // sessionStorage.removeItem("userType");
                setGlobalContext({});
                navigate("/login");
            })
            .catch(() => {
                console.error("Couldn't log out");
            });
    };
    return (
        <div className="container-fluid">
            <Header />
            <div className="d-flex flex-column vh-100 justify-content-center align-items-center">
                <p>Admin</p>
                <button className="btn btn-danger" onClick={handleClick}>
                    Sign Out
                </button>
                <Link to="/admin">go to home</Link>
            </div>
        </div>
    );
};

export default Teacher;
