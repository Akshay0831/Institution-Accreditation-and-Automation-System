import { lazy, Suspense } from "react";
import SignIn from "./components/SignIn";
const Admin = lazy(() => import("./components/admin/AdminBase"));
const Home = lazy(() => import("./components/teacher/TeacherBase"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
import DocumentsAccess from "./components/teacher/DocumentsAccess"
import AdminUpdateMarksTable from "./components/admin/AdminUpdateMarksTable";
import TeacherUpdateMarksTable from "./components/teacher/TeacherUpdateMarksTable";
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
import UpdateFeedback from "./components/admin/UpdateFeedback";
import UpdateClass from "./components/admin/UpdateClass";
import UpdateClassAllocation from "./components/admin/UpdateClassAllocation";
import UpdateCOPOMap from "./components/admin/UpdateCOPOMap";
import UpdateSubject from "./components/admin/UpdateSubject";
import UpdateTeacher from "./components/admin/UpdateTeacher";
import UpdateTeacherAllocation from "./components/admin/UpdateTeacherAllocation";
import UpdateStudentMarks from "./components/admin/UpdateStudentMarks";
import StudentList from "./components/admin/StudentList";
import AccreditationReportGeneration from "./components/AccreditationReportGeneration";

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
                            <Route exact path="updatemarks" element={<><Home /><TeacherUpdateMarksTable /></>} />
                            <Route exact path="documents" element={<><Home /><DocumentsAccess /></>} />
                            <Route exact path="analytics" element={<><Home /><Analytics /></>} />
                            <Route exact path="mapping" element={<><Home /><COPOMapper /></>} />
                        </Route>
                        <Route exact path="admin" >
                            <Route index element={<><Admin /><Dashboard type="admin" /></>} />
                            <Route exact path="updatemarks" element={<><Admin /><AdminUpdateMarksTable /></>} />
                            <Route exact path="documents" element={<><Admin /><DocumentsAccess /></>} />
                            <Route exact path="accreditationreports" element={<><Admin /><AccreditationReportGeneration /></>} />
                            <Route exact path="analytics" element={<><Admin /><Analytics /></>} />
                            <Route exact path="mapping" element={<><Admin /><COPOMapper /></>} />
                            <Route exact path="collectionlist" element={<><Admin /><CollectionList /></>} />
                            <Route exact path="student/add" element={<><Admin /><UpdateStudent /></>} />
                            <Route exact path="student/update/:id" element={<><Admin /><UpdateStudent /></>} />
                            <Route exact path="department/add" element={<><Admin /><UpdateDepartment /></>} />
                            <Route exact path="department/update/:id" element={<><Admin /><UpdateDepartment /></>} />
                            <Route exact path="feedback/add" element={<><Admin /><UpdateFeedback /></>} />
                            <Route exact path="feedback/update/:id" element={<><Admin /><UpdateFeedback /></>} />
                            <Route exact path="class/add" element={<><Admin /><UpdateClass /></>} />
                            <Route exact path="class/update/:id" element={<><Admin /><UpdateClass /></>} />
                            <Route exact path="class allocation/add" element={<><Admin /><UpdateClassAllocation /></>} />
                            <Route exact path="class allocation/update/:id" element={<><Admin /><UpdateClassAllocation /></>} />
                            <Route exact path="co po map/add" element={<><Admin /><UpdateCOPOMap /></>} />
                            <Route exact path="co po map/update/:id" element={<><Admin /><UpdateCOPOMap /></>} />
                            <Route exact path="marks/add" element={<><Admin /><UpdateStudentMarks /></>} />
                            <Route exact path="marks/update/:id" element={<><Admin /><UpdateStudentMarks /></>} />
                            <Route exact path="subject/add" element={<><Admin /><UpdateSubject /></>} />
                            <Route exact path="subject/update/:id" element={<><Admin /><UpdateSubject /></>} />
                            <Route exact path="teacher/add" element={<><Admin /><UpdateTeacher /></>} />
                            <Route exact path="teacher/update/:id" element={<><Admin /><UpdateTeacher /></>} />
                            <Route exact path="teacher allocation/add" element={<><Admin /><UpdateTeacherAllocation /></>} />
                            <Route exact path="teacher allocation/update/:id" element={<><Admin /><UpdateTeacherAllocation /></>} />
                            <Route exact path="studentlist" element={<><Admin /><StudentList /></>} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </Suspense>
    );
}

export default App;
