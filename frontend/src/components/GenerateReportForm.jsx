import React, { useState } from 'react';
import { toast } from "react-toastify";
import { InfinitySpin } from 'react-loader-spinner'
import { Button, Card, Form } from 'react-bootstrap';

export default function GenerateReportForm(props) {

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

    // document.title = "Generate Report";
    // const department = props.departmentId;
    const defaultTargetValues = [50, 55, 60];
    const defaultMarksThreshold = 60;
    const subjectId = props.subjectId;

    const [marksThreshold, setMarksThreshold] = useState(defaultMarksThreshold)
    const [generatingReport, setGeneratingReport] = useState(false);
    const [numbers, setNumbers] = useState(defaultTargetValues);
    const [subjectCode, setSubjectCode] = useState("");

    const handleInputChange = (event) => {
        const { value } = event.target;
        const newNumbers = value.split(',')
            .map((number) => Number(number.trim()))
            .filter((number) => number >= 1 && number <= 100)
            .sort((a, b) => a - b);
        setNumbers(newNumbers);
    };

    const onGenerateReportClicked = async (event) => {
        event.preventDefault();
        setGeneratingReport(true);
        //modify below API to a POST API that sends the numbers data
        let options = {
            targetValues: numbers.length ? numbers : defaultTargetValues,
            marksThreshold: marksThreshold ? parseInt(marksThreshold) : defaultMarksThreshold,
        };
        if (subjectId) {
            let subject = await ((await fetch("http://localhost:4000/Subject/" + subjectId)).json());
            setSubjectCode(subject["Subject Code"]);
            let response = await fetch("http://localhost:4000/report_generation/" + subjectId, {
                // Adding method type
                method: "POST",
                // Adding body or contents to send
                body: JSON.stringify(options),
                // Adding headers to the request
                headers: { "Content-type": "application/json; charset=UTF-8" },
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', subject["Subject Code"] + ".xlsx");
            document.body.appendChild(link);
            link.click();
            setGeneratingReport(false);
        }
    }

    return (
        <Card className='mx-2'>
            <Card.Header>Generate Report</Card.Header>
            <Card.Body>
                {generatingReport
                    ? (<>
                        <div className='d-flex justify-content-center'>Generating Report for {subjectCode}...</div>
                        <div className='d-flex justify-content-center'><InfinitySpin color="#000" width='200' visible={true} /></div>
                    </>)
                    : <Form onSubmit={onGenerateReportClicked}>
                        <Form.Group>
                            <Form.Label>Marks Threshold (Optional):</Form.Label>
                            <Form.Control type="number" min={1} max={99} placeholder="Enter minimum marks for CO attainment" onChange={(e) => setMarksThreshold(e.target.value)} value={marksThreshold} />
                        </Form.Group>
                        <Form.Group controlId="numberList">
                            <Form.Label>List of Target Levels (Optional):</Form.Label>
                            <Form.Control type="text" placeholder="Enter numbers separated by commas" onChange={handleInputChange} defaultValue={numbers.join(', ')} />
                            <Form.Text className="text-muted">Enter numbers between 1 and 100.</Form.Text>
                        </Form.Group>
                        <Button type='submit' disabled={!subjectId && numbers.length === 0}>Generate Report</Button>
                    </Form>
                }
            </Card.Body>
        </Card>
    );
}
