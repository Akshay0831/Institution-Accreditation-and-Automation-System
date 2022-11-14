import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase-config";
import "bootstrap/dist/css/bootstrap.css";
import React, { useRef, useState } from "react";

function SignIn() {
    const refEmail = useRef(null);
    const refPassword = useRef(null);

    const validateEmail = (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

    const validatePassword = (password) =>
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validatePassword(refPassword.current.value) && validateEmail(refEmail.current.value)) {
            signInWithEmailAndPassword(auth, refEmail.current.value, refPassword.current.value)
                .then((user) => {
                    const docRef = doc(firestore, "users", user._tokenResponse.localId);
                    getDoc(docRef)
                        .then((docSnap) => {
                            if (docSnap.exists()) {
                                fetch("http://localhost:4000/login", {
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
                                })
                                    .then((res) => res.json())
                                    .then((data) => console.log(data))
                                    .catch((err) => console.error(err));
                            }
                        })
                        .catch((err) => console.error(err));
                })
                .catch((err) => console.error(err));
        } else {
        }
    };

    return (
        <div className="d-flex justify-content-center vh-100 align-items-center">
            <form
                onSubmit={handleSubmit}
                className="border border-primary p-4 rounded"
                style={{ maxWidth: "400px" }}
            >
                <div class="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input
                        type="email"
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
                <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Password"
                        ref={refPassword}
                    />
                </div>
                <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" for="exampleCheck1">
                        Check me out
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default SignIn;