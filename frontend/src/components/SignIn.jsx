import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase-config";
import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import serverRequest from "../helper/serverRequest";
import "react-toastify/dist/ReactToastify.css";

function SignIn() {

    const refEmail = useRef(null);
    const refPassword = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Login";
        if (sessionStorage.getItem("token"))
            navigate(sessionStorage.getItem("userType") === "Admin" ? "/admin" : "/home")
    }, []);

    const toasts = (message, type) => {
        type(message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    };

    const validateEmail = (email) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

    const validatePassword = (password) =>
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password);

    const handleSubmit = (e) => {
        e.preventDefault();

        let loginCredentials = async () => {
            if (
                validatePassword(refPassword.current.value) &&
                validateEmail(refEmail.current.value)
            ) {
                let user = await signInWithEmailAndPassword(
                    auth,
                    refEmail.current.value,
                    refPassword.current.value
                );
                if (user) {
                    let token = await user.user.getIdToken();
                    let docRef = doc(firestore, "users", user.user.uid);
                    let docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        toasts(
                            "Successfully! Logged in as " + refEmail.current.value,
                            toast.success
                        );
                        sessionStorage.setItem("uid", user.user.uid);
                        sessionStorage.setItem("userType", docSnap.data().userType);
                        sessionStorage.setItem("userMail", refEmail.current.value);
                        sessionStorage.setItem("token", token);
                        let res = await serverRequest("http://localhost:4000/login", "POST", {
                            email: refEmail.current.value,
                            userId: user.user.uid,
                            userType: docSnap.data().userType,
                        });
                        let json = await res.json();
                        navigate(docSnap.data().userType === "Admin" ? "/admin" : "/home");
                    }
                }
            } else if (!validatePassword(refPassword.current.value))
                toasts("Invalid Password!", toast.error);
            else if (!validateEmail(refEmail.current.value))
                toasts("Invalid Email-Id!", toast.error);
        };
        loginCredentials();
    };

    return (
        <div className="container h-100">
            <div className="row d-flex justify-content-center vh-100 align-items-center">
                <div
                    className="card bg-dark text-white col-12 col-md-8 col-lg-5 col-xl-4"
                    styles="border-radius: 1rem;"
                >
                    <div className="card-body py-5 px-3 text-center">
                        <form onSubmit={handleSubmit}>
                            <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                            <p className="text-white-50 mb-5">
                                Please enter your login and password!
                            </p>

                            <div className="row form-group align-items-center m-4">
                                <div className="col-auto mx-auto">
                                    <label className="col-form-label" htmlFor="typeEmailX">
                                        Email &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </label>
                                </div>
                                <div className="col-auto mx-auto">
                                    <input
                                        type="email"
                                        id="typeEmailX"
                                        className="form-control"
                                        placeholder="Enter Email"
                                        ref={refEmail}
                                    />
                                </div>
                            </div>

                            <div className="row form-group align-items-center m-4">
                                <div className="col-auto mx-auto">
                                    <label className="col-form-label" htmlFor="typePasswordX">
                                        Password
                                    </label>
                                </div>
                                <div className="col-auto mx-auto">
                                    <input
                                        type="password"
                                        id="typePasswordX"
                                        className="form-control"
                                        placeholder="Password"
                                        ref={refPassword}
                                    />
                                </div>
                            </div>

                            <p className="small mb-5 pb-lg-2">
                                <a className="text-white-50" href="#!">
                                    Forgot password?
                                </a>
                            </p>

                            <button className="btn btn-outline-light btn-lg px-5" type="submit">
                                Login
                            </button>

                            <div className="text-center mt-4 pt-1">
                                <a href="#" className="text-white">
                                    <i className="fab fa-facebook-f fa-lg"></i>
                                </a>
                                <a href="#" className="text-white">
                                    <i className="fab fa-twitter fa-lg mx-4 px-2"></i>
                                </a>
                                <a href="#" className="text-white">
                                    <i className="fab fa-google fa-lg"></i>
                                </a>
                            </div>
                            <ToastContainer />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
