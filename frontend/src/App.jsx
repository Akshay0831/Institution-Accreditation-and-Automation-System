import { lazy, Suspense } from "react";
import SignIn from "./components/SignIn";
const Admin = lazy(() => import("./components/admin/AdminBase"));
const Home = lazy(() => import("./components/teacher/TeacherBase"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const UpdateMarks = lazy(() => import("./components/UpdateMarks"));
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "./App.css";

function App() {
    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route exact path="/login" element={<SignIn />} />
                    <Route exact path="/" element={<ProtectedRoute />}>
                        <Route exact path="home" element={<Home />} />
                        <Route exact path="admin" element={<Admin />} />
                        <Route exact path="update_marks" element={<UpdateMarks />} />
                    </Route>
                </Routes>
            </Router>
        </Suspense>
    );
}

export default App;
