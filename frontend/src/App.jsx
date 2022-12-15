import SignIn from "./components/SignIn";
import Home from "./components/Home";
import Admin from "./components/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SidebarTeacher from "./components/SidebarTeacher";
import "bootstrap/dist/css/bootstrap.css";
import DocumentsAccess from "./components/DocumentsAccess"
import UpdateMarks from "./components/UpdateMarks";
import Analytics from "./components/Analytics";

function App() {
    console.log("App.js, uid: " + sessionStorage.getItem("uid"));

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route exact path="/login" element={<SignIn />} />
                <Route exact path="/" element={<ProtectedRoute />}>
                    <Route exact path="home">
                        <Route index element={<><SidebarTeacher/><Home/></>}/>
                        <Route exact path="updatemarks" element={<><SidebarTeacher/><UpdateMarks/></>}/>
                        <Route exact path="documents" element={<><SidebarTeacher/><DocumentsAccess/></>}/>
                        <Route exact path="analytics" element={<><SidebarTeacher/><Analytics/></>}/>
                    </Route>
                    <Route exact path="admin" element={<Admin />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
