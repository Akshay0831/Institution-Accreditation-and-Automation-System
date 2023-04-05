import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";

export default function UpdateSubject() {

    const { id } = useParams();
    const isUpdate = Boolean(id);

    const [departments, setDepartments] = useState([]);
    const [schemeCode, setSchemeCode] = useState("");
    const [subjectCode, setSubjectCode] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [testAssignmentRatio, setTestAssignmentRatio] = useState(3);
    const [maxMarks, setMaxMarks] = useState({ IA1: { CO1: 18, CO2: 12 }, A1: { CO1: 18, CO2: 12 }, IA2: { CO2: 6, CO3: 12, CO4: 6 }, A2: { CO2: 6, CO3: 12, CO4: 6 }, IA3: { CO4: 12, CO5: 18 }, A3: { CO4: 12, CO5: 18 }, SEE: 60 });
    const [semester, setSemester] = useState(1);
    const [departmentId, setDepartmentID] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            // console.log((await (await fetch("http://localhost:4000/documents/Department")).json()).filter(doc => doc._id == "64256326539b7e514a91fe64" )[0]);
            if (isUpdate) {
                const subjectsData = (await (await fetch("http://localhost:4000/documents/Subject")).json()).filter(doc => doc._id == id)[0];
                console.log(subjectsData);
                setSchemeCode(subjectsData["Scheme Code"]);
                setSubjectCode(subjectsData["Subject Code"]);
                setSubjectName(subjectsData["Subject Name"]);
                setTestAssignmentRatio(subjectsData["Test Assignment Ratio"]);
                setMaxMarks(subjectsData["Max Marks"]);
                setSemester(subjectsData["Semester"]);
                setDepartmentID(subjectsData["Department"]);
            }

            const departmentsData = await (await fetch("http://localhost:4000/documents/Department")).json();
            setDepartments(departmentsData);
        }
        fetchData();
    }, []);

    const onSubmitClicked = (event) => {
        event.preventDefault();
        let subject = {
            "Scheme Code": schemeCode,
            "Subject Code": subjectCode,
            "Subject Name": subjectName,
            "Test Assignment Ratio": testAssignmentRatio,
            "Max Marks": maxMarks,
            "Semester": semester,
            "Department": departmentId
        }
        fetch(`http://localhost:4000/Subject`, {
            // Adding method type
            method: (isUpdate ? "PUT" : "POST"),
            // Adding body or contents to send
            body: JSON.stringify(subject),
            // Adding headers to the request
            headers: { "Content-type": "application/json; charset=UTF-8" },
        });
    }

    return (
        <main className="pt-5">
            <div className="container">
                <Card>
                    <Card.Header className="fs-3">{isUpdate ? "Update" : "Add"} Subject</Card.Header>
                    <Card.Body>
                        <Form onSubmit={onSubmitClicked}>
                            <Form.Group className="mb-3">
                                <Form.Label>Scheme Code:</Form.Label>
                                <Form.Control type="text" name="schemeCode" id="schemeCode" value={schemeCode} placeholder={"Enter Scheme Code"} onChange={(event) => { setSchemeCode(event.target.value) }} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Subject Code:</Form.Label>
                                <Form.Control type="text" name="subjectCode" id="subjectCode" value={subjectCode} placeholder={"Enter Subject Code"} onChange={(event) => { setSubjectCode(event.target.value) }} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Subject Name:</Form.Label>
                                <Form.Control type="text" name="subjectName" id="subjectName" value={subjectName} placeholder={"Enter Subject Name"} onChange={(event) => { setSubjectName(event.target.value) }} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Test Assignment Ratio:</Form.Label>
                                <Form.Control type="text" name="testAssignmentRatio" id="testAssignmentRatio" value={testAssignmentRatio} placeholder={"Enter Test Assignment Ratio"} onChange={(event) => { setTestAssignmentRatio(event.target.value) }} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Max Marks:</Form.Label>
                                <Form.Control type="text" name="maxMarks" id="maxMarks" value={JSON.stringify(maxMarks)} placeholder={"Enter Max Marks"} onChange={(event) => { setMaxMarks(JSON.parse(event.target.value)) }} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Semester:</Form.Label>
                                <Form.Control type="number" name="semester" id="semester" value={semester} placeholder={"Enter Semester"} onChange={(event) => { setSemester(event.target.value) }} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Department: </Form.Label>
                                <Form.Select name="department" value={departmentId} onChange={(event) => setDepartmentID(event.target.value)} required>
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => {
                                        return <option key={dept._id} value={dept._id}>{dept["Department Name"]}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Button variant="success" type="submit">Submit</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </main>
    )
}