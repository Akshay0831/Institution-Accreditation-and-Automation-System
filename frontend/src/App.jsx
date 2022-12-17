import { lazy, Suspense } from "react";
import SignIn from "./components/SignIn";
const Admin = lazy(() => import("./components/admin/AdminBase"));
const Home = lazy(() => import("./components/teacher/TeacherBase"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
import DocumentsAccess from "./components/teacher/DocumentsAccess"
import UpdateMarks from "./components/UpdateMarks";
import Analytics from "./components/Analytics";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "./App.css";
import Dashboard from "./components/Dashboard";

function App() {
    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route exact path="/login" element={<SignIn />} />
                    <Route exact path="/" element={<ProtectedRoute />}>
                    <Route exact path="home">
                        <Route index element={<><Home/><Dashboard/></>}/>
                        <Route exact path="updatemarks" element={<><Home/><UpdateMarks/></>}/>
                        <Route exact path="documents" element={<><Home/><DocumentsAccess/></>}/>
                        <Route exact path="analytics" element={<><Home/><Analytics/></>}/>
                    </Route>
                        <Route exact path="admin" element={<Admin />} />
                    </Route>
                </Routes>
            </Router>
        </Suspense>
    );
}

export default App;
