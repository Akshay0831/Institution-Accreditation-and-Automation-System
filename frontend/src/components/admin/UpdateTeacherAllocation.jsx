import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";

export default function UpdateTeacherAllocation() {

    const { id } = useParams();
    const isUpdate = Boolean(id);
    document.title = (isUpdate?"Update":"Add") + " Teacher Allocation";

    const [classes, setClasses] = useState([]);
    const [classID, setClassID] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [subjectID, setSubjectID] = useState("");
    const [teachers, setTeachers] = useState([]);
    const [teacherID, setTeacherID] = useState("");
    const [departments, setDepartments] = useState([]);
    const [departmentID, setDeparmentID] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (isUpdate){
                const teacherAllocData =  (await (await fetch("http://localhost:4000/documents/Teacher Allocation")).json()).filter(doc => doc._id==id)[0];
                setClassID(teacherAllocData["Class"]);
                setSubjectID(teacherAllocData["Subject"]);
                setTeacherID(teacherAllocData["Teacher"]);
                setDeparmentID(teacherAllocData["Department"]);
            }

            setClasses(await (await fetch("http://localhost:4000/documents/Class")).json());
            setSubjects(await (await fetch("http://localhost:4000/documents/Subject")).json());
            setTeachers(await (await fetch("http://localhost:4000/documents/Teacher")).json());
            setDepartments(await (await fetch("http://localhost:4000/documents/Department")).json());
        }
        fetchData();
    }, []);

    const onSubmitClicked = (event) => {
        event.preventDefault();
        let teacherAllocData = {"Teacher Allocation":{
            "Class": classID,
            "Subject": subjectID,
            "Teacher": teacherID,
            "Department": departmentID,
        }};
        fetch(`http://localhost:4000/Teacher Allocation`, {
            // Adding method type
            method: (isUpdate ? "PUT" : "POST"),
            // Adding body or contents to send
            body: JSON.stringify(teacherAllocData),
            // Adding headers to the request
            headers: { "Content-type": "application/json; charset=UTF-8" },
        });
    }

    return (
        <main className="pt-5">
            <div className="container">
                <Card>
                    <Card.Header className="fs-3">{isUpdate? "Update": "Add"} Teacher Allocation</Card.Header>
                    <Card.Body>
                        <Form onSubmit={onSubmitClicked}>
                            <Form.Group className="mb-3">
                                <Form.Label>Class: </Form.Label>
                                <Form.Select name="class" value={classID} onChange={(event) => setClassID(event.target.value)} required>
                                    <option value="">Select Class</option>
                                    {classes.map((classObj) => {
                                        return <option key={classObj._id} value={classObj._id}>{`${classObj["Semester"]} ${classObj["Section"]}`}</option>
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
                                <Form.Label>Teacher: </Form.Label>
                                <Form.Select name="teacher" value={teacherID} onChange={(event) => setTeacherID(event.target.value)} required>
                                    <option value="">Select Teacher</option>
                                    {teachers.map((teacher) => {
                                        return <option key={teacher._id} value={teacher._id}>{`${teacher["Teacher Name"]} (${teacher["Mail"]})`}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Department: </Form.Label>
                                <Form.Select name="department" value={departmentID} onChange={(event) => setDeparmentID(event.target.value)} required>
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