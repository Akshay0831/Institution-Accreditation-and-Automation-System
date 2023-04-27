import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { InfinitySpin } from 'react-loader-spinner'
import { Card, Form } from 'react-bootstrap';
import BarGraph from './BarGraph';

export default function AnalyticsOfStudent(props) {

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

    // const subject = props.subject;
    const department = props.department;
    const [students, setStudents] = useState([]);
    const [studentID, setStudentID] = useState("");

    const [studentAnalyticsData, setStudentAnalyticsData] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let fetchData = async () => {
            let studentsJSON = await (await fetch("http://localhost:4000/documents/Student")).json();
            if (department)
                studentsJSON = studentsJSON.filter(doc => doc.Department == department);
            setStudents(studentsJSON);
        }
        fetchData();
    }, []);

    let handleStudentSubmit = async (event) => {
        event.preventDefault();
        // alert(studentID);
        if (studentID.length) {
            setIsLoading(true);
            let data = await (await fetch("http://localhost:4000/Analytics/predict_SEE_marks/" + studentID)).json();
            let labels = [];
            let graphData = [];
            let SEE = data.Marks["Marks Gained"].SEE;
            let predictedSEE = data.Predicted_SEE;
            let studentName = data.Student["Student Name"];
            delete data.Marks["Marks Gained"].SEE;
            let IASum = 0;
            let ASum = 0;
            Object.keys(data.Marks["Marks Gained"]).forEach(ia => {
                Object.keys(data.Marks["Marks Gained"][ia]).forEach(co => {
                    let value = data.Marks["Marks Gained"][ia][co];
                    if (ia.startsWith("IA")) {
                        IASum += isNaN(Number(value)) ? 0 : Number(value);
                    } else if (ia.startsWith("A")) {
                        ASum += isNaN(Number(value)) ? 0 : Number(value);
                    }
                });
                if (ia.startsWith("A")) {
                    graphData.push(IASum + ASum);
                    IASum = 0;
                    ASum = 0;
                } else {
                    labels.push(ia);
                }
            });
            data.Marks["Marks Gained"].SEE = SEE;
            setStudentAnalyticsData({
                title: studentName + "'s internal performance",
                labels,
                graphData,
                Student: data.Student,
                Marks: data.Marks,
                predictedSEE
            });
            setIsLoading(false);
        } else {
            setStudentAnalyticsData(null);
            toasts("Couldn't fetch the student", toast.error);
        }
    }

    return (
        <Card className='m-3'>
            {!isLoading
                ? <><Form onSubmit={handleStudentSubmit} className='m-3 px-2'>
                    <Form.Group className='row'>
                        <Form.Label className='col-md-3'>Select Student:</Form.Label>
                        <Form.Select className='col' value={studentID} onChange={(e) => setStudentID(e.target.value)} required>
                            <option value="">Select Student</option>
                            {students.map(stu => (<option key={stu._id} value={stu._id}>{stu.USN}</option>))}
                        </Form.Select>
                        <button type="submit" className='btn btn-success col-sm-2'>Submit</button>
                    </Form.Group>
                </Form>
                    {(studentAnalyticsData) ?
                        <div className='row p-2'>
                            <div className="col-lg-8">
                                <BarGraph graphData={studentAnalyticsData.graphData} labels={studentAnalyticsData.labels} title={studentAnalyticsData.title} />
                            </div>
                            <div className="col-lg-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{studentAnalyticsData.Student["Student Name"]}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{studentAnalyticsData.Student.USN}</Card.Subtitle>
                                        <Card.Text>
                                            <p className='m-0' style={{
                                                color: (studentAnalyticsData.predictedSEE > studentAnalyticsData.Marks["Marks Gained"].SEE) ? "red" : "green"
                                            }}>Semester Examination Marks: <span className='fs-3'>{studentAnalyticsData.Marks["Marks Gained"].SEE}</span></p>
                                            <p className='m-0'>Predicted Examination Marks: <span className='fs-3'>{studentAnalyticsData.predictedSEE}</span></p>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div> : null}</>
                : <div className='d-flex justify-content-center'><InfinitySpin color="#000" width='200' visible={true} /></div>}
        </Card>
    );
}
