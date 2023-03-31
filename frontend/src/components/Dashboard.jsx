import React, { lazy, Suspense } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../public/css/styles.css"
import { Link } from "react-router-dom";
const Dashboard = props => {
    document.title = "Dashboard"
    return (
        <main className="mt-5">
            <div className="container p-2">
                <div className="row">
                    <div className="col col-sm-6">
                        <div className="card" style={{ color: "width: 18rem" }}>
                            <div className="card-body">
                                <h5 className="card-title">Update Marks</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                                <p className="card-text">Update IA marks and Externals marks of students according to CO levels.</p>
                                <Link to={"/" + props.type + "/updatemarks"}><div className="card-link">Link to update</div></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col col-sm-6">
                        <div className="card" style={{ color: "width: 18rem" }}>
                            <div className="card-body">
                                <h5 className="card-title">NBA Documents</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                                <p className="card-text">Access all the required documents needed for NBA.</p>
                                <Link to={"/" + props.type + "/documents"}><div className="card-link">Link to get documents</div></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-sm-6">
                        <div className="card" style={{ color: "width: 18rem" }}>
                            <div className="card-body">
                                <h5 className="card-title">Analytics</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                                <p className="card-text">Graphical representation of students' marks for better understanding.</p>
                                <Link to={"/" + props.type + "/analytics"}><div className="card-link">Link to view</div></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col col-sm-6">
                        <div className="card" style={{ color: "width: 18rem" }}>
                            <div className="card-body">
                                <h5 className="card-title">CO PO Mapping</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Mapping Table</h6>
                                <p className="card-text">Course outcomes map to Programme outcomes.</p>
                                <Link to={"/" + props.type + "/mapping"}><div className="card-link">Link to map</div></Link>
                            </div>
                        </div>
                    </div>
                </div>
                {props.type == "admin" &&
                    <div className="row">
                        <div className="col col-sm-6">
                            <div className="card" style={{ color: "width: 18rem" }}>
                                <div className="card-body">
                                    <h5 className="card-title">Collection CRUD</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Create, Read, Update and Delete</h6>
                                    <p className="card-text">Perform all the admin activities here.</p>
                                    <Link to="/admin/collectionlist"><div className="card-link">Link to CRUD</div></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </main>
    );
};

export default Dashboard;