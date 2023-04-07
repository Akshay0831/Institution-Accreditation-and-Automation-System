import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";

export default function UpdateStudentMarks() {

    const { id } = useParams();
    const isUpdate = Boolean(id);

    const [subjects, setSubjects] = useState([]);
    const [subjectID, setSubjectID] = useState("");
    const [students, setStudents] = useState([]);
    const [studentID, setStudentID] = useState("");
    const [marksGained, setMarksGained] = useState({ IA1: { CO1: 18, CO2: 12 }, A1: { CO1: 18, CO2: 12 }, IA2: { CO2: 6, CO3: 12, CO4: 6 }, A2: { CO2: 6, CO3: 12, CO4: 6 }, IA3: { CO4: 12, CO5: 18 }, A3: { CO4: 12, CO5: 18 }, SEE: 60 });

    useEffect(() => {
        const fetchData = async () => {
            // console.log((await (await fetch("http://localhost:4000/documents/Department")).json()).filter(doc => doc._id == "64256326539b7e514a91fe64" )[0]);
            if (isUpdate) {
                const marksData = (await (await fetch("http://localhost:4000/documents/Marks")).json()).filter(doc => doc._id == id)[0];
                console.log(marksData);
                setMarksGained(marksData["Marks Gained"]);
                setSubjectID(marksData["Subject"]);
                setStudentID(marksData["Student"]);
            }

            setSubjects(await (await fetch("http://localhost:4000/documents/Subject")).json());
            setStudents(await (await fetch("http://localhost:4000/documents/Student")).json());
        }
        fetchData();
    }, []);

    const onSubmitClicked = (event) => {
        event.preventDefault();
        let marks = {
            "Marks Gained": marksGained,
            "Subject": subjectID,
            "Student": studentID,
        }
        fetch(`http://localhost:4000/Marks`, {
            // Adding method type
            method: (isUpdate ? "PUT" : "POST"),
            // Adding body or contents to send
            body: JSON.stringify(marks),
            // Adding headers to the request
            headers: { "Content-type": "application/json; charset=UTF-8" },
        });
    }

    return (
        <main className="pt-5">
            <div className="container">
                <Card>
                    <Card.Header className="fs-3">{isUpdate ? "Update" : "Add"} Marks</Card.Header>
                    <Card.Body>
                        <Form onSubmit={onSubmitClicked}>
                            <Form.Group className="mb-3">
                                <Form.Label>Student: </Form.Label>
                                <Form.Select name="student" value={studentID} onChange={(event) => setStudentID(event.target.value)} required>
                                    <option value="">Select Student</option>
                                    {subjects.map((student) => {
                                        return <option key={student._id} value={student._id}>{`${student["Student Name"]} (${student["USN"]})`}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Subject: </Form.Label>
                                <Form.Select name="subject" value={subjectID} onChange={(event) => setSubjectID(event.target.value)} required>
                                    <option value="">Select Subject</option>
                                    {subjects.map((subj) => {
                                        return <option key={subj._id} value={subj._id}>{`${subj["Subject Name"]} (${subj["Subject Code"]})`}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Marks Gained:</Form.Label>
                                <Form.Control type="text" name="marksGained" id="marksGained" value={JSON.stringify(marksGained)} placeholder={"Enter Max Marks"} onChange={(event) => { setMarksGained(JSON.parse(event.target.value)) }} required />
                            </Form.Group>
                            <Button variant="success" type="submit">Submit</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </main>
    )
}