import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase-config";
import React, { useRef, useContext } from "react";
import { GlobalContext } from "../context/contextProvider";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "react-toastify/dist/ReactToastify.css";

function SignIn() {
    console.log("uid: " + sessionStorage.getItem("uid"));

    const { globalContext, setGlobalContext } = useContext(GlobalContext);

    const refEmail = useRef(null);
    const refPassword = useRef(null);
    const navigate = useNavigate();

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
                    let docRef = doc(firestore, "users", user.user.uid);
                    let docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        toasts(
                            "Successfully! Logged in as " + refEmail.current.value,
                            toast.success
                        );
                        // sessionStorage.setItem("uid", user.user.uid);
                        // sessionStorage.setItem("userType", docSnap.data().userType);
                        let res = await fetch("http://localhost:4000/login", {
                            // Adding method type
                            method: "POST",

                            // Adding body or contents to send
                            body: JSON.stringify({
                                email: refEmail.current.value,
                                userId: user.user.uid,
                                userType: docSnap.data().userType,
                            }),

                            // Adding headers to the request
                            headers: {
                                "Content-type": "application/json; charset=UTF-8",
                            },
                        });
                        let json = await res.json();
                        console.log(json);
                        setGlobalContext({
                            uid: user.user.uid,
                            userType: docSnap.data().userType,
                        });
                        // console.log("sessionStorage: " + sessionStorage.getItem("uid"));
                        navigate(docSnap.data().userType === "Admin" ? "/admin" : "/home");
                    }
                }
                console.log("SignIn.jsx, context: " + JSON.stringify(globalContext));
            } else if (!validatePassword(refPassword.current.value))
                toasts("Invalid Password!", toast.error);
            else if (!validateEmail(refEmail.current.value))
                toasts("Invalid Email-Id!", toast.error);
        };
        loginCredentials();
    };

    return (
        <div className="d-flex justify-content-center vh-100 align-items-center">
            <form
                onSubmit={handleSubmit}
                className="border border-primary p-4 rounded"
                style={{ maxWidth: "400px" }}
            >
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input
                        type="text"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        ref={refEmail}
                    />
                    <small id="emailHelp" className="form-text text-muted">
                        We'll never share your email with anyone else.
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Password"
                        ref={refPassword}
                    />
                </div>
                <br />
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
                <ToastContainer />
            </form>
        </div>
    );
}

export default SignIn;
