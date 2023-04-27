import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { InfinitySpin } from 'react-loader-spinner'
import { Card } from 'react-bootstrap';
import GenerateReportForm from './GenerateReportForm';
import BarGraph from './BarGraph';
import PieGraph from './PieGraph';
import AnalyticsOfStudent from './AnalyticsOfStudent';

export default function Analytics() {

    let toasts = (message, type) => {
        type(message, {
            position: "top-center",
            autoClose: 2500,
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

    const [barGraphData, setBarGraphData] = useState({});
    const [pieGraphData, setPieGraphData] = useState({});

    const [submitClicked, setSubmitClicked] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = "Analytics";
        let fetchData = async () => {
            let data = await fetch("http://localhost:4000/Analytics");
            data = await data.json();

            setDepartments(data.departments);
            setOriginalSubjects(data.subjects);
        }
        fetchData();
    }, []);

    let handleDepartmentChange = (event) => {
        setDepartment(event.target.value);
        setSubject("");
        setSubjects(originalSubjects.filter(subject => subject.Department === event.target.value));
    }

    let handleSubjectChange = (event) => {
        setSubject(event.target.value);
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

    let handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        if (subject.length > 0) {
            let data = await fetch("http://localhost:4000/Analytics/" + subject);
            data = await data.json();
            let Subject = data.Subject;
            let Marks = data.Marks;
            let title = Subject["Subject Name"];
            let barGraphLabels = Marks.map((m, i) => {
                if (Object.keys(m.Student) < 1) console.log(Marks[i - 1]);
                return m.Student?.USN;
            });
            let barGraphData = Marks.map(m => (calculateFinalMarks(m["Marks Gained"])));
            setBarGraphData({ title, labels: barGraphLabels, graphData: barGraphData });

            let pieGraphLabels = ["60% or more", "Between 55% and 59%", "Between 50% and 54%", "Between 34% and 49%", "33% or less"];
            let pieGraphData = [
                barGraphData.filter(m => m >= 60).length,
                barGraphData.filter(m => m >= 55 && m < 60).length,
                barGraphData.filter(m => m >= 50 && m < 55).length,
                barGraphData.filter(m => m >= 34 && m < 50).length,
                barGraphData.filter(m => m < 34).length,
            ];
            setIsLoading(false);
            setPieGraphData({ title, labels: pieGraphLabels, graphData: pieGraphData });
            setSubmitClicked(true);
        } else {
            toasts("Please fill all fields", toast.error);
        }
    }

    return (
        <main className='pt-5'>
            <div className="container">
                <Card>
                    <Card.Header className="fs-3">Analytics</Card.Header>
                    <Card.Body>
                        {!isLoading ? (
                            <>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <label className="form-label">Department: </label>
                                            <select name="department" className="form-select" value={department} required onChange={handleDepartmentChange}>
                                                <option value={""}>Open this select menu</option>
                                                {departments.map(dept => {
                                                    return <option key={dept._id} value={dept._id}>{dept["Department Name"]}</option>
                                                })}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Subject: {department ? null : <span style={{ color: "red" }}>(Select department first)</span>}</label>
                                            <select name="subject" disabled={!department} className="form-select" required onChange={handleSubjectChange}>
                                                <option value={""}>Open this select menu</option>
                                                {subjects.map(subject => {
                                                    return <option key={subject._id} value={subject._id}>{String(subject["Subject Name"] + " (" + subject["Subject Code"] + ")").toUpperCase()}</option>
                                                })}
                                            </select>
                                        </div>
                                        <div className="d-flex justify-content-center col-md-1">
                                            <button type='submit' className="btn btn-warning" disabled={subject.length == 0}>Submit</button>
                                        </div>
                                    </div>
                                </form>
                                {/* Analytics from here */}
                                {submitClicked ? <>
                                    <GenerateReportForm subjectId={subject} />
                                    <div className='m-3'>
                                        <BarGraph graphData={barGraphData.graphData} labels={barGraphData.labels} title={barGraphData.title + " perfomance"} thresholdLines={true} />
                                    </div>
                                    <div className='m-3'>
                                        <PieGraph graphData={pieGraphData.graphData} labels={pieGraphData.labels} title={pieGraphData.title} />
                                    </div>
                                    <AnalyticsOfStudent department={department}/>
                                </> : null}
                            </>) : (<div className='d-flex justify-content-center'><InfinitySpin color="#000" width='200' visible={true} /></div>)}
                    </Card.Body>
                </Card>
            </div>
        </main>
    );
}
