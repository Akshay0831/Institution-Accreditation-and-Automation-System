import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../public/css/styles.css"
import { useNavigate, Link } from "react-router-dom";

const Sidebar = props => {

    return (
        <div>
            <nav className="d-lg-block sidebar bg-dark">
                <div className="position-sticky">
                <div className="list-group list-group-flush">
                <Link to={"/" + props.type} style={{ textDecoration: 'none' }}>
                <span
                    className="list-group-item list-group-item-action ripple active" aria-current="true">
                <i className="fas fa-tachometer-alt fa-fw me-3"></i><span>Main dashboard</span>
                </span>
                </Link>
                <Link to={"/" + props.type + "/updatemarks"} style={{ textDecoration: 'none' }}>
                <span
                    className="list-group-item list-group-item-action ripple">
                <i className="fas fa-chart-area fa-fw me-3"></i><span>Update Marks</span>
                </span>
                </Link>
                <Link to= {"/" + props.type + "/documents"} style={{ textDecoration: 'none' }}>
                <span
                    className="list-group-item list-group-item-action ripple"><i className="fas fa-lock fa-fw me-3"></i><span>Documents</span></span>
                </Link>
                <Link to= {"/" + props.type + "/analytics"} style={{ textDecoration: 'none' }}>
                <span
                    className="list-group-item list-group-item-action ripple"><i className="fas fa-chart-line fa-fw me-3"></i><span>Analytics</span></span>
                </Link>
                <Link to= {"/" + props.type + "/mapping"} style={{ textDecoration: 'none' }}>
                <span
                    className="list-group-item list-group-item-action ripple"><i class="fa-sharp fa-solid fa-chart-tree-map fa-fw me-3"></i><span>CO PO Mapping</span></span>
                </Link>
                { props.type == "admin" && 
                    <Link to= "/admin/collectionlist" style={{ textDecoration: 'none' }}>
                    <span
                        className="list-group-item list-group-item-action ripple"><i class="fa-solid fa-screwdriver-wrench fa-fw me-3"></i><span>Collection CRUD</span></span>
                    </Link>
                }  
            </div>
        </div>
    </nav>
    </div>
    )
}

export default Sidebar;