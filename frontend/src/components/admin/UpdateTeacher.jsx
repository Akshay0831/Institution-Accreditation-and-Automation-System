import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";

export default function UpdateTeacher() {

    const { id } = useParams();
    const isUpdate = Boolean(id);
    document.title = (isUpdate?"Update":"Add") + " Teacher";

    const [departments, setDepartments] = useState([]);
    const [mail, setMail] = useState("");
    const [role, setRole] = useState("");
    const [teacherName, setTeacherName] = useState("");
    const [departmentId, setDepartmentID] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            // console.log((await (await fetch("http://localhost:4000/documents/Department")).json()).filter(doc => doc._id == "64256326539b7e514a91fe64" )[0]);
            if (isUpdate) {
                const teachersData = (await (await fetch("http://localhost:4000/documents/Teacher")).json()).filter(doc => doc._id == id)[0];
                console.log(teachersData);
                setMail(teachersData["Mail"]);
                setRole(teachersData["Role"]);
                setTeacherName(teachersData["Teacher Name"]);
                setDepartmentID(teachersData["Department"]);
            }

            const departmentsData = await (await fetch("http://localhost:4000/documents/Department")).json();
            setDepartments(departmentsData);
        }
        fetchData();
    }, []);

    const onSubmitClicked = (event) => {
        event.preventDefault();
        let teacher = {"Teacher":{
            "Mail": mail,
            "Role": role,
            "Teacher Name": teacherName,
            "Department": departmentId
        }}
        fetch(`http://localhost:4000/Teacher`, {
            // Adding method type
            method: (isUpdate ? "PUT" : "POST"),
            // Adding body or contents to send
            body: JSON.stringify(teacher),
            // Adding headers to the request
            headers: { "Content-type": "application/json; charset=UTF-8" },
        });
    }

    return (
        <main className="pt-5">
            <div className="container">
                <Card>
                    <Card.Header className="fs-3">{isUpdate ? "Update" : "Add"} Teacher</Card.Header>
                    <Card.Body>
                        <Form onSubmit={onSubmitClicked}>
                            <Form.Group className="mb-3">
                                <Form.Label>Mail Id:</Form.Label>
                                <Form.Control type="email" name="mail" id="mail" value={mail} placeholder={"Enter Mail Id"} onChange={(event) => { setMail(event.target.value) }} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Role:</Form.Label>
                                <Form.Control type="text" name="role" id="role" value={role} placeholder={"Enter Role"} onChange={(event) => { setRole(event.target.value) }} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Teacher Name:</Form.Label>
                                <Form.Control type="text" name="teacherName" id="teacherName" value={teacherName} placeholder={"Enter Teacher Name"} onChange={(event) => { setTeacherName(event.target.value) }} required />
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