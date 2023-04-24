import React from "react";
import "/public/css/styles.css"
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import BackForthButtons from "./backForthButtons";

const Sidebar = props => {

    return (
        <aside>
            <Nav className="col-sm-12 d-none d-md-block bg-dark sidebar rounded">
                <div className="position-sticky m-lg-0 mt-md-5">
                    <div className="list-group list-group-flush">
                        <Link to={"/" + props.type} style={{ textDecoration: 'none' }}>
                            <span className="list-group-item list-group-item-action ripple" aria-current="true">
                                <i className="fas fa-tachometer-alt fa-fw me-3" />Main dashboard
                            </span>
                        </Link>
                        <Link to={"/" + props.type + "/updatemarks"} style={{ textDecoration: 'none' }}>
                            <span className="list-group-item list-group-item-action ripple">
                                <i className="fa-solid fa-square-pen fa-fw me-3" />Update Marks
                            </span>
                        </Link>
                        {props.type == "admin" &&
                            <Link to={"/" + props.type + "/studentlist"} style={{ textDecoration: 'none' }}>
                                <span className="list-group-item list-group-item-action ripple">
                                    <i className="fas fa-solid fa-graduation-cap fa-fw me-3" />Student List
                                </span>
                            </Link>
                        }
                        <Link to={"/" + props.type + "/documents"} style={{ textDecoration: 'none' }}>
                            <span className="list-group-item list-group-item-action ripple">
                                <i className="fa-regular fa-folder-open fa-fw me-3" />Documents
                            </span>
                        </Link>
                        <Link to={"/" + props.type + "/analytics"} style={{ textDecoration: 'none' }}>
                            <span className="list-group-item list-group-item-action ripple">
                                <i className="fas fa-chart-line fa-fw me-3" />Analytics
                            </span>
                        </Link>
                        <Link to={"/" + props.type + "/mapping"} style={{ textDecoration: 'none' }}>
                            <span className="list-group-item list-group-item-action ripple">
                                <i className="fa-solid fa-arrow-down-up-across-line fa-fw me-3" />CO PO Mapping
                            </span>
                        </Link>
                        {props.type == "admin" &&
                            <Link to="/admin/collectionlist" style={{ textDecoration: 'none' }}>
                                <span className="list-group-item list-group-item-action ripple">
                                    <i className="fa-solid fa-table-cells fa-fw me-3" />Collection CRUD
                                </span>
                            </Link>
                        }
                    </div>
                </div>
                <BackForthButtons />
            </Nav>
        </aside>
    )
}

export default Sidebar;