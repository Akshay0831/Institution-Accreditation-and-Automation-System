import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, Navigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "../../public/css/styles.css"

function Home() {
    let navigate = useNavigate();

    console.log(`uid: ${sessionStorage.getItem("uid")}`);
    return sessionStorage.getItem("uid") ? (
        
    <main style={{color: "margin-top: 58px"}}>
    <div className="container pt-4">
    <div className="row">
    <div className="col col-sm-6">
<div className="card" style={{color: "width: 18rem"}}>
    <div className="card-body">
    <h5 className="card-title">Update Marks</h5>
    <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
    <p className="card-text">Update IA marks and Externals marks of students according to CO levels.</p>
    <Link to="/home/updatemarks"><div className="card-link">Link to update</div></Link>
    </div>
</div>
</div>
<div className="col col-sm-6">
<div className="card" style={{color: "width: 18rem"}}>
    <div className="card-body">
    <h5 className="card-title">NBA Documents</h5>
    <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
    <p className="card-text">Access all the required documents needed for NBA.</p>
    <Link to="/home/documents"><div className="card-link">Link to get documents</div></Link>
    </div>
</div>
</div>
</div>
<div className="row">
<div className="col col-sm-6">
<div className="card" style={{color: "width: 18rem"}}>
    <div className="card-body">
    <h5 className="card-title">Analytics</h5>
    <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
    <p className="card-text">Graphical representation of students' marks for better understanding.</p>
    <Link to="/home/analytics"><div className="card-link">Link to view</div></Link>
    </div>
</div>
</div>
</div>
    <p>Home</p>
        <Link to="/admin">go to admin</Link>
    </div>
    </main>   
    ) : (
        <Navigate to="/login" />
    );
}

export default Home;
