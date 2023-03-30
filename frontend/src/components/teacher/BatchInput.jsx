import React, { Component } from "react";
import { Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import * as XLSX from 'xlsx';

export default class BatchInput extends Component {
    constructor(props) {
        super(props);
        this.serverURL = 'http://localhost:4000';
        this.subjectCode = props.subjectCode;
        this.state = { data: null, students: [] };
    }

    async componentDidMount() {
        console.log("Called APIs: " + this.serverURL + '/documents/Students');
        let students = await (await fetch(this.serverURL + '/documents/Student')).json();
        this.setState({ students: students, });
    }

    async addData() {
        let data = this.state.data;
        if (!data) return;
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 2,
            defval: "",
        });
        jsonData.map((entry) => {
            let marksGained = {};
            for (let key of Object.keys(entry)) {
                if (key.includes('/')) {
                    let splitKey = key.split('/');
                    if (!(splitKey[0] in marksGained))
                        marksGained[splitKey[0]] = {};
                    marksGained[splitKey[0]][splitKey[1]] = entry[key];
                }
                if (key.startsWith('SEE'))
                    marksGained[key] = entry[key];
            }

            let message = {};
            message['Marks Gained'] = marksGained;
            message['fk_USN'] = entry['USN'].trim()
            message['fk_Subject Code'] = this.subjectCode;
            // console.log(JSON.stringify(message));
            fetch(this.serverURL + "/documents/Marks/add", {
                method: "POST",
                body: JSON.stringify(message),
                headers: { "Content-type": "application/json; charset=UTF-8", },
            })
                .then(async (res) => {
                    if (res.status == 200) {
                        message['_id'] = await res.text()
                        console.log("Added ", message);
                    }
                    else throw res;
                })
                .catch(err => console.error(err.statusText));
        })
    }

    async uploadFile(event) {
        let file = event.target.files[0];
        const data = await file.arrayBuffer();
        this.setState({ data: data, });
    }

    render() {
        return (
            <Card>
                <Card.Body>
                    <Form className="row">
                        <Form.Label className="col">Upload XLSX File For Batch Input: </Form.Label>
                        <Form.Control size="sm" className="col" type="file" name="file" required onChange={this.uploadFile.bind(this)} placeholder="Enter File" />
                        <button type="button" className="btn btn-primary col-1 mh-1 mw-1" onClick={() => this.addData()}>
                            <i className="fas fa-upload"></i>
                        </button>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}
