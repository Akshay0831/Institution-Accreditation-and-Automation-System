import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Form, Button, Modal, ButtonGroup } from "react-bootstrap";

export default function UpdateSubject() {

    const navigate = useNavigate();
    const { id } = useParams();
    const isUpdate = Boolean(id);
    document.title = (isUpdate?"Update":"Add") + " Subject";

    const [departments, setDepartments] = useState([]);
    const [schemeCode, setSchemeCode] = useState("");
    const [subjectCode, setSubjectCode] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [testAssignmentRatio, setTestAssignmentRatio] = useState(3);
    const [maxMarks, setMaxMarks] = useState({ IA1: { CO1: 18, CO2: 12 }, A1: { CO1: 6, CO2: 4 }, IA2: { CO2: 6, CO3: 18, CO4: 6 }, A2: { CO2: 2, CO3: 6, CO4: 2 }, IA3: { CO4: 12, CO5: 18 }, A3: { CO4: 4, CO5: 6 }, SEE: 60 });
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

    const handleSEEChange = (col, event) => {
        let marks = {};
        marks[col] = parseInt(event.target.value);
        setMaxMarks(maxMarks => ({...maxMarks, ...marks}));
    }

    const handleCOChange = (col, CO, event) => {
        let marks = maxMarks;
        marks[col][CO] = parseInt(event.target.value);
        setMaxMarks(maxMarks => ({...maxMarks, ...marks}));
    }

    const onSubmitClicked = (event) => {
        event.preventDefault();
        let subject = {"Subject":{
            "Scheme Code": schemeCode,
            "Subject Code": subjectCode,
            "Subject Name": subjectName,
            "Test Assignment Ratio": testAssignmentRatio,
            "Max Marks": maxMarks,
            "Semester": semester,
            "Department": departmentId
        }};
        subject._id = id;

        fetch(`http://localhost:4000/Subject`, {
            // Adding method type
            method: (isUpdate ? "PUT" : "POST"),
            // Adding body or contents to send
            body: JSON.stringify(subject),
            // Adding headers to the request
            headers: { "Content-type": "application/json; charset=UTF-8" },
        }).then(res=>{
            if(res.status == 200)
                navigate("/admin/collectionlist",
                    {state: "Subject",
                });
            console.log(res.status, res.statusText);
        });
    }

    const [addModal, setAddModal] = useState("");
    const [addModalBuffer, setAddModalBuffer] = useState("");

    const handleClose = () => setAddModal("");

    return (
        <main className="pt-5">
            <div className="container">
                <Modal show={addModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Field</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Enter the field Name{addModal}
                    <input className="form-control" onChange={(event)=>setAddModalBuffer(event.target.value)}/>
                    </Modal.Body>
                    <Modal.Footer>
                    <ButtonGroup>
                    <Button variant="secondary" onClick={handleClose}>
                        <i className="fa fa-close"/>
                    </Button>
                    <Button variant="primary" onClick={()=>{if (addModal[1]) maxMarks[addModal[1]][addModalBuffer]=0; else maxMarks[addModalBuffer]={};handleClose()}}>
                        <i className="fa fa-plus"/>
                    </Button>
                    </ButtonGroup>
                    </Modal.Footer>
                </Modal>
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
                            <Form.Group className="m-0 p-0 border rounded bg-light">
                                <Form.Label className="p-1"> Max Marks:</Form.Label>
                                {
                                maxMarks
                                    ? Object.keys(maxMarks).map(test => {
                                        if (typeof maxMarks[test]==='object'){
                                            return <Card key={test} className="ps-2">{test}
                                                    <Card.Body className="row">
                                                        {Object.keys(maxMarks[test]).map(CO=>{
                                                            return <Form.Group key={CO} className="col"><Form.Label>{CO}</Form.Label><Form.Control type="number" placeholder={CO} value={maxMarks[test][CO]} min="0" onChange={handleCOChange.bind(this, test, CO)}/></Form.Group>
                                                        })}
                                                    </Card.Body>
                                                    <ButtonGroup className="col-2 mb-2">
                                                        <Button variant="outline-success" onClick={()=>setAddModal([true, test])} size="sm"><i className="fa fa-plus" /></Button>
                                                        <Button variant="outline-danger" onClick={(test)=>{delete maxMarks[test]}} size="sm"><i className="fa fa-trash" /></Button>
                                                    </ButtonGroup>
                                                </Card>
                                        }
                                        else return <Card key={test} className="p-3"> {test} <Form.Control type="number" placeholder={test} value={maxMarks[test]} min="0" onChange={handleSEEChange.bind(this, test)}/></Card>
                                    })
                                    : <>Max Marks not defined</>
                                }
                                <Button variant="outline-success" className="col-2 ms-2 mb-2" size="sm" onClick={()=>setAddModal(true)}><i className="fa fa-plus" /></Button>
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