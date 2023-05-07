import React, { useState } from 'react';
import { InfinitySpin } from 'react-loader-spinner';
import { Button, Card, Form } from 'react-bootstrap';
import { toast } from "react-toastify";
import serverRequest from '../helper/serverRequest';

export default function GenerateReportForm(props) {
    const defaultTargetValues = [50, 55, 60];
    const defaultMarksThreshold = 60;
    const subjectId = props.subjectId;
    const departmentId = props.departmentId;

    const [marksThreshold, setMarksThreshold] = useState(defaultMarksThreshold)
    const [generatingReport, setGeneratingReport] = useState(false);
    const [numbers, setNumbers] = useState(defaultTargetValues);
    const [subjectCode, setSubjectCode] = useState("");
    const [batch, setBatch] = useState(18);

    function toasts(message, type) {
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
    };

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
        let options = {
            batch: batch,
            targetValues: numbers.length ? numbers : defaultTargetValues,
            marksThreshold: marksThreshold ? parseInt(marksThreshold) : defaultMarksThreshold,
        };
        if (subjectId) {
            let subject = await ((await serverRequest("http://localhost:4000/Subject/" + subjectId)).json());
            setSubjectCode(subject["Subject Code"]);
            let response = await serverRequest("http://localhost:4000/reportGeneration/" + subjectId, "POST", options);
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

    const GenerateGapAnalysisReport = async () => {
        setGeneratingReport(true);
        let options = {
            department: departmentId,
            batch: batch,
            targetValues: numbers.length ? numbers : defaultTargetValues,
            marksThreshold: marksThreshold ? parseInt(marksThreshold) : defaultMarksThreshold,
        };
        console.log(options);
        try {
            let response = await serverRequest("http://localhost:4000/reportGeneration/gapAnalysis", "POST", options);
            // const blob = await response.blob();
            // const url = window.URL.createObjectURL(new Blob([blob]));
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', subject["Subject Code"] + ".xlsx");
            // document.body.appendChild(link);
            // link.click();
            console.log(response);
            toasts("Generated Report", toast.success)
        }
        catch(err){
            console.log(err);
            toasts(err.message, toast.error);
        }
        setGeneratingReport(false);
    }

    return (
        <Card className='mx-2'>
            <Card.Header>Generate Report</Card.Header>
            <Card.Body>
                {generatingReport
                    ? (<>
                        <div className='d-flex justify-content-center'>Generating Report...</div>
                        <div className='d-flex justify-content-center'><InfinitySpin color="#000" width='200' visible={true} /></div>
                    </>)
                    : <Form onSubmit={onGenerateReportClicked}>
                        <Form.Group>
                            <Form.Label>Batch:</Form.Label>
                            <Form.Control type="number" min={1} max={99} placeholder="Enter batch" onChange={(e) => setBatch(e.target.value)} value={batch} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Marks Threshold (Optional):</Form.Label>
                            <Form.Control type="number" min={1} max={99} placeholder="Enter minimum marks for CO attainment" onChange={(e) => setMarksThreshold(e.target.value)} value={marksThreshold} />
                        </Form.Group>
                        <Form.Group controlId="numberList">
                            <Form.Label>List of Target Levels (Optional):</Form.Label>
                            <Form.Control type="text" placeholder="Enter numbers separated by commas" onChange={handleInputChange} defaultValue={numbers.join(', ')} />
                            <Form.Text className="text-muted">Enter numbers between 1 and 100.</Form.Text>
                        </Form.Group>
                        <Button variant='info' type='submit' disabled={!subjectId || numbers.length === 0}>Generate Subject Attainment Report</Button>
                        <Button variant='warning' onClick={GenerateGapAnalysisReport} disabled={!departmentId || !batch}>Generate Department Gap Analysis Report</Button>
                    </Form>
                }
            </Card.Body>
        </Card>
    );
}
