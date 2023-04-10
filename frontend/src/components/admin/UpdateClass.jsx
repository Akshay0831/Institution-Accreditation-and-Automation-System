import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";

export default function UpdateClass() {

    const navigate = useNavigate();
    const { id } = useParams();
    const isUpdate = Boolean(id);
    document.title = (isUpdate ? "Update" : "Add") + " Class";

    const [departments, setDepartments] = useState([]);
    const [departmentID, setDepartmentID] = useState("");
    const [semester, setSemester] = useState("");
    const [section, setSection] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            // console.log((await (await fetch("http://localhost:4000/documents/Department")).json()).filter(doc => doc._id == "64256326539b7e514a91fe64" )[0]);
            if (isUpdate) {
                const classData = (await (await fetch("http://localhost:4000/documents/Class")).json()).filter(doc => doc._id == id)[0];
                console.log(classData);
                setDepartmentID(classData["Department"]);
                setSemester(classData["Semester"]);
                setSection(classData["Section"]);
            }

            const departmentsData = await (await fetch("http://localhost:4000/documents/Department")).json();
            setDepartments(departmentsData);
        }
        fetchData();
    }, []);

    const onSubmitClicked = (event) => {
        event.preventDefault();
        let classData = {
            "Class": {
                "Department": departmentID,
                "Semester": semester,
                "Section": section,
            }
        };
        if (isUpdate) classData._id = id;
        fetch(`http://localhost:4000/Class`, {
            // Adding method type
            method: (isUpdate ? "PUT" : "POST"),
            // Adding body or contents to send
            body: JSON.stringify(classData),
            // Adding headers to the request
            headers: { "Content-type": "application/json; charset=UTF-8" },
        }).then(res => {
            if (res.status == 200)
                navigate("/admin/collectionlist",
                    {
                        state: "Class",
                    });
            console.log(res.status, res.statusText);
        });
    }

    const handleDepartmentChange = (event) => setDepartmentID(event.target.value);

    return (
        <main className="pt-5">
            <div className="container">
                <Card>
                    <Card.Header className="fs-3">{isUpdate ? "Update" : "Add"} Class</Card.Header>
                    <Card.Body>
                        <Form onSubmit={onSubmitClicked}>
                            <Form.Group className="mb-3">
                                <Form.Label>Department Name:</Form.Label>
                                <Form.Select name="department" value={departmentID} onChange={handleDepartmentChange}>
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => {
                                        return <option key={dept._id} value={dept._id}>{dept["Department Name"]}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Semester: </Form.Label>
                                <Form.Control type="number" name="semester" id="semester" value={semester} placeholder={"Semester"} onChange={(event) => { setSemester(event.target.value) }} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Section: </Form.Label>
                                <Form.Control type="text" name="section" id="section" value={section} placeholder={"Section"} onChange={(event) => { setSection(event.target.value) }} required />
                            </Form.Group>
                            <Button variant="success" type="submit">Submit</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </main>
    )
}