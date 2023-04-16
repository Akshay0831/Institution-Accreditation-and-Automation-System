import React from "react";
import "/public/css/styles.css"
import { Link } from "react-router-dom";

export default function Dashboard(props) {
    document.title = sessionStorage.getItem("userType") + " Dashboard"
    return (
        <main className="pt-3">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-sm-6">
                        <div className="card" >
                            <div className="card-body">
                                <h5 className="card-title">Update Marks</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Editable Student Marks Table</h6>
                                <p className="card-text">Update IA marks and Externals marks of students according to CO levels.</p>
                                <Link to={"/" + props.type + "/updatemarks"}><div className="card-link">Link to update</div></Link>
                            </div>
                        </div>
                    </div>
                    {props.type == "admin" &&
                        <div className="col-12 col-sm-6">
                            <div className="card" >
                                <div className="card-body">
                                    <h5 className="card-title">Students List</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Students CRUD</h6>
                                    <p className="card-text">View and Edit students data grouped by Class.</p>
                                    <Link to="/admin/collectionlist"><div className="card-link">Link to CRUD</div></Link>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="col-12 col-sm-6">
                        <div className="card" >
                            <div className="card-body">
                                <h5 className="card-title">NBA Documents</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Document Files Viewer</h6>
                                <p className="card-text">Access all the stored and generated documents needed for NBA.</p>
                                <Link to={"/" + props.type + "/documents"}><div className="card-link">Link to get documents</div></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6">
                        <div className="card" >
                            <div className="card-body">
                                <h5 className="card-title">Analytics</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Data Analysis Tools</h6>
                                <p className="card-text">Graphical representation of student data for ease of understanding.</p>
                                <Link to={"/" + props.type + "/analytics"}><div className="card-link">Link to view</div></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6">
                        <div className="card" >
                            <div className="card-body">
                                <h5 className="card-title">CO PO Mapping</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Mapping Table</h6>
                                <p className="card-text">Editable Table to map Course outcomes to Programme outcomes.</p>
                                <Link to={"/" + props.type + "/mapping"}><div className="card-link">Link to map</div></Link>
                            </div>
                        </div>
                    </div>
                    {props.type == "admin" &&
                        <div className="col-12 col-sm-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Collection CRUD</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Create, Read, Update and Delete</h6>
                                    <p className="card-text">View and Edit all the data in the database.</p>
                                    <Link to="/admin/collectionlist"><div className="card-link">Link to CRUD</div></Link>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </main>
    );
};