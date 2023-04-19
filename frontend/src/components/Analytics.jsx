import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import BarGraph from './BarGraph';
import PieGraph from './PieGraph';

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

    const [departments, setDepartments] = useState([]);
    const [department, setDepartment] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [subject, setSubject] = useState("");
    const [originalSubjects, setOriginalSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentUSN, setStudentUSN] = useState("");

    const [subjectEnabled, setSubjectEnabled] = useState(false);
    const [barGraphData, setBarGraphData] = useState({});
    const [pieGraphData, setPieGraphData] = useState({});

    const [submitClicked, setSubmitClicked] = useState(false);
    const [studentAnalyticsData, setStudentAnalyticsData] = useState({})

    useEffect(() => {
        let fetchData = async () => {
            let data = await fetch("http://localhost:4000/Analytics");
            data = await data.json();

            setDepartments(data.departments);
            setOriginalSubjects(data.subjects);
            setStudents(data.students);
        }
        fetchData();
    }, []);

    let handleDepartmentChange = (event) => {
        setDepartment(event.target.value);
        setSubjectEnabled(true);
        setSubject("");
        setSubjects(originalSubjects.filter(subject => subject.Department === event.target.value));
    }

    let handleSubjectChange = (event) => {
        setSubject(event.target.value);
    }

    let onDownloadReportClicked = async (event) => {
        event.preventDefault();
        if (subject.length > 0) {
            let fileName = await fetch("http://localhost:4000/report_generation/" + subject);
            window.open("http://localhost:4000/formatted_output.xlsx", '_blank');
        }
    }

    let calculateFinalMarks = (marks) => {
        let IAmarks = 0;
        let assignments = 0;
        let SEE = typeof marks.SEE == 'number' ? (marks.SEE > 60 ? 60 : marks.SEE) : 0;
        delete marks.SEE;
        Object.keys(marks).forEach(m => {
            Object.keys(marks[m]).forEach(co => {
                let value = Number(marks[m][co]);
                if (m.startsWith("IA"))
                    IAmarks += isNaN(value) ? 0 : value;
                else if (m.startsWith("A"))
                    assignments += isNaN(value) ? 0 : value;
            })
        })
        const avgIAmarks = Math.round(IAmarks / 3);
        const avgAssignments = Math.round(assignments / 3);
        const totalMarks = avgIAmarks + avgAssignments + SEE;
        return totalMarks;
    }

    let handleStudentSubmit = async (event) => {
        event.preventDefault();
        let studentId = students.filter(s => { return s.USN === studentUSN })[0]._id;
        // alert(studentId);
        let data = await fetch("http://localhost:4000/Analytics/predict_SEE_marks/" + studentId);
        data = await data.json();
        let labels = ["IA1", "IA2", "IA3"];
        let graphData = [];
        let SEE = data.Marks["Marks Gained"].SEE;
        let predictedSEE = data.predicted_SEE;
        let studentName = data.Student["Student Name"];
        delete data.Marks["Marks Gained"].SEE;
        Object.keys(data.Marks["Marks Gained"]).forEach(ia => {
            let IASum = 0;
            let ASum = 0;
            Object.keys(data.Marks["Marks Gained"][ia]).forEach(co => {
                let value = data.Marks["Marks Gained"][ia][co];
                if (ia.startsWith("IA")) {
                    IASum += isNaN(Number(value)) ? 0 : Number(value);
                } else if (ia.startsWith("A")) {
                    ASum += isNaN(Number(value)) ? 0 : Number(value);
                }
            })
            graphData.push(IASum + ASum);
        });
        setStudentAnalyticsData({ subjectName: studentName, labels, graphData })
    }

    let handleSubmit = async (event) => {
        event.preventDefault();
        if (subject.length > 0) {
            let data = await fetch("http://localhost:4000/Analytics/" + subject);
            data = await data.json();
            let Subject = data.Subject;
            let Marks = data.Marks;
            let subjectName = Subject["Subject Name"];
            let barGraphLabels = Marks.map((m, i) => {
                if (Object.keys(m.Student) < 1) console.log(Marks[i - 1]);
                return m.Student?.USN;
            });
            let barGraphData = Marks.map(m => (calculateFinalMarks(m["Marks Gained"])));
            setBarGraphData({ subjectName, labels: barGraphLabels, graphData: barGraphData });

            let pieGraphLabels = ["60% or more", "Between 55% and 59%", "Between 50% and 54%", "Between 34% and 49%", "33% or less"];
            let pieGraphData = [
                barGraphData.filter(m => m >= 60).length,
                barGraphData.filter(m => m >= 55 && m < 60).length,
                barGraphData.filter(m => m >= 50 && m < 55).length,
                barGraphData.filter(m => m >= 34 && m < 50).length,
                barGraphData.filter(m => m < 34).length,
            ];
            setPieGraphData({ subjectName, labels: pieGraphLabels, graphData: pieGraphData });
            setSubmitClicked(true);
        } else {
            toasts("Please fill all fields", toast.error);
        }
    }

    return (
        <main>
            <ToastContainer />
            <div className="container pt-4 mb-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-4">
                            <label className="form-label">Department: </label>
                            <select name="department" className="form-select" required onChange={handleDepartmentChange}>
                                <option value={""}>Open this select menu</option>
                                {departments.map(dept => {
                                    return <option key={dept._id} value={dept._id}>{dept["Department Name"]}</option>
                                })}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Subject: {subjectEnabled ? null : <span style={{ color: "red" }}>(Select department first)</span>}</label>
                            <select name="subject" disabled={!subjectEnabled} className="form-select" required onChange={handleSubjectChange}>
                                <option value={""}>Open this select menu</option>
                                {subjects.map(subject => {
                                    return <option key={subject._id} value={subject._id}>{String(subject["Subject Name"] + " (" + subject["Subject Code"] + ")").toUpperCase()}</option>
                                })}
                            </select>
                        </div>
                        <div className="col-md-1" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <button type='submit' className="btn btn-warning" disabled={subject.length == 0}>Submit</button>
                        </div>
                    </div>
                </form>
                {/* Analytics from here */}
                {submitClicked ? <>
                    <div className='m-2 rounded' style={{ background: "white" }}>
                        <BarGraph graphData={barGraphData.graphData} labels={barGraphData.labels} subjectName={barGraphData.subjectName} />
                    </div>
                    <div className='m-2 p-5 rounded' style={{ background: "white" }}>
                        <PieGraph graphData={pieGraphData.graphData} labels={pieGraphData.labels} subjectName={pieGraphData.subjectName} />
                    </div>
                </> : null}
                <button className="btn btn-info" disabled={subject.length == 0} onClick={onDownloadReportClicked}>Download Report</button>
                <form onSubmit={handleStudentSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label className="form-label">Select individual student: </label>
                                </td>
                                <td>
                                    <input type="text" className='form-control' list='students' value={studentUSN} onChange={e => setStudentUSN(e.target.value)} />
                                    <datalist id='students'>
                                        {students.map(stu => (<option key={stu._id} value={stu.USN} />))}
                                    </datalist>
                                </td>
                                <td>
                                    <button type="submit" className='btn btn-success'>Submit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                <BarGraph graphData={studentAnalyticsData.graphData} labels={studentAnalyticsData.labels} subjectName={studentAnalyticsData.subjectName} />
            </div>
        </main>
    );
}
