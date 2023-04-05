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
import COPOMapper from "./components/teacher/COPOMapper";
import CollectionList from "./components/admin/CollectionList";
import UpdateStudent from "./components/admin/UpdateStudent";
import UpdateDepartment from "./components/admin/UpdateDepartment";
import UpdateClass from "./components/admin/UpdateClass";
import UpdateCOPOMap from "./components/admin/UpdateCOPOMap";
import StudentList from "./components/admin/StudentList";

function App() {
    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route exact path="/login" element={<SignIn />} />
                    <Route exact path="/" element={<ProtectedRoute />}>
                        <Route exact path="home">
                            <Route index element={<><Home /><Dashboard type="home" /></>} />
                            <Route exact path="updatemarks" element={<><Home /><UpdateMarks /></>} />
                            <Route exact path="documents" element={<><Home /><DocumentsAccess /></>} />
                            <Route exact path="analytics" element={<><Home /><Analytics /></>} />
                            <Route exact path="mapping" element={<><Home /><COPOMapper /></>} />
                        </Route>
                        <Route exact path="admin" >
                            <Route index element={<><Admin /><Dashboard type="admin" /></>} />
                            <Route exact path="updatemarks" element={<><Admin /><UpdateMarks /></>} />
                            <Route exact path="documents" element={<><Admin /><DocumentsAccess /></>} />
                            <Route exact path="analytics" element={<><Admin /><Analytics /></>} />
                            <Route exact path="mapping" element={<><Admin /><COPOMapper /></>} />
                            <Route exact path="collectionlist" element={<><Admin /><CollectionList collection="Teacher" /></>} />
                            <Route exact path="student/add" element={<><Admin /><UpdateStudent /></>} />
                            <Route exact path="student/update/:id" element={<><Admin /><UpdateStudent /></>} />
                            <Route exact path="department/add" element={<><Admin /><UpdateDepartment /></>} />
                            <Route exact path="department/update/:id" element={<><Admin /><UpdateDepartment /></>} />
                            <Route exact path="class/add" element={<><Admin /><UpdateClass /></>} />
                            <Route exact path="class/update/:id" element={<><Admin /><UpdateClass /></>} />
                            <Route exact path="co po map/add" element={<><Admin /><UpdateCOPOMap /></>} />
                            <Route exact path="co po map/update/:id" element={<><Admin /><UpdateCOPOMap /></>} />
                            <Route exact path="studentlist" element={<><Admin /><StudentList /></>} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </Suspense>
    );
}

export default App;
