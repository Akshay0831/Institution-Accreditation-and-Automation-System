import { sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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
        if (sessionStorage.getItem("token")) {
            navigate(sessionStorage.getItem("userType") === "Admin" ? "/admin" : "/home");
        }
    }, [navigate]);

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

    const validateEmail = (email) => {
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        return regex.test(password);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        const email = refEmail.current.value;

        if (!validateEmail(email)) {
            toasts("Invalid Email-Id!", toast.error);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            toasts("Password reset email sent successfully!", toast.success);
        } catch (error) {
            console.error(error);
            toasts(error.message, toast.error);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const { uid } = userCredential.user;
            const token = await userCredential.user.getIdToken();
            const docRef = doc(firestore, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const { userType } = docSnap.data();
                sessionStorage.setItem("uid", uid);
                sessionStorage.setItem("userType", userType);
                sessionStorage.setItem("userMail", userCredential.user.email);
                sessionStorage.setItem("token", token);

                const endpoint = "http://localhost:4000/login";
                const body = { email: userCredential.user.email, userId: uid, userType };
                const res = await serverRequest(endpoint, "POST", body);
                const json = await res.json();

                navigate(userType === "Admin" ? "/admin" : "/home");
                toasts(`Successfully! Logged in as ${userCredential.user.email}`, toast.success);
            }
        } catch (error) {
            console.error(error);
            toasts(error.message, toast.error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = refEmail.current.value;
        const password = refPassword.current.value;

        if (!validateEmail(email)) {
            toasts("Invalid Email-Id!", toast.error);
            return;
        }

        if (!validatePassword(password)) {
            toasts("Invalid Password!", toast.error);
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const { uid } = userCredential.user;
            const token = await userCredential.user.getIdToken();
            const docRef = doc(firestore, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const { userType } = docSnap.data();
                sessionStorage.setItem("uid", uid);
                sessionStorage.setItem("userType", userType);
                sessionStorage.setItem("userMail", email);
                sessionStorage.setItem("token", token);

                const endpoint = "http://localhost:4000/login";
                const body = { email, userId: uid, userType };
                const res = await serverRequest(endpoint, "POST", body);
                const json = await res.json();

                navigate(userType === "Admin" ? "/admin" : "/home");
                toasts(`Successfully! Logged in as ${email}`, toast.success);
            }
        } catch (error) {
            console.error(error);
            toasts(error.message, toast.error);
        }
    };

    return (
        <div className="container h-100">
            <div className="row d-flex justify-content-center vh-100 align-items-center">
                <div className="card bg-dark text-white col-12 col-md-8 col-lg-6 col-xl-4 rounded">
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
                                    <input type="email" id="typeEmailX" className="form-control" placeholder="Enter Email" ref={refEmail} />
                                </div>
                            </div>

                            <div className="row form-group align-items-center m-4">
                                <div className="col-auto mx-auto">
                                    <label className="col-form-label" htmlFor="typePasswordX">
                                        Password
                                    </label>
                                </div>
                                <div className="col-auto mx-auto">
                                    <input type="password" id="typePasswordX" className="form-control" placeholder="Password" ref={refPassword} />
                                </div>
                            </div>

                            <p className="small mb-5 pb-lg-2 text-white-50" onClick={handleForgotPassword}>
                                Forgot password?
                            </p>

                            <button className="btn btn-outline-light btn-lg px-5" type="submit">
                                Login
                            </button>

                            <div className="text-center mt-4 pt-1">
                                {/* <a href="#" className="text-white">
                                    <i className="fab fa-facebook-f fa-lg"></i>
                                </a>
                                <a href="#" className="text-white">
                                    <i className="fab fa-twitter fa-lg mx-4 px-2"></i>
                                </a> */}
                                <a href="#" className="text-white" onClick={handleGoogleSignIn}>
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
