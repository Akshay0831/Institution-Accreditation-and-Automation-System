import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";

export default function UpdateFeedback() {

    const navigate = useNavigate();
    const { id } = useParams();
    const isUpdate = Boolean(id);
    document.title = (isUpdate ? "Update" : "Add") + " Feedback";

    const [subjects, setSubjects] = useState([]);
    const [subjectID, setSubjectID] = useState("");
    const [COs, setCOs] = useState([]);
    const [feedback, setFeedback] = useState({ CO1: 0, CO2: 0, CO3: 0, CO4: 0, CO5: 0 });

    const getCOs = (maxMarks) => {
        let cos = [];
        for (let ia in maxMarks)
            if (typeof maxMarks[ia] == "object")
                for (let co in maxMarks[ia])
                    if (!cos.includes(co)) cos.push(co);
        return cos;
    }

    useEffect(() => {
        const fetchData = async () => {
            let subjectsData = await (await fetch("http://localhost:4000/documents/Subject")).json()
            setSubjects(subjectsData);

            if (isUpdate) {
                const marksData = (await (await fetch("http://localhost:4000/documents/Feedback")).json()).filter(doc => doc._id == id)[0];
                setFeedback(marksData["values"]);
                setSubjectID(marksData["Subject"]);
                setCOs(getCOs(subjectsData.find(doc => doc._id == marksData.Subject)["Max Marks"]));
            }

        }
        fetchData();
    }, []);

    const onSubmitClicked = (event) => {
        event.preventDefault();
        let feedbackDoc = {
            "Feedback": {
                "values": feedback,
                "Subject": subjectID,
            }
        }
        if (isUpdate) feedbackDoc._id = id;

        fetch(`http://localhost:4000/Feedback`, {
            // Adding method type
            method: (isUpdate ? "PUT" : "POST"),
            // Adding body or contents to send
            body: JSON.stringify(feedbackDoc),
            // Adding headers to the request
            headers: { "Content-type": "application/json; charset=UTF-8" },
        }).then(res => {
            if (res.status == 200)
                navigate("/admin/collectionlist",
                    { state: "Feedback", });
            console.log(res.status, res.statusText);
        });
    }

    return (
        <main className="pt-5">
            <div className="container">
                <Card>
                    <Card.Header className="fs-3">{isUpdate ? "Update" : "Add"} Feedback</Card.Header>
                    <Card.Body>
                        <Form onSubmit={onSubmitClicked}>
                            <Form.Group className="mb-3">
                                <Form.Label>Subject: </Form.Label>
                                <Form.Select name="subject" value={subjectID} onChange={(event) => { setSubjectID(event.target.value); setCOs(getCOs(subjects.find(doc => doc._id == event.target.value)["Max Marks"])); }} required>
                                    <option value="">Select Subject</option>
                                    {subjects.map((subj) => {
                                        return <option key={subj._id} value={subj._id}>{`${subj["Subject Name"]} (${subj["Subject Code"]})`}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="m-0 p-1 border rounded bg-light">
                                <Form.Label className="p-1"> Feedback Values:</Form.Label>
                                {COs
                                    ?
                                    COs.map(co => {
                                        return <Card key={co} className="gap-1">
                                            <Card.Body className="row p-1 m-1">
                                                <Form.Group key={co} className="col"><Form.Label>{co}</Form.Label><Form.Control type="number" placeholder={co} value={feedback[co]} min="0" max="100" onChange={()=>setFeedback({...feedback, [co]:parseInt(event.target.value)})} /></Form.Group>
                                            </Card.Body>
                                        </Card>
                                    })
                                    : <>Max Marks not defined</>
                                }
                            </Form.Group>
                            <Button variant="success" type="submit">Submit</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </main>
    )
}