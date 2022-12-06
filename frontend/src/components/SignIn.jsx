import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase-config";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";

import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBIcon
} from 'mdb-react-ui-kit';

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
                // <div className="d-flex justify-content-center vh-100 align-items-center">
                //     <form
                //         onSubmit={handleSubmit}
                //         className="border border-primary p-4 rounded"
                //         style={{ maxWidth: "400px" }}
                //     >
                //         <div className="form-group">
                //             <label htmlFor="exampleInputEmail1">Email address</label>
                //             <input
                //                 type="text"
                //                 className="form-control"
                //                 id="exampleInputEmail1"
                //                 aria-describedby="emailHelp"
                //                 placeholder="Enter email"
                //                 ref={refEmail}
                //             />
                //             <small id="emailHelp" className="form-text text-muted">
                //                 We'll never share your email with anyone else.
                //             </small>
                //         </div>
                //         <div className="form-group">
                //             <label htmlFor="exampleInputPassword1">Password</label>
                //             <input
                //                 type="password"
                //                 className="form-control"
                //                 id="exampleInputPassword1"
                //                 placeholder="Password"
                //                 ref={refPassword}
                //             />
                //         </div>
                //         <div className="form-group form-check">
                //             <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                //             <label className="form-check-label" htmlFor="exampleCheck1">
                //                 Check me out
                //             </label>
                //         </div>
                //         <button type="submit" className="btn btn-primary">
                //             Submit
                //         </button>
                //         <ToastContainer />
                //     </form>
                // </div>
                 <MDBContainer fluid>
                   
                 <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                   <MDBCol col='12'>
           
                     <MDBCard className='bg-dark text-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '400px'}}>
                       <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
           
                         <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                         <p className="text-white-50 mb-5">Please enter your login and password!</p>
           
                         <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Email address'   id="exampleInputEmail1" type='email' size="lg"  placeholder="Enter email"
                                ref={refEmail}/>
                         <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password' id='exampleInputPassword1' type='password' size="lg"  placeholder="Password"
                               ref={refPassword}/>
                         <MDBBtn outline className='mx-2 px-5' color='white' size='lg'>
                           Login
                         </MDBBtn>
                         <p className="small mb-3 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>
                         
           
                         <div className='d-flex flex-row mt-3 mb-5'>
                           <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                             <MDBIcon fab icon='facebook-f' size="lg"/>
                           </MDBBtn>
           
                           <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                             <MDBIcon fab icon='twitter' size="lg"/>
                           </MDBBtn>
           
                           <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                             <MDBIcon fab icon='google' size="lg"/>
                           </MDBBtn>
                         </div>
           
                         <div>
                           <p className="mb-0">Don't have an account? <a href="#!" class="text-white-50 fw-bold">Sign Up</a></p>
           
                         </div>
                       </MDBCardBody>
                     </MDBCard>
           
                   </MDBCol>
                 </MDBRow>
           
               </MDBContainer>
               
    

              
            );
}

export default SignIn;
