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
    const subjectId = props.subjectId;
    const [generatingReport, setGeneratingReport] = useState(false);

    const onGenerateReportClicked = async (event) => {
        event.preventDefault();
        setGeneratingReport(true);
        if (subjectId) {
            let fileName = await (await fetch("http://localhost:4000/report_generation/" + subjectId)).text();
            setTimeout(() => {
                window.open("http://localhost:4000/" + fileName, '_blank');
                setGeneratingReport(false);
                toasts("Downloaded " + fileName + " successfully", toast.success);
            }, 10000)
        }
    }

    return (
        <Card className='mx-2'>
            <Card.Header>Generate Report</Card.Header>
            <Card.Body>
                {generatingReport
                    ? (<>
                        <div className='d-flex justify-content-center'>Generating Report for {subjectId}...</div>
                        <div className='d-flex justify-content-center'><InfinitySpin color="#000" width='200' visible={true} /></div>
                    </>)
                    : <Form>
                        <Button disabled={!subjectId} onClick={onGenerateReportClicked}>Generate Report</Button>
                    </Form>
                }
            </Card.Body>
        </Card>
    );
}
