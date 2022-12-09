import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase-config";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import "../css/styles.css"

// import {
//     MDBBtn,
//     MDBContainer,
//     MDBRow,
//     MDBCol,
//     MDBCard,
//     MDBCardBody,
//     MDBInput,
//     MDBIcon
// } from 'mdb-react-ui-kit';

function SignIn() {
    console.log("uid: " + sessionStorage.getItem("uid"));

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
                        sessionStorage.setItem("uid", user.user.uid);
                        sessionStorage.setItem("userType", docSnap.data().userType);
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
                        console.log("sessionStorage: " + sessionStorage.getItem("uid"));
                        navigate(
                            sessionStorage.getItem("userType") === "Admin" ? "/admin" : "/home"
                        );
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
                // <div classNameName="d-flex justify-content-center vh-100 align-items-center">
                //     <form
                //         onSubmit={handleSubmit}
                //         classNameName="border border-primary p-4 rounded"
                //         style={{ maxWidth: "400px" }}
                //     >
                //         <div classNameName="form-group">
                //             <label htmlFor="exampleInputEmail1">Email address</label>
                //             <input
                //                 type="text"
                //                 classNameName="form-control"
                //                 id="exampleInputEmail1"
                //                 aria-describedby="emailHelp"
                //                 placeholder="Enter email"
                //                 ref={refEmail}
                //             />
                //             <small id="emailHelp" classNameName="form-text text-muted">
                //                 We'll never share your email with anyone else.
                //             </small>
                //         </div>
                //         <div classNameName="form-group">
                //             <label htmlFor="exampleInputPassword1">Password</label>
                //             <input
                //                 type="password"
                //                 classNameName="form-control"
                //                 id="exampleInputPassword1"
                //                 placeholder="Password"
                //                 ref={refPassword}
                //             />
                //         </div>
                //         <div classNameName="form-group form-check">
                //             <input type="checkbox" classNameName="form-check-input" id="exampleCheck1" />
                //             <label classNameName="form-check-label" htmlFor="exampleCheck1">
                //                 Check me out
                //             </label>
                //         </div>
                //         <button type="submit" classNameName="btn btn-primary">
                //             Submit
                //         </button>
                //         <ToastContainer />
                //     </form>
                // </div>

      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card bg-dark text-white" styles="border-radius: 1rem;">
                <div className="card-body p-5 text-center">

                  <div className="mb-md-5 mt-md-4 pb-5">

                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                    <p className="text-white-50 mb-5">Please enter your login and password!</p>

                    <div className="form-outline form-white mb-4">
                      <input type="email" id="typeEmailX" className="form-control form-control-lg" />
                      <label className="form-label" htmlFor="typeEmailX">Email</label>
                    </div>

                    <div className="form-outline form-white mb-4">
                      <input type="password" id="typePasswordX" className="form-control form-control-lg" />
                      <label className="form-label" htmlFor="typePasswordX">Password</label>
                    </div>

                    <p className="small mb-5 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p>

                    <button className="btn btn-outline-light btn-lg px-5" type="submit">Login</button>

                    <div className="d-flex justify-content-center text-center mt-4 pt-1">
                      <a href="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
                      <a href="#!" className="text-white"><i className="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                      <a href="#!" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                    </div>

                  </div>

                  <div>
                    <p className="mb-0">Don't have an account? <a href="#!" className="text-white-50 fw-bold">Sign Up</a>
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

               
    

              
            );
}

export default SignIn;
