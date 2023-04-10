import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";

export default function UpdateClassAllocation() {

    const navigate = useNavigate();
    const { id } = useParams();
    const isUpdate = Boolean(id);
    document.title = (isUpdate ? "Update" : "Add") + " Class Allocation";

    const [classes, setClasses] = useState([]);
    const [classID, setClassID] = useState("");
    const [students, setStudents] = useState([]);
    const [studentID, setStudentID] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (isUpdate) {
                const classAllocData = (await (await fetch("http://localhost:4000/documents/Class Allocation")).json()).filter(doc => doc._id == id)[0];
                setClassID(classAllocData["Class"]);
                setStudentID(classAllocData["Student"]);
            }

            setClasses(await (await fetch("http://localhost:4000/Class")).json());
            setStudents(await (await fetch("http://localhost:4000/documents/Student")).json());
        }
        fetchData();
    }, []);

    const onSubmitClicked = (event) => {
        event.preventDefault();
        let classAllocData = {
            "Class Allocation": {
                "Class": classID,
                "Student": studentID,
            }
        };
        if (isUpdate) classAllocData._id = id;
        fetch(`http://localhost:4000/Class Allocation`, {
            // Adding method type
            method: (isUpdate ? "PUT" : "POST"),
            // Adding body or contents to send
            body: JSON.stringify(classAllocData),
            // Adding headers to the request
            headers: { "Content-type": "application/json; charset=UTF-8" },
        }).then(res => {
            if (res.status == 200)
                navigate("/admin/collectionlist",
                    {
                        state: "Class Allocation",
                    });
            console.log(res.status, res.statusText);
        });
    }

    return (
        <main className="pt-5">
            <div className="container">
                <Card>
                    <Card.Header className="fs-3">{isUpdate ? "Update" : "Add"} Class Allocation</Card.Header>
                    <Card.Body>
                        <Form onSubmit={onSubmitClicked}>
                            <Form.Group className="mb-3">
                                <Form.Label>Student: </Form.Label>
                                <Form.Select name="student" value={studentID} onChange={(event) => setStudentID(event.target.value)} required>
                                    <option value="">Select Student</option>
                                    {students.map((student) => {
                                        return <option key={student._id} value={student._id}>{`${student["Student Name"]} (${student["USN"]})`}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Class: </Form.Label>
                                <Form.Select name="class" value={classID} onChange={(event) => setClassID(event.target.value)} required>
                                    <option value="">Select Class</option>
                                    {classes.map((classObj) => {
                                        return <option key={classObj._id} value={classObj._id}>{`${classObj["Semester"]} ${classObj["Section"]} (${classObj["Department"]["Department Name"]})`}</option>
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