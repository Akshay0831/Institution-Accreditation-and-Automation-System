import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../public/css/styles.css"
import { useNavigate, Link } from "react-router-dom";

function Sidebar (){

    return (
        <div>
            <nav className="d-lg-block sidebar bg-dark">
                <div className="position-sticky">
                <div className="list-group list-group-flush">
                <Link to="/home" style={{ textDecoration: 'none' }}>
                <span
                    className="list-group-item list-group-item-action ripple active" aria-current="true">
                <i className="fas fa-tachometer-alt fa-fw me-3"></i><span>Main dashboard</span>
                </span>
                </Link>
                <Link to="/home/updatemarks" style={{ textDecoration: 'none' }}>
                <span
                    className="list-group-item list-group-item-action ripple">
                <i className="fas fa-chart-area fa-fw me-3"></i><span>Update Marks</span>
                </span>
                </Link>
                <Link to= "/home/documents" style={{ textDecoration: 'none' }}>
                <span
                    className="list-group-item list-group-item-action ripple"><i className="fas fa-lock fa-fw me-3"></i><span>Documents</span></span>
                </Link>
                <Link to= "/home/analytics" style={{ textDecoration: 'none' }}>
                <span
                    className="list-group-item list-group-item-action ripple"><i className="fas fa-chart-line fa-fw me-3"></i><span>Analytics</span></span>
                </Link>
            </div>
        </div>
    </nav>
    </div>
    )
}

export default Sidebar;