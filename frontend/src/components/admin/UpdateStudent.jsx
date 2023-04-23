import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";

export default function UpdateStudent() {

    const navigate = useNavigate();
    const { id } = useParams();
    const isUpdate = Boolean(id);
    document.title = (isUpdate ? "Update" : "Add") + " Student";

    const [departments, setDepartments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [originalClasses, setOriginalClasses] = useState([]);
    const [name, setName] = useState("");
    const [usn, setUsn] = useState("");
    const [departmentID, setDepartmentID] = useState("");
    const [classID, setClassID] = useState("");

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

    useEffect(() => {
        const fetchData = async () => {
            const departmentsData = await (await fetch("http://localhost:4000/documents/Department")).json();
            setDepartments(departmentsData);

            const classesData = await (await fetch("http://localhost:4000/documents/Class")).json();
            setOriginalClasses(classesData);

            if (isUpdate) {
                const studentData = (await (await fetch("http://localhost:4000/documents/Student")).json()).filter(doc => doc._id == id)[0];
                console.log(studentData);
                setName(studentData["Student Name"]);
                setUsn(studentData["USN"]);
                setDepartmentID(studentData["Department"]);
                setClasses(classesData.filter(obj => obj["Department"] == studentData["Department"]))
                const classAllocData = (await (await fetch("http://localhost:4000/documents/Class Allocation")).json()).filter(doc => doc.Student == studentData._id)[0];
                setClassID(classAllocData["Class"]);
            }
        }
        fetchData();
    }, []);

    const onSubmitClicked = (event) => {
        if (classes && classID.length && departmentID.length) {
            event.preventDefault();
            const student = {
                "Student": {
                    "Student Name": name,
                    USN: usn,
                    "Department": departmentID
                },
                "Class": { _id: classID }
            };
            if (isUpdate) student.Student._id = id;
            fetch(`http://localhost:4000/Student`, {
                // Adding method type
                method: (isUpdate ? "PUT" : "POST"),
                // Adding body or contents to send
                body: JSON.stringify(student),
                // Adding headers to the request
                headers: { "Content-type": "application/json; charset=UTF-8" },
            }).then(res => {
                if (res.status == 200){
                    navigate("/admin/collectionlist", { state: "Student", });
                    toasts(`${(isUpdate?"Updated":"Added")} Student`, toast.success);
                }
                console.log(res.status, res.statusText);
            });
        } else {
            alert("Please fill all fields");
        }
    }

    const handleDepartmentChange = (event) => {
        setDepartmentID(event.target.value);
        setClasses(originalClasses.filter(obj => obj["Department"] == event.target.value));
    }

    return (
        <main className="pt-5">
            <div className="container">
                <Card>
                    <Card.Header className="fs-3">{isUpdate ? "Update" : "Add"} Student</Card.Header>
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
                                <Form.Select name="department" value={departmentID} required onChange={handleDepartmentChange}>
                                    <option value="">Open this select menu</option>
                                    {departments.map((dept) => {
                                        return <option key={dept._id} value={dept._id}>{dept["Department Name"]}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Class: </Form.Label>
                                <Form.Select name="class" required value={classID} disabled={!departmentID} onChange={(event) => setClassID(event.target.value)}>
                                    <option value="">Open this select menu</option>
                                    {classes.map((classObj) => {
                                        return <option key={classObj["_id"]} value={classObj["_id"]}>{classObj["Semester"] + classObj["Section"]}</option>
                                    })}
                                </Form.Select>
                                {!departmentID ? <p style={{ color: 'red' }}>Select department first</p> : null}
                            </Form.Group>
                            <Button variant="success" type="submit">Submit</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </main>
    )
}