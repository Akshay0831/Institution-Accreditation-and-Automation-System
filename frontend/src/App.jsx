import SignIn from "./components/SignIn";
import Home from "./components/teacher/TeacherBase";
import Admin from "./components/admin/AdminBase";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { GlobalContext } from "./context/contextProvider";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

function App() {
    const [globalContext, setGlobalContext] = useState({ uid: "", userType: "" });
    return (
        <Router>
            <GlobalContext.Provider value={{ globalContext, setGlobalContext }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route exact path="/login" element={<SignIn />} />
                    <Route exact path="/" element={<ProtectedRoute />}>
                        <Route exact path="home" element={<Home />} />
                        <Route exact path="admin" element={<Admin />} />
                    </Route>
                </Routes>
            </GlobalContext.Provider>
        </Router>
    );
}

export default App;
