import React, { useContext, lazy, Suspense } from "react";
import { AuthContext } from "./components/AuthContext";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "./App.css";

// Lazy-loaded components
const AdminBase = lazy(() => import("./components/admin/AdminBase"));
const SignIn = lazy(() => import("./components/SignIn"));
const TeacherBase = lazy(() => import("./components/teacher/TeacherBase"));
const DocumentsAccess = lazy(() => import("./components/teacher/DocumentsAccess"));
const AdminUpdateMarksTable = lazy(() => import("./components/admin/AdminUpdateMarksTable"));
const TeacherUpdateMarksTable = lazy(() => import("./components/teacher/TeacherUpdateMarksTable"));
const Analytics = lazy(() => import("./components/Analytics"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const COPOMapper = lazy(() => import("./components/teacher/COPOMapper"));
const CollectionList = lazy(() => import("./components/admin/CollectionList"));
const UpdateStudent = lazy(() => import("./components/admin/UpdateStudent"));
const UpdateDepartment = lazy(() => import("./components/admin/UpdateDepartment"));
const UpdateFeedback = lazy(() => import("./components/admin/UpdateFeedback"));
const UpdateClass = lazy(() => import("./components/admin/UpdateClass"));
const UpdateClassAllocation = lazy(() => import("./components/admin/UpdateClassAllocation"));
const UpdateCOPOMap = lazy(() => import("./components/admin/UpdateCOPOMap"));
const UpdateSubject = lazy(() => import("./components/admin/UpdateSubject"));
const UpdateTeacher = lazy(() => import("./components/admin/UpdateTeacher"));
const UpdateTeacherAllocation = lazy(() => import("./components/admin/UpdateTeacherAllocation"));
const UpdateStudentMarks = lazy(() => import("./components/admin/UpdateStudentMarks"));
const StudentList = lazy(() => import("./components/admin/StudentList"));
const AccreditationReportGeneration = lazy(() => import("./components/AccreditationReportGeneration"));

function App() {
    const { user } = useContext(AuthContext);

    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route exact path="/login" element={<SignIn />} />
                    <Route path="/home" element={<TeacherBase />}>
                        <Route index element={<Dashboard type="home" />} />
                        <Route path="updatemarks" element={<TeacherUpdateMarksTable />} />
                        <Route path="documents" element={<DocumentsAccess />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="mapping" element={<COPOMapper />} />
                    </Route>
                    <Route path="/admin" element={<AdminBase />}>
                        <Route index element={<Dashboard type="admin" />} />
                        <Route path="updatemarks" element={<AdminUpdateMarksTable />} />
                        <Route path="documents" element={<DocumentsAccess />} />
                        <Route path="accreditationreports" element={<AccreditationReportGeneration />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="mapping" element={<COPOMapper />} />
                        <Route path="collectionlist" element={<CollectionList />} />
                        <Route path="student/add" element={<UpdateStudent />} />
                        <Route path="student/update/:id" element={<UpdateStudent />} />
                        <Route path="department/add" element={<UpdateDepartment />} />
                        <Route path="department/update/:id" element={<UpdateDepartment />} />
                        <Route path="feedback/add" element={<UpdateFeedback />} />
                        <Route path="feedback/update/:id" element={<UpdateFeedback />} />
                        <Route path="class/add" element={<UpdateClass />} />
                        <Route path="class/update/:id" element={<UpdateClass />} />
                        <Route path="class allocation/add" element={<UpdateClassAllocation />} />
                        <Route path="class allocation/update/:id" element={<UpdateClassAllocation />} />
                        <Route path="co po map/add" element={<UpdateCOPOMap />} />
                        <Route path="co po map/update/:id" element={<UpdateCOPOMap />} />
                        <Route path="marks/add" element={<UpdateStudentMarks />} />
                        <Route path="marks/update/:id" element={<UpdateStudentMarks />} />
                        <Route path="subject/add" element={<UpdateSubject />} />
                        <Route path="subject/update/:id" element={<UpdateSubject />} />
                        <Route path="teacher/add" element={<UpdateTeacher />} />
                        <Route path="teacher/update/:id" element={<UpdateTeacher />} />
                        <Route path="teacher allocation/add" element={<UpdateTeacherAllocation />} />
                        <Route path="teacher allocation/update/:id" element={<UpdateTeacherAllocation />} />
                        <Route path="studentlist" element={<StudentList />} />
                    </Route>
                </Routes>
            </Router>
        </Suspense >
    );
}

export default App;
