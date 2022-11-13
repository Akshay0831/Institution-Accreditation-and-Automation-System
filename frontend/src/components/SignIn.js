import "bootstrap/dist/css/bootstrap.css";
import React, { useState, useEffect, useRef } from "react";

function SignIn() {
    const [message, setMessage] = useState("");

    const refEmail = useRef(null);
    const refPassword = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(refEmail.current.value);
        fetch("http://localhost:4000/formdata", {
            // Adding method type
            method: "POST",

            // Adding body or contents to send
            body: JSON.stringify({
                email: refEmail.current.value,
                password: refPassword.current.value,
            }),

            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetch("http://localhost:4000")
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => console.log(err));
    }, []);

    return (
        // <div className="d-flex justify-content-center vh-100 align-items-center">
        //     <Form style={{ maxWidth: "400px" }} className="border border-primary p-4 rounded" onSubmit={handleSubmit}>
        //         <h6>{message}</h6>
        //         <Form.Group className="mb-3" controlId="formBasicEmail">
        //             <Form.Label>Email address</Form.Label>
        //             <Form.Control type="email" placeholder="Enter email" ref={refContainer}/>
        //             <Form.Text className="text-muted">
        //                 We'll never share your email with anyone else.
        //             </Form.Text>
        //         </Form.Group>

        //         <Form.Group className="mb-3" controlId="formBasicPassword">
        //             <Form.Label>Password</Form.Label>
        //             <Form.Control type="password" placeholder="Password" />
        //         </Form.Group>
        //         <Form.Group className="mb-3" controlId="formBasicCheckbox">
        //             <Form.Check type="checkbox" label="Check me out" />
        //         </Form.Group>
        //         <Button variant="primary" type="submit">
        //             Submit
        //         </Button>
        //     </Form>
        // </div>
        <div className="d-flex justify-content-center vh-100 align-items-center">
            <form
                onSubmit={handleSubmit}
                className="border border-primary p-4 rounded"
                style={{ maxWidth: "400px" }}
            >
                <h6>{message}</h6>
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
