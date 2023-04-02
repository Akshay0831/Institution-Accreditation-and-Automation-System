import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: labels.map(() => Math.floor(Math.random() * (1000 - (-1000) + 1)) + (-1000)),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Dataset 2',
            data: labels.map(() => Math.floor(Math.random() * (1000 - (-1000) + 1)) + (-1000)),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'Target',
            data: labels.map(() => 200),
            borderColor: 'rgb(0, 0, 0)',
            backgroundColor: 'rgb(0, 0, 0)',
        }
    ],
};

export default function Analytics() {

    let toasts = (message, type) => {
        type(message, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }

    const [classes, setClasses] = useState([]);
    const [originalClasses, setOriginalClasses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [originalSubjects, setOriginalSubjects] = useState([]);
    const [classesEnabled, setClassesEnabled] = useState(false);
    const [subjectEnabled, setSubjectEnabled] = useState(false);

    const [classID, setClassID] = useState("");
    const [department, setDepartment] = useState("");
    const [subjectCode, setSubjectCode] = useState("");

    const [classAnalysisData, setClassAnalysisData] = useState(null);

    useEffect(() => {
        let fetchData = async () => {
            let data = await fetch("http://localhost:4000/analytics");
            data = await data.json();

            setDepartments(data.departments);
            setOriginalClasses(data.classes);
            setOriginalSubjects(data.subjects);
        }
        fetchData();
    }, []);

    let handleDepartmentChange = (event) => {
        setClassesEnabled(true);
        setClassID("");
        setClasses(originalClasses.filter(classObj => classObj.fk_Department === event.target.value));
        setDepartment(event.target.value);
    }

    let handleClassChange = (event) => {
        setSubjectEnabled(true);
        setSubjectCode("");
        // setSubjects(originalSubjects.filter(subject => subject["Subject Code"] === eve))
        setClassID(event.target.value);
    }

    let handleSubmit = async (event) => {
        event.preventDefault();
        if (department && classID) {
            let data = await fetch("http://localhost:4000/analytics/" + department + "/" + classID);
            data = await data.json();
        } else {
            toasts("Please fill all fields", toast.error);
        }
    }

    return (
        <main>
            <ToastContainer />
            <div className="container pt-4">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-4">
                            <label className="form-label">Department: </label>
                            <select name="department" className="form-select" required onChange={handleDepartmentChange}>
                                {classesEnabled ? null : <option>Open this select menu</option>}
                                {departments.map(dept => {
                                    return <option key={dept["Department Name"]} value={dept["Department Name"]}>{dept["Department Name"]}</option>
                                })}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Class: {classesEnabled ? null : <span style={{ color: "red" }}>(Select department first)</span>}</label>
                            <select name="class" disabled={!classesEnabled} className="form-select" required onChange={handleClassChange}>
                                {classID ? null : <option>Open this select menu</option>}
                                {classes.map(classObj => {
                                    return <option key={classObj._id} value={classObj._id}>{classObj.Semester + classObj.Section}</option>
                                })}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Subject: {subjectEnabled ? null : <span style={{ color: "red" }}>(Select class first)</span>}</label>
                        </div>
                        <div className="col-md-1" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <button type='submit' className="btn btn-warning">Submit</button>
                        </div>
                    </div>
                </form>
                {/* Analytics from here */}
            </div>
        </main>
    );
}
