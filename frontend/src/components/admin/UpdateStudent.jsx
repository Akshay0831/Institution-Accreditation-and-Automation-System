import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";

export default function UpdateStudent() {

    const { id } = useParams();
    const isUpdate = Boolean(id);

    const [departments, setDepartments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [originalClasses, setOriginalClasses] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [name, setName] = useState("");
    const [usn, setUsn] = useState("");
    const [departmentID, setDepartmentID] = useState("");
    const [classID, setClassID] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            // console.log((await (await fetch("http://localhost:4000/documents/Student")).json()).filter(doc => doc._id == "64256326539b7e514a91fe64" )[0]);
            if (isUpdate){
                const studentData =  (await (await fetch("http://localhost:4000/documents/Student")).json()).filter(doc => doc._id==id)[0];
                console.log(studentData);
                setName(studentData["Student Name"]);
                setUsn(studentData["USN"]);
                setDepartmentID("");
                setClassID("");
            }

            const departmentsData = await (await fetch("http://localhost:4000/documents/Department")).json();
            setDepartments(departmentsData);

            const classesData = await (await fetch("http://localhost:4000/documents/Class")).json();
            setClasses(classesData);
            setOriginalClasses(classesData);

            setDisabled(true);
        }
        fetchData();
    }, []);

    const onSubmitClicked = (event) => {
        console.log(name, usn, departmentID, classID);
        if (!disabled && classID.length != 0 && departmentID.length != 0) {
            event.preventDefault();
            const student = {
                "Student Name": name,
                USN: usn,
                "fk_Department": departmentID,
                "Class ID": classID
            }
            fetch(`http://localhost:4000/Student`, {
                // Adding method type
                method: (isUpdate ? "PUT" : "POST"),
                // Adding body or contents to send
                body: JSON.stringify(student),
                // Adding headers to the request
                headers: { "Content-type": "application/json; charset=UTF-8" },
            });
        } else {
            alert("Please fill all fields");
        }
    }

    const handleDepartmentChange = (event) => {
        setDisabled(false);
        setDepartmentID(event.target.value);
        setClasses(originalClasses.filter(obj => obj["fk_Department"] === event.target.value));
    }

    const handleClassChange = (event) => {
        const value = event.target.value;
        setClassID(value !== "null" ? value : "")
    }

    return (
        <main className="pt-5">
            <div className="container">
                <Card>
                    <Card.Header className="fs-3">{isUpdate? "Update": "Add"} Student</Card.Header>
                    <Card.Body>
                        <Form onSubmit={onSubmitClicked}>
                            <Form.Group className="mb-3">
                                <Form.Label>Student Name:</Form.Label>
                                <Form.Control type="text" name="name" id="name" value={name} placeholder={"Student Name"} required onChange={(event) => { setName(event.target.value) }} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Student USN:</Form.Label>
                                <Form.Control type="text" name="usn" className="form-control" id="usn" value={usn} placeholder={"USN"} required onChange={(event) => { setUsn(event.target.value) }} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Department: </Form.Label>
                                <Form.Select name="department" required onChange={handleDepartmentChange}>
                                    {disabled ? <option>Open this select menu</option> : null}
                                    {departments.map((department) => {
                                        return <option key={department["Department Name"]} value={department["Department Name"]}>{department["Department Name"]}</option>
                                    })}
                                </Form.Select>
                                <p>{departmentID}</p>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Class: </Form.Label>
                                <select
                                    name="class"
                                    className="form-select"
                                    required
                                    disabled={disabled}
                                    onChange={handleClassChange}>
                                    <option value={"null"}>Open this select menu</option>
                                    {classes.map((classObj) => {
                                        return <option key={classObj["_id"]} value={classObj["_id"]}>{classObj["Semester"] + classObj["Section"]}</option>
                                    })}
                                </select>
                                {disabled ? <p style={{ color: 'red' }}>Select department first</p> : null}
                            </Form.Group>
                            <Button variant="success" type="submit">Submit</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </main>
    )
}