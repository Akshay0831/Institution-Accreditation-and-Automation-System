import SignIn from "./components/SignIn";
import Home from "./components/Home";
import Admin from "./components/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
function App() {
    console.log("App.js, uid: " + sessionStorage.getItem("uid"));

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route exact path="/login" element={<SignIn />} />
                <Route exact path="/" element={<ProtectedRoute />}>
                    <Route exact path="home" element={<Home />} />
                    <Route exact path="admin" element={<Admin />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;